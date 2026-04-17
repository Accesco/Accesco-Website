'use client';

import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import styles from './SwipeStyleShowcase.module.css';

const SwipeStyleShowcase = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Cursor going right → image moves right (x: -15 to 15), etc.
  const imgX = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const imgY = useTransform(mouseY, [-0.5, 0.5], [-20, 20]);

  return (
    <section
      className={styles.section}
      id="swipe-showcase"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
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
                {/* Simulated Swipe Card — auto-shaking preserved */}
                <motion.div
                  animate={{
                    x: [0, 40, -40, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: 'easeInOut',
                  }}
                  className={styles.swipeCard}
                >
                  {/* Inner image follows mouse cursor */}
                  <motion.img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80"
                    alt="Swipe Item"
                    style={{
                      x: imgX,
                      y: imgY,
                      scale: 1.15,
                    }}
                    transition={{ type: 'spring', stiffness: 80, damping: 25 }}
                    className={styles.swipeCardImg}
                  />
                  <div className={styles.cardInfo}>
                    <span className={styles.brand}>Balenciaga</span>
                    <span className={styles.price}>$1,200</span>
                  </div>
                </motion.div>

                {/* Like/Dislike Icons */}
                <div className={styles.swipeActions}>
                  <div className={styles.actionIcon} style={{ borderColor: '#FF4040', backgroundColor: '#FF4040', color: '#FFF' }}>✕</div>
                  <div className={styles.actionIcon} style={{ borderColor: '#22c55e', backgroundColor: '#22c55e', color: '#FFF' }}>♥</div>
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
