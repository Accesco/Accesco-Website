# Inference server for Accesco AI Chatbot
#
# Endpoints:
#   POST /predict  — classify user intent (placeholder until FAQ model is trained)
#   POST /search   — find matching products via FAISS similarity
#   POST /chat     — combined: classify intent + search products + return reply
#
# Run:
#   uvicorn inference.app:app --reload --port 8000

import json
import os
import pickle

import faiss
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

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

EMBED_MODEL = SentenceTransformer("all-MiniLM-L6-v2")

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


# ─── Intent classification (placeholder) ─────────────────────────────────────
#
# This is a stub that returns "unknown" for all queries.
# Once FAQ data arrives and DistilBERT is trained, swap this with the real model.
INTENTS = [
    "buy_product", "check_price", "check_stock", "ask_faq",
    "support", "greeting", "unknown",
]

def classify_intent(text: str) -> tuple[str, float]:
    """Placeholder: always returns unknown until DistilBERT model is trained."""
    return "unknown", 0.0


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

    # 2. Search products
    products = search_products(text, query.top_k)

    # 3. Build reply
    if intent == "unknown":
        if products:
            category = products[0]["category"]
            reply = (
                f"I found a few products in **{category}**. "
                f"Can you tell me more about what you're looking for?"
            )
        else:
            reply = (
                "I'm still learning! Could you rephrase your question? "
                "You can ask about products, prices, or services on Accesco."
            )
    elif intent == "buy_product":
        reply = "Sure! Here are some products you might be interested in."
    elif intent == "check_price":
        reply = f"Here's the pricing info I found for you."
    else:
        reply = "I'm here to help with anything about Accesco Living."

    return ChatResponse(
        reply=reply,
        intent=intent,
        confidence=confidence,
        products=[ProductResult(**p) for p in products[:3]],
    )
