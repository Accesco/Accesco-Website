"""
adaptive_learning_engine.py
────────────────────────────
Precision Health — Step 06: Adaptive Learning Engine

How it works:
  The engine maintains a per-user learning model in Firestore that tracks:

  1. SUGGESTION FEEDBACK
     Every time the substitution engine generates suggestions, the user can
     mark each suggestion as:
       - "accepted"  → bought the suggested item in a later order
       - "rejected"  → explicitly dismissed
       - "ignored"   → suggestion shown but never acted on (auto-detected
                       after next order is placed without the suggested item)

  2. REJECTION PATTERN ANALYSIS
     If a user consistently rejects suggestions for a specific nutrient focus
     (e.g. high-protein swaps), the engine:
       - Lowers that nutrient's weight in their personal density scoring
       - Boosts weights for nutrients they DO respond to
     This produces a personalised NUTRIENT_DENSITY_WEIGHTS override that the
     substitution engine uses instead of the global defaults.

  3. PROFILE CHANGE DETECTION
     On every order placement, the engine compares the current profile hash
     against the stored one.
     If a health condition / dietary preference changed:
       - Stale substitution suggestions are invalidated
       - Learning model notes the change with a timestamp
       - Next substitution generation starts fresh for the new profile

  4. CONSISTENCY TRACKING
     Tracks streaks of healthy ordering behaviour to inform coach_message tone
     in the weekly report.

Firestore structure written here:
  adaptive_models/
    {uid}/
      profile_hash        : str   (MD5 of profile JSON — change detection)
      last_updated        : str   (ISO timestamp)
      total_suggestions   : int
      total_accepted      : int
      total_rejected      : int
      total_ignored       : int
      nutrient_weights    : dict  (personalised override of NUTRIENT_DENSITY_WEIGHTS)
      rejection_counts    : dict  { nutrient_focus: int }   e.g. {"protein": 3}
      acceptance_counts   : dict  { nutrient_focus: int }
      profile_changes     : list  [ { changed_at, old_hash, new_hash } ]
      feedback_log        : list  [ { suggestion_id, weak_item_id, suggested_item_id,
                                      nutrient_focus, feedback, logged_at } ]
      ordering_streak     : int   (consecutive weeks with ≥1 order)
      last_order_week     : str   (ISO week key e.g. "2025-W22")
"""

import hashlib
import json
from datetime import datetime, timezone
from typing import Optional

import firebase_client as db


# ---------------------------------------------------------------------------
# Global default weights (mirrored from substitution_engine.py)
# These are the STARTING POINT — the engine adjusts per user over time
# ---------------------------------------------------------------------------

DEFAULT_NUTRIENT_WEIGHTS = {
    "protein_g":  0.35,
    "fibre_g":    0.25,
    "iron_mg":    0.25,
    "sugar_g":   -0.10,
    "sodium_mg": -0.05,
}

# How much to shift a weight per rejection/acceptance event
WEIGHT_ADJUSTMENT_STEP = 0.03

# Minimum and maximum clamps for any weight
WEIGHT_MIN = 0.05
WEIGHT_MAX = 0.55

# How many rejections of a nutrient focus before recalibration kicks in
REJECTION_THRESHOLD = 2

# Nutrient focus: which nutrient does each product field primarily "represent"
# Used to map a rejected/accepted suggestion back to a nutrient focus signal
FIELD_TO_FOCUS = {
    "protein_g": "protein_g",
    "fibre_g":   "fibre_g",
    "iron_mg":   "iron_mg",
    "sugar_g":   "sugar_g",
    "sodium_mg": "sodium_mg",
}


# ---------------------------------------------------------------------------
# Firestore helper
# ---------------------------------------------------------------------------

def _model_ref(uid: str):
    """Returns Firestore document reference: adaptive_models/{uid}"""
    return db.db.collection("adaptive_models").document(uid)


# ---------------------------------------------------------------------------
# Profile hash — change detection
# ---------------------------------------------------------------------------

def _hash_profile(profile: dict) -> str:
    """
    Generate a stable MD5 hash of the user profile dict.
    Used to detect when dietary preferences or health conditions change.
    """
    serialised = json.dumps(profile, sort_keys=True, default=str)
    return hashlib.md5(serialised.encode()).hexdigest()


# ---------------------------------------------------------------------------
# Model initialisation
# ---------------------------------------------------------------------------

