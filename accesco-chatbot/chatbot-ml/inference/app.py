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
    ("greeting", ["hi", "hello", "hey", "namaste"], []),
    ("delivery_order", ["deliver", "delivery", "shipping", "courier"], ["area", "where", "near", "location", "pin", "zip", "pincode"]),
    ("grokly_grocery", ["grocery", "groceries", "vegetables", "fruits", "milk", "groceries delivered"], []),
    ("swadisht_food", ["food delivery", "swadisht", "food order", "restaurant"], []),
    ("instastyle_fashion", ["fashion", "clothes", "instastyle", "apparel"], []),
    ("localmeds_pharmacy", ["medicine", "pharmacy", "meds", "localmeds"], []),
    ("pricing_payment", ["price", "cost", "how much", "charge", "payment", "pay"], []),
    ("waitlist_launch", ["waitlist", "early access", "launch", "beta", "sign up", "sign-up"], []),
    ("returns_refunds", ["return", "refund", "exchange", "replace"], []),
    ("account_features", ["account", "login", "sign in", "password", "profile"], []),
    ("support_contact", ["contact", "support", "help line", "reach", "phone number", "email"], []),
    ("privacy_security", ["privacy", "secure", "data safe", "security", "personal data"], []),
]

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
    text_l = text.lower()
    for fallback_intent, must_any, secondary in FALLBACK_RULES:
        if any(k in text_l for k in must_any) and (not secondary or any(k in text_l for k in secondary)):
            return fallback_intent, confidence
    return "unknown", confidence


# ─── Product search via FAISS ───────────────────────────────────────────────

MAX_PRODUCT_DISTANCE = 15.0

def search_products(text: str, top_k: int = 5) -> list[dict]:
    """Embed the query and return top_k closest products from the FAISS index.
    Results beyond MAX_PRODUCT_DISTANCE are discarded as irrelevant."""
    vec = EMBED_MODEL.encode([text]).astype(np.float32)
    distances, indices = INDEX.search(vec, top_k)
    results = []
    for idx, dist in zip(indices[0], distances[0]):
        if idx < 0 or idx >= len(CATALOG):
            continue
        if dist > MAX_PRODUCT_DISTANCE:
            continue
        p = CATALOG[int(idx)]
        results.append({
            "product_name": p["product_name"],
            "brand": p["brand"],
            "category": p["category"],
            "sub_category": p["sub_category"],
            "selling_price": p["selling_price"],
            "sku_id": p["sku_id"],
        })
    return results


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
    results = search_products(query.text, query.top_k)
    return SearchResponse(query=query.text, results=[ProductResult(**r) for r in results])


# ─── Route: Combined chat ───────────────────────────────────────────────────

@app.post("/chat", response_model=ChatResponse)
def chat(query: Query):
    text = query.text

    # 1. Classify intent
    intent, confidence = classify_intent(text)

    # 2. Search products (only relevant for product-related intents)
    PRODUCT_INTENTS = {"grokly_grocery", "swadisht_food", "instastyle_fashion",
                       "localmeds_pharmacy", "unknown"}
    products = search_products(text, query.top_k) if intent in PRODUCT_INTENTS else []

    # 3. Build reply
    if intent == "unknown":
        if products:
            category = products[0]["category"]
            reply = (
                f"I found a few products in **{category}** — for example "
                f"**{products[0]['product_name']}** at ₹{products[0]['selling_price']}. "
                f"Can you tell me more about what you're looking for?"
            )
        else:
            reply = (
                "I'm still learning! Could you rephrase your question? "
                "You can ask about products, prices, or services on Accesco."
            )
    elif intent == "greeting":
        reply = INTENT_REPLIES["greeting"]
    elif intent in PRODUCT_INTENTS and products:
        first = products[0]
        reply = (
            f"{INTENT_REPLIES.get(intent, '')} Here's a product you might like: "
            f"**{first['product_name']}** ({first['category']}) at ₹{first['selling_price']}."
        )
    else:
        reply = INTENT_REPLIES.get(intent, "I'm here to help with anything about Accesco Living.")

    return ChatResponse(
        reply=reply,
        intent=intent,
        confidence=confidence,
        products=[ProductResult(**p) for p in products[:3]],
    )
