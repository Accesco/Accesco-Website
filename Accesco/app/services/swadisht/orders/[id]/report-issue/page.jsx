'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SwadishttHeader from '../../../components/SwadishttHeader';
import styles from './report-issue.module.css';

const ISSUE_TYPES = [
  {
    id: 'missing',
    title: 'Missing Item',
    desc: 'I didn\'t receive one or more items in my order.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5722" strokeWidth="2">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    id: 'wrong',
    title: 'Wrong Item Received',
    desc: 'I received a different item from what I ordered.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2">
        <path d="M21 8L18 5L15 8" /><path d="M18 5V14" />
        <path d="M3 16L6 19L9 16" /><path d="M6 19V10" />
      </svg>
    ),
  },
  {
    id: 'quality',
    title: 'Food Quality Issue',
    desc: 'There is an issue with the quality or condition of food.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  },
];

export default function SwadishttReportIssuePage() {
  const params = useParams();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('missing');

  const orderId = params.id || '12345';

  const handleNext = () => {
    if (selectedType === 'missing') {
      router.push(`/services/swadisht/orders/${orderId}/report-issue/missing-item`);
    } else {
      // General report page fallback
      router.push(`/services/swadisht/orders/${orderId}/report-issue/missing-item?type=${selectedType}`);
    }
  };

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      <div className={styles.container}>
        <button className={styles.backIconBtn} onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <h1 className={styles.title}>Report an Issue</h1>

        <div className={styles.promptSection}>
          <h2 className={styles.promptTitle}>What went wrong with your order?</h2>
          <p className={styles.promptSub}>Please select the issue you are facing.</p>
        </div>

        <div className={styles.optionsList}>
          {ISSUE_TYPES.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <div
                key={type.id}
                className={`${styles.optionCard} ${isSelected ? styles.optionCardSelected : ''}`}
                onClick={() => setSelectedType(type.id)}
              >
                <div className={styles.optionIconWrap}>
                  {type.icon}
                </div>
                <div className={styles.optionContent}>
                  <div className={styles.optionTitle}>{type.title}</div>
                  <div className={styles.optionDesc}>{type.desc}</div>
                </div>
                <div className={`${styles.radioCircle} ${isSelected ? styles.radioSelected : ''}`}>
                  {isSelected && <div className={styles.radioInnerDot} />}
                </div>
              </div>
            );
          })}
        </div>

        <button className={styles.continueBtn} onClick={handleNext}>
          Continue
        </button>
      </div>
    </div>
  );
}
