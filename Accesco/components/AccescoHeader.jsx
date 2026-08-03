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
  
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isPartnersOpen, setIsPartnersOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobilePartnersOpen, setIsMobilePartnersOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('{"city":"Bengaluru, Karnataka"}');
  const dropdownRef = useRef(null);
  const partnersDropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const partnersTimeoutRef = useRef(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (pathname !== '/') return;

    if (user) {
      setIsAuthOpen(false);
    }
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
            {/* Location Selector */}
            <div className={styles.locationSelector}>
              <button 
                className={styles.locationButton}
                onClick={() => setIsLocationModalOpen(true)}
                aria-expanded={isLocationModalOpen}
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
            </div>

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
              />

              <Image
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/apple.svg"
                alt="App Store"
                className={styles.storeIcon}
                width={14}
                height={14}
              />
            </a>
          </div>
        </div>
      </header>

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