/**
 * Swadishtt Context
 * @module contexts/SwadishttContext
 * @description Global state management for Swadishtt platform with Firestore order persistence and tracking architecture matching Grokly.
 */

'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const SwadishttContext = createContext(undefined);

const CART_STORAGE_KEY = 'swadishtt-cart';
const ORDERS_STORAGE_KEY = 'swadishtt-orders';
const DEVICE_ID_KEY = 'swadishtt_device_id';

const TARGET_ACCURACY_METERS = 50;
const ACCEPTABLE_ACCURACY_METERS = 100;
const CLIENT_CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// Client-side cache for detected locations
const locationCache = new Map();

function getDeviceId() {
  if (typeof window === 'undefined') return null;
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = `device_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

function getCachedLocation(latitude, longitude) {
  const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  const cached = locationCache.get(key);

  if (cached && Date.now() - cached.timestamp < CLIENT_CACHE_DURATION_MS) {
    const cachedAccuracy = Number(cached?.data?.coords?.accuracy);
    if (Number.isFinite(cachedAccuracy) && cachedAccuracy <= ACCEPTABLE_ACCURACY_METERS) {
      return cached.data;
    }
    locationCache.delete(key);
    return null;
  }

  if (cached) {
    locationCache.delete(key);
  }

  return null;
}

function setCachedLocation(latitude, longitude, data) {
  const accuracy = Number(data?.coords?.accuracy);
  if (!Number.isFinite(accuracy) || accuracy > ACCEPTABLE_ACCURACY_METERS) {
    return;
  }
  const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  locationCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

function getDeliveryGradePosition({
  targetAccuracy = TARGET_ACCURACY_METERS,
  acceptableAccuracy = ACCEPTABLE_ACCURACY_METERS,
  timeoutMs = 20000,
  maxAgeMs = 0,
} = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    let bestPosition = null;
    let finished = false;
    let watchId = null;
    let timeoutId = null;
    let acceptableTimeoutId = null;

    const finishSuccess = (position) => {
      if (finished) return;
      finished = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (timeoutId !== null) clearTimeout(timeoutId);
      if (acceptableTimeoutId !== null) clearTimeout(acceptableTimeoutId);
      resolve(position);
    };

    const finishError = (error) => {
      if (finished) return;
      finished = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (timeoutId !== null) clearTimeout(timeoutId);
      if (acceptableTimeoutId !== null) clearTimeout(acceptableTimeoutId);
      reject(error);
    };

    // First, try getCurrentPosition for fast initial result
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const accuracy = Number(position?.coords?.accuracy);
        bestPosition = position;

        if (Number.isFinite(accuracy) && accuracy <= targetAccuracy) {
          finishSuccess(position);
          return;
        }

        if (Number.isFinite(accuracy) && accuracy <= acceptableAccuracy) {
          acceptableTimeoutId = setTimeout(() => {
            finishSuccess(bestPosition);
          }, 3000);
        }
      },
      () => {},
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: maxAgeMs,
      }
    );

    // Use watchPosition for continuous updates
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentAccuracy = Number(position?.coords?.accuracy);
        const bestAccuracy = Number(bestPosition?.coords?.accuracy);

        if (
          !bestPosition ||
          (Number.isFinite(currentAccuracy) &&
            (!Number.isFinite(bestAccuracy) || currentAccuracy < bestAccuracy))
        ) {
          bestPosition = position;
        }

        if (Number.isFinite(currentAccuracy) && currentAccuracy <= targetAccuracy) {
          finishSuccess(position);
        }
      },
      (error) => {
        if (!bestPosition) {
          finishError(error);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: maxAgeMs,
      }
    );

    // Total fallback timeout
    timeoutId = setTimeout(() => {
      if (finished) return;
      if (bestPosition) {
        finishSuccess(bestPosition);
        return;
      }
      finishError(new Error('Unable to get location within timeout.'));
    }, timeoutMs);
  });
}

function toFiniteNumber(value) {
  const n = typeof value === 'string' ? Number(value) : value;
  return Number.isFinite(n) ? n : null;
}

function getNonEmptyString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function parseStoredUserLocationToSwadishttLocation(storedValue) {
  if (!storedValue) return null;

  let parsed = null;
  try {
    parsed = JSON.parse(storedValue);
  } catch (e) {
    parsed = storedValue;
  }

  if (typeof parsed === 'string') {
    const raw = parsed.trim();
    if (!raw) return null;
    const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);
    const area = parts[0] || raw;
    const city = parts.length > 1 ? parts.slice(1).join(', ') : '';
    return {
      area,
      city,
      coordinates: { lat: null, lng: null },
    };
  }

  if (!parsed || typeof parsed !== 'object') return null;

  const storedLatitude = toFiniteNumber(parsed?.latitude ?? parsed?.lat);
  const storedLongitude = toFiniteNumber(parsed?.longitude ?? parsed?.lon);

  const addressLabel =
    getNonEmptyString(parsed?.displayAddress) ||
    getNonEmptyString(parsed?.formattedAddress) ||
    getNonEmptyString(parsed?.fullAddress) ||
    '';
  const labelParts = addressLabel
    ? addressLabel.split(',').map((p) => p.trim()).filter(Boolean)
    : [];

  const storedArea =
    getNonEmptyString(parsed?.area) ||
    getNonEmptyString(parsed?.neighbourhood) ||
    getNonEmptyString(parsed?.suburb) ||
    getNonEmptyString(parsed?.locality) ||
    '';
  const storedCity = getNonEmptyString(parsed?.city);
  const storedRegion = getNonEmptyString(parsed?.state) || getNonEmptyString(parsed?.region);

  let area = storedArea;
  let city = storedCity || storedRegion;

  if (!area && storedCity && storedRegion) {
    area = storedCity;
    city = storedRegion;
  }

  if (!area) area = labelParts[0] || storedCity || getNonEmptyString(parsed?.name) || 'Your Location';
  if (!city) city = labelParts[1] || storedRegion || '';

  return {
    area,
    city,
    coordinates: { lat: storedLatitude, lng: storedLongitude },
  };
}

function buildUserLocationStoragePayload({
  rawPayload,
  area,
  city,
  latitude,
  longitude,
  accuracyMeters,
}) {
  const safeRaw = rawPayload && typeof rawPayload === 'object' ? rawPayload : {};

  const fullAddressFromSwadishtt = [area, city].filter(Boolean).join(', ');
  const resolvedDisplayAddress =
    getNonEmptyString(safeRaw?.displayAddress) || getNonEmptyString(city) || getNonEmptyString(area);
  const resolvedFullAddress =
    getNonEmptyString(safeRaw?.fullAddress) ||
    getNonEmptyString(safeRaw?.formattedAddress) ||
    getNonEmptyString(safeRaw?.displayAddress) ||
    fullAddressFromSwadishtt ||
    resolvedDisplayAddress;

  const resolvedLatitude = toFiniteNumber(safeRaw?.latitude) ?? latitude;
  const resolvedLongitude = toFiniteNumber(safeRaw?.longitude) ?? longitude;

  return {
    ...safeRaw,
    area: getNonEmptyString(safeRaw?.area) || area,
    city: getNonEmptyString(safeRaw?.city) || city,
    latitude: resolvedLatitude,
    longitude: resolvedLongitude,
    lat: resolvedLatitude,
    lon: resolvedLongitude,
    fullAddress: resolvedFullAddress,
    formattedAddress: getNonEmptyString(safeRaw?.formattedAddress) || resolvedFullAddress,
    displayAddress: resolvedDisplayAddress,
    gpsAccuracyMeters: Number.isFinite(Number(accuracyMeters))
      ? Math.round(Number(accuracyMeters))
      : safeRaw?.gpsAccuracyMeters,
    timestamp: safeRaw?.timestamp || new Date().toISOString(),
  };
}

export function SwadishttProvider({ children }) {
  // Cart State
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartHydrated, setCartHydrated] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);

  // User State
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState({
    area: 'Your Location',
    city: 'Detecting...',
    coordinates: { lat: null, lng: null }
  });
  const [locationLoading, setLocationLoading] = useState(true);

  const abortControllerRef = useRef(null);

  // Hydrate orders from localStorage & Cloud
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

      const res = await fetch(`/api/swadishtt/orders?${queryParam}`);
      if (res.ok) {
        const data = await res.json();
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
          return;
        }
      }
    } catch (err) {
      console.warn('[SwadishttContext] Orders cloud fetch fallback to local:', err);
    }

    // Fallback to local storage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setOrders(parsed);
        }
      } catch (e) {}
    }
  }, [user]);

  useEffect(() => {
    fetchOrdersFromCloud();
  }, [fetchOrdersFromCloud]);

  // Persist orders to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && orders.length > 0) {
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      } catch (e) {}
    }
  }, [orders]);

  const fetchLocationDetails = useCallback(async (latitude, longitude, accuracy) => {
    try {
      const response = await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude, accuracy }),
        signal: abortControllerRef.current?.signal,
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch (e) {}

      if (!response.ok) {
        const serverMessage = payload?.message || payload?.error || 'Location service returned an error.';
        throw new Error(serverMessage);
      }

      const area =
        getNonEmptyString(payload?.area) ||
        getNonEmptyString(payload?.neighbourhood) ||
        getNonEmptyString(payload?.street) ||
        getNonEmptyString(payload?.landmark) ||
        'Location';

      const city =
        getNonEmptyString(payload?.city) ||
        getNonEmptyString(payload?.state) ||
        getNonEmptyString(payload?.displayAddress) ||
        'Detected';

      const resolvedAddress =
        payload?.formattedAddress ||
        payload?.fullAddress ||
        payload?.displayAddress ||
        'Address unavailable';

      return {
        area,
        city,
        fullAddress: resolvedAddress,
        coords: {
          latitude: payload?.latitude ?? latitude,
          longitude: payload?.longitude ?? longitude,
          accuracy: Math.round(accuracy),
        },
        raw: payload,
      };
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('API fetch error:', error);
      }
      throw error;
    }
  }, []);

  const updateLocation = useCallback((newLocation, options = {}) => {
    setLocation(newLocation);

    const shouldPersist = options?.persist !== false;
    if (!shouldPersist) return;
    if (typeof window === 'undefined') return;

    try {
      const latitude = toFiniteNumber(newLocation?.coordinates?.lat);
      const longitude = toFiniteNumber(newLocation?.coordinates?.lng);
      const area = getNonEmptyString(newLocation?.area);
      const city = getNonEmptyString(newLocation?.city);

      const payloadToStore = buildUserLocationStoragePayload({
        rawPayload: options?.rawPayload,
        area,
        city,
        latitude,
        longitude,
        accuracyMeters: options?.accuracyMeters,
      });

      localStorage.setItem('userLocation', JSON.stringify(payloadToStore));
    } catch (e) {}
  }, []);

  const detectLocation = useCallback(
    async ({ silent = false } = {}) => {
      if (typeof window !== 'undefined' && !window.isSecureContext) {
        const err = new Error('Geolocation requires a secure context (HTTPS or localhost).');
        if (!silent) throw err;
        updateLocation(
          {
            area: 'Enable HTTPS',
            city: 'Required for location',
            coordinates: { lat: null, lng: null },
          },
          { persist: false }
        );
        setLocationLoading(false);
        return null;
      }

      setLocationLoading(true);
      abortControllerRef.current?.abort?.();
      abortControllerRef.current = new AbortController();

      try {
        if (navigator.permissions && navigator.permissions.query) {
          let permState = null;
          try {
            const perm = await navigator.permissions.query({ name: 'geolocation' });
            permState = perm?.state;
          } catch (e) {}

          if (permState === 'denied') {
            throw new Error(
              'Location permission is denied. Please enable location for this site in your browser settings.'
            );
          }
        }

        const position = await getDeliveryGradePosition();
        const { latitude, longitude, accuracy } = position.coords;

        const roundedAccuracy = Math.round(accuracy);
        const hasFiniteAccuracy = Number.isFinite(roundedAccuracy);
        const isAccuracyAcceptable =
          !hasFiniteAccuracy || roundedAccuracy <= ACCEPTABLE_ACCURACY_METERS;

        const cached = getCachedLocation(latitude, longitude);
        if (cached) {
          updateLocation(
            {
              area: cached.area,
              city: cached.city,
              coordinates: { lat: cached.coords.latitude, lng: cached.coords.longitude },
            },
            {
              persist: true,
              rawPayload: cached?.raw,
              accuracyMeters: cached?.coords?.accuracy,
            }
          );
          return {
            area: cached.area,
            city: cached.city,
            coordinates: { lat: cached.coords.latitude, lng: cached.coords.longitude },
          };
        }

        const locationData = await fetchLocationDetails(latitude, longitude, accuracy);
        if (!locationData) return null;

        setCachedLocation(latitude, longitude, locationData);

        const nextLocation = {
          area: locationData.area,
          city: locationData.city,
          coordinates: {
            lat: locationData.coords.latitude,
            lng: locationData.coords.longitude,
          },
        };

        updateLocation(nextLocation, {
          persist: isAccuracyAcceptable,
          rawPayload: locationData?.raw,
          accuracyMeters: locationData?.coords?.accuracy,
        });

        return nextLocation;
      } catch (error) {
        const message =
          error?.code === 1
            ? 'Location permission denied. Please allow location access.'
            : error?.code === 2
            ? 'Location unavailable. Try again after moving to open sky.'
            : error?.code === 3
            ? 'Location request timed out. Please retry.'
            : error?.message || 'Failed to detect location.';

        if (!silent) throw new Error(message);

        updateLocation(
          {
            area: 'Enable Location',
            city: 'Click to detect',
            coordinates: { lat: null, lng: null },
          },
          { persist: false }
        );
        return null;
      } finally {
        setLocationLoading(false);
        abortControllerRef.current = null;
      }
    },
    [fetchLocationDetails, updateLocation]
  );

  // Hydrate from shared localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedUser = localStorage.getItem('accesco_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {}

    try {
      const stored = localStorage.getItem('userLocation');
      const hydrated = parseStoredUserLocationToSwadishttLocation(stored);
      if (hydrated) {
        setLocation(hydrated);
        setLocationLoading(false);
        return;
      }
    } catch (e) {}

    detectLocation({ silent: true });
  }, [detectLocation]);

  // Filters State
  const [filters, setFilters] = useState({
    pureVeg: false,
    rating: null,
    cuisines: [],
    priceRange: { min: 0, max: 1000 },
    sortBy: 'relevance'
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        } else {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setCartHydrated(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!cartHydrated || typeof window === 'undefined') return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cart, cartHydrated]);

  // Cart Functions
  const addToCart = (item, customizations = {}) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        cartItem => 
          cartItem.id === item.id && 
          JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      }

      return [...prevCart, { ...item, quantity: 1, customizations }];
    });
  };

  const removeFromCart = (indexOrId, customizations = {}) => {
    if (typeof indexOrId === 'number' && indexOrId >= 0 && indexOrId < cart.length) {
      setCart(prevCart => prevCart.filter((_, idx) => idx !== indexOrId));
    } else {
      setCart(prevCart => 
        prevCart.filter(item => 
          !(item.id === indexOrId && 
            JSON.stringify(item.customizations) === JSON.stringify(customizations))
        )
      );
    }
  };

  const updateCartQuantity = (index, quantity) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prevCart =>
      prevCart.map((item, idx) =>
        idx === index ? { ...item, quantity } : item
      )
    );
  };

  const updateQuantity = (itemId, quantity, customizations = {}) => {
    if (quantity <= 0) {
      removeFromCart(itemId, customizations);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId && 
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const reorder = (items) => {
    if (!Array.isArray(items) || items.length === 0) return;
    setCart(prevCart => {
      const next = [...prevCart];
      items.forEach(it => {
        const customizations = it.customizations || {};
        const qty = it.quantity || 1;
        const idx = next.findIndex(
          c => c.id === it.id &&
               JSON.stringify(c.customizations || {}) === JSON.stringify(customizations)
        );
        if (idx > -1) next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        else next.push({ ...it, quantity: qty, customizations });
      });
      return next;
    });
    setCartOpen(true);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      let itemPrice = item.price;
      
      if (item.customizations) {
        Object.values(item.customizations).forEach(option => {
          if (typeof option === 'string') {
            const match = option.match(/\+₹(\d+)/);
            if (match) {
              itemPrice += parseInt(match[1]);
            }
          }
        });
      }
      
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Order Functions matching Grokly Architecture
  const placeOrder = (orderDetails) => {
    const orderId = orderDetails.id || `SW${Date.now().toString(36).toUpperCase()}`;
    const newOrder = {
      id: orderId,
      orderId: orderId,
      status: orderDetails.status || 'CONFIRMED',
      timestamp: new Date().toISOString(),
      placedAt: new Date().toISOString(),
      venture: 'Swadishtt',
      service: 'swadishtt',
      userId: orderDetails.userId || user?.uid || null,
      customerEmail: orderDetails.customerEmail || user?.email || null,
      customerName: orderDetails.customerName || user?.name || 'Valued Customer',
      deviceId: getDeviceId(),
      items: Array.isArray(orderDetails.items) ? orderDetails.items : cart,
      ...orderDetails,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    const emailToUse = newOrder.customerEmail;
    fetch('/api/swadishtt/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newOrder, customerEmail: emailToUse }),
    }).catch((err) => console.error('[SwadishttContext] Backend order sync failed:', err));

    return newOrder;
  };

  const updateOrder = (orderId, patch) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId || o.orderId === orderId ? { ...o, ...patch } : o))
    );
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId || o.orderId === orderId ? { ...o, status } : o))
    );
    fetch('/api/swadishtt/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, newStatus: status }),
    }).catch((err) => console.error('[SwadishttContext] Status update failed:', err));
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

  // Filter Functions
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      pureVeg: false,
      rating: null,
      cuisines: [],
      priceRange: { min: 0, max: 1000 },
      sortBy: 'relevance'
    });
  };

  const value = {
    // Cart
    cart,
    cartHydrated,
    cartOpen,
    setCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartQuantity,
    clearCart,
    reorder,
    getCartTotal,
    getCartCount,
    
    // Orders
    orders,
    placeOrder,
    updateOrder,
    updateOrderStatus,
    cancelOrder,
    trackOrder,
    syncCloudOrders,
    fetchOrders: fetchOrdersFromCloud,

    // User
    user,
    setUser,
    
    // Location
    location,
    locationLoading,
    updateLocation,
    detectLocation,
    
    // Filters
    filters,
    updateFilters,
    resetFilters,
    
    // Search
    searchQuery,
    setSearchQuery
  };

  return (
    <SwadishttContext.Provider value={value}>
      {children}
    </SwadishttContext.Provider>
  );
}

export function useSwadishtt() {
  const context = useContext(SwadishttContext);
  if (!context) {
    throw new Error('useSwadishtt must be used within SwadishttProvider');
  }
  return context;
}
