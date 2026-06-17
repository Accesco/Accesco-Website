/**
 * Swadishtt Main Page - Zomato Style
 * @page /services/swadisht
 * @description Restaurant listing with Swadishtt signature features
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSwadishtt } from './contexts/SwadishttContext';
import SwadishttHeader from './components/SwadishttHeader';
import { RESTAURANTS, filterRestaurants } from './lib/swadishttData';
import { SwadishttHero } from '../../../components/HeroBanners';
import styles from './styles/swadisht-main.module.css';
import CategorySection from './components/CategorySection';
import Image from 'next/image';
import JsonLd from '../../../components/JsonLd';
// Hero Section Component
function HeroSection() {
  const [activeTab, setActiveTab] = useState('delivery');
  
 return (
  <div className={styles.hero}>

  </div>
);
}

// Filter Bar Component
function FilterBar({ filters, onFilterChange }) {
  const [sortOpen, setSortOpen] = useState(false);
  const [cuisineOpen, setCuisineOpen] = useState(false);
  
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'rating', label: 'Rating' },
    { value: 'deliveryTime', label: 'Delivery Time' },
    { value: 'priceLowToHigh', label: 'Cost: Low to High' },
    { value: 'priceHighToLow', label: 'Cost: High to Low' }
  ];
  
  const cuisineOptions = [
    'North Indian', 'South Indian', 'Chinese', 'Biryani', 
    'Mughlai', 'Tandoor', 'Fast Food', 'Desserts'
  ];
  
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
function RestaurantCard({ restaurant }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <Link href={`/services/swadisht/restaurant/${restaurant.slug}`} className={styles.restaurantCard}>
      <div className={styles.cardImageWrapper}>
        <div className={styles.cardImage}>
          {!imageLoaded && <div className={styles.imageSkeleton}></div>}
          <Image
  src={restaurant.coverImage}
  alt={restaurant.name}
  fill
  sizes="(max-width: 768px) 100vw, 33vw"
  className={styles.restaurantImage}
  loading="lazy"
  onLoad={() => setImageLoaded(true)}
  style={{ opacity: imageLoaded ? 1 : 0 }}
/>
          <div className={styles.imageOverlay}></div>
        </div>
        
        {restaurant.offers.length > 0 && (
          <div className={styles.offerTag}>
            <svg className={styles.offerIcon} viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4z"/>
            </svg>
            <span>{restaurant.offers[0].title}</span>
          </div>
        )}
        
        {restaurant.features.pureVeg && (
          <div className={styles.vegBadge}>
            <div className={styles.vegDotIcon}></div>
          </div>
        )}
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.cardTop}>
          <h3 className={styles.restaurantName}>{restaurant.name}</h3>
          <div className={styles.ratingPill}>
            <span className={styles.ratingValue}>{restaurant.rating}</span>
            <svg className={styles.starIcon} viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
        </div>
        
        <p className={styles.cuisines}>{restaurant.cuisines.slice(0, 3).join(' • ')}</p>
        
        <div className={styles.cardFooter}>
          <div className={styles.metaInfo}>
            <span className={styles.deliveryTime}>{restaurant.deliveryTime}</span>
            <span className={styles.metaDot}>•</span>
            <span className={styles.priceForTwo}>₹{restaurant.priceForTwo} for two</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Main Content Component
function DiscoverFeatures() {
  return (
    <section className={styles.discoverSection}>
      <div className={styles.featureGrid}>
        
        <Link href="/services/swadisht/swipe-eat" className={styles.featureCard}>
          <h3>SwipeEat Discovery</h3>
          <p>Swipe through dishes and discover your next favourite meal.</p>
          <span>Try SwipeEat →</span>
           <div className={styles.featureImage}>
    <Image
      src="/images/swipeeat-biryani.png"
      alt=""
      fill
    />
  </div>
        </Link>

        <Link href="/services/swadisht/thali-engine" className={styles.featureCard}>
          <h3>Thali Engine</h3>
          <p>Create festive, regional and family-style thalis.</p>
          <span>Build Your Thali →</span>
            <div className={styles.featureImage}>
    <Image
      src="/images/thali-engine.png"
      alt=""
      fill
    />
  </div>
        </Link>

        <Link href="/services/swadisht/instant-catering" className={styles.featureCard}>
          <h3>Instant Catering</h3>
          <p>Pre-book catering packs for events and office gatherings.</p>
          <span>Plan Catering →</span>
            <div className={styles.featureImage}>
    <Image
      src="/images/catering-trays.png"
      alt=""
      fill
    />
  </div>
        </Link>

        <Link href="/services/swadisht/regional-soul" className={styles.featureCard}>
          <h3>Regional Soul</h3>
          <p>Explore authentic cuisines from across India.</p>
          <span>Explore Regions →</span>
           <div   className={`${styles.featureImage} ${styles.regionalImage}`}>
    <Image
      src="/images/regional-india.png"
      alt=""
      fill
    />
  </div>
        </Link>

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
  return (
    <>
      <JsonLd data={serviceSchema} />
    <div className={styles.page}>
      {/* Premium Brand Hero Banner */}
      <SwadishttHero />
      <SwadishttHeader />

      <div className={styles.pageContent}>
       <CategorySection />
<DiscoverFeatures />
<HeroSection />
<MainContent />
      </div>
    </div>
    </>
  );
}
