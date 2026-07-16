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

export async function POST(request) {
  try {
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

    // Send appropriate email
    let result;
    if (targetStatus === 'CONFIRMED') {
      result = await sendSwadishttConfirmation({
        order: { ...orderData, id: orderId },
        customerName,
        email: customerEmail,
      });

      // If this is the user's first order, bundle in any pending referral gifts
      const phone = orderData?.delivery?.phone;
      if (phone) {
        const { markFirstOrderAndFulfillGifts } = await import('@/lib/referralFulfillment');
        markFirstOrderAndFulfillGifts({ phone, orderId, vertical: 'swadisht' }).catch((err) =>
          console.error('[swadishtt/orders/update-status] Referral fulfillment failed:', err),
        );
      }
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
