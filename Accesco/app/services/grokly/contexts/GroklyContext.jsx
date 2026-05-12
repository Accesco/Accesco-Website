'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const GroklyContext = createContext();

const CART_STORAGE_KEY = 'grokly_cart';
const ORDERS_STORAGE_KEY = 'grokly_orders';
const LOCATION_STORAGE_KEY = 'userLocation';

export function GroklyProvider({ children }) {
  const [cart, setCart] = useState({}); // id -> quantity mapping for compatibility
  const [orders, setOrders] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [location, setLocation] = useState('Koramangala');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      const savedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
      
      if (savedCart) setCart(JSON.parse(savedCart));
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

  const updateLocation = (newLocation) => setLocation(newLocation);
  const openLocationModal = () => setIsLocationModalOpen(true);
  const closeLocationModal = () => setIsLocationModalOpen(false);

  const placeOrder = (orderDetails) => {
    // Note: orderDetails should include the items if they want to snapshot them
    const newOrder = {
      id: `GRK-${Date.now()}`,
      status: 'PLACED',
      timestamp: new Date().toISOString(),
      venture: 'Grokly',
      ...orderDetails
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart({});
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
