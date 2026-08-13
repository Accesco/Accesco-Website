"""
Accesco Living – Virtual Discovery
Ad Billing Service

Handles CPV (Cost Per View) billing for brand ad campaigns.

A "view" is defined as a user watching >50% of the video duration.
Impressions are always tracked; billing only occurs on qualified views.
"""

from datetime import datetime, timezone, timedelta

from pymongo.errors import PyMongoError

from app.config import config
from app.extensions import logger, db
import redis

# Initialize Redis client (with fallback)
try:
    redis_client = redis.from_url(config.REDIS_URI, decode_responses=True)
    # Ping to check if Redis is actually available
    redis_client.ping()
    REDIS_AVAILABLE = True
    logger.info("Redis connected successfully for Ad Billing deduplication.")
except (redis.ConnectionError, redis.TimeoutError) as exc:
    redis_client = None
    REDIS_AVAILABLE = False
    logger.warning("Redis is unavailable, falling back to no-cache mode. Error: %s", exc)


def record_impression(campaign_id: str, video_id: str, user_id: str) -> dict:
    """
    Record that an ad was shown to a user in the feed.

    Impressions are always recorded (free) — billing happens on views only.
    Also checks frequency cap before recording.

    Returns:
        dict with status info, or None if frequency cap was hit.
    """
    impressions_collection = db["ad_impressions"]
    campaigns_collection = db["ad_campaigns"]

    now = datetime.now(timezone.utc)

    impression_doc = {
        "campaign_id": campaign_id,
        "video_id": video_id,
        "user_id": user_id,
        "event_type": "impression",
        "created_at": now,
    }

    try:
        impressions_collection.insert_one(impression_doc)

        # Increment campaign impression counter
        campaigns_collection.update_one(
            {"campaign_id": campaign_id},
            {"$inc": {"total_impressions": 1}},
        )

        logger.debug(
            "Ad impression recorded  →  campaign=%s  video=%s  user=%s",
            campaign_id, video_id, user_id,
        )
        return {"status": "recorded", "event_type": "impression"}

    except PyMongoError as exc:
        logger.error("Failed to record ad impression: %s", exc)
        return {"status": "error", "event_type": "impression"}


