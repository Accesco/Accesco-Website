import { useState, useEffect, useCallback, useRef } from 'react';
import { SWIPE_CONFIG } from '../../lib/services/recommendation/config.js';

const STORAGE_KEY = 'accesco_swipe_sync_queue';

export function useSwipeDeck(user) {
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const syncQueue = useRef([]);
  const isSyncing = useRef(false);

  // FIX: Identify user ID securely using your existing provider model
  const userId = user ? (user.uid || user.id) : null;

  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        syncQueue.current = JSON.parse(cached);
      }
    } catch (err) {
      console.error('Error reading offline swipe cache:', err);
    }
  }, []);

  const saveQueueToLocalStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(syncQueue.current));
    } catch (err) {
      console.error('Error writing to offline swipe cache:', err);
    }
  };

  // FIX: Corrected API paths to use standard base routes with Bearer userId authorization
  const fetchDeck = useCallback(async (isInitial = false) => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    try {
      if (isInitial) setLoading(true);
      const response = await fetch('/api/instastyle/swipe/deck', {
        headers: {
          'Authorization': `Bearer ${userId}`,
        },
      });
      if (!response.ok) throw new Error('Failed to load recommendation deck');
      const data = await response.json();

      setDeck((prev) => {
        const uniqueProducts = data.products.filter(
          (newProd) => !prev.some((existing) => existing.id === newProd.id)
        );
        return [...prev, ...uniqueProducts];
      });
    } catch (err) {
      setError(err.message || 'An error occurred while loading');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchDeck(true);
    }
  }, [userId, fetchDeck]);

  const syncInteractions = useCallback(async () => {
    if (syncQueue.current.length === 0 || !userId || isSyncing.current) return;

    isSyncing.current = true;
    const payload = [...syncQueue.current];
    syncQueue.current = [];
    saveQueueToLocalStorage();

    let attempt = 0;
    let success = false;

    while (attempt < SWIPE_CONFIG.MAX_RETRIES && !success) {
      try {
        const response = await fetch('/api/instastyle/swipe/interact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userId}`,
          },
          body: JSON.stringify({ interactions: payload }),
        });

        if (response.ok) {
          success = true;
          localStorage.removeItem(STORAGE_KEY);
        } else {
          throw new Error(`Server returned status code: ${response.status}`);
        }
      } catch (err) {
        attempt++;
        if (attempt >= SWIPE_CONFIG.MAX_RETRIES) {
          console.error('Network sync failed. Restoring interactions back to offline cache.');
          const mergedQueue = [...payload, ...syncQueue.current];
          syncQueue.current = mergedQueue.slice(-SWIPE_CONFIG.MAX_OFFLINE_QUEUE_LIMIT);
          saveQueueToLocalStorage();
        } else {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    isSyncing.current = false;
  }, [userId]);

  const handleSwipe = useCallback((productId, action) => {
    const isDuplicate = syncQueue.current.some((item) => item.productId === productId);
    if (isDuplicate) return;

    syncQueue.current.push({
      productId,
      action,
      timestamp: Date.now(),
    });
    saveQueueToLocalStorage();

    setDeck((prev) => prev.filter((p) => p.id !== productId));

    setDeck((prev) => {
      if (prev.length <= SWIPE_CONFIG.PREFETCH_THRESHOLD) {
        fetchDeck();
      }
      return prev;
    });

    if (syncQueue.current.length >= SWIPE_CONFIG.BATCH_SIZE) {
      syncInteractions();
    }
  }, [fetchDeck, syncInteractions]);

  useEffect(() => {
    return () => {
      if (syncQueue.current.length > 0) {
        syncInteractions();
      }
    };
  }, [syncInteractions]);

  return { deck, loading, error, handleSwipe, refetch: fetchDeck };
}