'use client';

/**
 * Restaurant Detail Page
 * @page /services/swadisht/restaurant/[slug]
 * @description Individual restaurant page with menu
 */

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSwadishtt } from '../../contexts/SwadishttContext';
import SwadishttHeader from '../../components/SwadishttHeader';
import { RESTAURANTS } from '../../lib/swadishttData';
import styles from './restaurant.module.css';

function DishModal({ dish, onClose, onAddToCart }) {
  if (!dish) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <img src={dish.image} alt={dish.name} className={styles.modalImage} />
        <div className={styles.modalBody}>
          <div className={styles.modalTop}>
            <div>
              <h2>{dish.name}</h2>
              {dish.calories > 0 && (
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0' }}>{dish.calories} cal · {dish.protein}g protein</p>
              )}
            </div>
            <div className={styles.modalPriceRow}>
              <span className={styles.modalPrice}>&#8377;{dish.price}</span>
              <button className={styles.modalAddBtn} onClick={() => { onAddToCart(dish); onClose(); }}>
                Add
              </button>
            </div>
          </div>
          <p className={styles.modalDesc}>{dish.description}</p>
        </div>
      </div>
    </div>
  );
}

function RestaurantDetailContent() {
  const params = useParams();
  const { addToCart, cart, updateQuantity } = useSwadishtt();
  const [restaurant, setRestaurant] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDish, setSelectedDish] = useState(null);

  useEffect(() => {
    const found = RESTAURANTS.find(r => r.slug === params.slug);
    setRestaurant(found);
  }, [params.slug]);

  useEffect(() => {
    if (!restaurant) return;
    
    // Check for search parameter using standard URL parsing to prevent useSearchParams hydration delay
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const dishId = urlParams.get('dish');
      if (dishId) {
        const foundDish = restaurant.menu.find(d => d.id === dishId);
        if (foundDish) {
          // Open categories tab if it doesn't match 'all'
          if (activeCategory !== 'all' && foundDish.category !== activeCategory) {
            setActiveCategory('all');
          }
          setSelectedDish(foundDish);
          setTimeout(() => {
            const element = document.getElementById(`dish-card-${dishId}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        }
      }
    }
  }, [restaurant]);

  if (!restaurant) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading restaurant...</p>
      </div>
    );
  }

  const categories = ['all', ...new Set(restaurant.menu.map(item => item.category))];
  const filteredMenu = activeCategory === 'all'
    ? restaurant.menu
    : restaurant.menu.filter(item => item.category === activeCategory);

  const handleAddToCart = (dish) => {
    addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      restaurant: restaurant.name,
      calories: dish.calories || 0,
      protein: dish.protein || 0,
      carbs: dish.carbs || 0,
      fats: dish.fats || 0,
    });
  };

  const getDishQty = (dishId) => {
    const item = cart.find(i => i.id === dishId);
    return item ? (item.quantity || 1) : 0;
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroImage}>
          {restaurant.video ? (
            <video className={styles.heroVideo} autoPlay muted loop playsInline poster={restaurant.coverImage}>
              <source src={restaurant.video} type="video/mp4" />
            </video>
          ) : (
            <img
              src={restaurant.coverImage}
              alt={restaurant.name}
              onError={(e) => { e.target.src = `https://placehold.co/1200x480/6B1D3A/FFFFFF/png?text=${encodeURIComponent(restaurant.name)}`; }}
            />
          )}
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.restaurantName}>{restaurant.name}</h1>
          <p className={styles.cuisines}>{restaurant.cuisines.join(' · ')}</p>
          <div className={styles.metaRow}>
            <div className={styles.ratingBadge}>
              <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              {restaurant.rating}
            </div>
            <div className={styles.metaItem}>
              <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              {restaurant.deliveryTime}
            </div>
            <div className={styles.metaItem}>
              &#8377;{restaurant.priceForTwo} for two
            </div>
            <div className={styles.metaItem}>
              <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              {restaurant.location.area}, {restaurant.location.city}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Info Bar ── */}
      <div className={styles.infoBar}>
        <div className={styles.infoBarInner}>
          <span className={styles.infoBarName}>{restaurant.name}</span>
          <div className={styles.infoBarMeta}>
            <span className={styles.infoBarRating}>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              {restaurant.rating} ({restaurant.ratingCount}+)
            </span>
            <span>·</span>
            <span>{restaurant.deliveryTime}</span>
            <span>·</span>
            <span>&#8377;{restaurant.priceForTwo} for two</span>
          </div>
        </div>
      </div>

      {/* ── Offers Banner ── */}
      {restaurant.offers && restaurant.offers.length > 0 && (
        <div className={styles.offersBanner}>
          <div className={styles.offersInner}>
            {restaurant.offers.map((offer, idx) => (
              <div key={idx} className={styles.offerChip}>
                <svg className={styles.offerIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"/>
                </svg>
                {offer.title} — {offer.description}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Body: Sidebar + Menu ── */}
      <div className={styles.body}>
        {/* Category Sidebar */}
        <nav className={styles.categorySidebar} aria-label="Menu categories">
          <p className={styles.sidebarTitle}>Menu</p>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.categoryBtn} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}
        </nav>

        {/* Menu Area */}
        <div className={styles.menuArea}>
          <h2 className={styles.sectionTitle}>
            {activeCategory === 'all' ? 'Full Menu' : activeCategory}
            <span className={styles.sectionCount}>{filteredMenu.length} items</span>
          </h2>

          <div className={styles.menuGrid}>
            {filteredMenu.map(dish => {
              const qty = getDishQty(dish.id);
              return (
                <article key={dish.id} id={`dish-card-${dish.id}`} className={styles.dishCard}>
                  <div className={styles.dishImageWrapper} onClick={() => setSelectedDish(dish)}>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      onError={(e) => {
                        e.target.src = `https://placehold.co/400x200/6B1D3A/FFFFFF/png?text=${encodeURIComponent(dish.name)}`;
                      }}
                    />
                    <div className={styles.dishVegBadge}>
                      <span className={dish.isVeg ? styles.vegDot : styles.nonVegDot} />
                    </div>
                    {dish.isBestseller && (
                      <span className={styles.dishBestsellerTag}>Bestseller</span>
                    )}
                  </div>

                  <div className={styles.dishInfo}>
                    <h3 className={styles.dishName}>{dish.name}</h3>
                    <p className={styles.dishDesc}>{dish.description}</p>
                    <div className={styles.dishFooter}>
                      <div>
                        <div className={styles.dishPrice}>&#8377;{dish.price}</div>
                        {dish.calories > 0 && (
                          <div className={styles.dishNutrition}>{dish.calories} cal</div>
                        )}
                      </div>
                      {qty === 0 ? (
                        <button
                          className={styles.addBtn}
                          onClick={(e) => { e.stopPropagation(); handleAddToCart(dish); }}
                        >
                          Add
                        </button>
                      ) : (
                        <div className={styles.qtyControl} onClick={(e) => e.stopPropagation()}>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => updateQuantity(dish.id, qty - 1)}
                          >
                            −
                          </button>
                          <span className={styles.qtyValue}>{qty}</span>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => handleAddToCart(dish)}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Dish Modal ── */}
      <DishModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToCart={handleAddToCart}
      />

      {/* ── Floating Cart Bar ── */}
      {cartCount > 0 && (
        <Link href="/services/swadisht/cart" className={styles.floatingCart}>
          <div className={styles.floatingCartLeft}>
            <span className={styles.floatingCartBadge}>{cartCount}</span>
            items
          </div>
          <span className={styles.floatingCartText}>View Cart</span>
          <span className={styles.floatingCartPrice}>&#8377;{cartTotal}</span>
        </Link>
      )}
    </div>
  );
}

export default function RestaurantDetailPage() {
  return <RestaurantDetailContent />;
}
