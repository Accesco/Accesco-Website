import pytest
from app.extensions import db, videos_collection
from app.services.ranking_algorithm import select_best_ad


def test_select_best_ad_no_eligible(app):
    """Ensure select_best_ad returns None when no campaigns are active."""
    with app.app_context():
        db["ad_campaigns"].delete_many({})
        best_ad = select_best_ad("user_1", {"fashion": 5}, db, videos_collection)
        assert best_ad is None


def test_select_best_ad_success(app):
    """Ensure select_best_ad picks the highest scoring eligible ad."""
    with app.app_context():
        db["ad_campaigns"].delete_many({})
        videos_collection.delete_many({})
        db["ad_impressions"].delete_many({})
        
        # Insert a valid, active campaign
        db["ad_campaigns"].insert_one({
            "campaign_id": "camp_test_1",
            "brand_id": "brand_1",
            "status": "active",
            "start_date": "2020-01-01",  # Past (simulating a date object conceptually)
            "end_date": "2030-01-01",    # Future
            "budget_total_inr": 1000.0,
            "budget_spent_inr": 100.0,
            "target_tags": ["shoes", "fashion"],
            "video_ids": ["vid_ad_1"]
        })
        
        # Insert the corresponding approved video
        videos_collection.insert_one({
            "upload_id": "vid_ad_1",
            "content_type": "sponsored",
            "moderation_status": "approved",
            "admin_status": "approved",
            "campaign_id": "camp_test_1",
            "tags": ["shoes"]
        })
        
        # We'll mock the datetime check since start/end date logic uses real datetime in ranking_algorithm
        # For a true unit test, we should insert real datetime objects. Let's fix that.
        from datetime import datetime, timedelta, timezone
        now = datetime.now(timezone.utc)
        
        db["ad_campaigns"].update_one(
            {"campaign_id": "camp_test_1"},
            {"$set": {
                "start_date": now - timedelta(days=1),
                "end_date": now + timedelta(days=1)
            }}
        )

        best_ad = select_best_ad("user_1", {"shoes": 5}, db, videos_collection)
        assert best_ad is not None
        assert best_ad["upload_id"] == "vid_ad_1"
