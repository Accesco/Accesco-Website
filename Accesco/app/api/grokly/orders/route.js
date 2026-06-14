import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function buildGroklyOrderEmailHtml({ customerName, orderId, items, subtotal, deliveryFee, discount, total, deliverySpeed, address, eta }) {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${item.name}</td>
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
        — Grokly by Accesco Living · <a href="https://www.accescoliving.com/services/grokly" style="color:#1a1a1a;">Track your order</a>
      </p>
    </div>
  `;
}

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
      await setDoc(doc(collection(db, 'grokly_orders'), order.id), {
        ...order,
        customerEmail: customerEmail || null,
        createdAt: serverTimestamp(),
      });
    } catch (dbErr) {
      console.error('[grokly/orders] Firestore write failed:', dbErr);
      // Don't fail the request — email still goes out
    }

    // Send order confirmation email if email is provided
    if (customerEmail) {
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
            to: [customerEmail],
            subject: `Order confirmed — ${order.id} | Grokly`,
            html: buildGroklyOrderEmailHtml(order),
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    const { db } = await import('@/lib/firebase');
    const { collection, doc, getDoc, getDocs, query, orderBy, limit } = await import('firebase/firestore');

    if (orderId) {
      const docSnap = await getDoc(doc(db, 'grokly_orders', orderId));
      if (!docSnap.exists()) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }
      return NextResponse.json({ order: { id: docSnap.id, ...docSnap.data() } });
    }

    const q = query(collection(db, 'grokly_orders'), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    const orders = [];
    snapshot.forEach(d => orders.push({ id: d.id, ...d.data() }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('[grokly/orders] GET error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
