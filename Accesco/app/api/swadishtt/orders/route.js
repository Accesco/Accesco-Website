import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Persists Swadishtt orders to Firestore. Previously Swadishtt orders only
// lived in the browser's localStorage (set by the client), so they vanished
// across devices/browsers and had no backend record at all. Mirrors the
// grokly_orders / instastyle_orders persistence pattern for parity.
export async function POST(request) {
  try {
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
        userId: order.userId || null,
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

    if (orderId) {
      const docSnap = await getDoc(doc(db, 'swadishtt_orders', orderId));
      if (!docSnap.exists()) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }
      return NextResponse.json({ order: { id: docSnap.id, ...docSnap.data() } });
    }

    if (userId) {
      const q = query(collection(db, 'swadishtt_orders'), where('userId', '==', userId), limit(100));
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach((d) => orders.push({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.placedAt || b.createdAt) - new Date(a.placedAt || a.createdAt));
      return NextResponse.json({ orders });
    }

    if (email) {
      const q = query(collection(db, 'swadishtt_orders'), where('customerEmail', '==', email), limit(100));
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach((d) => orders.push({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.placedAt || b.createdAt) - new Date(a.placedAt || a.createdAt));
      return NextResponse.json({ orders });
    }

    // Admin — most recent 50
    const q = query(collection(db, 'swadishtt_orders'), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    const orders = [];
    snapshot.forEach((d) => orders.push({ id: d.id, ...d.data() }));
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('[swadishtt/orders] GET error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
