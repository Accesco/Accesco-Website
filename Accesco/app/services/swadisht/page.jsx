/**
 * Swadishtt Main Page - Zomato Style
 * @page /services/swadisht
 * @description Restaurant listing with Swadishtt signature features
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSwadishtt } from './contexts/SwadishttContext';
import { Nunito } from 'next/font/google';
import SwadishttHeader from './components/SwadishttHeader';
import { RESTAURANTS, filterRestaurants } from './lib/swadishttData';
import { SwadishttHero } from '../../../components/HeroBanners';
import styles from './styles/swadisht-main.module.css';
import CategorySection from './components/CategorySection';
import Image from 'next/image';
import JsonLd from '../../../components/JsonLd';
import { SwipeModal } from './components/TinderSwipeFeature';

const discoveryFont = Nunito({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  display: 'swap',
});

// HeroSection Component
function HeroSection() {
 return (
  <div className={styles.hero}>

  </div>
);
}

// Filter Bar Component
function FilterBar({ filters, onFilterChange }) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterScroll}>
        <button className={styles.filterBtn}>
          <svg className={styles.filterIcon} viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"/>
          </svg>
          Filters
        </button>
        
        <button 
          className={`${styles.filterChip} ${filters.rating === 4 ? styles.active : ''}`}
          onClick={() => onFilterChange({ rating: filters.rating === 4 ? null : 4 })}
        >
          Rating: 4.0+
        </button>
        
        <button
          className={`${styles.filterChip} ${filters.pureVeg ? styles.active : ''}`}
          onClick={() => onFilterChange({ pureVeg: !filters.pureVeg })}
        >
          Pure Veg
        </button>
        
        <button className={styles.filterChip}>
          Offers
        </button>
        
        <button className={styles.filterChip}>
          Outdoor Seating
        </button>
        
        <button className={styles.filterChip}>
          Open Now
        </button>
      </div>
    </div>
  );
}

// Restaurant Card Component
/* eslint-disable @next/next/no-img-element */
function RestaurantCard({ restaurant }) {
  const initials = restaurant.name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <Link href={`/services/swadisht/restaurant/${restaurant.slug}`} className={styles.restaurantCard}>
      <div className={styles.cardImageWrapper}>
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className={styles.restaurantImage}
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/800x450/6B1D3A/FFFFFF/png?text=${encodeURIComponent(restaurant.name)}`;
          }}
        />

      <div className={styles.restaurantLogoBadge}>
  <img
    src={restaurant.logoImage || restaurant.coverImage}
    alt={`${restaurant.name} logo`}
    className={styles.restaurantLogoImage}
    loading="lazy"
    onError={(e) => {
      e.currentTarget.style.display = 'none';
      e.currentTarget.parentElement.textContent = initials;
    }}
  />
</div>
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.restaurantName}>{restaurant.name}</h3>

        <p className={styles.restaurantSubtitle}>
          {restaurant.cuisines.join(' • ')}
        </p>

        <div className={styles.restaurantDivider}></div>

        <div className={styles.restaurantStatusRow}>
          <span>{restaurant.deliveryTime} • ₹{restaurant.priceForTwo} for two</span>
        </div>
      </div>
    </Link>
  );
}

// Main Content Component
// Main Content Component
function DiscoverFeatures() {
  const features = [
    {
      href: '/services/swadisht/swipe-eat',
      title: 'SwipeEat Discovery',
      description: 'Swipe through dishes and discover your next favourite meal.',
      cta: 'Try SwipeEat',
      image: '/images/swipeeat-biryani.png',
      alt: 'SwipeEat biryani bowl',
    },
    {
      href: '/services/swadisht/thali-engine',
      title: 'Thali Engine',
      description: 'Create festive, regional and family-style thalis.',
      cta: 'Build Your Thali',
      image: '/images/thali-engine.png',
      alt: 'Thali Engine meal plate',
    },
    {
      href: '/services/swadisht/instant-catering',
      title: 'Instant Catering',
      description: 'Pre-book catering packs for events and office gatherings.',
      cta: 'Plan Catering',
      image: '/images/catering-trays.png',
      alt: 'Instant Catering food trays',
    },
    {
      href: '/services/swadisht/regional-soul',
      title: 'Regional Soul',
      description: 'Explore authentic cuisines from across India.',
      cta: 'Explore Regions',
      image: '/images/regional-india.png',
      alt: 'Regional Soul India food map',
    },
  ];

  return (
    <section className={`${styles.discoverSection} ${discoveryFont.className}`} aria-label="Swadishtt discovery features">
      <div className={styles.featureGrid}>
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href} className={styles.featureCard}>
  <div className={styles.featureImage}>
    <Image
      src={feature.image}
      alt={feature.alt}
      fill
      sizes="(max-width: 768px) 86vw, (max-width: 1024px) 44vw, 23vw"
      priority={false}
      className={styles.featureImg}
    />
  </div>

  <div className={styles.featureBody}>
    <h3>{feature.title}</h3>
    <span className={styles.featureAccent} aria-hidden="true"></span>
    <p>{feature.description}</p>
  </div>

  <div className={styles.featureCta}>
    <span>{feature.cta}</span>
    <span aria-hidden="true">→</span>
  </div>
</Link>
        ))}
      </div>
    </section>
  );
}
function MainContent() {
  const { filters, updateFilters } = useSwadishtt();
  const [restaurants, setRestaurants] = useState(RESTAURANTS);
  
  useEffect(() => {
    const filtered = filterRestaurants(filters);
    
    // Apply sorting
    let sorted = [...filtered];
    switch (filters.sortBy) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'deliveryTime':
        sorted.sort((a, b) => {
          const aTime = parseInt(a.deliveryTime);
          const bTime = parseInt(b.deliveryTime);
          return aTime - bTime;
        });
        break;
      case 'priceLowToHigh':
        sorted.sort((a, b) => a.priceForTwo - b.priceForTwo);
        break;
      case 'priceHighToLow':
        sorted.sort((a, b) => b.priceForTwo - a.priceForTwo);
        break;
      default:
        // relevance - keep original order
        break;
    }
    
    setRestaurants(sorted);
  }, [filters]);
  
  return (
    <div className={styles.mainContent}>
      <div className={styles.container}>
        <FilterBar filters={filters} onFilterChange={updateFilters} />
        
        <div className={styles.resultsHeader}>
          <h2 className={styles.resultsTitle}>
            {restaurants.length} restaurants delivering to you
          </h2>
        </div>
        
        <div className={styles.restaurantGrid}>
          {restaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
        
        {restaurants.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3 className={styles.emptyTitle}>No restaurants found</h3>
            <p className={styles.emptyText}>Try adjusting your filters</p>
            <button 
              className={styles.resetButton}
              onClick={() => updateFilters({
                pureVeg: false,
                rating: null,
                cuisines: [],
                sortBy: 'relevance'
              })}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Page Component
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Food Delivery",
  name: "Swadishtt by Accesco Living",
  description:
    "Food delivery platform featuring restaurants, regional cuisines, catering, thali experiences and curated meal discovery.",
  url: "https://www.accescoliving.com/services/swadisht",
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
export default function SwadishttPage() {
  const [isSwipeModalOpen, setIsSwipeModalOpen] = useState(false);

  return (
    <>
      <JsonLd data={serviceSchema} />
    <div className={styles.page}>
      {/* Premium Brand Hero Banner */}
      <SwadishttHero />
      <SwadishttHeader />

      <div className={styles.pageContent}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '32px 0', position: 'relative', zIndex: 50 }}>
          <button
            onClick={() => setIsSwipeModalOpen(true)}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              fontWeight: 'bold',
              padding: '16px 32px',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.125rem',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          >
            🔥 Customize Your Taste Profile
          </button>
        </div>
       <CategorySection />
<DiscoverFeatures />
<HeroSection />
<MainContent />
      </div>
    </div>
    {isSwipeModalOpen && <SwipeModal onClose={() => setIsSwipeModalOpen(false)} />}
    </>
  );
}