def _default_model(uid: str, profile_hash: str) -> dict:
    """
    Build a fresh learning model for a new user.
    Called the first time we see a uid.
    """
    return {
        "uid":               uid,
        "profile_hash":      profile_hash,
        "last_updated":      datetime.now(timezone.utc).isoformat(),
        "total_suggestions": 0,
        "total_accepted":    0,
        "total_rejected":    0,
        "total_ignored":     0,
        "nutrient_weights":  dict(DEFAULT_NUTRIENT_WEIGHTS),  # personalised copy
        "rejection_counts":  {k: 0 for k in DEFAULT_NUTRIENT_WEIGHTS},
        "acceptance_counts": {k: 0 for k in DEFAULT_NUTRIENT_WEIGHTS},
        "profile_changes":   [],
        "feedback_log":      [],
        "ordering_streak":   0,
        "last_order_week":   "",
    }


def get_or_create_model(uid: str) -> dict:
    """
    Fetch the adaptive model for a user, creating a fresh one if absent.

    Args:
        uid: user id

    Returns:
        The adaptive model dict (from Firestore or freshly initialised)
    """
    user = db.get_user(uid)
    if not user:
        raise ValueError(f"User '{uid}' not found")

    profile_hash = _hash_profile(user.get("profile", {}))

    doc = _model_ref(uid).get()
    if doc.exists:
        return doc.to_dict()

    # First time — create and persist
    model = _default_model(uid, profile_hash)
    _model_ref(uid).set(model)
    return model


def _save_model(uid: str, model: dict) -> None:
    """Persist the updated model to Firestore."""
    model["last_updated"] = datetime.now(timezone.utc).isoformat()
    _model_ref(uid).set(model)


# ---------------------------------------------------------------------------
# Profile change detection
# ---------------------------------------------------------------------------

def check_profile_change(uid: str) -> dict:
    """
    Compare current profile hash against stored hash.

    If profile changed → triggers full cascade (Option B):
      1. Records the change with timestamp in the model
      2. Invalidates stale substitution suggestions
         → substitution_engine will regenerate on the NEXT order placement
         → order history is NEVER touched — preserved in full
      3. Invalidates this week's cached weekly report
         → weekly_report_engine will regenerate fresh on next app open
         → past weekly reports are NEVER touched — only current week cleared
      4. Updates profile_hash in adaptive model so next call detects correctly

    NOTE: Does NOT regenerate suggestions immediately (Option B).
          Everything recalculates on the next order cycle.

    Args:
        uid: user id

    Returns:
        {
            changed                  : bool,
            old_hash                 : str | None,
            new_hash                 : str,
            substitutions_cleared    : bool,
            weekly_report_cleared    : bool,
            cascade_summary          : str   (human-readable description)
        }
    """
    user = db.get_user(uid)
    if not user:
        raise ValueError(f"User '{uid}' not found")

    new_hash = _hash_profile(user.get("profile", {}))
    model    = get_or_create_model(uid)
    old_hash = model.get("profile_hash", "")

    # ── No change — return early ─────────────────────────────────────────────
    if new_hash == old_hash:
        return {
            "changed":                False,
            "old_hash":               old_hash,
            "new_hash":               new_hash,
            "substitutions_cleared":  False,
            "weekly_report_cleared":  False,
            "cascade_summary":        "Profile unchanged — no updates needed.",
        }

    # ── Profile changed — run cascade ────────────────────────────────────────
    changed_at = datetime.now(timezone.utc).isoformat()

    # 1. Record the change in the adaptive model
    model["profile_changes"].append({
        "changed_at": changed_at,
        "old_hash":   old_hash,
        "new_hash":   new_hash,
    })
    model["profile_hash"] = new_hash

    # 2. Invalidate stale substitution suggestions
    #    Order history (orders/{uid}/history/*) is NEVER touched.
    substitutions_cleared = False
    sub_ref = db.db.collection("substitutions").document(uid)
    if sub_ref.get().exists:
        sub_ref.delete()
        substitutions_cleared = True

    # 3. Invalidate this week's cached weekly report
    #    Past weekly reports (weekly_reports/{uid}/weeks/*) are NEVER touched —
    #    only the current week's cached document is cleared so it regenerates
    #    with updated targets on next app open.
    weekly_report_cleared = False
    try:
        from weekly_report_engine import _get_week_window, _weeks_col
        _, _, week_key = _get_week_window()
        week_doc = _weeks_col(uid).document(week_key)
        if week_doc.get().exists:
            week_doc.delete()
            weekly_report_cleared = True
    except Exception:
        pass  # weekly_report_engine not available — skip silently

    # 4. Save updated model
    _save_model(uid, model)

    # Build human-readable cascade summary
    cleared = []
    if substitutions_cleared:
        cleared.append("substitution suggestions")
    if weekly_report_cleared:
        cleared.append("this week's report cache")

    if cleared:
        cascade_summary = (
            f"Profile updated. Cleared stale {' and '.join(cleared)}. "
            f"Fresh suggestions and report will generate on your next order."
        )
    else:
        cascade_summary = (
            "Profile updated. No stale cache found. "
            "Fresh suggestions will generate on your next order."
        )

    return {
        "changed":                True,
        "old_hash":               old_hash,
        "new_hash":               new_hash,
        "substitutions_cleared":  substitutions_cleared,
        "weekly_report_cleared":  weekly_report_cleared,
        "cascade_summary":        cascade_summary,
    }


