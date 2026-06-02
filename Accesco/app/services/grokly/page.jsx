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
import ProductCard from './components/ProductCard';
import ProductSkeleton from './components/ProductSkeleton';
import FilterPanel from './components/FilterPanel';
import CartDrawer from './components/CartDrawer';
import LocationModal from './components/LocationModal';
import FloatingCartBar from './components/FloatingCartBar';
import BottomNav from './components/BottomNav';
import { categories, products, getProductsByCategory, searchProducts } from './lib/groklyData';
import './styles/variables.css';
import './styles/globals.css';
import JsonLd from '../../../components/JsonLd';

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
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Grocery Delivery",
  name: "Grokly by Accesco Living",
  description:
    "Farm-direct fresh groceries delivered in minutes, sourced directly from Karnataka farms via FarmChain with QR traceability.",
  url: "https://www.accescoliving.com/services/grokly",
  provider: {
    "@type": "Organization",
    name: "Accesco Living",
    url: "https://www.accescoliving.com",
  },
  areaServed: {
    "@type": "City",
    name: "Bengaluru",
  },
};
const productListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Fresh Groceries on Grokly",
  itemListElement: products.slice(0, 50).map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
item: {
  "@type": "Product",
  name: p.name,
  offers: {
        "@type": "Offer",
        price: String(p.price),
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
    },
  })),
};
  // ═══════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════
  
  return (
     <>
    <JsonLd data={serviceSchema} />
    <JsonLd data={productListSchema} />
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--grokly-bg)' }}>
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

      {/* Single Big Banner */}
      <div style={{ 
        maxWidth: 'var(--grokly-max-width)', 
        margin: '0 auto', 
        width: '100%', 
        padding: '16px 20px' 
      }}>
        <div 
          onClick={() => {
            const mainContent = document.querySelector('main');
            if (mainContent) {
              mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          style={{
            position: 'relative',
            height: 'clamp(280px, 40vw, 450px)',
            borderRadius: '16px',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img 
            src="/images/banners/hero-grokly.jpg" 
            alt="Grokly Fresh Groceries" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(10,30,10,0.88) 0%, rgba(10,30,10,0.5) 50%, transparent 80%)',
            display: 'flex',
            alignItems: 'center',
            padding: 'clamp(32px, 5vw, 64px)',
          }}>
            <div style={{ maxWidth: '650px' }}>
              <h2 style={{
                fontFamily: 'var(--grokly-font-display)',
                fontSize: 'clamp(28px, 5vw, 52px)',
                fontWeight: 900,
                color: '#fff',
                margin: '0 0 12px',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}>
                Groceries in <span style={{ color: '#4ade80' }}>11 minutes flat.</span>
              </h2>
              <p style={{
                fontFamily: 'var(--grokly-font-body)',
                fontSize: 'clamp(15px, 2vw, 20px)',
                color: 'rgba(255,255,255,0.9)',
                margin: '0 0 24px',
                lineHeight: 1.6,
              }}>
                Farm-fresh essentials sourced directly from Karnataka farms. No middlemen. Full transparency.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const mainContent = document.querySelector('main');
                    if (mainContent) {
                      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  style={{
                    padding: '14px 32px',
                    borderRadius: '9999px',
                    background: '#4ade80',
                    color: '#0a1e0a',
                    fontFamily: 'var(--grokly-font-display)',
                    fontWeight: 800,
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#22c55e';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#4ade80';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Shop Now →
                </button>
                <span style={{
                  padding: '14px 24px',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#fff',
                  fontSize: '15px',
                  fontFamily: 'var(--grokly-font-body)',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}>
                  Free delivery on ₹199+
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
  </>
);
}
/**
 * Main Export with Provider
 */

export default function GroklyPage() {
  return (
    <GroklyProvider>
      <GroklyPageContent />
    </GroklyProvider>
  );
}
