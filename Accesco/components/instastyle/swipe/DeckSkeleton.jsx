import React from 'react';
import styles from '../../../app/services/instastyle/swipestyle/swipestyle.module.css';

export const DeckSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={`${styles.skeletonImage} ${styles.skeletonShimmer}`} />

      <div className={styles.skeletonInfo}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className={`${styles.skeletonTitle} ${styles.skeletonShimmer}`} />
            <div className={`${styles.skeletonPrice} ${styles.skeletonShimmer}`} />
          </div>
          <div className={`${styles.skeletonBrand} ${styles.skeletonShimmer}`} />
        </div>

        <div className={styles.skeletonTags}>
          <div className={`${styles.skeletonTag} ${styles.skeletonShimmer}`} />
          <div className={`${styles.skeletonTag} ${styles.skeletonShimmer}`} />
          <div className={`${styles.skeletonTag} ${styles.skeletonShimmer}`} />
        </div>
      </div>
    </div>
  );
};