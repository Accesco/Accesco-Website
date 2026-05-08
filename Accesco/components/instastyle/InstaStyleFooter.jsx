'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import InstaStyleLogo from './InstaStyleLogo';
import styles from './InstaStyleFooter.module.css';

export default function InstaStyleFooter() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: 'New Arrivals', href: '/services/instastyle/catalog?sort=newest' },
      { label: 'Best Sellers', href: '/services/instastyle/catalog?sort=popular' },
      { label: 'Sale', href: '/services/instastyle/catalog?sale=true' },
      { label: 'Virtual Try-On', href: '/services/instastyle/virtual-tryon' },
      { label: 'SwipeStyle Discovery', href: '/services/instastyle/swipestyle' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/services/instastyle/careers' },
      { label: 'Press', href: '/services/instastyle/press' },
      { label: 'Blog', href: '/services/instastyle/blogs' },
    ],
    support: [
      { label: 'Help Center', href: '/services/instastyle/help' },
      { label: 'Track Order', href: '/services/instastyle/orders' },
      { label: 'Returns', href: '/services/instastyle/returns' },
      { label: 'Shipping Info', href: '/services/instastyle/shipping' },
      { label: 'Size Guide', href: '/services/instastyle/size-guide' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/services/instastyle/privacy' },
      { label: 'Terms of Service', href: '/services/instastyle/terms' },
      { label: 'Cookie Policy', href: '/services/instastyle/cookies' },
      { label: 'Accessibility', href: '/services/instastyle/accessibility' },
    ],
  };

  const socialLinks = [
    { 
      name: 'Instagram', 
      href: 'https://www.instagram.com/accescoliving?igsh=MWI5dHBuOTB4Nm1uYQ==',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    },
    { 
      name: 'Twitter / X', 
      href: 'https://x.com/accesco_living?s=21',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    { 
      name: 'YouTube', 
      href: 'https://www.youtube.com/@accescoliving',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    },
    { 
      name: 'LinkedIn', 
      href: 'https://www.linkedin.com/company/acceso-living/',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    },
    { 
      name: 'Threads', 
      href: 'https://www.threads.net/@accescoliving',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.125 14.5c-1.25 0-2.375-.5-3-1.375l-.375-.375c-.5-.625-.875-1.375-1-2.25-.125-.625-.125-1.25 0-1.875.125-.875.5-1.625 1-2.25l.375-.375c.625-.875 1.75-1.375 3-1.375 2.5 0 4.375 1.875 4.375 4.375s-1.875 4.375-4.375 4.375zm0-7.25c-1.625 0-2.875 1.25-2.875 2.875s1.25 2.875 2.875 2.875 2.875-1.25 2.875-2.875-1.25-2.875-2.875-2.875zm2.875 4.25c-.125.75-.5 1.375-1.125 1.875-.5.375-1.125.625-1.75.625s-1.25-.25-1.75-.625c-.625-.5-1-1.125-1.125-1.875h-1.25c.125 1.375.875 2.5 1.875 3.125.625.375 1.5.625 2.25.625s1.625-.25 2.25-.625c1-.625 1.75-1.75 1.875-3.125h-1.25z" />
        </svg>
      )
    },
  ];

  const paymentMethods = ['Visa', 'Mastercard', 'AmEx', 'PayPal', 'UPI'];

  return (
    <footer className={styles.footer} role="contentinfo" data-instastyle-footer="true">
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.brandColumn}>
              <Link href="/services/instastyle" className={styles.footerLogo}>
                <InstaStyleLogo className={styles.logoMark} />
                <span className={styles.logoText}>InstaStyle</span>
              </Link>
              <p className={styles.brandDescription}>
                Accesco's fashion vertical built around fast discovery, curated edits,
                and try-before-you-buy convenience.
              </p>
              
              <div className={styles.social}>
                {socialLinks.map(({ name, href, icon }) => (
                  <a
                    key={name}
                    href={href}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${name}`}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            <div className={styles.linksColumn}>
              <h3 className={styles.columnTitle}>Shop</h3>
              <ul className={styles.linksList}>
                {footerLinks.shop.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className={styles.link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linksColumn}>
              <h3 className={styles.columnTitle}>Company</h3>
              <ul className={styles.linksList}>
                {footerLinks.company.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className={styles.link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linksColumn}>
              <h3 className={styles.columnTitle}>Support</h3>
              <ul className={styles.linksList}>
                {footerLinks.support.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className={styles.link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linksColumn}>
              <h3 className={styles.columnTitle}>Legal</h3>
              <ul className={styles.linksList}>
                {footerLinks.legal.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className={styles.link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.container}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © {currentYear} InstaStyle. All rights reserved.
            </p>
            
            <div className={styles.paymentMethods}>
              <span className={styles.paymentLabel}>We accept:</span>
              {paymentMethods.map((method) => (
                <span key={method} className={styles.paymentMethod}>
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
