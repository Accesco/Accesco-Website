"""
Manual upload test script.

Usage:
    1. Generate a fresh token:  python -m scripts.generate_test_token
    2. Set the TOKEN variable below (or use the TEST_JWT_TOKEN env var)
    3. Run:  python -m scripts.test_upload
"""

import os
import requests

URL = "http://127.0.0.1:5000/api/v1/discovery/upload"
TOKEN = os.getenv("TEST_JWT_TOKEN", "")
VIDEO_FILE = "test_video.mp4"


def upload_video():
    if not TOKEN:
        print("Error: No JWT token set.")
        print("Generate one with:  python -m scripts.generate_test_token")
        print("Then set it:        set TEST_JWT_TOKEN=<your_token>")
        return

    headers = {"Authorization": f"Bearer {TOKEN}"}
    data = {
        "order_id": "ord_123",
        "sku_id": "SKU-404",
        "caption": "Testing the new AI pipeline!"
    }

    try:
        with open(VIDEO_FILE, "rb") as f:
            files = {"video_file": (VIDEO_FILE, f, "video/mp4")}
            print(f"Uploading {VIDEO_FILE}...")
            response = requests.post(URL, headers=headers, data=data, files=files)

        print(f"Status Code: {response.status_code}")
        print("Response:", response.json())
    except FileNotFoundError:
        print(f"Error: {VIDEO_FILE} not found. Make sure it is in the project root.")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    upload_video()
