/**
 * ProductCard Component
 * Displays individual product with add-to-cart functionality
 * @version 1.0.0
 */

'use client';

import { memo, useState, useEffect } from 'react';
import Image from 'next/image';
import { Zap, Star, Sparkles, Heart } from 'lucide-react';
import styles from './ProductCard.module.css';
import { useCart } from '../contexts/GroklyContext';
import { useAuth } from '@/app/components/AuthProvider';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * Generate star rating string
 * @param {number} rating - Rating value (0-5)
 * @returns {string} Star string
 */
const generateStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (i < Math.floor(rating) ? "★" : "☆")).join("");
};

/**
 * Get fallback image URL based on product category and index
 * Uses direct Pexels photo URLs for reliability
 * @param {string} productId - Product ID
 * @param {string} category - Product category
 * @returns {string} Pexels image URL
 */
const getProductImage = (productId, category) => {
  // Map of category to verified Pexels stock photos (royalty-free, hotlink-safe)
  const categoryImages = {
    'vegetables-fruits': [
      'https://images.pexels.com/photos/2893635/pexels-photo-2893635.jpeg', // green bell peppers
      'https://images.pexels.com/photos/7572005/pexels-photo-7572005.jpeg', // cauliflower
    ],
    'dairy-breakfast': [
      'https://images.pexels.com/photos/36040972/pexels-photo-36040972.jpeg', // cheese slices
      'https://images.pexels.com/photos/5908003/pexels-photo-5908003.jpeg',   // fresh cream
    ],
    'munchies': [
      'https://images.pexels.com/photos/7033900/pexels-photo-7033900.jpeg',  // tortilla chips
      'https://images.pexels.com/photos/34466116/pexels-photo-34466116.jpeg', // potato chips
    ],
    'cold-drinks': [
      'https://images.pexels.com/photos/15205136/pexels-photo-15205136.jpeg', // cola in glass
      'https://images.pexels.com/photos/4045205/pexels-photo-4045205.jpeg',   // lime soda
    ],
    'instant-frozen': [
      'https://images.pexels.com/photos/4518673/pexels-photo-4518673.jpeg', // ramen noodles
      'https://images.pexels.com/photos/6940988/pexels-photo-6940988.jpeg', // instant noodle blocks
    ],
    'tea-coffee': [
      'https://images.pexels.com/photos/7507583/pexels-photo-7507583.jpeg', // instant coffee jar
    ],
    'bakery-biscuits': [
      'https://images.pexels.com/photos/7543099/pexels-photo-7543099.jpeg', // fresh bread rolls
    ],
    'sweet-tooth': [
      'https://images.pexels.com/photos/4113363/pexels-photo-4113363.jpeg', // chocolate bars
      'https://images.pexels.com/photos/32402905/pexels-photo-32402905.jpeg', // assorted chocolate
    ],
    'masala-oil': [
      'https://images.pexels.com/photos/31275834/pexels-photo-31275834.jpeg', // cooking oil bottles
      'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg',   // spices
    ],
    'organic-healthy': [
      'https://images.pexels.com/photos/18142621/pexels-photo-18142621.jpeg', // chocolate milkshake
      'https://images.pexels.com/photos/13779116/pexels-photo-13779116.jpeg', // protein powder
    ],
    'atta-rice-dal': [
      'https://images.pexels.com/photos/5441094/pexels-photo-5441094.jpeg', // flour bowl
    ],
    'sauces-spreads': [
      'https://images.pexels.com/photos/12932886/pexels-photo-12932886.jpeg', // ketchup bottle
    ],
    'cleaning': [
      'https://images.pexels.com/photos/10573258/pexels-photo-10573258.jpeg', // dish soap bottles
      'https://images.pexels.com/photos/5217885/pexels-photo-5217885.jpeg',   // cleaner bottle
    ],
    'personal-care': [
      'https://images.pexels.com/photos/7622555/pexels-photo-7622555.jpeg', // toothpaste
    ],
    'pharma-wellness': [
      'https://images.pexels.com/photos/20140029/pexels-photo-20140029.jpeg', // medicine bottles
    ],
    'baby-care': [
      'https://images.pexels.com/photos/30344708/pexels-photo-30344708.jpeg', // baby with diapers
    ],
    'pet-care': [
      'https://images.pexels.com/photos/8434633/pexels-photo-8434633.jpeg', // dog food bowl
    ],
    'home-office': [
      'https://images.pexels.com/photos/7351636/pexels-photo-7351636.jpeg', // scrub pad
    ],
    'default': [
      'https://images.pexels.com/photos/2893635/pexels-photo-2893635.jpeg',
      'https://images.pexels.com/photos/36040972/pexels-photo-36040972.jpeg',
    ]
  };

  // Get images for category or use default
  const images = categoryImages[category] || categoryImages['default'];
  
  // Use product ID hash to consistently select an image
  const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % images.length;
  
  return images[index];
};