# ---------------------------------------------------------------------------
# Suggestion feedback logger
# ---------------------------------------------------------------------------

def _infer_nutrient_focus(weak_item: dict, suggested_item: dict) -> str:
    """
    Infer which nutrient was the PRIMARY reason for this substitution.
    Looks at which nutrient improved the most in the delta.
    Returns the nutrient field name (e.g. "protein_g").
    """
    gains = {}
    for field in ["protein_g", "fibre_g", "iron_mg"]:
        gain = suggested_item.get(field, 0) - weak_item.get(field, 0)
        if gain > 0:
            gains[field] = gain

    if not gains:
        # Penalised nutrient reduction (sugar/sodium)
        for field in ["sugar_g", "sodium_mg"]:
            reduction = weak_item.get(field, 0) - suggested_item.get(field, 0)
            if reduction > 0:
                gains[field] = reduction

    if not gains:
        return "protein_g"  # fallback

    return max(gains, key=gains.get)


def log_feedback(uid: str, suggestion_index: int, feedback: str) -> dict:
    """
    Record user feedback on a specific substitution suggestion.

    Args:
        uid:              user id
        suggestion_index: index of the suggestion in the suggestions list (0-based)
        feedback:         "accepted" | "rejected" | "ignored"

    Returns:
        {
            success       : bool,
            feedback      : str,
            nutrient_focus: str,
            recalibrated  : bool   (True if weights were adjusted)
        }

    Raises:
        ValueError: if user not found, invalid feedback value, or suggestion not found
    """
    VALID_FEEDBACK = {"accepted", "rejected", "ignored"}
    if feedback not in VALID_FEEDBACK:
        raise ValueError(f"feedback must be one of {VALID_FEEDBACK}")

    # Fetch current suggestions
    sub_doc = db.db.collection("substitutions").document(uid).get()
    if not sub_doc.exists:
        raise ValueError("No substitution suggestions found. Place an order first.")

    suggestions = sub_doc.to_dict().get("suggestions", [])
    if suggestion_index >= len(suggestions):
        raise ValueError(f"Suggestion index {suggestion_index} out of range (have {len(suggestions)})")

    suggestion     = suggestions[suggestion_index]
    weak_item      = suggestion.get("weak_item", {})
    suggested_item = suggestion.get("suggested_item", {})
    nutrient_focus = _infer_nutrient_focus(weak_item, suggested_item)

    model = get_or_create_model(uid)

    # Update counters
    model["total_suggestions"] += 1
    if feedback == "accepted":
        model["total_accepted"] += 1
        model["acceptance_counts"][nutrient_focus] = \
            model["acceptance_counts"].get(nutrient_focus, 0) + 1
    elif feedback == "rejected":
        model["total_rejected"] += 1
        model["rejection_counts"][nutrient_focus] = \
            model["rejection_counts"].get(nutrient_focus, 0) + 1
    else:  # ignored
        model["total_ignored"] += 1

    # Log the feedback event
    model["feedback_log"].append({
        "suggestion_index":  suggestion_index,
        "weak_item_id":      weak_item.get("id", ""),
        "suggested_item_id": suggested_item.get("id", ""),
        "nutrient_focus":    nutrient_focus,
        "feedback":          feedback,
        "logged_at":         datetime.now(timezone.utc).isoformat(),
    })

    # Recalibrate weights if rejection threshold hit
    recalibrated = _maybe_recalibrate(model, nutrient_focus, feedback)

    _save_model(uid, model)

    return {
        "success":        True,
        "feedback":       feedback,
        "nutrient_focus": nutrient_focus,
        "recalibrated":   recalibrated,
    }


# ---------------------------------------------------------------------------
# Weight recalibration
# ---------------------------------------------------------------------------

