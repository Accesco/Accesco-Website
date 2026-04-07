'use client';

import Link from 'next/link';
import styles from './VirtualTryOnButton.module.css';

export default function VirtualTryOnButton({ productId, className = '' }) {
  return (
    <Link 
      href={`/services/instastyle/virtual-tryon${productId ? `?product=${productId}` : ''}`}
      className={`${styles.tryOnButton} ${className}`}
    >
      <span className={styles.icon}>📱</span>
      <span className={styles.text}>Try Virtually</span>
    </Link>
  );
}