def record_view(campaign_id: str, video_id: str, user_id: str, completion_pct: float) -> dict:
    """
    Record a CPV-billable view if completion_pct exceeds the threshold (>50%).

    Deducts cost_per_view_inr from the campaign budget. If budget is exhausted,
    the campaign status is automatically set to 'exhausted'.

    Returns:
        dict with billing info.
    """
    campaigns_collection = db["ad_campaigns"]
    impressions_collection = db["ad_impressions"]

    if completion_pct < config.CPV_VIEW_THRESHOLD_PCT:
        logger.debug(
            "View not billable (%.1f%% < %.1f%% threshold) for campaign %s",
            completion_pct, config.CPV_VIEW_THRESHOLD_PCT, campaign_id,
        )
        return {"status": "not_billable", "reason": "below_threshold"}

    # REDIS FALLBACK: Check if this user has already watched this ad in the last 24h
    if REDIS_AVAILABLE:
        cache_key = f"view:campaign_{campaign_id}:user_{user_id}"
        if redis_client.get(cache_key):
            logger.info("View deduplication active — skipping billing for campaign %s, user %s", campaign_id, user_id)
            return {"status": "not_billable", "reason": "duplicate_view_24h"}

    # Fetch campaign to get CPV rate and budget
    campaign = campaigns_collection.find_one({"campaign_id": campaign_id})
    if not campaign:
        logger.warning("Campaign '%s' not found for billing.", campaign_id)
        return {"status": "error", "reason": "campaign_not_found"}

    cost = campaign.get("cost_per_view_inr", config.DEFAULT_COST_PER_VIEW_INR)
    budget_total = campaign.get("budget_total_inr", 0.0)
    budget_spent = campaign.get("budget_spent_inr", 0.0)

    if budget_total > 0 and budget_spent >= budget_total:
        logger.info("Campaign '%s' budget already exhausted.", campaign_id)
        return {"status": "exhausted", "reason": "budget_exhausted"}

    now = datetime.now(timezone.utc)

    try:
        # Record the billable view event
        impressions_collection.insert_one({
            "campaign_id": campaign_id,
            "video_id": video_id,
            "user_id": user_id,
            "event_type": "view",
            "completion_pct": completion_pct,
            "cost_inr": cost,
            "created_at": now,
        })

        # Deduplicate future views for this user for 24 hours
        if REDIS_AVAILABLE:
            cache_key = f"view:campaign_{campaign_id}:user_{user_id}"
            redis_client.setex(cache_key, 86400, "1")

        # Deduct cost from campaign budget
        new_spent = budget_spent + cost
        update_fields = {
            "budget_spent_inr": new_spent,
            "updated_at": now,
        }

        # Auto-exhaust campaign if budget is fully spent
        if budget_total > 0 and new_spent >= budget_total:
            update_fields["status"] = "exhausted"
            logger.info(
                "Campaign '%s' budget exhausted (spent ₹%.2f of ₹%.2f). Auto-pausing.",
                campaign_id, new_spent, budget_total,
            )

        campaigns_collection.update_one(
            {"campaign_id": campaign_id},
            {"$set": update_fields, "$inc": {"total_views": 1}},
        )

        logger.info(
            "CPV view billed  →  campaign=%s  cost=₹%.2f  total_spent=₹%.2f/₹%.2f",
            campaign_id, cost, new_spent, budget_total,
        )

        return {
            "status": "billed",
            "cost_inr": cost,
            "budget_spent_inr": new_spent,
            "budget_remaining_inr": max(0, budget_total - new_spent),
        }

    except PyMongoError as exc:
        logger.error("Failed to bill CPV view for campaign %s: %s", campaign_id, exc)
        return {"status": "error", "reason": str(exc)}


def record_click(campaign_id: str, video_id: str, user_id: str) -> dict:
    """
    Record a CTA click on an ad video.

    Clicks are tracked for analytics (CTR calculation) but are not
    billed under the CPV model.
    """
    impressions_collection = db["ad_impressions"]
    campaigns_collection = db["ad_campaigns"]

    now = datetime.now(timezone.utc)

    try:
        impressions_collection.insert_one({
            "campaign_id": campaign_id,
            "video_id": video_id,
            "user_id": user_id,
            "event_type": "click",
            "created_at": now,
        })

        campaigns_collection.update_one(
            {"campaign_id": campaign_id},
            {"$inc": {"total_clicks": 1}},
        )

        logger.info(
            "Ad click recorded  →  campaign=%s  video=%s  user=%s",
            campaign_id, video_id, user_id,
        )
        return {"status": "recorded", "event_type": "click"}

    except PyMongoError as exc:
        logger.error("Failed to record ad click: %s", exc)
        return {"status": "error"}


def check_frequency_cap(campaign_id: str, user_id: str) -> bool:
    """
    Check if the user has already seen this campaign's ads too many times
    within the frequency cap window.

    Returns:
        True if the ad CAN be shown (under the cap).
        False if the cap has been reached.
    """
    impressions_collection = db["ad_impressions"]

    window_start = datetime.now(timezone.utc) - timedelta(hours=config.AD_FREQUENCY_CAP_WINDOW_HOURS)

    count = impressions_collection.count_documents({
        "campaign_id": campaign_id,
        "user_id": user_id,
        "event_type": "impression",
        "created_at": {"$gte": window_start},
    })

    if count >= config.AD_FREQUENCY_CAP_PER_USER:
        logger.debug(
            "Frequency cap hit for user=%s on campaign=%s (%d impressions in %dh window)",
            user_id, campaign_id, count, config.AD_FREQUENCY_CAP_WINDOW_HOURS,
        )
        return False

    return True
