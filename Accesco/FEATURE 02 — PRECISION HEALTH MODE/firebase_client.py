"""
firebase_client.py
──────────────────
Central Firebase / Firestore client for Precision Health.

All other modules import from here — never initialise Firebase elsewhere.

Collections used:
  products        — product catalogue (already seeded in Firestore)
  users           — user profiles keyed by uid
  carts           — per-user cart item lists keyed by uid
  orders          — order history: orders/{uid}/history/{order_id}
  substitutions   — smart swap suggestions keyed by uid (written by substitution_engine)
  weekly_reports  — weekly health reports: weekly_reports/{uid}/weeks/{week_key}
  adaptive_models — per-user learning model keyed by uid (written by adaptive_learning_engine)

─────────────────────────────────────────────────────────────────────────────
HOW TO CONNECT YOUR FIREBASE PROJECT
─────────────────────────────────────────────────────────────────────────────
  1. Go to Firebase Console → your project
  2. Click gear icon ⚙️ → Project Settings → Service Accounts
  3. Click "Generate new private key" → downloads a JSON file
  4. Rename it to serviceAccountKey.json
  5. Place it in the same folder as this file
─────────────────────────────────────────────────────────────────────────────
"""

import json
from typing import Optional

import firebase_admin
from firebase_admin import credentials, firestore
from firebase_admin import firestore

# ---------------------------------------------------------------------------
# Initialisation (runs once per process)
# ---------------------------------------------------------------------------

def _init_firebase() -> None:
    """Initialise Firebase app if not already done."""
    if firebase_admin._apps:
        return  # already initialised

    # ─────────────────────────────────────────────────────────────────────
    # ADD YOUR serviceAccountKey.json PATH HERE if different from default
    # ─────────────────────────────────────────────────────────────────────
    creds_path = "serviceAccountKey.json"

    cred = credentials.Certificate(creds_path)
    firebase_admin.initialize_app(cred)


_init_firebase()
db = firestore.client()


# ---------------------------------------------------------------------------
# Collection references
# ---------------------------------------------------------------------------

def products_col():
    return db.collection("products")

def users_col():
    return db.collection("users")

def carts_col():
    return db.collection("carts")


# ---------------------------------------------------------------------------
# Product operations
# ---------------------------------------------------------------------------

def get_all_products() -> dict:
    """
    Fetch all products from Firestore.
    Returns dict keyed by product_id  →  { name, category, calories, ... }
    """
    docs = products_col().stream()
    return {doc.id: doc.to_dict() for doc in docs}


def get_product(product_id: str) -> Optional[dict]:
    """Fetch a single product by ID. Returns None if not found."""
    doc = products_col().document(product_id).get()
    return doc.to_dict() if doc.exists else None


def upsert_product(product_id: str, data: dict) -> None:
    """Insert or overwrite a product document."""
    products_col().document(product_id).set(data)


# ---------------------------------------------------------------------------
# User / profile operations
# ---------------------------------------------------------------------------

def get_user(uid: str) -> Optional[dict]:
    """Fetch a user profile. Returns None if not found."""
    doc = users_col().document(uid).get()
    return doc.to_dict() if doc.exists else None


def upsert_user(uid: str, data: dict) -> None:
    """Insert or overwrite a user document (profile + members)."""
    users_col().document(uid).set(data)


def list_users() -> list:
    """Return list of all user documents as dicts (includes doc id)."""
    docs = users_col().stream()
    return [{"uid": doc.id, **doc.to_dict()} for doc in docs]


# ---------------------------------------------------------------------------
# Cart operations
# ---------------------------------------------------------------------------

def get_cart(uid: str) -> list:
    """
    Return list of product_id strings in the user's cart.
    Returns empty list if cart document doesn't exist.
    """
    doc = carts_col().document(uid).get()
    if not doc.exists:
        return []
    return doc.to_dict().get("items", [])


def set_cart(uid: str, item_ids: list) -> None:
    """Overwrite the cart with a new list of product_id strings."""
    carts_col().document(uid).set({"items": item_ids})


def add_to_cart(uid: str, product_id: str) -> list:
    """
    Add product_id to user's cart (idempotent).
    Returns updated list of cart item IDs.
    """
    items = get_cart(uid)
    if product_id not in items:
        items.append(product_id)
        set_cart(uid, items)
    return items


def remove_from_cart(uid: str, product_id: str) -> list:
    """
    Remove product_id from user's cart.
    Returns updated list of cart item IDs.
    """
    items = [i for i in get_cart(uid) if i != product_id]
    set_cart(uid, items)
    return items


def clear_cart(uid: str) -> None:
    """Empty the user's cart."""
    set_cart(uid, [])
def save_feedback(user: str, score: int, review: str):
    """
    Save website feedback to Firestore.
    """

    doc = feedback_col().document()

    doc.set({
        "user": user,
        "score": score,
        "review": review,
        "createdAt": firestore.SERVER_TIMESTAMP,
    })

    return doc.id