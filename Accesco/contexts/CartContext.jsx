'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
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

// Calls the authenticated InstaStyle cart backend (app/api/instastyle/cart/**).
// Returns null (instead of throwing) when there is no live Firebase session,
// so callers can fall back to local-only behaviour exactly like the rest of
// this file already does for cloud sync.
async function cartFetch(getIdToken, uid, path, options = {}) {
  const token = await getIdToken();
  if (!token) return null;

  const res = await fetch(`/api/instastyle/cart${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-user-id': uid,
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Cart request failed');
  }
  return data;
}

// Maps a backend cart item back into this file's existing cart item shape,
// so every other component that reads `item.id`/`selectedSize`/`price` etc.
// keeps working unmodified.
function backendItemToCartEntry(item) {
  return {
    id: item.productId,
    itemId: item.itemId,
    name: item.name,
    brand: item.brand,
    price: item.unitPrice,
    discountedPrice: null,
    image: item.image,
    selectedSize: item.size,
    selectedColor: item.color,
    quantity: item.quantity,
    slug: item.slug,
  };
}

export function CartProvider({ children }) {
  const { user, getIdToken } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState({}); // { productId: { size: count } }
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isHydrated = useRef(false);

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

    // Hydrate orders from cloud
    const fetchOrdersFromCloud = async () => {
      try {
        const devId = getDeviceId();
        let queryParam = '';
        let authHeaders = {};
        if (user) {
          queryParam = user.uid ? `userId=${encodeURIComponent(user.uid)}` : `email=${encodeURIComponent(user.email)}`;
          const token = await getIdToken();
          if (token) authHeaders = { Authorization: `Bearer ${token}`, 'x-user-id': user.uid };
        } else if (devId) {
          queryParam = `deviceId=${encodeURIComponent(devId)}`;
        } else {
          return;
        }

        const res = await fetch(`/api/instastyle/orders?${queryParam}`, { headers: authHeaders });
        if (res.ok) {
          const data = await res.json();
          if (data.orders) {
            setOrders(data.orders);
            return;
          }
        }
      } catch (error) {
        console.warn('Orders cloud read fallback to local only:', error);
      }

      // Fallback
      loadData(ORDERS_STORAGE_KEY, setOrders);
    };

    // Hydrate cart — authenticated users read from the validated backend cart;
    // guests keep the existing localStorage/Firestore-by-device behaviour.
    const hydrateCartFromCloud = async () => {
      if (user?.uid) {
        try {
          const data = await cartFetch(getIdToken, user.uid, '', { method: 'GET' });
          if (data) {
            setCart(data.items.map(backendItemToCartEntry));
            isHydrated.current = true;
            return;
          }
        } catch (error) {
          console.warn('Cart backend read fallback to local only:', error?.message || error);
        }
        loadData(CART_STORAGE_KEY, setCart);
        isHydrated.current = true;
        return;
      }

      const identifier = user?.email || getDeviceId();
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
  }, [user, getIdToken]);

  // Save cart to localStorage always. Authenticated users' carts are kept in
  // sync with the backend via the granular add/remove/update calls below, so
  // the raw Firestore mirror here is only needed as a guest fallback.
  useEffect(() => {
    if (!isHydrated.current) return;

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

    if (user?.uid) return;

    const syncCart = async () => {
      const identifier = user?.email || getDeviceId();
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

  // Add item to cart (optimistic local update; validated against the backend
  // in the background for authenticated users — reverted if the server
  // rejects it, e.g. out of stock).
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
        updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + quantity };
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

    if (user?.uid) {
      cartFetch(getIdToken, user.uid, '/items', {
        method: 'POST',
        body: JSON.stringify({ productId: product.id, size, color, quantity }),
      })
        .then((data) => {
          if (!data) return; // no live session — local optimistic state stands
          setCart(prev => prev.map(item =>
            item.id === product.id && item.selectedSize === size && item.selectedColor === color
              ? backendItemToCartEntry(data.item)
              : item
          ));
        })
        .catch((error) => {
          console.error('[CartContext] Backend add-to-cart rejected, reverting:', error?.message || error);
          setCart(prev => {
            const idx = prev.findIndex(item => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
            if (idx === -1) return prev;
            const revertedQty = prev[idx].quantity - quantity;
            if (revertedQty <= 0) return prev.filter((_, i) => i !== idx);
            const updated = [...prev];
            updated[idx] = { ...updated[idx], quantity: revertedQty };
            return updated;
          });
        });
    }

    // Show success feedback
    return true;
  };

  // Remove item from cart
  const removeFromCart = (productId, size, color) => {
    const removedItem = cart.find(
      item => item.id === productId && item.selectedSize === size && item.selectedColor === color
    );

    setCart(prev => prev.filter(
      item => !(item.id === productId &&
                item.selectedSize === size &&
                item.selectedColor === color)
    ));

    if (user?.uid && removedItem?.itemId) {
      cartFetch(getIdToken, user.uid, `/items/${removedItem.itemId}`, { method: 'DELETE' })
        .catch((error) => console.error('[CartContext] Backend remove-from-cart failed:', error?.message || error));
    }
  };

  // Update item quantity
  const updateQuantity = (productId, size, color, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    const targetItem = cart.find(
      item => item.id === productId && item.selectedSize === size && item.selectedColor === color
    );

    setCart(prev => prev.map(item =>
      item.id === productId &&
      item.selectedSize === size &&
      item.selectedColor === color
        ? { ...item, quantity: newQuantity }
        : item
    ));

    if (user?.uid && targetItem?.itemId) {
      cartFetch(getIdToken, user.uid, `/items/${targetItem.itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity: newQuantity }),
      })
        .then((data) => {
          if (!data) return;
          setCart(prev => prev.map(item => item.itemId === targetItem.itemId ? backendItemToCartEntry(data.item) : item));
        })
        .catch((error) => {
          console.error('[CartContext] Backend quantity update rejected, reverting:', error?.message || error);
          setCart(prev => prev.map(item =>
            item.itemId === targetItem.itemId ? { ...item, quantity: targetItem.quantity } : item
          ));
        });
    }
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);

    if (user?.uid) {
      cartFetch(getIdToken, user.uid, '', { method: 'DELETE' })
        .catch((error) => console.error('[CartContext] Backend clear-cart failed:', error?.message || error));
    }
  };

  // Re-add every item from a past order back into the cart ("Order Again").
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

    // Persist to backend (non-blocking — local state already updated).
    // Order creation now requires auth (see app/api/instastyle/orders), so
    // this fetch is wrapped in an async IIFE to await the id token first
    // without making placeOrder itself async — it still returns newOrder
    // synchronously like every other caller expects.
    const customerEmail = orderData.customerEmail || null;
    (async () => {
      const headers = { 'Content-Type': 'application/json' };
      if (user?.uid) {
        const token = await getIdToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
          headers['x-user-id'] = user.uid;
        }
      }
      return fetch('/api/instastyle/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({ order: newOrder, customerEmail }),
      });
    })().catch(err => console.error('[CartContext] Backend order sync failed:', err));

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
          inStock: product.inStock !== undefined ? product.inStock : true,
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
    reorder,
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
