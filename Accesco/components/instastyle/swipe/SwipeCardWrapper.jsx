'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { SWIPE_CONFIG } from '../../../lib/services/recommendation/config.js';
import ProductCard from '../ProductCard.jsx'; // EXPLICITLY EXTENDS your verified ProductCard component
import styles from '../../../app/services/instastyle/swipestyle/swipestyle.module.css';

export const SwipeCardWrapper = ({ product, onSwipe, isTopCard }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();

  // Maps physical x drag parameters to dynamic rotational styles
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const dislikeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = async (_event, info) => {
    if (!isTopCard) return;

    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > SWIPE_CONFIG.ANIMATION_SWIPE_LIMIT || velocity > 500) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
      onSwipe(product.id, 'like');
    } else if (offset < -SWIPE_CONFIG.ANIMATION_SWIPE_LIMIT || velocity < -500) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
      onSwipe(product.id, 'dislike');
    } else {
      controls.start({ x: 0, y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  return (
    <motion.div
      drag={isTopCard}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      style={{
        x,
        y,
        rotate,
        opacity,
        touchAction: 'none',
        position: 'absolute',
        zIndex: isTopCard ? 10 : 1,
      }}
      className={styles.card}
    >
      {isTopCard && (
        <>
          <motion.div style={{ opacity: likeOpacity }} className={styles.badgeAdd}>
            LIKE
          </motion.div>
          <motion.div style={{ opacity: dislikeOpacity }} className={styles.badgeRemove}>
            NOPE
          </motion.div>
        </>
      )}

      {/* Renders your original, fully styled ProductCard component internally */}
      <ProductCard product={product} />
    </motion.div>
  );
};