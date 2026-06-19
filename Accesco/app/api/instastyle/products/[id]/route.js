import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

export const dynamic = 'force-dynamic';

const COLLECTION = 'instastyle_products';

// Helper: find Firestore doc by product id field (not the auto-generated docId)
async function findDocByProductId(productId) {
  const q = query(
    collection(db, COLLECTION),
    where('id', '==', productId)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const first = snap.docs[0];
  return { docId: first.id, data: first.data() };
}

// ─────────────────────────────────────────────
// GET /api/instastyle/products/[id]
// ─────────────────────────────────────────────
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await findDocByProductId(id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product: result.data });
  } catch (error) {
    console.error('[API] GET /instastyle/products/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// PUT /api/instastyle/products/[id]
// Body: partial product fields to update
// ─────────────────────────────────────────────
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const result = await findDocByProductId(id);
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const updates = {
      ...body,
      updatedAt: new Date().toISOString(),
    };
    // Prevent id override
    delete updates._docId;
    delete updates.id;

    await updateDoc(doc(db, COLLECTION, result.docId), updates);

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      updatedFields: Object.keys(updates),
    });
  } catch (error) {
    console.error('[API] PUT /instastyle/products/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// DELETE /api/instastyle/products/[id]
// ─────────────────────────────────────────────
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await findDocByProductId(id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    await deleteDoc(doc(db, COLLECTION, result.docId));

    return NextResponse.json({
      success: true,
      message: `Product ${id} deleted successfully`,
    });
  } catch (error) {
    console.error('[API] DELETE /instastyle/products/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
