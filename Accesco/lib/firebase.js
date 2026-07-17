// lib/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { initializeAppCheck, CustomProvider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey:            "AIzaSyBon3Q156u3xNWW2nZw8Z6RxWbfNQezIFM",
  authDomain:        "accesco-db.firebaseapp.com",
  projectId:         "accesco-db",
  storageBucket:     "accesco-db.firebasestorage.app",
  messagingSenderId: "113387637108",
  appId:             "1:113387637108:web:1c4b181334431c00190421",
  measurementId: "G-2GWXK710JN"
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
export default app;
