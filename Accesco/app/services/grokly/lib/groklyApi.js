/**
 * Grokly API Service
 * API calls and data fetching functions
 * @version 1.0.0
 */

/**
 * API Base URL
 * In production, this would be an environment variable
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Fetch products from API
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Products array
 */
export async function fetchProducts(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/products?${queryString}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('[API] Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object|null>} Product object
 */
export async function fetchProductById(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    const data = await response.json();
    return data.product || null;
  } catch (error) {
    console.error('[API] Error fetching product:', error);
    return null;
  }
}

/**
 * Search products
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching products
 */
export async function searchProducts(query) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('[API] Error searching products:', error);
    return [];
  }
}

/**
 * Fetch categories
 * @returns {Promise<Array>} Categories array
 */
export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('[API] Error fetching categories:', error);
    return [];
  }
}

/**
 * Create order
 * @param {Object} orderData - Order data
 * @returns {Promise<Object>} Order response
 */
export async function createOrder(orderData) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[API] Error creating order:', error);
    throw error;
  }
}

/**
 * Fetch user orders
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Orders array
 */
export async function fetchUserOrders(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/orders`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    
    const data = await response.json();
    return data.orders || [];
  } catch (error) {
    console.error('[API] Error fetching orders:', error);
    return [];
  }
}

/**
 * Check delivery availability
 * @param {string} pincode - Delivery pincode
 * @returns {Promise<Object>} Availability data
 */
export async function checkDeliveryAvailability(pincode) {
  try {
    const response = await fetch(`${API_BASE_URL}/delivery/check?pincode=${pincode}`);
    
    if (!response.ok) {
      throw new Error('Failed to check delivery availability');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[API] Error checking delivery:', error);
    return { available: false };
  }
}

/**
 * Apply coupon code
 * @param {string} code - Coupon code
 * @param {number} cartTotal - Cart total amount
 * @returns {Promise<Object>} Coupon data
 */
export async function applyCoupon(code, cartTotal) {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, cartTotal }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to apply coupon');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[API] Error applying coupon:', error);
    throw error;
  }
}

/**
 * Fetch available coupons
 * @returns {Promise<Array>} Coupons array
 */
export async function fetchAvailableCoupons() {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch coupons');
    }
    
    const data = await response.json();
    return data.coupons || [];
  } catch (error) {
    console.error('[API] Error fetching coupons:', error);
    return [];
  }
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data
 * @returns {Promise<Object>} Updated profile
 */
export async function updateUserProfile(userId, profileData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[API] Error updating profile:', error);
    throw error;
  }
}

/**
 * Track order
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order tracking data
 */
export async function trackOrder(orderId) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/track`);
    
    if (!response.ok) {
      throw new Error('Failed to track order');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[API] Error tracking order:', error);
    return null;
  }
}
