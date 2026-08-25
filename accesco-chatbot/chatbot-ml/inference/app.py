# Inference server for Accesco AI Chatbot
#
# Endpoints:
#   POST /predict  — classify user intent (placeholder until FAQ model is trained)
#   POST /search   — find matching products via FAISS similarity
#   POST /chat     — combined: classify intent + search products + return reply
#
# Run:
#   uvicorn inference.app:app --reload --port 8000

# Fix OpenMP thread conflict between FAISS and PyTorch on macOS
import os
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")

import json
import os
import re

import numpy as np
import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from transformers import AutoModelForSequenceClassification, AutoTokenizer

try:
    from inference.live_catalog import LiveCatalog
except ImportError:
    from live_catalog import LiveCatalog

try:
    from inference.mood_catalog import is_mood_intent, mood_has_products, get_mood_products
except ImportError:
    from mood_catalog import is_mood_intent, mood_has_products, get_mood_products

torch.set_num_threads(1)

app = FastAPI(title="Accesco Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Load artifacts on startup ──────────────────────────────────────────────

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE, "../data")
MODELS_DIR = os.path.join(BASE, "../models")

EMBED_MODEL = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")

# Live product catalog (Firestore-backed via the Next.js site's APIs).
# Replaces the static SKU-Master xlsx catalog: fetches Grokly + InstaStyle
# products, rebuilds the FAISS index in memory and hot-swaps it atomically.
# Refreshed by POST /refresh-products (site push hook) and a 10-minute poll.
SITE_URL = os.environ.get("ACCESCO_SITE_URL", "http://localhost:3000")
LIVE = LiveCatalog(
    SITE_URL,
    EMBED_MODEL,
    cache_path=os.path.join(DATA_DIR, "live_catalog.json"),
)

# Intent classifier (DistilBERT, fine-tuned on FAQ data)
INTENT_MODEL = AutoModelForSequenceClassification.from_pretrained(
    os.path.join(MODELS_DIR, "intent_model")
).to("cpu")
INTENT_TOKENIZER = AutoTokenizer.from_pretrained(
    os.path.join(MODELS_DIR, "intent_model")
)
with open(os.path.join(MODELS_DIR, "label_map.json")) as f:
    LABEL_MAP = {int(k): v for k, v in json.load(f).items()}

# Delivery coverage zones (pincode → areas, tier, score, coords)
# Built by chatbot-ml/data/build_delivery_coverage.py from the Tier List
# and coordinates spreadsheets. One zone per pincode; each zone lists the
# individual area names covered by that pincode.
with open(os.path.join(DATA_DIR, "delivery_coverage.json")) as f:
    COVERAGE = json.load(f)["zones"]

PINCODE_TO_ZONE = {z["pincode"]: z for z in COVERAGE}
# Flat lookup list: (area_name_lower, zone) for matching user area queries
AREA_INDEX = [
    (area.lower(), zone) for zone in COVERAGE for area in zone["areas"]
]
# Name → zone lookup (last zone wins if two pincodes list the same area name)
AREA_NAME_TO_ZONE = {name: zone for name, zone in AREA_INDEX}
# 3-letter abbreviations → full area name (too short for safe substring/fuzzy)
AREA_ALIASES = {"btm": "btm layout 2nd stage", "hsr": "hsr layout (sectors 1-7)"}
COVERED_PINCODE_COUNT = len(COVERAGE)

# SKU Recovery Framework index (built by chatbot-ml/data/build_recovery_index.py).
# Rows are answered via embedding retrieval — the classifier only routes.
with open(os.path.join(DATA_DIR, "recovery_index.json")) as f:
    RECOVERY_ROWS = json.load(f)["rows"]

# Embed every recovery search text once at startup; store per row so the
# query is matched against the best-fitting search text of each row.
RECOVERY_ROW_VECTORS: list[list[np.ndarray]] = []
for _row in RECOVERY_ROWS:
    texts = _row["search_texts"]
    vecs = EMBED_MODEL.encode(texts, normalize_embeddings=True).astype(np.float32)
    RECOVERY_ROW_VECTORS.append(vecs)

# SKU Recovery marketing FAQ (built by chatbot-ml/data/build_recovery_faq.py).
# 38 customer-style Q&As from SKURecovery.pdf — detailed answers for general
# and category questions the 19-row table can't express.
with open(os.path.join(DATA_DIR, "recovery_faq.json")) as f:
    RECOVERY_FAQS = json.load(f)["faqs"]

# Embed each FAQ question once at startup for semantic retrieval.
RECOVERY_FAQ_QUESTIONS = [f["question"] for f in RECOVERY_FAQS]
RECOVERY_FAQ_VECTORS = EMBED_MODEL.encode(
    RECOVERY_FAQ_QUESTIONS, normalize_embeddings=True
).astype(np.float32)

# Market-research knowledge base (built by chatbot-ml/data/build_knowledge_faq.py).
# Curated Q&As from chatbot-data/66.pdf (ICP/segments deck) + Bangalore
# Household Spending Report — answers analytics questions ("who is Accesco
# for?", "what do households overspend on?") the classifier has no intent for.
with open(os.path.join(DATA_DIR, "knowledge_faq.json")) as f:
    KNOWLEDGE_FAQS = json.load(f)["faqs"]

KNOWLEDGE_QUESTIONS = [f["question"] for f in KNOWLEDGE_FAQS]
KNOWLEDGE_VECTORS = EMBED_MODEL.encode(
    KNOWLEDGE_QUESTIONS, normalize_embeddings=True
).astype(np.float32)

# Intent → canned reply fallback (used when intent has no FAQ answer)
INTENT_REPLIES = {
    "greeting": "Hello! Welcome to Accesco Living. How can I help you today?",
    "waitlist_launch": "You can join the waitlist from the Accesco Living homepage — check the 'Get Early Access' section!",
    "grokly_grocery": "Grokly is Accesco's grocery vertical — fresh produce and essentials delivered in as fast as 11 minutes.",
    "swadisht_food": "Swadisht is Accesco's food vertical — freshly prepared meals from curated cafés and kitchens.",
    "instastyle_fashion": "InstaStyle is Accesco's fashion vertical — instant, curated delivery of outfits and wardrobe essentials.",
    "localmeds_pharmacy": "LocalMeds is Accesco's pharmacy vertical — medicines and wellness products delivered fast.",
    "xpense_budget": "Xpense Meter is Accesco's built-in budget intelligence layer — it tracks your spending across all services.",
    "circular_recycle": "Accesco runs a circular commerce model — you can return packaging to delivery partners and earn rewards.",
    "referral_rewards": "Accesco has a referral program — invite friends and family and earn rewards that scale with successful referrals.",
    "privacy_security": "Yes — your data and payment information are secure on Accesco Living.",
    "returns_refunds": "Accesco has a returns and refunds policy — our support team can help you process exchanges or refunds.",
    "support_contact": "You can reach Accesco support via the contact form on the website, or in-app once launched.",
    "comparison": "Accesco Living combines grocery, food, fashion, and pharmacy under one login — with a built-in spend tracker.",
    "delivery_order": "Accesco delivers orders fast and lets you track your delivery partner in real-time.",
    "delivery_partner": "Accesco works with gig workers and local partners — check the partner section on the website to apply.",
    "account_features": "Accesco supports shared carts, multiple addresses, and personalized recommendations across services.",
    "pricing_payment": "Accesco accepts standard payment methods including UPI, cards, and netbanking.",
    "about_brand": "Accesco Living is an intelligent commerce ecosystem built for urban Indian households.",
    # ─── 8 Mood tag replies ─────────────────────────────────────────────────
    "romantic": "Here are some romantic picks for you! Chocolates, premium treats, and special items to make the moment memorable.",
    "date-night": "Date night essentials! Desserts, drinks, and treats to set the mood for a perfect evening together.",
    "birthday": "Happy birthday prep! Cakes, snacks, drinks, and party treats — everything you need to celebrate.",
    "party": "Party time! Chips, nachos, cold drinks, and snacks to keep the good vibes going.",
    "festival": "Festive shopping! Sweets, dry fruits, snacks, and everything you need for the celebration.",
    "self-care": "Self-care day! Wellness products, healthy snacks, and pampering essentials just for you.",
    "housewarming": "Congrats on the new place! Cleaning supplies, kitchenware, and snacks for your guests.",
    "apology": "Making things right! Premium chocolates, treats, and thoughtful picks to say sorry.",
    "sports": "Game day fuel! Energy bars, protein, drinks, and snacks to power your performance.",
}


# ─── Request / Response models ──────────────────────────────────────────────

class Query(BaseModel):
    text: str
    top_k: int = 5
    # Phase 7 multilingual: ISO-style tag from the frontend language
    # detector — 'hi' (Hindi), 'te' (Telugu), 'kn' (Kannada), or None/'la'
    # for English/Latin. Regional tags trigger the translate sidecar.
    language: str | None = None

class PredictResponse(BaseModel):
    intent: str
    confidence: float

class ProductResult(BaseModel):
    product_name: str
    brand: str
    category: str
    sub_category: str
    selling_price: str
    sku_id: str
    service: str
    distance: float | None = None

class SearchResponse(BaseModel):
    query: str
    results: list[ProductResult]

class Action(BaseModel):
    """Conversion action attached to a chat reply. `url` is a relative path
    (deep link) so the same payload works in dev and prod."""
    type: str       # "order" | "redirect"
    label: str
    url: str

class ProductCard(BaseModel):
    name: str
    brand: str
    price: str
    unit: str
    image: str
    service: str
    url: str
    sku: str | None = None

class VariantInfo(BaseModel):
    """One pack/type variant of a product family (Phase 6). Shown as a chip
    in the chatbot; picking one re-queries with `query` (name + its
    distinguishing token, e.g. "Kurkure Masala Munch 22g") and lands on the
    single product card + buttons."""
    sku: str
    name: str
    brand: str
    price: str
    unit: str
    image: str
    url: str
    service: str
    query: str = ""

