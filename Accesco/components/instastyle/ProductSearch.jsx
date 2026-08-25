'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, LoaderCircle } from 'lucide-react';
import useInstaStyleProducts from '@/app/services/instastyle/hooks/useInstaStyleProducts';
import styles from './ProductSearch.module.css';

function normalize(value = '') {
  return String(value).toLowerCase().trim();
}

function productMatchesSearch(product, searchValue) {
  const query = normalize(searchValue);

  if (!query) {
    return false;
  }

  const searchableText = [
    product.name,
    product.brand,
    product.sku,
    product.category,
    product.subcategory,
    product.description,
    ...(Array.isArray(product.categories) ? product.categories : []),
    ...(Array.isArray(product.tags) ? product.tags : []),
  ]
    .filter(Boolean)
    .map(normalize)
    .join(' ');

  return searchableText.includes(query);
}

function getProductImage(product) {
  return (
    product.images?.[0]?.url ||
    product.image ||
    '/images/ac-logo.png'
  );
}

export default function ProductSearch() {
  const router = useRouter();
  const searchRef = useRef(null);

  const { products, isLoading, error } = useInstaStyleProducts();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Wait briefly after typing before filtering.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
      setActiveIndex(-1);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  // Close the dropdown when the user clicks anywhere outside search.
  useEffect(() => {
    function handlePointerDown(event) {
      if (!searchRef.current?.contains(event.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  const results = useMemo(() => {
    if (!debouncedQuery) {
      return [];
    }

    return products
      .filter((product) => productMatchesSearch(product, debouncedQuery))
      .slice(0, 6);
  }, [products, debouncedQuery]);

  function goToCatalog() {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      return;
    }

    setIsOpen(false);
    router.push(
      `/services/instastyle/catalog?search=${encodeURIComponent(cleanQuery)}`
    );
  }

  function goToProduct(product) {
    setIsOpen(false);
    router.push(`/services/instastyle/products/${product.id}`);
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown' && results.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((currentIndex) =>
        Math.min(currentIndex + 1, results.length - 1)
      );
    }

    if (event.key === 'ArrowUp' && results.length > 0) {
      event.preventDefault();
      setActiveIndex((currentIndex) => Math.max(currentIndex - 1, 0));
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      if (activeIndex >= 0 && results[activeIndex]) {
        goToProduct(results[activeIndex]);
        return;
      }

      goToCatalog();
    }
  }

  function clearSearch() {
    setQuery('');
    setDebouncedQuery('');
    setIsOpen(false);
    setActiveIndex(-1);
  }

  const showDropdown = isOpen && query.trim().length > 0;

  return (
    <div ref={searchRef} className={styles.searchWrapper}>
      <div className={styles.searchBox}>
        <Search className={styles.searchIcon} size={18} aria-hidden="true" />

        <input
          type="search"
          value={query}
          placeholder="Search InstaStyle products..."
          className={styles.searchInput}
          role="combobox"
          aria-label="Search InstaStyle products"
          aria-expanded={showDropdown}
          aria-controls="instastyle-search-results"
          aria-activedescendant={
            activeIndex >= 0 && results[activeIndex]
              ? `instastyle-search-result-${results[activeIndex].id}`
              : undefined
          }
          autoComplete="off"
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
        />

        {query ? (
          <button
            type="button"
            className={styles.clearButton}
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X size={17} />
          </button>
        ) : null}
      </div>

      {showDropdown ? (
        <div
          id="instastyle-search-results"
          className={styles.dropdown}
          role="listbox"
          aria-label="InstaStyle search results"
        >
          {isLoading ? (
            <div className={styles.statusRow}>
              <LoaderCircle className={styles.spinner} size={18} />
              <span>Finding products…</span>
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className={styles.statusRow}>
              <span>Showing available products. Some saved products could not load.</span>
            </div>
          ) : null}

          {!isLoading && results.length > 0 ? (
            <>
              {results.map((product, index) => {
                const currentPrice = product.discountedPrice || product.price;

                return (
                  <button
                    id={`instastyle-search-result-${product.id}`}
                    key={product.id}
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    className={`${styles.resultItem} ${
                      index === activeIndex ? styles.activeResult : ''
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => goToProduct(product)}
                  >
                    {/* Standard img is used because current product sources
                        contain mixed external image hosts. */}
                    <img
                      src={getProductImage(product)}
                      alt=""
                      className={styles.resultImage}
                    />

                    <span className={styles.resultDetails}>
                      <span className={styles.resultName}>{product.name}</span>
                      <span className={styles.resultMeta}>
                        {product.brand || 'InstaStyle'}
                        {currentPrice ? ` · ₹${Number(currentPrice).toLocaleString('en-IN')}` : ''}
                      </span>
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                className={styles.viewAllButton}
                onMouseDown={(event) => event.preventDefault()}
                onClick={goToCatalog}
              >
                View all results for “{query.trim()}”
              </button>
            </>
          ) : null}

          {!isLoading && results.length === 0 ? (
            <div className={styles.statusRow}>
              No InstaStyle products found for “{query.trim()}”.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}