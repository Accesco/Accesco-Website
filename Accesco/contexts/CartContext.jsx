'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CartContext = createContext();

const CART_STORAGE_KEY = 'instastyle_cart';
const WISHLIST_STORAGE_KEY = 'instastyle_wishlist';
const DEVICE_ID_KEY = 'instastyle_device_id';

function getDeviceId() {
  if (typeof window === 'undefined') return null;

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = `device_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }

    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Save wishlist locally and sync to Firestore when available
  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));

    const syncWishlist = async () => {
      const deviceId = getDeviceId();
      if (!deviceId) return;

      try {
        await setDoc(
          doc(db, 'instastyle_wishlists', deviceId),
          {
            items: wishlist,
            updatedAt: Date.now(),
          },
          { merge: true }
        );
      } catch (error) {
        // Keep local wishlist as source of truth if cloud sync fails.
        console.warn('Wishlist sync fallback to local only:', error?.message || error);
      }
    };

    syncWishlist();
  }, [wishlist]);

  useEffect(() => {
    const hydrateWishlistFromCloud = async () => {
      const deviceId = getDeviceId();
      if (!deviceId) return;

      try {
        const snapshot = await getDoc(doc(db, 'instastyle_wishlists', deviceId));
        if (!snapshot.exists()) return;

        const remoteItems = snapshot.data()?.items;
        if (Array.isArray(remoteItems) && remoteItems.length > 0) {
          setWishlist((current) => (current.length > 0 ? current : remoteItems));
        }
      } catch (error) {
        console.warn('Wishlist cloud read fallback to local only:', error?.message || error);
      }
    };

    hydrateWishlistFromCloud();
  }, []);

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

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          discountedPrice: product.discountedPrice,
          image: product.images?.[0]?.url || '',
          category: product.category,
        },
      ];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const isWishlisted = (productId) => wishlist.some((item) => item.id === productId);

  const toggleWishlist = (product) => {
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
      return false;
    }

    addToWishlist(product);
    return true;
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
    wishlist,
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
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isWishlisted,
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
