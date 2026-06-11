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
                  Shop Now
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

      {/* ── DISH-FIRST GROCERY SHOPPING ── */}
      <div style={{
        maxWidth: 'var(--grokly-max-width)',
        margin: '0 auto',
        width: '100%',
        padding: '32px 20px 0',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #0a1e0a 0%, #0d2d0d 50%, #112e11 100%)',
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          padding: 'clamp(32px, 5vw, 56px)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'center',
        }} className="dish-first-section">

          {/* Decorative background blobs */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-60px', right: '-60px',
              width: '280px', height: '280px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
            }} />
            <div style={{
              position: 'absolute', bottom: '-40px', left: '30%',
              width: '200px', height: '200px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)',
            }} />
          </div>

          {/* Left: Text content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)',
              borderRadius: '9999px', padding: '6px 14px', marginBottom: '20px',
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--grokly-font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#4ade80' }}>
                New Feature
              </span>
            </div>

            <h2 style={{
              fontFamily: 'var(--grokly-font-display)',
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              fontWeight: 900, color: '#fff', margin: '0 0 8px',
              letterSpacing: '-0.03em', lineHeight: 1.1,
            }}>
              Dish-First<br />
              <span style={{ color: '#4ade80' }}>Grocery Shopping</span>
            </h2>

            <p style={{
              fontFamily: 'var(--grokly-font-body)',
              fontSize: 'clamp(0.88rem, 1.5vw, 1rem)',
              color: 'rgba(255,255,255,0.7)', lineHeight: 1.65,
              margin: '0 0 28px', maxWidth: '420px',
            }}>
              Choose a dish first — instantly get all ingredients in your cart. Reduces friction, saves time, and makes grocery shopping feel effortless.
            </p>

            {/* Feature bullets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                { iconClass: 'ri-shopping-cart-2-line', text: 'Add all ingredients in one tap' },
                { iconClass: 'ri-restaurant-line', text: 'Search by dish, not ingredient' },
                { iconClass: 'ri-pencil-line', text: 'Customise ingredients before adding' },
                { iconClass: 'ri-flashlight-line', text: 'Delivered in 11 minutes flat' },
              ].map((f) => (
                <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0,
                    color: '#4ade80'
                  }}><i className={f.iconClass}></i></span>
                  <span style={{
                    fontFamily: 'var(--grokly-font-body)', fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.85)', fontWeight: 500,
                  }}>{f.text}</span>
                </div>
              ))}
            </div>

            <button
              style={{
                padding: '14px 32px', borderRadius: '9999px',
                background: '#4ade80', color: '#0a1e0a',
                fontFamily: 'var(--grokly-font-display)', fontWeight: 800,
                fontSize: '15px', border: 'none', cursor: 'pointer',
                transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(74,222,128,0.3)',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(74,222,128,0.45)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(74,222,128,0.3)'; }}
            >
              Try Dish Cart
            </button>
          </div>

          {/* Right: Phone mockups */}
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
          }} className="dish-mockup-wrap">

            {/* Mockup 1 – Dish search */}
            <div style={{
              background: '#fff', borderRadius: '20px',
              width: 'clamp(140px, 18vw, 190px)', flexShrink: 0,
              overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ background: '#f9f9f9', padding: '12px 12px 8px' }}>
                <div style={{
                  background: '#fff', borderRadius: '10px', padding: '8px 10px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  border: '1px solid #e5e7eb', fontSize: '10px', color: '#9ca3af',
                }}>
                  <i className="ri-search-line" style={{ fontSize: '11px', color: '#9ca3af' }}></i> Search "Paneer Chilli"
                </div>
              </div>
              {/* Introducing Dish Cart banner */}
              <div style={{
                margin: '8px 10px', background: '#fff7ed', borderRadius: '10px',
                padding: '10px', border: '1px solid #fed7aa',
              }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#ea580c', marginBottom: '6px' }}>
                  <i className="ri-shopping-basket-line" style={{ marginRight: '4px', verticalAlign: 'middle' }}></i> Introducing Dish Cart
                </div>
                {['Add all ingredients in one tap', 'Search dishes', 'Customise easily'].map(t => (
                  <div key={t} style={{ fontSize: '8px', color: '#374151', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <i className="ri-checkbox-circle-fill" style={{ color: '#ea580c', fontSize: '9px' }}></i>
                    {t}
                  </div>
                ))}
              </div>
              {/* Popular dishes */}
              <div style={{ padding: '0 10px 10px' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>Popular Dishes</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['Biryani', 'Tikka', 'Butter'].map(d => (
                    <div key={d} style={{
                      flex: 1, background: '#f3f4f6', borderRadius: '8px',
                      padding: '6px 4px', textAlign: 'center', fontSize: '7px', color: '#374151', fontWeight: 600,
                    }}><i className="ri-restaurant-line" style={{ fontSize: '10px', display: 'block', marginBottom: '2px' }}></i>{d}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mockup 2 – Ingredient list (highlighted / centre) */}
            <div style={{
              background: '#fff', borderRadius: '20px',
              width: 'clamp(150px, 20vw, 200px)', flexShrink: 0,
              overflow: 'hidden', boxShadow: '0 28px 64px rgba(0,0,0,0.55)',
              border: '1px solid rgba(74,222,128,0.25)',
              transform: 'scale(1.05)',
              zIndex: 2,
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #0a1e0a, #1a3d1a)',
                padding: '12px 12px 10px', color: '#fff',
              }}>
                <div style={{ fontSize: '10px', fontWeight: 800, marginBottom: '2px' }}>Paneer Tikka Masala</div>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.6)' }}>12 items · ₹698</div>
              </div>
              {/* Ingredient rows */}
              {[
                { name: 'Paneer (200g)', price: '₹82', disc: '₹130' },
                { name: 'Tikka Marinade', price: '₹52', disc: '₹60' },
                { name: 'Greek Yogurt', price: '₹35', disc: '₹55' },
                { name: 'Ginger Garlic', price: '₹17', disc: '₹28' },
              ].map((item) => (
                <div key={item.name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 10px', borderBottom: '1px solid #f3f4f6',
                }}>
                  <div>
                    <div style={{ fontSize: '8px', fontWeight: 600, color: '#111' }}>{item.name}</div>
                    <div style={{ fontSize: '7px', color: '#6b7280' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>{item.price}</span>
                      {' '}<span style={{ textDecoration: 'line-through' }}>{item.disc}</span>
                    </div>
                  </div>
                  <button style={{
                    background: '#e11d48', color: '#fff', border: 'none',
                    borderRadius: '5px', padding: '3px 8px', fontSize: '7px', fontWeight: 700, cursor: 'pointer',
                  }}>ADD</button>
                </div>
              ))}
              {/* Add All button */}
              <div style={{ padding: '8px 10px' }}>
                <button style={{
                  width: '100%', background: '#4ade80', color: '#0a1e0a',
                  border: 'none', borderRadius: '8px', padding: '8px',
                  fontSize: '9px', fontWeight: 800, cursor: 'pointer',
                }}>
                  Add All Ingredients
                </button>
              </div>
            </div>

            {/* Mockup 3 – Dish suggestions list */}
            <div style={{
              background: '#fff', borderRadius: '20px',
              width: 'clamp(140px, 18vw, 190px)', flexShrink: 0,
              overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ padding: '12px 12px 8px', background: '#f9f9f9' }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#111', marginBottom: '6px' }}>Popular Paneer Dishes</div>
                <div style={{ fontSize: '7px', color: '#6b7280' }}>Add all ingredients in one tap</div>
              </div>
              {[
                { iconClass: 'ri-restaurant-line', name: 'Paneer Biryani' },
                { iconClass: 'ri-restaurant-2-line', name: 'Paneer Tikka' },
                { iconClass: 'ri-cup-line', name: 'Butter Masala' },
                { iconClass: 'ri-restaurant-line', name: 'Kadai Paneer' },
              ].map((dish) => (
                <div key={dish.name} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '7px 12px', borderBottom: '1px solid #f3f4f6',
                }}>
                  <span style={{
                    width: '28px', height: '28px', background: '#f0fdf4',
                    borderRadius: '8px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#16a34a', fontSize: '14px', flexShrink: 0,
                  }}><i className={dish.iconClass}></i></span>
                  <span style={{ fontSize: '9px', fontWeight: 600, color: '#111' }}>{dish.name}</span>
                </div>
              ))}
              <div style={{ padding: '8px 12px' }}>
                <div style={{ fontSize: '8px', color: '#16a34a', fontWeight: 700, textAlign: 'center' }}>
                  See all recipes with Paneer
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile responsive style injected inline */}
        <style>{`
          @media (max-width: 768px) {
            .dish-first-section {
              grid-template-columns: 1fr !important;
              gap: 28px !important;
              padding: 28px 20px !important;
            }
            .dish-mockup-wrap {
              justify-content: center !important;
              gap: 8px !important;
            }
            .dish-mockup-wrap > div:first-child,
            .dish-mockup-wrap > div:last-child {
              display: none !important;
            }
            .dish-mockup-wrap > div:nth-child(2) {
              transform: scale(1) !important;
              width: 85vw !important;
              max-width: 320px !important;
            }
          }
        `}</style>
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
