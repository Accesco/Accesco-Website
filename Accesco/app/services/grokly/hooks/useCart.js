/**
 * useCart Hook
 * Custom hook for cart management
 * @version 1.0.0
 */

import { useGrokly } from '../contexts/GroklyContext';

/**
 * useCart Hook
 * Provides cart state and operations
 * 
 * @returns {Object} Cart state and methods
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
    // State
    cart,
    cartCount,
    isCartEmpty,
    cartItems,
    
    // Methods
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    updateQuantity,
    clearCart,
    getProductQuantity,
  };
}

export default useCart;
