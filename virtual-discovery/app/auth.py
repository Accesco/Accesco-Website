"""
Accesco Living – Virtual Discovery
Authentication Module

JWT Bearer token authentication decorator for protected API endpoints.
"""

import functools

from flask import request, jsonify

from app.config import config
from app.extensions import logger, JWT_AVAILABLE, _jwt_lib

# ─────────────────────────────────────────────────────────────────────────────
# Startup Validation
# ─────────────────────────────────────────────────────────────────────────────
is_production = not config.DEBUG

if is_production and not JWT_AVAILABLE:
    raise ImportError(
        "PyJWT is required in production but is not installed. "
        "Run: pip install PyJWT  "
        "then restart the server."
    )

if not config.JWT_SECRET_KEY:
    if is_production:
        raise EnvironmentError(
            "JWT_SECRET_KEY is not set. "
            "This is required in production. "
            "Add it to your .env file before starting the server."
        )
    logger.warning(
        "JWT_SECRET_KEY is not set in .env.  "
        "All authenticated endpoints will return 401 until it is configured."
    )


# ─────────────────────────────────────────────────────────────────────────────
# Auth Decorator
# ─────────────────────────────────────────────────────────────────────────────
def require_auth(fn):
    """Route decorator that enforces JWT Bearer token authentication."""
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        if not JWT_AVAILABLE:
            logger.error(
                "PyJWT is not installed – all authenticated routes are locked. "
                "Run: pip install PyJWT"
            )
            return (
                jsonify({
                    "error": "Server configuration error",
                    "message": "Authentication service is unavailable.",
                }),
                503,
            )

        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            logger.warning(
                "Rejected request – missing or malformed Authorization header."
            )
            return (
                jsonify({
                    "error": "Unauthorized",
                    "message": (
                        "A valid 'Authorization: Bearer <token>' header is required. "
                        "Obtain a token by authenticating with the Accesco API."
                    ),
                }),
                401,
            )

        _parts = auth_header.split(" ", 1)
        if len(_parts) != 2 or not _parts[1].strip():
            logger.warning(
                "Rejected request – 'Bearer' keyword present but token is missing."
            )
            return (
                jsonify({
                    "error": "Unauthorized",
                    "message": "Token is missing. Expected format: 'Authorization: Bearer <token>'.",
                }),
                401,
            )
        raw_token = _parts[1].strip()

        try:
            payload = _jwt_lib.decode(
                raw_token,
                config.JWT_SECRET_KEY,
                algorithms=[config.JWT_ALGORITHM],
            )
        except _jwt_lib.ExpiredSignatureError:
            logger.warning("Rejected request – JWT has expired.")
            return (
                jsonify({
                    "error": "Token expired",
                    "message": "Your session has expired. Please log in again.",
                }),
                401,
            )
        except _jwt_lib.InvalidTokenError as exc:
            logger.warning("Rejected request – invalid JWT: %s", exc)
            return (
                jsonify({
                    "error": "Invalid token",
                    "message": "Authentication failed. Please log in again.",
                }),
                401,
            )

        user_id = payload.get("sub") or payload.get("user_id")
        if not user_id:
            logger.warning(
                "Rejected request – JWT payload is missing the 'sub' claim."
            )
            return (
                jsonify({
                    "error": "Invalid token",
                    "message": "Token payload is missing the required 'sub' (user identity) claim.",
                }),
                401,
            )

        logger.info("Authenticated request  →  user_id=%s", user_id)
        kwargs["user_id"] = str(user_id)
        return fn(*args, **kwargs)

    return wrapper


def require_brand(fn):
    """Route decorator that enforces the caller is a registered brand.

    Must be placed AFTER @require_auth in the decorator stack so that
    ``user_id`` is already resolved in kwargs.
    """
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        from app.extensions import db

        user_id = kwargs.get("user_id")
        if not user_id:
            return (
                jsonify({
                    "error": "Unauthorized",
                    "message": "Authentication required before brand check.",
                }),
                401,
            )

        brand = db["brands"].find_one({"user_id": user_id, "status": "active"})
        if not brand:
            logger.warning(
                "Brand access denied – user_id=%s is not a registered brand.", user_id
            )
            return (
                jsonify({
                    "error": "Forbidden",
                    "message": (
                        "This endpoint is restricted to registered brand accounts. "
                        "Contact the Accesco team to register as a brand partner."
                    ),
                }),
                403,
            )

        kwargs["brand_id"] = str(brand["_id"])
        kwargs["brand"] = brand
        return fn(*args, **kwargs)

    return wrapper


def require_admin(fn):
    """Route decorator that enforces admin access via JWT RBAC."""
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        if not JWT_AVAILABLE:
            return jsonify({"error": "Configuration error"}), 503

        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Unauthorized", "message": "Admin token required."}), 401

        raw_token = auth_header.split(" ", 1)[1].strip()

        try:
            payload = _jwt_lib.decode(
                raw_token,
                config.JWT_SECRET_KEY,
                algorithms=[config.JWT_ALGORITHM],
            )
        except (_jwt_lib.ExpiredSignatureError, _jwt_lib.InvalidTokenError):
            return jsonify({"error": "Unauthorized", "message": "Invalid admin token."}), 401

        if payload.get("role") != "admin":
            logger.warning("Admin access denied – insufficient role.")
            return jsonify({"error": "Forbidden", "message": "Admin privileges required."}), 403

        return fn(*args, **kwargs)

    return wrapper

