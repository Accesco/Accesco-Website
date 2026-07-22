'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/app/components/AuthProvider';

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
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState({}); // { productId: { size: count } }
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isHydrated = useRef(false);

  const fetchOrdersFromCloud = useCallback(async () => {
    try {
      const devId = getDeviceId();
      let queryParam = '';
      if (user) {
        queryParam = user.uid ? `userId=${encodeURIComponent(user.uid)}` : `email=${encodeURIComponent(user.email)}`;
      } else if (devId) {
        queryParam = `deviceId=${encodeURIComponent(devId)}`;
      } else {
        return;
      }

      const res = await fetch(`/api/instastyle/orders?${queryParam}`);
      if (res.ok) {
        const data = await res.json();
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
          return;
        }
      }
    } catch (error) {
      console.warn('Orders cloud read fallback to local only:', error);
    }

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        try {
          setOrders(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [user]);

  // Load data from localStorage/Firestore on mount/user change
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

    loadData(WISHLIST_STORAGE_KEY, setWishlist);
    loadData(INVENTORY_STORAGE_KEY, setInventory);

    // Hydrate cart from Firestore
    const hydrateCartFromCloud = async () => {
      const identifier = user?.uid || user?.email || getDeviceId();
      if (!identifier) return;
      try {
        const snapshot = await getDoc(doc(db, 'instastyle_carts', identifier));
        if (snapshot.exists()) {
          const remoteCart = snapshot.data()?.cart;
          if (Array.isArray(remoteCart) && remoteCart.length > 0) {
            setCart(remoteCart);
            isHydrated.current = true;
            return;
          }
        }
      } catch (error) {
        console.warn('Cart cloud read fallback to local only:', error);
      }

      // Fallback
      loadData(CART_STORAGE_KEY, setCart);
      isHydrated.current = true;
    };

    // Hydrate wishlist from cloud
    const hydrateWishlistFromCloud = async () => {
      const deviceId = getDeviceId();
      if (!deviceId) return;
      try {
        const docSnap = await getDoc(doc(db, 'instastyle_wishlists', deviceId));
        if (docSnap.exists()) {
          const remoteItems = docSnap.data()?.items;
          if (Array.isArray(remoteItems) && remoteItems.length > 0) {
            setWishlist((current) => (current.length > 0 ? current : remoteItems));
          }
        }
      } catch (error) {
        console.warn('Wishlist cloud read fallback to local only:', error?.message || error);
      }
    };

    hydrateCartFromCloud();
    hydrateWishlistFromCloud();
    fetchOrdersFromCloud();
  }, [user, fetchOrdersFromCloud]);

  // Save cart to localStorage and Firestore whenever it changes
  useEffect(() => {
    if (!isHydrated.current) return;

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

    const syncCart = async () => {
      const identifier = user?.uid || user?.email || getDeviceId();
      if (!identifier) return;
      try {
        await setDoc(doc(db, 'instastyle_carts', identifier), {
          cart,
          updatedAt: Date.now(),
        }, { merge: true });
      } catch (error) {
        console.warn('Cart sync fallback to local only:', error);
      }
    };

    syncCart();
  }, [cart, user]);

  useEffect(() => {
    if (typeof window !== 'undefined' && orders.length > 0) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (orders.length === 0) return;

    const simulateProgress = () => {
      setOrders(prevOrders => {
        let changed = false;
        const now = Date.now();

        const newOrders = prevOrders.map(order => {
          if (order.status === 'DELIVERED') return order;

          const orderTime = new Date(order.timestamp || order.placedAt || Date.now()).getTime();
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

    const interval = setInterval(simulateProgress, 5000);
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
        console.warn('Wishlist sync fallback to local only:', error?.message || error);
      }
    };

    syncWishlist();
  }, [wishlist]);

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
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

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

  const clearCart = () => {
    setCart([]);
  };

  const reorder = (items) => {
    if (!Array.isArray(items) || items.length === 0) return;
    setCart(prev => {
      const next = [...prev];
      items.forEach(it => {
        const idx = next.findIndex(c =>
          c.id === it.id &&
          c.selectedSize === it.selectedSize &&
          c.selectedColor === it.selectedColor
        );
        const qty = it.quantity || 1;
        if (idx > -1) next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        else next.push({ ...it, quantity: qty });
      });
      return next;
    });
    setIsCartOpen(true);
  };

  const placeOrder = (orderData) => {
    const orderId = orderData.id || `INS-${Date.now()}`;
    const newOrder = {
      id: orderId,
      orderId: orderId,
      items: orderData.items || [...cart],
      status: orderData.status || 'CONFIRMED',
      timestamp: new Date().toISOString(),
      placedAt: new Date().toISOString(),
      venture: 'InstaStyle',
      service: 'instastyle',
      userId: orderData.userId || user?.uid || null,
      customerEmail: orderData.customerEmail || user?.email || null,
      customerName: orderData.customerName || orderData.address?.fullName || user?.name || 'Valued Customer',
      deviceId: getDeviceId(),
      ...orderData
    };

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

    const customerEmail = newOrder.customerEmail;
    fetch('/api/instastyle/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newOrder, customerEmail }),
    }).catch(err => console.error('[CartContext] Backend order sync failed:', err));

    return newOrder;
  };

  const updateOrder = (orderId, patch) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId || o.orderId === orderId ? { ...o, ...patch } : o))
    );
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(order =>
      (order.id === orderId || order.orderId === orderId) ? { ...order, status } : order
    ));
    fetch('/api/instastyle/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, newStatus: status }),
    }).catch(err => console.error('[CartContext] Status update failed:', err));
  };

  const cancelOrder = (orderId) => {
    updateOrderStatus(orderId, 'CANCELLED');
  };

  const trackOrder = (orderId) => {
    return orders.find((o) => o.id === orderId || o.orderId === orderId) || null;
  };

  const syncCloudOrders = () => {
    fetchOrdersFromCloud();
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
    reorder,
    placeOrder,
    updateOrder,
    updateOrderStatus,
    cancelOrder,
    trackOrder,
    syncCloudOrders,
    fetchOrders: fetchOrdersFromCloud,
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
