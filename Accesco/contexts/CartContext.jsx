'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CartContext = createContext();

const CART_STORAGE_KEY = 'instastyle_cart';
const WISHLIST_STORAGE_KEY = 'instastyle_wishlist';
const ORDERS_STORAGE_KEY = 'instastyle_orders';
const INVENTORY_STORAGE_KEY = 'instastyle_inventory';
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
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState({}); // { productId: { size: count } }
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadData = (key, setter) => {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          setter(JSON.parse(saved));
        } catch (error) {
          console.error(`Error loading ${key}:`, error);
        }
      }
    };

    loadData(CART_STORAGE_KEY, setCart);
    loadData(WISHLIST_STORAGE_KEY, setWishlist);
    loadData(ORDERS_STORAGE_KEY, setOrders);
    loadData(INVENTORY_STORAGE_KEY, setInventory);

    // Hydrate wishlist from cloud
    const hydrateWishlistFromCloud = async () => {
      const deviceId = getDeviceId();
      if (!deviceId) return;
      try {
        const snapshot = await getDoc(doc(db, 'instastyle_wishlists', deviceId));
        if (snapshot.exists()) {
          const remoteItems = snapshot.data()?.items;
          if (Array.isArray(remoteItems) && remoteItems.length > 0) {
            setWishlist((current) => (current.length > 0 ? current : remoteItems));
          }
        }
      } catch (error) {
        console.warn('Wishlist cloud read fallback to local only:', error?.message || error);
      }
    };
    hydrateWishlistFromCloud();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  // ═══════════════════════════════════════════════
  // ETA & ORDER ACCEPTANCE SIMULATION
  // ═══════════════════════════════════════════════
  
  useEffect(() => {
    if (orders.length === 0) return;

    const simulateProgress = () => {
      setOrders(prevOrders => {
        let changed = false;
        const now = Date.now();
        
        const newOrders = prevOrders.map(order => {
          if (order.status === 'DELIVERED') return order;
          
          const orderTime = new Date(order.timestamp).getTime();
          const elapsedSeconds = (now - orderTime) / 1000;
          
          let newStatus = order.status;
          
          if (order.status === 'PLACED' && elapsedSeconds > 5) {
            newStatus = 'CONFIRMED';
          } else if (order.status === 'CONFIRMED' && elapsedSeconds > 15) {
            newStatus = 'PACKING';
          } else if (order.status === 'PACKING' && elapsedSeconds > 40) {
            newStatus = 'OUT_FOR_DELIVERY';
          } else if (order.status === 'OUT_FOR_DELIVERY' && elapsedSeconds > 80) {
            newStatus = 'DELIVERED';
          }

          if (newStatus !== order.status) {
            changed = true;
            return { ...order, status: newStatus };
          }
          return order;
        });

        return changed ? newOrders : prevOrders;
      });
    };

    const interval = setInterval(simulateProgress, 2000);
    return () => clearInterval(interval);
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory]);

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
        image: product.images?.[0]?.url || '',
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

  const placeOrder = (orderData) => {
    const newOrder = {
      id: `INS-${Date.now()}`,
      items: [...cart],
      status: 'PLACED',
      timestamp: new Date().toISOString(),
      venture: 'InstaStyle',
      ...orderData
    };
    
    // Reduce stock
    setInventory(prev => {
      const next = { ...prev };
      cart.forEach(item => {
        if (!next[item.id]) next[item.id] = {};
        const currentSizeStock = next[item.id][item.selectedSize] !== undefined ? 
                                next[item.id][item.selectedSize] : 10;
        next[item.id][item.selectedSize] = Math.max(0, currentSizeStock - item.quantity);
      });
      return next;
    });

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Persist to backend (non-blocking — local state already updated)
    const customerEmail = orderData.customerEmail || null;
    fetch('/api/instastyle/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newOrder, customerEmail }),
    }).catch(err => console.error('[CartContext] Backend order sync failed:', err));

    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
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
          image: product.image || product.images?.[0]?.url || '',
          images: product.images || (product.image ? [{ url: product.image }] : []),
          category: product.category,
          rating: product.rating,
          reviewCount: product.reviewCount,
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
    placeOrder,
    updateOrderStatus,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isWishlisted,
    toggleCart,
    openCart,
    closeCart,
    orders,
    inventory,
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
