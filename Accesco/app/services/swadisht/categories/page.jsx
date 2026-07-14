'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SwadishttHeader from '../components/SwadishttHeader';
import { RESTAURANTS } from '../lib/swadishttData';
import { useSwadishtt } from '../contexts/SwadishttContext';
import styles from './categories.module.css';

/* ─── Category definitions with dish mappings ─── */
const CATEGORIES = [
  {
    slug: 'biryani',
    name: 'Biryani',
    desc: 'Slow-cooked dum biryanis layered with fragrant basmati, saffron, and hand-ground spices from across India.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&fit=crop',
    color: '#B45309',
    keywords: ['biryani', 'rice'],
  },
  {
    slug: 'south-indian',
    name: 'South Indian',
    desc: 'Crispy ghee dosas, fluffy steamed idlis, traditional filter coffee and coconut chutneys.',
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&fit=crop',
    color: '#15803D',
    keywords: ['south indian', 'dosa', 'idli', 'breakfast'],
  },
  {
    slug: 'north-indian',
    name: 'North Indian',
    desc: 'Creamy paneer gravies, slow-cooked dal makhani, and hot breads fresh from the tandoor.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&fit=crop',
    color: '#7C3AED',
    keywords: ['north indian', 'mughlai', 'tandoor', 'main course'],
  },
  {
    slug: 'chinese',
    name: 'Indo-Chinese',
    desc: 'Wok-fired noodles, saucy Manchurian, and bold Indo-Chinese stir-fries with street-market heat.',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&fit=crop',
    color: '#DC2626',
    keywords: ['chinese', 'noodles', 'manchurian'],
  },
  {
    slug: 'starters',
    name: 'Starters & Kebabs',
    desc: 'Juicy seekh kebabs, crispy chicken 65, paneer tikka, and a variety of flame-kissed starters.',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&fit=crop',
    color: '#B45309',
    keywords: ['starters', 'kebab', 'tikka'],
  },
  {
    slug: 'pizza',
    name: 'Pizza',
    desc: 'Hand-stretched Neapolitan-style bases, fresh mozzarella, and artisan toppings baked to perfection.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&fit=crop',
    color: '#DC2626',
    keywords: ['pizza'],
  },
  {
    slug: 'burgers',
    name: 'Burgers',
    desc: 'Juicy layered chicken and paneer patties, melted cheese, house sauces, and seasoned fries.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&fit=crop',
    color: '#D97706',
    keywords: ['burger', 'wrap', 'roll'],
  },
  {
    slug: 'coastal',
    name: 'Coastal & Seafood',
    desc: 'Fragrant fish curries, prawn ghee roasts, coconut stews, and mangalorean delicacies.',
    image: 'https://images.unsplash.com/photo-1781684081404-5c090011b53e?w=800&fit=crop',
    color: '#0369A1',
    keywords: ['coastal', 'seafood', 'fish'],
  },
  {
    slug: 'street-food',
    name: 'Street Food & Chaat',
    desc: 'Tangy spiced chaats, hot pav bhaji, sev puri, and the authentic flavours of India\'s street corners.',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&fit=crop',
    color: '#7C3AED',
    keywords: ['street food', 'chaat', 'snacks'],
  },
  {
    slug: 'desserts',
    name: 'Desserts & Sweets',
    desc: 'Plush truffle cakes, warm gulab jamuns, rich rasmalai, and classic Indian mithai.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&fit=crop',
    color: '#BE185D',
    keywords: ['desserts', 'sweets', 'mithai', 'cake'],
  },
  {
    slug: 'beverages',
    name: 'Beverages & Shakes',
    desc: 'Premium cold brews, thick milkshakes, fresh lime sodas, and traditional masala chai.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&fit=crop',
    color: '#0369A1',
    keywords: ['beverages', 'drinks', 'juice', 'shake'],
  },
  {
    slug: 'healthy',
    name: 'Healthy & Bowls',
    desc: 'Nourishing grain bowls, fresh salads, protein-rich wraps, and calorie-smart power plates.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&fit=crop',
    color: '#15803D',
    keywords: ['salad', 'healthy', 'bowl'],
  },
  {
    slug: 'breakfast',
    name: 'Breakfast & Brunch',
    desc: 'Morning poha, upma, parathas, omelettes, and everything to kick-start your day right.',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&fit=crop',
    color: '#D97706',
    keywords: ['breakfast', 'brunch', 'morning'],
  },
  {
    slug: 'thalis',
    name: 'Thalis & Meals',
    desc: 'Complete balanced thalis with dal, sabzi, chapati, rice, salad, and a satisfying sweet.',
    image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&fit=crop',
    color: '#9333EA',
    keywords: ['thali', 'meal', 'combo'],
  },
  {
    slug: 'sides',
    name: 'Sides & Accompaniments',
    desc: 'Raita, papads, pickles, chutneys, and all the supporting flavours that complete your plate.',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&fit=crop',
    color: '#0369A1',
    keywords: ['sides', 'raita', 'chutney', 'breads'],
  },
];

