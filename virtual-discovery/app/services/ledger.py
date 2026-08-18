import datetime
import uuid
from pymongo.errors import DuplicateKeyError

from app.config import config
from app.extensions import db, mongo_client, logger
from app.utils.cqs import get_cqs_details, get_user_cqs_score


def award_credits(user_id: str, base_amount: float, transaction_type: str, reference_id: str) -> dict:
    """
    Awards credits to a user, applying the CQS multiplier and enforcing
    the monthly cap (default Rs 2,000).

    Inserts an immutable transaction document with a configurable expiry
    (default 90 days).

    Uses a MongoDB multi-document transaction to prevent the read-then-write
    race condition on the monthly cap.  A unique index on ``reference_id``
    acts as an idempotency key, preventing double-awards for the same video.
    """
    credits_ledger = db["credits_ledger"]

    # 1. Fetch user's CQS score and multiplier
    score = get_user_cqs_score(user_id)
    band, multiplier = get_cqs_details(score)

    # 2. Calculate initial proposed amount
    proposed_amount = base_amount * multiplier

    # 3. Build the transaction document early so it's ready for insert
    now = datetime.datetime.now(datetime.timezone.utc)
    start_of_month = datetime.datetime(now.year, now.month, 1, tzinfo=datetime.timezone.utc)

    transaction = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "amount": 0.0,               # placeholder — calculated inside the txn
        "base_amount": base_amount,
        "cqs_multiplier_applied": multiplier,
        "cqs_band_at_time": band,
        "transaction_type": transaction_type,
        "reference_id": reference_id,  # unique index prevents double-award
        "created_at": now,
        "expires_at": now + datetime.timedelta(days=config.CREDIT_EXPIRY_DAYS),
    }

    # 4. Atomic cap enforcement inside a MongoDB transaction
    with mongo_client.start_session() as session:
        with session.start_transaction():
            # Aggregate this month's awarded credits (positive amounts only)
            pipeline = [
                {"$match": {
                    "user_id": user_id,
                    "created_at": {"$gte": start_of_month},
                    "amount": {"$gt": 0},
                }},
                {"$group": {
                    "_id": None,
                    "total_earned": {"$sum": "$amount"},
                }},
            ]
            result = list(credits_ledger.aggregate(pipeline, session=session))
            current_month_earnings = result[0]["total_earned"] if result else 0.0

            available_cap = config.MAX_MONTHLY_EARNING_CAP - current_month_earnings
            if available_cap <= 0:
                raise ValueError(
                    "User has already reached the maximum monthly earning cap of Rs 2,000."
                )

            final_amount = min(proposed_amount, available_cap)
            transaction["amount"] = final_amount

            # Insert (unique reference_id index enforces idempotency)
            try:
                credits_ledger.insert_one(transaction, session=session)
            except DuplicateKeyError:
                logger.warning(
                    "Duplicate reference_id '%s' — credit already awarded, skipping.",
                    reference_id,
                )
                raise ValueError(
                    f"Credits already awarded for reference '{reference_id}'."
                )

    return transaction
