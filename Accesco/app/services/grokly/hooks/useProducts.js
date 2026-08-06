/**
 * useProducts Hook
 * Custom hook for product fetching and filtering
 * @version 2.0.0 — now backed by centralized Firestore via /api/products
 */

import { useState, useEffect, useMemo } from 'react';
import { getProductsByCategory, searchProducts as searchProductsHelper } from '../lib/groklyData';

/**
 * useProducts Hook
 * Provides product data with filtering and search
 *
 * @param {Object} options - Hook options
 * @param {string} options.category - Category filter
 * @param {string} options.searchQuery - Search query
 * @param {string} options.sortBy - Sort criteria
 * @returns {Object} Products state and methods
 */
export function useProducts({ category = 'all', searchQuery = '', sortBy = null } = {}) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFromApi = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/products?ventureId=grokly&limit=1000');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load products');
      setProducts(data.products || []);
    } catch (err) {
      console.warn('useProducts: failed to load from API —', err.message);
      setError(err.message);
      setProducts([]); // no static fallback anymore — surfaces real failures instead of masking them
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFromApi();
  }, []);

  /**
   * Filter and search products (unchanged — still works on whatever `products` currently holds)
   */
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (category && category !== 'all') {
      filtered = getProductsByCategory(category, filtered);
    }

    if (searchQuery && searchQuery.trim()) {
      filtered = searchProductsHelper(searchQuery, filtered);
    }

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'discount':
            return (b.discount || 0) - (a.discount || 0);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [products, category, searchQuery, sortBy]);

  /**
   * Refresh products — now actually hits the API instead of just resetting to static data
   */
  const refreshProducts = async () => {
    await fetchFromApi();
  };

  return {
    products: filteredProducts,
    allProducts: products,
    isLoading,
    error,
    refreshProducts,
    totalCount: filteredProducts.length,
  };
}

export default useProducts;