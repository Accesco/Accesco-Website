'use client';

import { useCart } from '@/contexts/CartContext';
import styles from './CartBadge.module.css';

export default function CartBadge() {
  const { itemCount, toggleCart } = useCart();

  return (
    <button
      className={styles.cartBadge}
      onClick={toggleCart}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <svg
        className={styles.icon}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      {itemCount > 0 && (
        <span className={styles.badge}>{itemCount}</span>
      )}
    </button>
  );
}
