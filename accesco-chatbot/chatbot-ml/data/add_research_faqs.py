# Append curated Q&A pairs (from 66.pdf ICP deck + Bangalore Household Spending
# Report) to faq_labeled.csv
#
# These two PDFs have no Q&A/intent structure, so pairs are hand-written from
# their content and mapped to existing classifier labels. Dedup-safe against
# faq_labeled.csv before retraining.
#
# Usage:
#   python3 chatbot-ml/data/add_research_faqs.py

import csv
import os

BASE = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE, "../data/faq_labeled.csv")

# (intent, question, answer) — content grounded in:
#   chatbot-data/66.pdf  (Bengaluru quick-commerce ICP / acquisition deck)
#   chatbot-data/Bangalore Household Spending Report.pdf
PAIRS = [
    # ── 66.pdf — ICP segments → about_brand ────────────────────────────────
    ("about_brand",
     "Who is Accesco Living for?",
     "Accesco serves eight customer segments across Bengaluru — working "
     "professionals, students, young couples, nuclear families, high-income "
     "households, gated-community residents, frequent online shoppers, and "
     "convenience-first consumers."),
    ("about_brand",
     "Do you serve gated communities?",
     "Yes — gated-community residents are our highest-priority segment. We "
     "partner with RWA/society networks across Koramangala, HSR Layout, "
     "Indiranagar, and Whitefield."),
    ("about_brand",
     "Do you cater to students?",
     "Yes — students order 2-4 times a week, mostly late-night snacks, "
     "beverages, instant noodles, ice cream, and personal care."),
    ("about_brand",
     "Are you good for working professionals?",
     "Yes — working professionals order 4-6 times a week, peaking in the "
     "morning and late night, preferring groceries, snacks, and beverages."),
    ("about_brand",
     "Do you serve families?",
     "Yes — nuclear families are a priority segment ordering 8-14 times a "
     "week across groceries, dairy, fresh vegetables, baby products, "
     "medicines, and school supplies."),
    ("about_brand",
     "Do you stock premium products?",
     "Yes — for high-income households we carry premium organics, imported "
     "products, gourmet foods, premium skincare, and pet food."),
    ("about_brand",
     "Which areas does Accesco prioritize?",
     "Phase-1 priority localities are Koramangala, HSR Layout, Indiranagar, "
     "and Whitefield."),
    ("about_brand",
     "What is a typical Accesco order pattern?",
     "Ordering varies by segment — from 2-4 orders a week for students to "
     "10-16 orders a week for gated-community households, with morning and "
     "late-evening peaks."),
    # ── 66.pdf — competitive positioning → comparison ─────────────────────
    ("comparison",
     "How is Accesco different from Blinkit and Zepto?",
     "We combine rapid micro-fulfillment delivery with competitive pricing, "
     "circular recycling rewards, and direct pharmacist support."),
    ("comparison",
     "Why choose Accesco over Swiggy Instamart?",
     "We offer competitive pricing, lower handling fees, integrated circular "
     "recycling rewards, and direct pharmacist support."),
    ("comparison",
     "Is Accesco cheaper than other quick-commerce apps?",
     "We source directly and operate efficient local dark-store networks to "
     "keep everyday prices competitive and minimize surge fees."),
    ("comparison",
     "What brands do you carry that Zepto doesn't?",
     "We carry selective local organic producers, direct-to-consumer "
     "specialty labels, and eco-friendly circular brands."),
    # ── 66.pdf — referral → referral_rewards ──────────────────────────────
    ("referral_rewards",
     "Do you have a referral or invite-and-earn program?",
     "Yes — share your unique code or link with friends; when they register "
     "and place their first order, both of you earn promotional rewards."),
    ("referral_rewards",
     "What is the referral bonus?",
     "Referral bonuses are awarded when a friend registers using your link "
     "and completes a specified number of initial deliveries."),
    # ── 66.pdf — category popularity → grokly_grocery ─────────────────────
    ("grokly_grocery",
     "What are your most popular product categories?",
     "Snacks, beverages, fresh produce, dairy, ready-to-eat meals, home "
     "care, and personal care are the most ordered categories."),
    ("grokly_grocery",
     "Do you sell fresh produce and dairy?",
     "Yes — fresh produce and dairy are top categories, especially for "
     "families and gated-community households."),
    # ── Spending report → xpense_budget ───────────────────────────────────
    ("xpense_budget",
     "What is the average household spend in Bangalore?",
     "Across a sample of 2,430 transactions, household spend is fairly "
     "evenly distributed across categories at about 5.66-6.64 lakh each, "
     "with Insurance, Shopping, and Utilities the largest by value."),
    ("xpense_budget",
     "Which categories do Bangalore households overspend on?",
     "Utilities (37%), Rent (36%), and Insurance (35.6%) have the highest "
     "budget-overrun rates, while Healthcare and Food are the most "
     "disciplined."),
    ("xpense_budget",
     "How many Bangalore households stay within budget?",
     "66.5% of transactions stay within budget, and actual spend runs 7-10% "
     "under budget in aggregate across categories."),
    ("xpense_budget",
     "What payment methods do Bangalore households use?",
     "Payment usage is nearly balanced across Card, Cash, Net Banking, and "
     "UPI (about 24-26% each), so no single mode dominates."),
    ("xpense_budget",
     "When do Bangalore households spend the most?",
     "Spend shows a mild seasonal peak in March and May."),
    ("xpense_budget",
     "What is a realistic monthly grocery budget?",
     "Grocery is one of the most budget-disciplined categories (about 30.5% "
     "over-budget rate), with local-store grocery purchases among the "
     "highest-value subcategories."),
    # ── Spending report → pricing_payment ─────────────────────────────────
    ("pricing_payment",
     "Which payment modes does Accesco support?",
     "We accept UPI, cards, net banking, digital wallets, and Cash on "
     "Delivery — mirroring how Bangalore households actually pay, which is "
     "nearly balanced across modes."),
    ("pricing_payment",
     "Is there a minimum order value for delivery?",
     "Minimum order thresholds apply to free-delivery and subscription "
     "benefits; COD availability depends on your pincode and order value."),
]

DEFAULT_INTENT = "about_brand"


def main():
    with open(CSV_PATH, encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    existing_ids = {int(r["id"]) for r in rows}
    existing_questions = {r["question"].strip().lower() for r in rows}

    next_id = max(existing_ids) + 1
    added = 0
    for intent, question, answer in PAIRS:
        if question.lower() in existing_questions:
            continue
        rows.append({"id": str(next_id), "intent": intent,
                     "question": question, "answer": answer})
        next_id += 1
        added += 1

    with open(CSV_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

    from collections import Counter
    added_intents = Counter(r["intent"] for r in rows if int(r["id"]) > max(existing_ids))
    print(f"Curated {len(PAIRS)} pairs, appended {added} new rows → {CSV_PATH}")
    print(f"Added intent distribution: {dict(added_intents)}")
    print(f"Total rows: {len(rows)}")


if __name__ == "__main__":
    main()