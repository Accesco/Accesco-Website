/**
 * Swadishtt Context
 * @module contexts/SwadishttContext
 * @description Global state management for Swadishtt platform
 */

'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../components/AuthProvider';
import { getSwadishttCart, setSwadishttCart } from '@/lib/unifiedCart';
import { updateUserFieldsInFirebase } from '@/lib/userService';

const SwadishttContext = createContext(undefined);

const TARGET_ACCURACY_METERS = 50;
const ACCEPTABLE_ACCURACY_METERS = 100;
const CLIENT_CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// Client-side cache for detected locations
const locationCache = new Map();

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
          // If acceptable but not target, give the hardware 3 more seconds to find a better lock.
          // If it can't, resolve early so the user isn't stuck waiting.
          acceptableTimeoutId = setTimeout(() => {
            finishSuccess(bestPosition);
          }, 3000);
        }
      },
      () => {}, // Ignore fast-fail, rely on watchPosition
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

  // If we don't have a locality/area but we do have city+state, show city, state.
  if (!area && storedCity && storedRegion) {
    area = storedCity;
    city = storedRegion;
  }

  // Otherwise, fall back to address label splitting.
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
    // backward compatibility with existing usages
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
  const { user: authUser, loading: authLoading } = useAuth();

  // Cart State
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartHydrated, setCartHydrated] = useState(false);

  // User State
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState({
    area: 'Your Location',
    city: 'Detecting...',
    coordinates: { lat: null, lng: null }
  });
  const [locationLoading, setLocationLoading] = useState(true);

  const abortControllerRef = useRef(null);

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
      } catch (e) {
        // Non-JSON response
      }

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

      if (authUser?.uid) {
        updateUserFieldsInFirebase(authUser.uid, { selectedLocation: payloadToStore });
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [authUser]);

  const detectLocation = useCallback(
    async ({ silent = false } = {}) => {
      // Geolocation requires a secure context (HTTPS) or localhost
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
        // If permissions are explicitly denied, provide a helpful message early
        if (navigator.permissions && navigator.permissions.query) {
          let permState = null;
          try {
            const perm = await navigator.permissions.query({ name: 'geolocation' });
            permState = perm?.state;
          } catch (e) {
            // ignore permission query errors and proceed
          }

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

  // Mirror the Firebase-backed auth user from AuthProvider
  useEffect(() => {
    setUser(authUser);
  }, [authUser]);

  // Hydrate from user profile + auto-detect once if missing
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (authUser?.selectedLocation) {
        const stored = typeof authUser.selectedLocation === 'string' ? authUser.selectedLocation : JSON.stringify(authUser.selectedLocation);
        const hydrated = parseStoredUserLocationToSwadishttLocation(stored);
        if (hydrated) {
          setLocation(hydrated);
          setLocationLoading(false);
          return;
        }
      }
    } catch (e) {
      // ignore malformed storage
    }

    detectLocation({ silent: true });
  }, [authUser, detectLocation]);

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

  // Load cart from Firestore. Keyed by the signed-in user's uid, or a
  // per-browser device id for guests (see getSwadishttCart in unifiedCart.js)
  // — re-runs when auth resolves/changes so the right cart gets loaded.
  //
  // Waits for auth to finish resolving (authLoading) before fetching at all —
  // Firebase auth starts as null and resolves asynchronously, so fetching
  // eagerly means a guest fetch (by device id) immediately followed by a
  // second fetch once login resolves (by uid), which used to silently wipe
  // the cart for anyone who had added items as a guest before their
  // persisted session kicked in. If login resolves to an identity with no
  // cart of its own yet, any items sitting under the guest device id are
  // carried over instead of being discarded.
  useEffect(() => {
    if (typeof window === 'undefined' || authLoading) return;

    let cancelled = false;
    setCartHydrated(false);

    (async () => {
      try {
        let remoteCart = await getSwadishttCart(authUser);

        if (authUser && remoteCart.length === 0) {
          const guestCart = await getSwadishttCart(null);
          if (guestCart.length > 0) {
            remoteCart = guestCart;
            await setSwadishttCart(authUser, guestCart);
          }
        }

        if (!cancelled) setCart(remoteCart);
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        if (!cancelled) setCartHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authUser, authLoading]);

  // Save cart to Firestore whenever it changes, once hydration has completed.
  useEffect(() => {
    if (!cartHydrated || typeof window === 'undefined') return;

    setSwadishttCart(authUser, cart);
  }, [cart, cartHydrated, authUser]);

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
    // Support both index-based and id-based removal
    if (typeof indexOrId === 'number' && indexOrId >= 0 && indexOrId < cart.length) {
      // Remove by index
      setCart(prevCart => prevCart.filter((_, idx) => idx !== indexOrId));
    } else {
      // Remove by id
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

  // Re-add every item from a past order back into the cart ("Order Again").
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
      
      // Add customization costs
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

  // Location Functions
  // updateLocation is defined above (memoized) and persists to shared storage by default

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
