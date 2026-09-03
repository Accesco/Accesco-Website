import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyAuthToken } from '../../_lib/auth';
import { creditWallet } from '../../_lib/wallet';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { uid, error: authError } = await verifyAuthToken(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const body = await request.json();
    const { action = 'create_order' } = body;

    // ACTION 1: Create Razorpay order for wallet top-up
    if (action === 'create_order') {
      const { amount } = body;
      const numAmount = Number(amount);

      if (!Number.isFinite(numAmount) || numAmount <= 0 || !Number.isInteger(numAmount)) {
        return NextResponse.json({ error: 'Please enter a valid positive whole amount in ₹.' }, { status: 400 });
      }

      if (numAmount > 100000) {
        return NextResponse.json({ error: 'Maximum top-up amount per transaction is ₹1,00,000.' }, { status: 400 });
      }

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keyId || !keySecret) {
        console.error('[wallet/topup] Razorpay keys missing');
        return NextResponse.json({ error: 'Payment gateway configuration missing.' }, { status: 500 });
      }

      const amountPaise = Math.round(numAmount * 100);
      const receipt = `topup_${uid}_${Date.now()}`;
      const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

      const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authHeader}`,
        },
        body: JSON.stringify({
          amount: amountPaise,
          currency: 'INR',
          receipt,
          notes: { uid, purpose: 'wallet_topup', amountInINR: numAmount },
        }),
      });

      const order = await rzpRes.json();
      if (!rzpRes.ok) {
        console.error('[wallet/topup] Razorpay order error:', order);
        return NextResponse.json({ error: order?.error?.description || 'Failed to create top-up payment.' }, { status: rzpRes.status });
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
        amountINR: numAmount,
      });
    }

    // ACTION 2: Verify Razorpay payment and credit wallet atomically & idempotently
    if (action === 'verify_payment') {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ error: 'Missing Razorpay payment verification fields.' }, { status: 400 });
      }

      const numAmount = Number(amount);
      if (!Number.isFinite(numAmount) || numAmount <= 0) {
        return NextResponse.json({ error: 'Invalid top-up credit amount.' }, { status: 400 });
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        console.error('[wallet/topup] RAZORPAY_KEY_SECRET missing');
        return NextResponse.json({ error: 'Payment gateway configuration missing.' }, { status: 500 });
      }

      // HMAC SHA256 signature verification
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const expectedBuf = Buffer.from(expectedSignature, 'hex');
      const providedBuf = Buffer.from(String(razorpay_signature), 'hex');

      const isValid =
        expectedBuf.length === providedBuf.length &&
        crypto.timingSafeEqual(expectedBuf, providedBuf);

      if (!isValid) {
        console.warn('[wallet/topup] Razorpay signature verification failed');
        return NextResponse.json({ error: 'Payment verification failed. Invalid signature.' }, { status: 400 });
      }

      // Atomically and idempotently credit the user's wallet
      const creditRes = await creditWallet({
        uid,
        amount: numAmount,
        reason: 'Wallet Top Up',
        source: 'razorpay',
        referenceId: razorpay_payment_id,
        idempotencyKey: razorpay_payment_id,
      });

      if (creditRes.error) {
        return NextResponse.json({ error: creditRes.error }, { status: creditRes.status || 500 });
      }

      return NextResponse.json({
        success: true,
        balance: creditRes.balance,
        transactionId: razorpay_payment_id,
        applied: creditRes.applied,
      });
    }

    return NextResponse.json({ error: `Unsupported action: ${action}` }, { status: 400 });
  } catch (error) {
    console.error('[wallet/topup] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
