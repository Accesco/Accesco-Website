import { NextResponse } from 'next/server';
import { verifyAuthToken } from '../_lib/auth';
import { requireAdmin, requireOwnerOrAdmin } from '../_lib/authz';

export const dynamic = 'force-dynamic';

// Records the single Razorpay payment made from the unified cart checkout
// against every per-brand order it paid for. The brand-specific order docs
// (grokly_orders / instastyle_orders / swadishtt_orders) remain each brand's
// source of truth for its own order pipeline; this collection is the
// reconciliation record — "this payment id paid for these N orders" — used
// for combined order history, support, and refund lookups.
export async function POST(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const body = await request.json();
    const { order } = body;

    const hasValidPayment = order?.paymentMethod === 'cod' || order?.razorpayPaymentId;
    if (!order || !order.id || !hasValidPayment) {
      return NextResponse.json({ error: 'Order data with a payment id (or COD) is required.' }, { status: 400 });
    }

    try {
      const { db } = await import('@/lib/firebase');
      const { collection, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      await setDoc(doc(collection(db, 'unified_orders'), order.id), {
        ...order,
        // Identity is derived from the verified token, never trusted from
        // the client body, so a reconciliation record can't be created under
        // someone else's id.
        userId: uid,
        createdAt: serverTimestamp(),
      });
    } catch (dbErr) {
      console.error('[orders] Firestore write failed:', dbErr);
      return NextResponse.json({ error: 'Failed to record order' }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderId: order.id }, { status: 200 });
  } catch (error) {
    console.error('[orders] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    const { db } = await import('@/lib/firebase');
    const { collection, doc, getDoc, getDocs, query, orderBy, limit, where } = await import('firebase/firestore');

    if (orderId) {
      const docSnap = await getDoc(doc(db, 'unified_orders', orderId));
      if (!docSnap.exists()) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }
      const orderData = docSnap.data();
      const authz = await requireOwnerOrAdmin(request, orderData.userId);
      if (authz.error) {
        return NextResponse.json({ error: authz.error }, { status: authz.status });
      }
      return NextResponse.json({ order: { id: docSnap.id, ...orderData } });
    }

    if (userId) {
      const authz = await requireOwnerOrAdmin(request, userId);
      if (authz.error) {
        return NextResponse.json({ error: authz.error }, { status: authz.status });
      }
      const q = query(collection(db, 'unified_orders'), where('userId', '==', userId), limit(100));
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach((d) => orders.push({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.createdAt?.toDate?.() || b.createdAt || 0) - new Date(a.createdAt?.toDate?.() || a.createdAt || 0));
      return NextResponse.json({ orders });
    }

    if (email) {
      const authz = await requireAdmin(request);
      if (authz.error) {
        return NextResponse.json({ error: authz.error }, { status: authz.status });
      }
      const q = query(collection(db, 'unified_orders'), where('customerEmail', '==', email), limit(100));
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach((d) => orders.push({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.createdAt?.toDate?.() || b.createdAt || 0) - new Date(a.createdAt?.toDate?.() || a.createdAt || 0));
      return NextResponse.json({ orders });
    }

    // Admin — most recent 50
    {
      const authz = await requireAdmin(request);
      if (authz.error) {
        return NextResponse.json({ error: authz.error }, { status: authz.status });
      }
    }
    const q = query(collection(db, 'unified_orders'), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    const orders = [];
    snapshot.forEach((d) => orders.push({ id: d.id, ...d.data() }));
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('[orders] GET error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
