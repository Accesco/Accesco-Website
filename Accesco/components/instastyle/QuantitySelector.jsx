'use client';

import styles from './QuantitySelector.module.css';

export default function QuantitySelector({ quantity, onQuantityChange, max = 10, min = 1 }) {
  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value);
    }
  };

  return (
    <div className={styles.quantitySelector}>
      <label className={styles.label}>Quantity</label>
      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={handleDecrement}
          disabled={quantity <= min}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          type="number"
          className={styles.input}
          value={quantity}
          onChange={handleInputChange}
          min={min}
          max={max}
          aria-label="Quantity"
        />
        <button
          className={styles.button}
          onClick={handleIncrement}
          disabled={quantity >= max}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      {max < 10 && (
        <p className={styles.maxHint}>Only {max} left in stock</p>
      )}
    </div>
  );
}
