'use client';

import React, { useEffect, useState, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Reuses your verified client firebase configuration
// FIX: Import the entire context module as a namespace to resolve named/default context exports dynamically
import * as CartModule from '../../../contexts/CartContext.jsx'; 
import { useSwipeDeck } from '../../../app/hooks/useSwipeDeck.js'; 
import { SwipeDeck } from './SwipeDeck.jsx';
import styles from '../../../app/services/instastyle/swipestyle/swipestyle.module.css';

export const SwipeDeckClient = () => {
  const getCartContextData = () => {
    if (CartModule.useCart) {
      return CartModule.useCart();
    }
    const contextObject = CartModule.CartContext || CartModule.default;
    if (!contextObject) {
      throw new Error('Could not resolve CartContext or default export from contexts/CartContext.jsx');
    }
    return useContext(contextObject);
  };

  const cartContext = getCartContextData();
  const { toggleWishlist } = cartContext || {};
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const idToken = await currentUser.getIdToken();
          setToken(idToken);
        } catch (err) {
          console.error('Error fetching auth token:', err);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const { deck, loading, error, handleSwipe, refetch } = useSwipeDeck(token);

  const handleInterceptSwipe = (productId, action) => {
    if (action === 'superlike') {
      const product = deck.find((p) => p.id === productId);
      if (product && toggleWishlist) {
        toggleWishlist(product);
      }
    }
    handleSwipe(productId, action);
  };

  if (authLoading) {
    return (
      <div className={styles.swipeSpinnerContainer}>
        <div className={styles.swipeSpinner}></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.swipeCenterStatus} style={{ backgroundColor: '#ffffff', border: '1px solid #f3f4f6', borderRadius: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', maxWidth: '384px', margin: '0 auto' }}>
        <h2 className={styles.swipeCenterTitle}>Access Restricted</h2>
        <p className={styles.swipeCenterSubtitle}>
          You must be logged in to view your personalized style recommendation deck.
        </p>
        <a href="/login" className={styles.swipeActionButton} style={{ textDecoration: 'none', display: 'inline-block' }}>
          Log In
        </a>
      </div>
    );
  }

  return (
    <SwipeDeck
      deck={deck}
      loading={loading}
      error={error}
      onSwipe={handleInterceptSwipe}
      onRefetch={refetch}
    />
  );
};