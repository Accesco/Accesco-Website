import { NextResponse } from 'next/server';
import { sendInstaStyleConfirmation } from '@/lib/mailService';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { order, customerEmail } = body;

    if (!order || !order.id) {
      return NextResponse.json({ error: 'Order data is required.' }, { status: 400 });
    }

    // Persist to Firestore
    try {
      const { db } = await import('@/lib/firebase');
      const { collection, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      await setDoc(doc(collection(db, 'instastyle_orders'), order.id), {
        ...order,
        customerEmail: customerEmail || null,
        createdAt: serverTimestamp(),
      });
    } catch (dbErr) {
      console.error('[instastyle/orders] Firestore write failed:', dbErr);
    }

    // If this is the user's first order, bundle in any pending referral gifts
    if (order.phone) {
      const { markFirstOrderAndFulfillGifts } = await import('@/lib/referralFulfillment');
      markFirstOrderAndFulfillGifts({ phone: order.phone, orderId: order.id, vertical: 'instastyle' }).catch(
        (err) => console.error('[instastyle/orders] Referral fulfillment failed:', err),
      );
    }

    // Send confirmation email using the rich template from mailService
    const emailTo = customerEmail || order.customerEmail;
    if (emailTo) {
      const customerName = order.customerName || order.address?.fullName || 'Customer';
      // Build totals object from top-level fields if nested totals not present
      const totals = order.totals || {
        subtotal: order.subtotal || 0,
        shippingFee: order.deliveryFee || 0,
        deliveryFee: order.deliveryFee || 0,
        gst: order.tax || 0,
        total: order.total || 0,
        discount: order.speedDiscount || 0,
      };
      // Build shippingAddress from address form data if not present
      const shippingAddress = order.shippingAddress || (order.address ? {
        line1: order.address.addressLine1 || order.address.line1 || '',
        city: order.address.city || '',
        pincode: order.address.pincode || '',
      } : {});

      sendInstaStyleConfirmation({
        order: { ...order, totals, shippingAddress },
        customerName,
        email: emailTo,
      }).catch((err) => console.error('[instastyle/orders] Email failed:', err));
    }

    return NextResponse.json({ success: true, orderId: order.id }, { status: 200 });
  } catch (error) {
    console.error('[instastyle/orders] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const deviceId = searchParams.get('deviceId');

    const { db } = await import('@/lib/firebase');
    const { collection, doc, getDoc, getDocs, query, orderBy, limit, where } = await import('firebase/firestore');

    // Fetch single order by ID
    if (orderId) {
      const docSnap = await getDoc(doc(db, 'instastyle_orders', orderId));
      if (!docSnap.exists()) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }
      return NextResponse.json({ order: { id: docSnap.id, ...docSnap.data() } });
    }

    // Fetch orders by deviceId
    if (deviceId) {
      const q = query(
        collection(db, 'instastyle_orders'),
        where('deviceId', '==', deviceId),
        limit(100)
      );
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach(d => orders.push({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
      return NextResponse.json({ orders });
    }

    // Fetch orders by userId
    if (userId) {
      const q = query(
        collection(db, 'instastyle_orders'),
        where('userId', '==', userId),
        limit(100)
      );
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach(d => orders.push({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
      return NextResponse.json({ orders });
    }

    // Fetch orders by email
    if (email) {
      const q = query(
        collection(db, 'instastyle_orders'),
        where('customerEmail', '==', email),
        limit(100)
      );
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach(d => orders.push({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
      return NextResponse.json({ orders });
    }

    // Fetch all orders (admin — most recent 50)
    const q = query(collection(db, 'instastyle_orders'), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    const orders = [];
    snapshot.forEach(d => orders.push({ id: d.id, ...d.data() }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('[instastyle/orders] GET error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
