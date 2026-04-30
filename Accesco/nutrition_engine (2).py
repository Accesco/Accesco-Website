"""
Precision Health Mode - Step 01: Household Health Setup

Calculates per-member calorie targets, macronutrient ratios,
and micronutrient watchlists from household profile data.

Expected request body (POST /v1/health/analyze):
{
    "household": [
        {
            "age": 25,
            "gender": "male",
            "weightRange": "60-70",
            "activityLevel": "moderate",
            "dietaryPreferences": ["vegetarian", "gluten-free"]
        }
    ],
    "user_id": "abc-123"
}

Response:
{
    "version": "1.0",
    "user_id": "abc-123",
    "householdSummary": {
        "totalCalories": 4800,
        "macroSplit": { "protein": 240, "carbs": 540, "fats": 160 }
    },
    "members": [
        {
            "calories": 2400,
            "macros": { "protein": 120, "carbs": 270, "fats": 80 },
            "micronutrients": ["Iron", "Calcium", "Vitamin B12", "Vitamin D"],
            "alerts": []
        }
    ],
    "alerts": []
}
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


# ---------------------------------------------------------------------------
# Nutrition lookup tables
# ---------------------------------------------------------------------------

# Activity level multipliers based on Mifflin-St Jeor equation
ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2,
    "light":     1.375,
    "moderate":  1.55,
    "active":    1.725,
}

# Macro ratios (protein, carbs, fats) per dietary preference
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
# Calculation helpers
# ---------------------------------------------------------------------------

def parse_weight(weight_range: str) -> float:
    """Convert weight range string (e.g. '60-70') to midpoint float."""
    try:
        if "-" in str(weight_range):
            parts = weight_range.split("-")
            return (float(parts[0]) + float(parts[1])) / 2
        return float(weight_range)
    except (ValueError, AttributeError):
        return 70.0


def calculate_bmr(age: int, weight_kg: float, gender: str) -> float:
    """
    Basal Metabolic Rate using Mifflin-St Jeor equation.
    Assumes average height: 170cm for male, 160cm for female.
    """
    if gender == "female":
        return (10 * weight_kg) + (6.25 * 160) - (5 * age) - 161
    return (10 * weight_kg) + (6.25 * 170) - (5 * age) + 5


def get_macro_ratio(dietary_preferences: list) -> tuple:
    """
    Return macro ratio for the highest priority dietary preference.
    Priority: keto > diabetic-friendly > vegan > vegetarian > gluten-free > low-sodium > default
    """
    priority = ["keto", "diabetic-friendly", "vegan", "vegetarian", "gluten-free", "low-sodium"]
    for pref in priority:
        if pref in dietary_preferences:
            return DIETARY_MACRO_RATIOS[pref]
    return DIETARY_MACRO_RATIOS["default"]


def get_micronutrients(dietary_preferences: list) -> list:
    """Return merged micronutrient watchlist for given dietary preferences."""
    watchlist = set()
    matched = False
    for pref in dietary_preferences:
        if pref in MICRONUTRIENT_WATCHLIST:
            watchlist.update(MICRONUTRIENT_WATCHLIST[pref])
            matched = True
    if not matched:
        watchlist.update(MICRONUTRIENT_WATCHLIST["default"])
    return sorted(list(watchlist))


def calculate_member_nutrition(member: dict) -> dict:
    """Calculate full nutrition profile for a single household member."""
    age            = int(member.get("age", 25))
    gender         = str(member.get("gender", "other")).lower()
    weight_range   = member.get("weightRange", "60-80")
    activity_level = str(member.get("activityLevel", "moderate")).lower()
    dietary_prefs  = member.get("dietaryPreferences", [])

    weight_kg      = parse_weight(weight_range)
    bmr            = calculate_bmr(age, weight_kg, gender)
    multiplier     = ACTIVITY_MULTIPLIERS.get(activity_level, 1.4)
    total_calories = round(bmr * multiplier)

    protein_ratio, carbs_ratio, fats_ratio = get_macro_ratio(dietary_prefs)

    protein_g = round((total_calories * protein_ratio) / 4)
    carbs_g   = round((total_calories * carbs_ratio)   / 4)
    fats_g    = round((total_calories * fats_ratio)    / 9)

    micronutrients = get_micronutrients(dietary_prefs)

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
    """Process full household array and return combined nutrition profile."""
    member_results = [calculate_member_nutrition(m) for m in household]

    total_calories = sum(m["calories"]          for m in member_results)
    total_protein  = sum(m["macros"]["protein"] for m in member_results)
    total_carbs    = sum(m["macros"]["carbs"]   for m in member_results)
    total_fats     = sum(m["macros"]["fats"]    for m in member_results)

    household_alerts = []
    for m in member_results:
        household_alerts.extend(m.get("alerts", []))

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
        "alerts":  household_alerts,
    }


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/v1/health/analyze")
async def analyze(request: dict):
    household        = request.get("household", [])
    user_id          = request.get("user_id", None)  # received from form, echoed back

    result           = calculate_household_nutrition(household)
    result["user_id"] = user_id

    return result
