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

export function GroklyProvider({ children }) {
  const { user } = useAuth();
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
        if (user) {
          queryParam = user.uid ? `userId=${encodeURIComponent(user.uid)}` : `email=${encodeURIComponent(user.email)}`;
        } else if (devId) {
          queryParam = `deviceId=${encodeURIComponent(devId)}`;
        } else {
          return;
        }

        const res = await fetch(`/api/grokly/orders?${queryParam}`);
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

  // Fetch cart from Firestore on mount/user change
  useEffect(() => {
    const loadCartFromFirestore = async () => {
      const identifier = user?.uid || user?.email || getDeviceId();
      if (!identifier) {
        isHydrated.current = true;
        setCartHydrated(true);
        return;
      }

      try {
        const docSnap = await getDoc(doc(db, 'grokly_carts', identifier));
        if (docSnap.exists()) {
          const remoteCart = docSnap.data()?.cart;
          if (remoteCart && typeof remoteCart === 'object') {
            setCart(remoteCart);
          }
        }
      } catch (err) {
        console.error('[GroklyContext] Failed to load cart from Firestore:', err);
      }
      
      isHydrated.current = true;
      setCartHydrated(true);
    };

    loadCartFromFirestore();
  }, [user]);

  // Save cart to Firestore whenever it changes
  useEffect(() => {
    if (!isHydrated.current) return;
    
    const saveCartToFirestore = async () => {
      const identifier = user?.uid || user?.email || getDeviceId();
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

  const addToCart = (productId, quantity = 1) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + quantity
    }));
  };

  const incrementQuantity = (productId) => addToCart(productId, 1);
  const decrementQuantity = (productId) => {
    setCart(prev => {
      const newQty = (prev[productId] || 0) - 1;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const clearCart = () => setCart({});

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

    // Persist to backend (non-blocking — local state already updated)
    const emailToUse = newOrder.customerEmail;
    fetch('/api/grokly/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newOrder, customerEmail: emailToUse }),
    }).catch(err => console.error('[GroklyContext] Backend order sync failed:', err));

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
            
            // Sync status to backend
            fetch('/api/grokly/orders', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: order.id, status: nextStatus }),
            }).catch(err => console.error('[GroklyContext] Backend status sync failed:', err));

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
