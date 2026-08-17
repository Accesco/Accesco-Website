"""
Accesco Living – Virtual Discovery
Campaign Management Routes

CRUD endpoints for brand ad campaigns. Brands create campaigns
with a budget, date range, and targeting parameters. Campaign
budgets are managed offline for MVP (admin sets budget_total_inr
in MongoDB after contract signing).
"""

import uuid
from datetime import datetime, timezone

import bleach
from flask import Blueprint, request, jsonify
from pymongo.errors import PyMongoError

from app.config import config
from app.extensions import logger, db
from app.auth import require_auth, require_brand, require_admin

campaign_bp = Blueprint("campaign", __name__, url_prefix="/api/v1/brand/campaigns")


# ------------------------------------------------------------------
# Create Campaign
# ------------------------------------------------------------------
@campaign_bp.route("", methods=["POST"])
@require_auth
@require_brand
def create_campaign(user_id: str, brand_id: str, brand: dict, **kwargs):
    """
    POST /api/v1/brand/campaigns
    ─────────────────────────────
    Creates a new ad campaign for the brand.

    Payload:
        {
            "name":             "Summer Mango Launch",
            "target_tags":      ["fruits", "organic"],
            "target_ventures":  ["bangalore", "mumbai"],
            "start_date":       "2026-08-01",
            "end_date":         "2026-08-31",
            "cost_per_view_inr": 0.50   (optional, defaults to config)
        }

    Note: budget_total_inr is set offline by admin after contract signing.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid payload", "message": "Request body must be valid JSON."}), 400

    # Validate required fields
    required_fields = ("name", "start_date", "end_date")
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return (
            jsonify({
                "error": "Missing required fields",
                "missing": missing,
                "message": f"The following fields are required: {', '.join(missing)}",
            }),
            400,
        )

    name = bleach.clean(str(data["name"]).strip())

    # Parse dates
    try:
        start_date = datetime.fromisoformat(data["start_date"]).replace(tzinfo=timezone.utc)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid date", "message": "start_date must be ISO format (YYYY-MM-DD)."}), 400

    try:
        end_date = datetime.fromisoformat(data["end_date"]).replace(tzinfo=timezone.utc)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid date", "message": "end_date must be ISO format (YYYY-MM-DD)."}), 400

    if end_date <= start_date:
        return jsonify({"error": "Invalid date range", "message": "end_date must be after start_date."}), 400

    # Parse targeting
    target_tags = data.get("target_tags", [])
    if isinstance(target_tags, str):
        target_tags = [t.strip() for t in target_tags.split(",") if t.strip()]
    target_tags = [bleach.clean(t) for t in target_tags]

    target_ventures = data.get("target_ventures", [])
    if isinstance(target_ventures, str):
        target_ventures = [v.strip() for v in target_ventures.split(",") if v.strip()]
    target_ventures = [bleach.clean(v) for v in target_ventures]

    # CPV rate
    try:
        cost_per_view = float(data.get("cost_per_view_inr", config.DEFAULT_COST_PER_VIEW_INR))
        if cost_per_view <= 0:
            raise ValueError("Must be positive")
    except (ValueError, TypeError):
        cost_per_view = config.DEFAULT_COST_PER_VIEW_INR

    now = datetime.now(timezone.utc)
    campaign_id = f"camp_{uuid.uuid4().hex[:12]}"

    campaign_document = {
        "campaign_id": campaign_id,
        "brand_id": brand_id,
        "name": name,
        "status": "scheduled",                      # Starts as scheduled until start_date
        "budget_total_inr": 0.0,                     # Set offline by admin
        "budget_spent_inr": 0.0,
        "cost_per_view_inr": cost_per_view,
        "target_tags": target_tags,
        "target_ventures": target_ventures,
        "start_date": start_date,
        "end_date": end_date,
        "video_ids": [],
        "total_impressions": 0,
        "total_views": 0,                            # CPV billable views (watched >50%)
        "total_clicks": 0,
        "created_at": now,
        "updated_at": now,
    }

    try:
        result = db["ad_campaigns"].insert_one(campaign_document)
        logger.info(
            "Campaign created  →  campaign_id=%s  brand=%s  name='%s'",
            campaign_id, brand_id, name,
        )
    except PyMongoError as exc:
        logger.exception("Campaign creation failed: %s", exc)
        return jsonify({"error": "Database error", "message": "Failed to create campaign."}), 500

    return (
        jsonify({
            "campaign_id": campaign_id,
            "name": name,
            "status": "scheduled",
            "budget_total_inr": 0.0,
            "message": (
                "Campaign created. Contact Accesco admin to assign a budget "
                "(budget_total_inr) before the campaign can serve ads."
            ),
        }),
        201,
    )


# ------------------------------------------------------------------
# List Campaigns
# ------------------------------------------------------------------
@campaign_bp.route("", methods=["GET"])
@require_auth
@require_brand
def list_campaigns(user_id: str, brand_id: str, brand: dict, **kwargs):
    """
    GET /api/v1/brand/campaigns
    ───────────────────────────
    Returns all campaigns for the authenticated brand.
    """
    try:
        campaigns = list(
            db["ad_campaigns"]
            .find({"brand_id": brand_id})
            .sort("created_at", -1)
        )
    except PyMongoError as exc:
        logger.exception("Failed to list campaigns: %s", exc)
        return jsonify({"error": "Database error", "message": "Failed to retrieve campaigns."}), 500

    result = []
    for c in campaigns:
        result.append({
            "campaign_id": c.get("campaign_id", ""),
            "name": c.get("name", ""),
            "status": c.get("status", ""),
            "budget_total_inr": c.get("budget_total_inr", 0.0),
            "budget_spent_inr": c.get("budget_spent_inr", 0.0),
            "cost_per_view_inr": c.get("cost_per_view_inr", 0.0),
            "target_tags": c.get("target_tags", []),
            "target_ventures": c.get("target_ventures", []),
            "start_date": c.get("start_date", "").isoformat() if hasattr(c.get("start_date", ""), "isoformat") else "",
            "end_date": c.get("end_date", "").isoformat() if hasattr(c.get("end_date", ""), "isoformat") else "",
            "video_ids": c.get("video_ids", []),
            "total_impressions": c.get("total_impressions", 0),
            "total_views": c.get("total_views", 0),
            "total_clicks": c.get("total_clicks", 0),
            "created_at": c.get("created_at", "").isoformat() if hasattr(c.get("created_at", ""), "isoformat") else "",
        })

    return jsonify({"campaigns": result, "total": len(result)}), 200


# ------------------------------------------------------------------
# Get Campaign Details
# ------------------------------------------------------------------
@campaign_bp.route("/<campaign_id>", methods=["GET"])
@require_auth
@require_brand
def get_campaign(user_id: str, brand_id: str, brand: dict, campaign_id: str, **kwargs):
    """
    GET /api/v1/brand/campaigns/<campaign_id>
    ──────────────────────────────────────────
    Returns detailed campaign info including analytics.
    """
    campaign = db["ad_campaigns"].find_one({
        "campaign_id": campaign_id,
        "brand_id": brand_id,
    })
    if not campaign:
        return jsonify({"error": "Not found", "message": f"Campaign '{campaign_id}' not found."}), 404

    # Calculate CTR
    total_impressions = campaign.get("total_impressions", 0)
    total_clicks = campaign.get("total_clicks", 0)
    ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0.0

    # Calculate VTR (View-Through Rate)
    total_views = campaign.get("total_views", 0)
    vtr = (total_views / total_impressions * 100) if total_impressions > 0 else 0.0

    result = {
        "campaign_id": campaign.get("campaign_id", ""),
        "name": campaign.get("name", ""),
        "status": campaign.get("status", ""),
        "budget_total_inr": campaign.get("budget_total_inr", 0.0),
        "budget_spent_inr": campaign.get("budget_spent_inr", 0.0),
        "budget_remaining_inr": max(0, campaign.get("budget_total_inr", 0) - campaign.get("budget_spent_inr", 0)),
        "cost_per_view_inr": campaign.get("cost_per_view_inr", 0.0),
        "target_tags": campaign.get("target_tags", []),
        "target_ventures": campaign.get("target_ventures", []),
        "start_date": campaign.get("start_date", "").isoformat() if hasattr(campaign.get("start_date", ""), "isoformat") else "",
        "end_date": campaign.get("end_date", "").isoformat() if hasattr(campaign.get("end_date", ""), "isoformat") else "",
        "video_ids": campaign.get("video_ids", []),
        "analytics": {
            "total_impressions": total_impressions,
            "total_views": total_views,
            "total_clicks": total_clicks,
            "ctr_pct": round(ctr, 2),
            "vtr_pct": round(vtr, 2),
        },
    }

    return jsonify(result), 200


# ------------------------------------------------------------------
# Pause Campaign
# ------------------------------------------------------------------
@campaign_bp.route("/<campaign_id>/pause", methods=["POST"])
@require_auth
@require_brand
def pause_campaign(user_id: str, brand_id: str, brand: dict, campaign_id: str, **kwargs):
    """
    POST /api/v1/brand/campaigns/<campaign_id>/pause
    ─────────────────────────────────────────────────
    Pauses an active campaign — ads stop appearing in the feed.
    """
    result = db["ad_campaigns"].find_one_and_update(
        {"campaign_id": campaign_id, "brand_id": brand_id, "status": "active"},
        {"$set": {"status": "paused", "updated_at": datetime.now(timezone.utc)}},
    )
    if not result:
        return jsonify({"error": "Not found", "message": f"No active campaign '{campaign_id}' found to pause."}), 404

    logger.info("Campaign paused  →  campaign_id=%s", campaign_id)
    return jsonify({"campaign_id": campaign_id, "status": "paused"}), 200


# ------------------------------------------------------------------
# Resume Campaign
# ------------------------------------------------------------------
@campaign_bp.route("/<campaign_id>/resume", methods=["POST"])
@require_auth
@require_brand
def resume_campaign(user_id: str, brand_id: str, brand: dict, campaign_id: str, **kwargs):
    """
    POST /api/v1/brand/campaigns/<campaign_id>/resume
    ──────────────────────────────────────────────────
    Resumes a paused campaign.
    """
    campaign = db["ad_campaigns"].find_one({
        "campaign_id": campaign_id,
        "brand_id": brand_id,
        "status": "paused",
    })
    if not campaign:
        return jsonify({"error": "Not found", "message": f"No paused campaign '{campaign_id}' found."}), 404

    # Check budget is not exhausted
    if campaign.get("budget_spent_inr", 0) >= campaign.get("budget_total_inr", 0) and campaign.get("budget_total_inr", 0) > 0:
        return (
            jsonify({
                "error": "Budget exhausted",
                "message": "Cannot resume — campaign budget is fully spent.",
            }),
            400,
        )

    db["ad_campaigns"].update_one(
        {"campaign_id": campaign_id},
        {"$set": {"status": "active", "updated_at": datetime.now(timezone.utc)}},
    )

    logger.info("Campaign resumed  →  campaign_id=%s", campaign_id)
    return jsonify({"campaign_id": campaign_id, "status": "active"}), 200


# ------------------------------------------------------------------
# Admin: Set Campaign Budget (Offline billing MVP)
# ------------------------------------------------------------------
@campaign_bp.route("/<campaign_id>/set-budget", methods=["POST"])
@require_admin
def set_campaign_budget(campaign_id: str):
    """
    POST /api/v1/brand/campaigns/<campaign_id>/set-budget
    ─────────────────────────────────────────────────────
    Admin-only. Sets the campaign budget after offline payment.

    Payload: { "budget_total_inr": 10000.0 }
    """
    data = request.get_json(silent=True)
    if not data or "budget_total_inr" not in data:
        return jsonify({"error": "Missing field", "message": "'budget_total_inr' is required."}), 400

    try:
        budget = float(data["budget_total_inr"])
        if budget < config.MIN_AD_BUDGET_INR:
            return (
                jsonify({
                    "error": "Budget too low",
                    "message": f"Minimum budget is ₹{config.MIN_AD_BUDGET_INR:.0f}.",
                }),
                400,
            )
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid value", "message": "budget_total_inr must be a number."}), 400

    result = db["ad_campaigns"].find_one_and_update(
        {"campaign_id": campaign_id},
        {"$set": {
            "budget_total_inr": budget,
            "status": "active",
            "updated_at": datetime.now(timezone.utc),
        }},
    )
    if not result:
        return jsonify({"error": "Not found", "message": f"Campaign '{campaign_id}' not found."}), 404

    logger.info("Campaign budget set  →  campaign_id=%s  budget=₹%.2f", campaign_id, budget)
    return (
        jsonify({
            "campaign_id": campaign_id,
            "budget_total_inr": budget,
            "status": "active",
            "message": "Budget assigned and campaign activated.",
        }),
        200,
    )


# ------------------------------------------------------------------
# Admin: Approve Brand Video (Admin Audit Queue)
# ------------------------------------------------------------------
@campaign_bp.route("/admin/approve-video", methods=["POST"])
@require_admin
def admin_approve_video():
    """
    POST /api/v1/brand/campaigns/admin/approve-video
    ─────────────────────────────────────────────────
    Admin-only. Approves a brand video after human review.

    Payload: { "upload_id": "..." }
    """
    data = request.get_json(silent=True)
    if not data or "upload_id" not in data:
        return jsonify({"error": "Missing field", "message": "'upload_id' is required."}), 400

    upload_id = bleach.clean(str(data["upload_id"]).strip())

    result = videos_collection.find_one_and_update(
        {
            "upload_id": upload_id,
            "content_type": "sponsored",
            "admin_status": "pending_review",
        },
        {"$set": {
            "admin_status": "approved",
            "updated_at": datetime.now(timezone.utc),
        }},
    )

    if not result:
        return (
            jsonify({
                "error": "Not found",
                "message": f"No pending brand video found with upload_id '{upload_id}'.",
            }),
            404,
        )

    logger.info("Admin approved brand video  →  upload_id=%s", upload_id)
    return jsonify({"upload_id": upload_id, "admin_status": "approved"}), 200


# ------------------------------------------------------------------
# Admin: Reject Brand Video
# ------------------------------------------------------------------
@campaign_bp.route("/admin/reject-video", methods=["POST"])
@require_admin
def admin_reject_video():
    """
    POST /api/v1/brand/campaigns/admin/reject-video
    ────────────────────────────────────────────────
    Admin-only. Rejects a brand video with a reason.

    Payload: { "upload_id": "...", "reason": "CTA link is fraudulent" }
    """
    data = request.get_json(silent=True)
    if not data or "upload_id" not in data:
        return jsonify({"error": "Missing field", "message": "'upload_id' is required."}), 400

    upload_id = bleach.clean(str(data["upload_id"]).strip())
    reason = bleach.clean(str(data.get("reason", "Rejected by admin")).strip())

    result = videos_collection.find_one_and_update(
        {
            "upload_id": upload_id,
            "content_type": "sponsored",
        },
        {"$set": {
            "admin_status": "rejected",
            "admin_reject_reason": reason,
            "updated_at": datetime.now(timezone.utc),
        }},
    )

    if not result:
        return jsonify({"error": "Not found", "message": f"No brand video found with upload_id '{upload_id}'."}), 404

    logger.info("Admin rejected brand video  →  upload_id=%s  reason='%s'", upload_id, reason)
    return jsonify({"upload_id": upload_id, "admin_status": "rejected", "reason": reason}), 200
