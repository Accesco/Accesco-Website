/**
 * CategoryNav Component - Category Navigation
 * @version 1.0.0
 */

'use client';

import { useRef, useEffect } from 'react';
import styles from './CategoryNav.module.css';

export default function CategoryNav({ 
  categories, 
  activeCategory, 
  onCategorySelect 
}) {
  const navRef = useRef(null);

  // Auto-scroll to active category
  useEffect(() => {
    if (navRef.current && activeCategory) {
      const activeElement = navRef.current.querySelector(`[data-category="${activeCategory}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeCategory]);

  return (
    <nav className={styles.subnav} aria-label="Product categories">
      <div className={styles.subnavInner} ref={navRef}>
        {categories.map((category) => (
          <button
            key={category.id}
            data-category={category.id}
            className={`${styles.catChip} ${activeCategory === category.id ? styles.active : ''}`}
            onClick={() => onCategorySelect(category.id)}
            aria-label={`Filter by ${category.name}`}
            aria-pressed={activeCategory === category.id}
          >
            <img 
              src={category.image} 
              alt="" 
              className={styles.catChipImg}
              loading="lazy"
            />
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
