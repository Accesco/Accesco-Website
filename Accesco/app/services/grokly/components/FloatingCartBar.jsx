/**
 * FloatingCartBar Component - Mobile floating cart button
 * @version 1.0.0
 */

'use client';

import { ShoppingCart, ArrowRight } from 'lucide-react';
import styles from './FloatingCartBar.module.css';
import { useGrokly } from '../contexts/GroklyContext';

/**
 * FloatingCartBar Component
 * Floating cart button for mobile with item count and total
 */
export default function FloatingCartBar() {
  const { cartCount, openCart } = useGrokly();

  // Don't show if cart is empty
  if (cartCount === 0) return null;

  return (
    <div className={styles.floatingBar}>
      <button 
        className={styles.cartBtn}
        onClick={openCart}
        aria-label={`View cart with ${cartCount} items`}
      >
        <div className={styles.cartLeft}>
          <ShoppingCart className={styles.cartIcon} size={20} aria-hidden="true" />
          <div className={styles.cartInfo}>
            <div className={styles.cartCount}>{cartCount} item{cartCount !== 1 ? 's' : ''}</div>
            <div className={styles.cartLabel}>View Cart</div>
          </div>
        </div>
        <div className={styles.cartRight}>
          <ArrowRight className={styles.cartArrow} size={20} aria-hidden="true" />
        </div>
      </button>
    </div>
  );
}
