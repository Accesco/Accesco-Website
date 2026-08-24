import { NextResponse } from 'next/server';
import { sendInstaStyleConfirmation } from '@/lib/mailService';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken } from '../../_lib/auth';
import { requireAdmin, requireOwnerOrAdmin } from '../../_lib/authz';
import { planInstaStyleStockDecrements } from '../../_lib/inventory';

export const dynamic = 'force-dynamic';

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

    // Persist to Firestore — order creation and stock decrement happen in
    // one Admin SDK transaction (switched from the client SDK previously
    // used here, so this route can share the exact same product-resolution/
    // stock helpers the InstaStyle cart backend already validates against —
    // see _lib/instastyleCart.js / _lib/inventory.js). Reading the order doc
    // first makes this idempotent: a retried request for the same order.id
    // sees it already exists and never re-decrements stock. Insufficient
    // stock aborts the whole transaction, so a rejected order is never
    // partially created. A failure here now fails the request instead of
    // being silently swallowed, since an order that didn't actually persist
    // must not be reported as a success (the email send below stays
    // best-effort/non-blocking, same as before).
    const orderRef = adminDb.collection('instastyle_orders').doc(order.id);

    const txResult = await adminDb.runTransaction(async (transaction) => {
      const existing = await transaction.get(orderRef);
      if (existing.exists) {
        return { alreadyCreated: true };
      }

      const stockPlan = await planInstaStyleStockDecrements(transaction, order.items);
      if (stockPlan.error) {
        return { error: stockPlan.error, status: stockPlan.status };
      }

      transaction.set(orderRef, {
        ...order,
        customerEmail: customerEmail || null,
        // Identity is derived from the verified token, never trusted from
        // the client body, so an order can't be created under someone else's id.
        userId: uid,
        createdAt: FieldValue.serverTimestamp(),
      });

      for (const { ref, field, newQty } of stockPlan.decrements) {
        transaction.update(ref, { [field]: newQty });
      }

      return { created: true };
    });

    if (txResult.error) {
      return NextResponse.json({ error: txResult.error }, { status: txResult.status });
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
    const { getUserRole } = await import('../../_lib/authz');

    // Fetch orders by deviceId — guest capability token for unauthenticated cart/order identity
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
      const docSnap = await getDoc(doc(db, 'instastyle_orders', orderId));
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
      const isOwner = Boolean(authEmail && email.toLowerCase() === authEmail.toLowerCase());
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: 'Forbidden: admin role required' }, { status: 403 });
      }
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

    // Fetch all orders (admin — most recent 50) or default to caller's orders
    if (isAdmin) {
      const q = query(collection(db, 'instastyle_orders'), orderBy('createdAt', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach(d => orders.push({ id: d.id, ...d.data() }));
      return NextResponse.json({ orders });
    } else {
      const q = query(collection(db, 'instastyle_orders'), where('userId', '==', authUid), limit(100));
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach(d => orders.push({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
      return NextResponse.json({ orders });
    }
  } catch (error) {
    console.error('[instastyle/orders] GET error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
