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
const VALID_BUSINESS_TYPES = ['darkstore', 'qsr', 'd2c'];
const VALID_EXPERIENCE = ['new', '1-2', '2-5', '5+'];
const PINCODE_REGEX = /^\d{6}$/;

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const {
      businessName,
      ownerName,
      email,
      phone,
      businessType,
      address,
      city,
      pincode,
      gst,
      fssai,
      experience,
      description,
    } = body ?? {};

    // ── Field Validation ─────────────────────────────────────────────────────
    if (!businessName?.trim()) {
      return NextResponse.json({ error: 'Business Name is required.' }, { status: 400 });
    }
    if (!ownerName?.trim()) {
      return NextResponse.json({ error: 'Owner Name is required.' }, { status: 400 });
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
    if (!businessType || !VALID_BUSINESS_TYPES.includes(businessType)) {
      return NextResponse.json({ error: 'Please select a valid Business Type.' }, { status: 400 });
    }
    if (!experience || !VALID_EXPERIENCE.includes(experience)) {
      return NextResponse.json({ error: 'Please select valid Years in Business.' }, { status: 400 });
    }
    if (!address?.trim()) {
      return NextResponse.json({ error: 'Business Address is required.' }, { status: 400 });
    }
    if (!city?.trim()) {
      return NextResponse.json({ error: 'City is required.' }, { status: 400 });
    }
    if (!pincode || !PINCODE_REGEX.test(pincode.trim())) {
      return NextResponse.json({ error: 'Please enter a valid 6-digit Pincode.' }, { status: 400 });
    }
    // ─────────────────────────────────────────────────────────────────────────

    const docRef = await addDoc(collection(db, 'vendorPartners'), {
      businessName: businessName.trim(),
      ownerName:    ownerName.trim(),
      email:        email.trim().toLowerCase(),
      phone:        phone.trim(),
      businessType,
      address:      address.trim(),
      city:         city.trim(),
      pincode:      pincode.trim(),
      gst:          gst?.trim() || '',
      fssai:        fssai?.trim() || '',
      experience,
      description:  description?.trim() || '',
      status:       'pending',
      createdAt:    serverTimestamp(),
    });

    console.log(`[partner/vendor] New vendor application saved — ID: ${docRef.id}`);

    return NextResponse.json(
      { success: true, message: 'Application submitted successfully.', id: docRef.id },
      { status: 200 }
    );

  } catch (error) {
    console.error('[partner/vendor] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}