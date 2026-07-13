'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import SwadishttHeader from '../../components/SwadishttHeader';
import { RESTAURANTS } from '../../lib/swadishttData';
import styles from './category.module.css';

const CATEGORY_MAP = {
  biryani: {
    title: 'Biryani Feast',
    desc: 'Fragrant, slow-cooked rice dishes layered with premium meat, saffron, and traditional spices.',
    keywords: ['biryani', 'pulao', 'rice'],
  },
  burgers: {
    title: 'Gourmet Craft Burgers',
    desc: 'Juicy layered patties, melted cheese slices, crunchy lettuce, and artisanal fast-food favorites.',
    keywords: ['burger', 'fries', 'fast food'],
  },
  pizza: {
    title: 'Artisanal Wood-Fired Pizza',
    desc: 'Neapolitan-style hand-stretched pizzas topped with fresh mozzarella, basil, and choice toppings.',
    keywords: ['pizza', 'garlic bread'],
  },
  'south-indian': {
    title: 'South Indian Heritage',
    desc: 'Crispy ghee dosas, fluffy steamed idlis, filter coffee, and comforting breakfast classics.',
    keywords: ['south indian', 'dosa', 'idli', 'uttapam', 'payasam'],
  },
  'north-indian': {
    title: 'North Indian Clay Oven',
    desc: 'Rich buttery gravies, slow-cooked dal makhani, tender paneer, and clay-oven tandoori breads.',
    keywords: ['north indian', 'paneer', 'dal makhani', 'butter chicken', 'tandoori', 'naan', 'roti', 'sarson', 'saag'],
  },
  beverages: {
    title: 'Cold Brews & Beverages',
    desc: 'Premium roasted coffees, thick milkshakes, and refreshing cold drinks to complement your meal.',
    keywords: ['beverage', 'coffee', 'juice', 'drink', 'shake', 'lassi', 'cappuccino'],
  },
  desserts: {
    title: 'Patisserie & Desserts',
    desc: 'Plush truffle cakes, warm Belgian waffles, red velvet pastries, and sweet clay-pot mishti doi.',
    keywords: ['dessert', 'cake', 'sweet', 'pastry', 'ice cream', 'gulab jamun', 'tiramisu', 'cheesecake', 'brownie', 'waffle'],
  },
  snacks: {
    title: 'Snacks',
    desc: 'Quick bites, fries and snackable favourites.',
    keywords: ['snack', 'fries', 'starter'],
  },
  'street-food': {
    title: 'Subcontinental Street Food',
    desc: 'Tangy spiced chaats, hot pav bhaji plates, and crunchy regional street delicacies.',
    keywords: ['street food', 'samosa', 'chaat', 'vada pav', 'pav bhaji', 'bhel', 'sev'],
  },
  coastal: {
    title: 'Coastal Specialties & Seafood',
    desc: 'Fresh seafood curries, prawn ghee roasts, and coconut-infused Malabar stews.',
    keywords: ['coastal', 'prawn', 'fish', 'seafood', 'malabar', 'crab'],
  },
  salads: {
    title: 'Salads & Healthy Bowls',
    desc: 'Fresh ingredients, crisp farm greens, and highly nutritious dressings.',
    keywords: ['salad', 'healthy', 'bowl'],
  },
  pasta: {
    title: 'Pasta',
    desc: 'Creamy, cheesy and saucy pasta options from nearby restaurants.',
    keywords: ['pasta', 'italian', 'alfredo', 'arrabbiata', 'macaroni'],
  },
  biryani: {
    title: 'Biryani',
    desc: 'Aromatic biryanis, rice bowls and royal meal favourites.',
    keywords: ['biryani', 'rice', 'hyderabadi', 'dum'],
  },
  'fried-rice': {
    title: 'Fried Rice',
    desc: 'Flavourful fried rice, Indo-Chinese bowls and quick meals.',
    keywords: ['fried rice', 'chinese', 'rice', 'noodles'],
  },
};

export default function CategoryPage() {
  const params = useParams();
  const categoryKey = params.slug;
  const category = CATEGORY_MAP[categoryKey];

  if (!category) {
    return (
      <div className={styles.page}>
        <SwadishttHeader />
        <main className={styles.container}>
          <div className={styles.breadcrumbs}>
            <Link href="/services/swadisht" className={styles.breadLink}>Swadishtt</Link>
            <span className={styles.breadSep}>/</span>
            <span className={styles.breadCurrent}>Not Found</span>
          </div>
          <h1 className={styles.errorTitle}>Category Not Found</h1>
          <p className={styles.errorDesc}>The selected culinary module could not be loaded.</p>
          <Link href="/services/swadisht/categories" className={styles.btnSecondary}>
            Back to Categories
          </Link>
        </main>
      </div>
    );
  }

  const restaurants = RESTAURANTS.filter((restaurant) => {
    const cuisines = restaurant.cuisines.join(' ').toLowerCase();
    const menu = restaurant.menu
      .map((item) => `${item.name} ${item.category}`)
      .join(' ')
      .toLowerCase();

    return category.keywords.some(
      (keyword) => cuisines.includes(keyword) || menu.includes(keyword)
    );
  });

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.breadcrumbs}>
            <Link href="/services/swadisht" className={styles.breadLink}>Swadishtt</Link>
            <span className={styles.breadSep}>/</span>
            <Link href="/services/swadisht/categories" className={styles.breadLink}>Categories</Link>
            <span className={styles.breadSep}>/</span>
            <span className={styles.breadCurrent}>{category.title}</span>
          </div>

          <h1 className={styles.title}>{category.title}</h1>
          <p className={styles.desc}>{category.desc}</p>

          <div className={styles.resultsBar}>
            <h2 className={styles.resultsCount}>
              {restaurants.length} {restaurants.length === 1 ? 'Restaurant' : 'Restaurants'} delivering this cuisine
            </h2>
          </div>

          <div className={styles.grid}>
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/services/swadisht/restaurant/${restaurant.slug}`}
                className={styles.card}
              >
                <div className={styles.imageBox}>
                  <img
                    src={restaurant.coverImage}
                    alt={restaurant.name}
                    className={styles.image}
                  />
                  {restaurant.offers && restaurant.offers.length > 0 && (
                    <div className={styles.offerBadge}>
                      {restaurant.offers[0].title}
                    </div>
                  )}
                </div>

                <div className={styles.info}>
                  <div className={styles.cardHeaderRow}>
                    <h3 className={styles.restaurantName}>{restaurant.name}</h3>
                    <div className={styles.ratingBadge}>
                      <span className={styles.star}>★</span> {restaurant.rating}
                    </div>
                  </div>

                  <p className={styles.cuisines}>{restaurant.cuisines.slice(0, 3).join(' · ')}</p>
                  
                  <div className={styles.metaRow}>
                    <span className={styles.metaVal}>{restaurant.deliveryTime}</span>
                    <span className={styles.metaDot}>•</span>
                    <span className={styles.metaVal}>₹{restaurant.priceForTwo} for two</span>
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.area}>{restaurant.location.area}</span>
                    <span className={styles.skuLabel}>{restaurant.sku}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}