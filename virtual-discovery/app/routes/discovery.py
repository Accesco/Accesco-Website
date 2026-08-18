import os
import uuid
import math
from datetime import datetime, timezone

import bleach
from flask import Blueprint, request, jsonify, send_from_directory, current_app
from werkzeug.utils import secure_filename
from pymongo.errors import PyMongoError
from bson.objectid import ObjectId
from bson.errors import InvalidId

from app.config import config
from app.extensions import logger, db, videos_collection
from app.auth import require_auth
from app.validators import allowed_file, allowed_mime, verify_magic_bytes
from app import limiter

discovery_bp = Blueprint("discovery", __name__, url_prefix="/api/v1/discovery")

# ------------------------------------------------------------------
# ML Ranking Pipeline (Adapted from MVP Heuristic Scorer)
# ------------------------------------------------------------------
from app.services.ranking_algorithm import build_user_category_profile, compute_score, select_best_ad

# ------------------------------------------------------------------
# 6a. UGC Upload Endpoint
# ------------------------------------------------------------------
def get_jwt_identity():
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header.split(" ", 1)[1].strip()
    from flask_limiter.util import get_remote_address
    return get_remote_address()

@discovery_bp.route("/upload", methods=["POST"])
@limiter.limit("5 per hour", key_func=get_jwt_identity)  # SEC-5: Prevent upload abuse
@require_auth
def upload_discovery_video(user_id: str):

    """
    POST /api/v1/discovery/upload
    ─────────────────────────────
    Protected endpoint – requires a valid JWT Bearer token.
    The authenticated user's ID is extracted from the token 'sub' claim
    and linked to the created discovery_videos document.

    Accepts a multipart/form-data payload containing a short-form video
    and product metadata. Saves the raw file locally and records the
    upload in MongoDB with a 'pending' moderation status.
    """

    # ── 6a-i. Validate required form text fields ──────────────────
    required_text_fields = ("order_id", "sku_id", "caption")
    missing_fields = [f for f in required_text_fields if not request.form.get(f)]
    if missing_fields:
        logger.warning("Upload rejected – missing fields: %s", missing_fields)
        return (
            jsonify({
                "error": "Missing required fields",
                "missing": missing_fields,
                "message": (
                    f"The following fields are required: "
                    f"{', '.join(missing_fields)}"
                ),
            }),
            400,
        )

    # SEC-3: Sanitize text inputs — strip HTML/script injection before storage
    order_id = bleach.clean(request.form["order_id"].strip())
    sku_id   = bleach.clean(request.form["sku_id"].strip())
    caption  = bleach.clean(request.form["caption"].strip())

    # ── 6a-ii. Validate order_id contract ─────────────────────────
    orders_collection = db["orders"]
    order = orders_collection.find_one({
        "order_id": order_id,
        "user_id":  user_id,
        "status":   {"$in": ["delivered", "completed"]},
    })
    if not order:
        logger.warning(
            "Upload rejected – invalid order_id '%s' for user '%s'.",
            order_id, user_id,
        )
        return (
            jsonify({
                "error": "Invalid order",
                "message": (
                    "The order_id does not exist, does not belong to you, "
                    "or is not eligible for a review video."
                ),
            }),
            403,
        )

    # ── 6a-iii. Validate sku_id contract ──────────────────────────
    products_collection = db["products"]
    product = products_collection.find_one({"sku_id": sku_id})
    if not product:
        logger.warning("Upload rejected – unknown sku_id '%s'.", sku_id)
        return (
            jsonify({
                "error": "Invalid product",
                "message": f"No product found with sku_id '{sku_id}'.",
            }),
            400,
        )

    # ── 6a-iv. Validate caption length ────────────────────────────
    if len(caption) > config.CAPTION_MAX_LENGTH:
        logger.warning(
            "Upload rejected – caption too long (%d chars).", len(caption)
        )
        return (
            jsonify({
                "error": "Caption too long",
                "message": (
                    f"Caption must be {config.CAPTION_MAX_LENGTH} characters or fewer. "
                    f"Received {len(caption)} characters."
                ),
            }),
            400,
        )

    # ── 6a-v. Parse optional tags ─────────────────────────────────
    raw_tags = request.form.getlist("tags")
    if raw_tags:
        tags = [
            bleach.clean(tag.strip())
            for entry in raw_tags
            for tag in entry.split(",")
            if tag.strip()
        ]
    else:
        tags = []

    # ── 6a-vi. Validate file presence ─────────────────────────────
    if "video_file" not in request.files:
        logger.warning("Upload rejected – 'video_file' field absent from request.")
        return (
            jsonify({
                "error": "Missing file",
                "message": (
                    "A 'video_file' field is required. "
                    "Ensure the request uses multipart/form-data encoding."
                ),
            }),
            400,
        )

    video_file = request.files["video_file"]

    if not video_file.filename:
        return (
            jsonify({
                "error": "Empty file",
                "message": "No file was selected for the 'video_file' field.",
            }),
            400,
        )

    # ── 6a-vii. Validate file type (extension + MIME) ─────────────
    if not allowed_file(video_file.filename):
        logger.warning(
            "Upload rejected – unsupported file extension: '%s'",
            video_file.filename,
        )
        return (
            jsonify({
                "error": "Invalid file type",
                "message": (
                    "Only MP4 (.mp4) and MOV (.mov) files are accepted. "
                    f"Received: '{video_file.filename}'"
                ),
            }),
            415,
        )

    if not allowed_mime(video_file.mimetype):
        logger.warning(
            "Upload rejected – unsupported MIME type: '%s'", video_file.mimetype
        )
        return (
            jsonify({
                "error": "Invalid file type",
                "message": (
                    "File MIME type must be 'video/mp4' or 'video/quicktime'. "
                    f"Detected: '{video_file.mimetype}'"
                ),
            }),
            415,
        )

    # ── 6a-viii. Magic-byte deep inspection ───────────────────────
    magic_ok, magic_reason = verify_magic_bytes(video_file.stream)
    if not magic_ok:
        logger.warning(
            "Upload rejected – magic-byte check failed for file '%s': %s",
            video_file.filename,
            magic_reason,
        )
        return (
            jsonify({
                "error": "Invalid file content",
                "message": (
                    "The file's internal signature does not match a valid "
                    f"MP4 or MOV video. {magic_reason}"
                ),
            }),
            415,
        )

    # ── 6a-ix. Generate upload ID and secure filename ─────────────
    upload_id     = str(uuid.uuid4())
    safe_filename = secure_filename(video_file.filename)

    if not safe_filename:
        safe_filename = "unnamed_video.mp4"
        logger.warning(
            "secure_filename() returned empty string for original filename '%s'. "
            "Falling back to '%s'.",
            video_file.filename,
            safe_filename,
        )

    stored_filename = f"{upload_id}_{safe_filename}"
    raw_file_path   = os.path.join(config.RAW_STORAGE_DIR, stored_filename)

    # ── 6a-x. Save the file to local storage ─────────────────────
    try:
        video_file.save(raw_file_path)
        logger.info(
            "Video saved  →  upload_id=%s  path=%s", upload_id, raw_file_path
        )
    except OSError as exc:
        logger.exception(
            "Filesystem error while saving upload %s: %s", upload_id, exc
        )
        return (
            jsonify({
                "error": "Storage error",
                "message": "Failed to save the video file. Please try again.",
            }),
            500,
        )

    # ── 6a-xi. Persist metadata to MongoDB ───────────────────────
    timestamp = datetime.now(timezone.utc)

    video_document = {
        "upload_id":         upload_id,
        "user_id":           user_id,
        "order_id":          order_id,
        "sku_id":            sku_id,
        "caption":           caption,
        "tags":              tags,
        "raw_file_path":     raw_file_path,
        "moderation_status": "pending",
        "created_at":        timestamp,
        "updated_at":        timestamp,
    }

    try:
        result = videos_collection.insert_one(video_document)
        logger.info(
            "MongoDB document created  →  upload_id=%s  _id=%s",
            upload_id,
            result.inserted_id,
        )
    except PyMongoError as exc:
        # Clean up the orphaned file if the DB write fails
        logger.exception(
            "MongoDB write failed for upload_id=%s. Rolling back file.", upload_id
        )
        try:
            if os.path.exists(raw_file_path):
                os.remove(raw_file_path)
        except OSError as cleanup_exc:
            logger.error(
                "Failed to clean up orphaned file %s: %s", raw_file_path, cleanup_exc
            )

        return (
            jsonify({
                "error": "Database error",
                "message": "Failed to record the upload. Please try again.",
            }),
            500,
        )

    # ── 6a-xii. Return success response ──────────────────────────
    logger.info("Upload complete  →  upload_id=%s", upload_id)
    return (
        jsonify({
            "upload_id":                 upload_id,
            "moderation_status":         "pending",
            "estimated_review_time_mins": config.ESTIMATED_REVIEW_TIME_MINS,
        }),
        201,
    )

