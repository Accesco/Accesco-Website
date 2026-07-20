'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../app/components/AuthProvider';
import dynamic from 'next/dynamic';
const AuthModal = dynamic(() => import('../app/components/AuthModal'), { ssr: false });
import styles from './AccescoHeader.module.css';
import { getPersonCity } from '../lib/locationService';

import LocationModal from './LocationModal';

export default function AccescoHeader() {
  const pathname = usePathname();
  const { user, signOut, signIn } = useAuth();
  
  // Hydration state to fix the Server vs Client mismatch - Jabez
  const [isMounted, setIsMounted] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isPartnersOpen, setIsPartnersOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobilePartnersOpen, setIsMobilePartnersOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('{"city":"Bengaluru, Karnataka"}');
  const dropdownRef = useRef(null);
  const partnersDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const partnersTimeoutRef = useRef(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const locations = [];

  // Handle Mount state to show the Location Modal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (pathname !== '/') return;

    // Abort and close if Firebase context already has the user
    if (user) {
      setIsAuthOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      const localUser = localStorage.getItem('accesco_user');
      const isLoggedOut = !localUser || localUser === 'null' || localUser === 'undefined' || localUser === '{}';

      // Only open if BOTH local storage and Firebase report no user
      if (isLoggedOut && !user) {
        setIsAuthOpen(true);
      }
    }, 800); // Slightly longer delay to let Firebase initialize

    return () => clearTimeout(timer);
  }, [pathname, user]);

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');

    if (savedLocation) {
      setSelectedLocation(savedLocation);
      return;
    }

    // Fallback: save the default city when auto-detection is unavailable/denied
    const applyDefaultLocation = () => {
      getPersonCity()
        .then((city) => {
          // Standardize auto-detected location into JSON schema
          const locationObject = {
            city: city,
            area: '',
            displayAddress: city,
            fullAddress: city
          };
          const locationStr = JSON.stringify(locationObject);
          setSelectedLocation(locationStr);
          localStorage.setItem('userLocation', locationStr);
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    };

    // Auto-detect the user's real location on first visit
    if (!navigator.geolocation) {
      applyDefaultLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch('/api/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data?.error || 'Reverse geocoding failed');

          // Same schema the LocationModal confirm handler saves
          const locationObject = {
            area: data.area || '',
            city: data.city || '',
            latitude,
            longitude,
            lat: latitude,
            lon: longitude,
            street: data.street || '',
            state: data.state || '',
            postalCode: data.postalCode || '',
            fullAddress: data.fullAddress || data.formattedAddress || '',
            formattedAddress: data.formattedAddress || data.fullAddress || '',
            displayAddress: data.displayAddress || data.city || '',
            timestamp: new Date().toISOString()
          };

          const locationStr = JSON.stringify(locationObject);
          setSelectedLocation(locationStr);
          localStorage.setItem('userLocation', locationStr);
        } catch (err) {
          console.error('Auto location detection failed:', err);
          applyDefaultLocation();
        }
      },
      () => {
        // Permission denied or unavailable — fall back to default city
        applyDefaultLocation();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsServicesOpen(false);
      }
      if (partnersDropdownRef.current && !partnersDropdownRef.current.contains(e.target)) {
        setIsPartnersOpen(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target)) {
        setIsLocationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAuthSuccess = useCallback((userData) => {
    signIn(userData);
    setIsAuthOpen(false);
  }, [signIn]);

  const handleSignOut = useCallback(() => {
    signOut();
    setIsMobileMenuOpen(false);
  }, [signOut]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsServicesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 150);
  };

  const handlePartnersMouseEnter = () => {
    if (partnersTimeoutRef.current) clearTimeout(partnersTimeoutRef.current);
    setIsPartnersOpen(true);
  };

  const handlePartnersMouseLeave = () => {
    partnersTimeoutRef.current = setTimeout(() => {
      setIsPartnersOpen(false);
    }, 150);
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '';

  const forceScrolled = (
    pathname.startsWith('/partner') ||
    pathname.startsWith('/blogs') ||
    pathname.startsWith('/faq') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/investor-relations') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/referral') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/press') ||
    pathname === '/calculator'
  );
  const shouldBeScrolled = isScrolled || forceScrolled;

  const getDisplayLocation = (locationStr) => {
    if (!locationStr) return "Select Location";

    try {
      const parsedLocation = JSON.parse(locationStr);
      
      if (parsedLocation && typeof parsedLocation === 'object') {
        if (parsedLocation.area && parsedLocation.city) {
          return `${parsedLocation.area}, ${parsedLocation.city}`;
        }
        return parsedLocation.displayAddress || parsedLocation.city || parsedLocation.fullAddress || "Location Set";
      }
    } catch (e) {
      if (typeof locationStr === 'string') {
        const parts = locationStr.split(',');
        return parts[0] || locationStr;
      }
    }
    
    return "Select Location";
  };

  return (
    <>
      <header className={`${styles.header} ${shouldBeScrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/images/accesco_original.png"
              alt="AccesCo"
              width={36}
              height={36}
              priority
            />
            <div className={styles.logoText}>
              <span className={styles.logoName}>Accesco</span>
              <span className={styles.logoTagline}>Living</span>
            </div>
          </Link>
          <div className={styles.logoDivider}></div>

          <Link href="/#waitlist" className={styles.waitlistLink}>
            JOIN WAITLIST
          </Link>

          <Link href="/referral" className={styles.waitlistLink}>
            REFER & EARN
          </Link>

          <div className={styles.actions}>
            {/* Location Selector */}
            <div 
              className={styles.locationSelector}
              ref={locationDropdownRef}
            >
              <button 
                className={styles.locationButton}
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                aria-expanded={isLocationOpen}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1C5.24 1 3 3.24 3 6C3 9.5 8 15 8 15C8 15 13 9.5 13 6C13 3.24 10.76 1 8 1ZM8 7.5C7.17 7.5 6.5 6.83 6.5 6C6.5 5.17 7.17 4.5 8 4.5C8.83 4.5 9.5 5.17 9.5 6C9.5 6.83 8.83 7.5 8 7.5Z" fill="currentColor"/>
                </svg>

                <span className={styles.locationText}>
                  {getDisplayLocation(selectedLocation)}
                </span>

                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none"
                  className={`${styles.locationIcon} ${isLocationOpen ? styles.locationIconOpen : ''}`}
                >
                  <path 
                    d="M3 4.5L6 7.5L9 4.5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isLocationOpen && (
                <div className={styles.locationDropdown}>
                  <div className={styles.locationDropdownHeader}>
                    <h4>Select Your Location</h4>
                  </div>
                  
                  <button 
                    type="button"
                    className={styles.detectLocationBtn}
                    onClick={() => {
                      setIsLocationOpen(false);
                      setIsLocationModalOpen(true);
                    }}
                  >
                    Detect my location
                  </button>

                  <div className={styles.locationList}>
                    {locations.map((location) => (
                      <button
                        key={location}
                        className={`${styles.locationItem} ${
                          getDisplayLocation(selectedLocation) === location ? styles.selectedLocation : ''
                        }`}
                        onClick={() => {
                          const parts = location.split(', ');
                          const locationObject = {
                            city: parts[1] || location,
                            area: parts[0] || location,
                            displayAddress: location,
                            fullAddress: location
                          };
                          
                          const locationStr = JSON.stringify(locationObject);
                          setSelectedLocation(locationStr);
                          localStorage.setItem('userLocation', locationStr);
                          setIsLocationOpen(false);
                        }}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* NEW: Hydration-safe logic for the User/Login button */}
            {!isMounted ? (
              // 1. Initial Render (Server + First Client Paint): Always show logged-out state
              <button className={styles.loginButton}>
                Login
              </button>
            ) : user ? (
              // 2. Mounted & Logged In
              <Link href="/profile" className={styles.userButton}>
                <div className={styles.avatar}>{initials}</div>
                <span>{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              // 3. Mounted & Logged Out
              <button className={styles.loginButton} onClick={() => setIsAuthOpen(true)}>
                Login
              </button>
            )}

            <a href="#" className={`${styles.loginButton} ${styles.getAppButton}`}>
              <span className={styles.desktopText}>Get App</span>
              <span className={styles.mobileText}>Download</span>

              <img
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googleplay.svg"
                alt="Google Play"
                className={styles.storeIcon}
              />

              <img
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/apple.svg"
                alt="App Store"
                className={styles.storeIcon}
              />
            </a>
          </div>
        </div>
      </header>

      {/* Maintained dynamic conditional render without && */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={handleAuthSuccess} 
      />

      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelect={(locationData) => {
          const { fullAddress, lat, lng } = locationData; 
          
          const parts = fullAddress.split(',');
          const resolvedArea = parts[0]?.trim() || fullAddress;
          const resolvedCity = parts[1]?.trim() || '';

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

          const locationStr = JSON.stringify(locationObject);
          setSelectedLocation(locationStr);
          localStorage.setItem('userLocation', locationStr);
        }}
      />
    </>
  );
}