class ChatResponse(BaseModel):
    reply: str
    intent: str
    confidence: float
    products: list[ProductResult] | None = None
    # Phase 4c: backward-compatible conversion fields. Clients that only
    # read `reply` keep working; new clients render cards + action buttons.
    cards: list[ProductCard] | None = None
    actions: list[Action] | None = None
    # Phase 6: variant picker list (generic family query → pick a variant).
    variants: list[VariantInfo] | None = None


# ─── Intent classification (DistilBERT) ─────────────────────────────────────

INTENT_CONFIDENCE_THRESHOLD = 0.50

# If a keyword rule fires with a different intent than the model's top pick,
# trust the rule while the model is below this confidence ("namaste" → model
# says swadisht_food at 0.74; the greeting rule knows better). Above it the
# model's confident answer wins ("hi, how do I track my order?" stays delivery).
RULE_OVERRIDE_MAX_CONF = 0.90

# Keyword fallback for queries the model is unsure about (< threshold)
# Keys are intent names; values are (must_any, must_all) keyword tuples.
FALLBACK_RULES: list[tuple[str, list[str], list[str]]] = [
    ("greeting", ["hi", "hello", "hey", "namaste", "good morning", "good afternoon", "good evening", "good night"], []),
    # "partner" alone is ambiguous ("where is my delivery partner?") — requires
    # an application/work-ish secondary word. Placed before the delivery rules
    # because "delivery partner" also contains "delivery"; the model over-learns
    # the word "delivery" → delivery_order for these.
    ("delivery_partner", ["partner", "gig", "rider"], ["become", "apply", "join", "work", "job", "earn", "hiring", "how"]),
    ("delivery_order", ["deliver", "delivery", "shipping", "courier"], ["area", "where", "near", "location", "pin", "zip", "pincode", "here", "fast", "quick"]),
    # "track" needs a delivery-ish object ("track my order") so "track my
    # spending" (Xpense Meter) isn't stolen
    ("delivery_order", ["track", "tracking", "order status"], ["order", "package", "parcel", "delivery", "deliver", "status"]),
    # Delivery coverage questions ("what areas do you cover?") — the coverage
    # keywords are specific enough that no secondary keyword is required
    ("delivery_order", ["cover", "coverage", "serviceable", "serviceability"], []),
    # Non-Bengaluru city names → delivery question (coverage_reply answers
    # with the "not delivering yet" message; this rule only fixes the intent)
    ("delivery_order", ["mumbai", "delhi", "hyderabad", "chennai", "pune",
                        "kolkata", "noida", "gurgaon", "gurugram", "ahmedabad",
                        "jaipur", "chandigarh", "kochi", "lucknow", "goa"], []),
    # Circular commerce / SKU recovery framework. Placed BEFORE the product
    # rules so "do you take back milk bottles?" isn't stolen by grokly ("milk"),
    # and before returns_refunds so "can I return my packaging?" routes here.
    ("circular_recycle", ["take back", "takeback", "recycl", "e-waste", "ewaste",
                          "packaging", "empty bottle", "empty bottles", "dispose",
                          "disposal", "resale", "what happens to", "fulfillment hub",
                          "circular"], []),
    # "take X back" — the object sits between the words ("take bubble wrap
    # back?"), so "take" requires a recovery-ish secondary word. Typo variants
    # ("bak", "bottels") included so weak model confidence can't strand them.
    ("circular_recycle", ["take", "taken"], ["back", "bak", "bottle", "bottles",
                                             "bottel", "bottels", "packaging",
                                             "item", "return", "recycl", "waste",
                                             "wrap", "sachet", "container", "old"]),
    # "old" / "reuse" / "recover" / "collect" are ambiguous alone ("recover my
    # password"), so they require a recovery-ish secondary word. Note: keywords
    # of len <= 3 ("old") match as whole words — "amul gold" never hits "old".
    ("circular_recycle", ["reuse", "recover", "old", "collect"],
     ["bottle", "phone", "packaging", "item", "return", "recycl", "waste", "electronics",
      "charger", "battery", "jar", "toy", "clothes", "shoe", "container", "can", "glass"]),
    ("grokly_grocery", ["grocery", "groceries", "vegetables", "fruits", "milk", "grokly", "groceries delivered"], []),
    ("comparison", ["compare", "comparison", "versus", "vs", "instead of",
                    "different from", "better than", "zepto", "blinkit",
                    "instamart", "bigbasket", "swiggy", "zomato"], []),
    ("referral_rewards", ["referral", "invite", "inviting", "invitation", "rewards", "reward"], []),
    ("swadisht_food", ["food delivery", "swadisht", "swadish", "swadhish", "swadhissht", "food order", "restaurant"], []),
    ("instastyle_fashion", ["fashion", "clothes", "instastyle", "apparel"], []),
    ("localmeds_pharmacy", ["medicine", "pharmacy", "meds", "localmeds", "dettol", "handwash", "hand wash", "sanitizer", "soap", "dolo", "paracetamol", "crocin", "calpol"], []),
    ("xpense_budget", ["xpense", "budget", "spending", "spend tracker"], []),
    ("pricing_payment", ["price", "cost", "how much", "charge", "payment", "pay"], []),
    ("waitlist_launch", ["waitlist", "early access", "launch", "beta", "sign up", "sign-up"], []),
    ("returns_refunds", ["return", "refund", "exchange", "replace"], []),
    ("account_features", ["account", "login", "sign in", "password", "profile"], []),
    ("support_contact", ["contact", "support", "help line", "reach", "phone number", "email"], []),
    ("privacy_security", ["privacy", "secure", "data safe", "security", "personal data"], []),
    # ─── Mood tag fallback rules (8 mood tags) ────────────────────────────
    ("romantic", ["romantic", "valentine", "anniversary", "love", "surprise my partner", "proposal"], []),
    ("date-night", ["date night", "date", "evening together", "candle light", "dinner for two", "romantic dinner"], []),
    ("birthday", ["birthday", "bday", "birthday party", "birthday celebration", "birthday gift"], []),
    ("party", ["party", "house party", "get-together", "friends coming over", "hosting", "gathering"], []),
    ("festival", ["diwali", "holi", "eid", "christmas", "navratri", "rakhi", "pongal", "onam", "festival", "festive"], []),
    ("self-care", ["self care", "self-care", "pamper", "me time", "wellness", "relax", "spa day", "treat myself"], []),
    ("housewarming", ["housewarming", "new flat", "new house", "just moved", "griha pravesh", "settling in"], []),
    ("apology", ["sorry", "apology", "apologize", "make up", "patch up", "forgive", "messed up", "my fault"], []),
    ("sports", ["cricket", "football", "gym", "workout", "playing", "match", "sports", "fitness", "exercise"], []),
]

def keyword_intent(text: str) -> str | None:
    """Rule-based intent from FALLBACK_RULES, or None if no rule matches.
    Short keywords (<=3 chars, e.g. "hi") match as whole words so they
    don't false-positive inside longer words ("swadhissht" contains "hi")."""
    text_l = text.lower()

    def has(kw: str) -> bool:
        if len(kw) <= 3:
            return re.search(rf"\b{re.escape(kw)}\b", text_l) is not None
        return kw in text_l

    for fallback_intent, must_any, secondary in FALLBACK_RULES:
        if any(has(k) for k in must_any) and (not secondary or any(has(k) for k in secondary)):
            return fallback_intent
    return None

def classify_intent(text: str) -> tuple[str, float]:
    """Classify user intent with the fine-tuned DistilBERT model."""
    enc = INTENT_TOKENIZER(
        text, truncation=True, padding=True, max_length=128, return_tensors="pt"
    )
    with torch.no_grad():
        logits = INTENT_MODEL(**enc).logits
    probs = torch.softmax(logits, -1)
    confidence = probs.max().item()
    intent = LABEL_MAP[logits.argmax(-1).item()]
    if confidence >= INTENT_CONFIDENCE_THRESHOLD:
        # Rule-agreement: a keyword rule that disagrees with a mid-confidence
        # model pick wins ("namaste" → greeting, "dettol handwash" → LocalMeds).
        rule = keyword_intent(text)
        if rule and rule != intent and confidence < RULE_OVERRIDE_MAX_CONF:
            return rule, confidence
        return intent, confidence
    # Low confidence → fall back on keyword rules
    fallback = keyword_intent(text)
    if fallback:
        return fallback, confidence
    return "unknown", confidence


# ─── Product search via FAISS ───────────────────────────────────────────────

MAX_PRODUCT_DISTANCE = 15.0
# If the top product match is closer than this, the query is clearly about a product
PRODUCT_QUERY_DISTANCE = 1.1

def search_products(text: str, top_k: int = 5) -> tuple[list[dict], float]:
    """Embed the query and return (top_k closest products, best distance).
    Results beyond MAX_PRODUCT_DISTANCE are discarded as irrelevant.
    Searches the LIVE Firestore-backed catalog (snapshot-swapped by the
    LiveCatalog worker). Empty catalog (cold start) → empty results."""
    products, index = LIVE.snapshot()
    if index is None or not products:
        return [], MAX_PRODUCT_DISTANCE
    vec = EMBED_MODEL.encode([text]).astype(np.float32)
    distances, indices = index.search(vec, min(top_k, len(products)))
    results = []
    best_distance = float("inf")
    for idx, dist in zip(indices[0], distances[0]):
        if idx < 0 or idx >= len(products):
            continue
        if dist > MAX_PRODUCT_DISTANCE:
            continue
        best_distance = min(best_distance, float(dist))
        p = products[int(idx)]
        results.append({
            "product_name": p["name"],
            "brand": p["brand"],
            "category": p["category"],
            "sub_category": p["sub_category"],
            "selling_price": p["price"],
            "sku_id": p["sku"],
            "service": p["service"],
            "unit": p.get("unit", ""),
            "image": p.get("image", ""),
            "url": p.get("url", ""),
            "in_stock": p.get("in_stock", True),
            "distance": float(dist),
        })
    if best_distance == float("inf"):
        best_distance = MAX_PRODUCT_DISTANCE
    return results, best_distance


# ─── Phase 4d: Commerce routing (order_product / order_category) ────────────
#
# Conversion layer layered on TOP of classify_intent(). No DistilBERT
# retraining: the 17 labels are product-agnostic. "order_product" and
# "order_category" are synthesized in the response only. Precedence:
#   tight product > category redirect > loose order product > vertical
# It absorbs the legacy product-search branch and only fires when it has
# something to say — otherwise chat() falls through to canned replies.

