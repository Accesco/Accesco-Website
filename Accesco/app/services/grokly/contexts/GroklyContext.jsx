'use client';

import { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../../../components/AuthProvider';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { updateUserFieldsInFirebase, updateWalletBalanceInFirebase } from '@/lib/userService';

const GroklyContext = createContext();

function getGroklyUid(user) {
  return user?.uid || auth?.currentUser?.uid || null;
}

export function GroklyProvider({ children }) {
  const { user, uid } = useAuth();

  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [location, setLocation] = useState('Koramangala');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [cartHydrated, setCartHydrated] = useState(false);
  // Reverse Commerce: items user has selected to return packaging for
  const [returnItems, setReturnItems] = useState([]);

  // Track hydration — skip the first write so we never overwrite the real cart with an empty initial value
  const isHydrated = useRef(false);

  // Sync user location if available from Firestore profile
  useEffect(() => {
    if (user?.selectedLocation) {
      const loc = user.selectedLocation;
      const resolvedName =
        loc?.displayAddress ||
        (loc?.city ? `${loc.city}${loc?.state || loc?.region ? `, ${loc.state || loc.region}` : ''}` : '') ||
        loc?.name ||
        loc?.address ||
        loc?.fullAddress;
      if (resolvedName) {
        setLocation(resolvedName);
      }
    }
  }, [user]);

  // Fetch orders from backend Firestore on mount/user change
  useEffect(() => {
    const fetchOrders = async () => {
      const currentIdentifier = user?.uid || uid || auth?.currentUser?.uid;
      if (!currentIdentifier) return;

      try {
        let queryParam = user?.uid
          ? `userId=${encodeURIComponent(user.uid)}`
          : user?.email
          ? `email=${encodeURIComponent(user.email)}`
          : `userId=${encodeURIComponent(currentIdentifier)}`;

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
  }, [user, uid]);

  // Fetch cart from Firestore on mount/user change with onSnapshot for real-time sync
  useEffect(() => {
    const identifier = user?.uid || uid || auth?.currentUser?.uid;
    if (!identifier) {
      isHydrated.current = true;
      setCartHydrated(true);
      return;
    }

    const cartDocRef = doc(db, 'grokly_carts', identifier);
    const unsubscribe = onSnapshot(
      cartDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const remoteCart = docSnap.data()?.cart;
          if (remoteCart && typeof remoteCart === 'object' && !Array.isArray(remoteCart)) {
            setCart(remoteCart);
          }
        }
        isHydrated.current = true;
        setCartHydrated(true);
      },
      (err) => {
        console.error('[GroklyContext] Failed to listen to cart from Firestore:', err);
        isHydrated.current = true;
        setCartHydrated(true);
      }
    );

    return () => unsubscribe();
  }, [user, uid]);

  // Save cart to Firestore whenever modified
  const saveCartToFirestore = async (newCart) => {
    const identifier = user?.uid || uid || auth?.currentUser?.uid;
    if (!identifier) return;

    try {
      await setDoc(doc(db, 'grokly_carts', identifier), {
        cart: newCart,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.error('[GroklyContext] Failed to save cart to Firestore:', err);
    }
  };

  const cartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const getProductQuantity = (productId) => cart[productId] || 0;

  const addToCart = (productId, quantity = 1) => {
    setCart(prev => {
      const next = {
        ...prev,
        [productId]: (prev[productId] || 0) + quantity
      };
      saveCartToFirestore(next);
      return next;
    });
  };

  const incrementQuantity = (productId) => addToCart(productId, 1);

  const decrementQuantity = (productId) => {
    setCart(prev => {
      const newQty = (prev[productId] || 0) - 1;
      let next;
      if (newQty <= 0) {
        next = { ...prev };
        delete next[productId];
      } else {
        next = { ...prev, [productId]: newQty };
      }
      saveCartToFirestore(next);
      return next;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const next = { ...prev };
      delete next[productId];
      saveCartToFirestore(next);
      return next;
    });
  };

  const clearCart = () => {
    setCart({});
    saveCartToFirestore({});
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

    const targetUid = user?.uid || uid || auth?.currentUser?.uid;
    if (targetUid) {
      const locObject = typeof newLocation === 'object' ? newLocation : { displayAddress: locationText, fullAddress: locationText };
      await updateUserFieldsInFirebase(targetUid, { selectedLocation: locObject });
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
    const targetUid = orderDetails.userId || user?.uid || uid || auth?.currentUser?.uid || null;
    const newOrder = {
      id: `GRK-${Date.now()}`,
      status: 'PLACED',
      timestamp: new Date().toISOString(),
      venture: 'Grokly',
      userId: targetUid,
      customerEmail: orderDetails.customerEmail || user?.email || null,
      customerName: orderDetails.customerName || user?.name || user?.displayName || 'Accesco Customer',
      ...orderDetails
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Persist to backend
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
            // credit green credits in Firebase
            if (nextStatus === 'DELIVERED') {
              if (order.packagingOptIn && order.packagingBagsToReturn > 0) {
                try {
                  const bags = parseInt(order.packagingBagsToReturn) || 0;
                  const creditsEarned = bags * 10;
                  const targetUid = user?.uid || uid;
                  if (targetUid && creditsEarned > 0) {
                    updateWalletBalanceInFirebase(targetUid, (user?.walletBalance || 0) + creditsEarned, {
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
  }, [orders, user, uid]);

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

