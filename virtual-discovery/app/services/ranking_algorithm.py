import math
from datetime import datetime, timezone
from bson.objectid import ObjectId

def recency_score(created_at: datetime, half_life_hours: float = 24.0) -> float:
    now = datetime.now(timezone.utc)
    hours_elapsed = (now - created_at).total_seconds() / 3600.0
    decay_constant = math.log(2) / half_life_hours
    return math.exp(-decay_constant * hours_elapsed)

def engagement_rate(view_count: int, like_count: int, share_count: int, skip_count: int) -> float:
    if view_count < 5:
        return 0.0
    positive = like_count + (share_count * 2)
    negative = skip_count
    return (positive - negative) / view_count

def tags_match(user_category_counts: dict, video_tags: list) -> float:
    if not user_category_counts or not video_tags:
        return 0.0
    max_count = max(user_category_counts.values()) if user_category_counts else 1
    scores = [user_category_counts.get(tag, 0) / max_count for tag in video_tags]
    return max(scores) if scores else 0.0

def compute_score(video: dict, user_category_counts: dict, weights: dict = None) -> float:
    if weights is None:
        weights = {"recency": 0.3, "engagement": 0.4, "category": 0.3}
    
    created_at = video.get("created_at")
    if isinstance(created_at, str):
        try:
            created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
        except Exception:
            created_at = datetime.now(timezone.utc)
    elif created_at and created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)
        
    r_score = recency_score(created_at) if created_at else 0.0
    
    e_score = engagement_rate(
        video.get("view_count", 0),
        video.get("like_count", 0),
        video.get("share_count", 0),
        video.get("skip_count", 0)
    )
    
    video_tags = video.get("tags", [])
    c_score = tags_match(user_category_counts, video_tags)
    
    return (weights["recency"] * r_score) + (weights["engagement"] * e_score) + (weights["category"] * c_score)

def build_user_category_profile(user_id: str, db, videos_collection) -> dict:
    events_collection = db["discovery_events"]
    recent_events = list(events_collection.find({
        "user_id": user_id,
        "event_type": {"$in": ["like", "replay", "share"]}
    }).sort("created_at", -1).limit(50))
    
    if not recent_events:
        return {}
        
    video_ids = list({ObjectId(e["video_id"]) for e in recent_events if "video_id" in e and ObjectId.is_valid(e["video_id"])})
    liked_videos = list(videos_collection.find({"_id": {"$in": video_ids}}, {"tags": 1}))
    
    counts = {}
    for v in liked_videos:
        for tag in v.get("tags", []):
            counts[tag] = counts.get(tag, 0) + 1
            
    return counts


# ------------------------------------------------------------------
# Ad Selection for Brand Sponsored Content
# ------------------------------------------------------------------
def select_best_ad(user_id: str, user_category_counts: dict, db, videos_collection, venture: str = "all") -> dict | None:
    """
    Select the best sponsored ad video to inject into the feed for this user.

    Selection criteria (in priority order):
        1. Campaign is active, within date range, and has remaining budget
        2. Ad video is AI-approved AND admin-approved
        3. Frequency cap not exceeded for this user
        4. Tag relevance to user interests (highest overlap wins)
        5. Higher budget campaigns get slight priority

    Returns:
        The best ad video document, or None if no eligible ads exist.
    """
    from app.services.ad_billing import check_frequency_cap, redis_client, REDIS_AVAILABLE
    import json
    from bson import json_util

    now = datetime.now(timezone.utc)

    # 1. Fetch active campaigns (Try Redis Cache first)
    active_campaigns = None
    cache_key = "cache:active_campaigns"
    
    if REDIS_AVAILABLE:
        cached_data = redis_client.get(cache_key)
        if cached_data:
            active_campaigns = json_util.loads(cached_data)
            
    if active_campaigns is None:
        campaigns_collection = db["ad_campaigns"]
        active_campaigns = list(campaigns_collection.find({
            "status": "active",
            "start_date": {"$lte": now},
            "end_date": {"$gte": now},
            "$expr": {"$lt": ["$budget_spent_inr", "$budget_total_inr"]},
        }))
        
        if REDIS_AVAILABLE:
            redis_client.setex(cache_key, 300, json_util.dumps(active_campaigns))  # 5-minute TTL

    if not active_campaigns:
        return None

    # 2. Filter by venture targeting (if specified)
    if venture != "all":
        targeted = [c for c in active_campaigns if not c.get("target_ventures") or venture in c.get("target_ventures", [])]
        active_campaigns = targeted if targeted else active_campaigns

    # 3. Apply frequency cap — remove campaigns the user has seen too many times
    eligible_campaigns = []
    for campaign in active_campaigns:
        campaign_id = campaign.get("campaign_id", "")
        if check_frequency_cap(campaign_id, user_id):
            eligible_campaigns.append(campaign)

    if not eligible_campaigns:
        return None

    # 4. Score each campaign by tag relevance + budget priority
    scored_campaigns = []
    for campaign in eligible_campaigns:
        tag_score = 0.0
        target_tags = campaign.get("target_tags", [])
        if target_tags and user_category_counts:
            max_count = max(user_category_counts.values()) if user_category_counts else 1
            matches = [user_category_counts.get(tag, 0) / max_count for tag in target_tags]
            tag_score = max(matches) if matches else 0.0

        # Budget priority: campaigns with more remaining budget get a small boost
        budget_total = campaign.get("budget_total_inr", 1)
        budget_remaining_ratio = max(0, (budget_total - campaign.get("budget_spent_inr", 0)) / budget_total) if budget_total > 0 else 0

        combined_score = (tag_score * 0.7) + (budget_remaining_ratio * 0.3)
        scored_campaigns.append((combined_score, campaign))

    # Sort by score descending and pick the best
    scored_campaigns.sort(key=lambda x: x[0], reverse=True)
    best_campaign = scored_campaigns[0][1]

    # 5. Find an approved ad video from the winning campaign
    video_upload_ids = best_campaign.get("video_ids", [])
    if not video_upload_ids:
        return None

    ad_video = videos_collection.find_one({
        "upload_id": {"$in": video_upload_ids},
        "content_type": "sponsored",
        "moderation_status": "approved",
        "admin_status": "approved",
    })

    return ad_video