ORDER_PRODUCT_DISTANCE = 1.6  # looser FAISS bar when an explicit order verb present

# Explicit purchase intent phrasings (short verbs match as whole words)
ORDER_VERBS = [
    "order", "buy", "purchase", "get me", "get myself", "send me",
    "i want", "want to", "wanna", "i need", "need", "need to", "wish to",
    "looking for", "grab", "pick up", "deliver to me",
]

# intent → (deep-link URL, button label) for vertical-level redirects.
# Threaded through info replies (actions) and used for order-by-vertical.
VERTICAL_LINKS = {
    "grokly_grocery": ("/services/grokly", "Shop groceries on Grokly"),
    "swadisht_food": ("/services/swadisht", "Shop food on Swadisht"),
    "instastyle_fashion": ("/services/instastyle", "Shop fashion on InstaStyle"),
    "localmeds_pharmacy": ("/services/localmeds", "Shop medicines on LocalMeds"),
}

# keyword / synonym → (category deep-link, button label). Longest phrase
# wins. Pharmacy items deliberately stay OFF here so "medicines" redirects
# to the LocalMeds vertical, not a Grokly category shelf.
CATEGORY_LINKS = {
    # Grokly categories (18 ids from app/services/grokly/lib/groklyData.js)
    "milk": ("/services/grokly/category/dairy-breakfast", "Browse Dairy & Breakfast on Grokly"),
    "dairy": ("/services/grokly/category/dairy-breakfast", "Browse Dairy & Breakfast on Grokly"),
    "eggs": ("/services/grokly/category/dairy-breakfast", "Browse Dairy & Breakfast on Grokly"),
    "curd": ("/services/grokly/category/dairy-breakfast", "Browse Dairy & Breakfast on Grokly"),
    "yogurt": ("/services/grokly/category/dairy-breakfast", "Browse Dairy & Breakfast on Grokly"),
    "yoghurt": ("/services/grokly/category/dairy-breakfast", "Browse Dairy & Breakfast on Grokly"),
    "paneer": ("/services/grokly/category/dairy-breakfast", "Browse Dairy & Breakfast on Grokly"),
    "cheese": ("/services/grokly/category/dairy-breakfast", "Browse Dairy & Breakfast on Grokly"),
    "butter": ("/services/grokly/category/dairy-breakfast", "Browse Dairy & Breakfast on Grokly"),
    "ghee": ("/services/grokly/category/dairy-breakfast", "Browse Dairy & Breakfast on Grokly"),
    "breakfast": ("/services/grokly/category/dairy-breakfast", "Browse Dairy & Breakfast on Grokly"),
    "cereal": ("/services/grokly/category/dairy-breakfast", "Browse Dairy & Breakfast on Grokly"),
    "vegetables": ("/services/grokly/category/vegetables-fruits", "Browse Veggies & Fruits on Grokly"),
    "veggies": ("/services/grokly/category/vegetables-fruits", "Browse Veggies & Fruits on Grokly"),
    "fruits": ("/services/grokly/category/vegetables-fruits", "Browse Veggies & Fruits on Grokly"),
    "produce": ("/services/grokly/category/vegetables-fruits", "Browse Veggies & Fruits on Grokly"),
    "snacks": ("/services/grokly/category/munchies", "Browse Munchies on Grokly"),
    "munchies": ("/services/grokly/category/munchies", "Browse Munchies on Grokly"),
    "chips": ("/services/grokly/category/munchies", "Browse Munchies on Grokly"),
    "namkeen": ("/services/grokly/category/munchies", "Browse Munchies on Grokly"),
    "crisps": ("/services/grokly/category/munchies", "Browse Munchies on Grokly"),
    "cold drink": ("/services/grokly/category/cold-drinks", "Browse Cold Drinks on Grokly"),
    "cold drinks": ("/services/grokly/category/cold-drinks", "Browse Cold Drinks on Grokly"),
    "soft drink": ("/services/grokly/category/cold-drinks", "Browse Cold Drinks on Grokly"),
    "beverages": ("/services/grokly/category/cold-drinks", "Browse Cold Drinks on Grokly"),
    "cola": ("/services/grokly/category/cold-drinks", "Browse Cold Drinks on Grokly"),
    "soda": ("/services/grokly/category/cold-drinks", "Browse Cold Drinks on Grokly"),
    "juice": ("/services/grokly/category/cold-drinks", "Browse Cold Drinks on Grokly"),
    "instant": ("/services/grokly/category/instant-frozen", "Browse Instant & Frozen on Grokly"),
    "instant food": ("/services/grokly/category/instant-frozen", "Browse Instant & Frozen on Grokly"),
    "frozen": ("/services/grokly/category/instant-frozen", "Browse Instant & Frozen on Grokly"),
    "noodles": ("/services/grokly/category/instant-frozen", "Browse Instant & Frozen on Grokly"),
    "maggi": ("/services/grokly/category/instant-frozen", "Browse Instant & Frozen on Grokly"),
    "ready to eat": ("/services/grokly/category/instant-frozen", "Browse Instant & Frozen on Grokly"),
    "tea": ("/services/grokly/category/tea-coffee", "Browse Tea & Coffee on Grokly"),
    "coffee": ("/services/grokly/category/tea-coffee", "Browse Tea & Coffee on Grokly"),
    "chai": ("/services/grokly/category/tea-coffee", "Browse Tea & Coffee on Grokly"),
    "bakery": ("/services/grokly/category/bakery-biscuits", "Browse Bakery & Biscuits on Grokly"),
    "biscuits": ("/services/grokly/category/bakery-biscuits", "Browse Bakery & Biscuits on Grokly"),
    "bread": ("/services/grokly/category/bakery-biscuits", "Browse Bakery & Biscuits on Grokly"),
    "bakes": ("/services/grokly/category/bakery-biscuits", "Browse Bakery & Biscuits on Grokly"),
    "sweet tooth": ("/services/grokly/category/sweet-tooth", "Browse Sweet Tooth on Grokly"),
    "chocolate": ("/services/grokly/category/sweet-tooth", "Browse Sweet Tooth on Grokly"),
    "candy": ("/services/grokly/category/sweet-tooth", "Browse Sweet Tooth on Grokly"),
    "desserts": ("/services/grokly/category/sweet-tooth", "Browse Sweet Tooth on Grokly"),
    "atta": ("/services/grokly/category/atta-rice-dal", "Browse Atta, Rice & Dal on Grokly"),
    "flour": ("/services/grokly/category/atta-rice-dal", "Browse Atta, Rice & Dal on Grokly"),
    "rice": ("/services/grokly/category/atta-rice-dal", "Browse Atta, Rice & Dal on Grokly"),
    "dal": ("/services/grokly/category/atta-rice-dal", "Browse Atta, Rice & Dal on Grokly"),
    "lentils": ("/services/grokly/category/atta-rice-dal", "Browse Atta, Rice & Dal on Grokly"),
    "masala": ("/services/grokly/category/masala-oil", "Browse Masala & Oil on Grokly"),
    "spices": ("/services/grokly/category/masala-oil", "Browse Masala & Oil on Grokly"),
    "oil": ("/services/grokly/category/masala-oil", "Browse Masala & Oil on Grokly"),
    "cooking oil": ("/services/grokly/category/masala-oil", "Browse Masala & Oil on Grokly"),
    "sauces": ("/services/grokly/category/sauces-spreads", "Browse Sauces & Spreads on Grokly"),
    "ketchup": ("/services/grokly/category/sauces-spreads", "Browse Sauces & Spreads on Grokly"),
    "spread": ("/services/grokly/category/sauces-spreads", "Browse Sauces & Spreads on Grokly"),
    "jam": ("/services/grokly/category/sauces-spreads", "Browse Sauces & Spreads on Grokly"),
    "organic": ("/services/grokly/category/organic-healthy", "Browse Organic & Healthy on Grokly"),
    "healthy": ("/services/grokly/category/organic-healthy", "Browse Organic & Healthy on Grokly"),
    "baby": ("/services/grokly/category/baby-care", "Browse Baby Care on Grokly"),
    "diapers": ("/services/grokly/category/baby-care", "Browse Baby Care on Grokly"),
    "baby food": ("/services/grokly/category/baby-care", "Browse Baby Care on Grokly"),
    "vitamins": ("/services/grokly/category/pharma-wellness", "Browse Pharma & Wellness on Grokly"),
    "supplements": ("/services/grokly/category/pharma-wellness", "Browse Pharma & Wellness on Grokly"),
    "wellness": ("/services/grokly/category/pharma-wellness", "Browse Pharma & Wellness on Grokly"),
    "cleaning": ("/services/grokly/category/cleaning", "Browse Cleaning on Grokly"),
    "detergent": ("/services/grokly/category/cleaning", "Browse Cleaning on Grokly"),
    "dishwash": ("/services/grokly/category/cleaning", "Browse Cleaning on Grokly"),
    "disinfectant": ("/services/grokly/category/cleaning", "Browse Cleaning on Grokly"),
    "personal care": ("/services/grokly/category/personal-care", "Browse Personal Care on Grokly"),
    "skincare": ("/services/grokly/category/personal-care", "Browse Personal Care on Grokly"),
    "skin care": ("/services/grokly/category/personal-care", "Browse Personal Care on Grokly"),
    "shampoo": ("/services/grokly/category/personal-care", "Browse Personal Care on Grokly"),
    "conditioner": ("/services/grokly/category/personal-care", "Browse Personal Care on Grokly"),
    "home": ("/services/grokly/category/home-office", "Browse Home & Office on Grokly"),
    "home & office": ("/services/grokly/category/home-office", "Browse Home & Office on Grokly"),
    "kitchen": ("/services/grokly/category/home-office", "Browse Home & Office on Grokly"),
    "stationery": ("/services/grokly/category/home-office", "Browse Home & Office on Grokly"),
    "pet": ("/services/grokly/category/pet-care", "Browse Pet Care on Grokly"),
    "pets": ("/services/grokly/category/pet-care", "Browse Pet Care on Grokly"),
    "pet care": ("/services/grokly/category/pet-care", "Browse Pet Care on Grokly"),
    "dog food": ("/services/grokly/category/pet-care", "Browse Pet Care on Grokly"),
    "pet food": ("/services/grokly/category/pet-care", "Browse Pet Care on Grokly"),
    # Food is the Swadisht vertical, not a Grokly shelf — order queries
    # redirect to the food storefront
    "food": ("/services/swadisht", "Order food on Swadisht"),
    "food delivery": ("/services/swadisht", "Order food on Swadisht"),
    "meals": ("/services/swadisht", "Order food on Swadisht"),
    "eat": ("/services/swadisht", "Order food on Swadisht"),
    # InstaStyle (catalog categories from lib/mockData.js + thrift page)
    "menswear": ("/services/instastyle/catalog?category=men", "Shop Men on InstaStyle"),
    "mens": ("/services/instastyle/catalog?category=men", "Shop Men on InstaStyle"),
    "women": ("/services/instastyle/catalog?category=women", "Shop Women on InstaStyle"),
    "womenswear": ("/services/instastyle/catalog?category=women", "Shop Women on InstaStyle"),
    "kids": ("/services/instastyle/catalog?category=kids", "Shop Kids on InstaStyle"),
    "accessories": ("/services/instastyle/catalog?category=accessories", "Shop Accessories on InstaStyle"),
    "thrift": ("/services/instastyle/thrift", "Browse Thrift on InstaStyle"),
    "second hand": ("/services/instastyle/thrift", "Browse Thrift on InstaStyle"),
    "preloved": ("/services/instastyle/thrift", "Browse Thrift on InstaStyle"),
    "clothes": ("/services/instastyle/catalog", "Shop fashion on InstaStyle"),
    "clothing": ("/services/instastyle/catalog", "Shop fashion on InstaStyle"),
    "fashion": ("/services/instastyle/catalog", "Shop fashion on InstaStyle"),
    "apparel": ("/services/instastyle/catalog", "Shop fashion on InstaStyle"),
    "wear": ("/services/instastyle/catalog", "Shop fashion on InstaStyle"),
}

