'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './FashionCollections.module.css';

const COLLECTIONS = [
  {
    id: 1,
    title: 'Minimalist Monotones',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
    className: styles.photoLarge
  },
  {
    id: 2,
    title: 'Street Heritage',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    className: styles.photoSquare
  },
  {
    id: 3,
    title: 'Evening Elegance',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    className: styles.photoPortrait
  }
];

const FashionCollections = () => {
  return (
    <section className={styles.section} id="collections">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Text Content */}
          <div className={styles.textColumn}>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={styles.eyebrow}
            >
              Curated for the Modern Aesthetic
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={styles.heading}
            >
              Your ultimate<br />fashion<br />Collections.
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={styles.description}
            >
              A meticulously edited selection of premium pieces sourced from over 500+ heritage brands and emerging designers worldwide.
            </motion.p>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.cta}
            >
              View All Collections
              <span className={styles.ctaArrow}>→</span>
            </motion.button>

            {/* Decorative Circular Seal */}
            <div className={styles.seal}>
              <svg viewBox="0 0 100 100">
                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0 " />
                <text>
                  <textPath href="#circlePath">
                    AUTHENTIC • PREMIUM • EXCLUSIVE • QUALITY • 
                  </textPath>
                </text>
              </svg>
            </div>
          </div>

          {/* Collage Column */}
          <div className={styles.collageColumn}>
            {COLLECTIONS.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className={`${styles.photoWrapper} ${item.className}`}
              >
                <div className={styles.photoOverlay}>
                  <span>{item.title}</span>
                </div>
                <img src={item.image} alt={item.title} className={styles.image} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FashionCollections;
