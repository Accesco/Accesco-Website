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
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {itemCount > 0 && (
        <span className={styles.badge}>{itemCount}</span>
      )}
    </button>
  );
}
