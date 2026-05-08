"""
main.py
───────
Precision Health — FastAPI Application Entry Point

All API routes live here. Business logic is delegated to:
  ├── nutrition_engine.py           → calorie / macro calculations
  ├── cart_scoring.py               → cart health scoring (reads products from Firestore)
  ├── order_engine.py               → order logging + cart snapshot to Firestore
  ├── substitution_engine.py        → smart product swap suggestions from order history
  ├── weekly_report_engine.py       → Sunday-to-Saturday household health report
  ├── adaptive_learning_engine.py   → per-user learning model + feedback loop (Step 06)
  └── firebase_client.py            → all Firestore read/write operations

Run locally:
    uvicorn main:app --reload --port 8000

"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field
from typing import List, Optional

from nutrition_engine import calculate_household_nutrition
from cart_scoring import score_cart
from order_engine import place_order, get_order_history
from substitution_engine import generate_substitutions, get_stored_suggestions
from weekly_report_engine import get_weekly_report, get_report_history
from adaptive_learning_engine import (
    get_learning_summary,
    log_feedback,
    check_profile_change,
    auto_detect_ignored,
    update_ordering_streak,
    get_personalised_weights,
)
import firebase_client as db

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Precision Health API",
    description="Real-time cart scoring with Firebase Firestore",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class HouseholdMember(BaseModel):
    age:                int             = Field(25,ge=1, le=120)
    gender:             str             = Field("male")
    weightRange:        str             = Field("60-70")
    activityLevel:      str             = Field("moderate")
    dietaryPreferences: List[str]       = Field(default_factory=list)


class CreateUserRequest(BaseModel):
    name:    str
    members: Optional[List[HouseholdMember]] = None

    # Single-member shorthand fields (used when members list is not provided)
    age:                Optional[int]       = None
    gender:             Optional[str]       = None
    weightRange:        Optional[str]       = None
    activityLevel:      Optional[str]       = None
    dietaryPreferences: Optional[List[str]] = None


class AddToCartRequest(BaseModel):
    product_id: str


# For FRONT END DEV, CAN USE TO PREVIEW THE REPORT
class AnalyzeRequest(BaseModel):
    household: List[HouseholdMember]
    user_id:   Optional[str] = None


class FeedbackRequest(BaseModel):
    suggestion_index: int   = Field(..., ge=0, description="0-based index of the suggestion")
    feedback:         str   = Field(..., description="'accepted' | 'rejected' | 'ignored'")


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _uid_from_name(name: str) -> str:
    return name.strip().lower().replace(" ", "_")

#======SCORE REAL TIME USER CART AFTER EVERY PRODUCT IS ADDED IN THE USER'S CART (REAL TIME CART SCORING) 
def _scored_response(uid: str) -> dict:
    """Fetch user + cart from Firestore, run scoring, return result dict."""
    user = db.get_user(uid)
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{uid}' not found")

    item_ids = db.get_cart(uid)
    profile  = user["profile"]
    result   = score_cart(profile, item_ids)

    return {"success": True, "result": result, "cart_ids": item_ids}


# ---------------------------------------------------------------------------
# Routes — Products
# ---------------------------------------------------------------------------
#Will optimise it later not every product to be fetch/pull at same time !!!!!!! (Optimization)
@app.get("/api/products", summary="List all products from Firestore")
def get_products():
    """
    Returns the full product catalogue stored in Firestore.
    Seed it first with:  python seed_firestore.py
    """
    catalogue = db.get_all_products()
    products  = [{"id": pid, **p} for pid, p in catalogue.items()]
    return {"success": True, "products": products}


@app.get("/api/products/{product_id}", summary="Get a single product")
def get_product(product_id: str):
    product = db.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"success": True, "product": {"id": product_id, **product}}


# ---------------------------------------------------------------------------
# Routes — Nutrition analysis (standalone, no user required)
# ---------------------------------------------------------------------------

@app.post("/v1/health/analyze", summary="Analyse household nutrition (no user saved)")
async def analyze_nutrition(request: AnalyzeRequest):
    """
    Stateless endpoint — calculates nutrition for a household list.
    Does NOT create a user or save anything to Firestore.
    """
    household = [m.model_dump() for m in request.household]
    result    = calculate_household_nutrition(household)
    result["user_id"] = request.user_id
    return result


# ---------------------------------------------------------------------------
# Routes — Users
# ---------------------------------------------------------------------------

@app.post("/api/user/create", summary="Create or update a user profile in Firestore")
async def create_user(request: CreateUserRequest):
    """
    Creates or updates a user profile.

    On every call — new user or profile update — this runs a full cascade:

      1. nutrition_engine     → recalculates targets with new profile
      2. Firestore users/     → saves new profile + members
      3. adaptive_learning_engine → detects if profile actually changed
         If changed:
           - Clears stale substitution suggestions  (order history untouched)
           - Clears this week's cached weekly report (past reports untouched)
           - Records change with timestamp in adaptive model
           - All future recommendations use new targets from next order onwards
         If unchanged:
           - Nothing cleared, no disruption

    Order history is NEVER cleared on profile update.
    """
    uid = _uid_from_name(request.name)

    if request.members:
        members = [m.model_dump() for m in request.members]
    else:
        members = [{
            "age":                request.age            or 25,
            "gender":             request.gender          or "male",
            "weightRange":        request.weightRange     or "60-70",
            "activityLevel":      request.activityLevel   or "moderate",
            "dietaryPreferences": request.dietaryPreferences or [],
        }]

    # Step 01: recalculate nutrition targets with updated profile
    profile = calculate_household_nutrition(members)

    # Save to Firestore
    db.upsert_user(uid, {
        "name":    request.name,
        "profile": profile,
        "members": members,
    })

    # Initialise cart if it doesn't exist yet (new users only)
    if db.get_cart(uid) is None:
        db.set_cart(uid, [])

    # Step 06: run profile change cascade
    # - detects change via MD5 hash comparison
    # - clears stale suggestions + weekly report cache if changed
    # - order history is never touched
    cascade = check_profile_change(uid)

    return {
        "success":                True,
        "user_id":                uid,
        "profile":                profile,
        "profile_changed":        cascade["changed"],
        "substitutions_cleared":  cascade["substitutions_cleared"],
        "weekly_report_cleared":  cascade["weekly_report_cleared"],
        "cascade_summary":        cascade["cascade_summary"],
    }


@app.get("/api/users", summary="List all users")
def list_users():
    return {"success": True, "users": db.list_users()}


@app.get("/api/user/{uid}", summary="Get a single user profile")
def get_user(uid: str):
    user = db.get_user(uid)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True, "user": user}


# ---------------------------------------------------------------------------
# Routes — Cart
# ---------------------------------------------------------------------------

@app.get("/api/cart/{uid}", summary="Get cart with live nutrition score")
def get_cart(uid: str):
    return _scored_response(uid)


@app.post("/api/cart/{uid}/add", summary="Add a product to cart")
async def add_to_cart(uid: str, body: AddToCartRequest):
    if not db.get_user(uid):
        raise HTTPException(status_code=404, detail="User not found")
    if not db.get_product(body.product_id):
        raise HTTPException(status_code=404, detail="Product not found")

    db.add_to_cart(uid, body.product_id)
    return _scored_response(uid)


@app.delete("/api/cart/{uid}/remove/{product_id}", summary="Remove a product from cart")
def remove_from_cart(uid: str, product_id: str):
    if not db.get_user(uid):
        raise HTTPException(status_code=404, detail="User not found")

    db.remove_from_cart(uid, product_id)
    return _scored_response(uid)


@app.delete("/api/cart/{uid}/clear", summary="Clear the entire cart")
def clear_cart(uid: str):
    if not db.get_user(uid):
        raise HTTPException(status_code=404, detail="User not found")

    db.clear_cart(uid)
    return _scored_response(uid)


# ---------------------------------------------------------------------------
# Routes — Orders  (Step 04)
# ---------------------------------------------------------------------------

@app.post("/api/order/{uid}/place", summary="Place order — saves cart as order log, clears cart")
def place_order_route(uid: str):
    """
    Snapshots the current cart → saves to Firestore orders/{uid}/history
    → clears the cart → triggers substitution analysis + adaptive learning update.

    Full flow:
      1. Reads current cart from Firestore
      2. Fetches full product data for each item (snapshot)
      3. Scores the cart at time of order
      4. Saves order log to Firestore
      5. Clears the cart
      6. Auto-detects ignored substitution suggestions (Step 06)
      7. Runs substitution engine on updated history
      8. Updates ordering streak (Step 06)
      9. Returns order summary + fresh substitution suggestions
    """
    try:
        order = place_order(uid)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Step 06: auto-detect ignored suggestions before generating new ones
    try:
        ignored_count = auto_detect_ignored(uid)
    except Exception:
        ignored_count = 0

    # Auto-run substitution engine after every order
    try:
        substitutions = generate_substitutions(uid)
    except ValueError:
        substitutions = None

    # Step 06: update ordering streak
    # Derive current week key from the order's placed_at timestamp
    try:
        from weekly_report_engine import _get_week_window
        _, _, week_key = _get_week_window()
        streak_info = update_ordering_streak(uid, week_key)
    except Exception:
        streak_info = None

    return {
        "success":         True,
        "order":           order,
        "substitutions":   substitutions,
        "ignored_detected": ignored_count,
        "streak":          streak_info,
    }


@app.get("/api/order/{uid}/history", summary="Get past order history for a user")
def order_history_route(uid: str, limit: int = 10):
    """
    Returns past orders newest first.
    Each order includes: item_ids, cart_score, cart_totals, item_snapshots, placed_at.
    """
    if not db.get_user(uid):
        raise HTTPException(status_code=404, detail="User not found")

    history = get_order_history(uid, limit=limit)
    return {"success": True, "uid": uid, "orders": history, "count": len(history)}


# ---------------------------------------------------------------------------
# Routes — Substitutions  (Step 04)
# ---------------------------------------------------------------------------

@app.get("/api/substitutions/{uid}", summary="Get stored substitution suggestions for a user")
def get_substitutions_route(uid: str):
    """
    Returns the last generated substitution suggestions.
    Suggestions are auto-generated when an order is placed.
    """
    if not db.get_user(uid):
        raise HTTPException(status_code=404, detail="User not found")

    suggestions = get_stored_suggestions(uid)
    if not suggestions:
        return {
            "success":     True,
            "uid":         uid,
            "message":     "No suggestions yet. Place at least one order first.",
            "suggestions": [],
        }

    return {"success": True, **suggestions}


@app.post("/api/substitutions/{uid}/generate", summary="Manually re-generate substitution suggestions")
def regenerate_substitutions_route(uid: str):
    """
    Re-runs the substitution engine against the latest order history.
    Useful if the product catalogue has been updated since last order.
    """
    if not db.get_user(uid):
        raise HTTPException(status_code=404, detail="User not found")

    try:
        result = generate_substitutions(uid)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"success": True, **result}


# ---------------------------------------------------------------------------
# Routes — Weekly Health Report  (Step 05)
# ---------------------------------------------------------------------------

@app.get("/api/report/{uid}/weekly", summary="Get this week's household health report")
def weekly_report_route(uid: str):
    """
    Returns the Sunday-to-Saturday weekly nutrition report for the household.
    Auto-generates fresh if not yet created for this week, otherwise returns cache.
    """
    try:
        report = get_weekly_report(uid)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return {"success": True, **report}


@app.get("/api/report/{uid}/history", summary="Get past weekly reports (up to 8 weeks)")
def report_history_route(uid: str, limit: int = 8):
    """
    Returns past weekly reports newest first.
    Useful for a weekly score trend chart on the frontend.
    """
    try:
        history = get_report_history(uid, limit=limit)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return {"success": True, "uid": uid, "reports": history, "count": len(history)}


# ---------------------------------------------------------------------------
# Routes — Adaptive Learning  (Step 06)
# ---------------------------------------------------------------------------

@app.get("/api/learning/{uid}", summary="Get the adaptive learning model summary for a user")
def get_learning_route(uid: str):
    """
    Returns a summary of what the learning model has observed about this user:
      - acceptance / rejection / ignored counts
      - current personalised nutrient weights
      - which nutrient they respond to vs ignore
      - ordering streak
      - how many profile changes have been detected

    This is the 'living model' from Feature 02 Step 06.
    """
    if not db.get_user(uid):
        raise HTTPException(status_code=404, detail="User not found")

    try:
        summary = get_learning_summary(uid)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"success": True, **summary}


@app.post("/api/learning/{uid}/feedback", summary="Submit feedback on a substitution suggestion")
def submit_feedback_route(uid: str, body: FeedbackRequest):
    """
    Record whether the user accepted, rejected, or ignored a suggestion.

    Body:
        suggestion_index: 0-based index of the suggestion in the suggestions list
        feedback:         "accepted" | "rejected" | "ignored"

    Effect:
        - Updates the user's adaptive learning model in Firestore
        - If rejections of a nutrient exceed threshold → recalibrates weights
        - Recalibrated weights are used by the substitution engine on next generation
    """
    if not db.get_user(uid):
        raise HTTPException(status_code=404, detail="User not found")

    try:
        result = log_feedback(uid, body.suggestion_index, body.feedback)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"success": True, **result}


@app.get("/api/learning/{uid}/weights", summary="Get personalised nutrient weights for a user")
def get_weights_route(uid: str):
    """
    Returns the current personalised nutrient density weights for this user.
    Starts at global defaults and shifts based on feedback history.

    Useful for debugging the adaptive engine or displaying to the user
    as 'Your nutrition priorities'.
    """
    if not db.get_user(uid):
        raise HTTPException(status_code=404, detail="User not found")

    weights = get_personalised_weights(uid)
    return {"success": True, "uid": uid, "nutrient_weights": weights}


@app.post("/api/learning/{uid}/check-profile", summary="Manually trigger profile change detection")
def check_profile_route(uid: str):
    """
    Manually trigger the profile change cascade.

    Checks if the user's profile has changed since the learning model was last updated.

    If changed:
      - Clears stale substitution suggestions (order history untouched)
      - Clears this week's cached weekly report (past reports untouched)
      - Records change in adaptive model with timestamp
      - Fresh suggestions + report generate on next order / next app open

    Called automatically on every POST /api/user/create.
    Use this endpoint manually only if you suspect a stale state.
    """
    if not db.get_user(uid):
        raise HTTPException(status_code=404, detail="User not found")

    result = check_profile_change(uid)
    return {"success": True, **result}


# ---------------------------------------------------------------------------
# Frontend (serves the HTML UI at /)
# ---------------------------------------------------------------------------

@app.get("/", response_class=HTMLResponse, include_in_schema=False)
def index():
    try:
        with open("frontend.html", "r") as f:
            return f.read()
    except FileNotFoundError:
        return HTMLResponse(
            "<h2>Frontend not found.</h2>"
            "<p>Place <code>frontend.html</code> in the same directory as <code>main.py</code>.</p>"
            "<p>API docs: <a href='/docs'>/docs</a></p>",
            status_code=200,
        )
