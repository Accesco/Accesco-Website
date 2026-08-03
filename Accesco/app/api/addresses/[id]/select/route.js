import { NextResponse } from 'next/server';
import { adminDb } from '../../../../../lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken } from '../../../_lib/auth';

export async function PUT(request, { params }) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    const addressRef = adminDb.collection('users').doc(uid).collection('addresses').doc(id);
    const docSnap = await addressRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    const addressesRef = adminDb.collection('users').doc(uid).collection('addresses');
    const snapshot = await addressesRef.get();
    const batch = adminDb.batch();

    // Clear default flag on all addresses except the selected one
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (doc.id === id) {
        batch.update(doc.ref, { 
          isDefault: true,
          tag: 'Selected',
          updatedAt: FieldValue.serverTimestamp() 
        });
      } else if (data.isDefault) {
        batch.update(doc.ref, { 
          isDefault: false,
          tag: '',
          updatedAt: FieldValue.serverTimestamp() 
        });
      }
    });

    await batch.commit();

    return NextResponse.json({ message: 'Address selected successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error selecting address:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
