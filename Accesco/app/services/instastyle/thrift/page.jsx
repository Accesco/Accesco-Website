'use client';

import { useState, useEffect } from 'react';
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
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
  },
  {
    id: 't6',
    name: 'Chunky Knit Sweater',
    brand: 'Acne Studios',
    price: 12000,
    originalPrice: 35000,
    condition: 'Fair',
    category: 'Topwear',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
  },
  {
    id: 't7',
    name: 'Oversized Vintage Trench Coat',
    brand: 'Burberry',
    price: 29000,
    originalPrice: 95000,
    condition: 'Excellent',
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&q=80',
  },
  {
    id: 't8',
    name: 'Vintage Wool Cardigan',
    brand: 'Acne Studios',
    price: 9500,
    originalPrice: 28000,
    condition: 'Like New',
    category: 'Topwear',
    image: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=800&q=80',
  }
];

const CATEGORIES = ['All', 'Outerwear', 'Accessories', 'Full Look', 'Topwear', 'Bottomwear'];

export default function ThriftMarketplace() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [customThriftProducts, setCustomThriftProducts] = useState([]);

  useEffect(() => {
    const loadThrifts = async () => {
      // 1. Hydrate from localStorage for instant user experience
      let localThrifts = [];
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('instastyle_custom_products');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              localThrifts = parsed.filter(p => p.isThrift || (p.tags && p.tags.includes('thrift')));
              setCustomThriftProducts(localThrifts);
            }
          }
        } catch (error) {
          console.error("Failed to load local thrifts:", error);
        }
      }

      // 2. Fetch from Firebase Firestore for persistent storage
      try {
        const { db } = await import('@/lib/firebase');
        const { collection, getDocs, query } = await import('firebase/firestore');
        const q = query(collection(db, 'instastyle_products'));
        const snapshot = await getDocs(q);
        const fbThrifts = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.isThrift || (data.tags && data.tags.includes('thrift'))) {
            fbThrifts.push(data);
          }
        });

        if (fbThrifts.length > 0) {
          setCustomThriftProducts(() => {
            const merged = [...localThrifts];
            fbThrifts.forEach(ft => {
              if (!merged.some(p => p.id === ft.id)) {
                merged.push(ft);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.error("Failed to load thrifts from Firestore:", err);
      }
    };
    loadThrifts();
  }, []);

  const combinedThrift = [
    ...THRIFT_PRODUCTS,
    ...customThriftProducts.map(p => {
      // Map catalog subcategories to thrift categories
      let mappedCategory = 'Topwear';
      const sub = (p.subcategory || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();

      if (sub.includes('jacket') || sub.includes('coat') || sub.includes('outer') || sub.includes('blazer')) {
        mappedCategory = 'Outerwear';
      } else if (cat.includes('accessories') || sub.includes('bag') || sub.includes('sunglasses') || sub.includes('belt') || sub.includes('watch')) {
        mappedCategory = 'Accessories';
      } else if (sub.includes('dress') || sub.includes('suit') || sub.includes('set')) {
        mappedCategory = 'Full Look';
      } else if (sub.includes('shirt') || sub.includes('t-shirt') || sub.includes('top') || sub.includes('sweater') || sub.includes('knit')) {
        mappedCategory = 'Topwear';
      } else if (sub.includes('jeans') || sub.includes('trouser') || sub.includes('skirt') || sub.includes('short') || sub.includes('pants')) {
        mappedCategory = 'Bottomwear';
      }

      return {
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        originalPrice: p.originalPrice || (p.price * 2), // Mock original price as 2x if missing
        condition: p.condition || 'Excellent',
        category: mappedCategory,
        image: p.images?.[0]?.url || p.image || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
      };
    })
  ];

  const filteredProducts = combinedThrift.filter((product) => 
    activeCategory === 'All' ? true : product.category === activeCategory
  );

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroOverlay} aria-hidden="true" />
      </header>

      <section id="sell" className={styles.sellSection}>
        <div className={styles.container}>
          <div className={styles.sellContent}>
            <h2 className={styles.sellTitle}>Give Your Closet a Second Life</h2>
            <p className={styles.sellDescription}>
              Send us your pre-loved premium clothes and accessories. Our experts will authenticate, 
              list, and find them a new home. You get paid, and the planet wins.
            </p>
            <div className={styles.sellSteps}>
              <div className={styles.step}>
                <span className={styles.stepNumber}>01</span>
                <h3>Clean & Prep</h3>
                <p>Pick out the pieces you no longer wear.</p>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>02</span>
                <h3>Ship to Us</h3>
                <p>We'll handle the logistics and authentication.</p>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>03</span>
                <h3>Get Paid</h3>
                <p>Receive payment once your item is verified.</p>
              </div>
            </div>
            <Link 
              href="/services/instastyle/add-sku" 
              className={styles.sellBtn}
              style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}
            >
              Start Selling Now
            </Link>
          </div>
        </div>
      </section>

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
