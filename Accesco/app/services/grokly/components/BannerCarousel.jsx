/**
 * BannerCarousel Component - Hero banner carousel
 * @version 1.0.0
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './BannerCarousel.module.css';
import { banners } from '../lib/groklyData';

/**
 * BannerCarousel Component
 * Auto-rotating banner carousel with manual controls
 */
export default function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  /**
   * Go to next slide
   */
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, []);

  /**
   * Go to previous slide
   */
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  /**
   * Go to specific slide
   */
  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  }, []);

  /**
   * Auto-play effect
   */
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  /**
   * Handle mouse enter - pause auto-play
   */
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  /**
   * Handle mouse leave - resume auto-play
   */
  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  if (banners.length === 0) return null;

  return (
    <div 
      className={styles.carousel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Promotional banners"
    >
      <div className={styles.carouselInner}>
        {/* Slides */}
        <div 
          className={styles.slides}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div
              key={index}
              className={styles.slide}
              style={{ background: banner.bg }}
              aria-hidden={currentSlide !== index}
            >
              <div className={styles.slideContent}>
                <div className={styles.tag}>{banner.tag}</div>
                <h2 className={styles.title}>{banner.title}</h2>
                <p className={styles.subtitle}>{banner.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              className={`${styles.arrow} ${styles.arrowLeft}`}
              onClick={prevSlide}
              aria-label="Previous banner"
            >
              <span className={styles.arrowIcon} aria-hidden="true">‹</span>
            </button>
            <button
              className={`${styles.arrow} ${styles.arrowRight}`}
              onClick={nextSlide}
              aria-label="Next banner"
            >
              <span className={styles.arrowIcon} aria-hidden="true">›</span>
            </button>
          </>
        )}
      </div>

      {/* Dots Navigation */}
      {banners.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Banner navigation">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${currentSlide === index ? styles.active : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to banner ${index + 1}`}
              aria-selected={currentSlide === index}
              role="tab"
            />
          ))}
        </div>
      )}
    </div>
  );
}
