"""
Quick database inspector — prints the 5 most recent uploads.

Usage:
    python -m scripts.check_db
"""

from app.extensions import db

collection = db["discovery_videos"]

print("--- RECENT UPLOADS ---")
for doc in collection.find().sort("_id", -1).limit(5):
    print(f"ID: {doc.get('upload_id')}")
    print(f"Status: {doc.get('moderation_status')}")
    if doc.get("error_reason"):
        print(f"Error: {doc.get('error_reason')}")
    print("-" * 20)
