/**
 * Grokly Helper Functions
 * Utility functions for Grokly module
 * @version 1.0.0
 */

/**
 * Format currency to Indian Rupees
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  return `₹${amount.toFixed(2)}`;
}

/**
 * Calculate discount percentage
 * @param {number} mrp - Maximum Retail Price
 * @param {number} price - Selling price
 * @returns {number} Discount percentage
 */
export function calculateDiscount(mrp, price) {
  if (mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

/**
 * Calculate delivery fee based on cart total
 * @param {number} cartTotal - Total cart amount
 * @param {number} freeDeliveryThreshold - Minimum amount for free delivery
 * @param {number} deliveryCharge - Standard delivery charge
 * @returns {number} Delivery fee
 */
export function calculateDeliveryFee(
  cartTotal, 
  freeDeliveryThreshold = 199, 
  deliveryCharge = 19
) {
  return cartTotal >= freeDeliveryThreshold ? 0 : deliveryCharge;
}

/**
 * Calculate total savings
 * @param {Array} cartItems - Array of cart items with product and quantity
 * @returns {number} Total savings amount
 */
export function calculateSavings(cartItems) {
  return cartItems.reduce((total, { product, quantity }) => {
    const itemSaving = (product.mrp - product.price) * quantity;
    return total + itemSaving;
  }, 0);
}

/**
 * Format delivery time
 * @param {number} minutes - Delivery time in minutes
 * @returns {string} Formatted delivery time
 */
export function formatDeliveryTime(minutes) {
  if (minutes < 60) {
    return `${minutes} MINS`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}H ${mins}M` : `${hours}H`;
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if product is in stock
 * @param {Object} product - Product object
 * @returns {boolean} Stock status
 */
export function isInStock(product) {
  return product.inStock !== false;
}

/**
 * Get product availability message
 * @param {Object} product - Product object
 * @returns {string} Availability message
 */
export function getAvailabilityMessage(product) {
  if (product.inStock === false) {
    return 'Out of stock';
  }
  if (product.stock && product.stock < 10) {
    return `Only ${product.stock} left`;
  }
  return 'In stock';
}

/**
 * Validate pincode (Indian format)
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} Validation result
 */
export function validatePincode(pincode) {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
}

/**
 * Format phone number (Indian format)
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
  }
  return phone;
}

/**
 * Calculate estimated delivery time
 * @param {string} location - Delivery location
 * @returns {string} Estimated delivery time
 */
export function getEstimatedDeliveryTime(location) {
  // Simplified logic - in production, this would call an API
  const baseTime = 11;
  const randomVariation = Math.floor(Math.random() * 5);
  return `${baseTime + randomVariation} mins`;
}

/**
 * Group products by category
 * @param {Array} products - Products array
 * @returns {Object} Products grouped by category
 */
export function groupByCategory(products) {
  return products.reduce((acc, product) => {
    const category = product.cat || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});
}

/**
 * Calculate cart summary
 * @param {Array} cartItems - Cart items with product and quantity
 * @returns {Object} Cart summary with totals
 */
export function calculateCartSummary(cartItems) {
  const subtotal = cartItems.reduce((sum, { product, quantity }) => 
    sum + (product.price * quantity), 0
  );
  
  const savings = calculateSavings(cartItems);
  const deliveryFee = calculateDeliveryFee(subtotal);
  const handlingFee = 2;
  const total = subtotal + deliveryFee + handlingFee;
  
  return {
    subtotal,
    savings,
    deliveryFee,
    handlingFee,
    total,
    itemCount: cartItems.reduce((sum, { quantity }) => sum + quantity, 0),
  };
}
