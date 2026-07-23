'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SwadishttHeader from '../../../../components/SwadishttHeader';
import styles from './issue-reported.module.css';

export default function SwadishttIssueReportedPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = params.id || '12345';
  const [reportData, setReportData] = useState({
    refundTotal: 60,
    greenPoints: 10,
  });

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`sw_issue_${orderId}`);
      if (stored) {
        setReportData(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, [orderId]);

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      <div className={styles.container}>
        <div className={styles.cardCenter}>
          <button className={styles.backIconBtn} onClick={() => router.push('/services/swadisht/orders')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <h1 className={styles.title}>Issue Reported</h1>

          <div className={styles.badgeWrap}>
            <div className={styles.greenCheckCircle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className={styles.laurelWreath}>🌿</div>
          </div>

          <h2 className={styles.mainMsg}>We've received your issue!</h2>
          <p className={styles.subMsg}>We are reviewing your issue and will resolve it for you.</p>

          <div className={styles.nextStepsCard}>
            <div className={styles.nextStepsTitle}>What happens next?</div>

            <div className={styles.stepRow}>
              <div className={styles.stepIconWrap}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5722" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span className={styles.stepText}>We will verify your issue.</span>
            </div>

            <div className={styles.stepRow}>
              <div className={styles.stepIconWrap}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5722" strokeWidth="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </div>
              <span className={styles.stepText}>Refund will be initiated within 24 hours.</span>
            </div>

            <div className={styles.stepRow}>
              <div className={styles.stepIconWrap}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5722" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <span className={styles.stepText}>You will receive a confirmation once it's done.</span>
            </div>
          </div>

          <div className={styles.resolutionSection}>
            <div className={styles.resolutionHeading}>RESOLUTION</div>

            <div className={styles.refundRow}>
              <span className={styles.refundLabel}>Refund for Missing Item</span>
              <span className={styles.refundAmt}>₹{reportData.refundTotal}</span>
            </div>

            <div className={styles.greenPointsBanner}>
              <div>
                <div className={styles.pointsText}>+{reportData.greenPoints} Green Points</div>
                <div className={styles.pointsSub}>for reporting the issue</div>
              </div>
              <div className={styles.bookmarkIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <button
            className={styles.homeBtn}
            onClick={() => router.push('/services/swadisht')}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
