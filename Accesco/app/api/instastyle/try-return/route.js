import { NextResponse } from 'next/server';
import { verifyAuthToken } from '../../_lib/auth';
import { requireOwnerOrAdmin } from '../../_lib/authz';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { uid, error: authError } = await verifyAuthToken(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const body = await request.json();

    const { db } = await import('@/lib/firebase');
    const { collection, doc, getDoc, addDoc, serverTimestamp } = await import('firebase/firestore');

    // Same situation as report-issue/route.js: the try-return UI currently
    // sources orders from a hardcoded demo array, so body.orderId won't
    // resolve to a real order today. Ownership is enforced only when it
    // does, so this doesn't block the current (demo-data) flow while still
    // protecting real orders if the frontend is later wired to them.
    if (body.orderId) {
      const orderSnap = await getDoc(doc(db, 'instastyle_orders', body.orderId));
      if (orderSnap.exists()) {
        const authz = await requireOwnerOrAdmin(request, orderSnap.data().userId);
        if (authz.error) {
          return NextResponse.json({ error: authz.error }, { status: authz.status });
        }
      }
    }

    try {
      await addDoc(collection(db, 'instastyle_try_returns'), {
        itemId: body.itemId || 'item_1',
        orderId: body.orderId || null,
        userId: uid,
        name: body.name || 'Returned Item',
        refundAmount: body.refundAmount || 0,
        refundMethod: body.refundMethod || 'Circular Credits',
        status: 'scheduled',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('[instastyle/try-return] Firestore error:', err);
    }

    return NextResponse.json({ success: true, status: 'scheduled' });
  } catch (error) {
    console.error('[instastyle/try-return] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
