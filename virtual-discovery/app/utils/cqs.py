"""
Creator Quality Score (CQS) Utility

Determines a user's CQS band and credit multiplier based on their score.

NOTE: get_user_cqs_score() currently returns a fixed score of 50 (the
"Creator" band). This is a Phase 1 placeholder — the real implementation
should query the user's aggregate engagement metrics from MongoDB.
"""

import logging

logger = logging.getLogger(__name__)


def get_cqs_details(score: int) -> tuple[str, float]:
    """
    Calculate a user's Creator Quality Score (CQS) band and credit
    multiplier based on the spec rules:

    - Explorer         (0-40,   1.0x)
    - Creator          (41-65,  1.2x)
    - Verified Creator (66-82,  1.5x)
    - Discovery Partner(83-100, 2.0x)
    """
    if score <= 40:
        return "Explorer", 1.0
    elif score <= 65:
        return "Creator", 1.2
    elif score <= 82:
        return "Verified Creator", 1.5
    else:
        return "Discovery Partner", 2.0


def get_user_cqs_score(user_id: str) -> int:
    """
    Fetch a user's CQS score.

    WARNING: This is a Phase 1 placeholder that returns a fixed score of 50
    for all users ("Creator" band, 1.2x multiplier).

    Phase 2 implementation should:
    1. Query the discovery_events collection for the user's engagement metrics
    2. Calculate a weighted score based on upload frequency, approval rate,
       likes/views ratio, and account age
    3. Cache the result with a TTL to avoid re-computing on every request
    """
    logger.debug(
        "CQS placeholder: returning fixed score 50 for user_id=%s", user_id
    )
    return 50
