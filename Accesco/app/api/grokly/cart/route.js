import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyAuthToken } from '@/app/api/_lib/auth';
import {
  getCartCollection,
  toCartItemResponse,
  buildCartSummary,
  PRODUCTS_COLLECTION,
} from '@/app/api/_lib/groklyCart';

export const dynamic = 'force-dynamic';

// GET /api/grokly/cart — the authenticated user's cart items + summary
export async function GET(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const snapshot = await getCartCollection(uid).orderBy('addedAt', 'asc').get();
    if (snapshot.empty) {
      return NextResponse.json({ items: [], summary: buildCartSummary([]) }, { status: 200 });
    }

    // Batch-fetch every referenced product in one round trip instead of N+1
    // reads (same pattern as the InstaStyle cart's GET).
    const productIds = [...new Set(snapshot.docs.map((d) => d.data().productId).filter(Boolean))];
    const productSnaps = productIds.length
      ? await adminDb.getAll(...productIds.map((id) => adminDb.collection(PRODUCTS_COLLECTION).doc(id)))
      : [];
    const productsById = new Map(productSnaps.filter((s) => s.exists).map((s) => [s.id, s.data()]));

    const items = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const product = productsById.get(data.productId) || null;
      return toCartItemResponse({ itemId: docSnap.id, data, product });
    });

    return NextResponse.json({ items, summary: buildCartSummary(items) }, { status: 200 });
  } catch (error) {
    console.error('Error fetching Grokly cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/grokly/cart — clear the entire cart
export async function DELETE(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const snapshot = await getCartCollection(uid).get();
    if (snapshot.empty) {
      return NextResponse.json({ message: 'Cart is already empty' }, { status: 200 });
    }

    const batch = adminDb.batch();
    snapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();

    return NextResponse.json({ message: 'Cart cleared' }, { status: 200 });
  } catch (error) {
    console.error('Error clearing Grokly cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
