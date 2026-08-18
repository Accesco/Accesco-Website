"""
Seed the products collection with mock data for development and testing.

Usage:
    python -m scripts.seed_inventory
"""

import logging
from app.extensions import db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def seed_products():
    products_collection = db["products"]

    # Check if we already have products
    if products_collection.count_documents({}) > 0:
        logger.info("Products collection is not empty. Dropping to re-seed...")
        products_collection.drop()

    mock_products = [
        {
            "sku_id": "SKU-404",
            "name": "Organic Avocados (Pack of 4)",
            "price_current": 250.00,
            "farmchain_price": 220.00,
            "units_available": 100,
            "delivery_eta_mins": 30,
            "freshness_score": 0.95
        },
        {
            "sku_id": "SKU-102",
            "name": "Fresh Alphonso Mangoes (1kg)",
            "price_current": 800.00,
            "farmchain_price": 750.00,
            "units_available": 50,
            "delivery_eta_mins": 45,
            "freshness_score": 0.98
        },
        {
            "sku_id": "SKU-999",
            "name": "Artisan Sourdough Bread",
            "price_current": 150.00,
            "farmchain_price": 130.00,
            "units_available": 0,  # Intentional out of stock to test edge case
            "delivery_eta_mins": 60,
            "freshness_score": 0.90
        },
        {
            "sku_id": "SKU-205",
            "name": "Farm Fresh Eggs (Tray of 30)",
            "price_current": 210.00,
            "farmchain_price": 180.00,
            "units_available": 200,
            "delivery_eta_mins": 20,
            "freshness_score": 0.99
        }
    ]

    try:
        result = products_collection.insert_many(mock_products)
        logger.info(
            "Successfully seeded %d products into the database.",
            len(result.inserted_ids),
        )
    except Exception as e:
        logger.error("Failed to seed products: %s", e)


if __name__ == "__main__":
    seed_products()
