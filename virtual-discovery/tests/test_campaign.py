import pytest
from app.extensions import db
from app.config import config


@pytest.fixture
def setup_brand(auth_headers):
    """Fixture to ensure a brand exists for the test user."""
    db["brands"].delete_many({})
    db["ad_campaigns"].delete_many({})
    
    result = db["brands"].insert_one({
        "user_id": "test_user_123",
        "company_name": "Test Campaign Brand",
        "category": "fashion",
        "contact_email": "hello@test.com",
        "status": "active"
    })
    return str(result.inserted_id)


def test_create_campaign(client, auth_headers, setup_brand):
    """Ensure brand can create a scheduled campaign."""
    payload = {
        "name": "Summer Launch",
        "target_tags": ["summer", "fashion"],
        "start_date": "2030-01-01",
        "end_date": "2030-02-01"
    }
    
    response = client.post("/api/v1/brand/campaigns", headers=auth_headers, json=payload)
    assert response.status_code == 201
    
    data = response.get_json()
    assert data["status"] == "scheduled"
    assert "campaign_id" in data
    assert data["budget_total_inr"] == 0.0
    
    campaign_doc = db["ad_campaigns"].find_one({"campaign_id": data["campaign_id"]})
    assert campaign_doc["brand_id"] == setup_brand


def test_set_campaign_budget(client, app, auth_headers, setup_brand):
    """Ensure admin can set budget and activate campaign."""
    # Create campaign
    client.post("/api/v1/brand/campaigns", headers=auth_headers, json={
        "name": "Summer Launch",
        "start_date": "2030-01-01",
        "end_date": "2030-02-01"
    })
    
    campaign = db["ad_campaigns"].find_one({"brand_id": setup_brand})
    campaign_id = campaign["campaign_id"]
    
    import time
    import jwt
    
    payload = {
        "sub": "admin_user_1",
        "role": "admin",
        "exp": int(time.time()) + 3600,
    }
    token = jwt.encode(payload, config.JWT_SECRET_KEY, algorithm=config.JWT_ALGORITHM)

    # Set budget
    response = client.post(
        f"/api/v1/brand/campaigns/{campaign_id}/set-budget",
        headers={"Authorization": f"Bearer {token}"},
        json={"budget_total_inr": 5000.0}
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert data["budget_total_inr"] == 5000.0
    assert data["status"] == "active"
    
    campaign_doc = db["ad_campaigns"].find_one({"campaign_id": campaign_id})
    assert campaign_doc["budget_total_inr"] == 5000.0
    assert campaign_doc["status"] == "active"


def test_pause_and_resume_campaign(client, auth_headers, setup_brand):
    """Ensure brand can pause and resume active campaigns."""
    # Manually insert an active campaign
    db["ad_campaigns"].insert_one({
        "campaign_id": "camp_pause_test",
        "brand_id": setup_brand,
        "name": "Pause Test",
        "status": "active",
        "budget_total_inr": 1000.0,
        "budget_spent_inr": 0.0
    })
    
    # Pause
    response = client.post("/api/v1/brand/campaigns/camp_pause_test/pause", headers=auth_headers)
    assert response.status_code == 200
    assert response.get_json()["status"] == "paused"
    
    # Resume
    response = client.post("/api/v1/brand/campaigns/camp_pause_test/resume", headers=auth_headers)
    assert response.status_code == 200
    assert response.get_json()["status"] == "active"