def has_order_intent(text: str) -> bool:
    """'I want milk' / 'buy chips' / 'order lay's' — whole-word match for the
    short verbs so 'order status' (delivery) and 'gold' (recovery) untouched."""
    import re as _re
    tl = text.lower()
    for verb in ORDER_VERBS:
        if len(verb) <= 3:
            if _re.search(rf"\b{_re.escape(verb)}\b", tl):
                return True
        elif verb in tl:
            return True
    return False

def match_category(text: str) -> tuple[str, str] | None:
    """Return (deep-link, button label) for the best-matching category, or None.
    Longest-phrase-first, then whole-word keys, then difflib typo tolerance,
    then substring for 5+ char keys. Nothing matched → None (fall through)."""
    import difflib

    tl = text.lower()
    # 1. multi-word phrases (fixed substring; longest first)
    for phrase in sorted((k for k in CATEGORY_LINKS if " " in k),
                         key=len, reverse=True):
        if phrase in tl:
            return CATEGORY_LINKS[phrase]
    # 2. single keys that appear as whole words (short ones must be exact
    #    words — "chai" inside "chaithra"? word boundary kills it)
    single = sorted((k for k in CATEGORY_LINKS if " " not in k),
                    key=len, reverse=True)
    for key in single:
        if len(key) <= 4 and re.search(rf"\b{re.escape(key)}\b", tl):
            return CATEGORY_LINKS[key]
    # 3. difflib per token ("snakcs" → "snacks", "milk" vs "mike")
    tokens = re.findall(r"[a-z]{3,}", tl)
    for token in tokens:
        best = difflib.get_close_matches(token, single, n=1, cutoff=0.85)
        if best:
            return CATEGORY_LINKS[best[0]]
    # 4. substring for longer keys ("breakfasts", "snacking")
    for key in single:
        if len(key) >= 5 and key in tl:
            return CATEGORY_LINKS[key]
    return None

def fuzzy_brand_rank(text: str, products: list[dict]) -> list[dict]:
    """Re-rank product results so brand/name tokens beat FAISS-only ordering
    ("lace chips" → Lay's, "taaza" → Amul Taaza). Token-level difflib overlap
    with the product name + brand. Falls back to the input order untouched."""
    import difflib

    if len(products) <= 1:
        return products
    tokens = [t for t in re.findall(r"[a-z0-9]+", text.lower()) if len(t) >= 3]
    if not tokens:
        return products

    def score(p):
        corpus = (str(p.get("product_name", "")) + " " + str(p.get("brand", ""))).lower()
        cands = set(re.findall(r"[a-z0-9]+", corpus))
        if not cands:
            return 0.0
        total = 0.0
        for t in tokens:
            total += max(difflib.SequenceMatcher(None, t, c).ratio() for c in cands)
        return total / len(tokens)

    return sorted(products, key=score, reverse=True)

def product_card(p: dict) -> ProductCard:
    return ProductCard(
        name=p["product_name"],
        brand=p["brand"],
        price=p["selling_price"],
        unit=p.get("unit", ""),
        image=p.get("image", ""),
        service=p["service"],
        url=p.get("url", ""),
        sku=p.get("sku_id"),
    )

PRODUCT_INTENTS = {"grokly_grocery", "swadisht_food", "instastyle_fashion",
                   "localmeds_pharmacy", "unknown"}

# Intents that can absorb product cards / redirect buttons. Everything else
# (returns_refunds, pricing_payment, support_contact, ...) must NEVER be
# hijacked by an order verb — "I want to return my order" is a return, not a
# purchase, so it keeps the canned reply.
COMMERCE_INTENTS = PRODUCT_INTENTS | set(VERTICAL_LINKS) | {"greeting"}

def _order_action(ranked: list[dict]) -> None | list[Action]:
    """Order button for the top-ranked product ('Order on Grokly')."""
    if not ranked:
        return None
    return [Action(type="order", label=f"Order on {ranked[0]['service']}",
                   url=ranked[0]["url"])]

def _query_tokens(text: str) -> list[str]:
    """Meaningful query tokens (>=4 chars), minus category shelf keywords."""
    cat_words = set()
    for key in CATEGORY_LINKS:
        cat_words.update(w for w in key.split() if w)
    return [t for t in re.findall(r"[a-z0-9]{4,}", text.lower()) if t not in cat_words]

def _token_overlap(text: str, products: list[dict]) -> bool:
    """True when any meaningful query token appears inside any candidate's
    name+brand (+category). Stops loose FAISS hits from fabricating cards for
    queries about products that don't exist ("bag for school" → Pringles must
    not render; 'lays chips' → Lay's renders)."""
    tokens = _query_tokens(text)
    if not tokens or not products:
        return False
    for p in products[:5]:
        corpus = (" ".join(str(p.get(f) or "") for f in
                           ("product_name", "brand", "category"))).lower()
        if any(t in corpus for t in tokens):
            return True
    return False

def _brand_specific(text: str, products: list[dict], best_distance: float) -> bool:
    """True when an order+category query names an actual product/brand rather
    than just the category word ("buy Amul milk" vs "buy milk"). Category
    keywords are excluded from the query tokens, then the rest are checked
    against the top product's name+brand. Lets 'Lay's chips' keep its product
    cards while 'buy snacks' gets the category shelf."""
    if best_distance >= PRODUCT_QUERY_DISTANCE or not products:
        return False
    cat_words = set()
    for key in CATEGORY_LINKS:
        cat_words.update(w for w in key.split() if w)
    tl = text.lower()
    tokens = [t for t in re.findall(r"[a-z]{4,}", tl) if t not in cat_words]
    if not tokens:
        return False
    top = products[0]
    corpus = (str(top.get("product_name", "")) + " " + str(top.get("brand", ""))).lower()
    corpus = re.sub(r"[^a-z0-9]", "", corpus)
    for t in tokens:
        if t in corpus:
            return True
    return False


# ─── Phase 6: Variant families (curated) ────────────────────────────────────
#
# Products that are pack/type variants of the same item (Amul milk: toned vs
# full cream; Kurkure: 22g vs 78g; Tata Tea: 250g vs 500g). When the user
# asks generically about a family, the chatbot replies with the variant list
# instead of a single arbitrary card, and the user picks the pack they want.
# SKUs are curated manually — auto name-normalization is too risky ("Amul
# Taaza" vs "Amul Gold" are different products, not the same name twice).
VARIANT_GROUPS: list[dict] = [
    {
        "label": "Amul Fresh Milk",
        "skus": ["dairy-001", "dairy-002"],
    },
    {
        "label": "Kurkure Masala Munch",
        "skus": ["munch-002", "munch-012"],
    },
    {
        "label": "Pringles Original",
        "skus": ["munch-006", "munch-016"],
    },
    {
        "label": "Maggi Hot & Sweet Tomato Chilli Sauce",
        "skus": ["sauce-002", "sauce-005"],
    },
    {
        "label": "Tata Tea Gold",
        "skus": ["tea-001", "tea-006"],
    },
    {
        "label": "Mango - Alphonso",
        "skus": ["fruit-004", "veg-017"],
    },
]

def _variant_members(group: dict) -> list[dict]:
    """Group members currently present in the live catalog (sku-keyed)."""
    products, _ = LIVE.snapshot()
    by_sku = {p["sku"]: p for p in products}
    return [by_sku[sku] for sku in group["skus"] if sku in by_sku]

def _specific_variant(text: str, members: list[dict]) -> dict | None:
    """The single variant the query explicitly names, or None if the query
    is generic about the family. A variant is "named" when the query
    contains one of its distinguishing tokens — words in that variant's
    name+unit that appear in no other member (toned / gold / 22g / 500g...).
    Single-character tokens ("g", "ml") are ignored so "1kg" can't match
    the "g" in a competitor's "3 pcs (apx 600 g)". Ambiguous hits (two packs
    matched) → None → show the full list."""
    tl = text.lower()
    per_member_tokens = []
    for m in members:
        corpus = " ".join(str(m.get(f) or "") for f in
                          ("name", "product_name", "brand", "unit")).lower()
        per_member_tokens.append({t for t in re.findall(r"[a-z0-9]+", corpus)
                                  if len(t) > 1})
    named = []
    for i, m in enumerate(members):
        others = set()
        for j, toks in enumerate(per_member_tokens):
            if j != i:
                others |= toks
        distinct = per_member_tokens[i] - others
        if distinct and any(t in tl for t in distinct):
            named.append(m)
    if len(named) == 1:
        return named[0]
    return None

