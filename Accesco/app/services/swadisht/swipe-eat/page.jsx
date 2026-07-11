'use client';

/**
 * SwipeEat Discovery Page
 * @page /services/swadisht/swipe-eat
 * @description Tinder-style food discovery - swipe to like or skip dishes
 */

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSwadishtt } from '../contexts/SwadishttContext';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './swipe-eat.module.css';

const DISH_CARDS = [
  {
    id: 'se-1',
    name: 'Butter Chicken',
    restaurant: 'Punjabi Tadka',
    rating: 4.8,
    price: 350,
    calories: 480,
    cuisine: 'North Indian',
    mood: ['Comfort', 'Rich'],
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=400&fit=crop',
    isVeg: false,
    tags: ['Bestseller', 'Spicy'],
    deliveryTime: '30 mins',
  },
  {
    id: 'se-2',
    name: 'Masala Dosa',
    restaurant: 'South Spice',
    rating: 4.6,
    price: 120,
    calories: 280,
    cuisine: 'South Indian',
    mood: ['Light', 'Crispy'],
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=400&fit=crop',
    isVeg: true,
    tags: ['Healthy', 'Classic'],
    deliveryTime: '20 mins',
  },
  {
    id: 'se-3',
    name: 'Hyderabadi Biryani',
    restaurant: 'Dum Pukht',
    rating: 4.9,
    price: 420,
    calories: 620,
    cuisine: 'Mughlai',
    mood: ['Festive', 'Rich'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop',
    isVeg: false,
    tags: ['Bestseller', 'Aromatic'],
    deliveryTime: '45 mins',
  },
  {
    id: 'se-4',
    name: 'Paneer Tikka',
    restaurant: 'Tandoor House',
    rating: 4.5,
    price: 280,
    calories: 320,
    cuisine: 'North Indian',
    mood: ['Snack', 'Smoky'],
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop',
    isVeg: true,
    tags: ['Starter', 'Grilled'],
    deliveryTime: '25 mins',
  },
  {
    id: 'se-5',
    name: 'Chole Bhature',
    restaurant: 'Amritsari Dhaba',
    rating: 4.7,
    price: 180,
    calories: 540,
    cuisine: 'Punjabi',
    mood: ['Hearty', 'Comfort'],
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=400&fit=crop',
    isVeg: true,
    tags: ['Classic', 'Filling'],
    deliveryTime: '30 mins',
  },
];

function SwipeCard({ dish, onSwipe, isTop }) {
  const x = useMotionValue(0);
  const controls = useAnimation();

  const targetScale = isTop ? 1 : 0.95;
  const targetY = isTop ? 0 : 20;

  useEffect(() => {
    controls.start({ 
      scale: targetScale, 
      y: targetY,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    });
  }, [isTop, targetScale, targetY, controls]);

  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const skipOpacity = useTransform(x, [0, -100], [0, 1]);

  const handleDragEnd = async (e, info) => {
    if (info.offset.x > 100) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe('like');
    } else if (info.offset.x < -100) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe('skip');
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  return (
    <motion.div
      className={`${styles.swipeCard} ${isTop ? styles.topCard : styles.backCard}`}
      style={{
        x,
        rotate: isTop ? rotate : 0,
        zIndex: isTop ? 10 : 5,
        cursor: 'grab',
      }}
      initial={{ scale: targetScale, y: targetY }}
      animate={controls}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
    >
      {/* Like / Skip overlays */}
      {isTop && (
        <>
          <motion.div className={styles.likeOverlay} style={{ opacity: likeOpacity }}>
            <span>❤️ LIKE</span>
          </motion.div>
          <motion.div className={styles.skipOverlay} style={{ opacity: skipOpacity }}>
            <span>✕ SKIP</span>
          </motion.div>
        </>
      )}

      <div className={styles.cardImageWrap}>
        <img
          src={dish.image}
          alt={dish.name}
          draggable={false}
          onError={(e) => {
            e.target.src = `https://placehold.co/400x320/E23744/FFFFFF/png?text=${encodeURIComponent(dish.name)}`;
          }}
        />
        <div className={styles.cardImageOverlay} />
        <div className={styles.cardBadges}>
          {dish.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
        <div className={styles.vegIndicator}>
          <span className={dish.isVeg ? styles.vegDot : styles.nonVegDot} />
        </div>
      </div>

      <div className={styles.cardInfo}>
        <div className={styles.cardTop}>
          <div>
            <h2 className={styles.dishName}>{dish.name}</h2>
            <p className={styles.restaurantName}>{dish.restaurant}</p>
          </div>
          <div className={styles.ratingPill}>★ {dish.rating}</div>
        </div>

        <div className={styles.cardMeta}>
          <span>₹{dish.price}</span>
          <span className={styles.dot}>•</span>
          <span>{dish.calories} cal</span>
          <span className={styles.dot}>•</span>
          <span>{dish.deliveryTime}</span>
        </div>

        <div className={styles.moodTags}>
          {dish.mood.map((m) => (
            <span key={m} className={styles.moodTag}>{m}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SwipeEatContent() {
  const router = useRouter();
  const { addToCart } = useSwadishtt();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [lastAction, setLastAction] = useState(null);

  const currentDish = DISH_CARDS[currentIndex];
  const nextDish = DISH_CARDS[currentIndex + 1];
  const isDone = currentIndex >= DISH_CARDS.length;

  const handleSwipe = (action) => {
    if (action === 'like') {
      setLiked((prev) => [...prev, currentDish]);
      addToCart({ ...currentDish, price: currentDish.price });
    } else {
      setSkipped((prev) => [...prev, currentDish]);
    }
    setLastAction(action);
    setCurrentIndex((i) => i + 1);
  };

  const handleUndo = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
    if (lastAction === 'like') setLiked((prev) => prev.slice(0, -1));
    else setSkipped((prev) => prev.slice(0, -1));
    setLastAction(null);
  };

  useEffect(() => {
    if (isDone) {
      // Ensure data is saved first
      localStorage.setItem('swadisht_user_preferences', JSON.stringify(liked));
      
      // Execute redirect
      router.push('/services/swadisht/foryou');
    }
  }, [isDone, liked, router]);

  return (
    <div className={styles.pageContent}>
      <SwadishttHeader />

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>SwipeEat Discovery</h1>
        <p className={styles.heroSub}>Swipe right to like • Swipe left to skip</p>
        <div className={styles.statsRow}>
          <span className={styles.stat}>{liked.length} liked</span>
          <span className={styles.stat}>{skipped.length} skipped</span>
          <span className={styles.stat}>{DISH_CARDS.length - currentIndex} remaining</span>
        </div>
      </div>

      <div className={styles.swipeArea}>
        {isDone ? (
          <div className={styles.doneState}>
            <div className={styles.doneIcon}>✓</div>
            <h2 className={styles.doneTitle}>You've seen everything!</h2>
            <p className={styles.doneSub}>You liked {liked.length} dishes — they're in your cart.</p>
            <div className={styles.doneActions}>
              <Link href="/services/swadisht" className={styles.btnSecondary}>Browse Restaurants</Link>
              <button className={styles.btnPrimary} onClick={() => { setCurrentIndex(0); setLiked([]); setSkipped([]); }}>
                Start Over
              </button>
            </div>
          </div>
        ) : (
          <>
            {nextDish && <SwipeCard dish={nextDish} onSwipe={() => {}} isTop={false} />}
            <SwipeCard dish={currentDish} onSwipe={handleSwipe} isTop={true} />
          </>
        )}
      </div>

      {!isDone && (
        <div className={styles.actionButtons}>
          <button className={styles.skipBtn} onClick={() => handleSwipe('skip')} title="Skip">
            ✕
          </button>
          <button className={styles.undoBtn} onClick={handleUndo} disabled={currentIndex === 0} title="Undo">
            ↶
          </button>
          <button className={styles.likeBtn} onClick={() => handleSwipe('like')} title="Like & Add to Cart">
            ♥
          </button>
        </div>
      )}

      {liked.length > 0 && (
        <div className={styles.likedSection}>
          <h3 className={styles.likedTitle}>Your Liked Dishes ({liked.length})</h3>
          <div className={styles.likedGrid}>
            {liked.map((dish) => (
              <div key={dish.id} className={styles.likedCard}>
                <img
                  src={dish.image}
                  alt={dish.name}
                  onError={(e) => {
                    e.target.src = `https://placehold.co/120x80/E23744/FFFFFF/png?text=${encodeURIComponent(dish.name)}`;
                  }}
                />
                <div className={styles.likedInfo}>
                  <span className={styles.likedName}>{dish.name}</span>
                  <span className={styles.likedPrice}>₹{dish.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SwipeEatPage() {
  return <SwipeEatContent />;
}
