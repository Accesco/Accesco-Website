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
const VALID_VEHICLE_TYPES = ['bicycle', 'scooter', 'motorcycle', 'electric'];
const VALID_OWN_VEHICLE = ['yes', 'no'];
const VALID_EXPERIENCE = ['none', 'less-1', '1-2', '2+'];
const VALID_AVAILABILITY = ['morning', 'afternoon', 'evening', 'night'];

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
      city,
      vehicleType,
      vehicleNumber,
      drivingLicense,
      age,
      experience,
      availability,
      ownVehicle,
      address,
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
    const ageNum = Number(age);
    if (!age || Number.isNaN(ageNum) || ageNum < 18 || ageNum > 60) {
      return NextResponse.json({ error: 'Age must be between 18 and 60.' }, { status: 400 });
    }
    if (!drivingLicense?.trim()) {
      return NextResponse.json({ error: 'Driving License Number is required.' }, { status: 400 });
    }
    if (!vehicleType || !VALID_VEHICLE_TYPES.includes(vehicleType)) {
      return NextResponse.json({ error: 'Please select a valid Vehicle Type.' }, { status: 400 });
    }
    if (!ownVehicle || !VALID_OWN_VEHICLE.includes(ownVehicle)) {
      return NextResponse.json({ error: 'Please select whether you own the vehicle.' }, { status: 400 });
    }
    if (!address?.trim()) {
      return NextResponse.json({ error: 'Current Address is required.' }, { status: 400 });
    }
    const availabilityArr = Array.isArray(availability) ? availability : [];
    if (availabilityArr.length === 0) {
      return NextResponse.json({ error: 'Please select at least one Availability slot.' }, { status: 400 });
    }
    const invalidSlots = availabilityArr.filter((slot) => !VALID_AVAILABILITY.includes(slot));
    if (invalidSlots.length > 0) {
      return NextResponse.json({ error: 'Invalid Availability slot(s) submitted.' }, { status: 400 });
    }
    if (experience && !VALID_EXPERIENCE.includes(experience)) {
      return NextResponse.json({ error: 'Invalid Experience value submitted.' }, { status: 400 });
    }
    // ─────────────────────────────────────────────────────────────────────────

    const docRef = await addDoc(collection(db, 'deliveryPartners'), {
      fullName:       fullName.trim(),
      email:          email.trim().toLowerCase(),
      phone:          phone.trim(),
      city:           city.trim(),
      vehicleType,
      vehicleNumber:  vehicleNumber?.trim() || '',
      drivingLicense: drivingLicense.trim(),
      age:            ageNum,
      experience:     experience || '',
      availability:   availabilityArr,
      ownVehicle,
      address:        address.trim(),
      status:         'pending',
      createdAt:      serverTimestamp(),
    });

    console.log(`[partner/delivery] New delivery application saved — ID: ${docRef.id}`);

    return NextResponse.json(
      { success: true, message: 'Application submitted successfully.', id: docRef.id },
      { status: 200 }
    );

  } catch (error) {
    console.error('[partner/delivery] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}