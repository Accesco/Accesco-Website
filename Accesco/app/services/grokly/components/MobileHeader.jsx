/**
 * MobileHeader Component - Mobile-optimized header
 * @version 1.0.0
 */

'use client';

import Image from 'next/image';
import styles from './MobileHeader.module.css';
import { useGrokly } from '../contexts/GroklyContext';

/**
 * MobileHeader Component
 * Displays mobile-optimized header with location and search
 */
export default function MobileHeader() {
  const { 
    location, 
    openLocationModal, 
    cartCount, 
    openCart 
  } = useGrokly();

  return (
    <div className={styles.mobileHeader}>
      {/* Top Bar - Location and Cart */}
      <div className={styles.topBar}>
        {/* Location Button */}
        <button 
          className={styles.locationBtn}
          onClick={openLocationModal}
          aria-label="Change delivery location"
        >
          <span className={styles.locationIcon} aria-hidden="true">📍</span>
          <div className={styles.locationText}>
            <div className={styles.locationLabel}>Delivery in 11 mins</div>
            <div className={styles.locationName}>
              {location}
              <span className={styles.locationArrow} aria-hidden="true">▼</span>
            </div>
          </div>
        </button>

        {/* Cart Button */}
        <button 
          className={styles.cartBtn}
          onClick={openCart}
          aria-label={`Shopping cart with ${cartCount} items`}
        >
          <span className={styles.cartIcon} aria-hidden="true">🛒</span>
          {cartCount > 0 && (
            <span className={styles.cartBadge} aria-label={`${cartCount} items`}>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <span className={styles.searchIcon} aria-hidden="true">🔍</span>
        <input
          type="search"
          placeholder="Search for products..."
          className={styles.searchInput}
          aria-label="Search products"
        />
      </div>
    </div>
  );
}
