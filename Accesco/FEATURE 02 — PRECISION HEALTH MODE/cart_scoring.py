"""
cart_scoring.py
───────────────
Precision Health — Step 03: Real-Time Cart Scoring Engine

Fetches live product data from Firebase Firestore (via firebase_client.py)
and scores a user's cart against their household nutrition profile.

No mock data lives here — everything comes from the database.

Public API:
    score_cart(profile: dict, item_ids: list) → dict
"""


from firebase_client import get_product
# ---------------------------------------------------------------------------
# Scoring weights
# ---------------------------------------------------------------------------

NUTRIENT_WEIGHTS = {
    "protein":  0.30,   # 30 % of overall score
    "fibre":    0.20,
    "iron":     0.20,
    "sugar":    0.15,   # penalised if over budget
    "sodium":   0.15,   # penalised if over budget
}

# Amber-flag thresholds (per single item, per serving)
AMBER_THRESHOLDS = {
    "sugar_g":   12.0,   # > 12 g sugar per serving → amber
    "sodium_mg": 600.0,  # > 600 mg sodium per serving → amber
    "fat_g":     20.0,   # > 20 g fat per serving → amber
}

# Health-boost minimum contribution thresholds (per item vs daily targets)
BOOST_MIN_PROTEIN_PCT  = 0.10   # item provides ≥ 10 % of daily protein target
BOOST_MIN_IRON_PCT     = 0.15   # item provides ≥ 15 % of daily iron target
BOOST_MIN_FIBRE_G      = 3.0    # item has ≥ 3 g fibre


# ---------------------------------------------------------------------------
# Daily target derivation from household profile
# ---------------------------------------------------------------------------

def _derive_targets(profile: dict) -> dict:
    """
    Pull daily nutrition targets out of the household profile dict
    returned by nutrition_engine.calculate_household_nutrition().
    """
    summary = profile.get("householdSummary", {})
    macros  = summary.get("macroSplit", {})

    total_cal     = summary.get("totalCalories", 2000)
    protein_g     = macros.get("protein", 50)
    carbs_g       = macros.get("carbs", 250)

    # Iron: 18 mg female default; we use a generous household average
    iron_mg       = 18.0

    # Fibre: 14 g per 1000 kcal (standard recommendation)
    fibre_g       = round((total_cal / 1000) * 14, 1)

    # Sugar: ≤ 10 % of total calories (WHO guideline)
    sugar_limit_g = round((total_cal * 0.10) / 4, 1)

    # Sodium: 2300 mg/day (upper safe limit)
    sodium_limit_mg = 2300.0

    return {
        "calories":      total_cal,
        "protein_g":     protein_g,
        "iron_mg":       iron_mg,
        "fibre_g":       fibre_g,
        "sugar_limit_g": sugar_limit_g,
        "sodium_limit_mg": sodium_limit_mg,
    }


# ---------------------------------------------------------------------------
# Per-item tagging
# ---------------------------------------------------------------------------

def _tag_item(item: dict, targets: dict) -> dict:
    """
    Attach health_boost tag and amber_flags to a product dict.
    Returns augmented dict — does not mutate original.
    """
    item = dict(item)  # shallow copy
    amber_flags = []

    # Amber checks
    if item.get("sugar_g", 0) > AMBER_THRESHOLDS["sugar_g"]:
        amber_flags.append(f"High sugar ({item['sugar_g']}g)")
    if item.get("sodium_mg", 0) > AMBER_THRESHOLDS["sodium_mg"]:
        amber_flags.append(f"High sodium ({item['sodium_mg']}mg)")
    if item.get("fat_g", 0) > AMBER_THRESHOLDS["fat_g"]:
        amber_flags.append(f"High fat ({item['fat_g']}g)")

    item["amber_flags"] = amber_flags

    # Health Boost check
    protein_contribution = item.get("protein_g", 0) / max(targets["protein_g"], 1)
    iron_contribution    = item.get("iron_mg",   0) / max(targets["iron_mg"],   1)
    fibre_g              = item.get("fibre_g",   0)

    boost = False
    tag_reason = ""
    if protein_contribution >= BOOST_MIN_PROTEIN_PCT:
        boost = True
        tag_reason = f"Good protein source ({item['protein_g']}g)"
    elif iron_contribution >= BOOST_MIN_IRON_PCT:
        boost = True
        tag_reason = f"Good iron source ({item['iron_mg']}mg)"
    elif fibre_g >= BOOST_MIN_FIBRE_G:
        boost = True
        tag_reason = f"High fibre ({fibre_g}g)"

    item["tag"]        = "health_boost" if boost else "neutral"
    item["tag_reason"] = tag_reason

    # Expose macros as sub-dict for frontend convenience
    item["macros"] = {
        "protein_g": item.get("protein_g", 0),
        "carbs_g":   item.get("carbs_g",   0),
        "fat_g":     item.get("fat_g",     0),
    }

    return item


# ---------------------------------------------------------------------------
# Overall cart scoring
# ---------------------------------------------------------------------------

