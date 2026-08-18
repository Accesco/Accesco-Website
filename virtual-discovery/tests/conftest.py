"""
Shared test fixtures for all Accesco Living test modules.

Eliminates fixture duplication across test files and standardizes
JWT token generation for authenticated endpoint testing.
"""

import os
import time

import jwt
import pytest

from app import create_app
from app.config import config


@pytest.fixture
def app():
    """Create and configure the Flask application for testing."""
    config.ADMIN_SECRET_KEY = "test-admin-secret-key"
    application = create_app()
    application.config["TESTING"] = True
    return application


@pytest.fixture
def client(app):
    """Flask test client backed by the test application."""
    with app.test_client() as test_client:
        yield test_client


@pytest.fixture
def auth_headers():
    """
    Generate valid JWT Authorization headers for testing.
    Uses the same secret configured in .env / app.config.
    """
    secret = config.JWT_SECRET_KEY or "change-me-to-a-long-random-jwt-secret"
    payload = {
        "sub": "test_user_123",
        "exp": int(time.time()) + 3600,
    }
    token = jwt.encode(payload, secret, algorithm=config.JWT_ALGORITHM)
    return {"Authorization": f"Bearer {token}"}
