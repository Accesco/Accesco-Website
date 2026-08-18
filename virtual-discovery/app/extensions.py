"""
Accesco Living – Virtual Discovery
Extensions Module

Shared infrastructure objects: MongoDB connection, logger.
Imported by routes, services, and the worker — never creates Flask-specific state.
"""

import logging
import ssl as _ssl

from pymongo import MongoClient
from pymongo.errors import PyMongoError

from app.config import config

# ─────────────────────────────────────────────────────────────────────────────
# Logger
# ─────────────────────────────────────────────────────────────────────────────
logger = logging.getLogger("virtual_discovery")

# ─────────────────────────────────────────────────────────────────────────────
# Optional Dependencies
# ─────────────────────────────────────────────────────────────────────────────
try:
    import jwt as _jwt_lib
    JWT_AVAILABLE = True
except ImportError:
    _jwt_lib = None
    JWT_AVAILABLE = False

try:
    import magic as _magic_lib
    MAGIC_AVAILABLE = True
except ImportError:
    _magic_lib = None
    MAGIC_AVAILABLE = False

if not MAGIC_AVAILABLE:
    logger.warning(
        "python-magic is NOT installed. File-header validation will use "
        "the built-in ISO BMFF 'ftyp' byte check instead of libmagic. "
        "Install 'python-magic-bin' (Windows) or 'python-magic' (Linux/macOS) "
        "for full cryptographic file-type verification."
    )

# ─────────────────────────────────────────────────────────────────────────────
# SSL / TLS Helpers
# ─────────────────────────────────────────────────────────────────────────────
try:
    import certifi
    _ca_file = certifi.where()
except ImportError:
    _ca_file = None

# ─────────────────────────────────────────────────────────────────────────────
# MongoDB Connection
# ─────────────────────────────────────────────────────────────────────────────
if not config.MONGO_URI:
    raise EnvironmentError(
        "MONGO_URI is not set. "
        "Add it to your .env file before starting the server."
    )

try:
    ca_cert = config.MONGO_TLS_CA_FILE if config.MONGO_TLS_CA_FILE else _ca_file
    mongo_client = MongoClient(
        config.MONGO_URI,
        serverSelectionTimeoutMS=10_000,
        tls=True,
        tlsCAFile=ca_cert,
    )
    mongo_client.admin.command("ping")
    logger.info("MongoDB connected  →  database: '%s'", config.MONGO_DB_NAME)
except PyMongoError:
    if config.MONGO_TLS_INSECURE:
        # Relaxed TLS — for local development with self-signed certs ONLY
        logger.warning(
            "Standard TLS failed. MONGO_TLS_INSECURE=1 is set — "
            "connecting with relaxed TLS. DO NOT use this in production."
        )
        try:
            mongo_client = MongoClient(
                config.MONGO_URI,
                serverSelectionTimeoutMS=10_000,
                tls=True,
                tlsAllowInvalidCertificates=True,
                tlsAllowInvalidHostnames=True,
            )
            mongo_client.admin.command("ping")
            logger.info(
                "MongoDB connected (relaxed TLS)  →  database: '%s'",
                config.MONGO_DB_NAME,
            )
        except PyMongoError:
            # Final fallback for CI/local containers that don't speak TLS at all
            try:
                mongo_client = MongoClient(
                    config.MONGO_URI,
                    serverSelectionTimeoutMS=10_000,
                )
                mongo_client.admin.command("ping")
                logger.info(
                    "MongoDB connected (NO TLS)  →  database: '%s'",
                    config.MONGO_DB_NAME,
                )
            except PyMongoError as exc:
                raise ConnectionError(f"Could not connect to MongoDB: {exc}") from exc
    else:
        raise ConnectionError(
            "Could not connect to MongoDB with TLS. "
            "If using a self-signed certificate for local development, "
            "set MONGO_TLS_INSECURE=1 in your .env file. "
            "Never use this in production."
        )

db = mongo_client[config.MONGO_DB_NAME]
videos_collection = db[config.MONGO_COLLECTION_NAME]
