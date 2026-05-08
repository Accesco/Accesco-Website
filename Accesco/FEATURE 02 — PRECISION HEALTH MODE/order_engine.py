"""
order_engine.py
───────────────
Precision Health — Step 04: Order Logging

Single responsibility:
  1. Read the user's current cart snapshot from Firestore
  2. Save it as an immutable order log  →  Firestore: orders/{uid}/history/{order_id}
  3. Clear the cart after placing
  4. Hand the order snapshot to substitution_engine for analysis

Does NOT touch cart add/remove logic — that stays in firebase_client.py.
Does NOT do any substitution logic — that stays in substitution_engine.py.

Firestore structure written here:
  orders/
    {uid}/
      history/
        {order_id}/
          order_id        : str   (auto-generated)
          uid             : str
          placed_at       : str   (ISO 8601 timestamp)
          item_ids        : list  [product_id, ...]
          cart_score      : int   (overall score at time of order)
          cart_totals     : dict  {calories, protein_g, iron_mg, ...}
          item_snapshots  : list  [ {id, name, category, calories, ...} ]
            ↑ full product data copied at order time so history never goes stale
              even if a product is later edited in the catalogue
"""

from datetime import datetime, timezone
from typing import Optional

import firebase_admin.firestore as fs

import firebase_client as db
from cart_scoring import score_cart


# ---------------------------------------------------------------------------
# Firestore collection helper
# ---------------------------------------------------------------------------

def _history_col(uid: str):
    """Returns the subcollection reference: orders/{uid}/history"""
    return db.db.collection("orders").document(uid).collection("history")


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def place_order(uid: str) -> dict:
    """
    Snapshot the current cart, save as an order log, clear the cart.

    Args:
        uid: user id

    Returns:
        {
            order_id     : str,
            placed_at    : str,
            item_ids     : list,
            cart_score   : int,
            cart_totals  : dict,
            item_snapshots: list,
        }

    Raises:
        ValueError: if cart is empty or user not found
    """
    # ── Validate user ────────────────────────────────────────────────────────
    user = db.get_user(uid)
    if not user:
        raise ValueError(f"User '{uid}' not found")

    # ── Read current cart ────────────────────────────────────────────────────
    item_ids = db.get_cart(uid)
    if not item_ids:
        raise ValueError("Cannot place order — cart is empty")

    # ── Fetch full product data for each item (snapshot at order time) ───────
    item_snapshots = []
    for pid in item_ids:
        product = db.get_product(pid)
        if product:
            item_snapshots.append({"id": pid, **product})

    # ── Score the cart at time of order ──────────────────────────────────────
    profile    = user["profile"]
    score_result = score_cart(profile, item_ids)
    cart_score   = score_result["overall_score"]
    cart_totals  = score_result["cart_totals"]

    # ── Build order document ─────────────────────────────────────────────────
    placed_at = datetime.now(timezone.utc).isoformat()

    order_doc = {
        "uid":            uid,
        "placed_at":      placed_at,
        "item_ids":       item_ids,
        "cart_score":     cart_score,
        "cart_totals":    cart_totals,
        "item_snapshots": item_snapshots,
    }

    # ── Save to Firestore: orders/{uid}/history/{auto_id} ───────────────────
    col_ref = _history_col(uid)
    new_doc = col_ref.add(order_doc)          # returns (timestamp, DocumentReference)
    order_id = new_doc[1].id                  # auto-generated Firestore doc ID

    order_doc["order_id"] = order_id

    # Update the doc with its own ID for easy lookup later
    col_ref.document(order_id).update({"order_id": order_id})

    # ── Clear the cart ───────────────────────────────────────────────────────
    db.clear_cart(uid)

    return order_doc


def get_order_history(uid: str, limit: int = 10) -> list:
    """
    Fetch past orders for a user, newest first.

    Args:
        uid:   user id
        limit: max number of orders to return (default 10)

    Returns:
        list of order dicts ordered by placed_at descending
    """
    docs = (
        _history_col(uid)
        .order_by("placed_at", direction=fs.Query.DESCENDING)
        .limit(limit)
        .stream()
    )
    return [doc.to_dict() for doc in docs]


def get_recent_orders(uid: str, n: int = 3) -> list:
    """
    Fetch last N orders — used by substitution_engine.

    Args:
        uid: user id
        n:   number of recent orders to fetch (default 3)

    Returns:
        list of order dicts, newest first
    """
    return get_order_history(uid, limit=n)
