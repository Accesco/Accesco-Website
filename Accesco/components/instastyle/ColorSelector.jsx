"use client";

import { useState } from "react";
import styles from "./ColorSelector.module.css";

const normalizeColorName = (value) => {
  if (!value) return "";
  return String(value).trim().toLowerCase();
};

export default function ColorSelector({
  colors,
  selectedColor,
  onColorChange,
  variants,
}) {
  const [hoveredColor, setHoveredColor] = useState(null);

  const isColorAvailable = (colorName) => {
    if (!Array.isArray(variants) || variants.length === 0) {
      return true;
    }

    const targetColor = normalizeColorName(colorName);
    return variants.some((variant) => {
      const variantColor = normalizeColorName(
        variant.color ||
          variant.colorName ||
          variant.color_id ||
          variant.colorId,
      );
      const variantStock =
        typeof variant.stock === "number"
          ? variant.stock
          : Number(variant.stock || 0);
      return variantColor === targetColor && variantStock > 0;
    });
  };

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
          const available = isColorAvailable(color.name);

          return (
            <button
              key={color.name}
              className={`${styles.colorButton} ${
                isSelected ? styles.selected : ""
              }`}
              onClick={() => available && onColorChange(color.name)}
              onMouseEnter={() => setHoveredColor(color.name)}
              onMouseLeave={() => setHoveredColor(null)}
              aria-label={`Color ${color.name}`}
              title={color.name}
              disabled={!available}
              style={{
                opacity: available ? 1 : 0.35,
                cursor: available ? "pointer" : "not-allowed",
              }}
            >
              <span
                className={styles.colorSwatch}
                style={{ backgroundColor: color.hex }}
              />
              {isSelected && (
                <span className={styles.checkmark}>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!selectedColor && <p className={styles.hint}>Please select a color</p>}
    </div>
  );
}
