'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './Select.module.css';

export default function Select({ label, value, options, onChange, placeholder = 'Select option' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const selectedLabel = options.find(opt => (typeof opt === 'string' ? opt : opt.value) === value);
  const displayLabel = selectedLabel 
    ? (typeof selectedLabel === 'string' ? selectedLabel : selectedLabel.label)
    : placeholder;

  return (
    <div className={styles.container} ref={containerRef}>
      {label && <span className={styles.label}>{label}</span>}
      <button 
        type="button" 
        className={`${styles.trigger} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayLabel}</span>
        <svg 
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`} 
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option, index) => {
            const optValue = typeof option === 'string' ? option : option.value;
            const optLabel = typeof option === 'string' ? option : option.label;
            const isSelected = optValue === value;

            return (
              <div 
                key={index} 
                className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                onClick={() => handleSelect(optValue)}
              >
                {optLabel}
                {isSelected && (
                  <span className={styles.check}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
