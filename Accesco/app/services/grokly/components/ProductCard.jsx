/**
 * ProductCard Component
 * Displays individual product with add-to-cart functionality
 * @version 1.0.0
 */

'use client';

import { memo, useState, useEffect } from 'react';
import { Zap, Star, Sparkles, Heart } from 'lucide-react';
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
 * Get Unsplash image URL based on product category and index
 * Uses direct Unsplash photo URLs for reliability
 * @param {string} productId - Product ID
 * @param {string} category - Product category
 * @returns {string} Unsplash image URL
 */
const getProductImage = (productId, category) => {
  // Map of category to Grofers CDN product images
  const categoryImages = {
    'vegetables-fruits': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10590a.jpg', // tomato
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/17553a.jpg', // onion
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10184a.jpg', // banana
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/13107a.jpg', // apple
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10185a.jpg', // mango
    ],
    'dairy-breakfast': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483840a.jpg', // milk
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/1254a.jpg',   // butter
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/90349a.jpg',  // curd
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/1303a.jpg',   // cheese
    ],
    'munchies': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483608a.jpg', // chips
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483610a.jpg', // biscuits
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483612a.jpg', // snacks
    ],
    'cold-drinks': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483600a.jpg', // cola
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483602a.jpg', // juice
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483604a.jpg', // water
    ],
    'instant-frozen': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483560a.jpg', // noodles
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483562a.jpg', // frozen food
    ],
    'tea-coffee': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483620a.jpg', // tea
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483622a.jpg', // coffee
    ],
    'bakery-biscuits': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483580a.jpg', // biscuits
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/90072a.jpg',  // bread
    ],
    'sweet-tooth': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483590a.jpg', // chocolate
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483592a.jpg', // candy
    ],
    'masala-oil': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483636a.jpg', // oil
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483638a.jpg', // masala
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483640a.jpg', // garam masala
    ],
    'organic-healthy': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483648a.jpg', // green tea
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/574396a.jpg', // protein shake
    ],
    'atta-rice-dal': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483630a.jpg', // atta
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483632a.jpg', // rice
    ],
    'sauces-spreads': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483642a.jpg', // ketchup
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483646a.jpg', // nutella
    ],
    'cleaning': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483660a.jpg', // dishwash
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483662a.jpg', // toilet cleaner
    ],
    'personal-care': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483666a.jpg', // toothpaste
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483668a.jpg', // soap
    ],
    'pharma-wellness': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483656a.jpg', // antiseptic
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483658a.jpg', // vicks
    ],
    'baby-care': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483652a.jpg', // diapers
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483654a.jpg', // cerelac
    ],
    'pet-care': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483670a.jpg', // dog food
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483672a.jpg', // cat food
    ],
    'home-office': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483664a.jpg', // scrub pad
    ],
    'default': [
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10590a.jpg',
      'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483840a.jpg',
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
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('grokly_wishlist');
      if (stored) {
        const list = JSON.parse(stored);
        setIsWishlisted(list.some(item => item.id === product.id));
      }
    } catch (e) { /* noop */ }
  }, [product.id]);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    try {
      const stored = localStorage.getItem('grokly_wishlist');
      let list = stored ? JSON.parse(stored) : [];
      if (isWishlisted) {
        list = list.filter(item => item.id !== product.id);
      } else {
        list.push({ id: product.id });
      }
      localStorage.setItem('grokly_wishlist', JSON.stringify(list));
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
        <img 
          className={styles.pimg} 
          src={imgUrl} 
          alt={`${product.name} - ${product.brand}`}
          loading="lazy"
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
