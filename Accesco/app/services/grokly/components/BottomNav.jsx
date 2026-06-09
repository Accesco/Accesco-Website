/**
 * BottomNav Component - Mobile bottom navigation
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { Home, Grid, Gift, User } from 'lucide-react';
import { useGrokly } from '../contexts/GroklyContext';
import styles from './BottomNav.module.css';

/**
 * Navigation items
 */
const NAV_ITEMS = [
  { id: 'home', label: 'Home', Icon: Home, action: 'scrollTop' },
  { id: 'categories', label: 'Categories', Icon: Grid, action: 'showCategories' },
  { id: 'offers', label: 'Offers', Icon: Gift, action: 'showOffers' },
  { id: 'account', label: 'Account', Icon: User, action: 'showAccount' },
];

/**
 * BottomNav Component
 * Mobile bottom navigation bar
 */
export default function BottomNav() {
  const [activeTab, setActiveTab] = useState('home');
  const { openCart } = useGrokly();

  /**
   * Handle tab click with actual functionality
   */
  const handleTabClick = (tabId, action) => {
    setActiveTab(tabId);
    
    switch (action) {
      case 'scrollTop':
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
        
      case 'showCategories':
        // Scroll to category navigation
        const categoryNav = document.querySelector('[role="tablist"]');
        if (categoryNav) {
          categoryNav.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        break;
        
      case 'showOffers':
        // Filter to show only discounted products
        const mainContent = document.querySelector('main');
        if (mainContent) {
          mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // TODO: Trigger discount filter
        break;
        
      case 'showAccount':
        window.location.href = '/services/grokly/profile';
        break;
        
      default:
        console.log('Navigate to:', tabId);
    }
  };

  return (
    <nav className={styles.bottomNav} role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
        const IconComponent = item.Icon;
        return (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => handleTabClick(item.id, item.action)}
            aria-label={item.label}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            <IconComponent className={styles.navIcon} size={20} aria-hidden="true" />
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
