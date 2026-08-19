import { NextResponse } from 'next/server';
import { requireOwnerOrAdmin } from '../../../../_lib/authz';

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  try {
    const orderId = params.id;
    const body = await request.json();

    const { db } = await import('@/lib/firebase');
    const { collection, doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore');

    // Order must exist and belong to the caller (or be an admin) before a
    // container return can be scheduled against it.
    const orderSnap = await getDoc(doc(db, 'swadishtt_orders', orderId));
    if (!orderSnap.exists()) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    const authz = await requireOwnerOrAdmin(request, orderSnap.data().userId);
    if (authz.error) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    try {
      await setDoc(doc(collection(db, 'swadishtt_container_returns'), `${orderId}_${Date.now()}`), {
        // Spread first so a client-supplied body can never override the
        // server-derived orderId/userId/status/greenPointsEarned below.
        ...body,
        orderId,
        userId: authz.uid,
        status: 'scheduled',
        greenPointsEarned: 10,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('[swadishtt/return-container] Firestore write error:', err);
    }

    return NextResponse.json({ success: true, orderId, status: 'scheduled', greenPointsEarned: 10 });
  } catch (error) {
    console.error('[swadishtt/return-container] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
