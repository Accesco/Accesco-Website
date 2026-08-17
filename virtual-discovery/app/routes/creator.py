from datetime import datetime, timezone
from flask import Blueprint, jsonify
from app.extensions import db
from app.auth import require_auth
from app.utils.cqs import get_cqs_details, get_user_cqs_score

creator_bp = Blueprint("creator", __name__)

@creator_bp.route("/wallet", methods=["GET"])
@require_auth
def get_wallet(user_id: str):
    """
    Returns the user's current balance (sum of unexpired credits),
    their current CQS band, and their 10 most recent transactions.
    """
    credits_ledger = db["credits_ledger"]
    now = datetime.now(timezone.utc)

    # 1. Calculate sum of all unexpired credits
    pipeline = [
        {"$match": {
            "user_id": user_id,
            "expires_at": {"$gt": now}
        }},
        {"$group": {
            "_id": None,
            "balance": {"$sum": "$amount"}
        }}
    ]
    result = list(credits_ledger.aggregate(pipeline))
    balance = result[0]["balance"] if result else 0.0

    # 2. Get current CQS band
    score = get_user_cqs_score(user_id)
    band, _ = get_cqs_details(score)

    # 3. Get 10 most recent transactions
    recent_transactions_cursor = credits_ledger.find(
        {"user_id": user_id}
    ).sort("created_at", -1).limit(10)

    recent_transactions = []
    for txn in recent_transactions_cursor:
        # Convert ObjectId to string for JSON serialization
        if "_id" in txn:
            txn["_id"] = str(txn["_id"])
        # Convert datetime objects to ISO strings for JSON serialization
        if "created_at" in txn and isinstance(txn["created_at"], datetime):
            txn["created_at"] = txn["created_at"].isoformat()
        if "expires_at" in txn and isinstance(txn["expires_at"], datetime):
            txn["expires_at"] = txn["expires_at"].isoformat()
        recent_transactions.append(txn)

    return jsonify({
        "balance": balance,
        "cqs_band": band,
        "recent_transactions": recent_transactions
    }), 200
