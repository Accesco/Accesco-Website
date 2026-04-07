'use client';

import { useState } from 'react';
import styles from './SizeSelector.module.css';

export default function SizeSelector({ sizes, inventory, selectedSize, onSizeChange }) {
  const [hoveredSize, setHoveredSize] = useState(null);

  const isSizeAvailable = (size) => {
    return inventory && inventory[size] > 0;
  };

  const getSizeStock = (size) => {
    return inventory ? inventory[size] || 0 : 0;
  };

  return (
    <div className={styles.sizeSelector}>
      <div className={styles.header}>
        <label className={styles.label}>Select Size</label>
        {selectedSize && (
          <span className={styles.stock}>
            {getSizeStock(selectedSize)} in stock
          </span>
        )}
      </div>

      <div className={styles.sizeGrid}>
        {sizes.map((size) => {
          const available = isSizeAvailable(size);
          const isSelected = selectedSize === size;
          const isHovered = hoveredSize === size;

          return (
            <button
              key={size}
              className={`${styles.sizeButton} ${
                isSelected ? styles.selected : ''
              } ${!available ? styles.disabled : ''}`}
              onClick={() => available && onSizeChange(size)}
              onMouseEnter={() => setHoveredSize(size)}
              onMouseLeave={() => setHoveredSize(null)}
              disabled={!available}
              aria-label={`Size ${size}${!available ? ' - Out of stock' : ''}`}
            >
              <span className={styles.sizeLabel}>{size}</span>
              {!available && (
                <span className={styles.outOfStock}>✕</span>
              )}
            </button>
          );
        })}
      </div>

      {!selectedSize && (
        <p className={styles.hint}>Please select a size</p>
      )}
    </div>
  );
}
