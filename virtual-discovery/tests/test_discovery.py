"""Tests for the Discovery API — feed, upload, and event tracking."""

import pytest
from unittest.mock import patch, MagicMock
from bson.objectid import ObjectId


# ------------------------------------------------------------------
# Feed API Tests
# ------------------------------------------------------------------

@patch("app.routes.discovery.build_user_category_profile")
@patch("app.routes.discovery.db")
@patch("app.routes.discovery.videos_collection")
def test_discovery_feed_out_of_stock_edge_case(mock_videos_collection, mock_db, mock_build_profile, client, auth_headers):
    """
    Test that the discovery feed correctly maps out-of-stock products
    to the 'Product Unavailable' fallback payload and respects limit=10.
    """
    mock_build_profile.return_value = {"kitchen": 5, "decor": 2}

    mock_videos = []
    mock_products = []
    
    # Generate 10 videos and 10 corresponding products
    for i in range(10):
        sku = f"SKU-{i}"
        mock_videos.append({
            "_id": ObjectId(f"6a1fe260c5709e6f5729945{i}"),
            "sku_id": sku,
            "user_id": f"creator_{i}",
            "raw_file_path": f"mock_path_{i}.mp4",
            "hls_url": f"http://mock-hls-url.com/stream_{i}.m3u8"
        })
        
        # Inject mock product with units_available = 1 for the first item
        units = 1 if i == 0 else 5
        mock_products.append({
            "sku_id": sku,
            "name": f"Product {i}",
            "price_current": 150.00,
            "farmchain_price": 130.00,
            "units_available": units,
            "delivery_eta_mins": 60,
            "freshness_score": 0.90
        })

    mock_videos_collection.find.return_value.sort.return_value.limit.return_value = mock_videos

    mock_products_collection = MagicMock()
    mock_products_collection.find.return_value = mock_products
    
    mock_events_collection = MagicMock()
    mock_events_collection.find.return_value.sort.return_value.limit.return_value = []
    
    def getitem_side_effect(key):
        if key == "products":
            return mock_products_collection
        if key == "discovery_events":
            return mock_events_collection
        return MagicMock()
        
    mock_db.__getitem__.side_effect = getitem_side_effect

    # Request limit=10
    response = client.get("/api/v1/discovery/feed?limit=10", headers=auth_headers)

    assert response.status_code == 200
    data = response.get_json()

    assert "videos" in data
    
    # Assert exactly 10 items are returned
    assert len(data["videos"]) == 10

    # Locate the video that had units_available = 1
    low_stock_video = next(v for v in data["videos"] if v["product"]["sku_id"] == "SKU-0")
    product_info = low_stock_video["product"]

    # Assert it correctly displays "Product Unavailable"
    assert product_info["sku_id"] == "SKU-0"
    assert product_info["name"] == "Product Unavailable"
    assert product_info["price_current"] == 0.0
    assert product_info["units_available"] == 0
    assert product_info["freshness_score"] == 0.0


# ------------------------------------------------------------------
# Contract Validation Tests – Upload API
# ------------------------------------------------------------------

@patch("app.routes.discovery.db")
@patch("app.routes.discovery.videos_collection")
def test_upload_rejects_invalid_order_id(mock_videos, mock_db, client, auth_headers, tmp_path):
    """
    Upload should return 403 when the order_id does not exist,
    does not belong to the authenticated user, or is not in a
    delivered/completed state.
    """
    mock_orders = MagicMock()
    mock_orders.find_one.return_value = None
    mock_db.__getitem__.return_value = mock_orders

    video_content = b'\x00\x00\x00\x1c' + b'ftyp' + b'isom' + b'\x00' * 200

    data = {
        "order_id": "fake_order_999",
        "sku_id": "SKU-404",
        "caption": "Test caption",
    }
    resp = client.post(
        "/api/v1/discovery/upload",
        headers=auth_headers,
        data={**data, "video_file": (
            __import__("io").BytesIO(video_content), "test.mp4", "video/mp4"
        )},
        content_type="multipart/form-data",
    )

    assert resp.status_code == 403
    body = resp.get_json()
    assert body["error"] == "Invalid order"


