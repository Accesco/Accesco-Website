"""Rebuild the full training pipeline including mood tag data.

Generates the mood tag training examples, merges them into faq_data.json,
labels everything, fixes mood-tag labels that were stolen by broad rules,
and prints the final intent distribution.

Usage:
    python chatbot-ml/data/rebuild_with_mood_tags.py
"""

import csv
import json
import os
import re
from collections import Counter

BASE = os.path.dirname(os.path.abspath(__file__))
FAQ_PATH = os.path.join(BASE, "../data/faq_data.json")
OUT_PATH = os.path.join(BASE, "../data/faq_labeled.csv")

# ─── 100 mood-tag training examples (2 per tag) ────────────────────────────

MOOD_EXAMPLES = [
    (501, "birthday_party", "I need stuff for a birthday party", "I can help you plan a birthday! We have cakes, cold drinks, chips, candles, and decorations available on Grokly."),
    (502, "birthday_party", "what should I order for my friend's birthday celebration", "For a birthday celebration I'd suggest cake, balloons, party cups, cold drinks, and snacks."),
    (503, "house_party", "friends coming over tonight need party snacks", "Party time! I'd suggest chips, nachos, cold drinks, dips, and maybe some ice cream."),
    (504, "house_party", "I'm hosting a get-together at my place this weekend", "For a house party you'll want snacks, beverages, cups, plates, and maybe some desserts."),
    (505, "shopping_spree", "I just want to shop for random things", "Let's go shopping! You can browse Grokly for groceries, InstaStyle for fashion, or Swadisht for food."),
    (506, "shopping_spree", "show me everything you have I want to buy stuff", "We have groceries on Grokly, fashion on InstaStyle, food on Swadisht, and medicines on LocalMeds."),
    (507, "angry_complaint", "my order is wrong and nobody is helping me", "I'm sorry you're having a bad experience. Please reach out to our support team and we'll resolve this immediately."),
    (508, "angry_complaint", "this is the worst service I have ever seen", "I apologize for the inconvenience. Please contact our support team so we can fix this for you right away."),
    (509, "find_out_more", "how does this whole thing work", "Accesco Living is an all-in-one commerce platform with grocery, food, fashion, and pharmacy delivery."),
    (510, "find_out_more", "tell me more about your services", "We offer Grokly (groceries), Swadisht (food), InstaStyle (fashion), and LocalMeds (pharmacy)."),
    (511, "urgent_need", "I need paracetamol right now it's urgent", "For urgent medicine needs, check LocalMeds — we deliver pharmacy items fast."),
    (512, "urgent_need", "emergency I need diapers immediately my baby is crying", "I understand the urgency! Check Baby Care on Grokly for diapers."),
    (513, "gift_shopping", "looking for a gift for my girlfriend", "For gifting, check out InstaStyle for fashion items or Grokly for chocolate gift boxes."),
    (514, "gift_shopping", "what can I buy as a housewarming gift", "For a housewarming gift you could pick up a nice kitchen set or a premium food hamper."),
    (515, "healthy_lifestyle", "suggest me some low calorie snacks", "Check out our Organic & Healthy section on Grokly for low-cal snacks and protein bars."),
    (516, "healthy_lifestyle", "I want to eat clean what healthy options do you have", "We have organic produce, muesli, oats, sugar-free items, and fresh fruits on Grokly."),
    (517, "budget_conscious", "show me the cheapest groceries available", "Budget-friendly shopping! Check our value packs and daily essentials on Grokly."),
    (518, "budget_conscious", "I don't have much money what can I afford", "Grokly has affordable essentials and value packs. Use Xpense Meter to set a budget."),
    (519, "new_user_onboarding", "I just signed up what do I do now", "Welcome to Accesco! Browse Grokly for groceries, Swadisht for food, or InstaStyle for fashion."),
    (520, "new_user_onboarding", "this is my first time using this app how does it work", "Welcome! Pick a service, browse products, add to cart, and get fast delivery."),
    (521, "cooking_meal", "I want to cook biryani tonight what do I need", "For biryani you'll need rice, spices, onions, tomatoes, yogurt. Check Grokly!"),
    (522, "cooking_meal", "need ingredients for making pasta", "For pasta you'll need noodles, olive oil, garlic, tomatoes, cheese, and herbs."),
    (523, "late_night_craving", "I'm hungry at 2am what can I get", "Late night cravings! Check instant noodles, chips, biscuits, and ready-to-eat on Grokly."),
    (524, "late_night_craving", "midnight snack options please", "For midnight munchies we have Maggi, chips, chocolates, ice cream, and ready-to-eat meals."),
    (525, "bulk_order", "need 20 packets of chips for a college event", "Bulk ordering! Add multiple quantities of any item to your cart on Grokly."),
    (526, "bulk_order", "I want to order groceries in large quantities for a function", "For bulk orders, browse Grokly and add the quantities you need."),
    (527, "kid_needs", "my daughter needs lunch snacks for school", "For school snacks check biscuits, juice boxes, chips, and healthy bars on Grokly."),
    (528, "kid_needs", "what do you have for my 5 year old", "For kids we have snacks, juices, cereals, baby food, and fun treats on Grokly."),
    (529, "festival_prep", "Diwali is coming I need sweets and diyas", "Festive shopping! Check Sweet Tooth on Grokly for sweets and dry fruits."),
    (530, "festival_prep", "need to buy things for Christmas celebration", "Check out cakes, chocolates, cold drinks, and party supplies on Grokly."),
    (531, "pet_care", "what dog food brands do you have", "Check our Pet Care section on Grokly for Pedigree, Whiskas, and other brands."),
    (532, "pet_care", "my cat needs food and litter", "Check Pet Care on Grokly for cat food and supplies."),
    (533, "sustainability_query", "are your packages biodegradable", "We use eco-friendly packaging where possible and our SKU Recovery Framework lets you return packaging."),
    (534, "sustainability_query", "does accesco care about the environment", "We run a circular commerce model — you can return packaging for recycling and earn rewards."),
    (535, "compliment", "amazing service delivery was super fast", "Thank you so much! We're glad you had a great experience."),
    (536, "compliment", "I love using accesco everything is so convenient", "That means a lot to us! We're happy you're enjoying Accesco."),
    (537, "reorder", "I want to order the same thing as last time", "You can reorder from your order history in your profile."),
    (538, "reorder", "can you repeat my previous order", "Go to your order history, find the order, and hit reorder."),
    (539, "cancel_or_modify", "I want to remove an item from my order", "Go to your active orders and edit the items, or contact support."),
    (540, "cancel_or_modify", "cancel my order I changed my mind", "Go to active orders and tap cancel. If dispatched, reach out to support."),
    (541, "date_night", "planning a date night need candles and dessert", "For date night grab candles, chocolates, and maybe order a meal from Swadisht."),
    (542, "date_night", "I want to set up a romantic dinner at home", "Order fresh ingredients from Grokly or a curated meal from Swadisht."),
    (543, "movie_night", "popcorn and cold drinks for movie night", "Movie night! Grab popcorn, cold drinks, chips from Grokly."),
    (544, "movie_night", "having a movie marathon need snacks and drinks", "Stock up on popcorn, chips, cola, ice cream from Grokly."),
    (545, "breakfast_rush", "running late need quick breakfast options", "Quick breakfast! Check Dairy & Breakfast on Grokly."),
    (546, "breakfast_rush", "what can I eat for breakfast that's fast to make", "Try bread and butter, cornflakes with milk, or poha mix from Grokly."),
    (547, "office_lunch", "order lunch for my office team 5 people", "For team lunch, check Swadisht for freshly prepared meals."),
    (548, "office_lunch", "need to feed 10 people at work what are my options", "Browse Swadisht for meal options or Grokly's Munchies for snacks."),
    (549, "picnic_outdoor", "going for a picnic need packaged snacks and water", "Picnic time! Grab chips, biscuits, juices, water bottles from Grokly."),
    (550, "picnic_outdoor", "outdoor trip tomorrow what snacks should I carry", "Stock up on packaged snacks, water bottles, energy bars from Grokly."),
    (551, "housewarming", "just moved to a new flat need cleaning supplies and snacks for guests", "Get cleaning supplies and snacks from Grokly."),
    (552, "housewarming", "having a housewarming party what should I buy", "Grab snacks, drinks, sweets from Grokly and home essentials."),
    (553, "exam_prep", "need energy drinks and snacks for my exam night", "Study fuel! Grab coffee, energy drinks, chips from Grokly. Good luck!"),
    (554, "exam_prep", "studying all night need something to keep me awake", "Try coffee, dark chocolate, nuts, and energy bars from Grokly."),
    (555, "monsoon_essentials", "it's raining I need soup and tea", "Monsoon vibes! Check Tea & Coffee and Instant & Frozen on Grokly."),
    (556, "monsoon_essentials", "rainy day essentials what should I order", "Grab tea, coffee, soup, biscuits, and instant snacks from Grokly."),
    (557, "summer_heat", "something cold to drink it's 40 degrees outside", "Beat the heat! Check Cold Drinks on Grokly for beverages and ice cream."),
    (558, "summer_heat", "I need ice cream and cold drinks it's too hot", "Grab ice cream and cold drinks from Grokly. Stay hydrated!"),
    (559, "winter_comfort", "I want hot chocolate and warm soup", "Check Tea & Coffee for hot chocolate and Instant & Frozen for soups."),
    (560, "winter_comfort", "cold weather what warm food can I get", "Try soups, hot chocolate, chai from Grokly or hot food from Swadisht."),
    (561, "diet_plan", "I'm on keto show me low carb options", "For keto check Organic & Healthy on Grokly for nuts, seeds, cheese."),
    (562, "diet_plan", "I'm doing intermittent fasting what can I eat in my eating window", "Go for protein-rich foods, healthy fats from Grokly."),
    (563, "protein_fitness", "I need protein bars and peanut butter", "Check Organic & Healthy on Grokly for protein bars and peanut butter."),
    (564, "protein_fitness", "post workout meal suggestions what should I eat", "Post-workout try protein shake, eggs, peanut butter toast."),
    (565, "baby_newborn", "my baby is 6 months old need baby food and diapers", "Check Baby Care on Grokly for baby food, diapers, wipes."),
    (566, "baby_newborn", "what formula milk brands do you carry", "Check Baby Care on Grokly for Nan, Similac, and Lactogen."),
    (567, "sick_recovery", "I'm down with fever need medicines and soup", "Check LocalMeds for medicines and Grokly for soups and light food."),
    (568, "sick_recovery", "feeling unwell what should I eat and take", "Try light soups, crackers, ORS from Grokly and medicines from LocalMeds."),
    (569, "work_from_home", "working from home need coffee and snacks for the day", "WFH essentials! Stock up on coffee, tea, biscuits from Grokly."),
    (570, "work_from_home", "need stuff to get through my work day at home", "Grab coffee, snacks, lunch ingredients from Grokly."),
    (571, "guest_arrival", "guests are coming in 30 minutes need tea and biscuits fast", "Quick! Grab tea, biscuits, namkeen from Grokly. We deliver fast!"),
    (572, "guest_arrival", "unexpected visitors what can I serve them quickly", "Order tea/coffee, biscuits, samosas from Swadisht, cold drinks from Grokly."),
    (573, "weekend_brunch", "lazy Sunday want to make pancakes and smoothies", "Grab pancake mix, eggs, butter, juice, fruits from Grokly."),
    (574, "weekend_brunch", "what should I cook for a relaxed weekend breakfast", "Try eggs, bread, butter, cheese, juice from Dairy & Breakfast."),
    (575, "midnight_cooking", "I want to bake a cake right now need flour and butter", "You'll need flour, butter, sugar, eggs, baking powder from Grokly."),
    (576, "midnight_cooking", "sudden urge to cook at midnight what can I make", "Grab instant noodles, eggs, bread, cheese from Grokly."),
    (577, "hangover_cure", "had too many drinks last night need something to feel better", "Try lemon water, coconut water, bananas, toast from Grokly."),
    (578, "hangover_cure", "hungover what should I eat and drink", "Grab coconut water, fresh juice, bananas, light soup from Grokly."),
    (579, "road_trip", "going on a road trip need chips and water bottles", "Road trip! Stock up on chips, water, biscuits, energy bars from Grokly."),
    (580, "road_trip", "long drive tomorrow need travel snacks", "Grab dry snacks, water, juice boxes, chocolates from Grokly."),
    (581, "wedding_prep", "sister's wedding next week need outfits and sweets", "Check InstaStyle for outfits and Grokly's Sweet Tooth for sweets."),
    (582, "wedding_prep", "I have a wedding to attend need to look good and carry gifts", "Browse InstaStyle for outfits and Grokly for gifting sweets."),
    (583, "breakup_comfort", "feeling sad I just want ice cream and chocolate", "Ice cream and chocolate from Sweet Tooth on Grokly. Take care!"),
    (584, "breakup_comfort", "having a bad day need comfort food", "How about ice cream, chocolate, chips, or a warm meal from Swadisht?"),
    (585, "puja_ritual", "need flowers incense sticks and ghee for puja", "Check Grokly for ghee and incense items in Home & Office."),
    (586, "puja_ritual", "tomorrow is puja need all the prayer items", "Check Home & Office for incense, Masala & Oil for ghee."),
    (587, "hostel_life", "I'm in a hostel need instant noodles and biscuits", "Hostel life! Grab Maggi, biscuits, chips, bread from Grokly."),
    (588, "hostel_life", "college student on a tight budget what cheap food do you have", "Check instant noodles, bread, biscuits, bananas, tea on Grokly."),
    (589, "elderly_care", "my grandma needs her medicines and digestive biscuits", "Check LocalMeds for medicines and Grokly for digestive biscuits."),
    (590, "elderly_care", "ordering for my parents who are senior citizens", "We have medicines on LocalMeds and health drinks on Grokly."),
    (591, "weight_loss", "what can I eat that won't make me fat", "Try fruits, oats, green tea, low-fat options from Organic & Healthy."),
    (592, "weight_loss", "suggest low fat options I'm trying to lose weight", "Check Organic & Healthy for low-fat yogurt, oats, muesli, green tea."),
    (593, "immunity_boost", "I want to boost my immunity suggest something", "Try vitamin C from LocalMeds, turmeric milk, honey, green tea from Grokly."),
    (594, "immunity_boost", "what products help with building immunity", "Turmeric, honey, amla, green tea, vitamins from Grokly and LocalMeds."),
    (595, "snack_attack", "I just want something to munch on right now", "Snack attack! Browse Munchies on Grokly for chips, namkeen, biscuits."),
    (596, "snack_attack", "I'm bored and hungry show me snacks", "Check Munchies on Grokly for chips, nachos, cookies, namkeen."),
    (597, "deep_cleaning", "weekend deep cleaning need floor cleaner and mop", "Check Cleaning section on Grokly for floor cleaner, mops, scrubbers."),
    (598, "deep_cleaning", "I need to clean my entire house what products do you have", "Grab floor cleaner, toilet cleaner, disinfectant from Grokly's Cleaning."),
    (599, "sports_activity", "playing cricket tomorrow need energy bars and water", "Game day! Grab energy bars, water, electrolyte drinks from Grokly."),
    (600, "sports_activity", "going to the gym what should I eat before and after", "Pre-gym: banana, oats. Post-gym: protein bar, eggs. Check Grokly."),
]

