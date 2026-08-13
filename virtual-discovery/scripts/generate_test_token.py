"""
Generate a valid JWT test token for manual API testing.

Usage:
    python -m scripts.generate_test_token
"""

import time

import jwt

from app.config import config

secret = config.JWT_SECRET_KEY or "change-me-to-a-long-random-jwt-secret"
payload = {
    "sub": "test_user_123",
    "exp": int(time.time()) + 3600,
}

token = jwt.encode(payload, secret, algorithm=config.JWT_ALGORITHM)
print("\n=== YOUR TEST JWT TOKEN ===\n")
print(token)
print("\n===========================\n")
