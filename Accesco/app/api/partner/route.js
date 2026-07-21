import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Standalone Firebase init for server-side use — avoids App Check which is
// browser-only and would block writes from Next.js API routes.
// Config values are hardcoded (same as lib/firebase.js) so no env var dependency.
const firebaseConfig = {
  apiKey:            'AIzaSyBon3Q156u3xNWW2nZw8Z6RxWbfNQezIFM',
  authDomain:        'accesco-db.firebaseapp.com',
  projectId:         'accesco-db',
  storageBucket:     'accesco-db.firebasestorage.app',
  messagingSenderId: '113387637108',
  appId:             '1:113387637108:web:1c4b181334431c00190421',
};

// Safely get or create the Firebase app instance (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db  = getFirestore(app);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_COLLAB_TYPES = [
  'Instagram / Socials',
  'YouTube Integration',
  'UGC Creation',
  'Ambassadorship',
  'Barter / Exchange',
];

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const {
      firstName,
      lastName,
      email,
      company,
      natureOfCollaboration,
      estimatedBudget,
      campaignBrief,
    } = body ?? {};

    // ── Field Validation ─────────────────────────────────────────────────────
    if (!firstName?.trim()) {
      return NextResponse.json({ error: 'First Name is required.' }, { status: 400 });
    }
    if (!lastName?.trim()) {
      return NextResponse.json({ error: 'Last Name is required.' }, { status: 400 });
    }
    if (!email?.trim()) {
      return NextResponse.json({ error: 'Work Email is required.' }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!company?.trim()) {
      return NextResponse.json({ error: 'Company / Brand Name is required.' }, { status: 400 });
    }
    if (!Array.isArray(natureOfCollaboration) || natureOfCollaboration.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one Nature of Collaboration option.' },
        { status: 400 }
      );
    }
    const invalidTypes = natureOfCollaboration.filter((t) => !VALID_COLLAB_TYPES.includes(t));
    if (invalidTypes.length > 0) {
      return NextResponse.json({ error: 'Invalid collaboration type(s) submitted.' }, { status: 400 });
    }
    if (!estimatedBudget) {
      return NextResponse.json({ error: 'Please select an Estimated Budget range.' }, { status: 400 });
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Write document to Firestore 'partnerships' collection
    const docRef = await addDoc(collection(db, 'partnerships'), {
      firstName:             firstName.trim(),
      lastName:              lastName.trim(),
      email:                 email.trim().toLowerCase(),
      company:               company.trim(),
      natureOfCollaboration,
      estimatedBudget,
      campaignBrief:         campaignBrief?.trim() || '',
      status:                'pending',
      createdAt:             serverTimestamp(),
    });

    console.log(`[partner] New partnership request saved — ID: ${docRef.id}`);

    return NextResponse.json(
      { success: true, message: 'Partnership request submitted successfully.', id: docRef.id },
      { status: 200 }
    );

  } catch (error) {
    console.error('[partner] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