# ─── Merge mood examples into faq_data.json ────────────────────────────────

def merge_mood_tags():
    with open(FAQ_PATH, encoding="utf-8") as f:
        faqs = json.load(f)
    existing_ids = {faq["id"] for faq in faqs}
    added = 0
    for faq_id, intent, question, answer in MOOD_EXAMPLES:
        if faq_id in existing_ids:
            continue
        faqs.append({"id": faq_id, "question": question, "answer": answer, "source": "mood_tags"})
        existing_ids.add(faq_id)
        added += 1
    faqs.sort(key=lambda x: x["id"])
    with open(FAQ_PATH, "w", encoding="utf-8") as f:
        json.dump(faqs, f, indent=2, ensure_ascii=False)
    print(f"Merged {added} mood-tag questions -> {len(faqs)} total in faq_data.json")
    return faqs


# ─── Import label rules from label_faqs.py ──────────────────────────────────

from label_faqs import INTENT_RULES, DEFAULT_INTENT

# Mood tag rules (defined here since they may not be in label_faqs.py yet)
MOOD_TAG_RULES = [
    ("birthday_party", r"birthday|bday|b'day|birthday party|birthday celebration"),
    ("house_party", r"house party|get-?together|friends coming over|hosting friends|party at (my|our)"),
    ("shopping_spree", r"shopping spree|shop for everything|buy stuff|random things|just want to shop"),
    ("angry_complaint", r"worst service|terrible|pathetic|useless|nobody.*(help|respond)|disgusting|frustrated|furious"),
    ("find_out_more", r"how does (this|it|the) work|tell me more|what (all|else) (do|can) you|explain.*platform|what services"),
    ("urgent_need", r"urgent|emergency|right now|immediately|asap|as soon as possible|desperately need"),
    ("gift_shopping", r"gift|gifting|present for|surprise for|buy for (my|her|him|their)|anniversary gift"),
    ("healthy_lifestyle", r"healthy|low calorie|clean eating|eat clean|nutritious|health-?conscious|sugar.?free snack"),
    ("budget_conscious", r"cheapest|affordable|tight budget|don't have much money|lowest price|value pack|economical"),
    ("new_user_onboarding", r"just (signed up|joined|downloaded|installed)|first time|new (here|user|to this)|how do i (start|begin|use this)"),
    ("cooking_meal", r"cook|cooking|recipe|ingredients for|make (biryani|pasta|dal|rice|curry|food)|want to (make|prepare|bake)"),
    ("late_night_craving", r"(late night|midnight|2\s?am|1\s?am|3\s?am).*(hungry|food|eat|snack|craving)|hungry at night|midnight (snack|munchies)"),
    ("bulk_order", r"bulk|large quantit|(\d{2,})\s*(packet|piece|box|kg)|wholesale|for (an|the) event|college event"),
    ("kid_needs", r"(my|the) (kid|child|daughter|son|baby).*need|school (snack|lunch|supplies)|for (my|the) (kid|child|children)"),
    ("festival_prep", r"diwali|holi|eid|christmas|navratri|pongal|onam|ganesh|rakhi|festival|festive|diyas?|rangoli"),
    ("pet_care", r"(my|the) (dog|cat|pet|puppy|kitten)|dog food|cat food|pet (food|treat|care|supplies)"),
    ("sustainability_query", r"biodegradable|eco.?friendly|environment|carbon footprint|sustainable packaging|green packaging"),
    ("compliment", r"amazing service|great (service|delivery|experience)|love (this|using|your)|thank you so much|wonderful|excellent|fantastic service"),
    ("reorder", r"reorder|re-?order|same (thing|order|items?) as (last|before|previous)|order again|repeat (my|the) order"),
    ("cancel_or_modify", r"cancel (my|the) order|modify (my|the) order|remove (an|the) item|change (my|the) order|wrong (order|item).*cancel"),
    ("date_night", r"date night|romantic (dinner|evening|night)|candle.?light|romantic"),
    ("movie_night", r"movie night|movie marathon|netflix|binge watch|watching (a|the) movie|popcorn.*movie"),
    ("breakfast_rush", r"(quick|fast|running late).*(breakfast|morning)|breakfast.*rush|morning.*hurry"),
    ("office_lunch", r"office (lunch|food|team)|lunch for (my|the|our) (team|office|colleagues)|feed.*people at work"),
    ("picnic_outdoor", r"picnic|outdoor (trip|outing)|going (for|on) a (picnic|trek|hike)|travel snack"),
    ("housewarming", r"housewarming|new (flat|house|apartment|home).*moved|just moved|griha pravesh"),
    ("exam_prep", r"exam|studying|study (night|session)|board exam|finals|all.?nighter.*study"),
    ("monsoon_essentials", r"monsoon|rainy|raining|rain.*need|barish|rainy (day|season)|soup.*rain"),
    ("summer_heat", r"(too|very|so) hot|40 degree|summer|heat.*wave|scorching|beat the heat|something cold"),
    ("winter_comfort", r"(too|very|so) cold|winter|freezing|chilly|hot (chocolate|cocoa)|warm (soup|food|drink)"),
    ("diet_plan", r"keto|intermittent fasting|low carb|paleo|vegan diet|gluten.?free|calorie (count|deficit)|macros"),
    ("protein_fitness", r"protein (bar|shake|powder)|gym|post.?workout|pre.?workout|fitness|muscle|peanut butter.*protein|whey"),
    ("baby_newborn", r"(newborn|infant|baby).*(food|milk|formula|diaper)|formula milk|cerelac|nan pro|lactogen"),
    ("sick_recovery", r"(feeling|i'm|am) (sick|unwell|ill)|fever|cold and cough|down with|not feeling well|need medicine.*sick"),
    ("work_from_home", r"work(ing)? from home|wfh|home office|work.?day.*snack|remote work"),
    ("guest_arrival", r"guests? (coming|arriving|here)|unexpected (visitor|guest)|visitors? coming|someone.*(coming|visiting)"),
    ("weekend_brunch", r"(weekend|sunday|saturday).*(brunch|breakfast|pancake|smoothie)|lazy (sunday|weekend)|brunch"),
    ("midnight_cooking", r"(bake|cook).*(midnight|late night|right now.*night)|midnight (baking|cooking)|sudden urge to (cook|bake)"),
    ("hangover_cure", r"hangover|too many drinks|drank too much|morning after.*drink|hungover|rough morning"),
    ("road_trip", r"road trip|long drive|travelling|highway.*snack|going (on )?a (trip|drive|journey)"),
    ("wedding_prep", r"wedding|shaadi|marriage.*(shop|prep|buy)|sangeet|mehendi|reception.*buy"),
    ("breakup_comfort", r"breakup|feeling sad|bad day|heartbreak|comfort food|ice cream.*sad|emotional.*eat"),
    ("puja_ritual", r"puja|pooja|prayer|havan|aarti|incense|agarbatti|camphor|diya.*puja|ritual"),
    ("hostel_life", r"hostel|dorm|pg.*food|college.*cheap|student.*(budget|food|need)|mess.*alternative"),
    ("elderly_care", r"(my|the) (grandma|grandpa|grandmother|grandfather|parents|elderly)|senior citizen|old (age|parents)|for (my )?(mom|dad|mother|father).*medicine"),
    ("weight_loss", r"lose weight|weight loss|fat loss|slim down|won't make me fat|trying to (lose|reduce)"),
    ("immunity_boost", r"immunity|immune system|boost (my )?immunity|stay healthy|not fall sick|prevent (cold|flu)"),
    ("snack_attack", r"(just )?want.*(munch|snack)|snack attack|bored.*hungry|something to (munch|nibble)|random snack"),
    ("deep_cleaning", r"deep clean|cleaning (session|day|supplies)|floor cleaner|mop.*need|clean (my|the) (house|flat|room)"),
    ("sports_activity", r"cricket|football|gym.*tomorrow|playing.*tomorrow|sports|match.*tomorrow|workout.*need"),
]

