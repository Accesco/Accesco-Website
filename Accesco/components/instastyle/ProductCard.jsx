'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { toggleWishlist, isWishlisted, inventory } = useCart();
  const active = isWishlisted(product.id);
  
  // Check real inventory from context
  const productStock = inventory[product.id];
  const isInStock = productStock 
    ? Object.values(productStock).some(count => count > 0) 
    : product.inStock;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const displayPrice = product.discountedPrice || product.price;
  const hasDiscount = product.discountedPrice && product.discountPercentage > 0;

  return (
    <Link href={`/services/instastyle/products/${product.id}`} className={styles.productCard}>
      <div className={styles.imageContainer}>
        <div className={`${styles.imageWrapper} ${imageLoaded ? styles.loaded : ''}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- product image resolves to mock data's heterogeneous external hosts, not compatible with next/image's static remotePatterns allowlist */}
          <img
            src={product.images?.[0]?.url || product.image || '/images/ac-logo.png'}
            alt={product.name}
            className={styles.productImage}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        <button 
          className={`${styles.wishlistBtn} ${active ? styles.active : ''}`}
          onClick={handleWishlist}
          aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {hasDiscount && (
          <span className={styles.discountBadge}>
            {product.discountPercentage}% OFF
          </span>
        )}

        {!isInStock && (
          <div className={styles.outOfStockOverlay}>
            <span>Out of Stock</span>
          </div>
        )}
      </div>

      <div className={styles.productInfo}>
        <p className={styles.brand}>{product.brand}</p>
        <h3 className={styles.name}>{product.name}</h3>
        
        <div className={styles.priceRow}>
          <span className={styles.price}>₹{displayPrice.toLocaleString()}</span>
          {hasDiscount && (
            <span className={styles.originalPrice}>₹{product.price.toLocaleString()}</span>
          )}
        </div>

        <div className={styles.rating}>
          <span className={styles.stars}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {product.rating}
          </span>
          <span className={styles.reviews}>({product.reviewCount} reviews)</span>
        </div>
      </div>
    </Link>
  );
}
