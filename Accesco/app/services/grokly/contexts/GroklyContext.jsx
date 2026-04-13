/**
 * Grokly Context - Global State Management
 * Manages cart, location, and UI state for Grokly module
 * @version 1.0.0
 */

'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// Create Context
const GroklyContext = createContext(undefined);

// Local Storage Keys
const STORAGE_KEYS = {
  CART: 'grokly_cart',
  LOCATION: 'grokly_location',
};

/**
 * GroklyProvider Component
 * Wraps the application and provides global state
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export function GroklyProvider({ children }) {
  // ═══════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════
  
  const [cart, setCart] = useState({});
  const [location, setLocation] = useState('Koramangala, Bangalore');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ═══════════════════════════════════════════════
  // INITIALIZATION - Load from localStorage
  // ═══════════════════════════════════════════════
  
  useEffect(() => {
    try {
      // Load cart from localStorage
      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      }

      // Load location from localStorage
      const savedLocation = localStorage.getItem(STORAGE_KEYS.LOCATION);
      if (savedLocation) {
        setLocation(savedLocation);
      }
    } catch (error) {
      console.error('[GroklyContext] Error loading from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ═══════════════════════════════════════════════
  // PERSISTENCE - Save to localStorage
  // ═══════════════════════════════════════════════
  
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      } catch (error) {
        console.error('[GroklyContext] Error saving cart to localStorage:', error);
      }
    }
  }, [cart, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEYS.LOCATION, location);
      } catch (error) {
        console.error('[GroklyContext] Error saving location to localStorage:', error);
      }
    }
  }, [location, isLoading]);

  // ═══════════════════════════════════════════════
  // CART OPERATIONS
  // ═══════════════════════════════════════════════
  
  /**
   * Add product to cart
   * @param {string} productId - Product ID
   */
  const addToCart = useCallback((productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  }, []);

  /**
   * Remove product from cart completely
   * @param {string} productId - Product ID
   */
  const removeFromCart = useCallback((productId) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  }, []);

  /**
   * Increment product quantity
   * @param {string} productId - Product ID
   */
  const incrementQuantity = useCallback((productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  }, []);

  /**
   * Decrement product quantity (removes if quantity becomes 0)
   * @param {string} productId - Product ID
   */
  const decrementQuantity = useCallback((productId) => {
    setCart(prev => {
      const newCart = { ...prev };
      const currentQty = newCart[productId] || 0;
      
      if (currentQty > 1) {
        newCart[productId] = currentQty - 1;
      } else {
        delete newCart[productId];
      }
      
      return newCart;
    });
  }, []);

  /**
   * Update product quantity directly
   * @param {string} productId - Product ID
   * @param {number} quantity - New quantity
   */
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev => ({
        ...prev,
        [productId]: quantity
      }));
    }
  }, [removeFromCart]);

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(() => {
    setCart({});
  }, []);

  /**
   * Get quantity of a specific product in cart
   * @param {string} productId - Product ID
   * @returns {number} Quantity
   */
  const getProductQuantity = useCallback((productId) => {
    return cart[productId] || 0;
  }, [cart]);

  // ═══════════════════════════════════════════════
  // CART COMPUTED VALUES
  // ═══════════════════════════════════════════════
  
  /**
   * Total number of items in cart
   */
  const cartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  /**
   * Check if cart is empty
   */
  const isCartEmpty = useMemo(() => {
    return cartCount === 0;
  }, [cartCount]);

  /**
   * Get cart items as array
   * @returns {Array<{productId: string, quantity: number}>}
   */
  const cartItems = useMemo(() => {
    return Object.entries(cart).map(([productId, quantity]) => ({
      productId,
      quantity
    }));
  }, [cart]);

  // ═══════════════════════════════════════════════
  // LOCATION OPERATIONS
  // ═══════════════════════════════════════════════
  
  /**
   * Update delivery location
   * @param {string} newLocation - New location string
   */
  const updateLocation = useCallback((newLocation) => {
    setLocation(newLocation);
  }, []);

  // ═══════════════════════════════════════════════
  // UI STATE OPERATIONS
  // ═══════════════════════════════════════════════
  
  /**
   * Toggle cart drawer
   */
  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);

  /**
   * Open cart drawer
   */
  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  /**
   * Close cart drawer
   */
  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  /**
   * Toggle location modal
   */
  const toggleLocationModal = useCallback(() => {
    setIsLocationModalOpen(prev => !prev);
  }, []);

  /**
   * Open location modal
   */
  const openLocationModal = useCallback(() => {
    setIsLocationModalOpen(true);
  }, []);

  /**
   * Close location modal
   */
  const closeLocationModal = useCallback(() => {
    setIsLocationModalOpen(false);
  }, []);

  // ═══════════════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════════════
  
  const value = useMemo(() => ({
    // Cart State
    cart,
    cartCount,
    isCartEmpty,
    cartItems,
    
    // Cart Operations
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    updateQuantity,
    clearCart,
    getProductQuantity,
    
    // Location State
    location,
    updateLocation,
    
    // UI State
    isCartOpen,
    isLocationModalOpen,
    
    // UI Operations
    toggleCart,
    openCart,
    closeCart,
    toggleLocationModal,
    openLocationModal,
    closeLocationModal,
    
    // Loading State
    isLoading,
  }), [
    cart,
    cartCount,
    isCartEmpty,
    cartItems,
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    updateQuantity,
    clearCart,
    getProductQuantity,
    location,
    updateLocation,
    isCartOpen,
    isLocationModalOpen,
    toggleCart,
    openCart,
    closeCart,
    toggleLocationModal,
    openLocationModal,
    closeLocationModal,
    isLoading,
  ]);

  return (
    <GroklyContext.Provider value={value}>
      {children}
    </GroklyContext.Provider>
  );
}

/**
 * useGrokly Hook
 * Access Grokly context in components
 * 
 * @returns {Object} Grokly context value
 * @throws {Error} If used outside GroklyProvider
 */
export function useGrokly() {
  const context = useContext(GroklyContext);
  
  if (context === undefined) {
    throw new Error('useGrokly must be used within a GroklyProvider');
  }
  
  return context;
}

/**
 * useCart Hook
 * Convenience hook for cart-specific operations
 * 
 * @returns {Object} Cart state and operations
 */
export function useCart() {
  const {
    cart,
    cartCount,
    isCartEmpty,
    cartItems,
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    updateQuantity,
    clearCart,
    getProductQuantity,
  } = useGrokly();

  return {
    cart,
    cartCount,
    isCartEmpty,
    cartItems,
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    updateQuantity,
    clearCart,
    getProductQuantity,
  };
}

/**
 * useLocation Hook
 * Convenience hook for location operations
 * 
 * @returns {Object} Location state and operations
 */
export function useLocation() {
  const {
    location,
    updateLocation,
    isLocationModalOpen,
    toggleLocationModal,
    openLocationModal,
    closeLocationModal,
  } = useGrokly();

  return {
    location,
    updateLocation,
    isLocationModalOpen,
    toggleLocationModal,
    openLocationModal,
    closeLocationModal,
  };
}

export default GroklyContext;
