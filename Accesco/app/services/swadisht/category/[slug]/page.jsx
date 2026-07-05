'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import SwadishttHeader from '../../components/SwadishttHeader';
import { RESTAURANTS } from '../../lib/swadishttData';
import styles from './category.module.css';

const CATEGORY_MAP = {
  burgers: {
    title: 'Burgers',
    desc: 'Satisfy your cravings with juicy burgers and fast food favourites.',
    keywords: ['burger'],
  },
  pizza: {
    title: 'Pizza',
    desc: 'Cheesy pizzas from restaurants near you.',
    keywords: ['pizza'],
  },
  'south-indian': {
    title: 'South Indian',
    desc: 'Crispy dosas, idlis and South Indian breakfast favourites.',
    keywords: ['south indian', 'dosa', 'idli'],
  },
  'north-indian': {
    title: 'North Indian',
    desc: 'Comforting curries, rotis, naans, paneer dishes and North Indian meals.',
    keywords: ['north indian', 'paneer', 'roti', 'naan', 'dal', 'curry', 'paratha'],
  },
  beverages: {
    title: 'Beverages',
    desc: 'Refreshing drinks, coffees and juices.',
    keywords: ['beverage', 'coffee', 'juice', 'drink'],
  },
  desserts: {
    title: 'Desserts',
    desc: 'Cakes, sweets and desserts to finish your meal.',
    keywords: ['dessert', 'desserts', 'cake', 'sweet', 'sweets', 'bakery'],
  },
  snacks: {
    title: 'Snacks',
    desc: 'Quick bites, fries and snackable favourites.',
    keywords: ['snack', 'fries', 'starter'],
  },
  salads: {
    title: 'Salads',
    desc: 'Fresh and healthy salad options.',
    keywords: ['salad', 'healthy'],
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
  const category = CATEGORY_MAP[params.slug];

  if (!category) {
    return (
      <>
        <SwadishttHeader />
        <main className={styles.page}>
          <section className={styles.container}>
            <Link href="/services/swadisht" className={styles.backLink}>
              ← Back
            </Link>
            <h1>Category not found</h1>
          </section>
        </main>
      </>
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
    <>
      <SwadishttHeader />

      <main className={styles.page}>
        <section className={styles.container}>
          <Link href="/services/swadisht" className={styles.backLink}>
            ← Back
          </Link>

          <h1>{category.title}</h1>
          <p className={styles.desc}>{category.desc}</p>

         <div className={styles.filters}>
  <button type="button" className={styles.filterBtn}>
    Filter
  </button>

  <button type="button" className={styles.filterBtn}>
    Sort By ▼
  </button>

  <button type="button" className={styles.filterBtn}>
    Rating 4.0+
  </button>

  <button type="button" className={styles.filterBtn}>
    Delivery Time
  </button>

  <button type="button" className={styles.filterBtn}>
    Cost For Two
  </button>
</div>

          <h2>{restaurants.length} Restaurants to explore</h2>

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
                  />
                </div>

                <div className={styles.info}>
                  <h3>{restaurant.name}</h3>

                  <p className={styles.rating}>
                    <span>★</span> {restaurant.rating} • {restaurant.deliveryTime}
                  </p>

                  <p>{restaurant.cuisines.slice(0, 3).join(', ')}</p>
                  <p>{restaurant.location.area}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}