// lib/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { initializeAppCheck, CustomProvider } from 'firebase/app-check';

// NEXT_PUBLIC_* values ship to the browser bundle regardless of how they're
// supplied, so these are hardcoded rather than read from process.env -- this
// removes the CI/deploy dependency on repo secrets being configured.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize App Check for local development using the debug token from .env.local
if (typeof window !== 'undefined') {
  const debugToken = process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN;
  if (debugToken) {
    // Tell Firebase SDK to use this debug token instead of calling a reCAPTCHA provider
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
    initializeAppCheck(app, {
      provider: new CustomProvider({
        getToken: () =>
          Promise.resolve({
            token: debugToken,
            expireTimeMillis: Date.now() + 60 * 60 * 1000,
          }),
      }),
      isTokenAutoRefreshEnabled: true,
    });
  }
}

export const db      = getFirestore(app);
export const storage = getStorage(app);
export const auth    = getAuth(app);

// Skip Firebase's reCAPTCHA app-verification challenge for phone OTP in dev.
// The SDK still requires an ApplicationVerifier to be passed to
// signInWithPhoneNumber, but with this flag set it resolves immediately
// without rendering a widget -- needed locally since the reCAPTCHA
// verification itself fails here (auth/invalid-app-credential). Scoped to
// non-production so real users always go through actual verification.
if (process.env.NODE_ENV !== 'production') {
  auth.settings.appVerificationDisabledForTesting = true;
}

export default app;
