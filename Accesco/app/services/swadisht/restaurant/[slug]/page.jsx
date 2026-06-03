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
      <div 
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className={styles.modalClose}
          onClick={onClose}
        >
          ←
        </button>

        <img
          src={dish.image}
          alt={dish.name}
          className={styles.modalImage}
        />

        <div className={styles.modalBody}>
          <div className={styles.modalTop}>
            <h2>{dish.name}</h2>

            <div className={styles.modalPriceRow}>
              <span className={styles.modalPrice}>
                ₹{dish.price}
              </span>

              <button
                className={styles.modalAddBtn}
                onClick={() => onAddToCart(dish)}
              >
                ADD
              </button>
            </div>
          </div>

          <p className={styles.modalDesc}>
            {dish.description}
          </p>
        </div>
      </div>
    </div>
  );
}


function RestaurantDetailContent() {
  const params = useParams();
  const { addToCart, cart } = useSwadishtt();
  const [restaurant, setRestaurant] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDish, setSelectedDish] = useState(null);

  useEffect(() => {
    const found = RESTAURANTS.find(r => r.slug === params.slug);
    setRestaurant(found);
  }, [params.slug]);

  if (!restaurant) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
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

  return (
    <div className={styles.page}>
      <SwadishttHeader />
      
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroImage}>
         {restaurant.video ? (
    <video
      className={styles.heroVideo}
      autoPlay
      muted
      loop
      playsInline
      poster={restaurant.coverImage}
    >
      <source src={restaurant.video} type="video/mp4" />
    </video>
  ) : (
    <img
      src={restaurant.coverImage}
      alt={restaurant.name}
      onError={(e) => {
        e.target.src = `https://placehold.co/1200x400/E23744/FFFFFF/png?text=${encodeURIComponent(restaurant.name)}`;
      }}
    />
  )}
          <div className={styles.heroOverlay}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.container}>
            <h1 className={styles.restaurantName}>{restaurant.name}</h1>
            <p className={styles.cuisines}>{restaurant.cuisines.join(', ')}</p>
            
            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <svg className={styles.starIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className={styles.rating}>{restaurant.rating}</span>
                <span className={styles.ratingCount}>({restaurant.ratingCount}+ ratings)</span>
              </div>
              
              <span className={styles.metaDivider}>•</span>
              
              <div className={styles.metaItem}>
                <svg className={styles.metaIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                <span>{restaurant.deliveryTime}</span>
              </div>
              
              <span className={styles.metaDivider}>•</span>
              
              <div className={styles.metaItem}>
                <span>₹{restaurant.priceForTwo} for two</span>
              </div>
            </div>
            
            <div className={styles.location}>
              <svg className={styles.locationIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              <span>{restaurant.location.area}, {restaurant.location.city}</span>
            </div>
            
            {restaurant.offers.length > 0 && (
              <div className={styles.offers}>
                {restaurant.offers.map((offer, idx) => (
                  <div key={idx} className={styles.offerCard}>
                    <svg className={styles.offerIcon} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"/>
                    </svg>
                    <div>
                      <div className={styles.offerTitle}>{offer.title}</div>
                      <div className={styles.offerDesc}>{offer.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Menu Section */}
      <div className={styles.menuSection}>
        <div className={styles.container}>
          <div className={styles.menuLayout}>
            {/* Category Sidebar */}
            <div className={styles.categorySidebar}>
              <h3 className={styles.sidebarTitle}>Menu Categories</h3>
              <div className={styles.categoryList}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`${styles.categoryBtn} ${activeCategory === cat ? styles.active : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat === 'all' ? 'All Items' : cat}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Menu Items */}
            <div className={styles.menuContent}>
              <h2 className={styles.menuTitle}>
                {activeCategory === 'all' ? 'Full Menu' : activeCategory}
              </h2>
              
              <div className={styles.menuGrid}>
                {filteredMenu.map(dish => (
                  <div 
  key={dish.id} 
  className={styles.dishCard}
  onClick={() => setSelectedDish(dish)}
>
                    <div className={styles.dishImage}>
                      <img 
                        src={dish.image} 
                        alt={dish.name}
                        onError={(e) => {
                          e.target.src = `https://placehold.co/200x150/E23744/FFFFFF/png?text=${encodeURIComponent(dish.name)}`;
                        }}
                      />
                      {dish.isBestseller && (
                        <div className={styles.bestsellerBadge}>⭐ Bestseller</div>
                      )}
                      <div className={styles.vegIndicator}>
                        <span className={dish.isVeg ? styles.vegDot : styles.nonVegDot}></span>
                      </div>
                    </div>
                    
                    <div className={styles.dishInfo}>
                      <h3 className={styles.dishName}>{dish.name}</h3>
                      <p className={styles.dishDesc}>{dish.description}</p>
                      
                      <div className={styles.dishFooter}>
                        <span className={styles.dishPrice}>₹{dish.price}</span>
                        <button 
                          className={styles.addBtn}
                          onClick={(e) => {
  e.stopPropagation();
  handleAddToCart(dish);
}}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DishModal
  dish={selectedDish}
  onClose={() => setSelectedDish(null)}
  onAddToCart={handleAddToCart}
/>
      {/* Cart Float */}
      {cart.length > 0 && (
        <Link href="/services/swadisht/cart" className={styles.cartFloat}>
          <div className={styles.cartFloatContent}>
            <span className={styles.cartCount}>{cart.length} items</span>
            <span className={styles.cartTotal}>
              ₹{cart.reduce((sum, item) => sum + item.price, 0)}
            </span>
          </div>
          <span className={styles.cartFloatText}>View Cart →</span>
        </Link>
      )}
    </div>
  );
}

export default function RestaurantDetailPage() {
  return <RestaurantDetailContent />;
}
