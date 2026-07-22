import { NextResponse } from 'next/server';
import { saveOrderToFirestore, fetchOrdersFromFirestore, updateOrderStatusInFirestore } from '@/lib/orderService';
import { sendOrderLifecycleEmail } from '@/lib/orderLifecycle';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { order, customerEmail } = body;

    if (!order || (!order.id && !order.orderId)) {
      return NextResponse.json({ error: 'Order data is required.' }, { status: 400 });
    }

    const emailToUse = customerEmail || order.customerEmail || order.delivery?.email || order.address?.email;
    const customerName = order.customerName || order.delivery?.name || 'Valued Customer';

    // Persist to Firestore
    const saveResult = await saveOrderToFirestore('swadishtt', {
      ...order,
      customerEmail: emailToUse,
    });

    // Send order confirmation email
    if (emailToUse) {
      sendOrderLifecycleEmail('swadishtt', saveResult.order || order, customerName, emailToUse, 'CONFIRMED')
        .catch((err) => console.error('[swadishtt/orders] Email trigger failed:', err));
    }

    return NextResponse.json({ success: true, orderId: order.id || order.orderId }, { status: 200 });
  } catch (error) {
    console.error('[swadishtt/orders] POST error:', error);
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

    const result = await fetchOrdersFromFirestore('swadishtt', {
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
    console.error('[swadishtt/orders] GET error:', error);
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

    const updateResult = await updateOrderStatusInFirestore('swadishtt', orderId, newStatus);

    if (customerEmail) {
      sendOrderLifecycleEmail('swadishtt', orderData || { id: orderId }, customerName || 'Valued Customer', customerEmail, newStatus)
        .catch((err) => console.error('[swadishtt/orders] Status email trigger failed:', err));
    }

    return NextResponse.json({ success: true, status: newStatus, updateResult }, { status: 200 });
  } catch (error) {
    console.error('[swadishtt/orders] PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
