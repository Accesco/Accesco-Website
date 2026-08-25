"""Mood-based product recommendations from the live catalog.

Maps 8 detected mood tags to product categories in the live catalog,
then returns matching products for the chatbot to display as cards.

Only recommends products that ACTUALLY EXIST in the live_catalog.json
(Firestore-backed, 271 products).
"""

# 8 Mood tags → list of live catalog categories to search
MOOD_CATEGORY_MAP = {
    "romantic": ["sweet-tooth", "international-foods", "personal-care", "cold-drinks", "bakery-biscuits"],
    "date-night": ["sweet-tooth", "cold-drinks", "international-foods", "bakery-biscuits"],
    "birthday": ["sweet-tooth", "cold-drinks", "munchies", "bakery-biscuits", "international-foods", "frozen-snacks"],
    "party": ["munchies", "cold-drinks", "sweet-tooth", "frozen-snacks", "bakery-biscuits"],
    "festival": ["sweet-tooth", "munchies", "cold-drinks", "international-foods", "masala-oil", "dairy-breakfast"],
    "self-care": ["personal-care", "organic-healthy", "health-supplements", "tea-coffee", "dairy-breakfast"],
    "housewarming": ["cleaning", "kitchenware", "home-office", "munchies", "cold-drinks", "sweet-tooth"],
    "apology": ["sweet-tooth", "international-foods", "personal-care", "bakery-biscuits"],
    "sports": ["organic-healthy", "cold-drinks", "health-supplements", "dairy-breakfast", "munchies"],
}

# Maximum products to return per mood query
MOOD_PRODUCT_LIMIT = 5


def get_mood_products(mood_tag: str, products: list[dict], limit: int = MOOD_PRODUCT_LIMIT) -> list[dict]:
    """Get products matching a mood tag from the live catalog snapshot.

    Args:
        mood_tag: The detected mood intent (e.g. 'birthday')
        products: The current live catalog products list from LIVE.snapshot()
        limit: Max products to return

    Returns:
        List of matching product dicts, empty if mood has no mapping or no products found.
    """
    categories = MOOD_CATEGORY_MAP.get(mood_tag, [])
    if not categories:
        return []

    # Filter products by matching categories, prefer in-stock
    matching = [
        p for p in products
        if p.get("category", "") in categories and p.get("in_stock", True)
    ]

    # If not enough in-stock, add out-of-stock too
    if len(matching) < limit:
        out_of_stock = [
            p for p in products
            if p.get("category", "") in categories and not p.get("in_stock", True)
        ]
        matching.extend(out_of_stock)

    # Diversify: pick from different categories if possible
    seen_categories = {}
    diverse = []
    for p in matching:
        cat = p.get("category", "")
        if cat not in seen_categories:
            seen_categories[cat] = 0
        if seen_categories[cat] < 2:  # max 2 per category
            diverse.append(p)
            seen_categories[cat] += 1
        if len(diverse) >= limit:
            break

    # If diversity didn't fill the limit, add more
    if len(diverse) < limit:
        for p in matching:
            if p not in diverse:
                diverse.append(p)
                if len(diverse) >= limit:
                    break

    return diverse[:limit]


def is_mood_intent(intent: str) -> bool:
    """Check if an intent is one of the 8 mood tags."""
    return intent in MOOD_CATEGORY_MAP


def mood_has_products(mood_tag: str) -> bool:
    """Check if a mood tag maps to any product categories (all 8 do)."""
    return bool(MOOD_CATEGORY_MAP.get(mood_tag, []))
