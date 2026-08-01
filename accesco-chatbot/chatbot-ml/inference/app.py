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
import pickle
import re

import faiss
import numpy as np
import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from transformers import AutoModelForSequenceClassification, AutoTokenizer

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

with open(os.path.join(DATA_DIR, "product_catalog.json")) as f:
    CATALOG = json.load(f)

INDEX = faiss.read_index(os.path.join(MODELS_DIR, "product_index.faiss"))
with open(os.path.join(MODELS_DIR, "product_ids.pkl"), "rb") as f:
    PRODUCT_NAMES = pickle.load(f)

EMBED_MODEL = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")

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
}


# ─── Request / Response models ──────────────────────────────────────────────

class Query(BaseModel):
    text: str
    top_k: int = 5

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

class SearchResponse(BaseModel):
    query: str
    results: list[ProductResult]

class ChatResponse(BaseModel):
    reply: str
    intent: str
    confidence: float
    products: list[ProductResult] | None = None


# ─── Intent classification (DistilBERT) ─────────────────────────────────────

INTENT_CONFIDENCE_THRESHOLD = 0.30

# Keyword fallback for queries the model is unsure about (< threshold)
# Keys are intent names; values are (must_any, must_all) keyword tuples.
FALLBACK_RULES: list[tuple[str, list[str], list[str]]] = [
    ("greeting", ["hi", "hello", "hey", "namaste", "good morning", "good afternoon", "good evening", "good night"], []),
    ("delivery_order", ["deliver", "delivery", "shipping", "courier"], ["area", "where", "near", "location", "pin", "zip", "pincode"]),
    # Delivery coverage questions ("what areas do you cover?") — the coverage
    # keywords are specific enough that no secondary keyword is required
    ("delivery_order", ["cover", "coverage", "serviceable", "serviceability"], []),
    # Circular commerce / SKU recovery framework. Placed BEFORE the product
    # rules so "do you take back milk bottles?" isn't stolen by grokly ("milk"),
    # and before returns_refunds so "can I return my packaging?" routes here.
    ("circular_recycle", ["take back", "takeback", "recycl", "e-waste", "ewaste",
                          "packaging", "empty bottle", "empty bottles", "dispose",
                          "disposal", "resale", "what happens to", "fulfillment hub"], []),
    # "old" / "reuse" / "recover" / "collect" are ambiguous alone ("recover my
    # password"), so they require a recovery-ish secondary word. Note: keywords
    # of len <= 3 ("old") match as whole words — "amul gold" never hits "old".
    ("circular_recycle", ["reuse", "recover", "old", "collect"],
     ["bottle", "phone", "packaging", "item", "return", "recycl", "waste", "electronics",
      "charger", "battery", "jar", "toy", "clothes", "shoe", "container", "can", "glass"]),
    ("grokly_grocery", ["grocery", "groceries", "vegetables", "fruits", "milk", "grokly", "groceries delivered"], []),
    ("swadisht_food", ["food delivery", "swadisht", "swadish", "swadhish", "swadhissht", "food order", "restaurant"], []),
    ("instastyle_fashion", ["fashion", "clothes", "instastyle", "apparel"], []),
    ("localmeds_pharmacy", ["medicine", "pharmacy", "meds", "localmeds"], []),
    ("xpense_budget", ["xpense", "budget", "spending", "spend tracker"], []),
    ("pricing_payment", ["price", "cost", "how much", "charge", "payment", "pay"], []),
    ("waitlist_launch", ["waitlist", "early access", "launch", "beta", "sign up", "sign-up"], []),
    ("returns_refunds", ["return", "refund", "exchange", "replace"], []),
    ("account_features", ["account", "login", "sign in", "password", "profile"], []),
    ("support_contact", ["contact", "support", "help line", "reach", "phone number", "email"], []),
    ("privacy_security", ["privacy", "secure", "data safe", "security", "personal data"], []),
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

# Which Accesco vertical (service) a category belongs to.
# Default: Grokly (grocery). No fashion/food products exist in the catalog yet.
LOCALMEDS_CATEGORIES = {"Pharma & Wellness", "Health & Hygiene"}

def service_for(category: str) -> str:
    return "LocalMeds" if category in LOCALMEDS_CATEGORIES else "Grokly"

def search_products(text: str, top_k: int = 5) -> tuple[list[dict], float]:
    """Embed the query and return (top_k closest products, best distance).
    Results beyond MAX_PRODUCT_DISTANCE are discarded as irrelevant."""
    vec = EMBED_MODEL.encode([text]).astype(np.float32)
    distances, indices = INDEX.search(vec, top_k)
    results = []
    best_distance = float("inf")
    for idx, dist in zip(indices[0], distances[0]):
        if idx < 0 or idx >= len(CATALOG):
            continue
        if dist > MAX_PRODUCT_DISTANCE:
            continue
        best_distance = min(best_distance, float(dist))
        p = CATALOG[int(idx)]
        results.append({
            "product_name": p["product_name"],
            "brand": p["brand"],
            "category": p["category"],
            "sub_category": p["sub_category"],
            "selling_price": p["selling_price"],
            "sku_id": p["sku_id"],
            "service": service_for(p["category"]),
        })
    if best_distance == float("inf"):
        best_distance = MAX_PRODUCT_DISTANCE
    return results, best_distance


# ─── Route: Health check ────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "products_indexed": len(CATALOG)}


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
        if len(cand) >= 4:
            # Word-boundary substring: candidate must appear as whole word(s)
            # inside the area name, so "order" never matches "Attibele bORder
            # zone" and "koramangala" still matches "Koramangala (blocks...)"
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
        fuzzy = difflib.get_close_matches(cand, all_names, n=1, cutoff=0.80)
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
        lines.append(
            f"• {p['product_name']}\n"
            f"  Brand: {p['brand']} | Category: {p['category']} ({p['sub_category']})\n"
            f"  Available on: {p['service']} | Price: Rs. {p['selling_price']}"
        )
    return "\n\n".join(lines)


# ─── SKU Recovery Framework retrieval ───────────────────────────────────────

# Min cosine similarity between query and a row's search texts for a confident
# answer. Below it → generic circular reply + ask, never a guessed row.
RECOVERY_SIM_THRESHOLD = 0.45
# If the 2nd-best row is within this gap of the best, the query is ambiguous
# ("bottles" → Beverages vs Baby vs Personal Care) → ask instead of guessing
RECOVERY_AMBIGUITY_GAP = 0.05

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


# ─── Route: Combined chat ───────────────────────────────────────────────────
SINGLE_WORD_INFO = {
    "grokly": "grokly_grocery",
    "swadisht": "swadisht_food",
    "instastyle": "instastyle_fashion",
    "localmeds": "localmeds_pharmacy",
    "xpense": "xpense_budget",
}

@app.post("/chat", response_model=ChatResponse)
def chat(query: Query):
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

    # 4. Delivery coverage lookup runs before product search so area/pincode
    #    queries ("marathahalli", "do you deliver to 560037?", "whitefield")
    #    are never misrouted into product listings, regardless of intent
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
    if is_info_question(text):
        kw = keyword_intent(text)
        if kw is not None:
            intent = kw
        elif intent in ("greeting", "unknown"):
            intent = "about_brand"
        reply = INTENT_REPLIES.get(
            intent, "Accesco Living is an intelligent commerce ecosystem built for urban Indian households."
        )
        return ChatResponse(reply=reply, intent=intent, confidence=confidence, products=[])

    # 8. "Greeting" classification but a strong product match exists → it's a product query
    #    ("amul taaza" was misclassified as greeting; FAISS distance separates the two)
    if intent == "greeting" and best_distance < PRODUCT_QUERY_DISTANCE:
        intent = "localmeds_pharmacy" if products[0]["service"] == "LocalMeds" else "grokly_grocery"
        confidence = round(confidence, 3)

    # 9. Build reply
    PRODUCT_INTENTS = {"grokly_grocery", "swadisht_food", "instastyle_fashion",
                       "localmeds_pharmacy", "unknown"}
    show_products = intent in PRODUCT_INTENTS and bool(products)
    if show_products:
        listing = format_products(products)
        if intent == "unknown":
            reply = (
                f"I found these matching products for you:\n\n{listing}\n\n"
                "Can you tell me more about what you're looking for?"
            )
        else:
            reply = f"Here are the best matches for you:\n\n{listing}"
    elif intent == "greeting":
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
        products=[ProductResult(**p) for p in products[:3]] if show_products else [],
    )
