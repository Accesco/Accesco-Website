import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app;
let db;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
} catch (e) {
  console.warn('Firebase not initialized. Make sure env vars are set.');
}

// MOCK IN-MEMORY STORE FOR DEVELOPMENT FALLBACK
let mockSizeProfile = {
  topwearBrand: '',
  topwearSize: '',
  bottomwearBrand: '',
  bottomwearSize: '',
  footwearBrand: '',
  footwearSize: '',
};

export async function GET(request) {
  try {
    if (db && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      const userId = 'mock-user-id'; // To be replaced with actual auth session
      const docRef = doc(db, 'user_sizes', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return NextResponse.json({ profile: docSnap.data() }, { status: 200 });
      }
    }
    return NextResponse.json({ profile: mockSizeProfile }, { status: 200 });
  } catch (error) {
    console.error('Error fetching size profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { profile } = body;

    if (!profile) {
      return NextResponse.json({ error: 'Profile data missing' }, { status: 400 });
    }

    if (db && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      const userId = 'mock-user-id';
      await setDoc(doc(db, 'user_sizes', userId), profile, { merge: true });
    } else {
      mockSizeProfile = { ...mockSizeProfile, ...profile };
    }

    return NextResponse.json({ success: true, profile: (db && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) ? profile : mockSizeProfile }, { status: 200 });
  } catch (error) {
    console.error('Error saving size profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
