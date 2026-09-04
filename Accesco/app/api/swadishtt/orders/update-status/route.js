/**
 * POST /api/swadishtt/orders/update-status
 * Body: { orderId, newStatus, customerEmail, customerName, orderData }
 * Advances the order pipeline and sends a status update email.
 */

import { NextResponse } from 'next/server';
import {
  ORDER_STATUSES,
  advanceOrderStatus,
  sendSwadishttStatusUpdate,
  sendSwadishttConfirmation,
} from '@/lib/mailService';
import { verifyAuthToken } from '../../../_lib/auth';

// Requires an authenticated caller (not admin): this route performs no
// Firestore mutation (it only sends a status-update/confirmation email) and
// is called directly by the checkout flow right after a Swadishtt order is
// placed, so it can't be admin-gated without breaking that flow.
export async function POST(request) {
  try {
    const { error: authError } = await verifyAuthToken(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, newStatus, customerEmail, customerName, orderData, advance } = body;

    if (!orderId || !customerEmail) {
      return NextResponse.json({ error: 'orderId and customerEmail are required' }, { status: 400 });
    }

    // Determine target status
    const targetStatus = advance
      ? advanceOrderStatus(orderData?.status || 'PENDING')
      : newStatus?.toUpperCase();

    if (!ORDER_STATUSES[targetStatus]) {
      return NextResponse.json({ error: `Invalid status: ${targetStatus}` }, { status: 400 });
    }
    // Razorpay orders may be confirmed only after server-side payment
    // verification has marked them SUCCESS. COD orders are intentionally
    // allowed with a PENDING payment status because payment is collected later.
    const paymentMethod = String(orderData?.paymentMethod || '').toLowerCase();
    const isCod = paymentMethod === 'cod';
    const isPaid = orderData?.paymentStatus === 'SUCCESS';

    if (targetStatus === 'CONFIRMED' && !isPaid && !isCod) {
      return NextResponse.json(
        { error: 'Cannot send confirmation for an unverified or unpaid order.' },
        { status: 400 }
      );
    }

    // Send appropriate email
    let result;
    if (targetStatus === 'CONFIRMED') {
      result = await sendSwadishttConfirmation({
        order: { ...orderData, id: orderId },
        customerName,
        email: customerEmail,
      });
    } else {
      result = await sendSwadishttStatusUpdate({
        order: { ...orderData, id: orderId },
        customerName,
        email: customerEmail,
        newStatus: targetStatus,
      });
    }

    return NextResponse.json({
      success: true,
      updatedStatus: targetStatus,
      emailResult: result,
    });
  } catch (err) {
    console.error('[api/swadishtt/orders/update-status]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