def _maybe_recalibrate(model: dict, nutrient_focus: str, feedback: str) -> bool:
    """
    Adjust personalised nutrient weights based on the latest feedback signal.

    Logic:
      - On REJECTION: if rejection_count for this nutrient hits REJECTION_THRESHOLD,
        reduce its weight. This makes the substitution engine less likely to suggest
        swaps focused on this nutrient.
      - On ACCEPTANCE: slightly boost the weight for this nutrient — the user
        responds well to it.
      - Weights are renormalised after adjustment so positive weights sum to ~1.0

    Modifies model["nutrient_weights"] in-place.

    Returns:
        True if weights were actually changed, False otherwise
    """
    weights        = model["nutrient_weights"]
    rej_counts     = model["rejection_counts"]
    acc_counts     = model["acceptance_counts"]
    nutrient       = nutrient_focus
    changed        = False

    if nutrient not in weights:
        return False

    if feedback == "rejected":
        if rej_counts.get(nutrient, 0) >= REJECTION_THRESHOLD:
            # Reduce weight for this nutrient
            current = weights[nutrient]
            if current > 0:
                # Positive weight — reduce it
                new_val = max(current - WEIGHT_ADJUSTMENT_STEP, WEIGHT_MIN)
            else:
                # Negative weight (sugar/sodium) — push it more negative = penalise more
                new_val = min(current - WEIGHT_ADJUSTMENT_STEP, -WEIGHT_MIN)
            weights[nutrient] = round(new_val, 4)
            changed = True

    elif feedback == "accepted":
        current = weights[nutrient]
        if current > 0:
            new_val = min(current + WEIGHT_ADJUSTMENT_STEP, WEIGHT_MAX)
        else:
            new_val = max(current + WEIGHT_ADJUSTMENT_STEP, -WEIGHT_MIN)
        weights[nutrient] = round(new_val, 4)
        changed = True

    if changed:
        # Renormalise positive weights so they still sum close to 1.0
        # (keeps scoring meaningful — doesn't let everything collapse or explode)
        pos_keys = [k for k, v in weights.items() if v > 0]
        pos_sum  = sum(weights[k] for k in pos_keys)
        if pos_sum > 0:
            scale = 1.0 / pos_sum
            for k in pos_keys:
                weights[k] = round(weights[k] * scale, 4)

    model["nutrient_weights"] = weights
    return changed


# ---------------------------------------------------------------------------
# Personalised weights retrieval (used by substitution_engine)
# ---------------------------------------------------------------------------

def get_personalised_weights(uid: str) -> dict:
    """
    Return the personalised nutrient density weights for a user.
    Falls back to global defaults if no model exists yet.

    This is the main integration point with substitution_engine.py —
    substitution_engine calls this instead of using its hardcoded
    NUTRIENT_DENSITY_WEIGHTS constant.

    Args:
        uid: user id

    Returns:
        dict matching the shape of NUTRIENT_DENSITY_WEIGHTS
        e.g. { "protein_g": 0.35, "fibre_g": 0.25, ... }
    """
    try:
        doc = _model_ref(uid).get()
        if doc.exists:
            weights = doc.to_dict().get("nutrient_weights", {})
            if weights:
                return weights
    except Exception:
        pass  # fall through to defaults

    return dict(DEFAULT_NUTRIENT_WEIGHTS)


# ---------------------------------------------------------------------------
# Ordering streak tracker
# ---------------------------------------------------------------------------

def update_ordering_streak(uid: str, week_key: str) -> dict:
    """
    Update the user's consecutive ordering streak.
    Called from order_engine after each successful order.

    Streak increments if the user ordered in the previous week too.
    Resets to 1 if they skipped a week.

    Args:
        uid:      user id
        week_key: current ISO week string e.g. "2025-W22"

    Returns:
        { ordering_streak: int, streak_broken: bool }
    """
    model            = get_or_create_model(uid)
    last_week        = model.get("last_order_week", "")
    current_streak   = model.get("ordering_streak", 0)
    streak_broken    = False

    if last_week == week_key:
        # Already ordered this week — no change
        pass
    elif _is_consecutive_week(last_week, week_key):
        current_streak += 1
    else:
        # Gap in ordering — reset streak
        if last_week:
            streak_broken = True
        current_streak = 1

    model["ordering_streak"]  = current_streak
    model["last_order_week"]  = week_key
    _save_model(uid, model)

    return {
        "ordering_streak": current_streak,
        "streak_broken":   streak_broken,
    }


