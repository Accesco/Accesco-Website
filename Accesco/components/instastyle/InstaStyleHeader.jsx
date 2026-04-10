'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import InstaStyleLogo from './InstaStyleLogo';
import styles from './InstaStyleHeader.module.css';

export default function InstaStyleHeader() {
  const pathname = usePathname();
  const { cart, toggleCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Optimized scroll handler with RAF throttling
  useEffect(() => {
    let rafId = null;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (Math.abs(currentScrollY - lastScrollY) > 10) {
          setIsScrolled(currentScrollY > 50);
          lastScrollY = currentScrollY;
        }
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');

    const updateViewport = () => {
      setIsMobileViewport(mediaQuery.matches);
    };

    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);

    return () => {
      mediaQuery.removeEventListener('change', updateViewport);
    };
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/services/instastyle/catalog?search=${encodeURIComponent(searchQuery)}`;
    }
  }, [searchQuery]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const fallback = {
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: '#fff',
      borderBottom: '1px solid #ece7e2',
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      minHeight: '72px',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
    },
    logo: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      textDecoration: 'none',
      color: '#171411',
      fontWeight: 800,
      fontSize: '22px',
      flexShrink: 0,
    },
    logoMark: {
      width: '40px',
      height: '40px',
      flex: '0 0 auto',
    },
    logoText: {
      textDecoration: 'none',
      color: '#171411',
      letterSpacing: '-0.03em',
      fontWeight: 700,
      lineHeight: 1,
    },
    navList: {
      listStyle: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      margin: 0,
      padding: 0,
    },
    navLink: {
      textDecoration: 'none',
      color: '#171411',
      fontSize: '13px',
      fontWeight: 700,
      padding: '8px 12px',
      borderRadius: '999px',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
    },
    searchForm: {
      flex: 1,
      maxWidth: '460px',
      position: 'relative',
    },
    searchInput: {
      width: '100%',
      height: '40px',
      borderRadius: '999px',
      border: '1px solid rgba(23, 20, 17, 0.12)',
      padding: '0 44px 0 16px',
    },
    searchButton: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: '#171411',
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    actionButton: {
      width: '40px',
      height: '40px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#171411',
      textDecoration: 'none',
      border: 'none',
      background: 'transparent',
      borderRadius: '10px',
      cursor: 'pointer',
    },
    mobileMenuButton: {
      width: '40px',
      height: '40px',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      background: 'transparent',
      color: '#171411',
      borderRadius: '999px',
      cursor: 'pointer',
      padding: 0,
    },
    hamburger: {
      width: '20px',
      height: '14px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
    },
    hamburgerLine: {
      display: 'block',
      height: '2px',
      background: '#171411',
      borderRadius: '2px',
      transition: 'all 0.25s ease',
    },
    mobileMenu: {
      display: isMobileMenuOpen ? 'block' : 'none',
      transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
      borderTop: '1px solid rgba(23, 20, 17, 0.08)',
      background: 'rgba(255, 252, 248, 0.98)',
      padding: '12px 16px 16px',
    },
    mobileNavList: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'grid',
      gap: '8px',
    },
    mobileNavLink: {
      display: 'block',
      textDecoration: 'none',
      color: '#171411',
      fontSize: '14px',
      fontWeight: 700,
      padding: '10px 12px',
      borderRadius: '10px',
      background: 'rgba(255, 255, 255, 0.72)',
    },
    mobileSearch: {
      marginTop: '12px',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '8px',
    },
    mobileSearchInput: {
      minWidth: 0,
      height: '40px',
      border: '1px solid rgba(23, 20, 17, 0.12)',
      borderRadius: '10px',
      padding: '0 12px',
      background: '#fff',
    },
    mobileSearchButton: {
      height: '40px',
      border: 'none',
      borderRadius: '10px',
      padding: '0 14px',
      background: '#171411',
      color: '#fff',
      fontWeight: 700,
      cursor: 'pointer',
    },
    mobileQuickLinks: {
      marginTop: '12px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    mobileQuickLink: {
      textDecoration: 'none',
      color: '#171411',
      fontSize: '12px',
      fontWeight: 700,
      border: '1px solid rgba(23, 20, 17, 0.12)',
      borderRadius: '999px',
      padding: '6px 10px',
      background: 'rgba(255, 255, 255, 0.75)',
    },
    overlay: {
      display: isMobileMenuOpen ? 'block' : 'none',
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.25)',
      zIndex: 998,
    },
  };

  const navLinks = [
    { href: '/services/instastyle', label: 'Home', exact: true },
    { href: '/services/instastyle/catalog?category=women', label: 'Women' },
    { href: '/services/instastyle/catalog?category=men', label: 'Men' },
    { href: '/services/instastyle/catalog?category=kids', label: 'Kids' },
    { href: '/services/instastyle/catalog?category=accessories', label: 'Accessories' },
    { href: '/services/instastyle/virtual-tryon', label: 'Virtual Try-On' },
    { href: '/services/instastyle/swipestyle', label: 'SwipeStyle' },
  ];

  const isActiveLink = (href, exact = false) => {
    const baseHref = href.split('?')[0];
    if (exact) return pathname === baseHref;
    return pathname.startsWith(baseHref);
  };

  return (
    <header 
      className={`instaHeaderShell ${styles.header} ${isScrolled ? styles.scrolled : ''}`}
      style={fallback.header}
      role="banner"
    >
      <div className={`instaHeaderContainer ${styles.container}`} style={fallback.container}>
        {/* Logo */}
        <Link 
          href="/services/instastyle" 
          className={`instaHeaderLogo ${styles.logo}`}
          style={fallback.logo}
          aria-label="InstaStyle Home"
        >
          <InstaStyleLogo className={`instaHeaderLogoMark ${styles.logoMark}`} style={fallback.logoMark} />
          <span className={`instaHeaderLogoText ${styles.logoText}`} style={fallback.logoText}>InstaStyle</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={`instaHeaderNav ${styles.nav}`} aria-label="Main navigation">
          <ul className={`instaHeaderNavList ${styles.navList}`} style={fallback.navList}>
            {navLinks.map(({ href, label, exact }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`instaHeaderNavLink ${styles.navLink} ${
                    isActiveLink(href, exact) ? styles.active : ''
                  }`}
                  style={fallback.navLink}
                  aria-current={isActiveLink(href, exact) ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Search Bar */}
        <form 
          className={`instaHeaderSearch ${styles.searchForm} ${isSearchFocused ? styles.focused : ''}`}
          style={fallback.searchForm}
          onSubmit={handleSearch}
          role="search"
        >
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`instaHeaderSearchInput ${styles.searchInput}`}
            style={fallback.searchInput}
            aria-label="Search products"
          />
          <button 
            type="submit" 
            className={`instaHeaderSearchButton ${styles.searchButton}`}
            style={fallback.searchButton}
            aria-label="Submit search"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path 
                d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>

        {/* Actions */}
        <div className={`instaHeaderActions ${styles.actions}`} style={fallback.actions}>
          {/* Wishlist */}
          <Link
            href="/services/instastyle/wishlist"
            className={`instaHeaderActionButton ${styles.actionButton}`}
            style={fallback.actionButton}
            aria-label="Wishlist"
            title="Wishlist"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Cart */}
          <button
            type="button"
            onClick={toggleCart}
            className={`instaHeaderActionButton ${styles.actionButton}`}
            style={fallback.actionButton}
            aria-label={`Shopping cart with ${cartItemCount} items`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 2L7 6H3l3 14h12l3-14h-4l-2-4H9z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {cartItemCount > 0 && (
              <span className={styles.badge} aria-label={`${cartItemCount} items`}>
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          <Link
            href="/services/instastyle/profile"
            className={`instaHeaderActionButton ${styles.actionButton}`}
            style={fallback.actionButton}
            aria-label="Account"
            title="Account"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Mobile Menu Toggle */}
          {isMobileViewport && (
            <button
              className={`instaHeaderMobileMenuButton ${styles.mobileMenuButton}`}
              style={fallback.mobileMenuButton}
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className={`instaHeaderHamburger ${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`} style={fallback.hamburger}>
                <span
                  style={{
                    ...fallback.hamburgerLine,
                    transform: isMobileMenuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
                  }}
                ></span>
                <span
                  style={{
                    ...fallback.hamburgerLine,
                    opacity: isMobileMenuOpen ? 0 : 1,
                  }}
                ></span>
                <span
                  style={{
                    ...fallback.hamburgerLine,
                    transform: isMobileMenuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
                  }}
                ></span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`instaHeaderMobileMenu ${styles.mobileMenu} ${isMobileMenuOpen ? `instaHeaderMobileMenuOpen ${styles.open}` : ''}`}
        style={fallback.mobileMenu}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav className={`instaHeaderMobileNav ${styles.mobileNav}`} aria-label="Mobile navigation">
          <ul className={`instaHeaderMobileNavList ${styles.mobileNavList}`} style={fallback.mobileNavList}>
            {navLinks.map(({ href, label, exact }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`instaHeaderMobileNavLink ${styles.mobileNavLink} ${
                    isActiveLink(href, exact) ? styles.active : ''
                  }`}
                  style={fallback.mobileNavLink}
                  aria-current={isActiveLink(href, exact) ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Search */}
          <form className={`instaHeaderMobileSearch ${styles.mobileSearch}`} style={fallback.mobileSearch} onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`instaHeaderMobileSearchInput ${styles.mobileSearchInput}`}
              style={fallback.mobileSearchInput}
              aria-label="Search products"
            />
            <button type="submit" className={`instaHeaderMobileSearchButton ${styles.mobileSearchButton}`} style={fallback.mobileSearchButton}>
              Search
            </button>
          </form>

          {/* Mobile Quick Links */}
          <div className={`instaHeaderMobileQuickLinks ${styles.mobileQuickLinks}`} style={fallback.mobileQuickLinks}>
            <Link href="/services/instastyle/checkout" className={`instaHeaderMobileQuickLink ${styles.mobileQuickLink}`} style={fallback.mobileQuickLink}>
              Checkout
            </Link>
            <Link href="/services/instastyle/catalog" className={`instaHeaderMobileQuickLink ${styles.mobileQuickLink}`} style={fallback.mobileQuickLink}>
              New Arrivals
            </Link>
            <Link href="/services/instastyle/virtual-tryon" className={`instaHeaderMobileQuickLink ${styles.mobileQuickLink}`} style={fallback.mobileQuickLink}>
              Style Preview
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className={`instaHeaderOverlay ${styles.overlay}`}
          style={fallback.overlay}
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
