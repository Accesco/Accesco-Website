import { NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs } from 'firebase/firestore';

const COLLECTION = 'instastyle_products';

// ─────────────────────────────────────────────
// POST /api/instastyle/upload
// Uploads a SKU product image to Firebase Storage
// Body: FormData with 'file' field
// ─────────────────────────────────────────────
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate size: max 8MB
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Image must be under 8MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `instastyle/products/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const storageRef = ref(storage, filename);
    const metadata = { contentType: file.type };

    await uploadBytes(storageRef, buffer, metadata);
    const downloadURL = await getDownloadURL(storageRef);

    return NextResponse.json({
      success: true,
      url: downloadURL,
      path: filename,
    }, { status: 200 });

  } catch (error) {
    console.error('[API] POST /instastyle/upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// GET /api/instastyle/upload?category=men
// Returns all SKU products for a given category (for admin review)
// ─────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let q;
    if (category && category !== 'all') {
      q = query(collection(db, COLLECTION), where('category', '==', category));
    } else {
      q = query(collection(db, COLLECTION));
    }

    const snap = await getDocs(q);
    const products = [];
    snap.forEach((d) => products.push({ _docId: d.id, ...d.data() }));

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('[API] GET /instastyle/upload error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
