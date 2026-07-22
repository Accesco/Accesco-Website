'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './more.module.css';

export default function InstaStyleMorePage() {
  const router = useRouter();
  const [credits, setCredits] = useState(120);
  const [userName, setUserName] = useState('Priya Sharma');

  useEffect(() => {
    try {
      const storedCredits = localStorage.getItem('instastyle_circular_credits');
      if (storedCredits) setCredits(Number(storedCredits));
      const user = localStorage.getItem('accesco_user');
      if (user) {
        const u = JSON.parse(user);
        if (u.name) setUserName(u.name);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className={styles.headerTitle}>More</h1>
      </header>

      <main className={styles.container}>
        {/* Profile Card */}
        <div className={styles.profileSection}>
          <div className={styles.avatar}>
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80" alt="Profile" />
          </div>
          <div>
            <h2 className={styles.userName}>{userName}</h2>
            <Link href="/services/instastyle/profile" className={styles.viewProfileLink}>
              View Profile
            </Link>
          </div>
        </div>

        {/* Primary Group */}
        <h3 className={styles.groupTitle}>Account & Orders</h3>
        <div className={styles.menuGroup}>
          <Link href="/services/instastyle/orders" className={styles.menuItem}>
            <div className={styles.menuItemLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <span>My Orders</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          <Link href="/services/instastyle/thrift#sell" className={styles.menuItem}>
            <div className={styles.menuItemLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>My Listings</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          <Link href="/services/instastyle/try-return" className={styles.menuItem}>
            <div className={styles.menuItemLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Try & Return</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          <Link href="/services/instastyle/circular-credits" className={styles.menuItem}>
            <div className={styles.menuItemLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              <span>Circular Credits</span>
            </div>
            <div className={styles.menuItemRight}>
              <span className={styles.creditsBadge}>{credits}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Secondary Group */}
        <h3 className={styles.groupTitle}>Preferences & Support</h3>
        <div className={styles.menuGroup}>
          <Link href="/services/instastyle/wishlist" className={styles.menuItem}>
            <div className={styles.menuItemLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span>Saved Items</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          <Link href="/faq" className={styles.menuItem}>
            <div className={styles.menuItemLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>Help & Support</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          <Link href="/services/instastyle/profile" className={styles.menuItem}>
            <div className={styles.menuItemLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Settings</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>

        {/* Log Out */}
        <button className={styles.logoutBtn} onClick={() => router.push('/auth/login')}>
          Log Out
        </button>
      </main>

      {/* Bottom Mobile Nav Bar */}
      <nav className={styles.bottomNav}>
        <Link href="/services/instastyle" className={styles.navItem}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <span>Home</span>
        </Link>
        <Link href="/services/instastyle/catalog" className={styles.navItem}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>Browse</span>
        </Link>
        <Link href="/services/instastyle/add-sku" className={styles.navItemSell}>
          <div className={styles.sellCameraIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <span>Sell</span>
        </Link>
        <Link href="/services/instastyle/orders" className={styles.navItem}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          <span>Orders</span>
        </Link>
        <Link href="/services/instastyle/profile/more" className={`${styles.navItem} ${styles.navItemActive}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}
