import Link from 'next/link';
import styles from './CategorySection.module.css';

const categories = [
  {
    name: 'Salads',
    image: '/images/swadisht/categories/Salad.png',
    href: '/services/swadisht/category/salads',
  },
  {
    name: 'Burgers',
    image: '/images/swadisht/categories/burger.png',
    href: '/services/swadisht/category/burgers',
  },
  {
    name: 'South Indian',
    image: '/images/swadisht/categories/dosa.png',
    href: '/services/swadisht/category/south-indian',
  },
  {
    name: 'Pizza',
    image: '/images/swadisht/categories/pizza.png',
    href: '/services/swadisht/category/pizza',
  },
  {
    name: 'Beverages',
    image: '/images/swadisht/categories/drinks.png',
    href: '/services/swadisht/category/beverages',
  },
  {
    name: 'Dessert',
    image: '/images/swadisht/categories/dessert.png',
    href: '/services/swadisht/category/desserts',
  },
  {
    name: 'Snacks',
    image: '/images/swadisht/categories/snacks.png',
    href: '/services/swadisht/category/snacks',
  },
];

export default function CategorySection() {
  return (
    <section className={styles.categorySection}>
      <div className={styles.sectionHeader}>
        <h2>Top Categories</h2>
        <p>Explore what you’re craving today</p>
      </div>

      <div className={styles.categoryScroller}>
        {categories.map((category) => (
          <Link
            href={category.href}
            key={category.name}
            className={styles.categoryCard}
          >
            <div className={styles.imageWrap}>
              <img src={category.image} alt={category.name} />
            </div>
            <span>{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}