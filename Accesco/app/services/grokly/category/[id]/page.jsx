'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useGrokly } from '../../contexts/GroklyContext';
import GroklyHeader from '../../components/GroklyHeader';
import MobileHeader from '../../components/MobileHeader';
import CategoryNav from '../../components/CategoryNav';
import ProductCard from '../../components/ProductCard';
import ProductSkeleton from '../../components/ProductSkeleton';
import FilterPanel from '../../components/FilterPanel';
import CartDrawer from '../../components/CartDrawer';
import LocationModal from '../../components/LocationModal';
import FloatingCartBar from '../../components/FloatingCartBar';
import BottomNav from '../../components/BottomNav';
import { categories, products, getProductsByCategory, searchProducts } from '../../lib/groklyData';
import '../../styles/variables.css';
import '../../styles/globals.css';

import JsonLd from '../../../../../components/JsonLd';

export default function GroklyCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { getProductQuantity } = useGrokly();

  const handleSearchChange = (query) => {
    router.push(`/services/grokly?search=${encodeURIComponent(query)}`);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const handleCategorySelect = (categoryId) => {
    if (categoryId === 'all') {
      router.push('/services/grokly');
    } else {
      router.push(`/services/grokly/category/${categoryId}`);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = getProductsByCategory(id, products);
    
    if (searchQuery.trim()) {
      filtered = searchProducts(searchQuery, filtered);
    }

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
        break;
    }

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
  }, [id, searchQuery, activeFilter, sortBy]);

  const activeCategoryObject = categories.find(c => c.id === id);

  const productListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": filteredProducts.slice(0, 10).map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://accescoliving.com/services/grokly`,
      "name": product.name,
      "image": product.image,
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "INR"
      }
    }))
  };

  return (
    <>
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

        {/* Category Navigation Bar */}
        <CategoryNav 
          categories={categories}
          activeCategory={id}
          onCategorySelect={handleCategorySelect}
        />

        {/* Main Content */}
        <main className="grokly-content">
          <div className="grokly-category-layout">
            {/* Left Sidebar */}
            <aside className="grokly-category-sidebar">
              {categories.filter(c => c.id !== 'all').map((cat) => {
                const isActive = id === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`grokly-sidebar-item ${isActive ? 'active' : ''}`}
                  >
                    <Image src={cat.image} alt={cat.name} width={30} height={30} />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </aside>

            {/* Right Product Grid - always visible */}
            <div className="grokly-category-products">
              <div className="grokly-category-header">
                <div>
                  <h1 className="grokly-category-title">
                    {activeCategoryObject ? activeCategoryObject.name : 'Category'}
                  </h1>
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
                <div className="product-grid">
                  <ProductSkeleton count={12} />
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="product-grid">
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
                  <p style={{ color: '#666', marginTop: 8 }}>Try a different category or clear filters.</p>
                </div>
              )}
            </div>
          </div>
        </main>

        <CartDrawer />
        <LocationModal />
        <FloatingCartBar />
        <BottomNav />
      </div>
    </>
  );
}
