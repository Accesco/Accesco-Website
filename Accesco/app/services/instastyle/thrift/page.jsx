'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './thrift.module.css';

const THRIFT_PRODUCTS = [
  {
    id: 't1',
    name: 'Vintage Leather Moto Jacket',
    brand: 'Saint Laurent',
    price: 45000,
    originalPrice: 120000,
    condition: 'Excellent',
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
  },
  {
    id: 't2',
    name: 'Classic Monogram Crossbody',
    brand: 'Gucci',
    price: 32000,
    originalPrice: 85000,
    condition: 'Good',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
  },
  {
    id: 't3',
    name: 'Distressed Denim Jacket',
    brand: 'Levi\'s Vintage',
    price: 4500,
    originalPrice: 9000,
    condition: 'Like New',
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80',
  },
  {
    id: 't4',
    name: 'Oversized Wool Blazer',
    brand: 'Balenciaga',
    price: 28000,
    originalPrice: 95000,
    condition: 'Excellent',
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
  },
  {
    id: 't5',
    name: 'Silk Slip Dress',
    brand: 'Reformation',
    price: 8500,
    originalPrice: 22000,
    condition: 'Good',
    category: 'Full Look',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80',
  },
  {
    id: 't6',
    name: 'Chunky Knit Sweater',
    brand: 'Acne Studios',
    price: 12000,
    originalPrice: 35000,
    condition: 'Fair',
    category: 'Topwear',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
  }
];

const CATEGORIES = ['All', 'Outerwear', 'Accessories', 'Full Look', 'Topwear', 'Bottomwear'];

export default function ThriftMarketplace() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = THRIFT_PRODUCTS.filter((product) => 
    activeCategory === 'All' ? true : product.category === activeCategory
  );

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            The Thrift Edit
          </motion.h1>
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Pre-owned luxury & vintage pieces, authenticated and ready for a second life. Sustainable style starts here.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="#collection" className={styles.heroBtn}>
              Shop the Collection
            </Link>
          </motion.div>
        </div>
      </header>

      <main id="collection" className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Curated Finds</h2>
          <div className={styles.filters}>
            {CATEGORIES.map(category => (
              <button
                key={category}
                className={`${styles.filterBtn} ${activeCategory === category ? styles.active : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/services/instastyle/products/${product.id}`} className={styles.productCard}>
                <div className={styles.imageWrapper}>
                  <span className={styles.badge}>Authenticated</span>
                  <span className={styles.condition}>{product.condition}</span>
                  <img src={product.image} alt={product.name} className={styles.image} />
                </div>
                <div className={styles.info}>
                  <p className={styles.brand}>{product.brand}</p>
                  <h3 className={styles.name}>{product.name}</h3>
                  <div className={styles.priceRow}>
                    <p className={styles.price}>₹{product.price.toLocaleString('en-IN')}</p>
                    <p className={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
