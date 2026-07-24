'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SwadishttHeader from '../../../components/SwadishttHeader';
import styles from './return-container.module.css';

export default function SwadishttReturnContainerPage() {
  const params = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const orderId = params.id || '12345';

  const handleConfirmReturn = async () => {
    setIsSubmitting(true);
    try {
      // Save locally
      const returns = JSON.parse(localStorage.getItem('sw_container_returns') || '[]');
      returns.push({ orderId, timestamp: new Date().toISOString(), status: 'scheduled' });
      localStorage.setItem('sw_container_returns', JSON.stringify(returns));

      // Call API
      await fetch(`/api/swadishtt/orders/${orderId}/return-container`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      }).catch(err => console.error('API Error:', err));

      setIsConfirmed(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      <div className={styles.container}>
        {!isConfirmed ? (
          <div className={styles.card}>
            <button className={styles.backIconBtn} onClick={() => router.back()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <h1 className={styles.title}>Return Container</h1>

            <div className={styles.illustrationWrap}>
              <div className={styles.boxIllustration}>
                <div className={styles.boxLid} />
                <div className={styles.boxBody}>
                  <svg className={styles.recycleIcon} width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.5">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </div>
              </div>
            </div>

            <div className={styles.incentiveBox}>
              <div className={styles.giftIcon}>🎁</div>
              <div>
                <div className={styles.incentiveTitle}>Earn ₹10 Green Points</div>
                <div className={styles.incentiveSub}>Received upon successful collection by rider</div>
              </div>
            </div>

            <div className={styles.importantSection}>
              <h3 className={styles.importantHeading}>IMPORTANT</h3>
              <div className={styles.checkItem}>
                <div className={styles.checkDot} />
                <span>No separate pickup required</span>
              </div>
              <div className={styles.checkItem}>
                <div className={styles.checkDot} />
                <span>Please keep the container clean & dry</span>
              </div>
            </div>

            <button
              className={styles.confirmBtn}
              onClick={handleConfirmReturn}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Container Return'}
            </button>
          </div>
        ) : (
          <div className={styles.cardCenter}>
            <div className={styles.illustrationWrap}>
              <div className={styles.boxIllustration}>
                <div className={styles.boxLid} />
                <div className={styles.boxBody}>
                  <div className={styles.checkBadge}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <h1 className={styles.confirmedTitle}>Return Scheduled!</h1>
            <p className={styles.confirmedSub}>
              We will collect the reusable container with your next Swadishtt delivery.
            </p>

            <div className={styles.pointsEarnedBox}>
              <div className={styles.giftIcon}>🎁</div>
              <div>
                <span className={styles.pointsMetaLabel}>You will earn</span>
                <div className={styles.pointsVal}>₹10 Green Points</div>
                <span className={styles.pointsMetaSub}>on successful return.</span>
              </div>
            </div>

            <div className={styles.importantSectionLeft}>
              <h3 className={styles.importantHeading}>IMPORTANT</h3>
              <div className={styles.checkItem}>
                <div className={styles.checkDot} />
                <span>No separate pickup required</span>
              </div>
              <div className={styles.checkItem}>
                <div className={styles.checkDot} />
                <span>Please keep the container clean & dry</span>
              </div>
            </div>

            <button
              className={styles.primaryActionBtn}
              onClick={() => router.push('/services/swadisht/orders')}
            >
              View Orders
            </button>

            <button
              className={styles.secondaryTextBtn}
              onClick={() => router.push('/services/swadisht')}
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
