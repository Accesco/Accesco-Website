/**
 * useProducts Hook
 * Custom hook for product fetching and filtering
 * @version 1.0.0
 */

import { useState, useEffect, useMemo } from 'react';
import { products as staticProducts } from '../../../../lib/groklyProducts';
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
  const [products, setProducts] = useState(staticProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Filter and search products
   */
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (category && category !== 'all') {
      filtered = getProductsByCategory(category, filtered);
    }

    // Search
    if (searchQuery && searchQuery.trim()) {
      filtered = searchProductsHelper(searchQuery, filtered);
    }

    // Sort
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
            return b.disc - a.disc;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [products, category, searchQuery, sortBy]);

  /**
   * Refresh products (for future API integration)
   */
  const refreshProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In production, this would fetch from API
      // const data = await fetchProducts();
      // setProducts(data);
      
      // For now, use static data
      setProducts(staticProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
