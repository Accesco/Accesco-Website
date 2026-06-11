'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/instastyle/ProductCard';
import { products, categories, sortProducts } from '@/lib/mockData';
import styles from './catalog.module.css';
import Select from '@/components/instastyle/Select';

// ✅ Inner component that uses useSearchParams
function CatalogContent() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    category: [],
    size: [],
    priceRange: [0, 10000],
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const category = searchParams.get('category');
    setSelectedCategory(
      category && categories.some(item => item.id === category) ? category : 'all'
    );
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      // 1. Hydrate from localStorage for instant user experience
      let localProducts = [];
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('instastyle_custom_products');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              localProducts = parsed;
            }
          }
        } catch (error) {
          console.error('Failed to load local custom products:', error);
        }
      }

      setAllProducts(() => {
        const merged = [...products];
        localProducts.forEach(lp => {
          if (!merged.some(p => p.id === lp.id)) {
            merged.push(lp);
          }
        });
        return merged;
      });

      // 2. Fetch from Firebase Firestore for persistent storage
      try {
        const { db } = await import('@/lib/firebase');
        const { collection, getDocs, query } = await import('firebase/firestore');
        const q = query(collection(db, 'instastyle_products'));
        const snapshot = await getDocs(q);
        const fbProducts = [];
        snapshot.forEach((doc) => {
          fbProducts.push(doc.data());
        });

        if (fbProducts.length > 0) {
          setAllProducts(() => {
            const merged = [...products];
            localProducts.forEach(lp => {
              if (!merged.some(p => p.id === lp.id)) {
                merged.push(lp);
              }
            });
            fbProducts.forEach(fp => {
              if (!merged.some(p => p.id === fp.id)) {
                merged.push(fp);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.error('Failed to load products from Firestore:', err);
      }
    };
    loadProducts();
  }, []);

  const displayedProducts = useMemo(() => {
    let filtered =
      selectedCategory === 'all'
        ? allProducts
        : allProducts.filter(p => p.category === selectedCategory);

    if (filters.size.length > 0) {
      filtered = filtered.filter(p =>
        filters.size.some(size => p.sizes.includes(size))
      );
    }

    const [min, max] = filters.priceRange;
    filtered = filtered.filter(p => {
      const price = p.discountedPrice || p.price;
      return price >= min && price <= max;
    });

    return sortProducts(filtered, sortBy);
  }, [selectedCategory, filters, sortBy]);

  const activeFilterCount =
    filters.size.length + (filters.priceRange[1] < 10000 ? 1 : 0);

  const handleSizeFilter = (size) => {
    setFilters(prev => ({
      ...prev,
      size: prev.size.includes(size)
        ? prev.size.filter(s => s !== size)
        : [...prev.size, size],
    }));
  };

  const clearFilters = () => {
    setFilters({ category: [], size: [], priceRange: [0, 10000] });
  };

  const clearPriceCap = () => {
    setFilters((prev) => ({ ...prev, priceRange: [0, 10000] }));
  };

  return (
    <div className={styles.catalogPage}>
      {/* Header */}
      <div className={styles.catalogHeader}>
        <div className={styles.container}>
          <p className={styles.kicker}>The Curation</p>
          <h1>Shop the Edit</h1>
          <p className={styles.description}>
            A meticulously curated selection of premium pieces, balanced by timeless design 
            and superior craftsmanship.
          </p>
          <div className={styles.headerInfo}>
            <span className={styles.countInfo}>{displayedProducts.length} items found</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className={styles.categoryTabs}>
        <div className={styles.container}>
          <div className={styles.tabsWrapper}>
            <button
              className={`${styles.tab} ${selectedCategory === 'all' ? styles.active : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              Everything
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`${styles.tab} ${selectedCategory === cat.id ? styles.active : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.catalogContent}>
          {/* Filters Sidebar */}
          <aside className={`${styles.filtersSidebar} ${showFilters ? styles.show : ''}`}>
            <div className={styles.filtersHeader}>
              <h3>Refine</h3>
              <button className={styles.clearBtn} onClick={clearFilters}>
                Clear All
              </button>
            </div>

            <div className={styles.filterSection}>
              <h4>Size</h4>
              <div className={styles.sizeOptions}>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button
                    key={size}
                    className={`${styles.sizeBtn} ${filters.size.includes(size) ? styles.active : ''}`}
                    onClick={() => handleSizeFilter(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterSection}>
              <h4>Price Range</h4>
              <div className={styles.priceRange}>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters(prev => ({
                      ...prev,
                      priceRange: [0, parseInt(e.target.value)],
                    }))
                  }
                />
                <div className={styles.priceLabels}>
                  <span>₹0</span>
                  <span>₹{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className={styles.productsSection}>
            <div className={styles.toolbar}>
              <button
                className={styles.filterToggle}
                onClick={() => setShowFilters(!showFilters)}
              >
                <span>🔍</span> Refine
              </button>
              <div className={styles.resultsCount}>
                {displayedProducts.length} Products
                {activeFilterCount > 0 ? ` • ${activeFilterCount} active filters` : ''}
              </div>
              <div className={styles.sortWrapper}>
                <Select
                  value={sortBy}
                  options={[
                    { value: 'newest', label: 'Newest' },
                    { value: 'price-low-high', label: 'Price: Low to High' },
                    { value: 'price-high-low', label: 'Price: High to Low' },
                    { value: 'rating', label: 'Top Rated' },
                  ]}
                  onChange={setSortBy}
                  placeholder="Sort by"
                />
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className={styles.activeFilters}>
                {filters.size.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={styles.filterChip}
                    onClick={() => handleSizeFilter(size)}
                  >
                    Size {size} ×
                  </button>
                ))}
                {filters.priceRange[1] < 10000 && (
                  <button type="button" className={styles.filterChip} onClick={clearPriceCap}>
                    Up to ₹{filters.priceRange[1].toLocaleString()} ×
                  </button>
                )}
                <button type="button" className={styles.clearInlineBtn} onClick={clearFilters}>
                  Reset all
                </button>
              </div>
            )}

            {displayedProducts.length > 0 ? (
              <div className={styles.productsGrid}>
                {displayedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className={styles.noProducts}>
                <p>No products found matching your filters.</p>
                <button onClick={clearFilters}>Clear Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ✅ Default export wraps the inner component in Suspense
export default function CatalogPage() {
  return (
    <Suspense fallback={<div>Loading catalog…</div>}>
      <CatalogContent />
    </Suspense>
  );
}