# ------------------------------------------------------------------
# 6b. Feed API  –  GET /api/v1/discovery/feed
# ------------------------------------------------------------------
@discovery_bp.route("/feed", methods=["GET"])
@require_auth
def get_discovery_feed(user_id: str):
    """
    GET /api/v1/discovery/feed
    ──────────────────────────
    Protected endpoint – returns a paginated list of approved/pending
    videos for the authenticated user's infinite-scroll feed.
    """

    # ── 6b-i. Parse headers & validate query parameters ──────────────────
    dark_store_id = request.headers.get("X-Dark-Store-ID", "").strip()
    session_id_header = request.headers.get("X-Session-ID", "").strip()
    session_id = session_id_header if session_id_header else str(uuid.uuid4())

    try:
        limit = int(request.args.get("limit", 10))
    except ValueError:
        limit = 10
    limit = max(1, min(limit, 20))

    venture = request.args.get("venture", "all").strip()
    cursor_str = request.args.get("cursor", "").strip()
    try:
        offset = int(cursor_str) if cursor_str else 0
    except ValueError:
        offset = 0

    # ── 6b-ii. Build the MongoDB query (organic content only) ──
    query: dict = {
        "moderation_status": "approved",
        "content_type": {"$ne": "sponsored"},   # Exclude ads from organic pool
    }

    if venture != "all":
        query["tags"] = venture

    # ── 6b-iii. Fetch candidate pool (up to 200 videos) ──────
    try:
        raw_docs = list(
            videos_collection
            .find(query)
            .sort("_id", -1)
            .limit(200)
        )
    except PyMongoError as exc:
        logger.exception("Feed query failed: %s", exc)
        return (
            jsonify({
                "error": "Database error",
                "message": "Could not retrieve the feed. Please try again.",
            }),
            500,
        )

    # ── Inventory Gate ────────────────────────────
    # Retrieve product data for the candidate pool. Out-of-stock items will be
    # mapped to a fallback payload during serialization.
    sku_ids = list({doc.get("sku_id") for doc in raw_docs if doc.get("sku_id")})
    products_collection = db["products"]
    products = list(products_collection.find({"sku_id": {"$in": sku_ids}}))
    products_map = {p["sku_id"]: p for p in products if "sku_id" in p}

    filtered_docs = []
    for doc in raw_docs:
        sku_id = doc.get("sku_id")
        product_data = products_map.get(sku_id)
        if product_data:
            doc["_product_data"] = product_data
            filtered_docs.append(doc)
    raw_docs = filtered_docs

    # ── ML Ranking (The Smart Filter) ───────────────────────────────
    user_category_counts = build_user_category_profile(user_id, db, videos_collection)
    
    for doc in raw_docs:
        score = compute_score(doc, user_category_counts)
        doc["ranking_score"] = score
        
    raw_docs.sort(key=lambda x: x.get("ranking_score", 0.0), reverse=True)

    # ── 6b-iv. Apply Offset Pagination ───────────────────────
    has_next_page = offset + limit < len(raw_docs)
    page_docs = raw_docs[offset : offset + limit]

    next_cursor = str(offset + limit) if has_next_page else None

    # ── 6b-v. Map documents to the specified response shape ─────────
    def _get_video_url(doc: dict) -> str:
        """Serve the HLS stream if available, otherwise fallback to the raw file."""
        if "hls_url" in doc:
            return doc["hls_url"]

        filename = os.path.basename(doc.get("raw_file_path", ""))
        return f"/static/raw/{filename}"

    def _get_thumbnail_url(doc: dict) -> str:
        """Return the real thumbnail if it exists, otherwise a placeholder path."""
        if "thumbnail_url" in doc:
            return doc["thumbnail_url"]
        upload_id = doc.get("upload_id", "")
        return f"/static/processed/{upload_id}/thumb.jpg"

    # ── 6b-v. Build organic video payload ──────────────────────────
    def _build_product_info(product_data: dict) -> dict:
        units = int(product_data.get("units_available", 0))
        if units < 3:
            return {
                "sku_id": product_data.get("sku_id", ""),
                "name": "Product Unavailable",
                "price_current": 0.0,
                "units_available": 0,
                "delivery_eta_mins": 0,
                "freshness_score": 0.0,
            }
        return {
            "sku_id": product_data.get("sku_id", ""),
            "name": product_data.get("name", ""),
            "price_current": float(product_data.get("price_current", 0.0)),
            "units_available": units,
            "delivery_eta_mins": int(product_data.get("delivery_eta_mins", 0)),
            "freshness_score": float(product_data.get("freshness_score", 0.0)),
        }

    videos_payload = []
    for doc in page_docs:
        product_data = doc.get("_product_data", {})
        videos_payload.append({
            "video_id": str(doc["_id"]),
            "hls_url": _get_video_url(doc),
            "duration_seconds": doc.get("duration_seconds", 0),
            "is_sponsored": False,
            "product": _build_product_info(product_data),
            "creator": {
                "id":           doc.get("user_id", ""),
                "display_name": "Accesco User",
                "cqs_band":     "Creator",
            },
            "ranking_score": float(doc.get("ranking_score", 0.0))
        })

    # ── 6b-vi. Inject Sponsored Ads ──────────────────────────────
    ad_frequency = config.AD_FREQUENCY_IN_FEED
    if len(videos_payload) >= ad_frequency:
        ad_doc = select_best_ad(user_id, user_category_counts, db, videos_collection, venture)
        if ad_doc:
            # Record impression
            from app.services.ad_billing import record_impression
            record_impression(
                campaign_id=ad_doc.get("campaign_id", ""),
                video_id=ad_doc.get("upload_id", ""),
                user_id=user_id,
            )

            # Build the ad payload
            ad_sku = ad_doc.get("sku_id", "")
            ad_product_data = products_map.get(ad_sku, {})

            # Look up brand info
            brand_doc = db["brands"].find_one({"_id": __import__("bson").ObjectId(ad_doc["brand_id"])}) if ad_doc.get("brand_id") else None

            ad_payload = {
                "video_id": str(ad_doc["_id"]),
                "hls_url": _get_video_url(ad_doc),
                "duration_seconds": ad_doc.get("duration_seconds", 0),
                "is_sponsored": True,
                "sponsor": {
                    "brand_name": brand_doc.get("company_name", "Sponsored") if brand_doc else "Sponsored",
                    "brand_logo": brand_doc.get("logo_url", "") if brand_doc else "",
                    "campaign_id": ad_doc.get("campaign_id", ""),
                },
                "cta_url": ad_doc.get("cta_url", ""),
                "cta_text": ad_doc.get("cta_text", "Shop Now"),
                "product": _build_product_info(ad_product_data),
                "creator": {
                    "id": ad_doc.get("user_id", ""),
                    "display_name": brand_doc.get("company_name", "Sponsored") if brand_doc else "Sponsored",
                    "cqs_band": "Brand",
                },
                "ranking_score": 0.0,
            }

            # Insert ad after every N organic videos
            insert_pos = min(ad_frequency, len(videos_payload))
            videos_payload.insert(insert_pos, ad_payload)
            logger.info(
                "Ad injected into feed  →  campaign=%s  position=%d  user=%s",
                ad_doc.get("campaign_id", ""), insert_pos, user_id,
            )

    # ── 6b-vii. Build and return the response ────────────────────
    logger.info(
        "Feed served  →  user_id=%s  items=%d  venture=%s  has_next=%s  dark_store_id=%s",
        user_id,
        len(videos_payload),
        venture,
        has_next_page,
        dark_store_id,
    )
    return (
        jsonify({
            "videos":      videos_payload,
            "next_cursor": next_cursor,
            "session_id":  session_id,
        }),
        200,
    )

