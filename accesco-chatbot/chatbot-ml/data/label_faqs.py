# Label FAQ questions with intents → faq_labeled.csv
#
# Auto-labels each question using keyword rules, then writes a CSV that can be
# reviewed/edited manually before training.
#
# Usage:
#   python3 chatbot-ml/data/label_faqs.py

import csv
import json
import os
import re

DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/faq_data.json")
OUT_PATH = os.path.join(os.path.dirname(__file__), "../data/faq_labeled.csv")

# Keyword rules in priority order (first match wins)
INTENT_RULES = [
    ("waitlist_launch", r"waitlist|early access|launch|pre-?launch|live yet|going live|not live|get early"),
    ("referral_rewards", r"referral|refer |invite|reward point|redeem my|earn rewards"),
    ("grokly_grocery", r"grokly|grocer|vegetable|vegetables|produce|farm|milk and eggs|subscription for milk|kirana"),
    ("swadisht_food", r"swadisht|food|caf[eé]|meal|restaurant|kitchen|diet|weight loss|cuisine|dinex|book a table|dining"),
    ("instastyle_fashion", r"instastyle|fashion|clothes|clothing|outfit|apparel|wardrobe|try on clothes"),
    ("localmeds_pharmacy", r"localmeds|pharma|medicine|prescription|wellness product|doctor consult|pharmac"),
    ("xpense_budget", r"xpense|budget|spend|salary sync|financial|affordab|stay within|save money|cheaper than|price stabil"),
    ("pricing_payment", r"payment|pay|price|prices|cost|delivery charge|free delivery|membership|loyalty|premium|minimum order"),
    ("delivery_order", r"deliver|delivery|track|tracking|schedule|ETA|11 minute|10 minute|arrive|shipping|order in real|scheduled"),
    ("returns_refunds", r"return|refund|exchange|cancel|cancelled|wrong item|missing item|unavailable after placing|cold on arrival|report a missing"),
    ("privacy_security", r"privacy|secure|safety|safe|data|personal information|password|payment information|unauthorized"),
    ("circular_recycle", r"circular|recycl|recover|reverse|take-?back|return my packaging|returning recycl|plastic|waste|sustainab|packaging"),
    ("account_features", r"account|multiple address|share my|shared cart|preferences|personaliz|voice-search|recommend|remind|subscription|save multiple"),
    ("delivery_partner", r"delivery partner|gig worker|become a delivery|rider|supplier|producer|pharmacies|franchise|restaurants join|onboarding"),
    ("support_contact", r"support|contact|feedback|respond|reach|inquir|complaint|how quickly"),
    ("comparison", r"vs\.|compare|comparison|versus|different from|better than|which is better|zepto|blinkit|bigbasket|zomato|myntra|tata neu|pharmeasy|amazon"),
    ("about_brand", r"what is accesco|who are the founder|name .accesco|vision|mission|goal|about|different|unique|why should|benefit|who can use|available|city|tier-2|india|bengaluru|operate|how does accesco|how is accesco|what kind|can i use|does accesco|can accesco|will accesco"),
]

DEFAULT_INTENT = "about_brand"


def label_question(question: str) -> str:
    q = question.lower()
    for intent, pattern in INTENT_RULES:
        if re.search(pattern, q):
            return intent
    return DEFAULT_INTENT


def main():
    with open(DATA_PATH, encoding="utf-8") as f:
        faqs = json.load(f)
    rows = []
    for faq in faqs:
        intent = label_question(faq["question"])
        rows.append({
            "id": faq["id"],
            "intent": intent,
            "question": faq["question"],
            "answer": faq["answer"],
        })
    with open(OUT_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "intent", "question", "answer"])
        writer.writeheader()
        writer.writerows(rows)
    from collections import Counter
    counts = Counter(r["intent"] for r in rows)
    print(f"Labeled {len(rows)} questions → {OUT_PATH}")
    print("\nIntent distribution:")
    for intent, count in counts.most_common():
        print(f"  {intent}: {count}")


if __name__ == "__main__":
    main()
