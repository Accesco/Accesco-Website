'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { toggleWishlist, isWishlisted } = useCart();
  const active = isWishlisted(product.id);

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
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={styles.productImage}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        <button 
          className={`${styles.wishlistBtn} ${active ? styles.active : ''}`}
          onClick={handleWishlist}
          aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {active ? '❤️' : '🤍'}
        </button>

        {hasDiscount && (
          <span className={styles.discountBadge}>
            {product.discountPercentage}% OFF
          </span>
        )}

        {!product.inStock && (
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
          <span className={styles.stars}>⭐ {product.rating}</span>
          <span className={styles.reviews}>({product.reviewCount})</span>
        </div>
      </div>
    </Link>
  );
}
