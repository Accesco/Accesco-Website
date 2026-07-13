/**
 * POST /api/instastyle/orders/confirm
 * Body: { orderId, customerEmail, customerName, orderData }
 * Sends InstaStyle order confirmation email.
 */

import { NextResponse } from 'next/server';
import { sendInstaStyleConfirmation } from '@/lib/mailService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, customerEmail, customerName, orderData } = body;

    if (!orderId || !customerEmail) {
      return NextResponse.json({ error: 'orderId and customerEmail are required' }, { status: 400 });
    }

    const result = await sendInstaStyleConfirmation({
      order: { ...orderData, id: orderId },
      customerName,
      email: customerEmail,
    });

    return NextResponse.json({ success: true, emailResult: result });
  } catch (err) {
    console.error('[api/instastyle/orders/confirm]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
