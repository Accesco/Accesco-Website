# Build the market-research knowledge base for the chatbot.
#
# Sources:
#   chatbot-data/66.pdf  (Bengaluru quick-commerce ICP / acquisition deck)
#   chatbot-data/Bangalore Household Spending Report.pdf
#
# These PDFs have no Q&A/intent structure, so curated Q&A pairs were hand-written
# (mirroring data/add_research_faqs.py) and written to:
#   chatbot-ml/data/knowledge_faq.json
#
# The inference server embeds every question at startup and answers the user query
# from the best-matching entry (RAG without an LLM) — same pattern as
# recovery_faq.json. This file only prepares the text data.
#
# Usage:
#   python3 chatbot-ml/data/build_knowledge_faq.py

import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "../data")
OUT_PATH = os.path.join(DATA_DIR, "knowledge_faq.json")

# (source, question, answer) — content grounded in the two PDFs.
PAIRS = [
    # ── 66.pdf — ICP segments / who Accesco serves ─────────────────────────
    ("icp", "Who is Accesco for?",
     "Accesco serves eight customer segments across Bengaluru — working "
     "professionals, students, young couples, nuclear families, high-income "
     "households, gated-community residents, frequent online shoppers, and "
     "convenience-first consumers."),
    ("icp", "Who are Accesco's target customers?",
     "Accesco targets eight ICPs: working professionals, students, young "
     "couples, nuclear families, high-income households, gated-community "
     "residents, frequent online shoppers, and convenience-first consumers."),
    ("icp", "Do you serve gated communities?",
     "Yes — gated-community residents are our highest-priority segment. We "
     "partner with RWA/society networks across Koramangala, HSR Layout, "
     "Indiranagar, and Whitefield."),
    ("icp", "Do you deliver to gated community residents?",
     "Yes — gated communities are a priority segment. We run MyGate and RWA "
     "partnerships plus society WhatsApp broadcasts to serve residents in "
     "Koramangala, HSR Layout, Indiranagar, and Whitefield."),
    ("icp", "Do you cater to students?",
     "Yes — students order 2-4 times a week, mostly late-night snacks, "
     "beverages, instant noodles, ice cream, and personal care. We reach them "
     "through Instagram Reels, campus ambassador programs, and college "
     "WhatsApp groups."),
    ("icp", "Do you serve working professionals?",
     "Yes — working professionals order 4-6 times a week, peaking in the "
     "morning and late night, preferring groceries, snacks, and beverages."),
    ("icp", "Are you good for young couples?",
     "Yes — young couples (DINKs) order 6-9 times a week, preferring premium "
     "groceries, meal kits, fresh produce, beauty and skincare, and home "
     "essentials."),
    ("icp", "Do you serve families?",
     "Yes — nuclear families are a priority segment ordering 8-14 times a "
     "week across groceries, dairy, fresh vegetables, baby products, "
     "medicines, and school supplies."),
    ("icp", "Do you stock premium products?",
     "Yes — for high-income households we carry premium organics, imported "
     "products, gourmet foods, premium skincare, and pet food."),
    ("icp", "Which areas does Accesco prioritize?",
     "Phase-1 priority localities are Koramangala, HSR Layout, Indiranagar, "
     "and Whitefield."),
    ("icp", "What are Accesco's priority segments?",
     "The Phase-1 focus is gated-community residents (highest priority), "
     "high-income households (highest spend), and nuclear families (most "
     "scalable), across Koramangala, HSR Layout, Indiranagar, and "
     "Whitefield."),
    ("icp", "What is a typical Accesco order pattern?",
     "Ordering varies by segment — from 2-4 orders a week for students to "
     "10-16 orders a week for gated-community households, with morning and "
     "late-evening peaks."),
    ("icp", "What are Accesco's peak ordering hours?",
     "Peaks vary by segment: working professionals order in the morning and "
     "late night, students order 11 PM-2 AM, and families peak during school "
     "hours and evening dinner time."),
    # ── 66.pdf — competitive positioning ───────────────────────────────────
    ("comparison", "How is Accesco different from Blinkit and Zepto?",
     "We combine rapid micro-fulfillment delivery with competitive pricing, "
     "circular recycling rewards, and direct pharmacist support."),
    ("comparison", "How are you different from Blinkit?",
     "We combine rapid micro-fulfillment delivery with competitive pricing, "
     "circular recycling rewards, and direct pharmacist support."),
    ("comparison", "What makes Accesco different from other apps?",
     "We combine rapid micro-fulfillment delivery with competitive pricing, "
     "circular recycling rewards, and direct pharmacist support."),
    ("comparison", "What makes you different from other apps?",
     "We combine rapid micro-fulfillment delivery with competitive pricing, "
     "circular recycling rewards, and direct pharmacist support."),
    ("comparison", "Why choose Accesco over Swiggy Instamart?",
     "We offer competitive pricing, lower handling fees, integrated circular "
     "recycling rewards, and direct pharmacist support."),
    ("comparison", "Is Accesco cheaper than other quick-commerce apps?",
     "We source directly and operate efficient local dark-store networks to "
     "keep everyday prices competitive and minimize surge fees."),
    ("comparison", "Are you cheaper than other apps?",
     "We source directly and operate efficient local dark-store networks to "
     "keep everyday prices competitive and minimize surge fees."),
    ("comparison", "What brands do you carry that Zepto doesn't?",
     "We carry selective local organic producers, direct-to-consumer "
     "specialty labels, and eco-friendly circular brands."),
    # ── 66.pdf — referral program ──────────────────────────────────────────
    ("referral", "Do you have a referral or invite-and-earn program?",
     "Yes — share your unique code or link with friends; when they register "
     "and place their first order, both of you earn promotional rewards."),
    ("referral", "What is the referral bonus?",
     "Referral bonuses are awarded when a friend registers using your link "
     "and completes a specified number of initial deliveries."),
    ("referral", "How do I earn rewards for referring friends?",
     "Share your unique code or link; when a friend registers and completes "
     "their qualifying first order, both of you earn promotional rewards."),
    # ── 66.pdf — categories / popularity ───────────────────────────────────
    ("categories", "What are your most popular product categories?",
     "Snacks, beverages, fresh produce, dairy, ready-to-eat meals, home "
     "care, and personal care are the most ordered categories."),
    ("categories", "Do you sell fresh produce and dairy?",
     "Yes — fresh produce and dairy are top categories, especially for "
     "families and gated-community households."),
    ("categories", "What do students usually order?",
     "Students mostly order snacks, beverages, instant noodles, ice cream, "
     "and personal care, usually late at night."),
    # ── Spending report — household spending insights ──────────────────────
    ("spending", "What is the average household spend in Bangalore?",
     "Across a sample of 2,430 transactions, household spend is fairly "
     "evenly distributed across categories at about 5.66-6.64 lakh each, "
     "with Insurance, Shopping, and Utilities the largest by value."),
    ("spending", "Which categories do Bangalore households overspend on?",
     "Utilities (37%), Rent (36%), and Insurance (35.6%) have the highest "
     "budget-overrun rates, while Healthcare and Food are the most "
     "disciplined (about 30% over-budget)."),
    ("spending", "How many Bangalore households stay within budget?",
     "66.5% of transactions stay within budget, and actual spend runs 7-10% "
     "under budget in aggregate across categories."),
    ("spending", "What payment methods do Bangalore households use?",
     "Payment usage is nearly balanced across Card, Cash, Net Banking, and "
     "UPI (about 24-26% each), so no single mode dominates."),
    ("spending", "When do Bangalore households spend the most?",
     "Spend shows a mild seasonal peak in March and May."),
    ("spending", "What is a realistic monthly grocery budget?",
     "Grocery is one of the most budget-disciplined categories (about 30.5% "
     "over-budget rate), with local-store grocery purchases among the "
     "highest-value subcategories."),
    ("spending", "How much does the average household spend per transaction?",
     "Average spend per transaction is remarkably flat across household "
     "sizes, ranging only from about 2,496 rupees."),
    ("spending", "What are the highest-value spending subcategories?",
     "Rent, Insurance, and local-store grocery purchases are the "
     "highest-value individual subcategories — natural anchor points for "
     "partnerships, loyalty, or bundled offers."),
]


def main():
    faqs = [
        {"source": src, "question": q, "answer": a}
        for src, q, a in PAIRS
    ]
    output = {
        "faqs": faqs,
        "source": "chatbot-data/66.pdf + Bangalore Household Spending Report.pdf (2026-08-19)",
    }
    with open(OUT_PATH, "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    print(f"Built {len(faqs)} knowledge FAQ entries → {OUT_PATH}")


if __name__ == "__main__":
    main()