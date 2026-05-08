"""
weekly_report_engine.py
────────────────────────
Precision Health — Step 05: Weekly Health Report Engine

Generates a Sunday-to-Sunday household nutrition summary.

How it works:
  1. Frontend calls GET /api/report/{uid}/weekly on any day
  2. Backend calculates the current week window (last Sunday → this Sunday)
  3. Checks Firestore — was a report already generated for this week?
     → YES: return stored report instantly
     → NO:  generate fresh report, store it, return it
  4. Report compares:
       weekly TARGETS  (from nutrition_engine × 7 days, household-aware)
       weekly INTAKE   (from order history within the week window, Option A:
                        ordered = consumed)

Report sections returned to frontend:
  ┌─────────────────────────────────────────────────┐
  │  week_window     : { start, end }               │
  │  household_size  : int                          │
  │  goals_hit       : [ { nutrient, pct, status }] │
  │  gaps            : [ { nutrient, gap, message }]│
  │  top_swaps       : [ substitution cards × 3 ]   │
  │  orders_this_week: int                          │
  │  weekly_score    : int  (0–100)                 │
  │  coach_message   : str  (tone: coach, not MD)   │
  └─────────────────────────────────────────────────┘

Firestore structure written here:
  weekly_reports/
    {uid}/
      weeks/
        {week_key}/          ← e.g. "2025-W22"  (ISO week: year-Www)
          generated_at  : str
          week_window   : { start, end }
          household_size: int
          goals_hit     : list
          gaps          : list
          top_swaps     : list
          orders_this_week: int
          weekly_score  : int
          coach_message : str
"""

from datetime import datetime, timezone, timedelta
from typing import Optional

import firebase_admin.firestore as fs
import firebase_client as db
from order_engine import get_order_history
from substitution_engine import get_stored_suggestions


# ---------------------------------------------------------------------------
# Week window helpers  (Sunday → Saturday, generates every Sunday)
# ---------------------------------------------------------------------------

def _get_week_window(reference: Optional[datetime] = None) -> tuple[datetime, datetime, str]:
    """
    Calculate the Sunday-to-Saturday window for the current week.

    Returns:
        (week_start, week_end, week_key)
        week_key format: "YYYY-Www"  e.g. "2025-W22"
    """
    now = reference or datetime.now(timezone.utc)

    # weekday(): Monday=0 … Sunday=6
    # Days since last Sunday
    days_since_sunday = (now.weekday() + 1) % 7

    week_start = (now - timedelta(days=days_since_sunday)).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    week_end = (week_start + timedelta(days=6)).replace(
        hour=23, minute=59, second=59, microsecond=999999
    )

    # ISO week key — use the Sunday date to identify the week
    week_key = week_start.strftime("%Y-W%W")

    return week_start, week_end, week_key


def _is_in_window(placed_at_str: str, week_start: datetime, week_end: datetime) -> bool:
    """Check if an order's placed_at timestamp falls within the week window."""
    try:
        placed_at = datetime.fromisoformat(placed_at_str)
        # Ensure timezone aware
        if placed_at.tzinfo is None:
            placed_at = placed_at.replace(tzinfo=timezone.utc)
        return week_start <= placed_at <= week_end
    except (ValueError, TypeError):
        return False


# ---------------------------------------------------------------------------
# Firestore helpers
# ---------------------------------------------------------------------------

def _weeks_col(uid: str):
    """Returns Firestore subcollection: weekly_reports/{uid}/weeks"""
    return db.db.collection("weekly_reports").document(uid).collection("weeks")


def _get_stored_report(uid: str, week_key: str) -> Optional[dict]:
    """Fetch a stored weekly report. Returns None if not yet generated."""
    doc = _weeks_col(uid).document(week_key).get()
    return doc.to_dict() if doc.exists else None


def _save_report(uid: str, week_key: str, report: dict) -> None:
    """Persist the generated report to Firestore."""
    _weeks_col(uid).document(week_key).set(report)


# ---------------------------------------------------------------------------
# Weekly target calculator  (household-aware)
# ---------------------------------------------------------------------------

