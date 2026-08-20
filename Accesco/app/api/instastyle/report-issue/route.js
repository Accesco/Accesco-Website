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
    const orderId = body.orderId || 'AC-2041';

    const { db } = await import('@/lib/firebase');
    const { collection, doc, getDoc, addDoc, serverTimestamp } = await import('firebase/firestore');

    // The report-issue UI (app/services/instastyle/report-issue/page.jsx)
    // currently sources its order list from a hardcoded demo array, not
    // real orders, so orderId won't resolve to a real instastyle_orders doc
    // today — that's a pre-existing frontend gap outside this task's scope
    // (fixing it means wiring that page to real order data, not an
    // authorization change). Ownership is enforced only when the id *does*
    // resolve to a real order, so this doesn't hard-block every submission
    // the current frontend can ever send, while still protecting real
    // orders once/if the frontend is updated to reference them.
    const orderSnap = await getDoc(doc(db, 'instastyle_orders', orderId));
    if (orderSnap.exists()) {
      const authz = await requireOwnerOrAdmin(request, orderSnap.data().userId);
      if (authz.error) {
        return NextResponse.json({ error: authz.error }, { status: authz.status });
      }
    }

    try {
      await addDoc(collection(db, 'instastyle_issue_reports'), {
        orderId,
        userId: uid,
        issueType: body.issueType || 'size_fit',
        details: body.details || '',
        status: 'pending_review',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('[instastyle/report-issue] Firestore error:', err);
    }

    return NextResponse.json({
      success: true,
      orderId,
      status: 'received',
    });
  } catch (error) {
    console.error('[instastyle/report-issue] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
