'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { products } from '@/lib/mockData';
import styles from './swipestyle.module.css';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

const SWIPE_THRESHOLD = 120;

function getSlotForProduct(product) {
  const text = `${product?.name || ''} ${product?.subcategory || ''} ${product?.category || ''}`.toLowerCase();
  if (/(dress|gown|jumpsuit|kurta|co-ord|onesie)/.test(text)) return 'fullLook';
  if (/(jacket|blazer|hoodie|coat|shrug|outer)/.test(text)) return 'outerwear';
  if (/(jean|pant|trouser|short|skirt|lower|jogger|track)/.test(text)) return 'bottomwear';
  if (/(shoe|sneaker|heel|sandal|loafer|boot)/.test(text)) return 'footwear';
  if (/(watch|bag|cap|hat|belt|wallet|glass|jewelry|necklace|earring)/.test(text)) return 'accessory';
  return 'topwear';
}

const SLOT_LABELS = {
  topwear: 'Topwear',
  bottomwear: 'Bottomwear',
  fullLook: 'Full Look',
  outerwear: 'Outerwear',
  footwear: 'Footwear',
  accessory: 'Accessory',
};

function SwipeCard({ product, onSwipe, direction }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [0, -100], [0, 1]);

  useEffect(() => {
    if (direction === 'left') x.set(-300);
    if (direction === 'right') x.set(300);
  }, [direction, x]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe('right');
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe('left');
    }
  };

  return (
    <motion.article
      key={product.id}
      className={styles.card}
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ 
        x: x.get() === 0 ? (direction === 'right' ? 500 : -500) : (x.get() > 0 ? 500 : -500),
        opacity: 0,
        rotate: x.get() > 0 ? 20 : -20,
        transition: { duration: 0.3 }
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <motion.span className={styles.badgeLike} style={{ opacity: likeOpacity }}>ADD</motion.span>
      <motion.span className={styles.badgeNope} style={{ opacity: nopeOpacity }}>SKIP</motion.span>

      <img src={product.images[0].url} alt={product.name} className={styles.cardImage} />

      <div className={styles.cardBody}>
        <p className={styles.brand}>{product.brand}</p>
        <h2 className={styles.name}>{product.name}</h2>
        <p className={styles.price}>₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </motion.article>
  );
}

export default function SwipeStylePage() {
  const swipePool = useMemo(
    () => products.filter((product) => product.images?.[0]?.url).slice(0, 40),
    []
  );

  const [index, setIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null);
  const [outfit, setOutfit] = useState({
    topwear: null,
    bottomwear: null,
    fullLook: null,
    outerwear: null,
    footwear: null,
    accessory: null,
  });
  const [likedCount, setLikedCount] = useState(0);

  const current = swipePool[index % swipePool.length];

  const handleSwipe = (direction) => {
    if (!current) return;
    setSwipeDir(direction);
    
    if (direction === 'right') {
      const slot = getSlotForProduct(current);
      setOutfit((prev) => ({ ...prev, [slot]: current }));
      setLikedCount((prev) => prev + 1);
    }

    // Delay advance slightly to let animation start
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % swipePool.length);
      setSwipeDir(null);
    }, 50);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/services/instastyle" className={styles.backLink}>Back</Link>
        <div>
          <h1 className={styles.title}>SwipeStyle Discovery</h1>
          <p className={styles.subtitle}>Swipe right to add pieces, left to skip, and build your outfit.</p>
        </div>
      </header>

      <main className={styles.layout}>
        <section className={styles.deckSection}>
          <div className={styles.deckHint}>Left swipe = Skip | Right swipe = Add to outfit</div>

          <div className={styles.cardContainer}>
            <AnimatePresence mode="popLayout">
              {current && (
                <SwipeCard 
                  key={current.id} 
                  product={current} 
                  onSwipe={handleSwipe} 
                  direction={swipeDir}
                />
              )}
            </AnimatePresence>
          </div>

          <div className={styles.actions}>
            <button className={styles.skipBtn} onClick={() => handleSwipe('left')} aria-label="Skip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.btnIcon}>
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className={styles.addBtn} onClick={() => handleSwipe('right')} aria-label="Add to outfit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.btnIcon}>
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </section>

        <aside className={styles.outfitSection}>
          <div className={styles.outfitHeader}>
            <h3>Your Outfit</h3>
            <span>{likedCount} picks</span>
          </div>

          <div className={styles.slotGrid}>
            {Object.entries(SLOT_LABELS).map(([slotKey, label]) => {
              const item = outfit[slotKey];
              return (
                <div key={slotKey} className={styles.slotCard}>
                  <p className={styles.slotLabel}>{label}</p>
                  {item ? (
                    <div className={styles.slotItem}>
                      <img src={item.images?.[0]?.url} alt={item.name} className={styles.slotThumb} />
                      <div>
                        <p className={styles.slotName}>{item.name}</p>
                        <p className={styles.slotMeta}>{item.brand}</p>
                      </div>
                    </div>
                  ) : (
                    <p className={styles.emptySlot}>No selection yet</p>
                  )}
                </div>
              );
            })}
          </div>

          <Link href="/services/instastyle/catalog" className={styles.ctaLink}>
            Continue to Catalog
          </Link>
        </aside>
      </main>
    </div>
  );
}
