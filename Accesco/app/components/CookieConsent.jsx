'use client';

import { useEffect, useState } from 'react';
import styles from './CookieConsent.module.css';

const CONSENT_KEY = 'accesco_cookie_consent';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const storedConsent = window.localStorage.getItem(CONSENT_KEY);
    if (!storedConsent) {
      setIsVisible(true);
    }
  }, []);

  const closeBanner = (consentValue) => {
    window.localStorage.setItem(CONSENT_KEY, consentValue);
    setIsClosing(true);

    window.setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 220);
  };

  const handleAccept = () => {
    closeBanner('accepted');
  };

  const handleReject = () => {
    closeBanner('rejected');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`${styles.banner} ${isClosing ? styles.fadeOut : styles.fadeIn}`} role="dialog" aria-live="polite" aria-label="Cookie consent">
      <p className={styles.message}>
        We use cookies and similar technologies to improve your browsing experience, remember your preferences, analyze site traffic, and personalize content and recommendations. You can choose to accept all cookies or reject non-essential cookies at any time.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.rejectButton} onClick={handleReject}>
          Reject
        </button>
        <button type="button" className={styles.acceptButton} onClick={handleAccept}>
          Accept
        </button>
      </div>
    </div>
  );
}
