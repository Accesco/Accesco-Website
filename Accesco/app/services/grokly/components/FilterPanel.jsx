/**
 * FilterPanel Component - Zepto-style horizontal filters
 * @version 2.0.0
 */

'use client';

import { useState } from 'react';
import styles from './FilterPanel.module.css';

/**
 * FilterPanel Component
 * Horizontal scrollable filter chips like Zepto
 */
export default function FilterPanel({ onFilterChange, onSortChange, activeFilters = {} }) {
  const [sortBy, setSortBy] = useState('');

  /**
   * Quick filter options
   */
  const quickFilters = [
    { id: 'all', label: 'All', icon: '🛒' },
    { id: 'bestseller', label: 'Bestseller', icon: '⚡' },
    { id: 'discount', label: 'On Sale', icon: '🏷️' },
    { id: 'under-50', label: 'Under ₹50', icon: '💰' },
    { id: 'under-100', label: 'Under ₹100', icon: '💵' },
    { id: 'premium', label: 'Premium', icon: '✦' },
    { id: 'low-stock', label: 'Low Stock', icon: '⚠️' },
  ];

  /**
   * Sort options
   */
  const sortOptions = [
    { value: '', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'discount', label: 'Discount' },
    { value: 'rating', label: 'Rating' },
  ];

  /**
   * Handle filter chip click
   */
  const handleFilterClick = (filterId) => {
    if (onFilterChange) {
      onFilterChange(filterId);
    }
  };

  /**
   * Handle sort change
   */
  const handleSortChange = (value) => {
    setSortBy(value);
    if (onSortChange) onSortChange(value);
  };

  return (
    <div className={styles.filterPanel}>
      {/* Horizontal Filter Chips */}
      <div className={styles.filterChips}>
        {quickFilters.map((filter) => (
          <button
            key={filter.id}
            className={`${styles.filterChip} ${activeFilters[filter.id] ? styles.active : ''}`}
            onClick={() => handleFilterClick(filter.id)}
            aria-pressed={activeFilters[filter.id]}
          >
            <span className={styles.filterIcon} aria-hidden="true">{filter.icon}</span>
            <span className={styles.filterLabel}>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Sort Dropdown (Compact) */}
      <div className={styles.sortSection}>
        <select 
          className={styles.sortSelect}
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          aria-label="Sort products"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