def _weekly_targets(profile: dict) -> dict:
    """
    Derive WEEKLY nutrition targets from the household profile.

    Multiplies daily targets × 7.
    Household-aware: uses householdSummary totals which already aggregate
    all members (or just one member if single-person household).

    Returns:
        {
            calories_kcal, protein_g, carbs_g, fats_g,
            iron_mg, fibre_g, sugar_limit_g, sodium_limit_mg
        }
    """
    summary    = profile.get("householdSummary", {})
    macros     = summary.get("macroSplit", {})
    total_cal  = summary.get("totalCalories", 2000)

    daily = {
        "calories_kcal":    total_cal,
        "protein_g":        macros.get("protein", 50),
        "carbs_g":          macros.get("carbs",  250),
        "fats_g":           macros.get("fats",    70),
        # Derived micronutrient targets
        "iron_mg":          18.0,                           # WHO daily recommendation
        "fibre_g":          round((total_cal / 1000) * 14, 1),  # 14g per 1000 kcal
        "sugar_limit_g":    round((total_cal * 0.10) / 4, 1),   # ≤10% of calories
        "sodium_limit_mg":  2300.0,                         # upper safe limit
    }

    # Weekly = daily × 7
    return {k: round(v * 7, 1) for k, v in daily.items()}


# ---------------------------------------------------------------------------
# Weekly intake aggregator  (Option A: ordered = consumed)
# ---------------------------------------------------------------------------

def _weekly_intake(orders_this_week: list) -> dict:
    """
    Aggregate actual nutrient intake from all orders placed this week.
    Uses cart_totals stored in each order document.

    Returns:
        { calories_kcal, protein_g, carbs_g, fats_g,
          iron_mg, fibre_g, sugar_g, sodium_mg }
    """
    totals = {
        "calories_kcal": 0.0,
        "protein_g":     0.0,
        "carbs_g":       0.0,
        "fats_g":        0.0,
        "iron_mg":       0.0,
        "fibre_g":       0.0,
        "sugar_g":       0.0,
        "sodium_mg":     0.0,
    }

    for order in orders_this_week:
        ct = order.get("cart_totals", {})
        totals["calories_kcal"] += ct.get("calories",  0)
        totals["protein_g"]     += ct.get("protein_g", 0)
        totals["carbs_g"]       += ct.get("carbs_g",   0)
        totals["fats_g"]        += ct.get("fat_g",     0)
        totals["iron_mg"]       += ct.get("iron_mg",   0)
        totals["fibre_g"]       += ct.get("fibre_g",   0)
        totals["sugar_g"]       += ct.get("sugar_g",   0)
        totals["sodium_mg"]     += ct.get("sodium_mg", 0)

    return {k: round(v, 1) for k, v in totals.items()}


# ---------------------------------------------------------------------------
# Goals & gaps analyser
# ---------------------------------------------------------------------------

def _analyse_goals(targets: dict, intake: dict) -> tuple[list, list]:
    """
    Compare weekly targets vs actual intake.

    Returns:
        goals_hit : list of nutrients where intake ≥ 70% of target
        gaps      : list of nutrients where intake < 70% of target
                    (or over-limit nutrients)
    """
    # Positive nutrients: higher = better
    POSITIVE = {
        "protein_g": "Protein",
        "fibre_g":   "Fibre",
        "iron_mg":   "Iron",
    }

    # Limit nutrients: lower = better (flag if intake > 80% of limit)
    LIMITS = {
        "sugar_g":    ("Sugar",  "sugar_limit_g"),
        "sodium_mg":  ("Sodium", "sodium_limit_mg"),
    }

    goals_hit = []
    gaps      = []

    # Check positive nutrients
    for key, label in POSITIVE.items():
        target = targets.get(key, 1)
        actual = intake.get(key, 0)
        pct    = round((actual / max(target, 1)) * 100)

        entry = {
            "nutrient": label,
            "target":   target,
            "actual":   actual,
            "pct":      pct,
        }

        if pct >= 70:
            entry["status"]  = "hit"
            entry["message"] = f"You got {pct}% of your weekly {label.lower()} target. Great job!"
            goals_hit.append(entry)
        else:
            gap = round(target - actual, 1)
            entry["status"]  = "gap"
            entry["gap"]     = gap
            entry["message"] = _gap_message(label, pct, gap)
            gaps.append(entry)

    # Check limit nutrients
    for key, (label, limit_key) in LIMITS.items():
        limit  = targets.get(limit_key, 1)
        actual = intake.get(key, 0)
        pct    = round((actual / max(limit, 1)) * 100)

        entry = {
            "nutrient": label,
            "limit":    limit,
            "actual":   actual,
            "pct_used": pct,
        }

        if pct > 80:
            entry["status"]  = "over"
            entry["message"] = f"Your weekly {label.lower()} was {pct}% of the safe limit. Try to cut back."
            gaps.append(entry)
        else:
            entry["status"]  = "ok"
            entry["message"] = f"{label} intake is within a healthy range this week."
            goals_hit.append(entry)

    return goals_hit, gaps