/* ─── Flatten all dishes from all restaurants ─── */
function buildAllDishes() {
  const all = [];
  for (const restaurant of RESTAURANTS) {
    if (!Array.isArray(restaurant.menu)) continue;
    for (const dish of restaurant.menu) {
      all.push({
        ...dish,
        restaurantSlug: restaurant.slug,
        restaurantName: restaurant.name,
        restaurantRating: restaurant.rating,
        deliveryTime: restaurant.deliveryTime,
      });
    }
  }
  return all;
}

function matchesCategory(dish, category) {
  const haystack = [
    dish.category,
    dish.name,
    dish.description,
    ...(dish.tags || []),
  ].join(' ').toLowerCase();
  return category.keywords.some((kw) => haystack.includes(kw));
}

export default function CategoriesPage() {
  const router = useRouter();
  const { addToCart } = useSwadishtt();
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'all'
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCatSlug, setActiveCatSlug] = useState('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('category');
      if (catParam) {
        setActiveCatSlug(catParam);
        setActiveTab('all');
      }
    }
  }, []);

  const ALL_DISHES = useMemo(() => buildAllDishes(), []);

  const DISH_FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'veg', label: 'Pure Veg' },
    { key: 'nonveg', label: 'Non-Veg' },
    { key: 'under200', label: 'Under ₹200' },
    { key: 'under400', label: 'Under ₹400' },
    { key: 'bestseller', label: 'Bestsellers' },
  ];

  const categoryOptions = [{ slug: 'all', name: 'All Categories' }, ...CATEGORIES];

  const filteredDishes = useMemo(() => {
    let dishes = ALL_DISHES;

    if (activeCatSlug !== 'all') {
      const cat = CATEGORIES.find((c) => c.slug === activeCatSlug);
      if (cat) dishes = dishes.filter((d) => matchesCategory(d, cat));
    }

    if (activeFilter === 'veg') dishes = dishes.filter((d) => d.isVeg);
    if (activeFilter === 'nonveg') dishes = dishes.filter((d) => !d.isVeg);
    if (activeFilter === 'under200') dishes = dishes.filter((d) => d.price < 200);
    if (activeFilter === 'under400') dishes = dishes.filter((d) => d.price < 400);
    if (activeFilter === 'bestseller') dishes = dishes.filter((d) => d.isBestseller);

    return dishes;
  }, [ALL_DISHES, activeFilter, activeCatSlug]);

  const getCategoryCount = (cat) =>
    ALL_DISHES.filter((d) => matchesCategory(d, cat)).length;

  const handleAddToCart = (dish) => {
    addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      restaurant: dish.restaurantName,
      sku: dish.sku || '',
    });
  };

  return (
    <div className={styles.page}>
      <SwadishttHeader />
      <main className={styles.main}>

        {/* Hero */}
        <div className={styles.heroSection}>
          <p className={styles.kicker}>What are you craving?</p>
          <h1 className={styles.title}>Explore the Menu</h1>
          <p className={styles.subtitle}>
            Browse by cuisine or explore every dish we serve — from all our partner kitchens.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className={styles.tabSwitcher}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'categories' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Browse by Category
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('all')}
          >
            View All Dishes
            <span className={styles.countBubble}>{ALL_DISHES.length}</span>
          </button>
        </div>

        {/* ── CATEGORIES GRID ── */}
        {activeTab === 'categories' && (
          <div className={styles.grid}>
            {CATEGORIES.map((c) => {
              const count = getCategoryCount(c);
              return (
                <div
                  key={c.slug}
                  className={styles.card}
                  onClick={() => { setActiveCatSlug(c.slug); setActiveTab('all'); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && (setActiveCatSlug(c.slug), setActiveTab('all'))}
                >
                  <div className={styles.imageWrap}>
                    <img src={c.image} alt={c.name} className={styles.image} />
                    <div className={styles.overlay} />
                    {count > 0 && (
                      <span className={styles.countBadge}>{count} dishes</span>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.categoryName}>{c.name}</h3>
                    <p className={styles.categoryDesc}>{c.desc}</p>
                    <div className={styles.cardArrow}>
                      <span>Explore</span>
                      <svg className={styles.arrowIcon} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── VIEW ALL DISHES ── */}
        {activeTab === 'all' && (
          <div className={styles.viewAllSection}>
            {/* Category + Dietary filters */}
            <div className={styles.filterBar}>
              <div className={styles.filterGroup}>
                <span className={styles.filterGroupLabel}>Category</span>
                <div className={styles.filterPills}>
                  {categoryOptions.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      className={`${styles.pill} ${activeCatSlug === c.slug ? styles.pillActive : ''}`}
                      onClick={() => setActiveCatSlug(c.slug)}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.filterGroup}>
                <span className={styles.filterGroupLabel}>Filter</span>
                <div className={styles.filterPills}>
                  {DISH_FILTERS.map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      className={`${styles.pill} ${activeFilter === f.key ? styles.pillActive : ''}`}
                      onClick={() => setActiveFilter(f.key)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results count */}
            <p className={styles.resultsLabel}>
              {filteredDishes.length} {filteredDishes.length === 1 ? 'dish' : 'dishes'} found
            </p>

            {filteredDishes.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No dishes match your filters.</p>
                <button type="button" className={styles.resetBtn} onClick={() => { setActiveFilter('all'); setActiveCatSlug('all'); }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={styles.dishGrid}>
                {filteredDishes.map((dish) => (
                  <article key={`${dish.restaurantSlug}-${dish.id}`} className={styles.dishCard}>
                    {dish.isBestseller && (
                      <span className={styles.bestsellerTag}>Bestseller</span>
                    )}

                    <div className={styles.dishImageBox}>
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className={styles.dishImage}
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/300x200/F5EAE0/6B1D3A/png?text=${encodeURIComponent(dish.name)}`;
                        }}
                      />
                      <span className={styles.vegIndicator}>
                        <span className={dish.isVeg ? styles.vegDot : styles.nonVegDot} />
                      </span>
                    </div>

                    <div className={styles.dishBody}>
                      <h3 className={styles.dishName}>{dish.name}</h3>
                      <p className={styles.dishDesc}>{dish.description}</p>

                      <Link
                        href={`/services/swadisht/restaurant/${dish.restaurantSlug}`}
                        className={styles.restaurantLink}
                      >
                        {dish.restaurantName}
                        {dish.deliveryTime && (
                          <span className={styles.deliveryBadge}>{dish.deliveryTime}</span>
                        )}
                      </Link>

                      {dish.sku && (
                        <span className={styles.dishSku}>{dish.sku}</span>
                      )}

                      <div className={styles.dishFooter}>
                        <span className={styles.dishPrice}>₹{dish.price}</span>
                        <div className={styles.dishActions}>
                          <Link
                            href={`/services/swadisht/restaurant/${dish.restaurantSlug}`}
                            className={styles.viewRestaurantBtn}
                          >
                            View Restaurant
                          </Link>
                          <button
                            type="button"
                            className={styles.addDishBtn}
                            onClick={() => handleAddToCart(dish)}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
