import Link from 'next/link';
import styles from './CategorySection.module.css';

const categories = [
  { name: 'Biryani',      image: '/images/swadisht/categories/biryani.png',    href: '/services/swadisht/categories?category=biryani' },
  { name: 'South Indian', image: '/images/swadisht/categories/dosa.png',       href: '/services/swadisht/categories?category=south-indian' },
  { name: 'North Indian', image: '/images/swadisht/categories/curry.png',      href: '/services/swadisht/categories?category=north-indian' },
  { name: 'Burgers',      image: '/images/swadisht/categories/burger.png',     href: '/services/swadisht/categories?category=burgers' },
  { name: 'Pizza',        image: '/images/swadisht/categories/pizza.png',      href: '/services/swadisht/categories?category=pizza' },
  { name: 'Healthy',      image: '/images/swadisht/categories/Salad.png',      href: '/services/swadisht/categories?category=healthy' },
  { name: 'Thali',        image: '/images/swadisht/categories/thali.png',      href: '/services/swadisht/thali-engine' },
  { name: 'Street Food',  image: '/images/swadisht/categories/snacks.png',     href: '/services/swadisht/categories?category=street-food' },
  { name: 'Desserts',     image: '/images/swadisht/categories/dessert.png',    href: '/services/swadisht/categories?category=desserts' },
  { name: 'Beverages',    image: '/images/swadisht/categories/drinks.png',     href: '/services/swadisht/categories?category=beverages' },
  { name: 'Coastal',      image: '/images/swadisht/categories/seafood.png',    href: '/services/swadisht/categories?category=coastal' },
  { name: 'View All',     image: '/images/swadisht/categories/snacks.png',     href: '/services/swadisht/categories' },
];

export default function CategorySection() {
  return (
    <section className={styles.categorySection}>
      <div className={styles.sectionHeader}>
        <h2>Top Categories</h2>
        <p>Explore what you are craving today</p>
      </div>

      <div className={styles.categoryScroller}>
        {categories.map((category) => (
          <Link
            href={category.href}
            key={category.name}
            className={styles.categoryCard}
          >
            <div className={styles.imageWrap}>
              <img
                src={category.image}
                alt={category.name}
                draggable={false}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <span>{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}