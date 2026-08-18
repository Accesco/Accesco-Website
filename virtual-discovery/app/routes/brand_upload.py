"""
Accesco Living – Virtual Discovery
Brand Video Upload Route

Allows registered brands to upload sponsored ad videos.
Unlike UGC uploads, brand uploads do NOT require an order_id
but DO require a campaign_id. Videos go through the same AI
moderation pipeline but also have an admin_status gate for
human review before going live.
"""

import os
import uuid
from datetime import datetime, timezone

import bleach
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from pymongo.errors import PyMongoError

from app.config import config
from app.extensions import logger, db, videos_collection
from app.auth import require_auth, require_brand
from app.validators import allowed_file, allowed_mime, verify_magic_bytes
from app import limiter

brand_upload_bp = Blueprint("brand_upload", __name__, url_prefix="/api/v1/brand")


def _get_brand_identity():
    """Key function for rate limiting — uses the brand user_id."""
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header.split(" ", 1)[1].strip()
    from flask_limiter.util import get_remote_address
    return get_remote_address()


@brand_upload_bp.route("/upload", methods=["POST"])
@limiter.limit(config.BRAND_UPLOAD_RATE_LIMIT, key_func=_get_brand_identity)
@require_auth
@require_brand
def upload_brand_video(user_id: str, brand_id: str, brand: dict, **kwargs):
    """
    POST /api/v1/brand/upload
    ─────────────────────────
    Brand-only endpoint. Uploads a sponsored ad video for a campaign.

    Form fields:
        - campaign_id   (required) : ID of the ad campaign
        - sku_id        (required) : Product being advertised
        - caption       (required) : Ad caption (max 100 chars)
        - cta_url       (optional) : Call-to-action URL ("Shop Now" link)
        - cta_text      (optional) : CTA button label (default: "Shop Now")
        - target_tags   (optional) : Comma-separated targeting tags
        - video_file    (required) : The video file (MP4/MOV)
    """

    # ── Validate required fields ──────────────────────────────────
    required_fields = ("campaign_id", "sku_id", "caption")
    missing = [f for f in required_fields if not request.form.get(f)]
    if missing:
        return (
            jsonify({
                "error": "Missing required fields",
                "missing": missing,
                "message": f"The following fields are required: {', '.join(missing)}",
            }),
            400,
        )

    campaign_id = bleach.clean(request.form["campaign_id"].strip())
    sku_id = bleach.clean(request.form["sku_id"].strip())
    caption = bleach.clean(request.form["caption"].strip())
    cta_url = bleach.clean(request.form.get("cta_url", "").strip())
    cta_text = bleach.clean(request.form.get("cta_text", "Shop Now").strip())

    # ── Validate caption length ───────────────────────────────────
    if len(caption) > config.BRAND_CAPTION_MAX_LENGTH:
        return (
            jsonify({
                "error": "Caption too long",
                "message": (
                    f"Brand ad caption must be {config.BRAND_CAPTION_MAX_LENGTH} characters or fewer. "
                    f"Received {len(caption)} characters."
                ),
            }),
            400,
        )

    # ── Validate campaign exists and belongs to this brand ────────
    campaigns_collection = db["ad_campaigns"]
    campaign = campaigns_collection.find_one({
        "campaign_id": campaign_id,
        "brand_id": brand_id,
    })
    if not campaign:
        logger.warning(
            "Brand upload rejected – campaign_id '%s' not found for brand '%s'.",
            campaign_id, brand_id,
        )
        return (
            jsonify({
                "error": "Invalid campaign",
                "message": (
                    f"Campaign '{campaign_id}' does not exist or does not belong to your brand."
                ),
            }),
            400,
        )

    if campaign.get("status") not in ("active", "scheduled"):
        return (
            jsonify({
                "error": "Campaign not active",
                "message": f"Campaign '{campaign_id}' is {campaign.get('status')}. Only active or scheduled campaigns can receive new videos.",
            }),
            400,
        )

    # ── Validate product exists ───────────────────────────────────
    products_collection = db["products"]
    product = products_collection.find_one({"sku_id": sku_id})
    if not product:
        return (
            jsonify({
                "error": "Invalid product",
                "message": f"No product found with sku_id '{sku_id}'.",
            }),
            400,
        )

    # ── Parse target tags ─────────────────────────────────────────
    raw_tags = request.form.getlist("target_tags")
    if raw_tags:
        target_tags = [
            bleach.clean(tag.strip())
            for entry in raw_tags
            for tag in entry.split(",")
            if tag.strip()
        ]
    else:
        target_tags = campaign.get("target_tags", [])

    # ── Validate video file ───────────────────────────────────────
    if "video_file" not in request.files:
        return (
            jsonify({
                "error": "Missing file",
                "message": "A 'video_file' field is required.",
            }),
            400,
        )

    video_file = request.files["video_file"]
    if not video_file.filename:
        return jsonify({"error": "Empty file", "message": "No file was selected."}), 400

    if not allowed_file(video_file.filename):
        return (
            jsonify({
                "error": "Invalid file type",
                "message": f"Only MP4 and MOV files are accepted. Received: '{video_file.filename}'",
            }),
            415,
        )

    if not allowed_mime(video_file.mimetype):
        return (
            jsonify({
                "error": "Invalid file type",
                "message": f"Invalid MIME type: '{video_file.mimetype}'",
            }),
            415,
        )

    magic_ok, magic_reason = verify_magic_bytes(video_file.stream)
    if not magic_ok:
        return (
            jsonify({
                "error": "Invalid file content",
                "message": f"File header validation failed. {magic_reason}",
            }),
            415,
        )

    # ── Save file ─────────────────────────────────────────────────
    upload_id = str(uuid.uuid4())
    safe_filename = secure_filename(video_file.filename) or "brand_video.mp4"
    stored_filename = f"{upload_id}_{safe_filename}"
    raw_file_path = os.path.join(config.RAW_STORAGE_DIR, stored_filename)

    try:
        video_file.save(raw_file_path)
        logger.info("Brand video saved  →  upload_id=%s  path=%s", upload_id, raw_file_path)
    except OSError as exc:
        logger.exception("Failed to save brand video %s: %s", upload_id, exc)
        return jsonify({"error": "Storage error", "message": "Failed to save the video."}), 500

    # ── Persist to MongoDB ────────────────────────────────────────
    timestamp = datetime.now(timezone.utc)

    video_document = {
        "upload_id": upload_id,
        "user_id": user_id,
        "brand_id": brand_id,
        "campaign_id": campaign_id,
        "sku_id": sku_id,
        "caption": caption,
        "tags": target_tags,
        "cta_url": cta_url,
        "cta_text": cta_text,
        "content_type": "sponsored",           # Key differentiator from UGC
        "raw_file_path": raw_file_path,
        "moderation_status": "pending",         # AI pipeline queue
        "admin_status": "pending_review",       # Human admin audit gate
        "created_at": timestamp,
        "updated_at": timestamp,
    }

    try:
        result = videos_collection.insert_one(video_document)
        logger.info(
            "Brand video document created  →  upload_id=%s  _id=%s  campaign=%s",
            upload_id, result.inserted_id, campaign_id,
        )

        # Add video to the campaign's video_ids list
        campaigns_collection.update_one(
            {"campaign_id": campaign_id},
            {"$addToSet": {"video_ids": upload_id}},
        )

    except PyMongoError as exc:
        logger.exception("MongoDB write failed for brand upload %s", upload_id)
        try:
            if os.path.exists(raw_file_path):
                os.remove(raw_file_path)
        except OSError:
            pass
        return jsonify({"error": "Database error", "message": "Failed to record the upload."}), 500

    return (
        jsonify({
            "upload_id": upload_id,
            "content_type": "sponsored",
            "moderation_status": "pending",
            "admin_status": "pending_review",
            "message": (
                "Brand video uploaded successfully. It will go through AI moderation "
                "and admin review before appearing in the feed."
            ),
        }),
        201,
    )