def label_question(question):
    q = question.lower()
    for intent, pattern in MOOD_TAG_RULES:
        if re.search(pattern, q):
            return intent
    for intent, pattern in INTENT_RULES:
        if re.search(pattern, q):
            return intent
    return DEFAULT_INTENT


# ─── Label all FAQs and fix mood-tag labels ─────────────────────────────────

def label_and_fix():
    with open(FAQ_PATH, encoding="utf-8") as f:
        faqs = json.load(f)

    # Build correct intent map from our mood examples
    correct_intents = {faq_id: intent for faq_id, intent, _, _ in MOOD_EXAMPLES}

    rows = []
    for faq in faqs:
        faq_id = faq["id"]
        if faq_id in correct_intents:
            # Force correct mood tag label
            intent = correct_intents[faq_id]
        else:
            intent = label_question(faq["question"])
        rows.append({
            "id": faq_id,
            "intent": intent,
            "question": faq["question"],
            "answer": faq["answer"],
        })

    with open(OUT_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "intent", "question", "answer"])
        writer.writeheader()
        writer.writerows(rows)

    counts = Counter(r["intent"] for r in rows)
    print(f"\nLabeled {len(rows)} questions -> {OUT_PATH}")
    print(f"Total intents: {len(counts)}")
    print(f"\nTop 20 intents:")
    for intent, count in counts.most_common(20):
        print(f"  {intent}: {count}")
    print(f"  ... and {len(counts) - 20} more")


if __name__ == "__main__":
    merge_mood_tags()
    label_and_fix()
