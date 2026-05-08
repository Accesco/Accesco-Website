"""
substitution_engine.py
──────────────────────
Precision Health — Step 04: Smart Substitution Engine

How it works:
  1. Fetch last 3 orders from Firestore (via order_engine)
  2. Build a frequency map of all items the user has bought
  3. Score each item's "nutritional weakness" against the user's profile targets
  4. Pick the top weak items across those orders
  5. For each weak item — query Firestore catalogue dynamically for a better
     alternative in the SAME category (higher nutrient density, comparable price)
  6. Calculate nutrition delta (what you gain) and price delta (what you save/spend)
  7. Store suggestions back to Firestore → substitutions/{uid}
  8. Return top 2-3 substitution cards

Nothing is hardcoded — all product comparisons come from Firestore live.

Firestore structure written here:
  substitutions/
    {uid}/
      generated_at   : str  (ISO timestamp)
      based_on_orders: int  (how many orders were analysed)
      suggestions    : list [
          {
            weak_item     : { id, name, category, calories, ... },
            suggested_item: { id, name, category, calories, ... },
            reason        : str   ("Low protein, high cost per nutrient")
            delta         : {
                protein_g  : +X.Xg,
                iron_mg    : +X.Xmg,
                fibre_g    : +X.Xg,
                sugar_g    : -X.Xg,    ← negative = improvement
                sodium_mg  : -Xmg,
                price_inr  : -X        ← negative = cheaper
            },
            delta_summary : str   ("Adds 3.2g fibre and 1.8mg iron at ₹4 less")
          }
      ]
"""

from datetime import datetime, timezone
from typing import Optional

import firebase_client as db
from order_engine import get_recent_orders
from adaptive_learning_engine import get_personalised_weights


# ---------------------------------------------------------------------------
# Weakness scoring config
# ---------------------------------------------------------------------------

# How much each nutrient per 100 kcal contributes to "nutritional strength"
# A high score = nutritionally dense item
NUTRIENT_DENSITY_WEIGHTS = {
    "protein_g":  0.35,   # protein per 100 kcal → most important
    "fibre_g":    0.25,   # fibre per 100 kcal
    "iron_mg":    0.25,   # iron per 100 kcal
    "sugar_g":   -0.10,   # sugar per 100 kcal → penalise
    "sodium_mg": -0.05,   # sodium per 100 kcal → penalise (scaled)
}

# Minimum number of times an item must appear in history to be considered
MIN_FREQUENCY = 1

# Max suggestions to return
MAX_SUGGESTIONS = 3

# Price tolerance: suggest item if it costs no more than X% above the original
PRICE_TOLERANCE_PCT = 0.20   # allow up to 20% more expensive


# ---------------------------------------------------------------------------
# Nutrient density scorer
# ---------------------------------------------------------------------------

def _nutrient_density_score(product: dict, weights: dict = None) -> float:
    """
    Calculate a nutritional density score for a product.
    Higher = more nutritionally valuable per calorie.
    Score is per 100 kcal to normalise across serving sizes.

    Args:
        product: product dict with nutrient fields
        weights: personalised nutrient weights from adaptive_learning_engine.
                 Falls back to global NUTRIENT_DENSITY_WEIGHTS if not provided.
    """
    w = weights if weights is not None else NUTRIENT_DENSITY_WEIGHTS

    cal = max(product.get("calories", 1), 1)   # avoid division by zero
    per_100 = 100 / cal

    score = 0.0
    score += product.get("protein_g", 0)  * per_100 * w["protein_g"]
    score += product.get("fibre_g",   0)  * per_100 * w["fibre_g"]
    score += product.get("iron_mg",   0)  * per_100 * w["iron_mg"]
    score += product.get("sugar_g",   0)  * per_100 * w["sugar_g"]
    score += (product.get("sodium_mg", 0) / 100) * per_100 * w["sodium_mg"]

    return round(score, 4)


def _weakness_reason(product: dict) -> str:
    """
    Generate a human-readable reason why this item is nutritionally weak.
    Checks the worst offenders first.
    """
    cal      = max(product.get("calories", 1), 1)
    per_100  = 100 / cal
    reasons  = []

    if product.get("protein_g", 0) * per_100 < 2:
        reasons.append("very low protein")
    if product.get("fibre_g", 0) * per_100 < 0.5:
        reasons.append("low fibre")
    if product.get("iron_mg", 0) * per_100 < 0.2:
        reasons.append("low iron")
    if product.get("sugar_g", 0) * per_100 > 10:
        reasons.append("high sugar")
    if product.get("sodium_mg", 0) * per_100 > 50:
        reasons.append("high sodium")

    if not reasons:
        reasons.append("low overall nutritional density")

    return ", ".join(reasons).capitalize()


