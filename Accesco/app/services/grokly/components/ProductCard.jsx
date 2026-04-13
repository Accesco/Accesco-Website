/**
 * ProductCard Component
 * Displays individual product with add-to-cart functionality
 * @version 1.0.0
 */

'use client';

import { memo } from 'react';
import styles from './ProductCard.module.css';
import { useCart } from '../contexts/GroklyContext';

/**
 * Generate star rating string
 * @param {number} rating - Rating value (0-5)
 * @returns {string} Star string
 */
const generateStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (i < Math.floor(rating) ? "★" : "☆")).join("");
};

/**
 * Generate fallback image URL
 * @param {string} name - Product name
 * @returns {string} Fallback image URL
 */
const getFallbackImage = (name) => {
  const firstLetter = name ? name[0].toUpperCase() : 'P';
  return `https://placehold.co/120x120/e8f5e9/0c831f?text=${encodeURIComponent(firstLetter)}`;
};

/**
 * ProductCard Component
 * 
 * @param {Object} props
 * @param {Object} props.product - Product data
 * @param {string} props.product.id - Product ID
 * @param {string} props.product.name - Product name
 * @param {string} props.product.brand - Brand name
 * @param {number} props.product.price - Current price
 * @param {number} props.product.mrp - Original price
 * @param {number} props.product.disc - Discount percentage
 * @param {string} props.product.unit - Unit (e.g., "500 g")
 * @param {string} props.product.img - Image URL
 * @param {Array<string>} [props.product.tags] - Product tags
 * @param {number} props.product.rating - Rating (0-5)
 */
function ProductCard({ product }) {
  const { getProductQuantity, addToCart, incrementQuantity, decrementQuantity } = useCart();
  
  const quantity = getProductQuantity(product.id);
  const stars = generateStars(product.rating);

  /**
   * Handle image error - show fallback
   */
  const handleImageError = (e) => {
    e.target.src = getFallbackImage(product.name);
  };

  /**
   * Handle add to cart
   */
  const handleAdd = () => {
    addToCart(product.id);
  };

  /**
   * Handle increment
   */
  const handleIncrement = () => {
    incrementQuantity(product.id);
  };

  /**
   * Handle decrement
   */
  const handleDecrement = () => {
    decrementQuantity(product.id);
  };

  return (
    <div className={styles.pcard} data-product-id={product.id}>
      {/* Discount Badge */}
      {product.disc > 0 && (
        <div className={styles.discBadge} aria-label={`${product.disc}% discount`}>
          {product.disc}% OFF
        </div>
      )}

      {/* Bestseller Badge */}
      {product.tags?.includes("Bestseller") && (
        <div className={styles.bestBadge} aria-label="Bestseller">
          <span aria-hidden="true">⚡</span> Best
        </div>
      )}

      {/* Premium Badge */}
      {product.tags?.includes("Premium") && (
        <div className={`${styles.bestBadge} ${styles.premium}`} aria-label="Premium product">
          <span aria-hidden="true">✦</span> Premium
        </div>
      )}

      {/* Stock Indicator */}
      {product.stock && product.stock < 10 && (
        <div className={styles.stockBadge} aria-label={`Only ${product.stock} left in stock`}>
          Only {product.stock} left
        </div>
      )}

      {/* Product Image */}
      <div className={styles.pimgWrap}>
        <img 
          className={styles.pimg} 
          src={product.img} 
          alt={`${product.name} - ${product.brand}`}
          loading="lazy"
          onError={handleImageError}
        />
      </div>

      {/* Delivery Time Badge */}
      <div className={styles.pdeliv} aria-label="Delivery in 11 minutes">
        <span aria-hidden="true">⚡</span> 11 MINS
      </div>

      {/* Product Information */}
      <div className={styles.pinfo}>
        {/* Unit */}
        <div className={styles.punit}>{product.unit}</div>

        {/* Product Name */}
        <h3 className={styles.pname}>{product.name}</h3>

        {/* Brand */}
        <div className={styles.pbrand}>{product.brand}</div>

        {/* Rating */}
        <div className={styles.pstars} aria-label={`Rating: ${product.rating} out of 5 stars`}>
          <span aria-hidden="true">{stars}</span>
          <span className={styles.pratingNum}>{product.rating}</span>
        </div>

        {/* Price and Cart Controls */}
        <div className={styles.pfoot}>
          {/* Price Display */}
          <div className={styles.ppriceWrap}>
            <div className={styles.pprice} aria-label={`Price: ₹${product.price}`}>
              ₹{product.price}
            </div>
            {product.mrp > product.price && (
              <div className={styles.pmrp} aria-label={`Original price: ₹${product.mrp}`}>
                ₹{product.mrp}
              </div>
            )}
          </div>

          {/* Add to Cart Button or Quantity Controls */}
          {quantity === 0 ? (
            <button 
              className={styles.addBtn}
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
            >
              <span>ADD</span>
            </button>
          ) : (
            <div className={styles.qtyCtrl} role="group" aria-label="Quantity controls">
              <button 
                className={styles.qtyBtn}
                onClick={handleDecrement}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className={styles.qtyNum} aria-label={`Quantity: ${quantity}`}>
                {quantity}
              </span>
              <button 
                className={styles.qtyBtn}
                onClick={handleIncrement}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Memoized ProductCard
 * Only re-renders when product or quantity changes
 */
export default memo(ProductCard, (prevProps, nextProps) => {
  return prevProps.product.id === nextProps.product.id;
});
