'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Home, Grid, Heart, User } from 'lucide-react';
import styles from './BottomNav.module.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', Icon: Home, href: '/services/grokly' },
  { id: 'categories', label: 'Categories', Icon: Grid, href: '/services/grokly/category/vegetables-fruits' },
  { id: 'wishlist', label: 'Wishlist', Icon: Heart, href: '/services/grokly/profile?view=wishlist' },
  { id: 'account', label: 'Account', Icon: User, href: '/services/grokly/profile?view=profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const getActiveTab = () => {
    if (pathname === '/services/grokly') return 'home';
    if (pathname.includes('/category')) return 'categories';
    if (pathname.includes('/profile')) {
      const view = searchParams.get('view');
      if (view === 'wishlist') return 'wishlist';
      return 'account';
    }
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <nav className={styles.bottomNav} role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
        const IconComponent = item.Icon;
        const isActive = item.id === activeTab;
        return (
          <button
            key={item.id}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            onClick={() => router.push(item.href)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <IconComponent className={styles.navIcon} size={20} aria-hidden="true" />
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

