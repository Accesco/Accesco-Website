'use client';

import { useState } from 'react';
import styles from './ColorSelector.module.css';

export default function ColorSelector({ colors, selectedColor, onColorChange }) {
  const [hoveredColor, setHoveredColor] = useState(null);

  return (
    <div className={styles.colorSelector}>
      <div className={styles.header}>
        <label className={styles.label}>Select Color</label>
        {selectedColor && (
          <span className={styles.colorName}>{selectedColor}</span>
        )}
      </div>

      <div className={styles.colorGrid}>
        {colors.map((color) => {
          const isSelected = selectedColor === color.name;
          const isHovered = hoveredColor === color.name;

          return (
            <button
              key={color.name}
              className={`${styles.colorButton} ${
                isSelected ? styles.selected : ''
              }`}
              onClick={() => onColorChange(color.name)}
              onMouseEnter={() => setHoveredColor(color.name)}
              onMouseLeave={() => setHoveredColor(null)}
              aria-label={`Color ${color.name}`}
              title={color.name}
            >
              <span
                className={styles.colorSwatch}
                style={{ backgroundColor: color.hex }}
              />
              {isSelected && (
                <span className={styles.checkmark}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!selectedColor && (
        <p className={styles.hint}>Please select a color</p>
      )}
    </div>
  );
}
