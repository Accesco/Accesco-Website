/**
 * BannerCarousel Component - Static banner grid
 * @version 2.0.0
 */

'use client';

import styles from './BannerCarousel.module.css';
import { banners } from '../lib/groklyData';

/**
 * BannerCarousel Component
 * Displays banners in a 2x2 grid layout (no auto-rotation)
 */
export default function BannerCarousel() {
  if (banners.length === 0) return null;

  return (
    <div 
      className={styles.carousel}
      role="region"
      aria-label="Promotional banners"
    >
      <div className={styles.bannerGrid}>
        {banners.map((banner, index) => (
          <div
            key={index}
            className={styles.bannerCard}
            style={{ background: banner.bg }}
          >
            <div className={styles.bannerContent}>
              <div className={styles.tag}>{banner.tag}</div>
              <h2 className={styles.title}>{banner.title}</h2>
              <p className={styles.subtitle}>{banner.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
