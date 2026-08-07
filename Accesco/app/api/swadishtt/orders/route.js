import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Server-authoritative catering packages catalog.
// Amounts are NEVER trusted from the frontend; prices are strictly derived server-side.
const CATERING_PACKAGES = {
  'cp-small': {
    name: 'Small Gathering',
    price: 2999,
  },
  'cp-birthday': {
    name: 'Birthday Celebration',
    price: 4999,
  },
  'cp-office': {
    name: 'Office Lunch Pack',
    price: 3499,
  },
  'cp-wedding': {
    name: 'Mini Wedding Pack',
    price: 9999,
  },
};

/**
 * POST /api/swadishtt/orders
 * Creates a new catering order in Firestore collection `swadishtt_orders`
 * and sends confirmation email via mailService.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      orderId,
      userId,
      customerName,
      customerEmail,
      phone,
      address,
      packageId,
      eventDate,
      eventTime,
      dietary,
      cuisine,
      notes,
      paymentMethod = 'ONLINE',

      status = 'CONFIRMED',
      paymentId,
      razorpayOrderId,
      deviceId,
      timestamp,
      advancePaid,

    } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    if (!packageId || !CATERING_PACKAGES[packageId]) {
      return NextResponse.json({ error: `Invalid packageId: ${packageId}` }, { status: 400 });
    }

    // Always calculate packageName and packagePrice server-side
    const pkg = CATERING_PACKAGES[packageId];
    const packageName = pkg.name;
    const packagePrice = pkg.price;
    const minimumAdvance = Math.ceil(packagePrice * 0.7);

    if (!advancePaid) {
      return NextResponse.json(
        { error: "Advance amount is required" },
        { status: 400 }
      );
    }

    if (advancePaid < minimumAdvance) {
      return NextResponse.json(
        {
          error: `Minimum advance payment is ₹${minimumAdvance}`,
        },
        { status: 400 }
      );
    }

    if (advancePaid > packagePrice) {
      return NextResponse.json(
        {
          error: "Advance payment cannot exceed package price",
        },
        { status: 400 }
      );
    }

    const remainingAmount = packagePrice - advancePaid;
    const { db } = await import('@/lib/firebase');
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');

    const orderPayload = {
      orderId,
      id: orderId,
      userId: userId || null,
      customerName: customerName || 'Customer',
      customerEmail: customerEmail || null,
      phone: phone || '',
      address: address || '',
      packageId,
      packageName,
      packagePrice,
      minimumAdvance,

      advancePaid,

      remainingAmount,

      paymentType:
        remainingAmount === 0
          ? "FULL"
          : "ADVANCE",
      eventDate: eventDate || '',
      eventTime: eventTime || '',
      dietary: dietary || 'Standard',
      cuisine: cuisine || 'Standard',
      notes: notes || '',
      paymentMethod: (paymentMethod || 'ONLINE').toUpperCase(),
      paymentStatus:
        remainingAmount === 0
          ? "PAID"
          : "PARTIALLY_PAID",
      status: (status || 'CONFIRMED').toUpperCase(),
      paymentId: paymentId || null,
      razorpayOrderId: razorpayOrderId || null,
      deviceId: deviceId || null,
      timestamp: timestamp || new Date().toISOString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),

    };

    // 1. Write order into `swadishtt_orders` collection
    try {
      await setDoc(doc(db, 'swadishtt_orders', orderId), orderPayload);
    } catch (dbErr) {
      console.error('[swadishtt/orders] Firestore write failed:', dbErr);
      return NextResponse.json({ error: 'Failed to record order in database' }, { status: 500 });
    }

    // 2. Trigger referral fulfillment if applicable
    if (phone) {
      try {
        const { markFirstOrderAndFulfillGifts } = await import('@/lib/referralFulfillment');
        markFirstOrderAndFulfillGifts({ phone, orderId, vertical: 'swadisht' }).catch((err) =>
          console.error('[swadishtt/orders] Referral fulfillment failed:', err),
        );
      } catch (refErr) {
        console.warn('[swadishtt/orders] Referral module import warning:', refErr);
      }
    }

    // 3. Send confirmation email using mailService
    if (customerEmail) {
      try {
        const { sendSwadishttConfirmation } = await import('@/lib/mailService');
        await sendSwadishttConfirmation({
          order: {
            id: orderId,
            package: packageName,
            price: advancePaid,
            delivery: { name: customerName, address, phone },
            totals: {

              total: packagePrice,

              advancePaid,

              remainingAmount

            },
            items: [
              {
                name: packageName,
                quantity: 1,
                price: packagePrice,
                restaurant: 'Swadishtt Catering',
              },
            ],
          },
          customerName: customerName || 'Valued Customer',
          email: customerEmail,
        });
      } catch (mailErr) {
        console.error('[swadishtt/orders] Email notification warning:', mailErr);
        // Order write remains intact even if mail service fails
      }
    }

    return NextResponse.json({

      success: true,

      orderId,

      packagePrice,

      minimumAdvance,

      advancePaid,

      remainingAmount,

      paymentStatus:
        remainingAmount === 0
          ? "PAID"
          : "PARTIALLY_PAID"

    });
  } catch (error) {
    console.error('[swadishtt/orders] Unexpected POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/swadishtt/orders
 * Fetches order(s) by id, userId, email, phone, or deviceId.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const deviceId = searchParams.get('deviceId');

    const { db } = await import('@/lib/firebase');
    const { collection, doc, getDoc, getDocs, query, orderBy, limit, where } = await import('firebase/firestore');

    // Fetch single order by ID
    if (orderId) {
      const docSnap = await getDoc(doc(db, 'swadishtt_orders', orderId));
      if (!docSnap.exists()) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }
      return NextResponse.json({ order: { id: docSnap.id, ...docSnap.data() } });
    }

    // Query by deviceId
    if (deviceId) {
      const q = query(
        collection(db, 'swadishtt_orders'),
        where('deviceId', '==', deviceId),
        limit(100)
      );
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach((d) => orders.push({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
      return NextResponse.json({ orders });
    }

    // Query by userId
    if (userId) {
      const q = query(
        collection(db, 'swadishtt_orders'),
        where('userId', '==', userId),
        limit(100)
      );
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach((d) => orders.push({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
      return NextResponse.json({ orders });
    }

    // Query by email
    if (email) {
      const q = query(
        collection(db, 'swadishtt_orders'),
        where('customerEmail', '==', email),
        limit(100)
      );
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach((d) => orders.push({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
      return NextResponse.json({ orders });
    }

    // Query by phone
    if (phone) {
      const q = query(
        collection(db, 'swadishtt_orders'),
        where('phone', '==', phone),
        limit(100)
      );
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach((d) => orders.push({ id: d.id, ...d.data() }));
      orders.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
      return NextResponse.json({ orders });
    }

    // Default admin listing (most recent 50)
    const q = query(collection(db, 'swadishtt_orders'), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    const orders = [];
    snapshot.forEach((d) => orders.push({ id: d.id, ...d.data() }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('[swadishtt/orders] GET error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * PATCH /api/swadishtt/orders
 * Updates status or paymentStatus for an order in `swadishtt_orders`.
 */
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { orderId, status, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required.' }, { status: 400 });
    }

    const { db } = await import('@/lib/firebase');
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');

    const updatePayload = {
      updatedAt: serverTimestamp(),
    };
    if (status) updatePayload.status = status.toUpperCase();
    if (paymentStatus) updatePayload.paymentStatus = paymentStatus.toUpperCase();

    const orderRef = doc(db, 'swadishtt_orders', orderId);
    await setDoc(orderRef, updatePayload, { merge: true });

    return NextResponse.json({ success: true, orderId, ...updatePayload }, { status: 200 });
  } catch (error) {
    console.error('[swadishtt/orders] PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
