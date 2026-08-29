import { NextResponse } from 'next/server';
import { requireOwnerOrAdmin } from '../../../../_lib/authz';

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  try {
    const orderId = params.id;
    const body = await request.json();

    const { db } = await import('@/lib/firebase');
    const { collection, doc, getDoc, addDoc, serverTimestamp } = await import('firebase/firestore');

    // Order must exist and belong to the caller (or be an admin) before a
    // report can be filed against it — closes the previous gap where anyone
    // could file an issue report against any order id with no auth at all.
    const orderSnap = await getDoc(doc(db, 'swadishtt_orders', orderId));
    if (!orderSnap.exists()) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    const authz = await requireOwnerOrAdmin(request, orderSnap.data().userId);
    if (authz.error) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    try {
      await addDoc(collection(db, 'swadishtt_issue_reports'), {
        orderId,
        userId: authz.uid,
        issueType: body.issueType || 'missing',
        items: body.items || [],
        details: body.details || '',
        photos: body.photos || [],
        refundTotal: body.refundTotal || 0,
        greenPoints: body.greenPoints || 10,
        status: 'pending_review',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('[swadishtt/report-issue] Firestore error:', err);
    }

    return NextResponse.json({
      success: true,
      orderId,
      status: 'received',
      refundTotal: body.refundTotal || 0,
      greenPoints: body.greenPoints || 10,
    });
  } catch (error) {
    console.error('[swadishtt/report-issue] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
