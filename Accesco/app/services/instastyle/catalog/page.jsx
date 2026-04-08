'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/instastyle/ProductCard';
import { products, categories, sortProducts } from '@/lib/mockData';
import styles from './catalog.module.css';

// ✅ Inner component that uses useSearchParams
function CatalogContent() {
  const searchParams = useSearchParams();
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

  const displayedProducts = useMemo(() => {
    let filtered =
      selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory);

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

  return (
    <div className={styles.catalogPage}>
      {/* Header */}
      <div className={styles.catalogHeader}>
        <div className={styles.container}>
          <h1>Shop the Edit</h1>
          <p>Category-first shopping with a fashion-magazine feel</p>
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
              </div>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

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