@patch("app.routes.discovery.db")
@patch("app.routes.discovery.videos_collection")
def test_upload_rejects_invalid_sku_id(mock_videos, mock_db, client, auth_headers):
    """
    Upload should return 400 when the sku_id doesn't match any
    product in the catalog, even if the order_id is valid.
    """
    mock_orders = MagicMock()
    mock_orders.find_one.return_value = {
        "order_id": "ord_valid",
        "user_id": "test_user_123",
        "status": "delivered",
    }

    mock_products = MagicMock()
    mock_products.find_one.return_value = None

    def getitem_side_effect(key):
        if key == "orders":
            return mock_orders
        if key == "products":
            return mock_products
        return MagicMock()

    mock_db.__getitem__.side_effect = getitem_side_effect

    video_content = b'\x00\x00\x00\x1c' + b'ftyp' + b'isom' + b'\x00' * 200

    data = {
        "order_id": "ord_valid",
        "sku_id": "SKU-DOES-NOT-EXIST",
        "caption": "Test caption",
    }
    resp = client.post(
        "/api/v1/discovery/upload",
        headers=auth_headers,
        data={**data, "video_file": (
            __import__("io").BytesIO(video_content), "test.mp4", "video/mp4"
        )},
        content_type="multipart/form-data",
    )

    assert resp.status_code == 400
    body = resp.get_json()
    assert body["error"] == "Invalid product"


# ------------------------------------------------------------------
# Event Tracking API Tests
# ------------------------------------------------------------------

@patch("app.routes.discovery.db")
def test_event_tracking_records_valid_event(mock_db, client, auth_headers):
    """
    A valid event payload should return 201 and persist the event.
    """
    mock_events = MagicMock()
    mock_events.insert_one.return_value = MagicMock(
        inserted_id=ObjectId("6a2b0000c5709e6f57299999")
    )
    mock_db.__getitem__.return_value = mock_events

    payload = {
        "session_id": "sess-abc-123",
        "video_id": "6a1fe260c5709e6f57299452",
        "event_type": "view",
        "watch_duration_ms": 12500,
        "completion_pct": 55.0
    }

    resp = client.post(
        "/api/v1/discovery/event",
        headers={**auth_headers, "Content-Type": "application/json"},
        json=payload,
    )

    assert resp.status_code == 201
    body = resp.get_json()
    assert body["status"] == "recorded"
    assert "event_id" in body
    mock_events.insert_one.assert_called_once()


@patch("app.routes.discovery.db")
def test_event_tracking_rejects_invalid_event_type(mock_db, client, auth_headers):
    """
    An unknown event_type should return 400.
    """
    payload = {
        "session_id": "sess-abc-123",
        "video_id": "6a1fe260c5709e6f57299452",
        "event_type": "video_downloaded",  # Not an allowed event type
        "watch_duration_ms": 1000,
        "completion_pct": 10.0
    }

    resp = client.post(
        "/api/v1/discovery/event",
        headers={**auth_headers, "Content-Type": "application/json"},
        json=payload,
    )

    assert resp.status_code == 400
    body = resp.get_json()
    assert body["error"] == "Invalid event type"


@patch("app.routes.discovery.db")
def test_event_tracking_rejects_missing_fields(mock_db, client, auth_headers):
    """
    Missing required fields should return 400 with a list of what's missing.
    """
    payload = {
        "session_id": "sess-abc-123",
        # video_id and event_type are missing
    }

    resp = client.post(
        "/api/v1/discovery/event",
        headers={**auth_headers, "Content-Type": "application/json"},
        json=payload,
    )

    assert resp.status_code == 400
    body = resp.get_json()
    assert body["error"] == "Missing required fields"
    assert "video_id" in body["missing"]
    assert "event_type" in body["missing"]


@patch("app.routes.discovery.db")
def test_event_tracking_rejects_garbage_event_type(mock_db, client, auth_headers):
    """
    An unknown event_type (like 'swiped_down') should return 400.
    """
    payload = {
        "session_id": "sess-abc-123",
        "video_id": "6a1fe260c5709e6f57299452",
        "event_type": "swiped_down",  # Garbage event type
        "watch_duration_ms": 1000,
        "completion_pct": 10.0
    }

    resp = client.post(
        "/api/v1/discovery/event",
        headers={**auth_headers, "Content-Type": "application/json"},
        json=payload,
    )

    assert resp.status_code == 400
    body = resp.get_json()
    assert body["error"] == "Invalid event type"
