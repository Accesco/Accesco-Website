/**
 * BottomNav Component - Mobile bottom navigation
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import styles from './BottomNav.module.css';

/**
 * Navigation items
 */
const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'categories', label: 'Categories', icon: '📦' },
  { id: 'offers', label: 'Offers', icon: '🎁' },
  { id: 'account', label: 'Account', icon: '👤' },
];

/**
 * BottomNav Component
 * Mobile bottom navigation bar
 */
export default function BottomNav() {
  const [activeTab, setActiveTab] = useState('home');

  /**
   * Handle tab click
   */
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // TODO: Implement navigation logic
    console.log('Navigate to:', tabId);
  };

  return (
    <nav className={styles.bottomNav} role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
          onClick={() => handleTabClick(item.id)}
          aria-label={item.label}
          aria-current={activeTab === item.id ? 'page' : undefined}
        >
          <span className={styles.navIcon} aria-hidden="true">{item.icon}</span>
          <span className={styles.navLabel}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
