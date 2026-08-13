from flask import Blueprint, request, jsonify
from app.extensions import db, mongo_client, logger
from app.auth import require_auth

cart_bp = Blueprint("cart_bp", __name__, url_prefix="/api/v1/cart")

@cart_bp.route("/add", methods=["POST"])
@require_auth
def add_to_cart(user_id: str):
    """
    Handle the 'swipe-to-cart' action.
    Expects a JSON payload containing 'sku_id' and an optional 'quantity'.
    """
    data = request.get_json() or {}
    sku_id = data.get("sku_id")
    quantity = data.get("quantity", 1)

    if not sku_id:
        return jsonify({
            "error": "Bad Request",
            "message": "Missing 'sku_id' in payload."
        }), 400

    try:
        quantity = int(quantity)
        if quantity <= 0:
            raise ValueError("Quantity must be positive")
    except (ValueError, TypeError):
        return jsonify({
            "error": "Bad Request",
            "message": "'quantity' must be a positive integer."
        }), 400

    products_collection = db["products"]
    lifecart_collection = db["lifecart"]

    # ── CRIT-1 FIX: Atomic Transaction — reserve inventory + update cart ──
    # Both operations are wrapped in a MongoDB multi-document transaction.
    # If either fails or the process crashes, MongoDB aborts both automatically.
    with mongo_client.start_session() as session:
        with session.start_transaction():
            reserve_result = products_collection.update_one(
                {"sku_id": sku_id, "units_available": {"$gte": quantity}},
                {"$inc": {"units_available": -quantity}},
                session=session,
            )

            if reserve_result.modified_count == 0:
                # Abort the transaction — no changes committed
                product = products_collection.find_one(
                    {"sku_id": sku_id}, session=session
                )
                if not product:
                    return jsonify({
                        "error": "Bad Request",
                        "message": f"Product with sku_id '{sku_id}' not found."
                    }), 400
                return jsonify({
                    "error": "Out of Stock",
                    "message": (
                        f"Insufficient inventory for sku_id '{sku_id}'. "
                        f"Requested: {quantity}, Available: {product.get('units_available', 0)}."
                    )
                }), 400

            lifecart_collection.update_one(
                {"user_id": user_id, "sku_id": sku_id},
                {"$inc": {"quantity": quantity}},
                upsert=True,
                session=session,
            )

    return jsonify({
        "status": "success",
        "message": f"Added {quantity} of {sku_id} to cart."
    }), 200
