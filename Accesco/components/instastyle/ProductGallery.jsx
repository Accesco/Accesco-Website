'use client';

import { useState } from 'react';
import styles from './ProductGallery.module.css';

export default function ProductGallery({ images, productName }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.gallery}>
      {/* Main Image */}
      <div className={styles.mainImageContainer}>
        <div className={`${styles.mainImage} ${isZoomed ? styles.zoomed : ''}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- product image comes from mock data's heterogeneous external hosts, not compatible with next/image's static remotePatterns allowlist */}
          <img
            src={images[selectedImage].url}
            alt={images[selectedImage].alt || productName}
            className={styles.image}
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={handleNext}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className={styles.imageCounter}>
          {selectedImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <button
              key={index}
              className={`${styles.thumbnail} ${
                selectedImage === index ? styles.active : ''
              }`}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`View image ${index + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- product image comes from mock data's heterogeneous external hosts, not compatible with next/image's static remotePatterns allowlist */}
              <img
                src={image.url}
                alt={image.alt || `${productName} - Image ${index + 1}`}
                className={styles.thumbnailImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