def _gap_message(nutrient: str, pct: int, gap: float) -> str:
    """Generate a coach-style gap message for a nutrient shortfall."""
    messages = {
        "Protein": (
            f"Protein was only {pct}% of target this week. "
            f"Adding {gap}g more — try dal, eggs, or tofu in your next order."
        ),
        "Fibre": (
            f"Fibre was {pct}% of target. "
            f"You need {gap}g more — leafy greens and legumes are your best bet."
        ),
        "Iron": (
            f"Iron reached only {pct}% of the weekly target. "
            f"A {gap}mg gap — spinach, rajma, and oats can help close it."
        ),
    }
    return messages.get(nutrient, f"{nutrient} was {pct}% of your weekly target. Try to boost it next week.")


# ---------------------------------------------------------------------------
# Weekly score calculator
# ---------------------------------------------------------------------------

def _compute_weekly_score(targets: dict, intake: dict, orders_count: int) -> int:
    """
    Compute an overall weekly health score (0–100).

    Components:
      - Protein coverage  30%
      - Fibre coverage    20%
      - Iron coverage     20%
      - Sugar within limit 15%
      - Sodium within limit 15%

    Bonus: +5 if user placed 2+ orders this week (consistency)
    """
    def coverage(actual, target):
        return min(actual / max(target, 1), 1.0)

    def within_limit(actual, limit):
        return max(0.0, 1 - (actual / max(limit, 1)))

    raw = (
        coverage(intake["protein_g"],  targets["protein_g"])  * 0.30 +
        coverage(intake["fibre_g"],    targets["fibre_g"])    * 0.20 +
        coverage(intake["iron_mg"],    targets["iron_mg"])    * 0.20 +
        within_limit(intake["sugar_g"],   targets["sugar_limit_g"])   * 0.15 +
        within_limit(intake["sodium_mg"], targets["sodium_limit_mg"]) * 0.15
    )

    score = round(raw * 100)

    # Consistency bonus
    if orders_count >= 2:
        score = min(score + 5, 100)

    return score


# ---------------------------------------------------------------------------
# Coach message generator
# ---------------------------------------------------------------------------

