/**
 * ProductSkeleton Component - Loading skeleton for product cards
 * @version 1.0.0
 */

'use client';

import styles from './ProductSkeleton.module.css';

/**
 * ProductSkeleton Component
 * Displays loading skeleton while products are being fetched
 */
export default function ProductSkeleton({ count = 12 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.skeleton}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonLine} style={{ width: '60%' }} />
            <div className={styles.skeletonLine} style={{ width: '80%' }} />
            <div className={styles.skeletonLine} style={{ width: '40%' }} />
            <div className={styles.skeletonButton} />
          </div>
        </div>
      ))}
    </>
  );
}
