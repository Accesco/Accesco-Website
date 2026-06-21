'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSwadishtt } from '../contexts/SwadishttContext';
import styles from './SwadishttHeader.module.css';
import LocationModal from '@/components/LocationModal';

export default function SwadishttHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [locationDropdown, setLocationDropdown] = useState(false);
  
  // Custom Modal States
  const [showLocationModal, setShowLocationModal] = useState(false);

  const { location, updateLocation, getCartCount, searchQuery, setSearchQuery } = useSwadishtt();
  
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <Link
              href="/"
              className={styles.backBtn}
              aria-label="Back to Accesco"
            >
              <span className={styles.backDesktop}>← Back</span>
              <span className={styles.backMobile}>←</span>
            </Link>
            
            {/* Logo */}
            <Link href="/services/swadisht" className={styles.logo}>
              <img 
                src="/images/swadisht/swadisht_logo.JPG" 
                alt="Swadishtt" 
                className={styles.logoImage}
                onError={(e) => e.target.style.display = 'none'}
              />
              <span className={styles.brandName}>Swadishtt</span>
            </Link>

            {/* Location Selector */}
            <div className={styles.locationWrapper}>
              <button 
                className={styles.locationButton}
                onClick={() => setLocationDropdown(!locationDropdown)}
              >
                <svg className={styles.locationIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <div className={styles.locationText}>
                  <span className={styles.locationLabel}>Deliver to</span>
                  <span className={styles.locationArea}>{location.area}, {location.city}</span>
                </div>
                <svg className={styles.dropdownIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>

              {locationDropdown && (
                <div className={styles.locationDropdown}>
                  <div className={styles.dropdownHeader}>
                    <h3>Select Delivery Location</h3>
                    <button onClick={() => setLocationDropdown(false)}>✕</button>
                  </div>
                  <div className={styles.locationList}>
                    
                    <button
                      className={styles.locationItem}
                      onClick={() => {
                        setLocationDropdown(false);
                        setShowLocationModal(true);
                      }}
                    >
                      <svg className={styles.locationItemIcon} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                      <div>
                        <div className={styles.locationItemArea}>Select Custom Location</div>
                        <div className={styles.locationItemCity}>Type your location</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
              <input
                type="text"
                placeholder="Search for restaurants, cuisines, or dishes"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Navigation */}
            <nav className={styles.nav}>
              <Link href="/services/swadisht/profile" className={styles.navLink}>
                <svg className={styles.navIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
                <span className={styles.navText}>Profile</span>
              </Link>

              <Link 
                href="/services/swadisht/cart"
                className={`${styles.navLink} ${styles.cartButton}`}
              >
                <svg className={styles.navIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                </svg>
                <span className={styles.navText}>Cart</span>
                {cartCount > 0 && (
                  <span className={styles.cartBadge}>{cartCount}</span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Manual Location Modal Overlay */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSelect={(locationData) => {
          const { fullAddress, lat, lng } = locationData; 
          
          const parts = fullAddress.split(',');
          const resolvedArea = parts[0]?.trim() || fullAddress;
          const resolvedCity = parts[1]?.trim() || '';

          updateLocation({
            area: resolvedArea,
            city: resolvedCity,
          });

          const locationObject = {
            area: resolvedArea,
            city: resolvedCity,
            latitude: lat,
            longitude: lng,
            lat: lat,
            lon: lng,
            fullAddress: fullAddress,
            formattedAddress: fullAddress,
            displayAddress: resolvedCity || resolvedArea,
            timestamp: new Date().toISOString()
          };

          localStorage.setItem(
            'userLocation',
            JSON.stringify(locationObject)
          );
          
          console.log("Saved location data:", locationObject);
          setShowLocationModal(false);
        }}
      />
    </>
  );
}