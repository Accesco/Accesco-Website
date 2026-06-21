'use client';

import { useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { products } from '@/lib/mockData';
import styles from './swipestyle.module.css';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';

const SWIPE_THRESHOLD = 100;

function SwipeCard({ product, onSwipe, isTop, isInCart }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const addOpacity = useTransform(x, [20, 120], [0, 1]);
  const removeOpacity = useTransform(x, [-20, -120], [0, 1]);
  const cardOpacity = useTransform(x, [-300, 0, 300], [0.4, 1, 0.4]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe('right', product);
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe('left', product);
    }
  };

  if (!isTop) {
    return (
      <div className={styles.cardBehind}>
        <img src={product.images[0].url} alt={product.name} className={styles.cardImage} />
      </div>
    );
  }

  return (
    <motion.article
      className={styles.card}
      style={{ x, rotate, opacity: cardOpacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.92, opacity: 0, y: 24 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      whileTap={{ cursor: 'grabbing' }}
    >
      <motion.div className={styles.badgeAdd} style={{ opacity: addOpacity }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        ADD
      </motion.div>
      <motion.div className={styles.badgeRemove} style={{ opacity: removeOpacity }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {isInCart ? (
            <>
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </>
          ) : (
            <>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </>
          )}
        </svg>
        {isInCart ? 'REMOVE' : 'SKIP'}
      </motion.div>

      <img src={product.images[0].url} alt={product.name} className={styles.cardImage} />

      <div className={styles.cardBody}>
        <p className={styles.brand}>{product.brand}</p>
        <h2 className={styles.name}>{product.name}</h2>
        <div className={styles.priceMeta}>
          <span className={styles.price}>
            {product.discountedPrice
              ? `₹${product.discountedPrice.toLocaleString('en-IN')}`
              : `₹${product.price.toLocaleString('en-IN')}`}
          </span>
          {product.discountedPrice && (
            <span className={styles.priceOriginal}>₹{product.price.toLocaleString('en-IN')}</span>
          )}
          {product.discountPercentage > 0 && (
            <span className={styles.discount}>{product.discountPercentage}% OFF</span>
          )}
        </div>
        {product.subcategory && (
          <span className={styles.subcategoryTag}>{product.subcategory}</span>
        )}
      </div>
    </motion.article>
  );
}

export default function SwipeStylePage() {
  const { addToCart: globalAddToCart, removeFromCart: globalRemoveFromCart } = useCart();
  const router = useRouter();

  const swipePool = useMemo(
    () => products.filter((p) => p.images?.[0]?.url).slice(0, 40),
    []
  );

  const [index, setIndex] = useState(0);
  const [cart, setCart] = useState([]);
  const [lastAction, setLastAction] = useState(null); // 'added' | 'removed' | 'error' | null
  const [showCartMobile, setShowCartMobile] = useState(false);

  const current = swipePool[index % swipePool.length];
  const next = swipePool[(index + 1) % swipePool.length];

  const handleSwipe = (direction, product) => {
    if (direction === 'right') {
      try {
        const defaultSize = product.sizes?.[0] || 'M';
        const defaultColor = typeof product.colors?.[0] === 'string'
          ? product.colors[0]
          : (product.colors?.[0]?.name || 'Default');

        // Add to local SwipeStyle cart
        setCart((prev) => {
          const exists = prev.find((p) => p.id === product.id);
          if (exists) return prev;
          return [
            {
              ...product,
              selectedSize: defaultSize,
              selectedColor: defaultColor,
            },
            ...prev,
          ];
        });

        // Add immediately to the global shopping cart
        const success = globalAddToCart(product, defaultSize, defaultColor, 1);
        if (success) {
          setLastAction('added');
        } else {
          setLastAction('error');
        }
      } catch (err) {
        console.error('Failed to add to cart:', err);
        setLastAction('error');
      }
    } else {
      // Left swipe — if the product is in the cart, remove it
      setCart((prev) => {
        const exists = prev.find((p) => p.id === product.id);
        if (exists) {
          globalRemoveFromCart(product.id, exists.selectedSize, exists.selectedColor);
          setLastAction('removed');
          return prev.filter((p) => p.id !== product.id);
        }
        return prev;
      });
    }

    setTimeout(() => {
      setIndex((prev) => (prev + 1) % swipePool.length);
      setTimeout(() => setLastAction(null), 1400);
    }, 80);
  };

  const removeFromCart = (id) => {
    const itemToRemove = cart.find(p => p.id === id);
    if (itemToRemove) {
      globalRemoveFromCart(id, itemToRemove.selectedSize, itemToRemove.selectedColor);
    }
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const updateCartItem = (id, field, value) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const oldSize = item.selectedSize;
          const oldColor = item.selectedColor;
          const newItem = { ...item, [field]: value };
          
          globalRemoveFromCart(id, oldSize, oldColor);
          globalAddToCart(item, newItem.selectedSize, newItem.selectedColor, 1);
          
          return newItem;
        }
        return item;
      })
    );
  };

  const handleProceedToCheckout = () => {
    setCart([]);
    router.push('/services/instastyle/checkout');
  };

  const cartTotal = cart.reduce((sum, p) => sum + (p.discountedPrice || p.price), 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/services/instastyle" className={styles.backLink}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </Link>
        <button
          className={styles.mobileCartToggle}
          onClick={() => setShowCartMobile(true)}
          aria-label="Open cart"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {cart.length > 0 && <span className={styles.cartBadge}>{cart.length}</span>}
        </button>
      </header>

      {/* Toast notification */}
      <AnimatePresence>
        {lastAction && (
          <motion.div
            key={lastAction}
            className={`${styles.toast} ${
              lastAction === 'added' 
                ? styles.toastAdd 
                : lastAction === 'removed' 
                ? styles.toastRemove 
                : styles.toastError
            }`}
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            {lastAction === 'added' ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Added to cart
              </>
            ) : lastAction === 'removed' ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                </svg>
                Removed from cart
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Failed to add to cart
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className={styles.layout}>
        {/* Swipe Deck */}
        <section className={styles.deckSection}>
          <div className={styles.deckHint}>
            <span className={styles.hintLeft}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Left — Skip
            </span>
            <span className={styles.hintRight}>
              Right — Add
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </span>
          </div>

          <div className={styles.cardContainer}>
            {/* Background card (next) */}
            {next && (
              <div className={styles.cardBehindWrapper}>
                <SwipeCard 
                  key={`behind-${next.id}`} 
                  product={next} 
                  onSwipe={() => {}} 
                  isTop={false} 
                  isInCart={!!cart.find((p) => p.id === next.id)}
                />
              </div>
            )}
            {/* Top card (current) */}
            <AnimatePresence mode="popLayout">
              {current && (
                <SwipeCard
                  key={current.id}
                  product={current}
                  onSwipe={handleSwipe}
                  isTop={true}
                  isInCart={!!cart.find((p) => p.id === current.id)}
                />
              )}
            </AnimatePresence>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.skipBtn}
              onClick={() => handleSwipe('left', current)}
              aria-label={current && cart.find((p) => p.id === current.id) ? "Remove item from cart" : "Skip item"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.btnIcon} strokeLinecap="round" strokeLinejoin="round">
                {current && cart.find((p) => p.id === current.id) ? (
                  <>
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                  </>
                ) : (
                  <path d="M18 6L6 18M6 6l12 12" />
                )}
              </svg>
            </button>
            <div className={styles.actionCenter}>
              <p className={styles.cardCount}>{index + 1} / {swipePool.length}</p>
            </div>
            <button
              className={styles.addBtn}
              onClick={() => handleSwipe('right', current)}
              aria-label="Add to cart"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.btnIcon} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </button>
          </div>
        </section>

        {/* Cart Sidebar */}
        <aside className={`${styles.cartSection} ${showCartMobile ? styles.cartOpen : ''}`}>
          {/* Mobile close */}
          <button className={styles.cartClose} onClick={() => setShowCartMobile(false)} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div className={styles.cartHeader}>
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Cart
            </h3>
            <span className={styles.cartCount}>{cart.length} items</span>
          </div>

          <div className={styles.cartItems}>
            {cart.length === 0 ? (
              <div className={styles.emptyCart}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <p>Swipe right to add items</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>Swipe left to skip items</p>
              </div>
            ) : (
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    className={styles.cartItem}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0, padding: 0 }}
                    transition={{ duration: 0.25 }}
                    layout="position"
                  >
                    <div className={styles.cartItemMain}>
                      <img src={item.images[0].url} alt={item.name} className={styles.cartThumb} />
                      <div className={styles.cartItemInfo}>
                        <p className={styles.cartItemName}>{item.name}</p>
                        <p className={styles.cartItemBrand}>{item.brand}</p>
                        <p className={styles.cartItemPrice}>
                          ₹{(item.discountedPrice || item.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <button
                        className={styles.cartRemoveBtn}
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                    
                    {/* Size and Color Selectors */}
                    <div className={styles.cartItemSelectors}>
                      <div className={styles.selectorField}>
                        <label>Size</label>
                        <select
                          value={item.selectedSize || 'Free Size'}
                          onChange={(e) => updateCartItem(item.id, 'selectedSize', e.target.value)}
                        >
                          {(item.sizes && item.sizes.length > 0 ? item.sizes : ['Free Size']).map((sz) => (
                            <option key={sz} value={sz}>{sz}</option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.selectorField}>
                        <label>Color</label>
                        <select
                          value={item.selectedColor || 'Default'}
                          onChange={(e) => updateCartItem(item.id, 'selectedColor', e.target.value)}
                        >
                          {(item.colors && item.colors.length > 0 ? item.colors : ['Default']).map((col) => {
                            const name = typeof col === 'string' ? col : col.name;
                            return <option key={name} value={name}>{name}</option>;
                          })}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {cart.length > 0 && (
            <div className={styles.cartFooter}>
              <div className={styles.cartTotal}>
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <button 
                onClick={handleProceedToCheckout} 
                className={styles.ctaLink} 
                style={{ border: 'none', cursor: 'pointer', width: '100%' }}
              >
                Complete Cart & Checkout
              </button>
            </div>
          )}
        </aside>
      </main>

      {/* Mobile overlay */}
      {showCartMobile && (
        <div className={styles.mobileOverlay} onClick={() => setShowCartMobile(false)} />
      )}
    </div>
  );
}