def variant_picker_reply(text: str, products: list[dict], best_distance: float,
                         confidence: float, intent: str) -> ChatResponse | None:
    """Phase 6: when the user asks generically about a product family that
    has >=2 curated pack variants, reply with the variant list instead of a
    single arbitrary card. The frontend renders the `variants` payload as
    chips; picking one re-queries with the variant name and lands on the
    normal single-card flow.

    Trigger rules (so unrelated queries never get hijacked):
      - query tokens overlap a family's member names ("milk", "kurkure",
        "tata tea"), and
      - no query token belongs EXCLUSIVELY to a tight non-family product
        ("oat milk" → 'oat' is Oat Milk's word, not Amul's → normal cards),
      - the query doesn't already name one specific pack ("toned milk",
        "amul gold", "kurkure 22g" → that single product's card), and
      - the family is not a recovery/circular topic."""
    if intent == "circular_recycle":
        return None
    if not products:
        return None
    # Generic shopping words ("fresh vegetables" → "fresh" lives in "Amul
    # Taaza Toned FRESH Milk") must not count as family signals. Only
    # product-identifying tokens are matched against the family's words.
    generic_words = {"fresh", "best", "good", "great", "nice", "cheap",
                     "healthy", "buy", "order", "want", "need", "get", "some",
                     "please", "show", "large", "small", "big", "natural",
                     "organic", "pure", "premium", "tasty", "daily"}
    tokens = {t for t in re.findall(r"[a-z0-9]{3,}", text.lower())
              if t not in generic_words}
    if not tokens:
        return None
    for group in VARIANT_GROUPS:
        members = _variant_members(group)
        if len(members) < 2:
            continue
        fam_words = set()
        for m in members:
            corpus = " ".join(str(m.get(f) or "") for f in
                              ("name", "product_name", "brand", "unit")).lower()
            fam_words |= set(re.findall(r"[a-z0-9]{3,}", corpus))
        if not (tokens & fam_words):
            continue
        # Competitor block: a query token that belongs only to a tight
        # non-family product means the query is about THAT product.
        blocked = False
        for p in products[:5]:
            if p["sku_id"] in group["skus"] or p.get("distance", 9e9) >= PRODUCT_QUERY_DISTANCE:
                continue
            pc = " ".join(str(p.get(f) or "") for f in ("product_name", "brand")).lower()
            exclusive = set(re.findall(r"[a-z0-9]{3,}", pc)) - fam_words
            if tokens & exclusive:
                blocked = True
                break
        if blocked:
            continue
        # A specific pack was named ("toned milk", "amul gold", "kurkure
        # 22g") → reply with that single product card + buttons, so the
        # variant-pick always lands on the Add-to-Cart flow even when the
        # query's FAISS distance is too loose for the generic P3 path.
        specific = _specific_variant(text, members)
        if specific is not None:
            sku = specific["sku"]
            products, _ = LIVE.snapshot()
            live = next((p for p in products if p["sku"] == sku), None)
            if live is None:
                return None
            card = {
                "product_name": live["name"],
                "brand": live["brand"],
                "category": live["category"],
                "sub_category": live.get("sub_category", ""),
                "selling_price": live["price"],
                "sku_id": live["sku"],
                "service": live["service"],
                "unit": live.get("unit", ""),
                "image": live.get("image", ""),
                "url": live.get("url", ""),
                "in_stock": live.get("in_stock", True),
                "distance": 0.0,
            }
            return ChatResponse(
                reply="Here you go:\n\n" + format_products([card]),
                intent="order_product" if has_order_intent(text) else "grokly_grocery",
                confidence=confidence,
                products=[ProductResult(**card)],
                cards=[product_card(card)],
                actions=_order_action([card]),
            )
        # Generic picker only for tight-ish queries (the specific-variant
        # path above is token-driven and safe at any distance).
        if best_distance >= PRODUCT_QUERY_DISTANCE:
            continue
        members.sort(key=lambda m: float(m.get("price") or 0))
        lines = []
        variants = []
        for m in members:
            corpus = " ".join(str(m.get(f) or "") for f in
                              ("name", "product_name", "brand", "unit")).lower()
            mtoks = {t for t in re.findall(r"[a-z0-9]+", corpus) if len(t) > 1}
            others = set()
            for o in members:
                if o is not m:
                    oc = " ".join(str(o.get(f) or "") for f in
                                  ("name", "product_name", "brand", "unit")).lower()
                    others |= {t for t in re.findall(r"[a-z0-9]+", oc) if len(t) > 1}
            distinct = sorted(mtoks - others)
            query = f"{m['name']} {' '.join(distinct)}".strip()
            lines.append(f"• {m['name']} — {m.get('unit', '')} — Rs. {m['price']}")
            variants.append(VariantInfo(
                sku=m["sku"], name=m["name"], brand=m["brand"], price=m["price"],
                unit=m.get("unit", ""), image=m.get("image", ""),
                url=m.get("url", ""), service=m["service"], query=query,
            ))
        reply = (
            f"We've got a few options for that:\n\n" + "\n".join(lines) +
            "\n\nTap one to pick it, or just tell me which you'd like!"
        )
        return ChatResponse(
            reply=reply, intent="order_variant", confidence=confidence,
            products=[], variants=variants,
        )
    return None

def commerce_reply(text: str, intent: str, confidence: float,
                   products: list[dict], best_distance: float):
    """Build a conversion-oriented reply (product cards / category / vertical
    redirects), or None to fall through to the legacy canned-reply path.

    Precedence:
      1. order+category demand WITHOUT a specific product → category shelf
         ("buy snacks", "i want milk") — the user wants to browse the category
      2. order+category WITH a specific product name (brand overlap) falls
         through to product cards ("i want to order lays chips")
      3. tight product match → product cards + Order button
         ("amul taaza", or a greeting that lands on a close product)
      4. order verb + loose product match → product cards
      5. order verb + vertical intent → the vertical storefront
    """
    order = has_order_intent(text)
    # Non-commerce intents (returns, pricing, support, account...) never get
    # product cards or redirects — the classic canned reply is the answer.
    if intent not in COMMERCE_INTENTS:
        return None
    tight = bool(products) and best_distance < PRODUCT_QUERY_DISTANCE
    cat = match_category(text)
    cat_ok = bool(cat) and (order or intent in VERTICAL_LINKS
                            or intent in ("unknown", "greeting"))

    # P0 — variant family picker (Phase 6): a generic query about a product
    # family with multiple packs ("milk", "kurkure") gets the variant list
    # instead of one arbitrary card. Runs before the category shelf so
    # "i want milk" offers toned/full-cream rather than a shelf redirect.
    picker = variant_picker_reply(text, products, best_distance, confidence, intent)
    if picker is not None:
        return picker

    # P1 — category shelf for an order demand that isn't brand-specific
    if cat_ok and order and not _brand_specific(text, products, best_distance):
        url, label = cat
        return ChatResponse(
            reply="Looking for that? We've got a whole selection for it — tap the shortcut below.",
            intent="order_category", confidence=confidence,
            products=[], actions=[Action(type="redirect", label=label, url=url)],
        )

    # P2 — category redirect for non-order queries with no tight product
    # ("mens t-shirts" → InstaStyle men), never stealing a tight product from
    # a plain name search ("coca cola" stays product cards)
    if cat_ok and not tight:
        url, label = cat
        return ChatResponse(
            reply="Looking for that? We've got a whole selection for it — tap the shortcut below.",
            intent="order_category", confidence=confidence,
            products=[], actions=[Action(type="redirect", label=label, url=url)],
        )

    # P3 — tight product match ("amul taaza", "coca cola", brand-specific
    #       order query that survived the category checks). Cards are trimmed
    #       to the tight window so a 1.4-distance fringe product never renders
    #       next to a 0.2 match ("mens t-shirts" → T-Shirt only, no Tawa).
    if (
        products
        and best_distance < PRODUCT_QUERY_DISTANCE
        and (intent in PRODUCT_INTENTS or intent == "greeting")
    ):
        ranked = fuzzy_brand_rank(text, products[:10])
        if intent == "greeting":
            service = ranked[0]["service"] if ranked else ""
            intent = "localmeds_pharmacy" if service == "LocalMeds" else "grokly_grocery"
        final_intent = "order_product" if has_order_intent(text) else intent
        tight_cards = [p for p in ranked[:3] if p.get("distance", 0) < PRODUCT_QUERY_DISTANCE]
        ranked = tight_cards or ranked[:3]
        return ChatResponse(
            reply="Here are the best matches for you:\n\n" + format_products(ranked),
            intent=final_intent, confidence=confidence,
            products=[ProductResult(**p) for p in ranked[:3]],
            cards=[product_card(p) for p in ranked[:3]],
            actions=_order_action(ranked),
        )

    # P4 — order verb + a vertical intent → the vertical storefront
    # ("need medicines" → LocalMeds). Runs before the loose-product fallback
    # so a vertical intent is never answered with an arbitrary cold hit.
    if order and intent in VERTICAL_LINKS:
        url, label = VERTICAL_LINKS[intent]
        return ChatResponse(
            reply="That's handled right on our storefront — tap the button to get started.",
            intent="order_category", confidence=confidence,
            products=[], actions=[Action(type="redirect", label=label, url=url)],
        )

    # P5 — explicit order verb + looser product match ("i want noodles").
    # Token-overlap gate: the loose FAISS window (1.1–1.6) is wide enough that
    # unrelated products sneak in ("i need a bag for school" → Pringles). Cards
    # are only fabricated when the query actually names the matched product —
    # otherwise fall through to the canned reply instead of showing junk.
    if order and products and best_distance < ORDER_PRODUCT_DISTANCE:
        ranked = fuzzy_brand_rank(text, products[:10])
        if _token_overlap(text, products[:5]):
            return ChatResponse(
                reply="Here are the best matches for you:\n\n" + format_products(ranked),
                intent="order_product", confidence=confidence,
                products=[ProductResult(**p) for p in ranked[:3]],
                cards=[product_card(p) for p in ranked[:3]],
                actions=_order_action(ranked),
            )

    return None


