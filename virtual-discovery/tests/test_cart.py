"""Tests for the swipe-to-cart API endpoint."""

import pytest
from unittest.mock import patch, MagicMock


@patch("app.routes.cart.mongo_client")
@patch("app.routes.cart.db")
def test_add_to_cart_success(mock_db, mock_mongo_client, client, auth_headers):
    """Test a successful add-to-cart action (inventory reserved via transaction)."""
    # ── Mock the products and lifecart collections ──
    mock_products = MagicMock()
    mock_lifecart = MagicMock()

    def mock_db_getitem(key):
        if key == "products":
            return mock_products
        elif key == "lifecart":
            return mock_lifecart
        return MagicMock()

    mock_db.__getitem__.side_effect = mock_db_getitem

    # Successful inventory reservation: modified_count = 1
    mock_products.update_one.return_value = MagicMock(modified_count=1)

    # ── Mock the MongoDB session + transaction context managers ──
    mock_session = MagicMock()
    mock_mongo_client.start_session.return_value.__enter__ = MagicMock(return_value=mock_session)
    mock_mongo_client.start_session.return_value.__exit__ = MagicMock(return_value=False)
    mock_session.start_transaction.return_value.__enter__ = MagicMock(return_value=None)
    mock_session.start_transaction.return_value.__exit__ = MagicMock(return_value=False)

    response = client.post(
        "/api/v1/cart/add",
        json={"sku_id": "SKU-123", "quantity": 2},
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "success"
    assert "Added 2 of SKU-123 to cart" in data["message"]

    # Verify atomic inventory reservation (update_one with $gte check)
    mock_products.update_one.assert_called_once()
    call_args = mock_products.update_one.call_args
    assert call_args[0][0] == {"sku_id": "SKU-123", "units_available": {"$gte": 2}}
    assert call_args[0][1] == {"$inc": {"units_available": -2}}

    # Verify lifecart update ($inc with upsert)
    mock_lifecart.update_one.assert_called_once()


@patch("app.routes.cart.mongo_client")
@patch("app.routes.cart.db")
def test_add_to_cart_out_of_stock(mock_db, mock_mongo_client, client, auth_headers):
    """Test an out-of-stock edge case (insufficient inventory)."""
    mock_products = MagicMock()

    def mock_db_getitem(key):
        if key == "products":
            return mock_products
        return MagicMock()

    mock_db.__getitem__.side_effect = mock_db_getitem

    # Inventory reservation FAILS: modified_count = 0 (not enough stock)
    mock_products.update_one.return_value = MagicMock(modified_count=0)

    # find_one returns the product with low inventory (for the error message)
    mock_products.find_one.return_value = {
        "sku_id": "SKU-456",
        "units_available": 1,  # Only 1 available
    }

    # ── Mock the MongoDB session + transaction context managers ──
    mock_session = MagicMock()
    mock_mongo_client.start_session.return_value.__enter__ = MagicMock(return_value=mock_session)
    mock_mongo_client.start_session.return_value.__exit__ = MagicMock(return_value=False)
    mock_session.start_transaction.return_value.__enter__ = MagicMock(return_value=None)
    mock_session.start_transaction.return_value.__exit__ = MagicMock(return_value=False)

    # Requesting 2 units when only 1 is available
    response = client.post(
        "/api/v1/cart/add",
        json={"sku_id": "SKU-456", "quantity": 2},
        headers=auth_headers
    )

    assert response.status_code == 400
    data = response.get_json()
    assert data["error"] == "Out of Stock"
    assert "Insufficient inventory" in data["message"]


def test_add_to_cart_unauthorized(client):
    """Test an unauthorized request (missing JWT token)."""
    response = client.post(
        "/api/v1/cart/add",
        json={"sku_id": "SKU-789", "quantity": 1}
    )

    assert response.status_code == 401
    data = response.get_json()
    assert data["error"] == "Unauthorized"
