'use client';

import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
// FIX: Replaced `@/` aliases with direct, validated relative paths [14]
import { useAuth } from '../../../components/AuthProvider.jsx'; // Targets /app/components/AuthProvider.jsx [9]
import { useCart } from '../../../../contexts/CartContext.jsx'; // Targets /contexts/CartContext.jsx [7]
import { useSwipeDeck } from '../../../hooks/useSwipeDeck.js'; 
import { DeckSkeleton } from '../../../../components/instastyle/swipe/DeckSkeleton.jsx';
import { SwipeCardWrapper } from '../../../../components/instastyle/swipe/SwipeCardWrapper.jsx';
import AuthModal from '../../../components/AuthModal.jsx'; 
import styles from './swipestyle.module.css';

export default function SwipePage() {
  const { user, authLoading } = useAuth(); // Aligns with your exact AuthProvider properties
  const { wishlist, toggleWishlist, addToCart } = useCart(); // Aligns with your exact CartContext properties

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); 
  const [sizeSelectors, setSizeSelectors] = useState({});
  const [colorSelectors, setColorSelectors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('add');

  const { deck, loading, error, handleSwipe, refetch } = useSwipeDeck(user);

  const showToast = (message, type = 'add') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleInterceptSwipe = (productId, action) => {
    const product = deck.find((p) => p.id === productId);
    if (!product) return;

    if (action === 'superlike') {
      if (toggleWishlist) {
        toggleWishlist(product);
        showToast(`${product.name} Wishlisted!`, 'add');
      }
    }
    handleSwipe(productId, action);
  };

  const handleCartAdd = (product) => {
    if (addToCart) {
      const size = sizeSelectors[product.id] || (product.sizes && product.sizes[0]) || 'M';
      const color = colorSelectors[product.id] || (product.colors && product.colors[0]) || 'Neutral';
      addToCart(product, size, color, 1);
      showToast(`${product.name} Added to Cart!`, 'add');
    }
  };

  if (authLoading) {
    return (
      <div className={styles.swipeSpinnerContainer}>
        <div className={styles.swipeSpinner}></div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className={styles.page}>
        <div className={styles.swipeCenterStatus} style={{ backgroundColor: '#ffffff', border: '1px solid #f3f4f6', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '384px', margin: '0 auto', marginTop: '120px' }}>
          <h2 className={styles.swipeCenterTitle}>Access Restricted</h2>
          <p className={styles.swipeCenterSubtitle}>
            You must be logged in to view your personalized style recommendation deck.
          </p>
          <button onClick={() => setIsAuthModalOpen(true)} className={styles.swipeActionButton}>
            Log In
          </button>
        </div>

        {isAuthModalOpen && (
          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)} 
          />
        )}
      </main>
    );
  }

  return (
    <main className={styles.page}>
      {toastMessage && (
        <div className={`${styles.toast} ${
          toastType === 'add' ? styles.toastAdd : toastType === 'remove' ? styles.toastRemove : styles.toastError
        }`}>
          {toastMessage}
        </div>
      )}

      <header className={styles.header}>
        <Link href="/services/instastyle" className={styles.backLink}>
          ← Back to Shop
        </Link>
        <div className={styles.headerCenter}>
          <h1 className={styles.title}>InstaStyle Swipe</h1>
          <p className={styles.subtitle}>Swipe right to like, left to skip, and superlike to wishlist</p>
        </div>
        <button className={styles.mobileCartToggle} onClick={() => setIsSidebarOpen(true)}>
          🛒
          {wishlist && wishlist.length > 0 && (
            <span className={styles.cartBadge}>{wishlist.length}</span>
          )}
        </button>
      </header>

      <div className={styles.layout}>
        <section className={styles.deckSection}>
          <div className={styles.deckHint}>
            <span className={styles.hintLeft}>✕ Skip</span>
            <span className={styles.hintRight}>♥ Like</span>
          </div>

          <div className={styles.cardContainer}>
            {loading ? (
              <DeckSkeleton />
            ) : error ? (
              <div className={styles.swipeCenterStatus}>
                <div className={styles.swipeErrorText}>Error loading recommendations</div>
                <p className={styles.swipeCenterSubtitle}>{error}</p>
                <button onClick={refetch} className={styles.swipeActionButton}>
                  Retry
                </button>
              </div>
            ) : deck.length === 0 ? (
              <div className={styles.swipeCenterStatus} style={{ border: '1px dashed #d1d5db', borderRadius: '24px', backgroundColor: '#f9fafb', width: '100%' }}>
                <div className={styles.swipeCenterTitle}>You're All Caught Up!</div>
                <p className={styles.swipeCenterSubtitle}>
                  We have updated your style preferences. Check back later for fresh recommendations.
                </p>
                <button onClick={refetch} className={styles.swipeActionButton}>
                  Refresh Deck
                </button>
              </div>
            ) : (
              <>
                {deck[1] && (
                  <div className={styles.cardBehindWrapper}>
                    <div className={styles.cardBehind}>
                      <SwipeCardWrapper
                        product={deck[1]}
                        onSwipe={handleInterceptSwipe}
                        isTopCard={false}
                      />
                    </div>
                  </div>
                )}
                <SwipeCardWrapper
                  key={deck[0].id}
                  product={deck[0]}
                  onSwipe={handleInterceptSwipe}
                  isTopCard={true}
                />
              </>
            )}
          </div>

          {deck.length > 0 && !loading && !error && (
            <div className={styles.actions}>
              <button className={styles.skipBtn} onClick={() => handleInterceptSwipe(deck[0].id, 'dislike')}>
                ✕
              </button>
              <div className={styles.actionCenter}>
                <button className={styles.addBtn} onClick={() => handleInterceptSwipe(deck[0].id, 'like')}>
                  ♥
                </button>
              </div>
              <button 
                className={styles.skipBtn} 
                style={{ color: '#0284c7', borderColor: 'rgba(2,132,199,0.2)' }} 
                onClick={() => handleInterceptSwipe(deck[0].id, 'superlike')}
              >
                ★
              </button>
            </div>
          )}
        </section>

        <aside className={`${styles.cartSection} ${isSidebarOpen ? styles.cartOpen : ''}`}>
          <button className={styles.cartClose} onClick={() => setIsSidebarOpen(false)}>
            ✕ Close
          </button>
          <div className={styles.cartHeader}>
            <h3>Saved Styles</h3>
            <span className={styles.cartCount}>{wishlist ? wishlist.length : 0} items</span>
          </div>

          <div className={styles.cartItems}>
            {!wishlist || wishlist.length === 0 ? (
              <div className={styles.emptyCart}>
                <span>Your wishlist is empty.</span>
                <span style={{ fontSize: '12px', fontWeight: '500' }}>Super Like products to save them here!</span>
              </div>
            ) : (
              wishlist.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.cartItemMain}>
                    <img src={item.imageUrl} alt={item.name} className={styles.cartThumb} />
                    <div className={styles.cartItemInfo}>
                      <h4 className={styles.cartItemName}>{item.name}</h4>
                      <p className={styles.cartItemBrand}>{item.brand}</p>
                      <p className={styles.cartItemPrice}>₹{item.price}</p>
                    </div>
                    {toggleWishlist && (
                      <button className={styles.cartRemoveBtn} onClick={() => toggleWishlist(item)}>
                        ✕
                      </button>
                    )}
                  </div>

                  <div className={styles.cartItemSelectors}>
                    <div className={styles.selectorField}>
                      <label>Size</label>
                      <select 
                        value={sizeSelectors[item.id] || ''} 
                        onChange={(e) => setSizeSelectors({ ...sizeSelectors, [item.id]: e.target.value })}
                      >
                        {(item.sizes || ['S', 'M', 'L', 'XL']).map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.selectorField}>
                      <label>Color</label>
                      <select 
                        value={colorSelectors[item.id] || ''} 
                        onChange={(e) => setColorSelectors({ ...colorSelectors, [item.id]: e.target.value })}
                      >
                        {(item.colors || ['Neutral', 'Dark', 'Bright']).map((color) => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button 
                    className={styles.ctaLink} 
                    style={{ height: '36px', borderRadius: '8px', fontSize: '12px', marginTop: '6px' }}
                    onClick={() => handleCartAdd(item)}
                  >
                    Add To Cart
                  </button>
                </div>
              ))
            )}
          </div>

          {wishlist && wishlist.length > 0 && (
            <div className={styles.cartFooter}>
              <Link href="/services/instastyle/checkout" className={styles.ctaLink}>
                Proceed to Checkout
              </Link>
            </div>
          )}
        </aside>
      </div>

      {isSidebarOpen && <div className={styles.mobileOverlay} onClick={() => setIsSidebarOpen(false)} />}
    </main>
  );
}