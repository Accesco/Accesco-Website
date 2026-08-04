import { NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { storage } from '../../../../lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { verifyAuthToken } from '../../_lib/auth';

export const dynamic = 'force-dynamic';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// POST /api/profile/image — upload/replace the user's profile photo
// Body: FormData with a 'file' field
export async function POST(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    if (!file.type?.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: 'Image size should be less than 5MB' }, { status: 400 });
    }

    const userRef = adminDb.collection('users').doc(uid);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase();
    const path = `profile-images/${uid}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, buffer, { contentType: file.type });
    const photoURL = await getDownloadURL(storageRef);

    await userRef.update({
      photoURL,
      photoPath: path,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Best-effort cleanup of the previous image so storage doesn't accumulate orphans
    const previousPath = docSnap.data()?.photoPath;
    if (previousPath && previousPath !== path) {
      deleteObject(ref(storage, previousPath)).catch((err) =>
        console.error('Error deleting previous profile image:', err)
      );
    }

    return NextResponse.json({
      message: 'Profile image updated successfully',
      photoURL,
    }, { status: 200 });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/profile/image — remove the user's profile photo
export async function DELETE(request) {
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

    const existingPath = docSnap.data()?.photoPath;

    await userRef.update({
      photoURL: FieldValue.delete(),
      photoPath: FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    if (existingPath) {
      deleteObject(ref(storage, existingPath)).catch((err) =>
        console.error('Error deleting profile image from storage:', err)
      );
    }

    return NextResponse.json({ message: 'Profile image removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting profile image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
