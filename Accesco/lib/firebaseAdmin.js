import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  let credential;
  
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    // Replace escaped newlines so the private key is valid
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    credential = cert({
      projectId: process.env.FIREBASE_PROJECT_ID || 'accesco-db',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    });
  }
  
  // If credential is not provided, initializeApp will attempt to use
  // Application Default Credentials (ADC) if available in the deployment environment.
  // We still provide projectId as a fallback for verifyIdToken to work without ADC.
  initializeApp({
    credential,
    projectId: process.env.FIREBASE_PROJECT_ID || 'accesco-db'
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
