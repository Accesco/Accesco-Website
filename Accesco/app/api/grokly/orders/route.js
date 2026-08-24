import { NextResponse } from 'next/server';
import { verifyAuthToken } from '../../_lib/auth';
import { requireAdmin, requireOwnerOrAdmin } from '../../_lib/authz';

export const dynamic = 'force-dynamic';

function buildGroklyOrderEmailHtml({ customerName, orderId, items, subtotal, deliveryFee, discount, total, deliverySpeed, address, eta }) {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
        <a href="https://accescoliving.com/services/grokly/category/${item.category || 'all'}" style="color:#0c831f;text-decoration:none;font-weight:600;">${item.name}</a>
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:center;">x${item.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const etaLabel = deliverySpeed === 'batched'
    ? `~${eta || 25} min (batched)`
    : `~${eta || 11} min`;

  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1a1a1a;">
      <div style="background:#f5f5f0;border-radius:8px;padding:24px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;">Order Confirmed</p>
        <h1 style="margin:0;font-size:26px;font-weight:700;">Your Grokly order is placed.</h1>
      </div>

      <p style="font-size:15px;line-height:1.7;margin:0 0 20px;">
        Hi ${customerName || 'there'}, your groceries are on their way.
        Estimated delivery: <strong>${etaLabel}</strong>.
      </p>

      <p style="font-size:13px;color:#888;margin:0 0 6px;">Order ID: <code style="background:#f0f0f0;padding:2px 6px;border-radius:4px;">${orderId}</code></p>
      <p style="font-size:13px;color:#888;margin:0 0 24px;">Delivery to: ${address}</p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 0;border-bottom:2px solid #1a1a1a;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Item</th>
            <th style="text-align:center;padding:8px 0;border-bottom:2px solid #1a1a1a;font-size:12px;text-transform:uppercase;">Qty</th>
            <th style="text-align:right;padding:8px 0;border-bottom:2px solid #1a1a1a;font-size:12px;text-transform:uppercase;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <table style="width:100%;font-size:14px;margin-bottom:24px;">
        <tr>
          <td style="padding:4px 0;color:#555;">Subtotal</td>
          <td style="padding:4px 0;text-align:right;">₹${subtotal.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#555;">Delivery</td>
          <td style="padding:4px 0;text-align:right;">${deliveryFee === 0 ? '<span style="color:#0c831f;">FREE</span>' : `₹${deliveryFee}`}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#555;">Handling</td>
          <td style="padding:4px 0;text-align:right;">₹2</td>
        </tr>
        ${discount > 0 ? `
        <tr>
          <td style="padding:4px 0;color:#0c831f;">Batched Discount</td>
          <td style="padding:4px 0;text-align:right;color:#0c831f;">-₹${discount}</td>
        </tr>` : ''}
        <tr style="border-top:2px solid #1a1a1a;">
          <td style="padding:10px 0 4px;font-weight:700;font-size:16px;">Total Paid</td>
          <td style="padding:10px 0 4px;text-align:right;font-weight:700;font-size:16px;">₹${total.toLocaleString('en-IN')}</td>
        </tr>
      </table>

      <p style="font-size:13px;color:#999;margin:32px 0 0;">
        — Grokly by Accesco Living · <a href="https://accescoliving.com/services/grokly/profile?orderId=${orderId}" style="color:#0c831f;font-weight:700;text-decoration:underline;">Track Order #${orderId}</a>
      </p>
    </div>
  `;
}

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
    // one transaction: reading the order doc first makes this idempotent (a
    // retried request for the same order.id sees it already exists and
    // skips straight to "already created", never decrementing stock twice),
    // and insufficient stock aborts the whole transaction so a rejected
    // order is never partially created. Unlike the previous version, a
    // failure here now fails the request instead of being silently
    // swallowed — an order that didn't actually persist must not be
    // reported as a success (email send below stays best-effort/non-blocking,
    // that part of the original resilience is preserved).
    const { db } = await import('@/lib/firebase');
    const { collection, doc, runTransaction, serverTimestamp } = await import('firebase/firestore');
    const { planGroklyStockDecrements } = await import('../../_lib/inventory');

    const orderRef = doc(collection(db, 'grokly_orders'), order.id);

    const txResult = await runTransaction(db, async (transaction) => {
      const existing = await transaction.get(orderRef);
      if (existing.exists()) {
        return { alreadyCreated: true };
      }

      const stockPlan = await planGroklyStockDecrements(transaction, db, order.items);
      if (stockPlan.error) {
        return { error: stockPlan.error, status: stockPlan.status };
      }

      transaction.set(orderRef, {
        ...order,
        customerEmail: customerEmail || order.customerEmail || null,
        // Identity is derived from the verified token, never trusted from the
        // client body, so an order can't be created under someone else's id.
        userId: uid,
        createdAt: serverTimestamp(),
      });

      for (const { ref, newQty } of stockPlan.decrements) {
        transaction.update(ref, { stockQty: newQty });
      }

      return { created: true };
    });

    if (txResult.error) {
      return NextResponse.json({ error: txResult.error }, { status: txResult.status });
    }

    // Send order confirmation email if email is provided
    const emailTo = customerEmail || order.customerEmail;
    if (emailTo) {
      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey) {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Accesco <noreply@accescoliving.com>';
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [emailTo],
            subject: `Order confirmed — ${order.id} | Grokly`,
            html: buildGroklyOrderEmailHtml({
              ...order,
              orderId: order.id,
            }),
          }),
        }).catch((err) => console.error('[grokly/orders] Email failed:', err));
      }
    }

    return NextResponse.json({ success: true, orderId: order.id }, { status: 200 });
  } catch (error) {
    console.error('[grokly/orders] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId and status are required.' }, { status: 400 });
    }

    const { db } = await import('@/lib/firebase');
    const { doc, getDoc, setDoc } = await import('firebase/firestore');

    const orderRef = doc(db, 'grokly_orders', orderId);

    // The order's own status-progress simulator (GroklyContext.jsx) syncs
    // status changes here for the order's owner — not just admins — so this
    // checks ownership (or admin) rather than requiring admin outright.
    const existing = await getDoc(orderRef);
    if (!existing.exists()) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }
    const authz = await requireOwnerOrAdmin(request, existing.data().userId);
    if (authz.error) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    await setDoc(orderRef, { status }, { merge: true });

    return NextResponse.json({ success: true, orderId, status }, { status: 200 });
  } catch (error) {
    console.error('[grokly/orders] PATCH error:', error);
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
        collection(db, 'grokly_orders'),
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
      const docSnap = await getDoc(doc(db, 'grokly_orders', orderId));
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
        collection(db, 'grokly_orders'),
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
        collection(db, 'grokly_orders'),
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
      const q = query(collection(db, 'grokly_orders'), orderBy('createdAt', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach(d => orders.push({ id: d.id, ...d.data() }));
      return NextResponse.json({ orders });
    } else {
      const q = query(collection(db, 'grokly_orders'), where('userId', '==', authUid), limit(100));
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach(d => orders.push({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
      return NextResponse.json({ orders });
    }
  } catch (error) {
    console.error('[grokly/orders] GET error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
