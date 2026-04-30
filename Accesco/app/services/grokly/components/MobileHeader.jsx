/**
 * MobileHeader Component - Mobile-optimized header
 * @version 1.0.0
 */

'use client';

import Image from 'next/image';
import { MapPin, ShoppingCart, Search, ChevronDown } from 'lucide-react';
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
          <MapPin className={styles.locationIcon} size={18} aria-hidden="true" />
          <div className={styles.locationText}>
            <div className={styles.locationLabel}>Delivery in 11 mins</div>
            <div className={styles.locationName}>
              {location}
              <ChevronDown className={styles.locationArrow} size={14} aria-hidden="true" />
            </div>
          </div>
        </button>

        {/* Cart Button */}
        <button 
          className={styles.cartBtn}
          onClick={openCart}
          aria-label={`Shopping cart with ${cartCount} items`}
        >
          <ShoppingCart className={styles.cartIcon} size={20} aria-hidden="true" />
          {cartCount > 0 && (
            <span className={styles.cartBadge} aria-label={`${cartCount} items`}>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <Search className={styles.searchIcon} size={18} aria-hidden="true" />
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