# ------------------------------------------------------------------
# 6c. Event Tracking API  –  POST /api/v1/discovery/event
# ------------------------------------------------------------------
@discovery_bp.route("/event", methods=["POST"])
@require_auth
def track_discovery_event(user_id: str):
    """
    POST /api/v1/discovery/event
    ─────────────────────────────
    Protected endpoint – records a user interaction event from the
    discovery feed. Accepts a JSON payload describing what the user
    did.
    """

    data = request.get_json(silent=True)
    if not data:
        logger.warning("Event rejected – request body is not valid JSON.")
        return (
            jsonify({
                "error": "Invalid payload",
                "message": "Request body must be valid JSON.",
            }),
            400,
        )

    required_fields = ("session_id", "video_id", "event_type", "watch_duration_ms", "completion_pct")
    missing = [f for f in required_fields if data.get(f) is None]
    if missing:
        logger.warning("Event rejected – missing fields: %s", missing)
        return (
            jsonify({
                "error": "Missing required fields",
                "missing": missing,
                "message": f"The following fields are required: {', '.join(missing)}",
            }),
            400,
        )

    # SEC-3: Sanitize event tracking inputs
    session_id = bleach.clean(str(data["session_id"]).strip())
    video_id   = bleach.clean(str(data["video_id"]).strip())
    event_type = bleach.clean(str(data["event_type"]).strip())

    valid_event_types = {"view", "like", "share", "skip", "replay", "ad_click", "ad_view"}
    if event_type not in valid_event_types:
        return (
            jsonify({
                "error": "Invalid event type",
                "message": f"event_type must be one of: {', '.join(sorted(valid_event_types))}"
            }),
            400,
        )

    try:
        watch_duration_ms = int(data["watch_duration_ms"])
        if watch_duration_ms < 0:
            raise ValueError("Negative duration")
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid field", "message": "watch_duration_ms must be a non-negative integer."}), 400

    try:
        completion_pct = float(data["completion_pct"])
        if completion_pct < 0 or completion_pct > 100:
            raise ValueError("Percentage out of range")
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid field", "message": "completion_pct must be a float between 0 and 100."}), 400

    # Validate video_id is a real ObjectId
    try:
        video_oid = ObjectId(video_id)
    except InvalidId:
        logger.warning("Event rejected – malformed video_id: '%s'", video_id)
        return (
            jsonify({
                "error": "Invalid video_id",
                "message": f"'{video_id}' is not a valid video ID.",
            }),
            400,
        )

    # Persist event to MongoDB
    timestamp = datetime.now(timezone.utc)
    events_collection = db["discovery_events"]

    event_document = {
        "user_id":                user_id,
        "session_id":             session_id,
        "video_id":               video_id,
        "event_type":             event_type,
        "watch_duration_ms":      watch_duration_ms,
        "completion_pct":         completion_pct,
        "created_at":             timestamp,
    }

    try:
        result = events_collection.insert_one(event_document)
        logger.info(
            "Event recorded  →  user=%s  event=%s  video=%s  _id=%s",
            user_id, event_type, video_id, result.inserted_id,
        )
    except PyMongoError as exc:
        logger.exception("Failed to record event: %s", exc)
        return (
            jsonify({
                "error": "Database error",
                "message": "Failed to record the event. Please try again.",
            }),
            500,
        )

    # ── Ad Billing: handle sponsored content events ──────────────
    if event_type in ("ad_click", "ad_view", "view"):
        video_doc = videos_collection.find_one({"_id": video_oid})
        if video_doc and video_doc.get("content_type") == "sponsored":
            campaign_id = video_doc.get("campaign_id", "")
            upload_id = video_doc.get("upload_id", "")
            if campaign_id:
                from app.services.ad_billing import record_view, record_click
                if event_type == "ad_click":
                    record_click(campaign_id, upload_id, user_id)
                elif event_type in ("ad_view", "view"):
                    record_view(campaign_id, upload_id, user_id, completion_pct)

    return (
        jsonify({
            "status":  "recorded",
            "event_id": str(result.inserted_id),
        }),
        201,
    )
