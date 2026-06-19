import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function buildInstaStyleOrderEmailHtml({ customerName, orderId, items, subtotal, deliveryFee, discount, total, deliverySpeed, address }) {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece8;">
        <strong>${item.name}</strong>
        ${item.brand ? `<br/><span style="color:#888;font-size:12px;">${item.brand}</span>` : ''}
        ${item.size ? `<span style="color:#888;font-size:12px;"> · Size ${item.size}</span>` : ''}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece8;text-align:center;">x${item.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece8;text-align:right;">₹${((item.discountedPrice || item.price) * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const etaLabel = deliverySpeed === 'batched'
    ? '~25 min (batched delivery)'
    : '~11 min (express)';

  return `
    <div style="font-family:'Georgia',serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#1a1a1a;">
      <div style="border-top:3px solid #1a1a1a;padding-top:24px;margin-bottom:32px;">
        <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;">Order Confirmed</p>
        <h1 style="margin:0;font-size:28px;font-weight:400;letter-spacing:-0.5px;">InstaStyle</h1>
        <p style="margin:4px 0 0;font-size:12px;color:#888;">by Accesco Living</p>
      </div>

      <p style="font-size:15px;line-height:1.8;margin:0 0 24px;">
        Hi ${customerName || 'there'} — your order is confirmed and being prepared.
        Estimated delivery: <strong>${etaLabel}</strong>.
      </p>

      <p style="font-size:12px;color:#888;margin:0 0 4px;">Order · <code style="background:#f5f5f0;padding:2px 6px;">${orderId}</code></p>
      <p style="font-size:12px;color:#888;margin:0 0 32px;">Ship to: ${address}</p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 0;border-bottom:1px solid #1a1a1a;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:400;">Item</th>
            <th style="text-align:center;padding:8px 0;border-bottom:1px solid #1a1a1a;font-size:11px;text-transform:uppercase;font-weight:400;">Qty</th>
            <th style="text-align:right;padding:8px 0;border-bottom:1px solid #1a1a1a;font-size:11px;text-transform:uppercase;font-weight:400;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <table style="width:100%;font-size:14px;margin-bottom:32px;">
        <tr>
          <td style="padding:5px 0;color:#666;">Subtotal</td>
          <td style="padding:5px 0;text-align:right;">₹${subtotal.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#666;">Delivery</td>
          <td style="padding:5px 0;text-align:right;">${deliveryFee === 0 ? '<span style="color:#2d6a4f;">FREE</span>' : `₹${deliveryFee}`}</td>
        </tr>
        ${discount > 0 ? `
        <tr>
          <td style="padding:5px 0;color:#2d6a4f;">Batched Saving</td>
          <td style="padding:5px 0;text-align:right;color:#2d6a4f;">-₹${discount}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:12px 0 4px;font-size:16px;font-weight:600;border-top:1px solid #1a1a1a;">Total</td>
          <td style="padding:12px 0 4px;text-align:right;font-size:16px;font-weight:600;border-top:1px solid #1a1a1a;">₹${total.toLocaleString('en-IN')}</td>
        </tr>
      </table>

      <p style="font-size:12px;color:#999;border-top:1px solid #f0ece8;padding-top:20px;margin:0;">
        InstaStyle by Accesco Living · 
        <a href="https://www.accescoliving.com/services/instastyle/orders" style="color:#1a1a1a;">View your orders</a>
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
      await setDoc(doc(collection(db, 'instastyle_orders'), order.id), {
        ...order,
        customerEmail: customerEmail || null,
        createdAt: serverTimestamp(),
      });
    } catch (dbErr) {
      console.error('[instastyle/orders] Firestore write failed:', dbErr);
    }

    // Send confirmation email
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
            subject: `Your InstaStyle order is confirmed — ${order.id}`,
            html: buildInstaStyleOrderEmailHtml(order),
          }),
        }).catch((err) => console.error('[instastyle/orders] Email failed:', err));
      }
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

    const { db } = await import('@/lib/firebase');
    const { collection, doc, getDoc, getDocs, query, orderBy, limit } = await import('firebase/firestore');

    if (orderId) {
      const docSnap = await getDoc(doc(db, 'instastyle_orders', orderId));
      if (!docSnap.exists()) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }
      return NextResponse.json({ order: { id: docSnap.id, ...docSnap.data() } });
    }

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