# ─── Route: Health check ────────────────────────────────────────────────────

@app.get("/health")
def health():
    state = LIVE.state()
    return {
        "status": "ok",
        "products_indexed": state["products_indexed"],
        "catalog_hash": state["catalog_hash"],
        "last_sync": state["last_sync"],
    }


# ─── Route: Refresh live catalog (push hook from the Next.js site) ──────────

@app.post("/refresh-products", status_code=202)
def refresh_products():
    """Queue a background catalog rebuild and return immediately. The site
    calls this after product writes; the worker coalesces bursts and the
    10-minute poll covers anything missed."""
    LIVE.request_refresh()
    return {
        "status": "queued",
        "current_hash": LIVE.state()["catalog_hash"],
    }


# ─── Route: Intent classification ───────────────────────────────────────────

@app.post("/predict", response_model=PredictResponse)
def predict(query: Query):
    intent, confidence = classify_intent(query.text)
    return PredictResponse(intent=intent, confidence=confidence)


# ─── Route: Product search ──────────────────────────────────────────────────

@app.post("/search", response_model=SearchResponse)
def search(query: Query):
    results, _ = search_products(query.text, query.top_k)
    return SearchResponse(query=query.text, results=[ProductResult(**r) for r in results])


# ─── Reply builders ─────────────────────────────────────────────────────────

def time_of_day_greeting(text: str) -> str | None:
    """Return a time-matched greeting reply, or None if not a time greeting.
    Uses difflib to tolerate typos ("good afternon" → afternoon)."""
    import difflib

    tl = text.lower().strip(" ?!.")
    if not tl.startswith("good "):
        return None
    words = tl.split()
    if len(words) < 2:
        return None
    period = words[1]
    matches = {"morning": "Good morning! I hope you have a bright and productive day. How can I help you at Accesco?",
               "afternoon": "Good afternoon! Hope your day is going well. What can I do for you at Accesco?",
               "evening": "Good evening! How can I help you today?",
               "night": "Good night! If you need anything from Accesco, I'll be right here when you're back."}
    best = difflib.get_close_matches(period, list(matches), n=1, cutoff=0.72)
    if not best:
        return None
    return matches[best[0]]

def is_info_question(text: str) -> bool:
    tl = text.lower()
    return any(phrase in tl for phrase in
               ("what is", "what are", "whats ", "what's", "wht is", "whts ", "wat is",
                "wat are", "who is", "who are", "tell me about", "explain",
                "about the app", "about accesco"))


# ─── Delivery coverage lookup ───────────────────────────────────────────────

PINCODE_RE = re.compile(r"\b(\d{6})\b")

# Words stripped from the query before area matching ("do you deliver to X?" → "X")
COVERAGE_STOPWORDS = {
    "a", "an", "the", "to", "at", "in", "on", "for", "of", "do", "does", "did",
    "you", "your", "my", "me", "i", "is", "are", "was", "were", "have", "has",
    "deliver", "delivery", "delivered", "shipping", "ship", "courier", "area",
    "areas", "pincode", "pin", "zip", "code", "near", "around", "what", "which",
    "cover", "covered", "coverage", "serviceable", "serviceability", "serve",
    "serving", "only", "there", "here", "check", "please", "tell", "where",
    "colony", "locality", "bangalore", "bengaluru",
}

def find_pincode(text: str) -> str | None:
    """Return a 6-digit pincode from the query, or None."""
    m = PINCODE_RE.search(text)
    return m.group(1) if m else None

def match_area(text: str) -> tuple[str, dict] | None:
    """Find the best-matching covered area for a user query.

    Returns (matched_area_name, zone) or None. Matching order:
      1. exact match ("indiranagar", "mg road")
      2. 3-letter abbreviation aliases ("btm" → BTM Layout, "hsr" → HSR Layout)
      3. substring match ("koramangala" → "koramangala (blocks 1-3 & 5-8)",
         "electronic city" → "Electronic City Phase 1 & 2") — single-token
         substring requires 4+ chars so "san" can't match inside "Lakkasandra"
      4. difflib typo tolerance ("marthahalli" → Marathahalli)
    """
    import difflib

    cleaned = re.sub(r"[^a-z0-9 ]+", " ", text.lower())
    tokens = [t for t in cleaned.split() if t and t not in COVERAGE_STOPWORDS]
    if not tokens:
        return None

    all_names = [name for name, _ in AREA_INDEX]
    seen = set()
    candidates = [" ".join(tokens)]
    for i in range(len(tokens) - 1):
        candidates.append(" ".join(tokens[i:i + 2]))
    candidates.extend(tokens)

    for cand in candidates:
        if cand in seen:
            continue
        seen.add(cand)
        if cand in AREA_NAME_TO_ZONE:
            return cand, AREA_NAME_TO_ZONE[cand]
        if cand in AREA_ALIASES and AREA_ALIASES[cand] in AREA_NAME_TO_ZONE:
            alias = AREA_ALIASES[cand]
            return alias, AREA_NAME_TO_ZONE[alias]
        if len(cand) >= 5:
            # Word-boundary substring: candidate must appear as whole word(s)
            # inside the area name, so "order" never matches "Attibele bORder
            # zone" and "koramangala" still matches "Koramangala (blocks...)".
            # 5+ chars (not 4) keeps 4-letter product words ("tata" in "tata
            # tea") from matching multi-word areas ("Tata Silk Farm").
            cand_words = cand.split()
            for name in all_names:
                name_words = name.split()
                if len(cand_words) == 1:
                    if cand_words[0] in name_words:
                        return name, AREA_NAME_TO_ZONE[name]
                elif any(
                    name_words[i:i + len(cand_words)] == cand_words
                    for i in range(len(name_words) - len(cand_words) + 1)
                ):
                    return name, AREA_NAME_TO_ZONE[name]
        # difflib typo tolerance ("marthahalli" → Marathahalli). Cutoff 0.85
        # blocks partial-anagram hits like "garam" → "agram" (0.80) while
        # keeping real typos (marthahalli 0.87, kormangala 0.86).
        fuzzy = difflib.get_close_matches(cand, all_names, n=1, cutoff=0.85)
        if fuzzy:
            return fuzzy[0], AREA_NAME_TO_ZONE[fuzzy[0]]
    return None

def format_zone_answer(zone: dict, matched_area: str | None = None) -> str:
    """Build the coverage confirmation reply for a matched zone."""
    if matched_area:
        area = matched_area[:1].upper() + matched_area[1:]
    else:
        area = zone["areas_text"]
    return (
        f"Yes, we deliver to {area} (pincode {zone['pincode']})! "
        "You can shop with us there."
    )

def format_area_summary() -> str:
    """Summary reply for "what areas do you deliver to?" style questions."""
    examples = ", ".join(
        z["areas"][0] for z in COVERAGE[:6] if z["areas"]
    )
    return (
        f"We deliver to {COVERED_PINCODE_COUNT} pincodes across Bengaluru, "
        f"including {examples} and more. Tell me your area or pincode "
        "and I'll confirm if we serve it!"
    )

def coverage_reply(text: str) -> str | None:
    """Build a delivery-coverage reply for the query, or None if not a
    coverage question. Checks pincode first, then area names."""
    tl = text.lower()

    # Questions asking for the list of covered areas ("where do u deliver?",
    # "areas u deliver", "list out few areas") → summary reply
    asks_for_areas = (
        "where" in tl and ("deliver" in tl or "serve" in tl or "cover" in tl)
    ) or (
        "area" in tl and ("list" in tl or "which" in tl or "what" in tl)
    ) or (
        "areas" in tl and ("deliver" in tl or "cover" in tl or "serve" in tl)
    )
    if asks_for_areas:
        return format_area_summary()

    pin = find_pincode(text)
    if pin:
        zone = PINCODE_TO_ZONE.get(pin)
        if zone:
            return format_zone_answer(zone)
        return (
            f"We're not delivering to {pin} yet — we currently serve "
            f"{COVERED_PINCODE_COUNT} pincodes across Bengaluru. "
            "Join the waitlist and we'll notify you when we expand to your area!"
        )

    match = match_area(text)
    if match:
        area, zone = match
        return format_zone_answer(zone, area)

    # Non-Bengaluru city mentioned ("do you deliver to mumbai?") → honest
    # not-yet reply instead of a product listing or generic delivery answer
    for city in ("mumbai", "delhi", "hyderabad", "chennai", "pune", "kolkata",
                 "noida", "gurgaon", "gurugram", "ahmedabad", "jaipur",
                 "chandigarh", "kochi", "lucknow", "goa"):
        if city in tl:
            return (
                f"We're not delivering to {city.title()} yet — we currently serve "
                f"{COVERED_PINCODE_COUNT} pincodes across Bengaluru. "
                "Share your area or pincode and I'll check if we deliver there!"
            )

    if "bangalore" in tl or "bengaluru" in tl:
        return (
            f"We currently deliver to {COVERED_PINCODE_COUNT} pincodes across "
            "Bengaluru. Tell me your area or pincode and I'll confirm if we serve it!"
        )
    return None

def format_products(products: list[dict]) -> str:
    """Structured, bullet-point listing of products for the chat reply."""
    lines = []
    for p in products[:3]:
        stock = "" if p.get("in_stock", True) else " (out of stock)"
        lines.append(
            f"• {p['product_name']}\n"
            f"  Brand: {p['brand']} | Category: {p['category']} ({p['sub_category']})\n"
            f"  Available on: {p['service']} | Price: Rs. {p['selling_price']}{stock}"
        )
    return "\n\n".join(lines)


# ─── SKU Recovery Framework retrieval ───────────────────────────────────────

