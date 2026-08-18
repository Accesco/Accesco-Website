"""Tests for the credits ledger — CQS multiplier, monthly cap, and balance."""

import pytest
import json
import time
from unittest.mock import patch, MagicMock

import jwt

from app.services.ledger import award_credits
from app.config import config


@patch("app.services.ledger.mongo_client")
@patch("app.services.ledger.db")
@patch("app.services.ledger.get_user_cqs_score")
def test_cqs_multiplier_applied(mock_get_score, mock_db, mock_client):
    """
    a) The correct CQS multiplier is applied to a base reward.
    """
    # Setup mock session/transaction context manager
    mock_session = MagicMock()
    mock_client.start_session.return_value.__enter__ = MagicMock(return_value=mock_session)
    mock_client.start_session.return_value.__exit__ = MagicMock(return_value=False)
    mock_session.start_transaction.return_value.__enter__ = MagicMock()
    mock_session.start_transaction.return_value.__exit__ = MagicMock(return_value=False)

    mock_get_score.return_value = 30  # Explorer -> 1.0x
    mock_ledger = MagicMock()
    mock_db.__getitem__.return_value = mock_ledger
    mock_ledger.aggregate.return_value = [{"total_earned": 0}]

    txn = award_credits("user_123", 100, "upload_reward", "ref_1")
    assert txn["amount"] == 100.0
    assert txn["cqs_multiplier_applied"] == 1.0

    mock_get_score.return_value = 90  # Discovery Partner -> 2.0x
    mock_ledger.aggregate.return_value = [{"total_earned": 0}]

    txn2 = award_credits("user_123", 100, "upload_reward", "ref_2")
    assert txn2["amount"] == 200.0
    assert txn2["cqs_multiplier_applied"] == 2.0


@patch("app.services.ledger.mongo_client")
@patch("app.services.ledger.db")
@patch("app.services.ledger.get_user_cqs_score")
def test_monthly_limit_cap(mock_get_score, mock_db, mock_client):
    """
    c) The system safely blocks/caps awards that would push a user
    over the Rs 2,000 monthly limit.
    """
    mock_session = MagicMock()
    mock_client.start_session.return_value.__enter__ = MagicMock(return_value=mock_session)
    mock_client.start_session.return_value.__exit__ = MagicMock(return_value=False)
    mock_session.start_transaction.return_value.__enter__ = MagicMock()
    mock_session.start_transaction.return_value.__exit__ = MagicMock(return_value=False)

    mock_get_score.return_value = 50  # Creator -> 1.2x
    mock_ledger = MagicMock()
    mock_db.__getitem__.return_value = mock_ledger

    # Simulate user has earned 1900 this month
    mock_ledger.aggregate.return_value = [{"total_earned": 1900.0}]

    # 100 * 1.2 = 120, capped at 100
    txn = award_credits("user_123", 100, "upload_reward", "ref_3")
    assert txn["amount"] == 100.0

    # Simulate user has earned 2000 this month
    mock_ledger.aggregate.return_value = [{"total_earned": 2000.0}]
    with pytest.raises(ValueError, match="maximum monthly earning cap"):
        award_credits("user_123", 100, "upload_reward", "ref_4")


@patch("app.routes.creator.db")
@patch("app.routes.creator.get_user_cqs_score")
def test_unexpired_balance_calculation(mock_get_score, mock_db, client):
    """
    b) The system correctly calculates the unexpired balance
    (ignoring credits older than 90 days).
    """
    import app.extensions as ext

    mock_get_score.return_value = 50
    mock_ledger = MagicMock()
    mock_db.__getitem__.return_value = mock_ledger

    # Mock aggregate to return balance
    mock_ledger.aggregate.return_value = [{"balance": 350.0}]
    mock_ledger.find.return_value.sort.return_value.limit.return_value = []

    secret = config.JWT_SECRET_KEY or "change-me-to-a-long-random-jwt-secret"
    token = jwt.encode(
        {"sub": "user_123", "exp": int(time.time()) + 3600},
        secret,
        algorithm=config.JWT_ALGORITHM,
    )

    resp = client.get(
        "/api/v1/creator/wallet",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert resp.status_code == 200
    data = json.loads(resp.data)
    assert data["balance"] == 350.0

    # Verify aggregate was called correctly to filter unexpired
    mock_ledger.aggregate.assert_called_once()
    pipeline = mock_ledger.aggregate.call_args[0][0]
    match_stage = pipeline[0]["$match"]
    assert "expires_at" in match_stage
    assert "$gt" in match_stage["expires_at"]
