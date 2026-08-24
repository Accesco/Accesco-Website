import { NextResponse } from 'next/server';
import { verifyAuthToken } from '../../_lib/auth';
import { requireAdmin, requireOwnerOrAdmin } from '../../_lib/authz';

export const dynamic = 'force-dynamic';

// Persists Swadishtt orders to Firestore. Previously Swadishtt orders only
// lived in the browser's localStorage (set by the client), so they vanished
// across devices/browsers and had no backend record at all. Mirrors the
// grokly_orders / instastyle_orders persistence pattern for parity.
export async function POST(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const body = await request.json();
    const { order, customerEmail } = body;

    if (!order || !order.id) {
      return NextResponse.json({ error: 'Order data is required.' }, { status: 400 });
    }

    try {
      const { db } = await import('@/lib/firebase');
      const { collection, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      await setDoc(doc(collection(db, 'swadishtt_orders'), order.id), {
        ...order,
        customerEmail: customerEmail || order.customerEmail || null,
        // Identity is derived from the verified token, never trusted from
        // the client body, so an order can't be created under someone else's id.
        userId: uid,
        createdAt: serverTimestamp(),
      });
    } catch (dbErr) {
      console.error('[swadishtt/orders] Firestore write failed:', dbErr);
      // Don't fail the request — the order was already confirmed/paid.
    }

    return NextResponse.json({ success: true, orderId: order.id }, { status: 200 });
  } catch (error) {
    console.error('[swadishtt/orders] Unexpected error:', error);
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
    const { getUserRole } = await import('../../_lib/authz');

    const authResult = await verifyAuthToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const authUid = authResult.uid;
    const authEmail = authResult.email;
    const role = await getUserRole(authUid);
    const isAdmin = role === 'admin';

    // Fetch single order by ID
    if (orderId) {
      const docSnap = await getDoc(doc(db, 'swadishtt_orders', orderId));
      if (!docSnap.exists()) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }
      const orderData = docSnap.data();
      const isOwner = orderData.userId === authUid ||
        (Array.isArray(authResult.allowedUids) && authResult.allowedUids.includes(orderData.userId)) ||
        (authEmail && orderData.customerEmail && orderData.customerEmail.toLowerCase() === authEmail.toLowerCase());

      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json({ order: { id: docSnap.id, ...orderData } });
    }

    // Fetch orders by userId
    if (userId) {
      const isOwner = userId === authUid ||
        (Array.isArray(authResult.allowedUids) && authResult.allowedUids.includes(userId));

      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const q = query(collection(db, 'swadishtt_orders'), where('userId', '==', userId), limit(100));
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach((d) => orders.push({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.placedAt || b.createdAt) - new Date(a.placedAt || a.createdAt));
      return NextResponse.json({ orders });
    }

    // Fetch orders by email
    if (email) {
      const isOwner = Boolean(authEmail && email.toLowerCase() === authEmail.toLowerCase());
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: 'Forbidden: admin role required' }, { status: 403 });
      }
      const q = query(collection(db, 'swadishtt_orders'), where('customerEmail', '==', email), limit(100));
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach((d) => orders.push({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.placedAt || b.createdAt) - new Date(a.placedAt || a.createdAt));
      return NextResponse.json({ orders });
    }

    // Fetch all orders (admin — most recent 50) or default to caller's orders
    if (isAdmin) {
      const q = query(collection(db, 'swadishtt_orders'), orderBy('createdAt', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach((d) => orders.push({ id: d.id, ...d.data() }));
      return NextResponse.json({ orders });
    } else {
      const q = query(collection(db, 'swadishtt_orders'), where('userId', '==', authUid), limit(100));
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach((d) => orders.push({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.placedAt || b.createdAt) - new Date(a.placedAt || a.createdAt));
      return NextResponse.json({ orders });
    }
  } catch (error) {
    console.error('[swadishtt/orders] GET error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
