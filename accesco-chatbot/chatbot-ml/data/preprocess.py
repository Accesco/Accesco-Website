# Phase 1: Data Preparation — Preprocess SKU Master xlsx + Recovery PDF → FAISS index
#
# This script does three things:
#   1. Parses the SKU Master Inventory xlsx into a structured JSON product catalog
#   2. Parses the Circular Commerce SKU Recovery Framework PDF (table + text chunks)
#   3. Builds a FAISS vector index for product similarity search using SentenceTransformers
#
# Usage:
#   python3 chatbot-ml/data/preprocess.py

import json
import os
import pickle

import faiss
import numpy as np
import pandas as pd
import pdfplumber
from sentence_transformers import SentenceTransformer

# ─── Paths ─────────────────────────────────────────────────────────────────
DATA_DIR = os.path.join(os.path.dirname(__file__), "../../chatbot-data")
OUT_DIR = os.path.join(os.path.dirname(__file__), "../data")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "../models")
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

XLSX_PATH = os.path.join(DATA_DIR, "Accesco QC SKU Master Inventory.xlsx")
PDF_PATH = os.path.join(DATA_DIR, "Accesco_Circular_Commerce_SKU_Recovery_Framework.pdf")
CATALOG_PATH = os.path.join(OUT_DIR, "product_catalog.json")
RECOVERY_PATH = os.path.join(OUT_DIR, "recovery_framework.json")
FAISS_INDEX_PATH = os.path.join(MODELS_DIR, "product_index.faiss")
FAISS_MAPPING_PATH = os.path.join(MODELS_DIR, "product_ids.pkl")
EMBED_MODEL_NAME = "all-MiniLM-L6-v2"


# ─── 1. Parse SKU Master xlsx → product_catalog.json ────────────────────────
#
# The xlsx has 3 header rows (title, description, column names),
# then 10,711 data rows. We skip the first 3 rows and use row 3 as column headers.
def parse_xlsx():
    """Parse the SKU Master xlsx into a list of product dicts → product_catalog.json"""
    df = pd.read_excel(XLSX_PATH, header=None)
    # Row index 2 contains the actual column names
    df.columns = df.iloc[2]
    # Skip the first 3 rows (title + description + header)
    df = df.iloc[3:].reset_index(drop=True)
    # Drop entirely empty rows
    df = df.dropna(subset=["SKU ID", "Product Name"])
    records = df.to_dict("records")
    catalog = []
    for r in records:
        catalog.append({
            "sku_id": str(r.get("SKU ID", "")).strip(),
            "product_name": str(r.get("Product Name", "")).strip(),
            "brand": str(r.get("Brand", "")).strip(),
            "category": str(r.get("Category", "")).strip(),
            "sub_category": str(r.get("Sub-Category", "")).strip(),
            "product_type": str(r.get("Product Type", "")).strip(),
            "pack_size": str(r.get("Pack Size", "")).strip(),
            "unit": str(r.get("Unit", "")).strip(),
            "mrp": str(r.get("MRP (Rs.)", "")).strip(),
            "selling_price": str(r.get("Selling Price (Rs.)", "")).strip(),
            "margin_pct": str(r.get("Margin %", "")).strip(),
            "avg_daily_demand": str(r.get("Avg Daily Demand (units)", "")).strip(),
            "reorder_level": str(r.get("Reorder Level", "")).strip(),
            "abc_class": str(r.get("ABC Class", "")).strip(),
            "velocity": str(r.get("Velocity", "")).strip(),
            "temp_zone": str(r.get("Temp Zone", "")).strip(),
            "shelf_life": str(r.get("Shelf Life", "")).strip(),
            "purchase_type": str(r.get("Purchase Type", "")).strip(),
            "seasonal": str(r.get("Seasonal", "")).strip(),
        })
    with open(CATALOG_PATH, "w") as f:
        json.dump(catalog, f, indent=2)
    print(f"Parsed {len(catalog)} products → {CATALOG_PATH}")
    return catalog


# ─── 2. Parse SKU Recovery PDF → recovery_framework.json ─────────────────────
#
# Uses pdfplumber to extract both tables (category → recovery method mapping)
# and plain text paragraphs from the PDF.
def parse_pdf():
    """Parse the Circular Commerce SKU Recovery Framework PDF → recovery_framework.json"""
    recovery_rows = []
    text_chunks = []
    with pdfplumber.open(PDF_PATH) as pdf:
        for page in pdf.pages:
            # Extract tables (Category, Representative SKUs, Take Back, Recovery)
            tables = page.extract_tables()
            for table in tables:
                header = table[0]
                for row in table[1:]:
                    recovery_rows.append(dict(zip(header, row)))
            # Extract plain text paragraphs
            text = page.extract_text()
            if text:
                paragraphs = [p.strip() for p in text.split("\n") if p.strip()]
                text_chunks.extend(paragraphs)
    output = {
        "recovery_table": recovery_rows,
        "text_chunks": text_chunks,
    }
    with open(RECOVERY_PATH, "w") as f:
        json.dump(output, f, indent=2)
    print(f"Parsed PDF: {len(recovery_rows)} recovery rows, {len(text_chunks)} text chunks → {RECOVERY_PATH}")
    return output


# ─── 3. Build FAISS product index ───────────────────────────────────────────
#
# Each product is embedded as a string combining name + brand + category
# using all-MiniLM-L6-v2 (SentenceTransformers). The embeddings are stored
# in a FAISS IndexFlatL2 for fast cosine/L2 similarity search at inference time.
def build_faiss_index(catalog):
    """Generate embeddings for all products and save a FAISS index for similarity search"""
    names = [p["product_name"] for p in catalog]
    # Combine fields into a single search text per product
    search_texts = [
        f"{p['product_name']} {p['brand']} {p['category']} {p['sub_category']}"
        for p in catalog
    ]
    model = SentenceTransformer(EMBED_MODEL_NAME)
    print(f"Generating embeddings for {len(search_texts)} products...")
    embeddings = model.encode(search_texts, show_progress_bar=True)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings.astype(np.float32))
    faiss.write_index(index, FAISS_INDEX_PATH)
    # Save product names in same order as FAISS index vectors for look-up
    with open(FAISS_MAPPING_PATH, "wb") as f:
        pickle.dump(names, f)
    print(f"FAISS index saved ({index.ntotal} vectors) → {FAISS_INDEX_PATH}")


# ─── Main ──────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== Phase 1: Data Preparation ===")
    catalog = parse_xlsx()
    parse_pdf()
    build_faiss_index(catalog)
    print("=== Phase 1 Complete ===")
