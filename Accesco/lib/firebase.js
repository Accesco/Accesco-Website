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

export default app;
