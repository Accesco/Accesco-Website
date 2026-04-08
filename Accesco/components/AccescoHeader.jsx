'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../app/components/AuthProvider';
import AuthModal from '../app/components/AuthModal';
import styles from './AccescoHeader.module.css';

export default function AccescoHeader() {
  const pathname = usePathname();
  const { user, signOut, signIn } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsServicesOpen(false);
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

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '';

  const services = [
    { name: 'Grokly', href: '/services/grokly', description: 'Fresh groceries in 22 mins' },
    { name: 'Swadishtt', href: '/services/swadisht', description: 'Home-style meals delivered' },
    { name: 'InstaStyle', href: '/services/instastyle', description: 'Fashion delivered fast' },
    { name: 'DineX', href: '/services/dinex', description: 'Premium dining experience' },
    { name: 'LocalMeds', href: '/services/localmeds', description: 'Medicines at your doorstep' },
    { name: 'Swadishtt Cafe', href: '/services/swadisht-cafe', description: 'Cafe experience at home' },
  ];

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <Image 
              src="/images/accesco_white.png" 
              alt="AccesCo" 
              width={36} 
              height={36} 
              priority 
              style={{ objectFit: 'contain' }}
            />
            <div className={styles.logoText}>
              <span className={styles.logoName}>Accesco</span>
              <span className={styles.logoTagline}>Living</span>
            </div>
          </Link>

          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/about" className={styles.navLink}>About Us</Link>
           
            
            {/* Services Dropdown */}
            <div 
              className={styles.servicesDropdown}
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={`${styles.navLink} ${styles.servicesButton}`}
                aria-expanded={isServicesOpen}
                aria-haspopup="true"
              >
                Services
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none"
                  className={styles.dropdownIcon}
                  style={{ transform: isServicesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
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

              {isServicesOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownContent}>
                    {services.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className={styles.dropdownItem}
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
              
            <Link href="/calculator" className={styles.navLink}>Xpense Meter</Link>
            <Link href="/partner" className={styles.navLink}>Partner</Link>
             <Link href="/blogs" className={styles.navLink}>Blogs</Link>
            <Link href="/contact" className={styles.navLink}>Contact Us</Link>
          </nav>

          <div className={styles.actions}>
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

            <button className={styles.mobileMenuButton} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuContent}>
          

          <nav className={styles.mobileNav}>
            <Link href="/" className={styles.mobileNavLink}>Home</Link>
            <Link href="/about" className={styles.mobileNavLink}>About Us</Link>
            
            {/* Mobile Services Dropdown */}
            <div className={styles.mobileServicesDropdown}>
              <button 
                className={styles.mobileServicesButton}
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                aria-expanded={isMobileServicesOpen}
              >
                <span>Services</span>
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none"
                  className={styles.mobileDropdownIcon}
                  style={{ transform: isMobileServicesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
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

              <div 
                className={`${styles.mobileServicesContent} ${isMobileServicesOpen ? styles.open : ''}`}
              >
                {services.map((service) => (
                  <Link 
                    key={service.href} 
                    href={service.href} 
                    className={styles.mobileServiceLink}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className={styles.mobileServiceName}>{service.name}</div>
                    <div className={styles.mobileServiceDesc}>{service.description}</div>
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/calculator" className={styles.mobileNavLink}>Xpense Meter</Link>
            <Link href="/partner" className={styles.mobileNavLink}>Partner With Us</Link>
            <Link href="/blogs" className={styles.mobileNavLink}>Blogs</Link>
            <Link href="/contact" className={styles.mobileNavLink}>Contact Us</Link>
          
          {user ? (
            <div className={styles.mobileUserCard}>
              <div className={styles.mobileAvatar}>{initials}</div>
              <div className={styles.mobileUserName}>{user.name}</div>
              <button className={styles.mobileSignOut} onClick={handleSignOut}>Sign Out</button>
            </div>
          ) : (
            <button className={styles.mobileLoginButton} onClick={() => { setIsMobileMenuOpen(false); setIsAuthOpen(true); }}>
              Login / Sign Up
            </button>
          )}
          
          </nav>
        </div>
      </div>

      {isMobileMenuOpen && <div className={styles.overlay} onClick={() => setIsMobileMenuOpen(false)} />}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </>
  );
}
