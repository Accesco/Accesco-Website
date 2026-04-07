'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import styles from './InstaStyleHeader.module.css';

export default function InstaStyleHeader() {
  const pathname = usePathname();
  const { cart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

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

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  const navLinks = [
    { href: '/services/instastyle', label: 'Home', exact: true },
    { href: '/services/instastyle/catalog', label: 'Shop' },
    { href: '/services/instastyle/virtual-tryon', label: 'Virtual Try-On' },
    { href: '/services/instastyle/about', label: 'About' },
  ];

  const isActiveLink = (href, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header 
      className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
      role="banner"
    >
      <div className={styles.container}>
        {/* Logo */}
        <Link 
          href="/services/instastyle" 
          className={styles.logo}
          aria-label="InstaStyle Home"
        >
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>InstaStyle</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav} aria-label="Main navigation">
          <ul className={styles.navList}>
            {navLinks.map(({ href, label, exact }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.navLink} ${
                    isActiveLink(href, exact) ? styles.active : ''
                  }`}
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
          className={`${styles.searchForm} ${isSearchFocused ? styles.focused : ''}`}
          onSubmit={handleSearch}
          role="search"
        >
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={styles.searchInput}
            aria-label="Search products"
          />
          <button 
            type="submit" 
            className={styles.searchButton}
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
          <kbd className={styles.searchShortcut}>⌘K</kbd>
        </form>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Wishlist */}
          <Link
            href="/services/instastyle/wishlist"
            className={styles.actionButton}
            aria-label="Wishlist"
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
          <Link
            href="/services/instastyle/cart"
            className={styles.actionButton}
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
          </Link>

          {/* User Menu */}
          <Link
            href="/services/instastyle/profile"
            className={styles.actionButton}
            aria-label="User account"
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
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          <ul className={styles.mobileNavList}>
            {navLinks.map(({ href, label, exact }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.mobileNavLink} ${
                    isActiveLink(href, exact) ? styles.active : ''
                  }`}
                  aria-current={isActiveLink(href, exact) ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Search */}
          <form className={styles.mobileSearch} onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.mobileSearchInput}
              aria-label="Search products"
            />
            <button type="submit" className={styles.mobileSearchButton}>
              Search
            </button>
          </form>

          {/* Mobile Quick Links */}
          <div className={styles.mobileQuickLinks}>
            <Link href="/services/instastyle/wishlist" className={styles.mobileQuickLink}>
              Wishlist
            </Link>
            <Link href="/services/instastyle/orders" className={styles.mobileQuickLink}>
              Orders
            </Link>
            <Link href="/services/instastyle/profile" className={styles.mobileQuickLink}>
              Account
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
