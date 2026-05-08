# Precision Health API

Real-time grocery cart scoring, smart substitutions, weekly health reports,
and an adaptive learning model — all backed by Firebase Firestore.

Backend: **FastAPI** · Database: **Firebase Firestore**

---

## Repo structure

```
precision-health/
├── firebase_client.py           ← Firebase init + ALL Firestore read/write ops
├── nutrition_engine.py          ← Step 01: Pure calorie/macro/micro calculation
├── cart_scoring.py              ← Step 03: Real-time cart scoring vs daily targets
├── order_engine.py              ← Step 04: Order logging + cart snapshot
├── substitution_engine.py       ← Step 04: Smart product swap suggestions
├── weekly_report_engine.py      ← Step 05: Sunday-to-Saturday household report
├── adaptive_learning_engine.py  ← Step 06: Per-user learning model + feedback loop
├── main.py                      ← FastAPI app — all API routes
├── requirements.txt

```

> **Product catalogue** is already seeded in Firestore (81 products, 19 categories).
> No seed script needed — just connect and run.

---

## What each step does

| Step | File | What it does |
|------|------|-------------|
| 01 | `nutrition_engine.py` | Calculates daily calorie targets, macro splits, micronutrient watchlists per household member using Mifflin-St Jeor equation |
| 03 | `cart_scoring.py` | Scores the live cart (0–100) against daily targets in real-time. Tags items as Health Boost or Amber |
| 04 | `order_engine.py` + `substitution_engine.py` | Saves order history to Firestore. Analyses past orders to suggest smarter product swaps from live Firestore catalogue |
| 05 | `weekly_report_engine.py` | Sunday-to-Saturday household health snapshot. Auto-generates on first app open of the week. Returns goals hit, gaps, top 3 swaps, coach message |
| 06 | `adaptive_learning_engine.py` | Learning model that tracks accepted/rejected suggestions, recalibrates nutrient weights per user, detects profile changes, tracks ordering streaks |

---

## Setup (for every teammate)

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/precision-health.git
cd precision-health
pip install -r requirements.txt
```

### 4. Run the API

```bash
uvicorn main:app --reload --port 8000
```

- API docs: http://localhost:8000/docs
- Frontend UI: http://localhost:8000/ — place `frontend.html` in root

---

## How teammates integrate with this API

This is a standalone backend. Your frontend or other services just call the HTTP endpoints.

### Full user journey — in order

#### Step 1 — Create user profile (fill form once)

```bash
POST /api/user/create
{
  "name": "Rahul",
  "age": 28,
  "gender": "male",
  "weightRange": "60-70",
  "activityLevel": "moderate",
  "dietaryPreferences": ["vegetarian"]
}
```

For a family:
```bash
POST /api/user/create
{
  "name": "Sharma Family",
  "members": [
    { "age": 35, "gender": "male",   "weightRange": "70-80", "activityLevel": "moderate", "dietaryPreferences": ["vegetarian"] },
    { "age": 32, "gender": "female", "weightRange": "55-65", "activityLevel": "light",    "dietaryPreferences": ["vegan"] },
    { "age": 8,  "gender": "male",   "weightRange": "25-30", "activityLevel": "active",   "dietaryPreferences": [] }
  ]
}
```

→ Returns calculated `profile` (calories, macros, targets) + saves to Firestore `users/{uid}`
→ The `uid` is derived from the name (e.g. `"sharma-family"`) — use this for all further calls

---

#### Step 2 — Add items to cart (one product_id at a time)

```bash
POST /api/cart/rahul/add
{ "product_id": "spinach_200g" }

POST /api/cart/rahul/add
{ "product_id": "masoor_dal_500g" }
```

→ Cart list stored in Firestore `carts/{uid}` — frontend never manages the list

---

#### Step 3 — Get live scored cart

```bash
GET /api/cart/rahul
```

→ Returns score (0–100), tagged items (health_boost / amber), live panel (protein %, iron gap, sugar budget), summary message

---

#### Step 4 — Place order

```bash
POST /api/order/rahul/place
```

→ No body needed. Automatically:
- Saves order snapshot to Firestore
- Clears cart
- Generates substitution swap cards
- Updates ordering streak
- Returns all of this in one response

---

#### Step 5 — Show swap cards + collect feedback

Swap cards come back in the place order response. When user taps accept/reject:

```bash
POST /api/learning/rahul/feedback
{ "suggestion_index": 0, "feedback": "accepted" }
# feedback options: "accepted" | "rejected" | "ignored"
```

---

#### Step 6 — Weekly report (auto-generates)

```bash
GET /api/report/rahul/weekly
```

→ Returns this week's score, goals hit, gaps, top 3 swaps, coach message.
Auto-generates on first call of the week — no scheduling needed.

---

## Full API reference

### Products
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | List all 81 products from Firestore |
| GET | `/api/products/{id}` | Get a single product |

### Users
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/user/create` | Create/update user profile. Auto-triggers profile change detection |
| GET | `/api/users` | List all users |
| GET | `/api/user/{uid}` | Get a single user profile |

