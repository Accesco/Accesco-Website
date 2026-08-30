'use client';

import { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../../../components/AuthProvider';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateUserFieldsInFirebase, updateWalletBalanceInFirebase } from '@/lib/userService';

const GroklyContext = createContext();

const CART_STORAGE_KEY = 'grokly_cart';
const ORDERS_STORAGE_KEY = 'grokly_orders';
const LOCATION_STORAGE_KEY = 'userLocation';
const DEVICE_ID_KEY = 'grokly_device_id';

function getDeviceId() {
  if (typeof window === 'undefined') return null;
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = `device_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

// Calls the authenticated Grokly cart backend (app/api/grokly/cart/**),
// mirroring contexts/CartContext.jsx's cartFetch helper for InstaStyle.
// Returns null (instead of throwing) when there's no live session, so
// callers can fall back to local-only behaviour for guests.
async function groklyCartFetch(getIdToken, uid, path, options = {}) {
  const token = await getIdToken();
  if (!token) return null;

  const res = await fetch(`/api/grokly/cart${path}`, {
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

export function GroklyProvider({ children }) {
  const { user, getIdToken } = useAuth();
  // Hydrate synchronously from localStorage to avoid empty flashes during navigation
  const readInitialCart = () => {
    if (typeof window === 'undefined') return {};
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (!savedCart) return {};
      const parsed = JSON.parse(savedCart);
      if (Array.isArray(parsed)) {
        const mapped = parsed.reduce((acc, item) => {
          if (!item) return acc;
          if (typeof item === 'string') {
            acc[item] = (acc[item] || 0) + 1;
          } else if (item.id) {
            acc[item.id] = (acc[item.id] || 0) + (item.quantity || 1);
          }
          return acc;
        }, {});
        return mapped;
      } else if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch (e) {
      // ignore and fallthrough to empty
    }
    return {};
  };

  const readInitialOrders = () => {
    if (typeof window === 'undefined') return [];
    try {
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!savedOrders) return [];
      const parsedOrders = JSON.parse(savedOrders);
      if (Array.isArray(parsedOrders)) return parsedOrders;
      if (parsedOrders && typeof parsedOrders === 'object') {
        if (parsedOrders.id) return [parsedOrders];
        const vals = Object.values(parsedOrders);
        if (vals.length && (vals[0].id || vals[0].status || vals[0].timestamp)) return vals;
      }
    } catch (e) {}
    return [];
  };

  const readInitialLocation = () => {
    if (typeof window === 'undefined') return 'Koramangala';
    try {
      const savedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (!savedLocation) return 'Koramangala';
      let parsedLocation = null;
      try { parsedLocation = JSON.parse(savedLocation); } catch (e) { return savedLocation; }
      const resolvedName =
        parsedLocation?.displayAddress ||
        (parsedLocation?.city
          ? `${parsedLocation.city}${parsedLocation?.state || parsedLocation?.region ? `, ${parsedLocation.state || parsedLocation.region}` : ''}`
          : '') ||
        parsedLocation?.name ||
        parsedLocation?.address ||
        parsedLocation?.fullAddress;
      return resolvedName || 'Koramangala';
    } catch (e) {
      return 'Koramangala';
    }
  };

  const [cart, setCart] = useState({}); // starts empty for SSR safety
  const [orders, setOrders] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [location, setLocation] = useState('Koramangala');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [cartHydrated, setCartHydrated] = useState(false);
  // Reverse Commerce: items user has selected to return packaging for
  const [returnItems, setReturnItems] = useState([]);

  // Track hydration — skip the first write so we never overwrite the real cart with an empty SSR value
  const isHydrated = useRef(false);

  // Fetch orders from backend Firestore on mount/user change
  useEffect(() => {
    const fetchOrders = async () => {
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

        const res = await fetch(`/api/grokly/orders?${queryParam}`, { headers: authHeaders });
        if (res.ok) {
          const data = await res.json();
          if (data.orders) {
            setOrders(data.orders);
          }
        }
      } catch (err) {
        console.error('[GroklyContext] Failed to sync orders from backend:', err);
      }
    };
    fetchOrders();
  }, [user]);

  // Show location modal if no location is saved (cart & orders already loaded via useState lazy initializer above)
  useEffect(() => {
    try {
      const savedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (!savedLocation) {
        setIsLocationModalOpen(true);
        return;
      }
      let parsedLocation = null;
      try {
        parsedLocation = JSON.parse(savedLocation);
      } catch (e) {
        // Plain string stored — already resolved in readInitialLocation, no modal needed
        return;
      }
      const resolvedName =
        parsedLocation?.displayAddress ||
        (parsedLocation?.city
          ? `${parsedLocation.city}${parsedLocation?.state || parsedLocation?.region ? `, ${parsedLocation.state || parsedLocation.region}` : ''}`
          : '') ||
        parsedLocation?.name ||
        parsedLocation?.address ||
        parsedLocation?.fullAddress;
      if (!resolvedName) setIsLocationModalOpen(true);
    } catch (e) {
      console.error('Failed to check location for Grokly:', e);
    }
  }, []);

  // Fetch cart on mount/user change. Authenticated users' cart now comes
  // from the real backend (app/api/grokly/cart) instead of the client-SDK
  // grokly_carts/{identifier} mirror — that mirror had no server-side
  // ownership enforcement of its own (identifier was just whatever the
  // client claimed), and this is also what makes the cart visible to the
  // unified /cart page's product/price lookups going forward. Guests keep
  // the existing device-id-based Firestore mirror unchanged.
  useEffect(() => {
    const loadCart = async () => {
      // 1. Always load from localStorage first so the user has immediate access to local items
      const initialLocal = readInitialCart();
      if (initialLocal && Object.keys(initialLocal).length > 0) {
        setCart(initialLocal);
      }

      if (!user?.uid) {
        // Guest: unchanged behaviour — Firestore-by-device mirror via the client SDK.
        const identifier = getDeviceId();
        if (identifier) {
          try {
            const docSnap = await getDoc(doc(db, 'grokly_carts', identifier));
            if (docSnap.exists()) {
              const remoteCart = docSnap.data()?.cart;
              if (remoteCart && typeof remoteCart === 'object') {
                setCart(remoteCart);
              }
            }
          } catch (err) {
            console.error('[GroklyContext] Failed to load guest cart from Firestore:', err);
          }
        }
        isHydrated.current = true;
        setCartHydrated(true);
        return;
      }

      try {
        const data = await groklyCartFetch(getIdToken, user.uid, '', { method: 'GET' });
        if (data) {
          const remoteCart = {};
          (data.items || []).forEach((item) => {
            remoteCart[item.productId] = item.quantity;
          });
          setCart(remoteCart);
          isHydrated.current = true;
          setCartHydrated(true);
          return;
        }
      } catch (err) {
        console.warn('[GroklyContext] Cart backend read failed, falling back to local:', err?.message || err);
      }

      isHydrated.current = true;
      setCartHydrated(true);
    };

    loadCart();
  }, [user, getIdToken]);

  // Save cart to localStorage always. Authenticated users' carts are kept
  // in sync with the real backend via the granular add/remove/update calls
  // below (see addToCart/decrementQuantity/removeFromCart/clearCart), so
  // the bulk grokly_carts Firestore mirror here is guest-only now.
  useEffect(() => {
    if (!isHydrated.current) return;

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

    if (user?.uid) return;

    const saveCartToFirestore = async () => {
      const identifier = user?.email || getDeviceId();
      if (!identifier) return;

      try {
        await setDoc(doc(db, 'grokly_carts', identifier), {
          cart,
          updatedAt: Date.now(),
        });
      } catch (err) {
        console.error('[GroklyContext] Failed to save cart to Firestore:', err);
      }
    };

    saveCartToFirestore();
  }, [cart, user]);

  const cartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const getProductQuantity = (productId) => cart[productId] || 0;

  // Every mutator below updates local state immediately (optimistic — the
  // UI never waits on a network round trip), then fires a best-effort
  // background sync to the real backend cart for authenticated users,
  // mirroring contexts/CartContext.jsx's addToCart/removeFromCart/
  // updateQuantity pattern for InstaStyle. Failures are logged, not
  // reverted — the eventual next hydration (see the fetch effect above)
  // reconciles from the backend's own state.
  const addToCart = (productId, quantity = 1) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + quantity
    }));

    if (user?.uid) {
      groklyCartFetch(getIdToken, user.uid, '/items', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      }).catch((err) => console.error('[GroklyContext] Backend add-to-cart failed:', err?.message || err));
    }
  };

  const incrementQuantity = (productId) => addToCart(productId, 1);
  const decrementQuantity = (productId) => {
    let nextQuantity = 0;
    setCart(prev => {
      const newQty = (prev[productId] || 0) - 1;
      nextQuantity = Math.max(0, newQty);
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: newQty };
    });

    if (user?.uid) {
      const sync = nextQuantity > 0
        ? groklyCartFetch(getIdToken, user.uid, `/items/${encodeURIComponent(productId)}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity: nextQuantity }),
          })
        : groklyCartFetch(getIdToken, user.uid, `/items/${encodeURIComponent(productId)}`, { method: 'DELETE' });
      sync.catch((err) => console.error('[GroklyContext] Backend quantity update failed:', err?.message || err));
    }
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });

    if (user?.uid) {
      groklyCartFetch(getIdToken, user.uid, `/items/${encodeURIComponent(productId)}`, { method: 'DELETE' })
        .catch((err) => console.error('[GroklyContext] Backend remove-from-cart failed:', err?.message || err));
    }
  };

  const clearCart = () => {
    setCart({});

    if (user?.uid) {
      groklyCartFetch(getIdToken, user.uid, '', { method: 'DELETE' })
        .catch((err) => console.error('[GroklyContext] Backend clear-cart failed:', err?.message || err));
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const updateLocation = async (newLocation) => {
    const locationText =
      typeof newLocation === 'object'
        ? newLocation.fullAddress ||
          newLocation.displayAddress ||
          newLocation.address ||
          'Unknown Location'
        : newLocation;

    setLocation(locationText);

    if (user?.uid) {
      const locObject = typeof newLocation === 'object' ? newLocation : { displayAddress: locationText, fullAddress: locationText };
      await updateUserFieldsInFirebase(user.uid, { selectedLocation: locObject });
    }
  };
  const openLocationModal = () => setIsLocationModalOpen(true);
  const closeLocationModal = () => setIsLocationModalOpen(false);

  useEffect(() => {
    if (isCartOpen || isLocationModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen, isLocationModalOpen]);

  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: `GRK-${Date.now()}`,
      status: 'PLACED',
      timestamp: new Date().toISOString(),
      venture: 'Grokly',
      userId: orderDetails.userId || user?.uid || null,
      customerEmail: orderDetails.customerEmail || user?.email || null,
      customerName: orderDetails.customerName || user?.name || user?.displayName || 'Accesco Customer',
      deviceId: getDeviceId(),
      ...orderDetails
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart({});

    // Persist to backend (non-blocking — local state already updated). Order
    // creation now requires auth (see app/api/grokly/orders), so this is
    // wrapped in an async IIFE to await the id token without making
    // placeOrder itself async — it still returns newOrder synchronously.
    const emailToUse = newOrder.customerEmail;
    (async () => {
      const headers = { 'Content-Type': 'application/json' };
      if (user?.uid) {
        const token = await getIdToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
          headers['x-user-id'] = user.uid;
        }
      }
      return fetch('/api/grokly/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({ order: newOrder, customerEmail: emailToUse }),
      });
    })().catch(err => console.error('[GroklyContext] Backend order sync failed:', err));

    return newOrder;
  };

  // Simulate order progress
  useEffect(() => {
    if (orders.length === 0) return;
    
    const interval = setInterval(() => {
      setOrders(prev => {
        let hasChanged = false;
        const updated = prev.map(order => {
          if (order.status === 'DELIVERED') return order;
          
          const age = (Date.now() - new Date(order.timestamp).getTime()) / 1000;
          let nextStatus = order.status;
          
          if (age > 60) nextStatus = 'DELIVERED';
          else if (age > 40) nextStatus = 'OUT_FOR_DELIVERY';
          else if (age > 20) nextStatus = 'PACKING';
          else if (age > 5) nextStatus = 'CONFIRMED';
          
          if (nextStatus !== order.status) {
            hasChanged = true;
            
            // Sync status to backend. This simulated-progress sync is the
            // order's own owner updating their own order, so it needs the
            // same owner auth headers as everywhere else (see
            // app/api/grokly/orders PATCH, which checks the caller owns the
            // order rather than requiring admin).
            (async () => {
              const headers = { 'Content-Type': 'application/json' };
              if (user?.uid) {
                const token = await getIdToken();
                if (token) {
                  headers.Authorization = `Bearer ${token}`;
                  headers['x-user-id'] = user.uid;
                }
              }
              return fetch('/api/grokly/orders', {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ orderId: order.id, status: nextStatus }),
              });
            })().catch(err => console.error('[GroklyContext] Backend status sync failed:', err));

            // If the status transitioned to DELIVERED, and they opted to return packaging,
            // let's credit their green credits in localStorage!
            if (nextStatus === 'DELIVERED') {
              if (order.packagingOptIn && order.packagingBagsToReturn > 0) {
                try {
                  const bags = parseInt(order.packagingBagsToReturn) || 0;
                  const creditsEarned = bags * 10;
                  if (user?.uid && creditsEarned > 0) {
                    updateWalletBalanceInFirebase(user.uid, (user.walletBalance || 0) + creditsEarned, {
                      id: `ECO-${Date.now()}`,
                      title: 'Packaging Return Bonus',
                      type: 'credit',
                      amount: creditsEarned,
                      orderId: order.id,
                      bags,
                    });
                  }
                } catch (e) {
                  console.error('Failed to update eco stats:', e);
                }
              }
            }
            
            return { ...order, status: nextStatus };
          }
          return order;
        });
        return hasChanged ? updated : prev;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [orders]);

  return (
    <GroklyContext.Provider value={{
      cart,
      cartCount,
      cartHydrated,
      orders,
      isCartOpen,
      location,
      isLocationModalOpen,
      getProductQuantity,
      addToCart,
      incrementQuantity,
      decrementQuantity,
      removeFromCart,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      updateLocation,
      openLocationModal,
      closeLocationModal,
      placeOrder,
      returnItems,
      setReturnItems,
    }}>
      {children}
    </GroklyContext.Provider>
  );
}

export function useGrokly() {
  const context = useContext(GroklyContext);
  if (!context) throw new Error('useGrokly must be used within GroklyProvider');
  return context;
}

export const useCart = useGrokly;