def _is_consecutive_week(prev_week_key: str, current_week_key: str) -> bool:
    """
    Check if two ISO week keys represent consecutive weeks.
    e.g. "2025-W21" and "2025-W22" → True
         "2025-W21" and "2025-W23" → False
    """
    if not prev_week_key or not current_week_key:
        return False
    try:
        # Parse "YYYY-Www" → (year, week_number)
        def parse_week(wk: str):
            parts = wk.split("-W")
            return int(parts[0]), int(parts[1])

        py, pw = parse_week(prev_week_key)
        cy, cw = parse_week(current_week_key)

        if cy == py:
            return cw == pw + 1
        if cy == py + 1:
            # Handle year boundary (week 52/53 → week 1)
            return pw >= 52 and cw == 1
        return False
    except (ValueError, IndexError):
        return False


# ---------------------------------------------------------------------------
# Auto-detect ignored suggestions (called after order placement)
# ---------------------------------------------------------------------------

def auto_detect_ignored(uid: str) -> int:
    """
    After an order is placed, check stored suggestions.
    Any suggestion that was shown but never given explicit feedback
    AND whose suggested_item_id was NOT in the new order → mark as "ignored".

    Args:
        uid: user id

    Returns:
        Number of suggestions newly marked as ignored
    """
    from order_engine import get_recent_orders  # local import to avoid circular

    sub_doc = db.db.collection("substitutions").document(uid).get()
    if not sub_doc.exists:
        return 0

    suggestions   = sub_doc.to_dict().get("suggestions", [])
    recent_orders = get_recent_orders(uid, n=1)
    if not recent_orders:
        return 0

    last_order_ids = set(recent_orders[0].get("item_ids", []))
    model          = get_or_create_model(uid)

    # Build set of already-logged suggestion indices
    logged_indices = {
        entry["suggestion_index"]
        for entry in model.get("feedback_log", [])
        if "suggestion_index" in entry
    }

    ignored_count = 0
    for idx, suggestion in enumerate(suggestions):
        if idx in logged_indices:
            continue  # already has feedback

        suggested_id = suggestion.get("suggested_item", {}).get("id", "")
        if suggested_id and suggested_id not in last_order_ids:
            # Suggestion was shown, not acted on → ignored
            nutrient_focus = _infer_nutrient_focus(
                suggestion.get("weak_item", {}),
                suggestion.get("suggested_item", {}),
            )
            model["total_ignored"] += 1
            model["feedback_log"].append({
                "suggestion_index":  idx,
                "weak_item_id":      suggestion.get("weak_item", {}).get("id", ""),
                "suggested_item_id": suggested_id,
                "nutrient_focus":    nutrient_focus,
                "feedback":          "ignored",
                "logged_at":         datetime.now(timezone.utc).isoformat(),
            })
            ignored_count += 1

    if ignored_count:
        _save_model(uid, model)

    return ignored_count


# ---------------------------------------------------------------------------
# Public API — summary
# ---------------------------------------------------------------------------

def get_learning_summary(uid: str) -> dict:
    """
    Return a human-readable summary of what the model has learned about a user.

    Args:
        uid: user id

    Returns:
        {
            uid,
            total_suggestions, total_accepted, total_rejected, total_ignored,
            acceptance_rate_pct,
            nutrient_weights,         <- current personalised weights
            top_accepted_nutrient,    <- nutrient user responds to most
            top_rejected_nutrient,    <- nutrient user ignores most
            ordering_streak,
            profile_change_count,
            last_updated,
        }
    """
    model = get_or_create_model(uid)

    total = model.get("total_suggestions", 0)
    accepted = model.get("total_accepted", 0)
    acceptance_rate = round((accepted / total * 100), 1) if total > 0 else 0.0

    acc_counts = model.get("acceptance_counts", {})
    rej_counts = model.get("rejection_counts", {})

    top_accepted = max(acc_counts, key=acc_counts.get) if acc_counts else None
    top_rejected = max(rej_counts, key=rej_counts.get) if rej_counts else None

    return {
        "uid":                    uid,
        "total_suggestions":      total,
        "total_accepted":         accepted,
        "total_rejected":         model.get("total_rejected", 0),
        "total_ignored":          model.get("total_ignored", 0),
        "acceptance_rate_pct":    acceptance_rate,
        "nutrient_weights":       model.get("nutrient_weights", DEFAULT_NUTRIENT_WEIGHTS),
        "top_accepted_nutrient":  top_accepted,
        "top_rejected_nutrient":  top_rejected,
        "ordering_streak":        model.get("ordering_streak", 0),
        "profile_change_count":   len(model.get("profile_changes", [])),
        "last_updated":           model.get("last_updated", ""),
    }
