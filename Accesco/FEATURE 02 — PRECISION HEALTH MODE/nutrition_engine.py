"""
nutrition_engine.py
────────────────────
Precision Health — Step 01: Household Nutrition Calculator

Pure calculation module — NO web framework here.
Import calculate_household_nutrition() wherever you need it.

The FastAPI route that exposes this lives in main.py → POST /v1/health/analyze
"""

# ---------------------------------------------------------------------------
# Nutrition lookup tables
# ---------------------------------------------------------------------------

# Activity level multipliers (Mifflin-St Jeor equation)
ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2,
    "light":     1.375,
    "moderate":  1.55,
    "active":    1.725,
}

# Macro ratios (protein_ratio, carbs_ratio, fats_ratio) per dietary preference
DIETARY_MACRO_RATIOS = {
    "keto":              (0.25, 0.05, 0.70),
    "diabetic-friendly": (0.25, 0.40, 0.35),
    "vegan":             (0.20, 0.55, 0.25),
    "vegetarian":        (0.20, 0.50, 0.30),
    "gluten-free":       (0.25, 0.45, 0.30),
    "low-sodium":        (0.25, 0.45, 0.30),
    "default":           (0.25, 0.45, 0.30),
}

# Micronutrients to watch per dietary preference
MICRONUTRIENT_WATCHLIST = {
    "vegan":             ["Iron", "Calcium", "Vitamin B12", "Vitamin D"],
    "vegetarian":        ["Iron", "Calcium", "Vitamin B12"],
    "keto":              ["Calcium", "Vitamin D", "Magnesium"],
    "diabetic-friendly": ["Vitamin D", "Magnesium", "Chromium"],
    "gluten-free":       ["Iron", "Calcium", "Vitamin B12", "Folate"],
    "low-sodium":        ["Potassium", "Magnesium"],
    "default":           ["Iron", "Calcium", "Vitamin B12", "Vitamin D"],
}


# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------
##==================weight range here we can change to weight(Int) single value as well

def _parse_weight(weight_range: str) -> float:
    """Convert weight range string (e.g. '60-70') to midpoint float."""
    try:
        if "-" in str(weight_range):
            lo, hi = weight_range.split("-")
            return (float(lo) + float(hi)) / 2
        return float(weight_range)
    except (ValueError, AttributeError):
        return 70.0


def _calculate_bmr(age: int, weight_kg: float, gender: str) -> float:
    """
    Basal Metabolic Rate — Mifflin-St Jeor equation.
    Assumes average height: 170 cm male / 160 cm female.
    """
    if gender == "female":
        return (10 * weight_kg) + (6.25 * 160) - (5 * age) - 161
    return (10 * weight_kg) + (6.25 * 170) - (5 * age) + 5


def _get_macro_ratio(dietary_preferences: list) -> tuple:
    """
    Return macro ratio for the highest-priority dietary preference.
    Priority: keto > diabetic-friendly > vegan > vegetarian > gluten-free > low-sodium
    """
    priority = ["keto", "diabetic-friendly", "vegan", "vegetarian", "gluten-free", "low-sodium"]
    for pref in priority:
        if pref in dietary_preferences:
            return DIETARY_MACRO_RATIOS[pref]
    return DIETARY_MACRO_RATIOS["default"]


def _get_micronutrients(dietary_preferences: list) -> list:
    """Return merged, sorted micronutrient watchlist for given dietary preferences."""
    watchlist: set = set()
    matched = False
    for pref in dietary_preferences:
        if pref in MICRONUTRIENT_WATCHLIST:
            watchlist.update(MICRONUTRIENT_WATCHLIST[pref])
            matched = True
    if not matched:
        watchlist.update(MICRONUTRIENT_WATCHLIST["default"])
    return sorted(watchlist)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def calculate_member_nutrition(member: dict) -> dict:
    """
    Calculate full nutrition profile for a single household member.

    Args:
        member: {
            age, gender, weightRange, activityLevel, dietaryPreferences
        }

    Returns:
        { calories, macros: {protein, carbs, fats}, micronutrients, alerts }
    """
    age            = int(member.get("age", 25))
    gender         = str(member.get("gender", "other")).lower()
    weight_range   = member.get("weightRange", "60-80")
    activity_level = str(member.get("activityLevel", "moderate")).lower()
    dietary_prefs  = member.get("dietaryPreferences", [])

    weight_kg      = _parse_weight(weight_range)
    bmr            = _calculate_bmr(age, weight_kg, gender)
    multiplier     = ACTIVITY_MULTIPLIERS.get(activity_level, 1.4)
    total_calories = round(bmr * multiplier)

    protein_ratio, carbs_ratio, fats_ratio = _get_macro_ratio(dietary_prefs)
    protein_g = round((total_calories * protein_ratio) / 4)
    carbs_g   = round((total_calories * carbs_ratio)   / 4)
    fats_g    = round((total_calories * fats_ratio)    / 9)

    micronutrients = _get_micronutrients(dietary_prefs)

    alerts = []
    if age >= 60:
        alerts.append("Senior member: Consider Calcium and Vitamin D supplementation.")
    if age < 18:
        alerts.append("Minor member: Higher calcium and iron needs for growth.")

    return {
        "calories": total_calories,
        "macros": {
            "protein": protein_g,
            "carbs":   carbs_g,
            "fats":    fats_g,
        },
        "micronutrients": micronutrients,
        "alerts":         alerts,
    }


def calculate_household_nutrition(household: list) -> dict:
    """
    Process a list of household members and return combined nutrition profile.

    Args:
        household: list of member dicts (see calculate_member_nutrition)

    Returns:
        {
            version, householdSummary: {totalCalories, macroSplit},
            members: [...], alerts: [...]
        }
    """
    member_results = [calculate_member_nutrition(m) for m in household]

    total_calories = sum(m["calories"]          for m in member_results)
    total_protein  = sum(m["macros"]["protein"] for m in member_results)
    total_carbs    = sum(m["macros"]["carbs"]   for m in member_results)
    total_fats     = sum(m["macros"]["fats"]    for m in member_results)

    all_alerts: list = []
    for m in member_results:
        all_alerts.extend(m.get("alerts", []))

    return {
        "version": "1.0",
        "householdSummary": {
            "totalCalories": total_calories,
            "macroSplit": {
                "protein": total_protein,
                "carbs":   total_carbs,
                "fats":    total_fats,
            },
        },
        "members": member_results,
        "alerts":  all_alerts,
    }
