'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CookieConsent.module.css';
import { useAuth } from './AuthProvider';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function CookieConsent() {
  const { uid, loading: authLoading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasCheckedConsent, setHasCheckedConsent] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    const checkConsent = async () => {
      if (!uid) {
        // If auth somehow hasn't produced a uid yet, wait
        return;
      }

      try {
        // 1. Check preferences/privacy subcollection document
        const privacyDocRef = doc(db, 'users', uid, 'preferences', 'privacy');
        const snap = await getDoc(privacyDocRef);

        if (snap.exists() && snap.data()?.cookieConsent) {
          if (!cancelled) {
            setIsVisible(false);
            setHasCheckedConsent(true);
          }
          return;
        }

        // 2. Check root user doc fallback
        const userDocRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists() && userSnap.data()?.cookieConsent) {
          if (!cancelled) {
            setIsVisible(false);
            setHasCheckedConsent(true);
          }
          return;
        }

        // No consent found in Firestore -> show banner
        if (!cancelled) {
          setIsVisible(true);
          setHasCheckedConsent(true);
        }
      } catch (err) {
        console.warn('Could not read cookie consent from Firestore:', err);
        if (!cancelled) {
          // If offline or first time, show banner
          setIsVisible(true);
          setHasCheckedConsent(true);
        }
      }
    };

    checkConsent();

    return () => {
      cancelled = true;
    };
  }, [uid, authLoading]);

  const closeBanner = async (consentValue) => {
    setIsClosing(true);

    if (uid) {
      try {
        const privacyDocRef = doc(db, 'users', uid, 'preferences', 'privacy');
        await setDoc(
          privacyDocRef,
          {
            cookieConsent: consentValue,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        // Also merge onto root user document for convenient single-doc profile reads
        const userDocRef = doc(db, 'users', uid);
        await setDoc(
          userDocRef,
          {
            cookieConsent: consentValue,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Error saving cookie consent to Firestore:', err);
      }
    }

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

  useEffect(() => {
    if (!isVisible || !bannerRef.current) {
      return undefined;
    }

    const previousPaddingBottom = document.body.style.paddingBottom;
    const bannerHeight = bannerRef.current.offsetHeight;
    document.body.style.paddingBottom = `${bannerHeight + 32}px`;

    return () => {
      document.body.style.paddingBottom = previousPaddingBottom;
    };
  }, [isVisible]);

  if (!isVisible || !hasCheckedConsent) {
    return null;
  }

  return (
    <div ref={bannerRef} className={`${styles.banner} ${isClosing ? styles.fadeOut : styles.fadeIn}`} role="dialog" aria-live="polite" aria-label="Cookie consent">
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
