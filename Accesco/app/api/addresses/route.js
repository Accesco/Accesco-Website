import { NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken } from '../_lib/auth';

export async function GET(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const addressesRef = adminDb.collection('users').doc(uid).collection('addresses');
    // Order by creation time (descending) so newest is first by default
    const snapshot = await addressesRef.orderBy('createdAt', 'desc').get();

    const addresses = [];
    snapshot.forEach((docSnap) => {
      addresses.push({ id: docSnap.id, ...docSnap.data() });
    });

    return NextResponse.json({ addresses }, { status: 200 });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const body = await request.json();
    const {
      label,
      fullAddress,
      displayAddress,
      houseNo,
      building,
      area,
      city,
      pincode,
      lat,
      lng,
      icon,
      isDefault
    } = body;

    if (!fullAddress || !lat || !lng) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAddressData = {
      label: label || 'Other',
      type: label || 'Other', // Compatibility with frontend
      fullAddress: fullAddress || '',
      displayAddress: displayAddress || fullAddress || '',
      houseNo: houseNo || '',
      building: building || '',
      area: area || '',
      city: city || 'Bengaluru',
      pincode: pincode || '',
      lat: Number(lat),
      lng: Number(lng),
      icon: icon || 'pin',
      isDefault: Boolean(isDefault),
      tag: isDefault ? 'Selected' : '', // Compatibility with frontend
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const addressesRef = adminDb.collection('users').doc(uid).collection('addresses');

    if (newAddressData.isDefault) {
      // If setting as default, clear existing defaults first using a batch
      const batch = adminDb.batch();
      const snapshot = await addressesRef.get();
      
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.isDefault) {
          batch.update(docSnap.ref, { 
            isDefault: false, 
            tag: '',
            updatedAt: FieldValue.serverTimestamp() 
          });
        }
      });
      
      const newDocRef = addressesRef.doc();
      batch.set(newDocRef, newAddressData);
      await batch.commit();
      
      return NextResponse.json({ 
        message: 'Address created', 
        address: { id: newDocRef.id, ...newAddressData } 
      }, { status: 201 });
    } else {
      // Just add the document
      const docRef = await addressesRef.add(newAddressData);
      return NextResponse.json({ 
        message: 'Address created', 
        address: { id: docRef.id, ...newAddressData } 
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
