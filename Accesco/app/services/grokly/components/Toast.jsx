/**
 * Toast Component - Toast notifications
 * @version 1.0.0
 */

'use client';

import { useEffect } from 'react';
import styles from './Toast.module.css';

/**
 * Toast icons by type
 */
const TOAST_ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

/**
 * Toast Component
 * Displays temporary notification messages
 * 
 * @param {Object} props
 * @param {string} props.message - Toast message
 * @param {string} props.type - Toast type (success, error, warning, info)
 * @param {number} props.duration - Duration in ms (default: 3000)
 * @param {Function} props.onClose - Callback when toast closes
 */
export default function Toast({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div className={styles.toastContainer}>
      <div 
        className={`${styles.toast} ${styles[type]}`}
        role="alert"
        aria-live="polite"
      >
        <span className={styles.toastIcon} aria-hidden="true">
          {TOAST_ICONS[type]}
        </span>
        <span className={styles.toastMessage}>{message}</span>
      </div>
    </div>
  );
}
