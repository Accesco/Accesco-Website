/**
 * Swadishtt Context
 * @module contexts/SwadishttContext
 * @description Global state management for Swadishtt platform
 */

'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SwadishttContext = createContext(undefined);

export function SwadishttProvider({ children }) {
  // Cart State
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // User State
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState({
    area: 'Your Location',
    city: 'Detecting...',
    coordinates: { lat: null, lng: null }
  });
  const [locationLoading, setLocationLoading] = useState(true);

  // Geolocation Effect
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Use reverse geocoding to get city name with more details
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();
            
            // Better fallback logic with more address options
            const area = data.address?.suburb || 
                        data.address?.neighbourhood || 
                        data.address?.city_district ||
                        data.address?.quarter ||
                        data.address?.road ||
                        data.address?.hamlet ||
                        'Location';
            
            const city = data.address?.city || 
                        data.address?.town || 
                        data.address?.village ||
                        data.address?.municipality ||
                        data.address?.county ||
                        data.address?.state ||
                        'Detected';
            
            setLocation({
              area,
              city,
              coordinates: { lat: latitude, lng: longitude }
            });
          } catch (error) {
            console.error('Error getting location name:', error);
            // If reverse geocoding fails, show coordinates
            setLocation({
              area: `${latitude.toFixed(4)}°`,
              city: `${longitude.toFixed(4)}°`,
              coordinates: { lat: latitude, lng: longitude }
            });
          } finally {
            setLocationLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to default location
          setLocation({
            area: 'Enable Location',
            city: 'Click to detect',
            coordinates: { lat: null, lng: null }
          });
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      // Geolocation not supported
      setLocation({
        area: 'Location',
        city: 'Not Available',
        coordinates: { lat: null, lng: null }
      });
      setLocationLoading(false);
    }
  }, []);

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
    const savedCart = localStorage.getItem('swadishtt-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('swadishtt-cart', JSON.stringify(cart));
  }, [cart]);

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
  const updateLocation = (newLocation) => {
    setLocation(newLocation);
  };

  const value = {
    // Cart
    cart,
    cartOpen,
    setCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    
    // User
    user,
    setUser,
    
    // Location
    location,
    locationLoading,
    updateLocation,
    
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
