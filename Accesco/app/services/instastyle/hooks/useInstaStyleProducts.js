'use client';

import { useEffect, useState } from 'react';
import { products as mockProducts } from '@/lib/mockData';

function mergeProducts(...lists) {
  const productMap = new Map();

  lists.flat().forEach((product) => {
    if (product?.id) {
      productMap.set(product.id, product);
    }
  });

  return Array.from(productMap.values());
}

export default function useInstaStyleProducts() {
  const [products, setProducts] = useState(mockProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  function getLocalProducts() {
    if (typeof window === 'undefined') return [];

    try {
      const saved = window.localStorage.getItem(
        'instastyle_custom_products'
      );
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Unable to read local InstaStyle products:', err);
      return [];
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setIsLoading(true);
      setError(null);

      const localProducts = getLocalProducts();

      try {
        const response = await fetch(
          '/api/instastyle/products?limit=200'
        );

        if (!response.ok) {
          throw new Error('Could not load InstaStyle products.');
        }

        const data = await response.json();
        const firestoreProducts = Array.isArray(data.products)
          ? data.products
          : [];

        if (isMounted) {
          setProducts(
            mergeProducts(mockProducts, localProducts, firestoreProducts)
          );
        }
      } catch (err) {
        console.error('Unable to load InstaStyle products:', err);

        if (isMounted) {
          setProducts(mergeProducts(mockProducts, localProducts));
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, isLoading, error };
}