### Nutrition (stateless — no DB)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/v1/health/analyze` | Calculate household nutrition without saving to DB |

### Cart (Step 03)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/cart/{uid}` | Get cart with live nutrition score |
| POST | `/api/cart/{uid}/add` | Add one product — instantly re-scores |
| DELETE | `/api/cart/{uid}/remove/{product_id}` | Remove one product — instantly re-scores |
| DELETE | `/api/cart/{uid}/clear` | Clear entire cart |

### Orders (Step 04)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/order/{uid}/place` | Place order → snapshot → clear cart → substitutions → streak |
| GET | `/api/order/{uid}/history` | Get past orders newest first |

### Substitutions (Step 04)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/substitutions/{uid}` | Get stored substitution suggestions |
| POST | `/api/substitutions/{uid}/generate` | Manually re-generate substitutions |

### Weekly Report (Step 05)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/report/{uid}/weekly` | This week's report — auto-generates if not yet created |
| GET | `/api/report/{uid}/history` | Past weekly reports (up to 8 weeks) for trend charts |

### Adaptive Learning (Step 06)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/learning/{uid}` | Full learning model summary |
| POST | `/api/learning/{uid}/feedback` | Submit accepted / rejected / ignored on a suggestion |
| GET | `/api/learning/{uid}/weights` | Current personalised nutrient weights |
| POST | `/api/learning/{uid}/check-profile` | Manually trigger profile change detection |

---

## Firestore collections

| Collection | Key | Written by | Description |
|------------|-----|-----------|-------------|
| `products` | product_id | pre-seeded | 81-product catalogue — do not overwrite |
| `users` | uid | `main.py` | Profiles + household members + calculated targets |
| `carts` | uid | `firebase_client.py` | Live cart item lists |
| `orders/{uid}/history` | order_id (auto) | `order_engine.py` | Immutable order snapshots |
| `substitutions` | uid | `substitution_engine.py` | Latest swap suggestions |
| `weekly_reports/{uid}/weeks` | week_key e.g. 2025-W22 | `weekly_report_engine.py` | Weekly health snapshots |
| `adaptive_models` | uid | `adaptive_learning_engine.py` | Per-user learning model + weights |

---

## Module dependency map

```
main.py  (head — routes everything)
  ├── nutrition_engine.py          pure math, no DB, no framework
  ├── cart_scoring.py              → firebase_client (get_product, get_all_products)
  ├── order_engine.py              → firebase_client + cart_scoring
  ├── substitution_engine.py       → firebase_client + order_engine
  │                                → adaptive_learning_engine (get_personalised_weights)
  ├── weekly_report_engine.py      → firebase_client + order_engine
  │                                → substitution_engine (get_stored_suggestions)
  ├── adaptive_learning_engine.py  → firebase_client
  └── firebase_client.py           → Firebase SDK (single init point)
```

---

## How the adaptive learning loop works (Step 06)

```
User places order
      ↓
auto_detect_ignored()     — suggestions shown but not acted on → "ignored"
      ↓
generate_substitutions()  — uses get_personalised_weights() not global defaults
      ↓
User sees suggestions → taps "accept" or "reject"
      ↓
POST /api/learning/{uid}/feedback
      ↓
log_feedback() → _maybe_recalibrate()
      ↓
If rejections of a nutrient >= threshold (2):
  weights[nutrient] -= 0.03  (engine deprioritises that nutrient)
If accepted:
  weights[nutrient] += 0.03  (engine prioritises that nutrient more)
      ↓
Weights renormalised → saved to Firestore adaptive_models/{uid}
      ↓
Next substitution generation uses new personalised weights
```

Profile change detection runs automatically on every `POST /api/user/create`.
If dietary preferences change → stale substitutions are invalidated →
next order triggers fresh suggestions based on the updated profile.

---

## Google Colab deployment

```python
!pip install fastapi uvicorn pyngrok firebase-admin python-dotenv nest-asyncio -q

import nest_asyncio, uvicorn, threading, os
from pyngrok import ngrok

nest_asyncio.apply()
ngrok.set_auth_token("YOUR_NGROK_TOKEN")

os.environ["FIREBASE_CREDENTIALS_JSON"] = '{"type":"service_account",...}'

public_url = ngrok.connect(8000)
print("Public URL:", public_url)

threading.Thread(
    target=uvicorn.run,
    kwargs={"app": "main:app", "port": 8000}
).start()
```
