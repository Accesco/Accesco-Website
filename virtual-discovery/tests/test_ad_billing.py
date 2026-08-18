import pytest
from app.extensions import db
from app.services.ad_billing import record_impression, record_view, record_click
from app.config import config


def test_record_impression(app):
    """Ensure impression recording does not deduct budget but increments stats."""
    with app.app_context():
        db["ad_campaigns"].delete_many({})
        db["ad_impressions"].delete_many({})
        
        db["ad_campaigns"].insert_one({
            "campaign_id": "camp_bill_1",
            "total_impressions": 0
        })
        
        result = record_impression("camp_bill_1", "vid_1", "user_1")
        assert result["status"] == "recorded"
        
        campaign = db["ad_campaigns"].find_one({"campaign_id": "camp_bill_1"})
        assert campaign["total_impressions"] == 1
        
        impression = db["ad_impressions"].find_one({"campaign_id": "camp_bill_1"})
        assert impression["event_type"] == "impression"


def test_record_view_below_threshold(app):
    """Ensure views below CPV_VIEW_THRESHOLD_PCT do not bill."""
    with app.app_context():
        db["ad_campaigns"].delete_many({})
        
        result = record_view("camp_bill_2", "vid_2", "user_1", completion_pct=10.0)
        assert result["status"] == "not_billable"


def test_record_view_billing_and_exhaustion(app):
    """Ensure valid views deduct budget and exhaust campaign when budget runs out."""
    with app.app_context():
        db["ad_campaigns"].delete_many({})
        db["ad_impressions"].delete_many({})
        
        # Create a campaign with exactly 1 view worth of budget left
        cost = config.DEFAULT_COST_PER_VIEW_INR
        db["ad_campaigns"].insert_one({
            "campaign_id": "camp_bill_3",
            "status": "active",
            "cost_per_view_inr": cost,
            "budget_total_inr": 100.0,
            "budget_spent_inr": 100.0 - cost,
            "total_views": 0
        })
        
        # Record a valid view (>50%)
        result = record_view("camp_bill_3", "vid_3", "user_1", completion_pct=80.0)
        assert result["status"] == "billed"
        assert result["budget_remaining_inr"] == 0.0
        
        campaign = db["ad_campaigns"].find_one({"campaign_id": "camp_bill_3"})
        assert campaign["status"] == "exhausted"
        assert campaign["budget_spent_inr"] == 100.0
        assert campaign["total_views"] == 1


from unittest.mock import patch

def test_record_view_redis_deduplication(app):
    """Ensure duplicate views within 24h are not billed when Redis is active."""
    with app.app_context():
        db["ad_campaigns"].delete_many({})
        db["ad_impressions"].delete_many({})
        
        cost = config.DEFAULT_COST_PER_VIEW_INR
        db["ad_campaigns"].insert_one({
            "campaign_id": "camp_bill_4",
            "status": "active",
            "cost_per_view_inr": cost,
            "budget_total_inr": 100.0,
            "budget_spent_inr": 0.0,
            "total_views": 0
        })

        # Mock Redis availability
        with patch("app.services.ad_billing.REDIS_AVAILABLE", True), \
             patch("app.services.ad_billing.redis_client") as mock_redis:
            
            # First call: Redis returns None (no cache), so it proceeds to bill
            mock_redis.get.return_value = None
            result1 = record_view("camp_bill_4", "vid_4", "user_1", completion_pct=100.0)
            assert result1["status"] == "billed"
            
            # Verify Redis setex was called to cache it
            mock_redis.setex.assert_called_with("view:campaign_camp_bill_4:user_user_1", 86400, "1")
            
            # Second call: Redis returns cached value, so it should skip billing
            mock_redis.get.return_value = "1"
            result2 = record_view("camp_bill_4", "vid_4", "user_1", completion_pct=100.0)
            assert result2["status"] == "not_billable"
            assert result2["reason"] == "duplicate_view_24h"
