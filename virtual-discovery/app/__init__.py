"""
╔══════════════════════════════════════════════════════════════════════════════╗
║         Accesco Living  –  Virtual Discovery  |  Phase 1: Foundation         ║
║         Application Factory                                                  ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import os
import re
from flask import Flask, jsonify, send_from_directory

from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from app.config import config, setup_logging
from app.extensions import logger, videos_collection, db

# Configure logging once at import time
setup_logging()

# ── Rate Limiter (module-level so blueprints can import it) ──────────
# SEC-5: Blueprints import this to apply per-route limits
limiter = Limiter(
    get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri=os.getenv("RATE_LIMITER_STORAGE_URI", "memory://"),
)


def create_app() -> Flask:
    """Application factory."""
    app = Flask(__name__)

    # ── OBS-3: Sentry Error Tracking ─────────────────────────────────
    # Activates only when SENTRY_DSN is set in the environment.
    sentry_dsn = os.getenv("SENTRY_DSN", "")
    if sentry_dsn:
        try:
            import sentry_sdk
            sentry_sdk.init(
                dsn=sentry_dsn,
                traces_sample_rate=float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1")),
                send_default_pii=False,
            )
            logger.info("Sentry error tracking initialized.")
        except ImportError:
            logger.warning(
                "SENTRY_DSN is set but sentry-sdk is not installed. "
                "Install with: pip install sentry-sdk[flask]"
            )
    else:
        logger.info("Sentry disabled (SENTRY_DSN not set).")

    # Core Flask settings
    app.config["SECRET_KEY"] = config.SECRET_KEY
    app.config["DEBUG"] = config.DEBUG
    app.config["MAX_CONTENT_LENGTH"] = config.MAX_CONTENT_LENGTH_BYTES

    # ── CORS — allow the frontend origin to call this API ────────────
    # Update 'origins' to your real frontend URL before deploying.
    CORS(app, origins=os.getenv("CORS_ALLOWED_ORIGINS", "*").split(","))

    # ── Rate Limiting — bind to this app instance ─────────────────────
    limiter.init_app(app)

    # Ensure local storage directories exist at startup
    os.makedirs(config.RAW_STORAGE_DIR, exist_ok=True)
    os.makedirs(config.PROCESSED_STORAGE_DIR, exist_ok=True)
    os.makedirs(config.TMP_STORAGE_DIR, exist_ok=True)
    logger.info("Storage directories ready: %s", config.RAW_STORAGE_DIR)

    # Register blueprints
    from app.routes.discovery import discovery_bp
    from app.routes.cart import cart_bp
    from app.routes.creator import creator_bp
    from app.routes.brand import brand_bp
    from app.routes.brand_upload import brand_upload_bp
    from app.routes.campaign import campaign_bp
    from app.routes.brand_analytics import brand_analytics_bp
    from app.routes.admin_auth import admin_auth_bp

    app.register_blueprint(discovery_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(creator_bp, url_prefix="/api/v1/creator")
    app.register_blueprint(brand_bp)
    app.register_blueprint(brand_upload_bp)
    app.register_blueprint(campaign_bp)
    app.register_blueprint(brand_analytics_bp)
    app.register_blueprint(admin_auth_bp)

    # ── OBS-2: Prometheus Metrics ────────────────────────────────────
    try:
        from prometheus_flask_instrumentator import Instrumentator
        Instrumentator().instrument(app).expose(app, endpoint="/metrics")
        logger.info("Prometheus metrics enabled at /metrics")
    except ImportError:
        logger.info(
            "prometheus-flask-instrumentator not installed — "
            "/metrics endpoint disabled."
        )

    # ──────────────────────────────────────────────────────────────────
    # Security Response Headers (Production Hardening)
    # ──────────────────────────────────────────────────────────────────
    @app.after_request
    def set_security_headers(response):
        # HSTS — force HTTPS for 1 year (only effective behind TLS termination)
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains"
        )
        # Prevent MIME-type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"
        # Block framing (clickjacking protection)
        response.headers["X-Frame-Options"] = "DENY"
        # Content Security Policy — restrict resource loading
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        # Referrer policy — limit referrer leakage
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        # Permissions policy — disable unnecessary browser features
        response.headers["Permissions-Policy"] = (
            "camera=(), microphone=(), geolocation=()"
        )
        return response

    # ──────────────────────────────────────────────────────────────────
    # Error handlers
    # ──────────────────────────────────────────────────────────────────
    @app.errorhandler(413)
    def request_entity_too_large(error):
        logger.warning("Upload rejected – file exceeds 150 MB size limit.")
        return jsonify({"error": "File too large", "message": "The uploaded file exceeds the maximum allowed size of 150 MB."}), 413

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found", "message": str(error)}), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({"error": "Method not allowed", "message": str(error)}), 405

    # ──────────────────────────────────────────────────────────────────
    # Core Routes
    # ──────────────────────────────────────────────────────────────────
    @app.route("/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "ok", "service": "virtual-discovery"}), 200

    @app.route("/static/raw/<path:filename>", methods=["GET"])
    def serve_raw_video(filename: str):
        # CRIT-5 FIX: Block path traversal — filename must be a simple basename
        if "/" in filename or "\\" in filename or ".." in filename:
            return jsonify({"error": "Invalid filename"}), 400
        return send_from_directory(config.RAW_STORAGE_DIR, filename)

    @app.route("/static/processed/<upload_id>/<path:filename>", methods=["GET"])
    def serve_processed_video(upload_id: str, filename: str):
        # CRIT-5: Reject any upload_id that isn't a valid UUID
        if not re.match(r'^[a-f0-9\-]{36}$', upload_id):
            return jsonify({"error": "Invalid upload ID"}), 400

        directory = os.path.join(config.PROCESSED_STORAGE_DIR, upload_id)
        # Verify the resolved path stays inside our storage root
        real_dir = os.path.realpath(directory)
        storage_root = os.path.realpath(
            os.path.join(config.PROJECT_ROOT, "storage")
        )
        if not real_dir.startswith(storage_root):
            return jsonify({"error": "Invalid path"}), 400

        return send_from_directory(directory, filename)

    # ──────────────────────────────────────────────────────────────────
    # CLI Commands
    # ──────────────────────────────────────────────────────────────────
    @app.cli.command("setup-db")
    def setup_db():
        """Create MongoDB indexes. Run with: flask setup-db"""
        from pymongo.errors import OperationFailure

        logger.info("Creating MongoDB indexes...")

        # Create default admin account if none exists
        from werkzeug.security import generate_password_hash
        admins = db["admins"]
        admins.create_index("email", unique=True)
        if not admins.find_one({"email": "admin@accesco.com"}):
            admins.insert_one({
                "email": "admin@accesco.com",
                "password_hash": generate_password_hash("accesco-admin-2026")
            })
            logger.info("Created default admin account (admin@accesco.com)")

        # Helper: drop all non-_id indexes so we can recreate cleanly.
        # This makes setup-db fully idempotent — safe to run repeatedly.
        collections_to_index = [
            "discovery_videos", "credits_ledger", "products", "lifecart",
            "discovery_events", "video_engagement", "brands", "ad_campaigns",
            "ad_impressions"
        ]
        for coll_name in collections_to_index:
            try:
                db[coll_name].drop_indexes()
                logger.info("Dropped existing indexes on '%s'", coll_name)
            except OperationFailure:
                pass  # Collection may not exist yet — that's fine

        # ── discovery_videos ──
        # Note: _id already has a built-in ascending index in MongoDB
        videos_collection.create_index("user_id")
        videos_collection.create_index(
            "moderation_status",
            partialFilterExpression={"moderation_status": "pending"},
        )
        videos_collection.create_index([("tags", 1), ("_id", -1)])
        videos_collection.create_index("content_type")

        # ── credits_ledger ──
        credits_ledger = db["credits_ledger"]
        credits_ledger.create_index([("user_id", 1), ("created_at", -1)])
        credits_ledger.create_index(
            [("reference_id", 1)],
            unique=True,  # Idempotency key — prevents double-award
        )
        credits_ledger.create_index(
            "expires_at",
            expireAfterSeconds=0,  # TTL: auto-delete expired transactions
        )
        # SCALE-1 FIX: Covered compound index for the monthly cap aggregation
        credits_ledger.create_index(
            [("user_id", 1), ("created_at", -1), ("amount", 1)],
            name="ledger_monthly_cap_idx",
        )

        # ── products ──
        products = db["products"]
        products.create_index("sku_id", unique=True)
        
        try:
            db.create_collection("products")
        except Exception:
            pass

        db.command("collMod", "products", validator={
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["sku_id", "name", "units_available", "price_current", "delivery_eta_mins"],
                "properties": {
                    "sku_id": {"bsonType": "string"},
                    "name": {"bsonType": "string"},
                    "price_current": {"bsonType": "double"},
                    "units_available": {"bsonType": ["int", "long"]},
                    "delivery_eta_mins": {"bsonType": ["int", "long"]}
                }
            }
        })

        # ── lifecart ──
        lifecart = db["lifecart"]
        lifecart.create_index(
            [("user_id", 1), ("sku_id", 1)],
            unique=True,
        )

        # ── discovery_events ──
        discovery_events = db["discovery_events"]
        discovery_events.create_index(
            [("user_id", 1), ("created_at", -1)],
            name="events_user_timeline_idx",
        )
        discovery_events.create_index(
            [("video_id", 1), ("event_type", 1)],
            name="events_video_analytics_idx",
        )

        # ── video_engagement ──
        video_engagement = db["video_engagement"]
        video_engagement.create_index("video_id", unique=True)
        
        # Ensure collection exists before modifying validator
        try:
            db.create_collection("video_engagement")
        except Exception:
            pass
            
        # JSON Schema Validation for video_engagement
        db.command("collMod", "video_engagement", validator={
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["video_id", "views", "completion_rate", "swipe_left_rate", "saves", "double_taps", "shares", "updated_at"],
                "properties": {
                    "video_id": {"bsonType": "string", "description": "must be a string and is required"},
                    "views": {"bsonType": ["int", "long"], "minimum": 0},
                    "completion_rate": {"bsonType": "double", "minimum": 0.0, "maximum": 1.0},
                    "swipe_left_rate": {"bsonType": "double", "minimum": 0.0, "maximum": 1.0},
                    "saves": {"bsonType": ["int", "long"], "minimum": 0},
                    "double_taps": {"bsonType": ["int", "long"], "minimum": 0},
                    "shares": {"bsonType": ["int", "long"], "minimum": 0},
                    "updated_at": {"bsonType": "date"}
                }
            }
        })

        # ── brands ──
        db["brands"].create_index("user_id", unique=True)

        # ── ad_campaigns ──
        db["ad_campaigns"].create_index("campaign_id", unique=True)
        db["ad_campaigns"].create_index([("brand_id", 1), ("status", 1)])

        # ── ad_impressions ──
        db["ad_impressions"].create_index([("campaign_id", 1), ("created_at", -1)])
        db["ad_impressions"].create_index([("user_id", 1), ("campaign_id", 1)])

        logger.info(
            "MongoDB indexes ensured  →  discovery_videos, "
            "credits_ledger, products, lifecart, discovery_events, "
            "video_engagement, brands, ad_campaigns, ad_impressions"
        )
        print("MongoDB indexes created successfully.")

    return app
