"""
Accesco Living – Virtual Discovery
Brand Management Routes

Admin-managed brand registration and brand profile endpoints.
Brands are invite-only during MVP — registration requires the
X-Admin-Key header.
"""

from datetime import datetime, timezone

import bleach
from flask import Blueprint, request, jsonify
from pymongo.errors import PyMongoError, DuplicateKeyError

from app.config import config
from app.extensions import logger, db
from app.auth import require_auth, require_admin, require_brand

brand_bp = Blueprint("brand", __name__, url_prefix="/api/v1/brand")


# ------------------------------------------------------------------
# Brand Registration (Admin-Only)
# ------------------------------------------------------------------
@brand_bp.route("/register", methods=["POST"])
@require_admin
def register_brand():
    """
    POST /api/v1/brand/register
    ───────────────────────────
    Admin-only endpoint. Registers a new brand partner account.
    Requires X-Admin-Key header.

    Payload:
        {
            "user_id":       "uid_of_brand_user",
            "company_name":  "Mango Co.",
            "logo_url":      "https://...",
            "gstin":         "29ABCDE1234F1Z5",
            "category":      "food_and_beverage",
            "contact_email": "ads@mangoco.com"
        }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid payload", "message": "Request body must be valid JSON."}), 400

    # Validate required fields
    required_fields = ("user_id", "company_name", "category", "contact_email")
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

    user_id = bleach.clean(str(data["user_id"]).strip())
    company_name = bleach.clean(str(data["company_name"]).strip())
    category = bleach.clean(str(data["category"]).strip())
    contact_email = bleach.clean(str(data["contact_email"]).strip())
    logo_url = bleach.clean(str(data.get("logo_url", "")).strip())
    gstin = bleach.clean(str(data.get("gstin", "")).strip())

    # Validate category
    valid_categories = {
        "food_and_beverage", "health_and_wellness", "fashion",
        "electronics", "home_and_living", "beauty", "sports",
        "education", "finance", "other",
    }
    if category not in valid_categories:
        return (
            jsonify({
                "error": "Invalid category",
                "message": f"category must be one of: {', '.join(sorted(valid_categories))}",
            }),
            400,
        )

    now = datetime.now(timezone.utc)
    brand_document = {
        "user_id": user_id,
        "company_name": company_name,
        "logo_url": logo_url,
        "gstin": gstin,
        "category": category,
        "contact_email": contact_email,
        "status": "active",
        "created_at": now,
        "updated_at": now,
    }

    try:
        result = db["brands"].insert_one(brand_document)
        logger.info(
            "Brand registered  →  brand_id=%s  company=%s  user_id=%s",
            result.inserted_id, company_name, user_id,
        )
    except DuplicateKeyError:
        return (
            jsonify({
                "error": "Duplicate brand",
                "message": f"A brand is already registered for user_id '{user_id}'.",
            }),
            409,
        )
    except PyMongoError as exc:
        logger.exception("Brand registration failed: %s", exc)
        return jsonify({"error": "Database error", "message": "Failed to register brand."}), 500

    return (
        jsonify({
            "brand_id": str(result.inserted_id),
            "company_name": company_name,
            "status": "active",
            "message": "Brand registered successfully.",
        }),
        201,
    )


# ------------------------------------------------------------------
# Brand Profile
# ------------------------------------------------------------------
@brand_bp.route("/profile", methods=["GET"])
@require_auth
@require_brand
def get_brand_profile(user_id: str, brand_id: str, brand: dict, **kwargs):
    """
    GET /api/v1/brand/profile
    ─────────────────────────
    Returns the authenticated brand's profile and campaign summary.
    """
    # Count campaigns
    campaigns_collection = db["ad_campaigns"]
    total_campaigns = campaigns_collection.count_documents({"brand_id": brand_id})
    active_campaigns = campaigns_collection.count_documents({"brand_id": brand_id, "status": "active"})

    # Calculate total spend
    pipeline = [
        {"$match": {"brand_id": brand_id}},
        {"$group": {"_id": None, "total_spent": {"$sum": "$budget_spent_inr"}, "total_budget": {"$sum": "$budget_total_inr"}}},
    ]
    spend_result = list(campaigns_collection.aggregate(pipeline))
    total_spent = spend_result[0]["total_spent"] if spend_result else 0.0
    total_budget = spend_result[0]["total_budget"] if spend_result else 0.0

    # Serialize brand document
    profile = {
        "brand_id": brand_id,
        "user_id": brand.get("user_id", ""),
        "company_name": brand.get("company_name", ""),
        "logo_url": brand.get("logo_url", ""),
        "gstin": brand.get("gstin", ""),
        "category": brand.get("category", ""),
        "contact_email": brand.get("contact_email", ""),
        "status": brand.get("status", ""),
        "created_at": brand.get("created_at", "").isoformat() if hasattr(brand.get("created_at", ""), "isoformat") else "",
        "campaigns": {
            "total": total_campaigns,
            "active": active_campaigns,
            "total_budget_inr": total_budget,
            "total_spent_inr": total_spent,
        },
    }

    return jsonify(profile), 200