// Emojis removed to conform with professional design standards.

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
 * @param {string} props.product.image - Image URL
 * @param {string} props.product.category - Product category
 * @param {Array<string>} [props.product.tags] - Product tags
 * @param {number} props.product.rating - Rating (0-5)
 */
function ProductCard({ product }) {
  const { getProductQuantity, addToCart, incrementQuantity, decrementQuantity } = useCart();
  
  const quantity = getProductQuantity(product.id);
  const stars = generateStars(product.rating);

  // Set initial image URL state to the product's actual image, falling back to Unsplash
  const [imgUrl, setImgUrl] = useState(product.image || getProductImage(product.id, product.category));

  useEffect(() => {
    setImgUrl(product.image || getProductImage(product.id, product.category));
  }, [product.id, product.image, product.category]);

  // Wishlist state
  const { user, uid } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const currentId = user?.uid || uid;
    if (!currentId) return;

    const checkWishlist = async () => {
      try {
        const snap = await getDoc(doc(db, 'grokly_wishlists', currentId));
        if (snap.exists()) {
          const list = snap.data()?.items || [];
          setIsWishlisted(list.some(item => item.id === product.id));
        }
      } catch (e) { /* noop */ }
    };
    checkWishlist();
  }, [product.id, user, uid]);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    const currentId = user?.uid || uid;
    if (!currentId) return;

    try {
      const snap = await getDoc(doc(db, 'grokly_wishlists', currentId));
      let list = snap.exists() ? (snap.data()?.items || []) : [];
      if (isWishlisted) {
        list = list.filter(item => item.id !== product.id);
      } else {
        list.push({ id: product.id, name: product.name, price: product.price, image: product.image });
      }
      await setDoc(doc(db, 'grokly_wishlists', currentId), {
        items: list,
        updatedAt: Date.now(),
      }, { merge: true });
      setIsWishlisted(!isWishlisted);
    } catch (e) { /* noop */ }
  };

  /**
   * Handle image error - show fallback
   */
  const handleImageError = (e) => {
    if (imgUrl === product.image) {
      setImgUrl(getProductImage(product.id, product.category));
    } else {
      e.target.style.display = 'none';
      if (e.target.nextElementSibling) {
        e.target.nextElementSibling.style.display = 'flex';
      }
    }
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
      {/* Bestseller Badge - TOP LEFT */}
      {product.tags?.includes("Bestseller") && (
        <div className={styles.bestBadge} aria-label="Bestseller">
          <Zap size={12} aria-hidden="true" /> Best
        </div>
      )}

      {/* Premium Badge - TOP LEFT */}
      {product.tags?.includes("Premium") && !product.tags?.includes("Bestseller") && (
        <div className={`${styles.bestBadge} ${styles.premium}`} aria-label="Premium product">
          <Sparkles size={12} aria-hidden="true" /> Premium
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
        {/* Discount badge inside image wrap, bottom-left */}
        {product.disc > 0 && (
          <div className={styles.discBadge} aria-label={`${product.disc}% discount`}>
            {product.disc}% OFF
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element -- imgUrl is resolved from a heterogeneous set of external product-image hosts (scraped data), not compatible with next/image's static remotePatterns allowlist */}
        <img
          className={styles.pimg}
          src={imgUrl}
          alt={`${product.name} - ${product.brand}`}
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
          onError={handleImageError}
        />
        <div className={styles.pimgPlaceholder} style={{ display: 'none', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#F3F4F6' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        {/* Wishlist Heart Button - TOP RIGHT */}
        <button
          className={styles.wishlistBtn}
          onClick={toggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={16}
            fill={isWishlisted ? '#ef4444' : 'none'}
            stroke={isWishlisted ? '#ef4444' : '#9ca3af'}
          />
        </button>
      </div>

      {/* Delivery Time Badge */}
      <div className={styles.pdeliv} aria-label="Delivery in 11 minutes">
        <Zap size={12} aria-hidden="true" /> 11 MINS
      </div>

      {/* Product Information */}
      <div className={styles.pinfo}>
        {/* Unit */}
        <div className={styles.punit}>{product.unit}</div>

        {/* Product Name */}
        <h3 className={styles.pname}>{product.name}</h3>

        {/* Brand and SKU */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className={styles.pbrand}>{product.brand}</div>
          <span style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{product.sku}</span>
        </div>

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
