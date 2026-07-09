import { NextResponse } from 'next/server';

// Creates a Razorpay order server-side via Razorpay's REST API directly
// (not the `razorpay` npm SDK — its bundled axios client breaks under Next.js's
// webpack dev bundling and throws an unhelpful "Cannot read properties of
// undefined (reading 'status')" on any failure). The Key Secret never reaches
// the client — only the resulting order id (and the public Key ID) are returned.
export async function POST(request) {
  try {
    const { amount, currency = 'INR', receipt } = await request.json();

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'A valid amount is required' }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      console.error('[razorpay/create-order] Razorpay keys are not configured');
      return NextResponse.json({ error: 'Payments are not configured' }, { status: 500 });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    // Some local dev networks (antivirus HTTPS inspection, corporate proxies)
    // intermittently break the first outbound HTTPS connection but succeed on
    // retry. One silent retry keeps checkout smooth without masking real failures.
    const requestOrder = () =>
      fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        // Razorpay expects the amount in the smallest currency unit (paise for INR).
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency,
          receipt: receipt || `receipt_${Date.now()}`,
        }),
      });

    let res;
    try {
      res = await requestOrder();
    } catch (networkErr) {
      console.warn('[razorpay/create-order] Network error, retrying once:', networkErr.message);
      res = await requestOrder();
    }

    const order = await res.json();

    if (!res.ok) {
      console.error('[razorpay/create-order] Razorpay API error:', order);
      return NextResponse.json(
        { error: order?.error?.description || 'Failed to create payment order' },
        { status: res.status },
      );
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId, // public key id, safe to send to the client
    });
  } catch (error) {
    console.error('[razorpay/create-order] Error:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