def _compute_score(totals: dict, targets: dict) -> int:
    """
    Compute an overall health score (0–100) for the cart.

    Positive contributors:   protein coverage, fibre coverage, iron coverage
    Negative contributors:   sugar over-budget, sodium over-budget
    """
    protein_score = min(totals["protein_g"] / max(targets["protein_g"], 1), 1.0)
    fibre_score   = min(totals["fibre_g"]   / max(targets["fibre_g"],   1), 1.0)
    iron_score    = min(totals["iron_mg"]   / max(targets["iron_mg"],   1), 1.0)

    # Penalty: 0 = way over budget, 1 = well within budget
    sugar_score  = max(0.0, 1 - (totals["sugar_g"]   / max(targets["sugar_limit_g"],   1)))
    sodium_score = max(0.0, 1 - (totals["sodium_mg"] / max(targets["sodium_limit_mg"], 1)))

    raw = (
        protein_score * NUTRIENT_WEIGHTS["protein"]  +
        fibre_score   * NUTRIENT_WEIGHTS["fibre"]    +
        iron_score    * NUTRIENT_WEIGHTS["iron"]     +
        sugar_score   * NUTRIENT_WEIGHTS["sugar"]    +
        sodium_score  * NUTRIENT_WEIGHTS["sodium"]
    )

    return round(raw * 100)


def _build_summary(score: int, live_panel: dict) -> str:
    """Generate a short natural-language summary sentence."""
    lines = []
    if live_panel["protein_coverage_pct"] < 40:
        lines.append("add more protein-rich items")
    if live_panel["iron_gap_mg"] > 10:
        lines.append("your iron is still low")
    if live_panel["fibre_intake_g"] < live_panel["fibre_target_g"] * 0.5:
        lines.append("boost your fibre intake")
    if live_panel["sugar_budget_remaining_g"] < 5:
        lines.append("watch your sugar — budget almost used up")

    if score >= 80:
        prefix = "Great cart!"
    elif score >= 55:
        prefix = "Decent cart."
    else:
        prefix = "Needs improvement."

    if lines:
        return f"{prefix} Consider: {', '.join(lines)}."
    return f"{prefix} Your nutritional balance looks good."


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def score_cart(profile: dict, item_ids: list) -> dict:
    """
    Score the user's cart against their household nutrition profile.

    Args:
        profile:  dict from nutrition_engine.calculate_household_nutrition()
        item_ids: list of product_id strings currently in the cart

    Returns:
        {
            overall_score,
            cart_items:   [ { ...product fields, tag, tag_reason, amber_flags, macros } ],
            cart_totals:  { calories, protein_g, carbs_g, fat_g, fibre_g, iron_mg,
                            sugar_g, sodium_mg },
            live_panel:   { protein_coverage_pct, fibre_intake_g, fibre_target_g,
                            iron_gap_mg, iron_target_mg,
                            sugar_budget_remaining_g, sugar_limit_g },
            summary:      str
        }
    """
    targets = _derive_targets(profile)

    # ── Fetch products from Firestore ────────────────────────────────────────
    # Batch fetch only the products in the cart for efficiency.
    # Falls back to empty dict if a product_id is stale / missing.
    cart_products = {}
    for pid in item_ids:
        p = get_product(pid)
        if p:
            cart_products[pid] = p

    # ── Tag each item ────────────────────────────────────────────────────────
    tagged_items = []
    for pid in item_ids:
        if pid not in cart_products:
            continue
        item = {"id": pid, **cart_products[pid]}
        tagged_items.append(_tag_item(item, targets))

    # ── Aggregate totals ─────────────────────────────────────────────────────
    def _sum(field):
        return round(sum(i.get(field, 0) for i in tagged_items), 1)

    totals = {
        "calories":  _sum("calories"),
        "protein_g": _sum("protein_g"),
        "carbs_g":   _sum("carbs_g"),
        "fat_g":     _sum("fat_g"),
        "fibre_g":   _sum("fibre_g"),
        "iron_mg":   _sum("iron_mg"),
        "sugar_g":   _sum("sugar_g"),
        "sodium_mg": _sum("sodium_mg"),
    }

    # ── Live panel metrics ───────────────────────────────────────────────────
    protein_coverage_pct = round(
        min(totals["protein_g"] / max(targets["protein_g"], 1), 1.0) * 100
    )
    iron_gap_mg = round(max(targets["iron_mg"] - totals["iron_mg"], 0), 1)
    sugar_remaining = round(max(targets["sugar_limit_g"] - totals["sugar_g"], 0), 1)

    live_panel = {
        "protein_coverage_pct":      protein_coverage_pct,
        "fibre_intake_g":            totals["fibre_g"],
        "fibre_target_g":            targets["fibre_g"],
        "iron_gap_mg":               iron_gap_mg,
        "iron_target_mg":            targets["iron_mg"],
        "sugar_budget_remaining_g":  sugar_remaining,
        "sugar_limit_g":             targets["sugar_limit_g"],
    }

    overall_score = _compute_score(totals, targets) if tagged_items else 0
    summary       = _build_summary(overall_score, live_panel) if tagged_items else \
                    "Add items to your cart to see your nutrition score."

    return {
        "overall_score": overall_score,
        "cart_items":    tagged_items,
        "cart_totals":   totals,
        "live_panel":    live_panel,
        "summary":       summary,
    }
