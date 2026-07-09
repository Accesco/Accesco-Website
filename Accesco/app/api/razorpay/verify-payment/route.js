import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Verifies that a completed payment genuinely came from Razorpay by recomputing
// the HMAC signature server-side with the Key Secret. NEVER trust the frontend's
// "payment succeeded" callback alone — a browser can be tampered with, but this
// signature can't be forged without the secret key.
export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error('[razorpay/verify-payment] RAZORPAY_KEY_SECRET is not configured');
      return NextResponse.json({ error: 'Payments are not configured' }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Constant-time comparison to avoid leaking timing information about the signature.
    const expectedBuf = Buffer.from(expectedSignature, 'hex');
    const providedBuf = Buffer.from(String(razorpay_signature), 'hex');
    const isValid =
      expectedBuf.length === providedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, providedBuf);

    if (!isValid) {
      console.warn('[razorpay/verify-payment] Signature mismatch — possible tampered payment');
      return NextResponse.json({ verified: false, error: 'Payment verification failed' }, { status: 400 });
    }

    return NextResponse.json({ verified: true, paymentId: razorpay_payment_id });
  } catch (error) {
    console.error('[razorpay/verify-payment] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
