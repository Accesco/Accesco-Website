"""
Admin Authentication Route
"""
import time
import jwt
from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash

from app.config import config
from app.extensions import db, logger

admin_auth_bp = Blueprint("admin_auth", __name__, url_prefix="/api/v1/admin")


@admin_auth_bp.route("/login", methods=["POST"])
def admin_login():
    """
    Authenticate an admin user and return a JWT with role="admin".
    """
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Bad Request", "message": "Email and password required."}), 400

    admin = db["admins"].find_one({"email": email})
    if not admin or not check_password_hash(admin["password_hash"], password):
        logger.warning(f"Failed admin login attempt for {email}")
        return jsonify({"error": "Unauthorized", "message": "Invalid email or password."}), 401

    payload = {
        "sub": str(admin["_id"]),
        "role": "admin",
        "email": admin["email"],
        "exp": int(time.time()) + 86400  # 24 hour expiry
    }

    token = jwt.encode(payload, config.JWT_SECRET_KEY, algorithm=config.JWT_ALGORITHM)

    logger.info(f"Admin logged in: {email}")
    return jsonify({
        "message": "Login successful.",
        "access_token": token,
        "admin": {
            "id": str(admin["_id"]),
            "email": admin["email"]
        }
    }), 200
