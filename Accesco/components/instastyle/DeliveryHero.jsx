'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './DeliveryHero.module.css';

const DeliveryHero = () => {
  return (
    <section className={styles.section} id="delivery">
      {/* Background with subtle zoom effect */}
      <motion.div 
        initial={{ scale: 1.05 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className={styles.bgWrapper}
      >
        <Image
          src="/instastyle_fashion_hero_1777395647380.png"
          alt="Premium Service"
          fill
          sizes="100vw"
          priority
          className={styles.bgImage}
        />
        <div className={styles.overlay}></div>
      </motion.div>

      <div className={styles.container}>
        <div className={styles.content}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.badge}
          >
            Consierge Service
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={styles.heading}
          >
            Artisanal<br />delivery<br /><span className={styles.accent}>redefined.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className={styles.description}
          >
            Experience a new standard of logistical excellence. Our white-glove courier 
            service ensures your curated selections arrive with the precision and care 
            they deserve.
          </motion.p>

          <div className={styles.stats}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className={styles.statItem}
            >
              <span className={styles.statLabel}>Priority Handling</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className={styles.statItem}
            >
              <span className={styles.statLabel}>Secure Consignment</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryHero;
