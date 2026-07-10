/**
 * Grokly Main Page - Modular Version
 * 11-Minute Grocery Delivery Service
 * @version 2.0.0
 */

'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GroklyProvider, useGrokly } from './contexts/GroklyContext';
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

const dishes = {
  tikka: {
    name: 'Paneer Tikka Masala',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
    itemsCount: 6,
    price: 249,
    ingredients: [
      { id: 'dish-paneer', name: 'Milky Mist Paneer', unit: '200 g', price: 82, mrp: 130, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=120&auto=format&fit=crop&q=80' },
      { id: 'dish-marinade', name: 'Everest Tikhalal Powder Pouch', unit: '100 g', price: 52, mrp: 60, image: 'https://m.media-amazon.com/images/I/71UnlVpvTgL._SL1500_.jpg' },
      { id: 'dish-yogurt', name: 'Milky Mist Greek Yogurt', unit: '100 g', price: 35, mrp: 55, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=120&auto=format&fit=crop&q=80' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=120&auto=format&fit=crop&q=80' },
      { id: 'veg-001', name: 'Tomato - Hybrid', unit: '500 g', price: 28, mrp: 35, image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'veg-002', name: 'Onion', unit: '1 kg', price: 35, mrp: 40, image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ]
  },
  biryani: {
    name: 'Paneer Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    itemsCount: 5,
    price: 744,
    ingredients: [
      { id: 'dish-paneer', name: 'Milky Mist Paneer', unit: '200 g', price: 82, mrp: 130, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=120&auto=format&fit=crop&q=80' },
      { id: 'atta-002', name: 'India Gate Basmati Rice', unit: '5 kg', price: 525, mrp: 575, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=120/app/images/products/sliding_image/483632a.jpg' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=120&auto=format&fit=crop&q=80' },
      { id: 'masala-003', name: 'Everest Garam Masala', unit: '100 g', price: 85, mrp: 95, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=120/app/images/products/sliding_image/483640a.jpg' },
      { id: 'veg-002', name: 'Onion', unit: '1 kg', price: 35, mrp: 40, image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ]
  },
  butter: {
    name: 'Paneer Butter Masala',
    image: 'https://images.unsplash.com/photo-1708782341807-ed35fc16b4ea?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    itemsCount: 5,
    price: 237,
    ingredients: [
      { id: 'dish-paneer', name: 'Milky Mist Paneer', unit: '200 g', price: 82, mrp: 130, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=120&auto=format&fit=crop&q=80' },
      { id: 'dairy-004', name: 'Amul Butter - Salted', unit: '100 g', price: 58, mrp: 60, image: 'https://images.unsplash.com/photo-1594233301022-8867d9d032d8?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'dairy-006', name: 'Amul Fresh Cream', unit: '250 ml', price: 52, mrp: 55, image: 'https://www.bbassets.com/media/uploads/p/l/40102603_3-amul-fresh-cream-25-milk-fat-low-fat.jpg' },
      { id: 'veg-001', name: 'Tomato - Hybrid', unit: '500 g', price: 28, mrp: 35, image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=120&auto=format&fit=crop&q=80' },
    ]
  }
};

const getIngredientImage = (item) => {
  if (!item.image || item.image.includes('grofers.com')) {
    const categoryImages = {
      'vegetables-fruits': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&h=150&fit=crop',
      'dairy-breakfast': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=150&h=150&fit=crop',
      'masala-oil': 'https://images.unsplash.com/photo-1596040033229-a0b3b83b2e4d?w=150&h=150&fit=crop',
      'atta-rice-dal': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&h=150&fit=crop',
      'default': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=150&fit=crop'
    };
    const category = item.id.startsWith('veg-') ? 'vegetables-fruits' :
      item.id.startsWith('dairy-') || item.id.includes('paneer') || item.id.includes('yogurt') ? 'dairy-breakfast' :
        item.id.startsWith('masala-') || item.id.includes('ggpaste') || item.id.includes('marinade') ? 'masala-oil' :
          item.id.startsWith('atta-') || item.id.includes('rice') ? 'atta-rice-dal' : 'default';
    return categoryImages[category] || categoryImages['default'];
  }
  return item.image;
};

/**
 * Grokly Page Component
 */
function GroklyPageContent() {
  // ═══════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════

  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('');
  const [selectedDishKey, setSelectedDishKey] = useState('tikka');
  const [currentSlide, setCurrentSlide] = useState(0);
  const { getProductQuantity, addToCart, incrementQuantity, decrementQuantity, openCart } = useGrokly();

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);


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
    if (categoryId === 'all') {
      setActiveCategory('all');
      setSearchQuery('');
      router.push('/services/grokly');
    } else {
      router.push(`/services/grokly/category/${categoryId}`);
    }
  };

  /**
   * Handle search input change
   */
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      router.push(`/services/grokly?search=${encodeURIComponent(query)}`, { scroll: false });
    } else {
      router.push('/services/grokly', { scroll: false });
    }
  };

  /**
   * Handle search clear
   */
  const handleSearchClear = () => {
    setSearchQuery('');
    router.push('/services/grokly', { scroll: false });
  };

  /**
   * Add all ingredients for active dish
   */
  const handleAddAll = () => {
    const activeDish = dishes[selectedDishKey];
    activeDish.ingredients.forEach(item => {
      if (getProductQuantity(item.id) === 0) {
        addToCart(item.id, 1);
      }
    });
    openCart();
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

        {/* Category Navigation - Show only on specific category views */}
        {activeCategory !== 'all' && (
          <CategoryNav
            categories={categories}
            activeCategory={activeCategory}
            onCategorySelect={handleCategorySelect}
          />
        )}

        {/* Sliding Carousel Banners */}
        {activeCategory === 'all' && !searchQuery && (
          <div style={{
            maxWidth: 'var(--grokly-max-width)',
            margin: '0 auto',
            width: '100%',
            padding: '16px 20px'
          }}>
            <div style={{
              position: 'relative',
              height: 'clamp(280px, 40vw, 450px)',
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            }}>
              {/* SLIDE 0: IMG_4614 Hero Banner */}
              <div
                onClick={() => {
                  const mainContent = document.querySelector('main');
                  if (mainContent) {
                    mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                style={{
                     position: 'absolute',
                     inset: 0,
                      opacity: 1,
                     pointerEvents: 'auto',
                  }}
              >
                <img
                  src="/images/IMG_4614.PNG"
                  alt="Grokly - 11 Minute Grocery Delivery"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, rgba(5,18,5,0.72) 0%, rgba(5,18,5,0.35) 55%, transparent 85%)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 'clamp(32px, 5vw, 64px)',
                }}>
                  <div style={{ maxWidth: '560px' }}>
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
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#4ade80';
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
                      }}>Free delivery on ₹199+</span>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        )}

        {/* ── DISH-FIRST GROCERY SHOPPING ── */}
        {activeCategory === 'all' && !searchQuery && (
          <div style={{
            maxWidth: 'var(--grokly-max-width)',
            margin: '0 auto',
            width: '100%',
            padding: '32px 20px 0',
          }}>
            <div className="dish-inner-container" style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
              border: '1px solid #dcfce7',
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              padding: 'clamp(24px, 4vw, 48px)',
            }}>
              {/* Decorative background blobs */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: '-60px', right: '-60px',
                  width: '280px', height: '280px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(12,131,31,0.06) 0%, transparent 70%)',
                }} />
              </div>

              {/* DESKTOP VIEW */}
              <div className="dish-desktop-view" style={{
                display: 'grid',
                gridTemplateColumns: '320px 1fr',
                gap: '32px',
                position: 'relative',
                zIndex: 1,
              }}>
                {/* Left Column: Dish Selection */}
                <div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#0c831f',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <i className="ri-restaurant-2-fill"></i> Recipes & Bundles
                  </div>
                  <h2 style={{
                    fontFamily: 'var(--grokly-font-display)',
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: '#1a1a1a',
                    margin: '0 0 12px',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                  }}>
                    Choose a Dish,<br />
                    <span style={{ color: '#0c831f' }}>Get All Ingredients</span>
                  </h2>
                  <p style={{
                    fontFamily: 'var(--grokly-font-body)',
                    fontSize: '0.95rem',
                    color: '#475569',
                    lineHeight: 1.5,
                    margin: '0 0 24px',
                  }}>
                    Select a recipe below. We will bundle the fresh ingredients so you can cook it at home. Customize items before adding.
                  </p>

                  {/* Stacked Recipe List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Object.entries(dishes).map(([key, dish]) => {
                      const isActive = selectedDishKey === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedDishKey(key)}
                          style={{
                            background: '#ffffff',
                            border: isActive ? '2px solid #0c831f' : '1px solid #e2e8f0',
                            boxShadow: isActive ? '0 4px 12px rgba(12, 131, 31, 0.06)' : 'none',
                            borderRadius: '16px',
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background-color var(--grokly-transition-fast), border-color var(--grokly-transition-fast)',
                            width: '100%',
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.background = '#f8fafc';
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.background = '#ffffff';
                          }}
                        >
                          <img
                            src={dish.image}
                            alt={dish.name}
                            style={{
                              width: '64px',
                              height: '64px',
                              borderRadius: '12px',
                              objectFit: 'cover',
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1a1a1a', fontWeight: 800 }}>{dish.name}</h4>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                              {dish.ingredients.length} items &middot; ₹{dish.price}
                            </p>
                          </div>
                          <span style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: isActive ? '#0c831f' : '#f1f5f9',
                            color: isActive ? '#ffffff' : '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            transition: 'background-color var(--grokly-transition-fast), color var(--grokly-transition-fast)'
                          }}>
                            <i className={isActive ? 'ri-checkbox-circle-fill' : 'ri-arrow-right-line'}></i>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Ingredients Details */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #f2f4f6',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '440px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                }}>
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                      borderBottom: '1px solid #f1f5f9',
                      paddingBottom: '12px'
                    }}>
                      <h3 style={{ margin: 0, color: '#1a1a1a', fontSize: '18px', fontWeight: 800 }}>
                        Ingredients for {dishes[selectedDishKey].name}
                      </h3>
                      <span style={{ fontSize: '13px', color: '#0c831f', fontWeight: 700 }}>
                        {dishes[selectedDishKey].ingredients.length} Fresh items
                      </span>
                    </div>

                    {/* Ingredients Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '12px',
                    }}>
                      {dishes[selectedDishKey].ingredients.map((ing) => {
                        const qty = getProductQuantity(ing.id);
                        return (
                          <div
                            key={ing.id}
                            style={{
                              background: '#fff',
                              borderRadius: '12px',
                              padding: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              border: '1px solid #f1f5f9',
                            }}
                          >
                            <img
                              src={getIngredientImage(ing)}
                              alt={ing.name}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=150&fit=crop';
                              }}
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                                background: '#f9f9f9',
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h5 style={{ margin: '0 0 2px', fontSize: '12px', color: '#111', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {ing.name}
                              </h5>
                              <p style={{ margin: '0 0 4px', fontSize: '10px', color: '#6b7280' }}>{ing.unit}</p>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: '#111' }}>
                                ₹{ing.price}{' '}
                                <span style={{ fontSize: '9px', textDecoration: 'line-through', color: '#9ca3af', fontWeight: 'normal' }}>
                                  ₹{ing.mrp}
                                </span>
                              </div>
                            </div>
                            <div style={{ flexShrink: 0 }}>
                              {qty > 0 ? (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  background: '#0c831f',
                                  color: '#fff',
                                  borderRadius: '6px',
                                  padding: '4px 6px',
                                }}>
                                  <button
                                    onClick={() => decrementQuantity(ing.id)}
                                    style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', padding: '0 2px' }}
                                  >
                                    -
                                  </button>
                                  <span style={{ fontSize: '11px', fontWeight: 'bold', minWidth: '10px', textAlign: 'center' }}>{qty}</span>
                                  <button
                                    onClick={() => incrementQuantity(ing.id)}
                                    style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', padding: '0 2px' }}
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(ing.id, 1)}
                                  style={{
                                    background: '#fff',
                                    border: '1px solid #0c831f',
                                    color: '#0c831f',
                                    borderRadius: '6px',
                                    padding: '5px 10px',
                                    fontSize: '10px',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    transition: 'background-color var(--grokly-transition-fast), color var(--grokly-transition-fast)'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#0c831f';
                                    e.currentTarget.style.color = '#fff';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#fff';
                                    e.currentTarget.style.color = '#0c831f';
                                  }}
                                >
                                  ADD
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add All CTA */}
                  <div style={{
                    marginTop: '24px',
                    paddingTop: '20px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Bundle Total</div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#0c831f' }}>
                        ₹{dishes[selectedDishKey].price}
                      </div>
                    </div>
                    <button
                      onClick={handleAddAll}
                      style={{
                        background: '#0c831f',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '14px 32px',
                        fontSize: '14px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(12,131,31,0.1)',
                        transition: 'background-color var(--grokly-transition-fast)'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#0a6b19'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#0c831f'; }}
                    >
                      <i className="ri-shopping-basket-line"></i> Add All Ingredients
                    </button>
                  </div>
                </div>
              </div>

              {/* MOBILE VIEW */}
              <div className="dish-mobile-view" style={{
                display: 'none',
                position: 'relative',
                zIndex: 1,
              }}>
                {/* Header */}
                <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#0c831f',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <i className="ri-restaurant-2-fill"></i> Cook at Home
                  </div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 900, color: '#1a1a1a' }}>
                    Cook with Fresh Ingredients
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}>
                    Choose a dish to get all ingredients in one tap.
                  </p>
                </div>

                {/* Mockup Frame mimic */}
                <div style={{
                  background: '#fff',
                  borderRadius: '24px',
                  padding: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)'
                }}>
                  {/* Search Mimic */}
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e5e7eb', fontSize: '12px', color: '#9ca3af' }}>
                    <i className="ri-search-line"></i> Try searching "Paneer Chilli"
                  </div>

                  {/* Popular Dishes selector horizontal */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Popular Dishes</div>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="hide-scrollbar">
                      {Object.entries(dishes).map(([key, dish]) => {
                        const isActive = selectedDishKey === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setSelectedDishKey(key)}
                            style={{
                              flex: '0 0 auto',
                              background: isActive ? '#f0fdf4' : '#f8fafc',
                              border: isActive ? '1px solid #0c831f' : '1px solid #e2e8f0',
                              borderRadius: '12px',
                              padding: '8px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                            }}
                          >
                            <i className="ri-restaurant-line" style={{ color: isActive ? '#0c831f' : '#6b7280', fontSize: '14px' }}></i>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: isActive ? '#0c831f' : '#374151' }}>
                              {dish.name.replace('Paneer ', '')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ingredients Card Section */}
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '12px',
                    border: '1px solid #f1f5f9',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#1a1a1a' }}>
                        {dishes[selectedDishKey].name}
                      </span>
                      <span style={{ fontSize: '10px', color: '#0c831f', fontWeight: 700 }}>
                        {dishes[selectedDishKey].ingredients.length} items &middot; ₹{dishes[selectedDishKey].price}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {dishes[selectedDishKey].ingredients.map((item) => {
                        const qty = getProductQuantity(item.id);
                        return (
                          <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={getIngredientImage(item)}
                                alt={item.name}
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=150&fit=crop';
                                }}
                                style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#1a1a1a' }}>{item.name}</div>
                                <div style={{ fontSize: '9px', color: '#64748b' }}>{item.unit}</div>
                                <div style={{ fontSize: '10px', fontWeight: 700, color: '#1a1a1a' }}>
                                  ₹{item.price}{' '}
                                  <span style={{ fontSize: '8px', textDecoration: 'line-through', color: '#94a3b8', fontWeight: 'normal' }}>
                                    ₹{item.mrp}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {qty > 0 ? (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#0c831f',
                                color: '#fff',
                                borderRadius: '6px',
                                padding: '4px 6px',
                              }}>
                                <button
                                  onClick={() => decrementQuantity(item.id)}
                                  style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', padding: '0 2px' }}
                                >
                                  -
                                </button>
                                <span style={{ fontSize: '11px', fontWeight: 'bold', minWidth: '10px', textAlign: 'center' }}>{qty}</span>
                                <button
                                  onClick={() => incrementQuantity(item.id)}
                                  style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', padding: '0 2px' }}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(item.id, 1)}
                                style={{
                                  background: '#fff',
                                  border: '1px solid #0c831f',
                                  color: '#0c831f',
                                  borderRadius: '6px',
                                  padding: '5px 10px',
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                }}
                              >
                                ADD
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Mobile Button */}
                  <button
                    onClick={handleAddAll}
                    style={{
                      width: '100%',
                      background: '#0c831f',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px',
                      marginTop: '16px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="ri-shopping-basket-line"></i> Add All Ingredients
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile responsive styles */}
            <style dangerouslySetInnerHTML={{
              __html: `
          .dish-desktop-view {
            display: grid !important;
          }
          .dish-mobile-view {
            display: none !important;
          }
          @media (max-width: 768px) {
            .dish-inner-container {
              padding: 28px 20px !important;
            }
            .dish-desktop-view {
              display: none !important;
            }
            .dish-mobile-view {
              display: block !important;
            }
          }
          .grokly-category-layout {
            display: grid;
            grid-template-columns: 240px 1fr;
            gap: 24px;
            align-items: start;
            margin-top: 16px;
          }
          .grokly-category-sidebar {
            position: sticky;
            top: 80px;
            background: #fff;
            border: 1px solid #f2f4f6;
            border-radius: 12px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-height: calc(100vh - 100px);
            overflow-y: auto;
          }
          .grokly-sidebar-item {
            transition: background-color var(--grokly-transition-fast);
          }
          @media (max-width: 768px) {
            .grokly-category-layout {
              grid-template-columns: 1fr !important;
              gap: 12px !important;
            }
            .grokly-category-sidebar {
              display: none !important;
            }
          }
        ` }} />
          </div>
        )}

        {/* Main Content */}
        <main style={{ flex: 1, maxWidth: 'var(--grokly-max-width)', margin: '0 auto', width: '100%', padding: '8px 20px' }}>
       {/* Category Carousel - Zepto style */}
{activeCategory === 'all' && !searchQuery && (
  <div style={{ margin: '0 0 32px' }}>
    <h3 style={{
      fontFamily: 'var(--grokly-font-display)',
      fontSize: '22px',
      fontWeight: 900,
      color: 'var(--grokly-text-primary)',
      margin: '0 0 16px'
    }}>
      Browse by Categories
    </h3>

    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => {
          const rail = document.getElementById('grokly-home-category-rail');
          if (rail) rail.scrollBy({ left: -500, behavior: 'smooth' });
        }}
     style={{
  position: 'absolute',
  left: '-4px',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,

  width: '32px',
  height: '32px',
  borderRadius: '50%',
  border: 'none',

  background: '#000',
  color: '#fff',
  fontSize: '24px',
  fontWeight: 900,
  lineHeight: '1',
  padding: 0,
  paddingBottom: '3px',

  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  boxShadow: '0 4px 12px rgba(0,0,0,0.22)'
}}
      >
        ‹
      </button>

      <div
        id="grokly-home-category-rail"
        className="hide-scrollbar"
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          scrollSnapType: 'x mandatory',
          padding: '4px 8px 14px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {categories.filter(c => c.id !== 'all').map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
style={{
  flex: '0 0 128px',
  width: '128px',
  minHeight: '118px',
  background: '#fff',
  border: '1px solid #f2f4f6',
  borderRadius: '12px',
  padding: '12px 8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  textAlign: 'center',
  gap: '8px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
  scrollSnapAlign: 'start'
}}
          >
          <div style={{
  width: '64px',
  height: '64px',
  borderRadius: '8px',
  background: '#f8fafc',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
              <img
                src={cat.image}
                alt={cat.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            <span style={{
  fontSize: '12px',
  fontWeight: 700,
  color: '#1a1a1a',
  fontFamily: 'var(--grokly-font-primary)',
  lineHeight: '1.2',
  textTransform: 'uppercase'
}}>
              {cat.name}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          const rail = document.getElementById('grokly-home-category-rail');
          if (rail) rail.scrollBy({ left: 500, behavior: 'smooth' });
        }}
style={{
  position: 'absolute',
  right: '-4px',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,

  width: '32px',
  height: '32px',
  borderRadius: '50%',
  border: 'none',

  background: '#000',
  color: '#fff',
  fontSize: '24px',
  fontWeight: 900,
  lineHeight: '1',
  padding: 0,
  paddingBottom: '3px',

  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  boxShadow: '0 4px 12px rgba(0,0,0,0.22)'
}}
      >
        ›
      </button>
    </div>

    <style dangerouslySetInnerHTML={{
      __html: `
        #grokly-home-category-rail::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 768px) {
          #grokly-home-category-rail {
            gap: 14px !important;
            padding: 2px 4px 12px !important;
          }

          #grokly-home-category-rail button {
            flex: 0 0 112px !important;
            width: 112px !important;
            min-height: 128px !important;
            padding: 12px 8px !important;
            border-radius: 14px !important;
          }

          #grokly-home-category-rail button > div {
            width: 76px !important;
            height: 76px !important;
            border-radius: 13px !important;
          }

          #grokly-home-category-rail span {
            font-size: 11px !important;
          }

          #grokly-home-category-rail + button,
          div:has(> #grokly-home-category-rail) > button {
            display: none !important;
          }
        }
      `
    }} />
  </div>
)}

          {/* Curated Product Sections */}
          {activeCategory === 'all' && !searchQuery && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', margin: '16px 0 40px' }}>
              {/* Shelf 1: Quick Breakfast Corner */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontFamily: 'var(--grokly-font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--grokly-text-primary)', margin: 0 }}>
                    Quick Breakfast Corner
                  </h3>
                  <button 
                    onClick={() => handleCategorySelect('dairy-breakfast')}
                    style={{ background: 'none', border: 'none', color: '#0c831f', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
                  >
                    See All
                  </button>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  overflowX: 'auto',
                  paddingBottom: '8px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  alignItems: 'stretch'
                }} className="hide-scrollbar">
                  {products
                    .filter(p => ['dairy-001', 'dairy-002', 'dairy-003', 'dairy-004', 'dairy-007', 'dairy-008', 'fruit-001', 'fruit-002', 'tea-002', 'tea-001'].includes(p.id))
                    .map(product => (
                      <div key={product.id} style={{ flex: '0 0 180px', width: '180px', display: 'flex' }}>
                        <ProductCard product={product} />
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Shelf 2: Snack Attack & Cold Drinks */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontFamily: 'var(--grokly-font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--grokly-text-primary)', margin: 0 }}>
                    Snack Attack & Cold Drinks
                  </h3>
                  <button 
                    onClick={() => handleCategorySelect('munchies')}
                    style={{ background: 'none', border: 'none', color: '#0c831f', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
                  >
                    See All
                  </button>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  overflowX: 'auto',
                  paddingBottom: '8px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  alignItems: 'stretch'
                }} className="hide-scrollbar">
                  {products
                    .filter(p => ['munch-001', 'munch-002', 'munch-003', 'munch-005', 'munch-006', 'drink-001', 'drink-002', 'drink-003', 'drink-004'].includes(p.id))
                    .map(product => (
                      <div key={product.id} style={{ flex: '0 0 180px', width: '180px', display: 'flex' }}>
                        <ProductCard product={product} />
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Shelf 3: Daily Cooking Essentials */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontFamily: 'var(--grokly-font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--grokly-text-primary)', margin: 0 }}>
                    Daily Cooking Essentials
                  </h3>
                  <button 
                    onClick={() => handleCategorySelect('atta-rice-dal')}
                    style={{ background: 'none', border: 'none', color: '#0c831f', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
                  >
                    See All
                  </button>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  overflowX: 'auto',
                  paddingBottom: '8px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  alignItems: 'stretch'
                }} className="hide-scrollbar">
                  {products
                    .filter(p => ['veg-001', 'veg-002', 'veg-003', 'atta-001', 'atta-002', 'atta-003', 'masala-001', 'masala-003'].includes(p.id))
                    .map(product => (
                      <div key={product.id} style={{ flex: '0 0 180px', width: '180px', display: 'flex' }}>
                        <ProductCard product={product} />
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}

          {/* Filter Panel - Only show when searching */}
          {searchQuery && (
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

          {activeCategory !== 'all' && !searchQuery && (
            <h2 style={{
              fontFamily: 'var(--grokly-font-display)',
              fontSize: '20px',
              fontWeight: 800,
              color: 'var(--grokly-text-primary)',
              margin: '0 0 16px'
            }}>
              {categories.find(c => c.id === activeCategory)?.name}
            </h2>
          )}

          {/* Search results or Category detail page */}
          {searchQuery ? (
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
          ) : (
            activeCategory !== 'all' && (
              /* Split Layout for Category Page */
              <div className="grokly-category-layout">
                {/* Left Sidebar */}
                <aside className="grokly-category-sidebar">
                  {categories.filter(c => c.id !== 'all').map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`grokly-sidebar-item ${isActive ? 'active' : ''}`}
                      >
                        <img src={cat.image} alt={cat.name} />
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </aside>

                {/* Right Product Grid */}
                <div style={{ flex: 1 }}>
                  <div className="grokly-category-header">
                    <div>
                      <h2 className="grokly-category-title">
                        {categories.find(c => c.id === activeCategory)?.name}
                      </h2>
                      <p className="grokly-category-count">
                        Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>

                  <FilterPanel
                    onFilterChange={setActiveFilter}
                    onSortChange={setSortBy}
                    activeFilters={{ [activeFilter]: true }}
                  />
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
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <h3>No products found</h3>
                    </div>
                  )}
                </div>
              </div>
            )
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
      <Suspense fallback={<div>Loading...</div>}>
        <GroklyPageContent />
      </Suspense>
    </GroklyProvider>
  );
}
// Redesigned with Blinkit-style flat layout