def _coach_message(score: int, goals_hit: list, gaps: list, household_size: int) -> str:
    """
    Generate a single warm, coach-style summary message.
    Tone: practical and encouraging, NOT medical.
    """
    household_word = "your household" if household_size > 1 else "you"
    hit_count      = len([g for g in goals_hit if g.get("status") == "hit"])
    gap_nutrients  = [g["nutrient"] for g in gaps if g.get("status") == "gap"]

    if score >= 80:
        msg = f"Strong week! {household_word.capitalize()} nailed the nutrition basics."
    elif score >= 60:
        top_gap = gap_nutrients[0] if gap_nutrients else "a few nutrients"
        msg = f"Decent week overall. {household_word.capitalize()} hit {hit_count} goals — {top_gap} could use a boost next week."
    elif score >= 40:
        gaps_str = " and ".join(gap_nutrients[:2]) if gap_nutrients else "key nutrients"
        msg = f"Room to grow. Focus on getting more {gaps_str} into {household_word}r weekly shop."
    else:
        msg = (
            f"Tough week nutritionally — but that's what this is for. "
            f"Check the swap suggestions below to make next week count."
        )

    return msg


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def get_weekly_report(uid: str) -> dict:
    """
    Get the weekly health report for a user / household.

    Option B logic:
      - Calculate this week's Sunday-to-Saturday window
      - If report already exists in Firestore for this week → return it instantly
      - If not → generate fresh, store, return

    Args:
        uid: user id

    Returns:
        Full weekly report dict (see module docstring for shape)

    Raises:
        ValueError: if user not found
    """
    # ── Validate user ────────────────────────────────────────────────────────
    user = db.get_user(uid)
    if not user:
        raise ValueError(f"User '{uid}' not found")

    # ── Calculate week window ────────────────────────────────────────────────
    week_start, week_end, week_key = _get_week_window()

    # ── Check if report already exists for this week ─────────────────────────
    stored = _get_stored_report(uid, week_key)
    if stored:
        stored["from_cache"] = True
        return stored

    # ── Generate fresh report ────────────────────────────────────────────────
    profile        = user["profile"]
    members        = user.get("members", [])
    household_size = len(members) if members else 1

    # Weekly targets (household-aware — householdSummary already aggregates all members)
    weekly_targets = _weekly_targets(profile)

    # Fetch ALL order history and filter to this week's window
    all_orders = get_order_history(uid, limit=50)
    orders_this_week = [
        o for o in all_orders
        if _is_in_window(o.get("placed_at", ""), week_start, week_end)
    ]

    # Aggregate weekly intake from orders
    weekly_intake = _weekly_intake(orders_this_week)

    # Analyse goals and gaps
    goals_hit, gaps = _analyse_goals(weekly_targets, weekly_intake)

    # Compute overall weekly score
    weekly_score = _compute_weekly_score(weekly_targets, weekly_intake, len(orders_this_week))

    # Pull top swaps from substitution engine (already stored from last order)
    stored_subs = get_stored_suggestions(uid)
    top_swaps   = []
    if stored_subs:
        raw_swaps = stored_subs.get("suggestions", [])[:3]
        for swap in raw_swaps:
            top_swaps.append({
                "from":          swap.get("weak_item",      {}).get("name", ""),
                "to":            swap.get("suggested_item", {}).get("name", ""),
                "delta_summary": swap.get("delta_summary", ""),
                "reason":        swap.get("reason", ""),
            })

    # Coach message
    coach_message = _coach_message(weekly_score, goals_hit, gaps, household_size)

    # ── Build report ─────────────────────────────────────────────────────────
    report = {
        "uid":            uid,
        "week_key":       week_key,
        "generated_at":   datetime.now(timezone.utc).isoformat(),
        "from_cache":     False,
        "week_window": {
            "start": week_start.isoformat(),
            "end":   week_end.isoformat(),
        },
        "household_size":    household_size,
        "orders_this_week":  len(orders_this_week),
        "weekly_score":      weekly_score,
        "weekly_targets":    weekly_targets,
        "weekly_intake":     weekly_intake,
        "goals_hit":         goals_hit,
        "gaps":              gaps,
        "top_swaps":         top_swaps,
        "coach_message":     coach_message,
    }

    # ── Persist to Firestore ─────────────────────────────────────────────────
    _save_report(uid, week_key, report)

    return report


def get_report_history(uid: str, limit: int = 8) -> list:
    """
    Fetch past weekly reports for a user, newest first.
    Useful for showing a "last 8 weeks" trend on the frontend.

    Args:
        uid:   user id
        limit: max number of weekly reports to return

    Returns:
        list of report dicts ordered newest first
    """
    if not db.get_user(uid):
        raise ValueError(f"User '{uid}' not found")

    docs = (
        _weeks_col(uid)
        .order_by("generated_at", direction=fs.Query.DESCENDING)
        .limit(limit)
        .stream()
    )
    return [doc.to_dict() for doc in docs]
