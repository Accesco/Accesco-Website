// lib/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            "AIzaSyBon3Q156u3xNWW2nZw8Z6RxWbfNQezIFM",
  authDomain:        "accesco-db.firebaseapp.com",
  projectId:         "accesco-db",
  storageBucket:     "accesco-db.firebasestorage.app",
  messagingSenderId: "113387637108",
  appId:             "1:113387637108:web:1c4b181334431c00190421",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db      = getFirestore(app);
export const storage = getStorage(app);
export const auth    = getAuth(app);

// Disable reCAPTCHA app verification for phone/email auth testing on localhost only.
// This must never be true in production: it skips real reCAPTCHA widget setup and
// routes phone auth through Firebase's test-mode path, which only works for phone
// numbers whitelisted in the Firebase console. For real users it causes
// auth/captcha-check-failed (MALFORMED) on signInWithPhoneNumber.
if (typeof window !== 'undefined') {
  const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  if (isLocalhost) {
    try {
      auth.settings.appVerificationDisabledForTesting = true;
    } catch (e) {
      // Ignore setting errors in SSR
    }
  }
}

export default app;
