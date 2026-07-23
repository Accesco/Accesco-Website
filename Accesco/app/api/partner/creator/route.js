import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Standalone Firebase init for server-side use — same rationale as
// app/api/partner/route.js: avoids App Check (browser-only) blocking writes
// from a Next.js API route. Config is hardcoded, same as lib/firebase.js.
const firebaseConfig = {
  apiKey:            'AIzaSyBon3Q156u3xNWW2nZw8Z6RxWbfNQezIFM',
  authDomain:        'accesco-db.firebaseapp.com',
  projectId:         'accesco-db',
  storageBucket:     'accesco-db.firebasestorage.app',
  messagingSenderId: '113387637108',
  appId:             '1:113387637108:web:1c4b181334431c00190421',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db  = getFirestore(app);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_CATEGORIES = ['fashion', 'food', 'lifestyle', 'tech', 'fitness', 'travel', 'beauty', 'other'];
const VALID_FOLLOWER_RANGES = ['1k-10k', '10k-50k', '50k-100k', '100k-500k', '500k+'];
const VALID_EXPERIENCE = ['beginner', '1-2', '2-5', '5+'];
const VALID_CONTENT_TYPES = ['reels', 'posts', 'videos', 'stories'];

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const {
      fullName,
      email,
      phone,
      instagram,
      youtube,
      category,
      followers,
      city,
      contentType,
      experience,
      portfolio,
    } = body ?? {};

    // ── Field Validation ─────────────────────────────────────────────────────
    if (!fullName?.trim()) {
      return NextResponse.json({ error: 'Full Name is required.' }, { status: 400 });
    }
    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email Address is required.' }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!phone?.trim()) {
      return NextResponse.json({ error: 'Phone Number is required.' }, { status: 400 });
    }
    if (!city?.trim()) {
      return NextResponse.json({ error: 'City is required.' }, { status: 400 });
    }
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Please select a valid Content Category.' }, { status: 400 });
    }
    if (!followers || !VALID_FOLLOWER_RANGES.includes(followers)) {
      return NextResponse.json({ error: 'Please select a valid Followers range.' }, { status: 400 });
    }
    if (!experience || !VALID_EXPERIENCE.includes(experience)) {
      return NextResponse.json({ error: 'Please select valid Years of Experience.' }, { status: 400 });
    }
    const contentTypeArr = Array.isArray(contentType) ? contentType : [];
    const invalidContentTypes = contentTypeArr.filter((t) => !VALID_CONTENT_TYPES.includes(t));
    if (invalidContentTypes.length > 0) {
      return NextResponse.json({ error: 'Invalid Content Type(s) submitted.' }, { status: 400 });
    }
    // ─────────────────────────────────────────────────────────────────────────

    const docRef = await addDoc(collection(db, 'creatorPartners'), {
      fullName:    fullName.trim(),
      email:       email.trim().toLowerCase(),
      phone:       phone.trim(),
      instagram:   instagram?.trim() || '',
      youtube:     youtube?.trim() || '',
      category,
      followers,
      city:        city.trim(),
      contentType: contentTypeArr,
      experience,
      portfolio:   portfolio?.trim() || '',
      status:      'pending',
      createdAt:   serverTimestamp(),
    });

    console.log(`[partner/creator] New creator application saved — ID: ${docRef.id}`);

    return NextResponse.json(
      { success: true, message: 'Application submitted successfully.', id: docRef.id },
      { status: 200 }
    );

  } catch (error) {
    console.error('[partner/creator] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}