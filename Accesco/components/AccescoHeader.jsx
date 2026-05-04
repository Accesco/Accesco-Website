'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import AuthModal from '@/app/components/AuthModal';
import styles from './AccescoHeader.module.css';
import { getPersonCity } from '@/lib/locationService';

export default function AccescoHeader() {
  const pathname = usePathname();
  const { user, signOut, signIn } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isPartnersOpen, setIsPartnersOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobilePartnersOpen, setIsMobilePartnersOpen] = useState(false);
  const [isMobileLocationOpen, setIsMobileLocationOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Bengaluru, Karnataka');
  const dropdownRef = useRef(null);
  const partnersDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const partnersTimeoutRef = useRef(null);

  const locations = [
    'Bengaluru, Karnataka',
    'Mumbai, Maharashtra',
    'Delhi NCR',
    'Hyderabad, Telangana',
    'Chennai, Tamil Nadu',
    'Pune, Maharashtra',
  ];

  // Location detection — preserved exactly from original
  useEffect(() => {
    const savedLocation = localStorage.getItem('location');
    if (savedLocation) {
      setSelectedLocation(savedLocation);
      return;
    }
  }, []);

  // Scroll listener — transparent → glass after 60px
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Body scroll lock when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close dropdowns on outside click
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

  // Services dropdown — hover with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsServicesOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsServicesOpen(false), 150);
  };

  // Partners dropdown — hover with delay
  const handlePartnersMouseEnter = () => {
    if (partnersTimeoutRef.current) clearTimeout(partnersTimeoutRef.current);
    setIsPartnersOpen(true);
  };
  const handlePartnersMouseLeave = () => {
    partnersTimeoutRef.current = setTimeout(() => setIsPartnersOpen(false), 150);
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '';

  const services = [
    { name: 'Grokly',         href: '/services/grokly',        description: 'Fresh groceries in 22 mins' },
    { name: 'Swadishtt',      href: '/services/swadisht',      description: 'Home-style meals delivered' },
    { name: 'InstaStyle',     href: '/services/instastyle',    description: 'Fashion delivered fast' },
    { name: 'DineX',          href: '/services/dinex',         description: 'Premium dining experience' },
    { name: 'LocalMeds',      href: '/services/localmeds',     description: 'Medicines at your doorstep' },
    { name: 'Swadishtt Cafe', href: '/services/swadisht-cafe', description: 'Cafe experience at home' },
  ];

  const partnerOptions = [
    { name: 'Partner as Creator',  href: '/partner/creator',  description: 'Join as content creator' },
    { name: 'Partner as Vendor',   href: '/partner/vendor',   description: 'Grow your business' },
    { name: 'Partner as Delivery', href: '/partner/delivery', description: 'Earn flexible income' },
  ];

  // Truncate location for display
  const displayLocation = selectedLocation.length > 18
    ? selectedLocation.substring(0, 15) + '...'
    : selectedLocation;

  return (
    <>
      <header className={`${styles.header} ${isScrolled || pathname !== '/' ? styles.scrolled : ''}`}>
        <div className={styles.container}>

          {/* ── Logo ── */}
          <Link href="/" className={styles.logo}>
            <Image
              src={isScrolled || pathname !== '/' ? "/images/accesco-logo-black.PNG" : "/images/accesco_white.png"}
              alt="Accesco Living"
              width={36}
              height={36}
              priority
              style={{ 
                width: '36px', 
                height: '36px', 
                objectFit: 'contain',
                filter: (isScrolled || pathname !== '/') ? 'invert(15%) sepia(85%) saturate(4529%) hue-rotate(316deg) brightness(85%) contrast(101%)' : 'none'
              }}
            />
            <div className={styles.logoText}>
              <span className={styles.logoName}>Accesco</span>
              <span className={styles.logoTagline}>Living</span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className={styles.nav}>

            {/* Services Dropdown */}
            <div
              className={styles.servicesDropdown}
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`${styles.navLink} ${styles.servicesButton} ${pathname.startsWith('/services') ? styles.active : ''}`}
                aria-expanded={isServicesOpen}
                aria-haspopup="true"
              >
                Services
                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  className={styles.dropdownIcon}
                  style={{ transform: isServicesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isServicesOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownContent}>
                    {services.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className={`${styles.dropdownItem} ${pathname === service.href ? styles.activeDropdown : ''}`}
                        onClick={() => setIsServicesOpen(false)}
                      >
                        <div className={styles.dropdownItemName}>{service.name}</div>
                        <div className={styles.dropdownItemDesc}>{service.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Partners Dropdown */}
            <div
              className={styles.servicesDropdown}
              ref={partnersDropdownRef}
              onMouseEnter={handlePartnersMouseEnter}
              onMouseLeave={handlePartnersMouseLeave}
            >
              <button
                className={`${styles.navLink} ${styles.servicesButton} ${pathname.startsWith('/partner') ? styles.active : ''}`}
                aria-expanded={isPartnersOpen}
                aria-haspopup="true"
              >
                Become a Partner
                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  className={styles.dropdownIcon}
                  style={{ transform: isPartnersOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isPartnersOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownContent}>
                    {partnerOptions.map((option) => (
                      <Link
                        key={option.href}
                        href={option.href}
                        className={`${styles.dropdownItem} ${pathname === option.href ? styles.activeDropdown : ''}`}
                        onClick={() => setIsPartnersOpen(false)}
                      >
                        <div className={styles.dropdownItemName}>{option.name}</div>
                        <div className={styles.dropdownItemDesc}>{option.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/referral" className={`${styles.navLink} ${pathname === '/referral' ? styles.active : ''}`}>
              Invite & Earn <i className="ri-gift-line" style={{ marginLeft: '6px', fontSize: '1.1em' }}></i>
            </Link>
            <Link href="/blogs" className={`${styles.navLink} ${pathname === '/blogs' ? styles.active : ''}`}>Blogs</Link>
            <Link href="/contact" className={`${styles.navLink} ${pathname === '/contact' ? styles.active : ''}`}>Help &amp; Support</Link>
          </nav>

          {/* ── Right side actions ── */}
          <div className={styles.actions}>

            {/* Location Selector */}
            <div className={styles.locationSelector} ref={locationDropdownRef}>
              <button
                className={styles.locationButton}
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                aria-expanded={isLocationOpen}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1C5.24 1 3 3.24 3 6C3 9.5 8 15 8 15C8 15 13 9.5 13 6C13 3.24 10.76 1 8 1ZM8 7.5C7.17 7.5 6.5 6.83 6.5 6C6.5 5.17 7.17 4.5 8 4.5C8.83 4.5 9.5 5.17 9.5 6C9.5 6.83 8.83 7.5 8 7.5Z" fill="currentColor" />
                </svg>
                <span className={styles.locationText}>{displayLocation}</span>
                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  className={styles.locationIcon}
                  style={{ transform: isLocationOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isLocationOpen && (
                <div className={styles.locationDropdown}>
                  <div className={styles.locationDropdownHeader}>
                    <h4>Select Your Location</h4>
                  </div>
                  <div className={styles.locationList}>
                    {locations.map((location) => (
                      <button
                        key={location}
                        className={`${styles.locationItem} ${selectedLocation === location ? styles.selectedLocation : ''}`}
                        onClick={() => {
                          setSelectedLocation(location);
                          localStorage.setItem('userLocation', location);
                          setIsLocationOpen(false);
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                          <path d="M8 1C5.24 1 3 3.24 3 6C3 9.5 8 15 8 15C8 15 13 9.5 13 6C13 3.24 10.76 1 8 1ZM8 7.5C7.17 7.5 6.5 6.83 6.5 6C6.5 5.17 7.17 4.5 8 4.5C8.83 4.5 9.5 5.17 9.5 6C9.5 6.83 8.83 7.5 8 7.5Z" fill="currentColor" />
                        </svg>
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Login / User */}
            {user ? (
              <Link href="/profile" className={styles.userButton}>
                <div className={styles.avatar}>{initials}</div>
                <span>{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <button className={styles.loginButton} onClick={() => setIsAuthOpen(true)}>
                Login
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}>
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuContent}>

          {/* Drawer header */}
          <div className={styles.mobileMenuHeader}>
            <span className={styles.mobileMenuTitle}>Menu</span>
            <button className={styles.mobileMenuClose} onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className={styles.mobileNav}>
            {/* Services accordion */}
            <div className={styles.mobileServicesDropdown}>
              <button
                className={`${styles.mobileServicesButton} ${pathname.startsWith('/services') ? styles.active : ''}`}
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                aria-expanded={isMobileServicesOpen}
              >
                <span>Services</span>
                <svg
                  width="14" height="14" viewBox="0 0 12 12" fill="none"
                  className={styles.mobileDropdownIcon}
                  style={{ transform: isMobileServicesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className={`${styles.mobileServicesContent} ${isMobileServicesOpen ? styles.open : ''}`}>
                {services.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className={`${styles.mobileServiceLink} ${pathname === service.href ? styles.activeMobile : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className={styles.mobileServiceName}>{service.name}</div>
                    <div className={styles.mobileServiceDesc}>{service.description}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Partner accordion */}
            <div className={styles.mobileServicesDropdown}>
              <button
                className={`${styles.mobileServicesButton} ${pathname.startsWith('/partner') ? styles.active : ''}`}
                onClick={() => setIsMobilePartnersOpen(!isMobilePartnersOpen)}
                aria-expanded={isMobilePartnersOpen}
              >
                <span>Become a Partner</span>
                <svg
                  width="14" height="14" viewBox="0 0 12 12" fill="none"
                  className={styles.mobileDropdownIcon}
                  style={{ transform: isMobilePartnersOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className={`${styles.mobileServicesContent} ${isMobilePartnersOpen ? styles.open : ''}`}>
                {partnerOptions.map((option) => (
                  <Link
                    key={option.href}
                    href={option.href}
                    className={`${styles.mobileServiceLink} ${pathname === option.href ? styles.activeMobile : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className={styles.mobileServiceName}>{option.name}</div>
                    <div className={styles.mobileServiceDesc}>{option.description}</div>
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/referral" className={`${styles.mobileNavLink} ${pathname === '/referral' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              Invite & Earn <i className="ri-gift-line" style={{ marginLeft: '8px' }}></i>
            </Link>
            <Link href="/blogs" className={`${styles.mobileNavLink} ${pathname === '/blogs' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Blogs</Link>
            <Link href="/contact" className={`${styles.mobileNavLink} ${pathname === '/contact' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Help &amp; Support</Link>

            <div className={styles.mobileDivider} />

            {/* Location row — Accordion added per user request */}
            <div className={styles.mobileServicesDropdown}>
              <button
                className={styles.mobileServicesButton}
                onClick={() => setIsMobileLocationOpen(!isMobileLocationOpen)}
                aria-expanded={isMobileLocationOpen}
              >
                <div className={styles.mobileLocationRow}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1C5.24 1 3 3.24 3 6C3 9.5 8 15 8 15C8 15 13 9.5 13 6C13 3.24 10.76 1 8 1ZM8 7.5C7.17 7.5 6.5 6.83 6.5 6C6.5 5.17 7.17 4.5 8 4.5C8.83 4.5 9.5 5.17 9.5 6C9.5 6.83 8.83 7.5 8 7.5Z" fill="currentColor" />
                  </svg>
                  <span>{selectedLocation}</span>
                </div>
                <svg
                  width="14" height="14" viewBox="0 0 12 12" fill="none"
                  className={styles.mobileDropdownIcon}
                  style={{ transform: isMobileLocationOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className={`${styles.mobileServicesContent} ${isMobileLocationOpen ? styles.open : ''}`}>
                <div className={styles.mobileLocationList}>
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      className={`${styles.mobileLocationItem} ${selectedLocation === loc ? styles.activeLocation : ''}`}
                      onClick={() => {
                        setSelectedLocation(loc);
                        localStorage.setItem('userLocation', loc);
                        setIsMobileLocationOpen(false);
                      }}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Auth */}
            {user ? (
              <div className={styles.mobileUserCard}>
                <div className={styles.mobileAvatar}>{initials}</div>
                <div className={styles.mobileUserName}>{user.name}</div>
                <button className={styles.mobileSignOut} onClick={handleSignOut}>Sign Out</button>
              </div>
            ) : (
              <button
                className={styles.mobileLoginButton}
                onClick={() => { setIsMobileMenuOpen(false); setIsAuthOpen(true); }}
              >
                Login / Sign Up
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Backdrop overlay */}
      {isMobileMenuOpen && <div className={styles.overlay} onClick={() => setIsMobileMenuOpen(false)} />}

      {/* Auth Modal — backend preserved */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </>
  );
}
