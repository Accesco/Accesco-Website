import { NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken } from '../../_lib/auth';

export const dynamic = 'force-dynamic';

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

    const body = await request.json();
    const updateData = {
      ...body,
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Remove immutable fields from update if they were passed
    delete updateData.id;
    delete updateData.createdAt;
    
    // Safety check: isDefault should not be toggled arbitrarily here. 
    // It is handled by POST and select route via batches.
    delete updateData.isDefault; 

    const addressRef = adminDb.collection('users').doc(uid).collection('addresses').doc(id);
    const docSnap = await addressRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    await addressRef.update(updateData);
    
    return NextResponse.json({ message: 'Address updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
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
    const addressSnap = await addressRef.get();

    if (!addressSnap.exists) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    const addressData = addressSnap.data();
    const wasDefault = addressData.isDefault;

    await addressRef.delete();

    // If the deleted address was the default, automatically make the first remaining address the default
    let newDefaultId = null;
    if (wasDefault) {
      const addressesRef = adminDb.collection('users').doc(uid).collection('addresses');
      const snapshot = await addressesRef.limit(1).get();
      
      if (!snapshot.empty) {
        const nextDefaultDoc = snapshot.docs[0];
        await nextDefaultDoc.ref.update({
          isDefault: true,
          tag: 'Selected',
          updatedAt: FieldValue.serverTimestamp()
        });
        newDefaultId = nextDefaultDoc.id;
      }
    }

    return NextResponse.json({ 
      message: 'Address deleted successfully',
      newDefaultId
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
