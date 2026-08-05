import { NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken } from '../_lib/auth';
import { isValidEmail, isValidPhone } from '../_lib/validators';

export const dynamic = 'force-dynamic';

// GET /api/profile — fetch the authenticated user's profile
export async function GET(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const userRef = adminDb.collection('users').doc(uid);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const data = docSnap.data();

    return NextResponse.json({
      profile: {
        uid,
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || null,
        photoURL: data.photoURL || null,
        deliveryAddress: data.deliveryAddress || null,
        phoneVerified: Boolean(data.phoneVerified),
        emailVerified: Boolean(data.emailVerified),
        provider: data.provider || 'phone',
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/profile — update personal information (name, phone, email)
export async function PUT(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (name.length > 100) {
      return NextResponse.json({ error: 'Name must be under 100 characters' }, { status: 400 });
    }
    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json({ error: 'A valid phone number is required' }, { status: 400 });
    }
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    const userRef = adminDb.collection('users').doc(uid);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const existing = docSnap.data();
    const updateData = {
      name,
      phone,
      email: email || null,
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Editing phone/email here bypasses OTP verification, so require re-verification
    if (phone !== existing.phone) updateData.phoneVerified = false;
    if (email !== (existing.email || '')) updateData.emailVerified = false;

    await userRef.update(updateData);

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: { uid, name, phone, email: email || null },
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
