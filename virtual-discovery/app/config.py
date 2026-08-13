import os
import logging
import logging.config
from dotenv import load_dotenv

# ─────────────────────────────────────────────────────────────────────────────
# Load environment variables ONCE at import time
# ─────────────────────────────────────────────────────────────────────────────
load_dotenv()


def setup_logging() -> None:
    """
    Configure logging for the entire application. Call once at startup.

    OBS-1: Uses structured JSON logging in production (FLASK_DEBUG=0)
    for log aggregation (ELK, Datadog, CloudWatch). Keeps human-readable
    format in development mode.
    """
    is_debug = os.getenv("FLASK_DEBUG", "0") == "1"

    if is_debug:
        # Development: human-readable format
        logging.basicConfig(
            level=logging.DEBUG,
            format="%(asctime)s  [%(levelname)s]  %(name)s – %(message)s",
            datefmt="%Y-%m-%dT%H:%M:%S",
        )
    else:
        # Production: structured JSON logging
        logging.config.dictConfig({
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": {
                "json": {
                    "()": "pythonjsonlogger.jsonlogger.JsonFormatter",
                    "format": "%(asctime)s %(name)s %(levelname)s %(message)s",
                    "datefmt": "%Y-%m-%dT%H:%M:%S%z",
                    "rename_fields": {
                        "asctime": "timestamp",
                        "name": "logger",
                        "levelname": "level",
                    },
                },
            },
            "handlers": {
                "console": {
                    "class": "logging.StreamHandler",
                    "formatter": "json",
                    "stream": "ext://sys.stdout",
                },
            },
            "root": {
                "level": "INFO",
                "handlers": ["console"],
            },
        })


class Config:
    """Base configuration — shared across all environments."""

    # ── Flask ─────────────────────────────────────────────────────────────
    SECRET_KEY: str = os.getenv("FLASK_SECRET_KEY", "dev-fallback-secret")
    DEBUG: bool = os.getenv("FLASK_DEBUG", "0") == "1"

    # ── MongoDB ───────────────────────────────────────────────────────────
    MONGO_URI: str = os.getenv("MONGO_URI", "")
    MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "accesco_living")
    MONGO_COLLECTION_NAME: str = "discovery_videos"
    MONGO_TLS_INSECURE: bool = os.getenv("MONGO_TLS_INSECURE", "0") == "1"
    MONGO_TLS_CA_FILE: str = os.getenv("MONGO_TLS_CA_FILE", "")

    # ── JWT Authentication ────────────────────────────────────────────────
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")
    JWT_ALGORITHM: str = "HS256"

    # ── File Upload ───────────────────────────────────────────────────────
    ALLOWED_EXTENSIONS: set = {"mp4", "mov"}
    ALLOWED_MIME_TYPES: set = {"video/mp4", "video/quicktime"}
    MAX_CONTENT_LENGTH_BYTES: int = 150 * 1024 * 1024  # 150 MB
    CAPTION_MAX_LENGTH: int = 150
    ESTIMATED_REVIEW_TIME_MINS: int = 120

    # ── Magic Byte Inspection ─────────────────────────────────────────────
    MAGIC_FTYP_OFFSET: int = 4
    MAGIC_FTYP_MARKER: bytes = b"ftyp"
    MAGIC_READ_BYTES: int = 2048

    # ── Storage Paths ─────────────────────────────────────────────────────
    PROJECT_ROOT: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    RAW_STORAGE_DIR: str = os.path.join(PROJECT_ROOT, "storage", "raw")
    PROCESSED_STORAGE_DIR: str = os.path.join(PROJECT_ROOT, "storage", "processed")
    TMP_STORAGE_DIR: str = os.path.join(PROJECT_ROOT, "storage", "tmp")

    # ── Video Moderation Thresholds ───────────────────────────────────────
    MIN_VIDEO_DURATION_SEC: float = 8.0
    MAX_VIDEO_DURATION_SEC: float = 60.0
    VISUAL_SAFETY_THRESHOLD: float = 0.85
    AUDIO_TOXICITY_THRESHOLD: float = 0.3
    PRODUCT_MATCH_THRESHOLD: float = 0.70
    QUALITY_SCORE_THRESHOLD: int = 60

    # ── Credits & Rewards ─────────────────────────────────────────────────
    CREDIT_AWARD_AMOUNT: float = 50.0
    MAX_MONTHLY_EARNING_CAP: float = 2000.0
    CREDIT_EXPIRY_DAYS: int = 90

    # ── Worker ────────────────────────────────────────────────────────────
    WORKER_IDLE_BACKOFF_START: int = 2
    WORKER_IDLE_BACKOFF_MAX: int = 30
    FFPROBE_TIMEOUT: int = 15
    FFMPEG_TIMEOUT: int = 120
    FFMPEG_ASSET_TIMEOUT: int = 60

    # ── TorchServe Audio Toxicity Microservice ────────────────────────────
    TORCHSERVE_ENDPOINT: str = os.getenv(
        "TORCHSERVE_ENDPOINT",
        "http://localhost:8080/predictions/audio_toxicity"
    )
    TORCHSERVE_TIMEOUT: int = 30
    TORCHSERVE_ENABLED: bool = os.getenv("TORCHSERVE_ENABLED", "0") == "1"
    AUDIO_SPECTROGRAM_TOXICITY_THRESHOLD: float = 0.75

    # ── MuRIL Multilingual Hate Speech Model ──────────────────────────────
    MURIL_MODEL_DIR: str = os.path.join(
        PROJECT_ROOT, "Multilingual-Speech-Moderation", "models", "muril_classifier"
    )
    MURIL_ENABLED: bool = os.getenv("MURIL_ENABLED", "0") == "1"
    MURIL_TOXICITY_THRESHOLD: float = 0.5
    MURIL_SUPPORTED_LANGUAGES: set = {"hi", "ta", "te", "kn", "ml", "bn", "mr", "gu", "pa", "ur"}

    # ── Brand Ads & Sponsored Content ─────────────────────────────────────
    # Admin secret for brand registration (invite-only for MVP)
    ADMIN_SECRET_KEY: str = os.getenv("ADMIN_SECRET_KEY", "")

    # Brand video upload limits
    BRAND_MAX_VIDEO_DURATION_SEC: float = 30.0
    BRAND_UPLOAD_RATE_LIMIT: str = "50 per day"
    BRAND_CAPTION_MAX_LENGTH: int = 100

    # Ad feed injection
    AD_FREQUENCY_IN_FEED: int = int(os.getenv("AD_FREQUENCY_IN_FEED", "5"))
    AD_FREQUENCY_CAP_PER_USER: int = 2          # Max times same campaign shown to same user per 24h
    AD_FREQUENCY_CAP_WINDOW_HOURS: int = 24

    # CPV (Cost Per View) billing — a "view" = watched >50% of video
    CPV_VIEW_THRESHOLD_PCT: float = 50.0         # Minimum completion_pct to count as a billable view
    DEFAULT_COST_PER_VIEW_INR: float = 0.50
    MIN_AD_BUDGET_INR: float = 500.0

    # ── Redis (Caching & Bot Prevention) ──────────────────────────────────
    REDIS_URI: str = os.getenv("REDIS_URI", "redis://localhost:6379/0")


class DevelopmentConfig(Config):
    """Development-specific overrides."""
    DEBUG = True


class ProductionConfig(Config):
    """Production-specific overrides."""
    DEBUG = False


# ── Active config instance ────────────────────────────────────────────────
# Modules import this instead of reading os.getenv() themselves.
config = ProductionConfig() if not Config.DEBUG else DevelopmentConfig()
