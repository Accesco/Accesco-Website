import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyAuthToken } from '../../_lib/auth';
import { debitWallet } from '../../_lib/wallet';
import { validateCateringPaymentAmount } from '../../_lib/cateringPackages';
import { sendSwadishttConfirmation } from '@/lib/mailService';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { uid, error: authError } = await verifyAuthToken(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const body = await request.json();
    const { action, packageId, amount, bookingData, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Validate package ID and payment amount server-authoritatively
    const valResult = validateCateringPaymentAmount(packageId, amount);
    if (!valResult.valid) {
      return NextResponse.json({ error: valResult.error }, { status: 400 });
    }
    const { pkg, amount: numAmount } = valResult;

    // ── ACTION 1: Create Razorpay Order for Catering Advance ──
    if (action === 'create_razorpay_order') {
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keyId || !keySecret) {
        console.error('[swadishtt/catering] Razorpay keys missing');
        return NextResponse.json({ error: 'Payment gateway configuration missing.' }, { status: 500 });
      }

      const amountPaise = Math.round(numAmount * 100);
      const receipt = `cat_${uid}_${Date.now()}`;
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
          notes: { uid, packageId, packageName: pkg.name, amountInINR: numAmount },
        }),
      });

      const order = await rzpRes.json();
      if (!rzpRes.ok) {
        console.error('[swadishtt/catering] Razorpay order creation failed:', order);
        return NextResponse.json({ error: order?.error?.description || 'Failed to create payment order.' }, { status: rzpRes.status });
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
        packageId,
        paidAmount: numAmount,
      });
    }

    // ── ACTION 2: Verify Razorpay Payment for Catering Booking ──
    if (action === 'verify_razorpay_payment') {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ error: 'Missing payment verification credentials.' }, { status: 400 });
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
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
        console.warn('[swadishtt/catering] Signature verification failed');
        return NextResponse.json({ error: 'Payment verification failed. Invalid signature.' }, { status: 400 });
      }

      const bookingId = bookingData?.id || `CAT-${Date.now().toString(36).toUpperCase()}`;
      const remainingAmount = pkg.price - numAmount;

      const orderRecord = {
        id: bookingId,
        type: 'catering',
        userId: uid,
        packageId: pkg.id,
        packageName: pkg.name,
        serves: pkg.serves || bookingData?.serves,
        totalAmount: pkg.price,
        totalAmountPaise: pkg.price * 100,
        minimumRequired: pkg.minAdvance,
        minimumRequiredPaise: pkg.minAdvance * 100,
        paidAmount: numAmount,
        paidAmountPaise: numAmount * 100,
        remainingAmount: remainingAmount,
        remainingAmountPaise: remainingAmount * 100,
        paymentStatus: 'SUCCESS',
        bookingStatus: 'CONFIRMED',
        paymentMethod: 'RAZORPAY',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        customerName: bookingData?.delivery?.name || bookingData?.name || '',
        customerEmail: bookingData?.delivery?.email || bookingData?.email || '',
        delivery: bookingData?.delivery || {},
        date: bookingData?.date || '',
        time: bookingData?.time || '',
        notes: bookingData?.notes || '',
        dietary: bookingData?.dietary || 'Standard',
        cuisine: bookingData?.cuisine || 'Standard',
        placedAt: new Date().toISOString(),
      };

      // Persist booking securely to Firestore
      try {
        const { db } = await import('@/lib/firebase');
        const { collection, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
        await setDoc(doc(collection(db, 'swadishtt_orders'), bookingId), {
          ...orderRecord,
          createdAt: serverTimestamp(),
        });
      } catch (dbErr) {
        console.error('[swadishtt/catering] Firestore write error:', dbErr);
      }

      // Send confirmation email
      try {
        await sendSwadishttConfirmation({
          order: orderRecord,
          customerName: orderRecord.customerName,
          email: orderRecord.customerEmail,
        });
      } catch (mailErr) {
        console.warn('[swadishtt/catering] Email sending failed silently:', mailErr.message);
      }

      return NextResponse.json({
        success: true,
        bookingId,
        totalAmount: pkg.price,
        paidAmount: numAmount,
        remainingAmount,
        paymentMethod: 'RAZORPAY',
        bookingStatus: 'CONFIRMED',
      });
    }

    // ── ACTION 3: Direct Wallet Payment for Catering Booking ──
    if (action === 'pay_wallet') {
      const bookingId = bookingData?.id || `CAT-${Date.now().toString(36).toUpperCase()}`;
      const idempotencyKey = `cat_pay_${bookingId}_${pkg.id}`;

      // Perform atomic debit on server wallet
      const debitRes = await debitWallet({
        uid,
        amount: numAmount,
        reason: `Catering Payment - ${pkg.name}`,
        source: 'catering_booking',
        referenceId: bookingId,
        idempotencyKey,
      });

      if (debitRes.error) {
        return NextResponse.json({ error: debitRes.error, balance: debitRes.balance }, { status: debitRes.status || 400 });
      }

      const remainingAmount = pkg.price - numAmount;

      const orderRecord = {
        id: bookingId,
        type: 'catering',
        userId: uid,
        packageId: pkg.id,
        packageName: pkg.name,
        serves: pkg.serves || bookingData?.serves,
        totalAmount: pkg.price,
        totalAmountPaise: pkg.price * 100,
        minimumRequired: pkg.minAdvance,
        minimumRequiredPaise: pkg.minAdvance * 100,
        paidAmount: numAmount,
        paidAmountPaise: numAmount * 100,
        remainingAmount: remainingAmount,
        remainingAmountPaise: remainingAmount * 100,
        paymentStatus: 'SUCCESS',
        bookingStatus: 'CONFIRMED',
        paymentMethod: 'WALLET',
        customerName: bookingData?.delivery?.name || bookingData?.name || '',
        customerEmail: bookingData?.delivery?.email || bookingData?.email || '',
        delivery: bookingData?.delivery || {},
        date: bookingData?.date || '',
        time: bookingData?.time || '',
        notes: bookingData?.notes || '',
        dietary: bookingData?.dietary || 'Standard',
        cuisine: bookingData?.cuisine || 'Standard',
        placedAt: new Date().toISOString(),
      };

      // Persist booking securely to Firestore
      try {
        const { db } = await import('@/lib/firebase');
        const { collection, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
        await setDoc(doc(collection(db, 'swadishtt_orders'), bookingId), {
          ...orderRecord,
          createdAt: serverTimestamp(),
        });
      } catch (dbErr) {
        console.error('[swadishtt/catering] Firestore write error:', dbErr);
      }

      // Send confirmation email
      try {
        await sendSwadishttConfirmation({
          order: orderRecord,
          customerName: orderRecord.customerName,
          email: orderRecord.customerEmail,
        });
      } catch (mailErr) {
        console.warn('[swadishtt/catering] Email sending failed silently:', mailErr.message);
      }

      return NextResponse.json({
        success: true,
        bookingId,
        totalAmount: pkg.price,
        paidAmount: numAmount,
        remainingAmount,
        paymentMethod: 'WALLET',
        newWalletBalance: debitRes.balance,
        bookingStatus: 'CONFIRMED',
      });
    }

    return NextResponse.json({ error: `Unsupported action: ${action}` }, { status: 400 });
  } catch (error) {
    console.error('[swadishtt/catering] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
