'use client';

import React from 'react';
import { SwipeCardWrapper } from './SwipeCardWrapper.jsx';
import { DeckSkeleton } from './DeckSkeleton.jsx';
import styles from '../../../app/services/instastyle/swipestyle/swipestyle.module.css';

export const SwipeDeck = ({ deck, loading, error, onSwipe, onRefetch }) => {
  if (loading) {
    return <DeckSkeleton />;
  }

  if (error) {
    return (
      <div className={styles.swipeCenterStatus}>
        <div className={styles.swipeErrorText}>Error loading recommendations</div>
        <p className={styles.swipeCenterSubtitle}>{error}</p>
        <button onClick={onRefetch} className={styles.swipeActionButton}>
          Retry
        </button>
      </div>
    );
  }

  if (deck.length === 0) {
    return (
      <div className={styles.swipeCenterStatus} style={{ border: '1px dashed #d1d5db', borderRadius: '24px', backgroundColor: '#f9fafb', width: '100%' }}>
        <div className={styles.swipeCenterTitle}>You're All Caught Up!</div>
        <p className={styles.swipeCenterSubtitle}>
          We have updated your style preferences. Check back later for fresh recommendations.
        </p>
        <button onClick={onRefetch} className={styles.swipeActionButton}>
          Refresh Deck
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.swipeDeckContainer}>
        {deck[1] && (
          <div className={styles.cardBehindWrapper}>
            <div className={styles.cardBehind}>
              <SwipeCardWrapper
                product={deck[1]}
                onSwipe={onSwipe}
                isTopCard={false}
              />
            </div>
          </div>
        )}
        <SwipeCardWrapper
          key={deck[0].id}
          product={deck[0]}
          onSwipe={onSwipe}
          isTopCard={true}
        />
      </div>

      <div className={styles.swipeControlsOverlay}>
        <button className={`${styles.swipeBtn} ${styles.swipeBtnDislike}`} onClick={() => onSwipe(deck[0].id, 'dislike')}>
          ✕
        </button>
        <button className={`${styles.swipeBtn} ${styles.swipeBtnSuperlike}`} onClick={() => onSwipe(deck[0].id, 'superlike')}>
          ★
        </button>
        <button className={`${styles.swipeBtn} ${styles.swipeBtnLike}`} onClick={() => onSwipe(deck[0].id, 'like')}>
          ♥
        </button>
      </div>
    </div>
  );
};