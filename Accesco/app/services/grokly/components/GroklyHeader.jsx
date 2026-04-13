/**
 * GroklyHeader Component - Desktop Header
 * @version 1.0.0
 */

'use client';

import Image from 'next/image';
import styles from './GroklyHeader.module.css';
import { useGrokly } from '../contexts/GroklyContext';

export default function GroklyHeader({ 
  searchQuery, 
  onSearchChange,
  onSearchClear 
}) {
  const { 
    location, 
    openLocationModal, 
    cartCount, 
    openCart 
  } = useGrokly();

  // Calculate cart total (simplified - would come from context in production)
  const cartTotal = 0; // TODO: Calculate from cart items

  return (
    <div className={styles.topbar}>
      <div className={styles.topbarInner}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Image 
              src="/images/grokly-icon.png" 
              alt="Grokly" 
              width={26} 
              height={26}
            />
          </div>
          <div className={styles.logoText}>Grokly</div>
        </div>

        {/* Location Button */}
        <button 
          className={styles.locBtn}
          onClick={openLocationModal}
          aria-label="Change delivery location"
        >
          <span className={styles.locPin} aria-hidden="true">📍</span>
          <div className={styles.locText}>
            <div className={styles.locLabel}>DELIVERY IN 11 MINS</div>
            <div className={styles.locName}>{location}</div>
          </div>
          <span className={styles.locArrow} aria-hidden="true">▼</span>
        </button>

        {/* Search Bar */}
        <div className={styles.deskSearch}>
          <span className={styles.sIcon} aria-hidden="true">🔍</span>
          <input
            type="search"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search products"
          />
          {searchQuery && (
            <button 
              className={styles.sClear}
              onClick={onSearchClear}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Delivery Badge */}
        <div className={styles.deskDeliv} aria-label="11 minute delivery">
          <span className={styles.bolt} aria-hidden="true">⚡</span>
          <span>Delivery in <strong>11 MINS</strong></span>
        </div>

        {/* Cart Button */}
        <button 
          className={styles.hdrCart}
          onClick={openCart}
          aria-label={`Shopping cart with ${cartCount} items`}
        >
          <span aria-hidden="true">🛒</span>
          {cartCount > 0 && (
            <span className={styles.hdrCartCount} aria-label={`${cartCount} items`}>
              {cartCount}
            </span>
          )}
          <span className={styles.hdrCartAmt}>₹{cartTotal}</span>
        </button>

        {/* Login Button */}
        <button 
          className={styles.hdrLogin}
          onClick={() => console.log('Login clicked')}
          aria-label="Login or sign up"
        >
          Login
        </button>
      </div>
    </div>
  );
}
