'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './DeliveryHero.module.css';

const DeliveryHero = () => {
  return (
    <section className={styles.section} id="delivery">
      {/* Background with Parallax effect simulation via motion */}
      <motion.div 
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 2 }}
        className={styles.bgWrapper}
      >
        <img 
          src="/instastyle_fashion_hero_1777395647380.png" 
          alt="Delivery Background" 
          className={styles.bgImage}
        />
        <div className={styles.overlay}></div>
      </motion.div>

      <div className={styles.container}>
        <div className={styles.content}>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.badge}
          >
            <span className={styles.pulse}></span>
            LIVE IN SELECT CITIES
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={styles.heading}
          >
            Style at<br />your door<br /><span className={styles.accent}>in 15 min.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={styles.description}
          >
            Why wait days for what you need tonight? Our hyper-local micro-fulfillment centers ensure your curated looks arrive faster than a pizza.
          </motion.p>

          <div className={styles.stats}>
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.6 }}
              className={styles.statItem}
            >
              <span className={styles.statLine}></span>
              <span className={styles.statNum}>15</span>
              <span className={styles.statLabel}>Avg Min</span>
            </motion.div>
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.7 }}
              className={styles.statItem}
            >
              <span className={styles.statLine}></span>
              <span className={styles.statNum}>Zero</span>
              <span className={styles.statLabel}>Shipping Fee</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Speed Lines Decoration */}
      <div className={styles.speedLines}>
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={i}
            animate={{ 
              x: [-1000, 2000],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2 + i,
              delay: i * 0.5,
              ease: "linear"
            }}
            className={styles.line}
            style={{ top: `${20 * i}%` }}
          />
        ))}
      </div>
    </section>
  );
};

export default DeliveryHero;
