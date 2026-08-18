"""
Accesco Living – Virtual Discovery
Brand Analytics Routes

Provides dashboards and reporting metrics for brand ad campaigns.
"""

from datetime import datetime, timezone, timedelta

from flask import Blueprint, jsonify
from pymongo.errors import PyMongoError

from app.extensions import logger, db
from app.auth import require_auth, require_brand

brand_analytics_bp = Blueprint("brand_analytics", __name__, url_prefix="/api/v1/brand/analytics")


@brand_analytics_bp.route("/overview", methods=["GET"])
@require_auth
@require_brand
def get_analytics_overview(user_id: str, brand_id: str, brand: dict, **kwargs):
    """
    GET /api/v1/brand/analytics/overview
    ──────────────────────────────────────
    Returns aggregated metrics across all campaigns for the brand.
    """
    try:
        pipeline = [
            {"$match": {"brand_id": brand_id}},
            {"$group": {
                "_id": None,
                "total_budget": {"$sum": "$budget_total_inr"},
                "total_spent": {"$sum": "$budget_spent_inr"},
                "total_impressions": {"$sum": "$total_impressions"},
                "total_views": {"$sum": "$total_views"},
                "total_clicks": {"$sum": "$total_clicks"},
            }}
        ]
        result = list(db["ad_campaigns"].aggregate(pipeline))

        if not result:
            summary = {
                "total_budget_inr": 0.0,
                "total_spent_inr": 0.0,
                "total_impressions": 0,
                "total_views": 0,
                "total_clicks": 0,
                "overall_ctr_pct": 0.0,
                "overall_vtr_pct": 0.0,
            }
        else:
            data = result[0]
            impressions = data.get("total_impressions", 0)
            views = data.get("total_views", 0)
            clicks = data.get("total_clicks", 0)
            
            ctr = (clicks / impressions * 100) if impressions > 0 else 0.0
            vtr = (views / impressions * 100) if impressions > 0 else 0.0

            summary = {
                "total_budget_inr": data.get("total_budget", 0.0),
                "total_spent_inr": data.get("total_spent", 0.0),
                "total_impressions": impressions,
                "total_views": views,
                "total_clicks": clicks,
                "overall_ctr_pct": round(ctr, 2),
                "overall_vtr_pct": round(vtr, 2),
            }

        return jsonify(summary), 200

    except PyMongoError as exc:
        logger.exception("Failed to aggregate brand analytics: %s", exc)
        return jsonify({"error": "Database error", "message": "Failed to generate analytics."}), 500


@brand_analytics_bp.route("/campaign/<campaign_id>/timeseries", methods=["GET"])
@require_auth
@require_brand
def get_campaign_timeseries(user_id: str, brand_id: str, brand: dict, campaign_id: str, **kwargs):
    """
    GET /api/v1/brand/analytics/campaign/<campaign_id>/timeseries
    ─────────────────────────────────────────────────────────────
    Returns daily impressions, views, and clicks for the last 7 days.
    """
    # Verify campaign belongs to brand
    campaign = db["ad_campaigns"].find_one({"campaign_id": campaign_id, "brand_id": brand_id})
    if not campaign:
        return jsonify({"error": "Not found", "message": "Campaign not found."}), 404

    now = datetime.now(timezone.utc)
    seven_days_ago = now - timedelta(days=7)

    try:
        pipeline = [
            {"$match": {
                "campaign_id": campaign_id,
                "created_at": {"$gte": seven_days_ago}
            }},
            {"$group": {
                "_id": {
                    "date": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}},
                    "type": "$event_type"
                },
                "count": {"$sum": 1}
            }}
        ]
        results = list(db["ad_impressions"].aggregate(pipeline))

        # Reformat into a daily timeseries map
        timeseries = {}
        for r in results:
            date_str = r["_id"]["date"]
            event_type = r["_id"]["type"]
            count = r["count"]

            if date_str not in timeseries:
                timeseries[date_str] = {"impressions": 0, "views": 0, "clicks": 0}

            if event_type == "impression":
                timeseries[date_str]["impressions"] += count
            elif event_type == "view":
                timeseries[date_str]["views"] += count
            elif event_type == "click":
                timeseries[date_str]["clicks"] += count

        # Fill in missing days with zeros
        for i in range(7):
            d = (now - timedelta(days=i)).strftime("%Y-%m-%d")
            if d not in timeseries:
                timeseries[d] = {"impressions": 0, "views": 0, "clicks": 0}

        sorted_timeseries = [{"date": k, **v} for k, v in sorted(timeseries.items())]

        return jsonify({
            "campaign_id": campaign_id,
            "timeseries": sorted_timeseries,
        }), 200

    except PyMongoError as exc:
        logger.exception("Failed to generate timeseries: %s", exc)
        return jsonify({"error": "Database error", "message": "Failed to generate timeseries."}), 500
