import { NextResponse } from 'next/server';
import { sendInstaStyleStatusUpdate } from '@/lib/mailService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, newStatus, customerEmail, customerName, orderData } = body;

    if (!orderId || !customerEmail) {
      return NextResponse.json({ error: 'orderId and customerEmail are required' }, { status: 400 });
    }

    const targetStatus = newStatus?.toUpperCase() || 'PROCESSING';

    // Persist status change in Firestore
    try {
      const { db } = await import('@/lib/firebase');
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'instastyle_orders', orderId), {
        status: targetStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (dbErr) {
      console.warn('[instastyle/orders/update-status] Firestore write skipped/failed:', dbErr.message);
    }

    const result = await sendInstaStyleStatusUpdate({
      order: { ...orderData, id: orderId },
      customerName,
      email: customerEmail,
      newStatus: targetStatus,
    });

    return NextResponse.json({
      success: true,
      updatedStatus: targetStatus,
      emailResult: result,
    });
  } catch (err) {
    console.error('[api/instastyle/orders/update-status]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
