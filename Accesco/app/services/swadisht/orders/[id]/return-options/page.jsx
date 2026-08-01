'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SwadishttHeader from '../../../components/SwadishttHeader';
import styles from './return-options.module.css';

const RETURN_OPTIONS = [
  {
    id: 'packaging',
    title: 'Packaging / Containers',
    description: 'Return your food packaging and containers to be recycled.',
    image: '/images/returns/packaging.png',
    links: ['Eco-friendly', 'Earn EcoPoints'],
  },
  {
    id: 'food',
    title: 'Excess / Unused Food',
    description: 'Report excess or unconsumed food (not for delivery).',
    image: '/images/returns/excess-food.png',
    links: ['Reduce waste'],
  },
  {
    id: 'issue',
    title: 'Issue with Order',
    description: 'Report an issue with your order or missing items.',
    image: '/images/returns/issue-order.png',
    links: ["We're here to help"],
  },
];

export default function ReturnOptionsPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = params.id || '12345';
  const [selectedOption, setSelectedOption] = useState('packaging');

  const handleContinue = () => {
    if (selectedOption === 'packaging') {
      router.push(
        `/services/swadisht/orders/${orderId}/return-container`
      );
      return;
    }

    if (selectedOption === 'issue') {
      router.push(
        `/services/swadisht/orders/${orderId}/report-issue`
      );
      return;
    }

    if (selectedOption === 'food') {
      alert('This option is coming soon.');
    }
  };

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <span>Home</span>
          <span>›</span>
          <span>My Orders</span>
          <span>›</span>
          <span>Order #{orderId}</span>
          <span>›</span>
          <span className={styles.activeBreadcrumb}>
            Select Return Type
          </span>
        </div>

        <section className={styles.content}>
          <div className={styles.headingBlock}>
            <h1>What would you like to return?</h1>
            <p>Choose an option below to get started.</p>
          </div>

          <div className={styles.optionsGrid}>
            {RETURN_OPTIONS.map((option) => {
              const isSelected = selectedOption === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  className={`${styles.optionCard} ${
                    isSelected ? styles.optionCardSelected : ''
                  }`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  <span
                    className={`${styles.radioCircle} ${
                      isSelected ? styles.radioCircleSelected : ''
                    }`}
                  >
                    {isSelected && (
                      <span className={styles.radioDot} />
                    )}
                  </span>

                  <img
                    src={option.image}
                    alt=""
                    className={styles.optionImage}
                  />

                  <h2>{option.title}</h2>

                  <p>{option.description}</p>

                  <div className={styles.optionLinks}>
                    {option.links.map((link) => (
                      <span key={link}>{link}</span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className={styles.impactBanner}>
            <div className={styles.impactIcon}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M20 4c-8 0-14 4-14 10 0 4 3 6 6 6 6 0 8-8 8-16Z" />
                <path d="M4 20c3-5 7-8 12-10" />
              </svg>
            </div>

            <div>
              <strong>Your actions make a difference</strong>
              <p>
                Thank you for helping us reduce waste and build a
                sustainable future.
              </p>
            </div>
          </div>

          <button
            type="button"
            className={styles.continueButton}
            onClick={handleContinue}
          >
            <span>Continue</span>
            <span>›</span>
          </button>
        </section>
      </main>

      <footer className={styles.helpFooter}>
        <div className={styles.helpIcon}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 13a8 8 0 0 1 16 0" />
            <path d="M4 13v5a2 2 0 0 0 2 2h2v-7H4Z" />
            <path d="M20 13v5a2 2 0 0 1-2 2h-2v-7h4Z" />
          </svg>
        </div>

        <strong>Need help?</strong>

        <span>
          Visit our <u>Help Center</u> or chat with our support team.
        </span>
      </footer>
    </div>
  );
}