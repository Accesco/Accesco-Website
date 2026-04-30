/**
 * ProductCard Component
 * Displays individual product with add-to-cart functionality
 * @version 1.0.0
 */

'use client';

import { memo } from 'react';
import { Zap, Star, Sparkles } from 'lucide-react';
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
  // Map of category to Unsplash photo collections
  const categoryImages = {
    'vegetables-fruits': [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=300&fit=crop', // vegetables
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&h=300&fit=crop', // tomatoes
      'https://images.unsplash.com/photo-1587049352846-4a222e784422?w=300&h=300&fit=crop', // fruits
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&h=300&fit=crop', // fresh produce
      'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=300&h=300&fit=crop', // bananas
    ],
    'dairy-breakfast': [
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop', // milk
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=300&fit=crop', // dairy
      'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&h=300&fit=crop', // butter
      'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=300&h=300&fit=crop', // cheese
    ],
    'munchies': [
      'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&h=300&fit=crop', // chips
      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=300&fit=crop', // snacks
      'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=300&h=300&fit=crop', // crackers
    ],
    'cold-drinks': [
      'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=300&h=300&fit=crop', // drinks
      'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300&h=300&fit=crop', // beverages
      'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&h=300&fit=crop', // juice
    ],
    'instant-frozen': [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop', // pizza
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop', // food
    ],
    'tea-coffee': [
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=300&h=300&fit=crop', // coffee
      'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=300&h=300&fit=crop', // tea
    ],
    'bakery-biscuits': [
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop', // cookies
      'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=300&h=300&fit=crop', // bread
    ],
    'sweet-tooth': [
      'https://images.unsplash.com/photo-1511381939415-e44015466834?w=300&h=300&fit=crop', // chocolate
      'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=300&h=300&fit=crop', // candy
    ],
    'default': [
      'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=300&h=300&fit=crop', // grocery
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop', // products
    ]
  };

  // Get images for category or use default
  const images = categoryImages[category] || categoryImages['default'];
  
  // Use product ID hash to consistently select an image
  const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % images.length;
  
  return images[index];
};

/**
 * Get product emoji based on category (fallback)
 * @param {string} category - Product category
 * @returns {string} Emoji
 */
const getCategoryEmoji = (category) => {
  const emojiMap = {
    'vegetables-fruits': '🥬',
    'dairy-breakfast': '🥛',
    'munchies': '🍿',
    'cold-drinks': '🥤',
    'instant-frozen': '🍕',
    'tea-coffee': '☕',
    'bakery-biscuits': '🍪',
    'sweet-tooth': '🍫',
    'atta-rice-dal': '🌾',
    'masala-oil': '🌶️',
    'sauces-spreads': '🍯',
    'organic-healthy': '🥗',
    'baby-care': '👶',
    'pharma-wellness': '💊',
    'cleaning': '🧹',
    'home-office': '🏠',
    'personal-care': '🧴',
    'pet-care': '🐾'
  };
  return emojiMap[category] || '🛒';
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
 * @param {string} props.product.image - Image URL
 * @param {string} props.product.category - Product category
 * @param {Array<string>} [props.product.tags] - Product tags
 * @param {number} props.product.rating - Rating (0-5)
 */
function ProductCard({ product }) {
  const { getProductQuantity, addToCart, incrementQuantity, decrementQuantity } = useCart();
  
  const quantity = getProductQuantity(product.id);
  const stars = generateStars(product.rating);
  const categoryEmoji = getCategoryEmoji(product.category);
  const imageUrl = getProductImage(product.id, product.category);

  /**
   * Handle image error - show emoji fallback
   */
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'flex';
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
          <Zap size={12} aria-hidden="true" /> Best
        </div>
      )}

      {/* Premium Badge */}
      {product.tags?.includes("Premium") && (
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
        <img 
          className={styles.pimg} 
          src={imageUrl} 
          alt={`${product.name} - ${product.brand}`}
          loading="lazy"
          onError={handleImageError}
        />
        <div className={styles.pimgPlaceholder} style={{ display: 'none' }}>
          <span className={styles.pimgEmoji}>{categoryEmoji}</span>
        </div>
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
