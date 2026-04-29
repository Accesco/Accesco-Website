/**
 * Grokly Main Page - Modular Version
 * 11-Minute Grocery Delivery Service
 * @version 2.0.0
 */

'use client';

import { useState, useMemo } from 'react';
import { GroklyProvider } from './contexts/GroklyContext';
import GroklyHeader from './components/GroklyHeader';
import MobileHeader from './components/MobileHeader';
import CategoryNav from './components/CategoryNav';
import BannerCarousel from './components/BannerCarousel';
import ProductCard from './components/ProductCard';
import ProductSkeleton from './components/ProductSkeleton';
import FilterPanel from './components/FilterPanel';
import CartDrawer from './components/CartDrawer';
import LocationModal from './components/LocationModal';
import FloatingCartBar from './components/FloatingCartBar';
import BottomNav from './components/BottomNav';
import { categories, products, getProductsByCategory, searchProducts } from './lib/groklyData';
import { GroklyHero } from '@/components/HeroBanners';
import './styles/variables.css';
import './styles/globals.css';

/**
 * Grokly Page Component
 */
function GroklyPageContent() {
  // ═══════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('');

  // ═══════════════════════════════════════════════
  // COMPUTED VALUES
  // ═══════════════════════════════════════════════
  
  /**
   * Filter products by category and search query
   */
  const filteredProducts = useMemo(() => {
    // First filter by category
    let filtered = getProductsByCategory(activeCategory, products);
    
    // Then filter by search query
    if (searchQuery.trim()) {
      filtered = searchProducts(searchQuery, filtered);
    }

    // Apply quick filters
    switch (activeFilter) {
      case 'bestseller':
        filtered = filtered.filter(p => p.tags && p.tags.includes('Bestseller'));
        break;
      case 'discount':
        filtered = filtered.filter(p => p.disc > 0);
        break;
      case 'under-50':
        filtered = filtered.filter(p => p.price < 50);
        break;
      case 'under-100':
        filtered = filtered.filter(p => p.price < 100);
        break;
      case 'premium':
        filtered = filtered.filter(p => p.tags && p.tags.includes('Premium'));
        break;
      case 'low-stock':
        filtered = filtered.filter(p => p.stock && p.stock < 10);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Apply sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'price-low': return a.price - b.price;
          case 'price-high': return b.price - a.price;
          case 'rating': return b.rating - a.rating;
          case 'discount': return b.disc - a.disc;
          default: return 0;
        }
      });
    }
    
    return filtered;
  }, [activeCategory, searchQuery, activeFilter, sortBy]);

  /**
   * Group products by category for horizontal layout
   * Only used when showing all categories
   */
  const productsByCategory = useMemo(() => {
    if (activeCategory !== 'all' || searchQuery.trim()) {
      return null; // Don't group if filtering
    }

    const grouped = {};
    
    // Group products by category
    categories.forEach(category => {
      if (category.id === 'all') return;
      
      const categoryProducts = products.filter(p => p.category === category.id);
      if (categoryProducts.length > 0) {
        grouped[category.id] = {
          category,
          products: categoryProducts.slice(0, 12) // Show first 12 products
        };
      }
    });

    return grouped;
  }, [activeCategory, searchQuery]);

  // ═══════════════════════════════════════════════
  // EVENT HANDLERS
  // ═══════════════════════════════════════════════
  
  /**
   * Handle category selection
   */
  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    // Clear search when changing category
    setSearchQuery('');
  };

  /**
   * Handle search input change
   */
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    // Reset to 'all' category when searching
    if (query.trim() && activeCategory !== 'all') {
      setActiveCategory('all');
    }
  };

  /**
   * Handle search clear
   */
  const handleSearchClear = () => {
    setSearchQuery('');
  };

  // ═══════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--grokly-bg)' }}>
      {/* Premium Hero Banner */}
      <GroklyHero />

      {/* Desktop Header */}
      <GroklyHeader 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
      />

      {/* Mobile Header */}
      <MobileHeader />

      {/* Category Navigation */}
      <CategoryNav 
        categories={categories}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: 'var(--grokly-max-width)', margin: '0 auto', width: '100%', padding: '8px 20px' }}>
        {/* Filter Panel - Only show when not in horizontal category view */}
        {!productsByCategory && (
          <FilterPanel 
            onFilterChange={setActiveFilter}
            onSortChange={setSortBy}
            activeFilters={{ [activeFilter]: true }}
          />
        )}

        {/* Search Results Header */}
        {searchQuery && (
          <div style={{ 
            padding: '8px 0', 
            fontFamily: 'var(--grokly-font-display)', 
            fontSize: '18px', 
            fontWeight: 800, 
            color: 'var(--grokly-text-primary)' 
          }}>
            {filteredProducts.length} results for "{searchQuery}"
          </div>
        )}

        {!searchQuery && !productsByCategory && (
          <h2 style={{ 
            fontFamily: 'var(--grokly-font-display)', 
            fontSize: '20px', 
            fontWeight: 800, 
            color: 'var(--grokly-text-primary)',
            margin: '0 0 16px'
          }}>
            {activeCategory === 'all' ? 'All Products' : categories.find(c => c.id === activeCategory)?.name}
          </h2>
        )}

        {/* Horizontal Category Layout (Zepto-style) */}
        {productsByCategory ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {Object.entries(productsByCategory).map(([categoryId, { category, products: categoryProducts }]) => (
              <section key={categoryId} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {/* Category Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingBottom: '0px'
                }}>
                  <h2 style={{ 
                    fontFamily: 'var(--grokly-font-display)', 
                    fontSize: '20px', 
                    fontWeight: 800, 
                    color: 'var(--grokly-text-primary)',
                    margin: 0
                  }}>
                    {category.name}
                  </h2>
                  <button
                    onClick={() => handleCategorySelect(categoryId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--grokly-primary)',
                      fontFamily: 'var(--grokly-font-body)',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'var(--grokly-bg-hover)'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}
                  >
                    See All
                    <span style={{ fontSize: '16px' }}>→</span>
                  </button>
                </div>

                {/* Horizontal Scrollable Product Row */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
                className="hide-scrollbar"
                >
                  {categoryProducts.map((product) => (
                    <div key={product.id} style={{ minWidth: '200px', maxWidth: '200px', flexShrink: 0 }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          /* Grid Layout (for specific category or search) */
          <>
            {isLoading ? (
              <div style={{
                display: 'grid',
                gap: '12px',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              }}>
                <ProductSkeleton count={12} />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div style={{
                display: 'grid',
                gap: '12px',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              }}>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                  />
                ))}
              </div>
            ) : (
              /* No Results */
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ fontSize: '56px', opacity: 0.1 }}>SEARCH</div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 800, 
                  color: 'var(--grokly-text-primary)',
                  margin: 0
                }}>
                  No products found
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: 'var(--grokly-text-muted)',
                  margin: 0
                }}>
                  Try searching with different keywords
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Location Modal */}
      <LocationModal />

      {/* Floating Cart Bar (Mobile) */}
      <FloatingCartBar />

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />
    </div>
  );
}

/**
 * Main Export with Provider
 */
export default function GroklyPage() {
  return <GroklyPageContent />;
}