# Min cosine similarity between query and a row's search texts for a confident
# answer. Below it → generic circular reply + ask, never a guessed row.
RECOVERY_SIM_THRESHOLD = 0.45
# If the 2nd-best row is within this gap of the best, the query is ambiguous
# ("bottles" → Beverages vs Baby vs Personal Care) → ask instead of guessing
RECOVERY_AMBIGUITY_GAP = 0.05
# Min cosine sim between the query and a marketing FAQ question for a direct
# FAQ answer. Item lookups are kept on the row table by the relative
# FAQ-vs-row check in recovery_faq_reply, so this gate only filters
# unrelated queries ("schedule a recovery pickup" scores 0.68).
RECOVERY_FAQ_THRESHOLD = 0.65

# Weak-detection vocabulary: typo-tolerant fallback for phrasings the keyword
# rules miss ("do u take bak bottels"). Only honored when retrieval similarity
# is strong enough — otherwise the query passes through untouched.
RECOVERY_HINT_VOCAB = [
    "take back", "taken back", "recycl", "reuse", "resale", "recover",
    "e-waste", "ewaste", "bottle", "bottles", "packaging", "dispose",
    "disposal", "returned", "accepted", "empty", "wrapper", "sachet",
    "biomedical", "tubs", "stroller", "charger", "battery", "collect",
    "what happens to", "old",
]

def recovery_hint(text: str) -> bool:
    """Weak recovery detection: difflib match of query tokens against the
    hint vocabulary ("take bak" → "take back"). Word-boundary match for the
    short ones ("old") so "gold"/"bold" don't trigger. A negative vocabulary
    ("refund", "order", "password", ...) blocks queries that clearly belong
    to other intents, so "can I return my order?" never routes to recovery."""
    import difflib

    tl = text.lower()
    if any(w in tl for w in ("refund", "exchange", "replace", "order", "account",
                             "password", "login", "payment", "deliver", "delivery",
                             "price", "cost", "track")):
        return False
    for phrase in RECOVERY_HINT_VOCAB:
        if " " in phrase and phrase in tl:
            return True
    vocab_words = {w for w in RECOVERY_HINT_VOCAB if " " not in w}
    for token in re.findall(r"[a-z]{3,}", tl):
        if token in vocab_words or len(token) > 3 and difflib.get_close_matches(token, vocab_words, n=1, cutoff=0.78):
            return True
    return False

def recovery_row_for(text: str) -> tuple[int, float] | None:
    """Return (row_index, best_similarity) of the best-matching recovery row,
    or None if the query is not recovery-flavored at all."""
    vec = EMBED_MODEL.encode([text], normalize_embeddings=True).astype(np.float32)[0]
    best_row, best_sim = -1, -1.0
    for i, row_vecs in enumerate(RECOVERY_ROW_VECTORS):
        sims = vec @ row_vecs.T
        sim = float(sims.max())
        if sim > best_sim:
            best_row, best_sim = i, sim
    if best_row < 0:
        return None
    return best_row, best_sim

def recovery_faq_reply(text: str) -> str | None:
    """Answer from the marketing FAQ (38 Q&As), or None if no close match.

    Runs before the row-table path. A high similarity bar keeps it from
    hijacking queries the row table answers better ("do you take back
    plastic?" must stay on the Toys row, not the Beverages FAQ). General
    questions (fees, rewards, how it works) can't be answered by the 19-row
    table, so they're answered directly; category FAQs only when the row
    table has no confident row for the query. Guards: the conceptual
    "circular commerce" question keeps its explanation reply, and the
    negative vocabulary blocks order/refund/delivery queries."""
    tl = text.lower()
    if "circular commerce" in tl:
        return None
    if any(w in tl for w in ("refund", "exchange", "replace", "order", "account",
                             "password", "login", "payment", "deliver", "delivery",
                             "price", "cost", "track")):
        return None
    vec = EMBED_MODEL.encode([text], normalize_embeddings=True).astype(np.float32)[0]
    sims = vec @ RECOVERY_FAQ_VECTORS.T
    best = float(sims.max())
    if best < RECOVERY_FAQ_THRESHOLD:
        return None
    faq = RECOVERY_FAQS[int(sims.argmax())]
    if faq["category"] != "General":
        # Category FAQ ("do you take back empty bottles?") must not steal an
        # item lookup the 19-row table answers confidently ("cosmetic
        # bottles" → Beauty). Defer to the row table only when it matches
        # the query at least as strongly as the FAQ — a fixed row threshold
        # blocked FAQ wins like "furniture through accesco?" (FAQ 0.99 vs
        # row 0.56).
        row_best = max(float((vec @ rv.T).max()) for rv in RECOVERY_ROW_VECTORS)
        if row_best >= best:
            return None
    return faq["answer"]

def recovery_reply_for(text: str, intent: str) -> str | None:
    """Build a SKU recovery framework reply for the query, or None if the
    query isn't recovery-related (products etc. pass through untouched).

    Strong detection (recovery keyword rules or the classifier) gets a reply
    either way — a confident row, or a generic circular answer when no row
    is close. Weak detection (typo-tolerant hint) only answers when a row
    matches confidently, so unrelated queries flow to their normal intents."""
    strong = keyword_intent(text) == "circular_recycle" or intent == "circular_recycle"
    if not strong and not recovery_hint(text):
        return None
    # Conceptual questions ("what is circular commerce?") keep using the
    # explanation path — the recovery table only answers item/category lookups
    if is_info_question(text):
        return None

    matched = recovery_row_for(text)
    if not matched:
        return None
    best_row, best_sim = matched

    if best_sim < RECOVERY_SIM_THRESHOLD:
        if not strong:
            return None
        return (
            INTENT_REPLIES["circular_recycle"] + " "
            "Tell me the item or category, and I'll check our recovery framework."
        )

    # Ambiguity: a second row nearly as close → ask which item
    vec = EMBED_MODEL.encode([text], normalize_embeddings=True).astype(np.float32)[0]
    sims_by_row = [float((vec @ rv.T).max()) for rv in RECOVERY_ROW_VECTORS]
    order = sorted(range(len(sims_by_row)), key=lambda i: sims_by_row[i], reverse=True)
    second = order[1] if len(order) > 1 else best_row
    if second != best_row and (sims_by_row[best_row] - sims_by_row[second]) <= RECOVERY_AMBIGUITY_GAP:
        top = order[:3]
        options = "\n".join(
            f"• {RECOVERY_ROWS[i]['category']} — {RECOVERY_ROWS[i]['skus']}"
            for i in top
        )
        return (
            "I found a few possible items — which one did you mean?\n"
            f"{options}"
        )

    row = RECOVERY_ROWS[best_row]
    take_back = row["take_back"]
    if take_back == "Yes":
        return (
            f"For {row['category']}, yes — we take back {row['skus']}. "
            f"Recovery: {row['recovery']}."
        )
    if take_back == "Selective":
        return (
            f"For {row['category']}, we take back {row['skus']} selectively — "
            "check with your delivery partner."
        )
    return (
        f"For {row['category']}, we don't take back {row['skus']}."
    )


# ─── Market-research knowledge base (Track B) ────────────────────────────────
# Answers analytics/insight questions from 66.pdf (ICP deck) + Bangalore
# Household Spending Report. Runs early in chat() but with a strict similarity
# bar, a negative vocabulary, and an intent guard so it never steals
# product/coverage/order queries or canned replies the suite locks (e.g.
# "why should I use accesco instead of blinkit?" keeps the comparison reply).
KNOWLEDGE_THRESHOLD = 0.68
KNOWLEDGE_NEGATIVE = (
    "order", "buy", "price of", "cost of", "how much", "deliver", "delivery",
    "pincode", "return", "refund", "track", "account", "password", "login",
    "payment", "referral", "what is grokly", "what is swadisht",
    "what is instastyle", "what is xpense", "waitlist",
)
KNOWLEDGE_GUARD_INTENTS = ("comparison", "referral_rewards")


def knowledge_reply(text: str, intent: str) -> str | None:
    """Answer market-research questions from the knowledge base, or None.

    Guarded three ways so the knowledge base never hijacks other paths:
      - intent guard: comparison/referral queries the suite locks to canned
        replies are skipped. Uses keyword_intent (explicit phrasing like
        "instead of"/"different from"/"referral") rather than the model's
        label — the regularized model routes pricing-flavored comparisons
        ("is accesco cheaper than other apps?") to comparison, but those
        SHOULD get the knowledge answer, while explicit comparison phrasing
        must keep the locked canned reply.
      - negative vocabulary: order/buy/deliver/return/payment etc. stay on
        their own intents.
      - similarity bar: products/coverage/order queries sit far below it."""
    kw = keyword_intent(text)
    if kw in KNOWLEDGE_GUARD_INTENTS:
        return None
    tl = text.lower()
    if any(w in tl for w in KNOWLEDGE_NEGATIVE):
        return None
    vec = EMBED_MODEL.encode([text], normalize_embeddings=True).astype(np.float32)[0]
    sims = vec @ KNOWLEDGE_VECTORS.T
    best = float(sims.max())
    if best < KNOWLEDGE_THRESHOLD:
        return None
    faq = KNOWLEDGE_FAQS[int(sims.argmax())]
    return faq["answer"]


# ─── Route: Combined chat ───────────────────────────────────────────────────
SINGLE_WORD_INFO = {
    "grokly": "grokly_grocery",
    "swadisht": "swadisht_food",
    "instastyle": "instastyle_fashion",
    "localmeds": "localmeds_pharmacy",
    "xpense": "xpense_budget",
}

# ─── Multilingual translation (IndicTrans2, inline — single server) ─────────
# Runs IndicTrans2-distilled directly in-process. No sidecar needed.
# Requires: transformers ~4.48/4.49, torch, sentencepiece, IndicTransToolkit.
# Models download on first use (~800 MB × 2) to ~/.cache/huggingface.
# Graceful degradation: if models fail to load, falls back to English-only.

from transformers import AutoModelForSeq2SeqLM

try:
    from IndicTransToolkit import IndicProcessor
except ImportError:
    from IndicTransToolkit.processor import IndicProcessor

REGIONAL_LANGS = ("hi", "te", "kn")
_LANG_MAP = {"hi": "hin_Deva", "te": "tel_Telu", "kn": "kan_Knda"}
_IE_NAME = "ai4bharat/indictrans2-indic-en-dist-200M"
_EI_NAME = "ai4bharat/indictrans2-en-indic-dist-200M"

