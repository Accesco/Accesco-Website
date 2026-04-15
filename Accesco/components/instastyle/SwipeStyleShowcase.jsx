'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './SwipeStyleShowcase.module.css';

const SwipeStyleShowcase = () => {
  return (
    <section className={styles.section} id="swipe-showcase">
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Headline Background */}
          <div className={styles.headlineWrapper}>
            <motion.h2 
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={styles.bgHeadline}
            >
              SWIPE
            </motion.h2>
            <motion.h2 
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`${styles.bgHeadline} ${styles.bgHeadlineOutline}`}
            >
              CLOTHES
            </motion.h2>
          </div>

          {/* Phone Mockup Container */}
          <div className={styles.phoneContainer}>
            <motion.div 
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className={styles.phoneMockup}
            >
              <div className={styles.phoneScreen}>
                {/* Simulated Swipe Card */}
                <motion.div 
                  animate={{ 
                    x: [0, 40, -40, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 4,
                    ease: "easeInOut"
                  }}
                  className={styles.swipeCard}
                >
                  <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80" alt="Swipe Item" />
                  <div className={styles.cardInfo}>
                    <span className={styles.brand}>Balenciaga</span>
                    <span className={styles.price}>$1,200</span>
                  </div>
                </motion.div>
                
                {/* Like/Dislike Icons */}
                <div className={styles.swipeActions}>
                  <div className={styles.actionIcon} style={{ borderColor: '#FF4B4B' }}>✕</div>
                  <div className={styles.actionIcon} style={{ borderColor: '#4BFF4B' }}>♥</div>
                </div>
              </div>
              <div className={styles.phoneBezel}></div>
            </motion.div>
          </div>

          {/* Explanatory Text */}
          <div className={styles.infoBox}>
            <motion.h3 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={styles.infoTitle}
            >
              Tinder for Fashion
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={styles.infoDesc}
            >
              Our proprietary SwipeStyle algorithm learns your aesthetic DNA with every match. The more you swipe, the more we understand your personal style.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SwipeStyleShowcase;
