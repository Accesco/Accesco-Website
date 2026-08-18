"""Tests for JWT authentication on protected endpoints."""

import pytest


def test_discovery_feed_auth_success(client, auth_headers):
    """
    Test that the /api/v1/discovery/feed endpoint returns a 200 OK
    when a valid JWT token is provided in the Authorization header.
    """
    response = client.get("/api/v1/discovery/feed", headers=auth_headers)

    assert response.status_code == 200
    data = response.get_json()
    assert "videos" in data
    assert "next_cursor" in data


def test_discovery_feed_auth_missing_token(client):
    """
    Test that the endpoint returns 401 Unauthorized when no token is provided.
    """
    response = client.get("/api/v1/discovery/feed")

    assert response.status_code == 401
    data = response.get_json()
    assert data["error"] == "Unauthorized"


def test_discovery_feed_auth_invalid_token(client):
    """
    Test that the endpoint returns 401 Unauthorized when a junk token is provided.
    """
    headers = {
        "Authorization": "Bearer this.is.completely.invalid"
    }

    response = client.get("/api/v1/discovery/feed", headers=headers)

    assert response.status_code == 401
    data = response.get_json()
    assert data["error"] == "Invalid token"


def test_admin_auth_success(client, app):
    import time
    import jwt
    from app.config import config
    
    payload = {
        "sub": "admin_user_1",
        "role": "admin",
        "exp": int(time.time()) + 3600,
    }
    token = jwt.encode(payload, config.JWT_SECRET_KEY, algorithm=config.JWT_ALGORITHM)
    headers = {"Authorization": f"Bearer {token}"}
    
    # We test an endpoint protected by @require_admin, like POST /api/v1/brand/register
    response = client.post("/api/v1/brand/register", headers=headers, json={
        "user_id": "test_user_x",
        "company_name": "Test Company",
        "category": "fashion",
        "contact_email": "x@x.com"
    })
    
    assert response.status_code == 201


def test_admin_auth_denied_standard_user(client, auth_headers):
    # Standard user has no 'role: admin'
    response = client.post("/api/v1/brand/register", headers=auth_headers, json={
        "user_id": "test_user_y",
        "company_name": "Test",
        "category": "fashion",
        "contact_email": "y@y.com"
    })
    
    assert response.status_code == 403
    assert response.get_json()["message"] == "Admin privileges required."
