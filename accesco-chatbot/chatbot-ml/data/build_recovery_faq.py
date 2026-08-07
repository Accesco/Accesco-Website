# Build the SKU Recovery FAQ answer index from marketing's SKURecovery.pdf
#
# marketing team's 38 customer-perspective questions + answers, stored as
# static data (transcribed from chatbot-data/SKURecovery.pdf) and written to:
#   chatbot-ml/data/recovery_faq.json
#
# The inference server embeds every FAQ question at startup and answers the
# user query from the best-matching entry (RAG without an LLM) — this file
# only prepares the text data, no model involved.
#
# Usage:
#   python3 chatbot-ml/data/build_recovery_faq.py

import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "../data")
OUT_PATH = os.path.join(DATA_DIR, "recovery_faq.json")

FAQS = [
    {"category": "General", "question": "What is the SKU Recovery Framework?",
     "answer": "The SKU Recovery Framework is Accesco Living's system for taking back eligible product packaging and items after use — bottles, containers, garments, electronics, and more — so materials can be reused, recycled, or responsibly disposed of instead of ending up in landfill."},
    {"category": "General", "question": "How does the SKU Recovery Framework work?",
     "answer": "When you place an order, eligible items are flagged for recovery. On your next delivery, our partner can collect the used packaging or product, which is routed to a fulfillment hub for sorting, reuse, or recycling."},
    {"category": "General", "question": "How is the SKU Recovery Framework different from a regular return policy?",
     "answer": "A standard return is for faulty or unwanted purchases. SKU Recovery is about what happens after you've used a product — collecting empty containers, worn items, or old devices so their materials circulate back into the system."},
    {"category": "General", "question": "Does every order automatically qualify for SKU recovery, or only specific categories?",
     "answer": "Only specific SKUs are enrolled in the framework — mainly reusable packaging, recyclable containers, textiles, and electronics. Eligible items are marked on the product page and in your order summary."},
    {"category": "General", "question": "Can I schedule a pickup for items I want to return?",
     "answer": "Yes. You can request a recovery pickup through the app, and it will be scheduled alongside your next delivery or as a standalone pickup where available."},
    {"category": "General", "question": "Do I get rewards or credits for returning items?",
     "answer": "Many recovered items earn you Accesco reward points or small credits, which you can see reflected in your account after the item is verified at the fulfillment hub."},
    {"category": "General", "question": "Is there a fee for returning items through the SKU Recovery Framework?",
     "answer": "No, recovery pickups for eligible items are free. Some items may have a refundable deposit collected at purchase, which is returned when you send the item back."},
    {"category": "General", "question": "Where do returned SKUs go after collection?",
     "answer": "Collected items go to regional fulfillment hubs, where they're sorted for reuse, refurbishment, recycling, or safe disposal depending on the material and condition."},
    {"category": "General", "question": "Is the SKU Recovery Framework available in all cities Accesco operates in?",
     "answer": "It's currently rolling out city by city, starting with Bengaluru. Availability by category may vary as we expand."},
    {"category": "General", "question": "How does the SKU Recovery Framework reduce landfill waste?",
     "answer": "By intercepting packaging and products before they're thrown away, the framework diverts reusable and recyclable materials back into circulation instead of into municipal waste streams."},
    {"category": "General", "question": "What's NOT accepted under the SKU Recovery Framework?",
     "answer": "Items that are heavily soiled, contaminated, hazardous without proper handling, or not part of an enrolled SKU category currently aren't accepted. The app will always show you what's eligible before pickup."},
    {"category": "General", "question": "Are there items you cannot take back through reverse commerce?",
     "answer": "Yes — perishable food waste, medical sharps, and certain hazardous materials aren't collected through this framework and should be disposed of through appropriate local channels."},
    {"category": "Beverages", "question": "Do you take back empty bottles?",
     "answer": "Yes, empty glass and PET bottles from beverages ordered through Accesco Living can be handed back to your delivery partner for reuse or recycling."},
    {"category": "Beverages", "question": "What happens to returned soft drink or juice bottles?",
     "answer": "Returned bottles are sorted at our fulfillment hubs — glass bottles are cleaned and reused where possible, and plastic bottles are sent for recycling."},
    {"category": "Beverages", "question": "Can I return glass bottles after use?",
     "answer": "Yes, glass bottles are one of the highest-priority items in the framework since they can often be cleaned and reused multiple times."},
    {"category": "Beverages", "question": "Is there a deposit or reward for returning beverage containers?",
     "answer": "Select beverage SKUs include a small refundable deposit or reward credit, shown at checkout, which you get back when you return the empty container."},
    {"category": "Dairy", "question": "Do you reuse or recycle dairy packaging like milk pouches and curd tubs?",
     "answer": "Yes, milk pouches, curd tubs, and similar dairy packaging can be returned for recycling. Reusable glass milk bottles, where offered, are cleaned and put back into circulation."},
    {"category": "Dairy", "question": "Can I return empty milk pouches for a refund or reward?",
     "answer": "Milk pouches don't currently carry a monetary refund, but returning them contributes to your recovery activity and may count toward reward milestones."},
    {"category": "Dairy", "question": "What happens to returned yogurt or curd containers?",
     "answer": "These containers are checked for material type at the hub — reusable ones are cleaned for reuse, and single-use plastic tubs are sent for recycling."},
    {"category": "Fashion", "question": "Do you reuse or resell returned clothing items?",
     "answer": "Gently used clothing collected through InstaStyle's take-back option is assessed for resale, donation, or textile recycling depending on its condition."},
    {"category": "Fashion", "question": "Can I return old clothes through Accesco for recycling?",
     "answer": "Yes, you can hand over old garments — not just ones bought on Accesco — to be recycled into textile fiber or repurposed, subject to hub capacity in your city."},
    {"category": "Fashion", "question": "Is there a take-back program for worn-out garments?",
     "answer": "Yes, worn-out or unwearable clothing is accepted for textile recycling rather than resale, keeping fabric out of landfill."},
    {"category": "Fashion", "question": "Do you accept baby clothing for reuse?",
     "answer": "Yes, baby clothing in good condition can be returned for reuse or resale, and worn items are accepted for textile recycling."},
    {"category": "Fashion", "question": "Does Instastyle's return or exchange policy overlap with the SKU Recovery Framework?",
     "answer": "They're separate — returns/exchanges are for sizing or defects, while SKU Recovery is specifically for end-of-life or unwanted garments you want to responsibly dispose of."},
    {"category": "Electronics & E-waste", "question": "Is e-waste collected by Accesco Living?",
     "answer": "Yes, e-waste collection is part of the SKU Recovery Framework in cities where it's active — you can schedule a pickup for old or non-functional electronics."},
    {"category": "Electronics & E-waste", "question": "Can I return old electronics or gadgets for recycling?",
     "answer": "Yes, small electronics and gadgets can be handed over for certified e-waste recycling, keeping hazardous components out of general waste."},
    {"category": "Electronics & E-waste", "question": "Do you collect used batteries for safe disposal?",
     "answer": "Yes, used batteries are accepted separately from other e-waste and routed to certified handlers for safe disposal, since they require special handling."},
    {"category": "Electronics & E-waste", "question": "What happens to electronic devices returned through the app?",
     "answer": "Devices are assessed at the fulfillment hub — working components may be refurbished, while the rest is processed through certified e-waste recycling partners."},
    {"category": "Packaging", "question": "What packaging materials are accepted for return?",
     "answer": "Cardboard, delivery bags, protective wrap, and most SKU-specific containers (bottles, tubs, boxes) are accepted, provided they're reasonably clean."},
    {"category": "Packaging", "question": "Can I return cardboard boxes and courier packaging?",
     "answer": "Yes, cardboard boxes and courier packaging from your Accesco deliveries can be returned to the delivery partner for reuse or recycling."},
    {"category": "Packaging", "question": "Do you accept plastic wrap and delivery bags for recycling?",
     "answer": "Yes, plastic wrap and delivery bags are collected and sent for recycling where local facilities support it."},
    {"category": "Packaging", "question": "Can I return my grocery packaging to the delivery partner directly?",
     "answer": "Yes, you can hand back eligible packaging directly to the delivery partner at your next order, no separate pickup needed."},
    {"category": "Baby Products", "question": "Do you reuse baby products like bottles, toys, or strollers?",
     "answer": "Yes, baby items in good condition — bottles, toys, strollers, and similar gear — can be returned for cleaning, refurbishment, and reuse through the framework."},
    {"category": "Baby Products", "question": "Can I return used baby gear for recycling or resale?",
     "answer": "Yes, used baby gear is assessed at the hub — functional items are refurbished for resale or donation, and materials from damaged items are recycled where possible."},
    {"category": "Baby Products", "question": "Is there a take-back scheme for diaper or baby-care packaging?",
     "answer": "Diaper packaging and baby-care containers can be returned for recycling, though soiled diapers themselves are not accepted and should go through regular waste disposal."},
    {"category": "Medicines & Wellness", "question": "Are medicine or wellness product containers accepted for return?",
     "answer": "Yes, empty medicine bottles, strips, and wellness product containers can be returned for recycling. Leftover or expired medication should be disposed of through pharmacy take-back channels, not general recovery pickup."},
    {"category": "Furniture & Appliances", "question": "Can I return furniture or home appliances through Accesco?",
     "answer": "Bulky items like furniture and appliances are handled case-by-case — you can request a pickup through support, and eligibility depends on the item's condition and your city's hub capacity."},
    {"category": "Food Waste", "question": "Does the SKU Recovery Framework cover food waste or leftovers?",
     "answer": "No, the framework is built for packaging and product recovery, not perishable food waste. Food waste should be composted or disposed of through your local municipal system."},
]


def main():
    output = {
        "faqs": FAQS,
        "source": "chatbot-data/SKURecovery.pdf (marketing, 2026-08-03)",
    }
    with open(OUT_PATH, "w") as f:
        json.dump(output, f, indent=2)
    print(f"Built {len(FAQS)} FAQ entries → {OUT_PATH}")


if __name__ == "__main__":
    main()
