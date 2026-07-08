'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../components/AuthProvider';

const GroklyContext = createContext();

const CART_STORAGE_KEY = 'grokly_cart';
const ORDERS_STORAGE_KEY = 'grokly_orders';
const LOCATION_STORAGE_KEY = 'userLocation';

export function GroklyProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({}); // id -> quantity mapping for compatibility
  const [orders, setOrders] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [location, setLocation] = useState('Koramangala');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Fetch orders from backend Firestore if user is logged in
  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const queryParam = user.uid ? `userId=${encodeURIComponent(user.uid)}` : `email=${encodeURIComponent(user.email)}`;
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

  // Load from local storage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      const savedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
      
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          // Normalize legacy formats: support array of items or mapping
          if (Array.isArray(parsed)) {
            // array can be [ { id, quantity } ] or [id, id, ...]
            const mapped = parsed.reduce((acc, item) => {
              if (!item) return acc;
              if (typeof item === 'string') {
                acc[item] = (acc[item] || 0) + 1;
              } else if (item.id) {
                acc[item.id] = (acc[item.id] || 0) + (item.quantity || 1);
              }
              return acc;
            }, {});
            setCart(mapped);
          } else if (parsed && typeof parsed === 'object') {
            setCart(parsed);
          } else {
            setCart({});
          }
        } catch (e) {
          // Fallback: if parse fails, use raw value if it's an object
          try {
            setCart(JSON.parse(savedCart));
          } catch (err) {
            console.error('Failed to parse savedCart, resetting cart', err);
            setCart({});
          }
        }
      }
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedLocation) {
        let parsedLocation = null;
        try {
          parsedLocation = JSON.parse(savedLocation);
        } catch (e) {
          // backward compatibility: allow plain string storage
          setLocation(savedLocation);
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
        if (resolvedName) setLocation(resolvedName);
        else setIsLocationModalOpen(true);
      } else {
        setIsLocationModalOpen(true);
      }
    } catch (e) {
      console.error('Failed to load Grokly data:', e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

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

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    if (typeof window !== 'undefined') {
      try {
        const existing = localStorage.getItem(LOCATION_STORAGE_KEY);
        const parsed = existing ? JSON.parse(existing) : {};
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({
          ...parsed,
          displayAddress: newLocation,
          fullAddress: parsed.fullAddress || newLocation
        }));
      } catch (e) {
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({
          displayAddress: newLocation,
          fullAddress: newLocation
        }));
      }
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
      placeOrder
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
