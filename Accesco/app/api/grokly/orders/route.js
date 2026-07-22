import { NextResponse } from 'next/server';
import { saveOrderToFirestore, fetchOrdersFromFirestore, updateOrderStatusInFirestore } from '@/lib/orderService';
import { sendOrderLifecycleEmail } from '@/lib/orderLifecycle';

export const dynamic = 'force-dynamic';

function buildGroklyOrderEmailHtml({ customerName, orderId, items = [], subtotal = 0, deliveryFee = 0, discount = 0, total = 0, deliverySpeed, address, eta }) {
  const itemsHtml = (items || []).map(item => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
        <a href="https://www.accescoliving.com/services/grokly/category/${item.category || 'all'}" style="color:#0c831f;text-decoration:none;font-weight:600;">${item.name}</a>
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
      <p style="font-size:13px;color:#888;margin:0 0 24px;">Delivery to: ${address || 'Selected Address'}</p>

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
        — Grokly by Accesco Living · <a href="https://www.accescoliving.com/services/grokly/profile?orderId=${orderId}" style="color:#0c831f;font-weight:700;text-decoration:underline;">Track Order #${orderId}</a>
      </p>
    </div>
  `;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { order, customerEmail } = body;

    if (!order || (!order.id && !order.orderId)) {
      return NextResponse.json({ error: 'Order data is required.' }, { status: 400 });
    }

    const emailToUse = customerEmail || order.customerEmail;
    const saveResult = await saveOrderToFirestore('grokly', {
      ...order,
      customerEmail: emailToUse,
    });

    // Send order confirmation email if email is provided
    if (emailToUse) {
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
            to: [emailToUse],
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const deviceId = searchParams.get('deviceId');

    const result = await fetchOrdersFromFirestore('grokly', {
      id: orderId,
      userId,
      email,
      deviceId,
    });

    if (orderId) {
      if (!result.order) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }
      return NextResponse.json({ order: result.order });
    }

    return NextResponse.json({ orders: result.orders || [] });
  } catch (error) {
    console.error('[grokly/orders] GET error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { orderId, newStatus, customerEmail, customerName, orderData } = body;

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: 'orderId and newStatus are required.' }, { status: 400 });
    }

    const updateResult = await updateOrderStatusInFirestore('grokly', orderId, newStatus);

    if (customerEmail) {
      sendOrderLifecycleEmail('grokly', orderData || { id: orderId }, customerName || 'Customer', customerEmail, newStatus)
        .catch((err) => console.error('[grokly/orders] Status email error:', err));
    }

    return NextResponse.json({ success: true, status: newStatus, updateResult }, { status: 200 });
  } catch (error) {
    console.error('[grokly/orders] PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
