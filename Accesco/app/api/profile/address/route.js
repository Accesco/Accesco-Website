import { NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken } from '../../_lib/auth';
import { isValidPincode } from '../../_lib/validators';

// PUT /api/profile/address — update the user's delivery address
export async function PUT(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const body = await request.json();
    const address = typeof body.address === 'string' ? body.address.trim() : '';
    const city = typeof body.city === 'string' ? body.city.trim() : '';
    const pincode = typeof body.pincode === 'string' ? body.pincode.trim() : '';

    if (!address || address.length < 5) {
      return NextResponse.json({ error: 'A valid delivery address is required' }, { status: 400 });
    }
    if (!city) {
      return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }
    if (!isValidPincode(pincode)) {
      return NextResponse.json({ error: 'Pincode must be exactly 6 digits' }, { status: 400 });
    }

    const userRef = adminDb.collection('users').doc(uid);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const deliveryAddress = { address, city, pincode };

    await userRef.update({
      deliveryAddress,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      message: 'Delivery address updated successfully',
      deliveryAddress,
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating delivery address:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
