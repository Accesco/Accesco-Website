import pytest
from app.extensions import db
from app.config import config


def test_register_brand_missing_admin_key(client):
    """Ensure brand registration fails without admin JWT header."""
    response = client.post("/api/v1/brand/register", json={
        "user_id": "brand_user_1",
        "company_name": "Test Brand",
        "category": "fashion",
        "contact_email": "brand@test.com"
    })
    assert response.status_code == 401
    assert "Admin token required" in response.get_json()["message"]


def test_register_brand_success(client, app):
    """Ensure brand registration succeeds with correct admin JWT."""
    # Ensure collection is clean
    db["brands"].delete_many({})

    import time
    import jwt
    from app.config import config
    
    payload = {
        "sub": "admin_user_1",
        "role": "admin",
        "exp": int(time.time()) + 3600,
    }
    token = jwt.encode(payload, config.JWT_SECRET_KEY, algorithm=config.JWT_ALGORITHM)

    response = client.post(
        "/api/v1/brand/register",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "user_id": "brand_user_1",
            "company_name": "Test Brand",
            "category": "fashion",
            "contact_email": "brand@test.com"
        }
    )
    assert response.status_code == 201
    data = response.get_json()
    assert "brand_id" in data
    assert data["company_name"] == "Test Brand"
    
    brand_doc = db["brands"].find_one({"user_id": "brand_user_1"})
    assert brand_doc is not None
    assert brand_doc["status"] == "active"


def test_get_brand_profile_success(client, auth_headers):
    """Ensure a registered brand can fetch their profile."""
    # First register the brand using the user_id from auth_headers (test_user_123)
    db["brands"].delete_many({})
    db["brands"].insert_one({
        "user_id": "test_user_123",
        "company_name": "Auth Brand",
        "category": "electronics",
        "contact_email": "auth@brand.com",
        "status": "active"
    })

    response = client.get("/api/v1/brand/profile", headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data["company_name"] == "Auth Brand"
    assert "campaigns" in data


def test_brand_profile_unauthorized(client, auth_headers):
    """Ensure a non-brand user cannot access brand profile."""
    db["brands"].delete_many({})
    response = client.get("/api/v1/brand/profile", headers=auth_headers)
    assert response.status_code == 403
    assert "restricted to registered brand accounts" in response.get_json()["message"]
