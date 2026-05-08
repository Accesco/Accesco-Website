'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './size-memory.module.css';

const BRANDS = ['Zara', 'H&M', 'Levi\'s', 'Uniqlo', 'Nike', 'Adidas', 'Gucci'];
const SIZES_TOP = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SIZES_BOTTOM = ['28', '30', '32', '34', '36', '38', '40'];
const SIZES_FOOTWEAR = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];

export default function SizeMemoryEngine() {
  const [profile, setProfile] = useState({
    topwearBrand: '',
    topwearSize: '',
    bottomwearBrand: '',
    bottomwearSize: '',
    footwearBrand: '',
    footwearSize: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Fetch existing profile
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/size-memory');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile(data.profile);
          }
        }
      } catch (error) {
        console.error('Failed to load size memory profile', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/size-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      if (res.ok) {
        setStatus({ type: 'success', message: 'Size profile saved successfully. We will remember this for your next orders!' });
      } else {
        setStatus({ type: 'error', message: 'Failed to save profile. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An error occurred. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Size Memory Engine
          </motion.h1>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Tell us your best-fitting sizes across your favorite brands. We'll automatically translate your size when you shop other brands to ensure a perfect fit every time.
          </motion.p>
        </div>

        <motion.form 
          className={styles.formCard}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* TOPWEAR */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              👕 Topwear
            </h2>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Reference Brand</label>
                <select name="topwearBrand" value={profile.topwearBrand} onChange={handleChange} className={styles.select}>
                  <option value="">Select Brand</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Your Size in this Brand</label>
                <select name="topwearSize" value={profile.topwearSize} onChange={handleChange} className={styles.select}>
                  <option value="">Select Size</option>
                  {SIZES_TOP.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* BOTTOMWEAR */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              👖 Bottomwear
            </h2>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Reference Brand</label>
                <select name="bottomwearBrand" value={profile.bottomwearBrand} onChange={handleChange} className={styles.select}>
                  <option value="">Select Brand</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Your Size in this Brand</label>
                <select name="bottomwearSize" value={profile.bottomwearSize} onChange={handleChange} className={styles.select}>
                  <option value="">Select Size</option>
                  {SIZES_BOTTOM.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* FOOTWEAR */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              👟 Footwear
            </h2>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Reference Brand</label>
                <select name="footwearBrand" value={profile.footwearBrand} onChange={handleChange} className={styles.select}>
                  <option value="">Select Brand</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Your Size in this Brand</label>
                <select name="footwearSize" value={profile.footwearSize} onChange={handleChange} className={styles.select}>
                  <option value="">Select Size</option>
                  {SIZES_FOOTWEAR.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Saving Profile...' : 'Save Size Profile'}
          </button>

          {status && (
            <div className={`${styles.statusMessage} ${status.type === 'success' ? styles.statusSuccess : styles.statusError}`}>
              {status.message}
            </div>
          )}
        </motion.form>
      </div>
    </div>
  );
}
