# Build recovery search index from recovery_framework.json
#
# Converts the 19-row SKU Recovery Framework table into a searchable index:
#   chatbot-ml/data/recovery_index.json
#
# Each row stores the raw table fields plus a list of "search texts":
#   - the canonical row text (category + SKUs + take-back + recovery)
#   - per-SKU paraphrase expansions ("do you take back glass bottles?",
#     "what happens to empty shampoo bottles?", ...)
#   - per-category paraphrase expansions + boost vocabulary
#
# The inference server embeds every search text at startup and matches the
# user query against them (RAG without an LLM) — this file only prepares
# the text data, no model involved.
#
# Usage:
#   python3 chatbot-ml/data/build_recovery_index.py

import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "../data")
SRC_PATH = os.path.join(DATA_DIR, "recovery_framework.json")
OUT_PATH = os.path.join(DATA_DIR, "recovery_index.json")

# Extra vocabulary per category to pull common user words toward the right row
CATEGORY_BOOST = {
    "Beverages": ["bottle", "glass bottle", "pet bottle", "can", "soda", "cola", "water bottle", "empty bottle"],
    "Fresh & Dairy": ["milk bottle", "milk packet", "yogurt", "curd", "dairy"],
    "Pantry": ["oil bottle", "spice jar", "jar", "container", "pantry"],
    "Snacks": ["tub", "carton", "chips", "snack", "crisps"],
    "Personal Care": ["shampoo", "lotion", "soap", "bottle", "toothpaste", "personal care"],
    "Beauty": ["glass jar", "cosmetic", "perfume", "cream jar", "makeup", "beauty"],
    "Home Care": ["detergent", "cleaning", "floor cleaner", "home care"],
    "Baby": ["stroller", "pram", "baby bottle", "toy", "baby", "diaper"],
    "Pet": ["pet food", "carrier", "cage", "pet"],
    "Fashion": ["clothes", "clothing", "shoes", "bags", "old clothes", "fashion", "resale"],
    "Kitchen": ["cookware", "utensils", "pans", "kadai", "kitchen"],
    "Electronics": ["phone", "charger", "cable", "battery", "e-waste", "ewaste", "old phone", "laptop", "electronic"],
    "Books & Stationery": ["books", "backpacks", "stationery", "notebook"],
    "Sports": ["fitness", "gym", "gear", "dumbbell", "sports"],
    "Toys": ["toy", "plastic toy", "action figure", "toys"],
    "Gardening": ["pots", "tools", "garden", "planter"],
    "Packaging": ["cardboard", "bubble wrap", "packaging", "box", "wrapper"],
    "Reject": ["wrapper", "sachet", "biomedical", "food-soiled", "not accepted", "not taken back"],
}

# Question templates applied to every individual SKU item
SKU_QUESTION_PATTERNS = [
    "do you take back {item}?",
    "what do you do with {item}?",
    "can i return {item}?",
    "is {item} taken back?",
    "how do you recover {item}?",
    "where does my {item} go?",
    "what happens to {item}?",
    "do you collect {item}?",
]

# Question templates applied to the category name
CATEGORY_QUESTION_PATTERNS = [
    "do you take back {cat} items?",
    "what do you do with {cat} items?",
    "recycle {cat} items",
    "recovery for {cat} items",
]

# Generic single words that appear in several rows ("bottles" → Beverages,
# Baby, Personal Care, ...). Skipping them prevents phrase-collision false
# positives: with "what do you do with bottles?" embedded under Baby, the
# query "what do you do with empty pet bottles?" scores ~1.0 on Baby. Generic
# queries are meant to surface as "which one did you mean?" asks instead.
GENERIC_ITEMS = {
    "bottles", "cans", "jars", "tubs", "pots", "tools", "toys", "bags",
    "books", "boxes", "cables", "containers", "items", "bottle",
}


def build_rows(recovery_table):
    rows = []
    for r in recovery_table:
        category = str(r.get("Category", "")).strip()
        skus = str(r.get("Representative SKUs", "")).strip()
        take_back = str(r.get("Take Back", "")).strip()
        recovery = str(r.get("Recovery", "")).strip()

        search_texts = [
            f"{category}. Representative SKUs: {skus}. Take back: {take_back}. Recovery: {recovery}."
        ]

        # Boost vocabulary pulls common user words toward this row
        for word in CATEGORY_BOOST.get(category, []):
            if word in GENERIC_ITEMS:
                continue
            search_texts.append(f"{category} {word} take back {take_back} recovery {recovery}")
            if take_back == "Yes":
                search_texts.append(f"we take back {word} — recovery: {recovery}.")
            elif take_back == "No":
                search_texts.append(f"we do not take back {word}.")
            else:
                search_texts.append(f"we take back {word} selectively — recovery: {recovery}.")

        # Per-SKU paraphrase expansions ("empty shampoo bottle", ...)
        for item in [s.strip() for s in skus.split(",") if s.strip()]:
            if item in GENERIC_ITEMS:
                continue
            for pattern in SKU_QUESTION_PATTERNS:
                search_texts.append(pattern.format(item=item))

        # Per-category expansions
        for pattern in CATEGORY_QUESTION_PATTERNS:
            search_texts.append(pattern.format(cat=category))

        rows.append({
            "category": category,
            "skus": skus,
            "take_back": take_back,
            "recovery": recovery,
            "search_texts": search_texts,
        })
    return rows


def main():
    with open(SRC_PATH) as f:
        framework = json.load(f)

    rows = build_rows(framework["recovery_table"])
    output = {
        "rows": rows,
        # Raw text paragraphs from the PDF — kept for reference only; the
        # inference server answers exclusively from rows (chunks are too
        # fragmented to use as answers)
        "text_chunks": framework.get("text_chunks", []),
    }
    with open(OUT_PATH, "w") as f:
        json.dump(output, f, indent=2)
    total_texts = sum(len(r["search_texts"]) for r in rows)
    print(f"Built {len(rows)} rows, {total_texts} search texts → {OUT_PATH}")


if __name__ == "__main__":
    main()
