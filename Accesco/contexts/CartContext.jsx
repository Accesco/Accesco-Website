'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('instastyle_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('instastyle_cart', JSON.stringify(cart));
  }, [cart]);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const price = item.discountedPrice || item.price;
    return sum + (price * item.quantity);
  }, 0);

  const deliveryFee = subtotal > 0 ? (subtotal > 1000 ? 0 : 50) : 0;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + tax;

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Add item to cart
  const addToCart = (product, size, color, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && 
                item.selectedSize === size && 
                item.selectedColor === color
      );

      if (existingIndex > -1) {
        // Update quantity if item exists
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      // Add new item
      return [...prev, {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        discountedPrice: product.discountedPrice,
        image: product.images[0].url,
        selectedSize: size,
        selectedColor: color,
        quantity: quantity,
        slug: product.slug,
      }];
    });

    // Show success feedback
    return true;
  };

  // Remove item from cart
  const removeFromCart = (productId, size, color) => {
    setCart(prev => prev.filter(
      item => !(item.id === productId && 
                item.selectedSize === size && 
                item.selectedColor === color)
    ));
  };

  // Update item quantity
  const updateQuantity = (productId, size, color, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCart(prev => prev.map(item =>
      item.id === productId && 
      item.selectedSize === size && 
      item.selectedColor === color
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Toggle cart drawer
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const value = {
    cart,
    itemCount,
    subtotal,
    deliveryFee,
    tax,
    total,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