_trans_state = {"ready": False, "ip": None,
                "ie_tok": None, "ie_model": None,
                "ei_tok": None, "ei_model": None}


def _load_translation_models():
    """Load IndicTrans2 models at startup. Safe to call multiple times."""
    if _trans_state["ready"]:
        return
    try:
        ip = IndicProcessor(inference=True)

        def _one(name):
            tok = AutoTokenizer.from_pretrained(name, trust_remote_code=True)
            model = AutoModelForSeq2SeqLM.from_pretrained(name, trust_remote_code=True)
            model.eval()
            return tok, model

        ie_tok, ie_model = _one(_IE_NAME)
        ei_tok, ei_model = _one(_EI_NAME)
        torch.set_num_threads(int(os.environ.get("TORCH_THREADS", "4")))
        _trans_state.update(ready=True, ip=ip,
                           ie_tok=ie_tok, ie_model=ie_model,
                           ei_tok=ei_tok, ei_model=ei_model)
        print("[translate] IndicTrans2 models loaded successfully.")
    except Exception as e:
        import traceback
        print(f"[translate] Failed to load IndicTrans2 models: {e}")
        traceback.print_exc()
        print("[translate] Falling back to English-only mode.")


def _translate(text: str, src_flores: str, tgt_flores: str) -> str | None:
    """Translate text using IndicTrans2. Returns None on failure."""
    if not _trans_state["ready"]:
        return None
    try:
        ip = _trans_state["ip"]
        if tgt_flores == "eng_Latn":
            tok, model = _trans_state["ie_tok"], _trans_state["ie_model"]
        else:
            tok, model = _trans_state["ei_tok"], _trans_state["ei_model"]

        batch = ip.preprocess_batch([text], src_lang=src_flores, tgt_lang=tgt_flores)
        inputs = tok(batch, return_tensors="pt", padding=True, truncation=True)
        with torch.no_grad():
            out = model.generate(**inputs, min_length=1,
                                 max_new_tokens=128, num_beams=5)
        with tok.as_target_tokenizer():
            dec = tok.batch_decode(out, skip_special_tokens=True)
        result = ip.postprocess_batch(dec, lang=tgt_flores)
        return result[0].strip() if result else None
    except Exception:
        return None


def _sidecar_call(endpoint: str, text: str, lang: str) -> str | None:
    """Translate inline using IndicTrans2 (replaces the old HTTP sidecar)."""
    flores = _LANG_MAP.get(lang)
    if not flores or not text.strip():
        return None
    if endpoint == "to_english":
        return _translate(text, flores, "eng_Latn")
    elif endpoint == "from_english":
        return _translate(text, "eng_Latn", flores)
    return None


# Load translation models at module import time
_load_translation_models()


def _regionalize_reply(reply: str, lang: str) -> str:
    """Translate the conversational part of a reply into `lang`.

    Product-card blocks ("• Name\n  Brand: ...") stay in English — product
    names/prices/URLs must remain exact. Only the prose header above the
    first bullet is translated; bullet-free replies translate fully.
    """
    if "\n•" in reply:
        head, rest = reply.split("\n•", 1)
        head = head.strip()
        if not head:
            return reply
        regional = _sidecar_call("from_english", head, lang)
        return f"{regional}\n\n•{rest}" if regional else reply
    regional = _sidecar_call("from_english", reply, lang)
    return regional or reply


@app.post("/chat", response_model=ChatResponse)
def chat(query: Query):
    lang = query.language if query.language in REGIONAL_LANGS else None
    text = query.text

    # Regional input → English for the whole pipeline (intent rules,
    # coverage, knowledge RAG and FAISS all operate on English).
    if lang:
        english = _sidecar_call("to_english", text, lang)
        if english:
            text = english

    response = _chat_core(Query(text=text, top_k=query.top_k))

    # English reply → user's language (conversational part only; see
    # _regionalize_reply for why card blocks stay in English).
    if lang and response and response.reply:
        response.reply = _regionalize_reply(response.reply, lang)
    return response


def _chat_core(query: Query):
    text = query.text

    # 1. Time-of-day greetings get a matching reply, no products
    time_greeting = time_of_day_greeting(text)
    if time_greeting:
        return ChatResponse(reply=time_greeting, intent="greeting", confidence=0.99, products=[])

    # 2. Single-word vertical names ("grokly", "swadishtt") → explanation only.
    #    Prefix matching tolerates typos ("swadishtt" → swadisht).
    single_word = text.strip().lower()
    if len(single_word.split()) == 1:
        for name, intent in SINGLE_WORD_INFO.items():
            if single_word == name or (len(single_word) >= 4 and single_word.startswith(name)) or (len(name) >= 4 and name.startswith(single_word)):
                return ChatResponse(
                    reply=INTENT_REPLIES[intent], intent=intent, confidence=0.99, products=[]
                )

    # 3. Classify intent
    intent, confidence = classify_intent(text)

    # 4. SKU Recovery marketing FAQ answers general/category questions with
    #    detailed Q&As. Must run BEFORE coverage and the delivery_order
    #    early-return — the model sometimes routes "what is the sku recovery
    #    framework?" to delivery_order (conf ~0.87), and coverage's fuzzy
    #    area matcher can hijack FAQ wording ("where do returned SKUs go"
    #    → area "Gpo"). The FAQ's negative vocabulary blocks real
    #    order/refund/delivery queries, so coverage still gets them.
    faq_answer = recovery_faq_reply(text)
    if faq_answer:
        return ChatResponse(
            reply=faq_answer, intent="circular_recycle", confidence=confidence, products=[]
        )

    # 4a. Market-research knowledge base (ICP deck + household spending
    #     report): answers analytics questions ("who is Accesco for?",
    #     "which areas do you prioritize?"). Runs before coverage for the
    #     same reason recovery_faq does — coverage's fuzzy area matcher can
    #     hijack analytics wording ("which areas do you prioritize?" →
    #     coverage, "bangalore households overspend" → coverage). Strict
    #     similarity bar, negative vocabulary, and the intent guard keep it
    #     from hijacking product/coverage/order queries or locked canned
    #     replies.
    knowledge = knowledge_reply(text, intent)
    if knowledge:
        return ChatResponse(
            reply=knowledge, intent="about_brand", confidence=confidence, products=[]
        )

    # 4b. Delivery coverage lookup runs before product search so area/pincode
    #     queries ("marathahalli", "do you deliver to 560037?", "whitefield")
    #     are never misrouted into product listings, regardless of intent
    coverage = coverage_reply(text)
    if coverage:
        return ChatResponse(
            reply=coverage, intent="delivery_order", confidence=0.99, products=[]
        )

    if intent == "delivery_order":
        return ChatResponse(
            reply=(
                "Could you share your area name or pincode? "
                "I'll check right away if we deliver there."
            ),
            intent="delivery_order", confidence=confidence, products=[],
        )

    # 5. SKU recovery framework: routed by recovery keywords or the
    #    circular_recycle intent, answered from the 19-row table via
    #    embedding retrieval. Never falls through to product search.
    recovery = recovery_reply_for(text, intent)
    if recovery:
        return ChatResponse(
            reply=recovery, intent="circular_recycle", confidence=confidence, products=[]
        )

    # 6. Search products + best distance
    products, best_distance = search_products(text, query.top_k)

    # 7. Info questions ("what is X", "tell me about X") → explanation only.
    #    Keyword rules first, so typos of vertical names ("what is swadhissht")
    #    resolve to the right intent instead of the model's misclassification.
    #    Vertical intents gain a storefront redirect action (conversion hint
    #    without breaking the pure informational reply).
    if is_info_question(text):
        kw = keyword_intent(text)
        if kw is not None:
            intent = kw
        elif intent in ("greeting", "unknown"):
            intent = "about_brand"
        reply = INTENT_REPLIES.get(
            intent, "Accesco Living is an intelligent commerce ecosystem built for urban Indian households."
        )
        actions = None
        if intent in VERTICAL_LINKS:
            url, label = VERTICAL_LINKS[intent]
            actions = [Action(type="redirect", label=label, url=url)]
        return ChatResponse(reply=reply, intent=intent, confidence=confidence,
                            products=[], actions=actions)

    # 8. Mood-based product recommendations: if the intent is a mood tag
    #    that maps to product categories, fetch matching products from the
    #    LIVE catalog and return them as cards. Only shows products that
    #    actually exist in Firestore (271 products).
    if is_mood_intent(intent) and mood_has_products(intent):
        live_products, _ = LIVE.snapshot()
        mood_products = get_mood_products(intent, live_products)
        if mood_products:
            cards = []
            for p in mood_products:
                cards.append(ProductCard(
                    name=p["name"],
                    brand=p.get("brand", ""),
                    price=p.get("price", ""),
                    unit=p.get("unit", ""),
                    image=p.get("image", ""),
                    service=p.get("service", "Grokly"),
                    url=p.get("url", ""),
                ))
            reply = INTENT_REPLIES.get(intent, "Here are some suggestions for you!")
            actions = [Action(type="redirect", label="Browse more on Grokly", url="/services/grokly")]
            return ChatResponse(
                reply=reply, intent=intent, confidence=confidence,
                products=[], cards=cards, actions=actions,
            )

    # 9. Commerce routing absorbs the product-search branch. Precedence:
    #    tight product → cards + Order button (intent order_product when an
    #    order verb present, else the classified intent); category / vertical
    #    redirects for order-verb + loose/unknown queries. Returns None when
    #    nothing commerce-flavored matched → canned replies below.
    commerce = commerce_reply(text, intent, confidence, products, best_distance)
    if commerce is not None:
        return commerce

    # 10. Legacy canned replies (nothing commerce-flavored)
    if intent == "greeting":
        reply = INTENT_REPLIES["greeting"]
    elif intent == "unknown":
        reply = (
            "I'm still learning! Could you rephrase your question? "
            "You can ask about products, prices, or services on Accesco."
        )
    else:
        reply = INTENT_REPLIES.get(intent, "I'm here to help with anything about Accesco Living.")

    return ChatResponse(
        reply=reply,
        intent=intent,
        confidence=confidence,
        products=[],
    )
