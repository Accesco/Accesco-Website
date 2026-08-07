'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../app/components/AuthProvider';
import dynamic from 'next/dynamic';
import styles from './AccescoHeader.module.css';
import { getPersonCity } from '../lib/locationService';
import { getUnifiedCartCount } from '../lib/unifiedCart';

// Lazy load heavy modals so their JS bundles are downloaded only when needed
const AuthModal = dynamic(() => import('../app/components/AuthModal'), { ssr: false });
const LocationModal = dynamic(() => import('./LocationModal'), { ssr: false });

export default function AccescoHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, signIn } = useAuth();
<<<<<<< HEAD

  // Hydration state to fix the Server vs Client mismatch - Jabez
  const [isMounted, setIsMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);
=======
  
  const [isMounted, setIsMounted] = useState(false);
>>>>>>> origin/main
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isPartnersOpen, setIsPartnersOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('{"city":"Bengaluru, Karnataka"}');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const dropdownRef = useRef(null);
  const partnersDropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const partnersTimeoutRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    setCartCount(getUnifiedCartCount());
  }, []);

  useEffect(() => {
    if (pathname !== '/') return;

    if (user) {
      setIsAuthOpen(false);
    }

    const timer = setTimeout(() => {
      const localUser = localStorage.getItem('accesco_user');
      const isLoggedOut = !localUser || localUser === 'null' || localUser === 'undefined' || localUser === '{}';

      if (isLoggedOut && !user) {
        setIsAuthOpen(true);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [pathname, user]);

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');

    if (savedLocation) {
      setSelectedLocation(savedLocation);
      return;
    }

    const applyDefaultLocation = () => {
      getPersonCity()
        .then((city) => {
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAuthSuccess = useCallback((userData) => {
    signIn(userData);
    setIsAuthOpen(false);
  }, [signIn]);

<<<<<<< HEAD
  const handleSignOut = useCallback(() => {
    signOut();
    setIsMobileMenuOpen(false);
  }, [signOut]);
  const handleCartClick = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    // Change this route if your cart page is elsewhere
    router.push("/services/swadisht/cart");
  };
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsServicesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 150);
  };

=======
>>>>>>> origin/main
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

          {pathname.startsWith('/partner') && (
            <div
              className={styles.servicesDropdown}
              ref={partnersDropdownRef}
              onMouseEnter={handlePartnersMouseEnter}
              onMouseLeave={handlePartnersMouseLeave}
            >
              <button
                className={styles.waitlistLink}
                onClick={() => setIsPartnersOpen(!isPartnersOpen)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', padding: 0 }}
              >
                PARTNER PROGRAMS <span className={styles.dropdownIcon} style={{ transform: isPartnersOpen ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: '0.65rem' }}>▼</span>
              </button>
              {isPartnersOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownContent}>
                    <Link href="/partner/creator" className={styles.dropdownItem}>
                      <div className={styles.dropdownItemName}>Partner as Creator</div>
                      <div className={styles.dropdownItemDesc}>Join as content creator</div>
                    </Link>
                    <Link href="/partner/vendor" className={styles.dropdownItem}>
                      <div className={styles.dropdownItemName}>Partner as Vendor</div>
                      <div className={styles.dropdownItemDesc}>Grow your business</div>
                    </Link>
                    <Link href="/partner/delivery" className={styles.dropdownItem}>
                      <div className={styles.dropdownItemName}>Partner as Delivery</div>
                      <div className={styles.dropdownItemDesc}>Earn flexible income</div>
                    </Link>
                    <Link href="/partner" className={styles.dropdownItem}>
                      <div className={styles.dropdownItemName}>Brand Partnership</div>
                      <div className={styles.dropdownItemDesc}>Collaborate with us</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className={styles.actions}>
            {/* Cart — routes straight to the Accesco Living Cart Page. Not to be reused by Grokly/Swadishtt/InstaStyle, which each own a separate, isolated cart. */}
            <Link href="/cart" className={styles.cartButton} aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 3H5L5.4 5M5.4 5H21L18 13H7M5.4 5L7 13M7 13L5.6 15.6C5.2 16.4 5.8 17.5 6.7 17.5H18M18 17.5C17 17.5 16.2 18.3 16.2 19.3C16.2 20.3 17 21 18 21C19 21 19.8 20.2 19.8 19.2C19.8 18.2 19 17.5 18 17.5ZM8.5 19.3C8.5 20.3 7.7 21 6.7 21C5.7 21 5 20.2 5 19.2C5 18.2 5.8 17.5 6.8 17.5C7.8 17.5 8.5 18.3 8.5 19.3Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>

            {/* Location Selector */}
<<<<<<< HEAD
            <div
              className={styles.locationSelector}
              ref={locationDropdownRef}
            >
              <button
=======
            <div className={styles.locationSelector}>
              <button 
>>>>>>> origin/main
                className={styles.locationButton}
                onClick={() => setIsLocationModalOpen(true)}
                aria-expanded={isLocationModalOpen}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1C5.24 1 3 3.24 3 6C3 9.5 8 15 8 15C8 15 13 9.5 13 6C13 3.24 10.76 1 8 1ZM8 7.5C7.17 7.5 6.5 6.83 6.5 6C6.5 5.17 7.17 4.5 8 4.5C8.83 4.5 9.5 5.17 9.5 6C9.5 6.83 8.83 7.5 8 7.5Z" fill="currentColor" />
                </svg>

                <span className={styles.locationText}>
                  {getDisplayLocation(selectedLocation)}
                </span>

                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className={`${styles.locationIcon} ${isLocationModalOpen ? styles.locationIconOpen : ''}`}
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
<<<<<<< HEAD

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
                        className={`${styles.locationItem} ${getDisplayLocation(selectedLocation) === location ? styles.selectedLocation : ''
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
=======
>>>>>>> origin/main
            </div>
            {/* Cart Button */}

            <button
              className={styles.cartButton}
              onClick={handleCartClick}
            >
              <Image
                src="/images/swadisht/categories/cart-green.png"
                alt="Cart"
                width={42}
                height={42}
                priority
              />

              {cartCount > 0 && (
                <span className={styles.cartBadge}>
                  {cartCount}
                </span>
              )}
            </button>


            {!isMounted ? (
              <button className={styles.loginButton}>
                Login
              </button>
            ) : user ? (
              <Link href="/profile" className={styles.userButton}>
                <div className={styles.avatar}>
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={`${user.name}'s profile`}
                    />
                  ) : (
                    initials
                  )}
                </div>
                <span>{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <button className={styles.loginButton} onClick={() => setIsAuthOpen(true)}>
                Login
              </button>
            )}

            <a href="#" className={`${styles.loginButton} ${styles.getAppButton}`}>
              <span className={styles.desktopText}>Get App</span>
              <span className={styles.mobileText}>Download</span>

              <Image
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googleplay.svg"
                alt="Google Play"
                className={styles.storeIcon}
                width={14}
                height={14}
                unoptimized
              />

              <Image
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/apple.svg"
                alt="App Store"
                className={styles.storeIcon}
                width={14}
                height={14}
                unoptimized
              />
            </a>
          </div>
        </div>
      </header>

<<<<<<< HEAD
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
=======
      {/* Conditionally rendered so heavy modal JS bundles only download when triggered */}
      {isAuthOpen && (
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onSuccess={handleAuthSuccess} 
        />
      )}

      {isLocationModalOpen && (
        <LocationModal 
          isOpen={isLocationModalOpen} 
          onClose={() => setIsLocationModalOpen(false)}
          onLocationSelect={(locationData) => {
            const { fullAddress, lat, lng } = locationData; 
            
            const parts = fullAddress.split(',');
            const resolvedArea = parts[0]?.trim() || fullAddress;
            const resolvedCity = parts[1]?.trim() || '';
>>>>>>> origin/main

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
      )}
    </>
  );
}