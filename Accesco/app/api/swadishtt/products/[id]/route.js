import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { requireAdmin } from '../../../_lib/authz';

export const dynamic = 'force-dynamic';

const COLLECTION = 'swadishtt_products';

// GET /api/swadishtt/products/[id] — public read of a single menu item.
export async function GET(request, { params }) {
  try {
    const snap = await getDoc(doc(db, COLLECTION, params.id));
    if (!snap.exists()) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ product: { id: snap.id, ...snap.data() } });
  } catch (error) {
    console.error('GET /api/swadishtt/products/[id] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/swadishtt/products/[id] — admin-only update.
export async function PUT(request, { params }) {
  try {
    const { error: authError, status: authStatus } = await requireAdmin(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: authStatus });
    }

    const ref = doc(db, COLLECTION, params.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const body = await request.json();
    const updates = { ...body, updatedAt: new Date().toISOString() };
    delete updates.id;
    delete updates.ventureId;
    delete updates.createdAt;

    await updateDoc(ref, updates);

    return NextResponse.json({ success: true, updatedFields: Object.keys(updates) });
  } catch (error) {
    console.error('PUT /api/swadishtt/products/[id] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/swadishtt/products/[id] — admin-only. Deactivates by default
// (isActive: false, keeps the doc for order-history/back-reference
// integrity) rather than hard-deleting; pass ?hard=true to actually remove
// the document.
export async function DELETE(request, { params }) {
  try {
    const { error: authError, status: authStatus } = await requireAdmin(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: authStatus });
    }

    const ref = doc(db, COLLECTION, params.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    if (searchParams.get('hard') === 'true') {
      await deleteDoc(ref);
      return NextResponse.json({ success: true, message: 'Product deleted' });
    }

    await updateDoc(ref, { isActive: false, updatedAt: new Date().toISOString() });
    return NextResponse.json({ success: true, message: 'Product deactivated' });
  } catch (error) {
    console.error('DELETE /api/swadishtt/products/[id] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
