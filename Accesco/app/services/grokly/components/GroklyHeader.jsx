/**
 * GroklyHeader Component - Desktop Header
 * @version 1.0.0
 */

'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { MapPin, Search, X, ShoppingCart } from 'lucide-react';
import styles from './GroklyHeader.module.css';
import { useGrokly } from '../contexts/GroklyContext';
import { products } from '../lib/groklyData';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthProvider';

export default function GroklyHeader({ 
  searchQuery, 
  onSearchChange,
  onSearchClear 
}) {
  const { 
    location, 
    openLocationModal, 
    cartCount, 
    openCart,
    cart
  } = useGrokly();
  const { user } = useAuth();

  // Calculate cart total dynamically
  const cartTotal = useMemo(() => {
    return Object.entries(cart || {}).reduce((sum, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return sum + (product ? product.price * quantity : 0);
    }, 0);
  }, [cart]);

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
          <div className={styles.locText}>
            <div className={styles.locLabel}>Delivery in 11 minutes</div>
            <div className={styles.locName}>
              {location}
              <span className={styles.locArrow} aria-hidden="true"> ▼</span>
            </div>
          </div>
        </button>

        {/* Search Bar */}
        <div className={styles.deskSearch}>
          <Search className={styles.sIcon} size={18} aria-hidden="true" />
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
              <X size={16} />
            </button>
          )}
        </div>


        {/* Cart Button */}
        <button 
          className={`${styles.hdrCart} ${cartCount > 0 ? styles.hasItems : ''}`}
          onClick={openCart}
          aria-label={`Shopping cart with ${cartCount} items`}
        >
          <ShoppingCart size={18} aria-hidden="true" />
          <div className={styles.cartBtnText}>
            {cartCount > 0 ? (
              <span className={styles.cartDetails}>
                <span>{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
                <span className={styles.cartDivider}>|</span>
                <span>₹{cartTotal}</span>
              </span>
            ) : (
              <span>My Cart</span>
            )}
          </div>
        </button>

        {/* Auth State Button */}
        {user ? (
          <Link href="/services/grokly/profile" className={styles.hdrProfile} aria-label="Go to profile">
            <div className={styles.profileAvatar}>
              {user.name ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'U'}
            </div>
            <span className={styles.profileName}>
              Hi, {user.name ? user.name.split(' ')[0] : 'User'}
            </span>
          </Link>
        ) : (
          <Link href="/profile?redirect=/services/grokly" className={styles.hdrLogin} aria-label="Login or sign up">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