# ---------------------------------------------------------------------------
# Delta calculation
# ---------------------------------------------------------------------------

def _calculate_delta(weak: dict, suggested: dict) -> tuple[dict, str]:
    """
    Calculate the nutritional and price difference between two products.
    Positive delta = improvement (more of a good nutrient, less of a bad one).

    Returns:
        delta dict, human-readable summary string
    """
    fields = ["protein_g", "fibre_g", "iron_mg", "sugar_g", "sodium_mg", "price_inr"]
    delta  = {}
    for f in fields:
        delta[f] = round(suggested.get(f, 0) - weak.get(f, 0), 2)

    # Build human-readable summary
    parts = []
    if delta["protein_g"] > 0:
        parts.append(f"+{delta['protein_g']}g protein")
    if delta["fibre_g"] > 0:
        parts.append(f"+{delta['fibre_g']}g fibre")
    if delta["iron_mg"] > 0:
        parts.append(f"+{delta['iron_mg']}mg iron")
    if delta["sugar_g"] < 0:
        parts.append(f"{delta['sugar_g']}g sugar")
    if delta["sodium_mg"] < 0:
        parts.append(f"{delta['sodium_mg']}mg sodium")

    price_part = ""
    if delta["price_inr"] < 0:
        price_part = f" at ₹{abs(delta['price_inr'])} less per portion"
    elif delta["price_inr"] > 0:
        price_part = f" for ₹{delta['price_inr']} more"

    if parts:
        summary = f"Adds {', '.join(parts)}{price_part}."
    else:
        summary = f"Similar nutrition{price_part}."

    return delta, summary


# ---------------------------------------------------------------------------
# Core substitution finder
# ---------------------------------------------------------------------------

def _find_best_substitute(weak_item: dict, catalogue: dict, profile: dict, weights: dict = None) -> Optional[dict]:
    """
    Search the Firestore catalogue dynamically for the best substitute
    for a given weak item.

    Rules:
      - Must be in the SAME category as the weak item
      - Must NOT be the same product
      - Price must be within PRICE_TOLERANCE_PCT of the weak item's price
      - Must have a higher nutrient_density_score than the weak item
      - Among valid candidates, pick the one with highest density score

    Args:
        weak_item : product dict of the item to replace
        catalogue : full product catalogue from Firestore {pid: data}
        profile   : user's household nutrition profile (for context)
        weights   : personalised nutrient weights (from adaptive_learning_engine)

    Returns:
        { id, ...product fields, density_score } or None if no better option found
    """
    weak_category      = weak_item.get("category")
    weak_price         = weak_item.get("price_inr", 0)
    weak_density       = _nutrient_density_score(weak_item, weights=weights)
    price_ceiling      = weak_price * (1 + PRICE_TOLERANCE_PCT)

    best_candidate     = None
    best_density       = weak_density   # candidate must beat the weak item

    for pid, product in catalogue.items():
        # Skip if same product
        if pid == weak_item.get("id"):
            continue

        # Must be same category
        if product.get("category") != weak_category:
            continue

        # Must be within price tolerance
        candidate_price = product.get("price_inr", 0)
        if candidate_price > price_ceiling:
            continue

        # Must be nutritionally better (scored with same personalised weights)
        candidate_density = _nutrient_density_score(product, weights=weights)
        if candidate_density > best_density:
            best_density    = candidate_density
            best_candidate  = {"id": pid, **product, "density_score": candidate_density}

    return best_candidate


# ---------------------------------------------------------------------------
# History analysis
# ---------------------------------------------------------------------------

def _build_frequency_map(orders: list) -> dict:
    """
    Build a frequency map of product_ids across recent orders.
    Returns { product_id: count }
    """
    freq = {}
    for order in orders:
        for pid in order.get("item_ids", []):
            freq[pid] = freq.get(pid, 0) + 1
    return freq


def _get_item_snapshot(pid: str, orders: list) -> Optional[dict]:
    """
    Pull the most recent snapshot of a product from order history.
    Uses stored snapshots so we don't need a live Firestore call per item.
    """
    for order in orders:
        for snap in order.get("item_snapshots", []):
            if snap.get("id") == pid:
                return snap
    return None


# ---------------------------------------------------------------------------
# Firestore persistence
# ---------------------------------------------------------------------------

def _save_suggestions(uid: str, suggestions: list, orders_analysed: int) -> None:
    """Store generated suggestions to Firestore → substitutions/{uid}"""
    db.db.collection("substitutions").document(uid).set({
        "uid":               uid,
        "generated_at":      datetime.now(timezone.utc).isoformat(),
        "based_on_orders":   orders_analysed,
        "suggestions":       suggestions,
    })


def get_stored_suggestions(uid: str) -> Optional[dict]:
    """
    Fetch previously stored substitution suggestions for a user.
    Returns None if no suggestions have been generated yet.
    """
    doc = db.db.collection("substitutions").document(uid).get()
    return doc.to_dict() if doc.exists else None


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def generate_substitutions(uid: str) -> dict:
    """
    Analyse the user's recent order history and generate smart substitution
    suggestions. Results are stored in Firestore and returned.

    Args:
        uid: user id

    Returns:
        {
            uid, generated_at, based_on_orders,
            suggestions: [
                {
                    weak_item, suggested_item,
                    reason, delta, delta_summary
                }, ...
            ]
        }

    Raises:
        ValueError: if user not found or no order history exists
    """
    # ── Validate user ────────────────────────────────────────────────────────
    user = db.get_user(uid)
    if not user:
        raise ValueError(f"User '{uid}' not found")

    profile = user["profile"]

    # ── Fetch last 3 orders ──────────────────────────────────────────────────
    recent_orders = get_recent_orders(uid, n=3)
    if not recent_orders:
        raise ValueError("No order history found. Place at least one order first.")

    # ── Fetch full product catalogue from Firestore (one call) ───────────────
    catalogue = db.get_all_products()

    # ── Build frequency map of purchased items ───────────────────────────────
    freq_map = _build_frequency_map(recent_orders)

    # ── Fetch personalised nutrient weights from adaptive learning model ────────
    user_weights = get_personalised_weights(uid)

    # ── Score each purchased item for nutritional weakness ───────────────────
    scored_items = []
    for pid, count in freq_map.items():
        if count < MIN_FREQUENCY:
            continue

        # Get product data from order snapshot (avoids extra Firestore calls)
        snapshot = _get_item_snapshot(pid, recent_orders)
        if not snapshot:
            # Fall back to live Firestore fetch if snapshot missing
            snapshot = db.get_product(pid)
            if not snapshot:
                continue
            snapshot = {"id": pid, **snapshot}

        density = _nutrient_density_score(snapshot, weights=user_weights)
        scored_items.append({
            "product":  snapshot,
            "density":  density,
            "count":    count,
        })

    # Sort by density ascending — weakest items first
    scored_items.sort(key=lambda x: x["density"])

    # ── Find substitutes for the weakest items ───────────────────────────────
    suggestions   = []
    seen_categories = set()   # one suggestion per category to avoid repetition

    for entry in scored_items:
        if len(suggestions) >= MAX_SUGGESTIONS:
            break

        weak_product = entry["product"]
        category     = weak_product.get("category")

        # Skip if we already have a suggestion for this category
        if category in seen_categories:
            continue

        substitute = _find_best_substitute(weak_product, catalogue, profile, weights=user_weights)
        if not substitute:
            continue   # no better option found in Firestore for this category

        delta, delta_summary = _calculate_delta(weak_product, substitute)
        reason = _weakness_reason(weak_product)

        suggestions.append({
            "weak_item":      weak_product,
            "suggested_item": substitute,
            "reason":         reason,
            "delta":          delta,
            "delta_summary":  delta_summary,
            "frequency":      entry["count"],   # how often user bought this
        })

        seen_categories.add(category)

    # ── Persist to Firestore ─────────────────────────────────────────────────
    _save_suggestions(uid, suggestions, len(recent_orders))

    return {
        "uid":             uid,
        "generated_at":    datetime.now(timezone.utc).isoformat(),
        "based_on_orders": len(recent_orders),
        "suggestions":     suggestions,
    }
