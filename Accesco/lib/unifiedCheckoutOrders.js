/**
 * Per-brand order placement for combined multi-service checkout. Each
 * function persists one brand's slice of a unified order using that brand's
 * own existing order-storage mechanism, so its "My Orders"/tracking pages
 * keep working unmodified regardless of which vertical's checkout page
 * initiated the payment. Shared by the universal checkout (app/cart/checkout)
 * and each vertical's own checkout page, which call the placer for any
 * *other* store that has items alongside their own vertical's normal
 * (context-based) order placement.
 */

export const STORE_NAMES = {
  swadishtt: 'Swadishtt',
  grokly: 'Grokly',
  instastyle: 'Insta Style',
};

export async function placeGroklyOrder({ items, subtotal, address, unifiedOrderId, payment, paymentMethod, user }) {
  const orderId = `GRK-${Date.now()}`;
  const order = {
    id: orderId,
    status: 'PLACED',
    timestamp: new Date().toISOString(),
    venture: 'Grokly',
    unifiedOrderId,
    userId: user?.uid || null,
    customerEmail: address.email,
    customerName: address.name,
    deviceId: typeof window !== 'undefined' ? localStorage.getItem('grokly_device_id') : null,
    items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
    subtotal,
    deliveryFee: 0,
    discount: 0,
    total: subtotal,
    totals: { subtotal, deliveryFee: 0, discount: 0, total: subtotal },
    ...(paymentMethod === 'cod'
      ? { paymentMethod: 'cod' }
      : { paymentMethod: 'razorpay', razorpayOrderId: payment.orderId, razorpayPaymentId: payment.paymentId }),
    address: address.address,
    phone: address.phone,
  };

  try {
    await fetch('/api/grokly/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order, customerEmail: address.email }),
    });
  } catch (err) {
    console.error('[unified checkout] Grokly order sync failed:', err);
  }

  return {
    key: 'grokly',
    name: STORE_NAMES.grokly,
    theme: 'grokly',
    id: orderId,
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
    subtotal,
    trackingPath: `/services/grokly/order-tracking?id=${orderId}`,
  };
}

export async function placeInstaStyleOrder({ items, subtotal, address, unifiedOrderId, payment, paymentMethod, user }) {
  const orderId = `INS-${Date.now()}`;
  const order = {
    id: orderId,
    status: 'PLACED',
    timestamp: new Date().toISOString(),
    venture: 'InstaStyle',
    unifiedOrderId,
    userId: user?.uid || null,
    customerEmail: address.email,
    customerName: address.name,
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
      selectedSize: i.selectedSize,
      selectedColor: i.selectedColor,
    })),
    totals: { subtotal, deliveryFee: 0, shippingFee: 0, gst: 0, discount: 0, total: subtotal },
    address: {
      addressLine1: address.address,
      city: address.city,
      pincode: address.pincode,
    },
    phone: address.phone,
    ...(paymentMethod === 'cod'
      ? { paymentMethod: 'cod' }
      : { paymentMethod: 'razorpay', razorpayOrderId: payment.orderId, razorpayPaymentId: payment.paymentId }),
  };

  try {
    await fetch('/api/instastyle/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order, customerEmail: address.email }),
    });
  } catch (err) {
    console.error('[unified checkout] InstaStyle order sync failed:', err);
  }

  return {
    key: 'instastyle',
    name: STORE_NAMES.instastyle,
    theme: 'instastyle',
    id: orderId,
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
    subtotal,
    trackingPath: `/services/instastyle/order-tracking?id=${orderId}`,
  };
}

export async function placeSwadishttOrder({ items, subtotal, address, unifiedOrderId, payment, paymentMethod, user }) {
  const orderId = `SW${Date.now().toString(36).toUpperCase()}`;
  const order = {
    id: orderId,
    status: 'CONFIRMED',
    placedAt: new Date().toISOString(),
    unifiedOrderId,
    userId: user?.uid || null,
    customerEmail: address.email,
    customerName: address.name,
    ...(paymentMethod === 'cod'
      ? { paymentMethod: 'cod' }
      : { paymentMethod: 'razorpay', razorpayOrderId: payment.orderId, razorpayPaymentId: payment.paymentId }),
    delivery: {
      name: address.name,
      phone: address.phone,
      email: address.email,
      address: address.address,
      city: address.city,
      pincode: address.pincode,
    },
    deliveryPartner: {
      name: 'Ravi Kumar',
      distanceKm: 1.8,
      etaMinutes: 10,
      statusText: 'Delivery partner is heading to the restaurant',
    },
    totals: { subtotal, deliveryFee: 0, platformFee: 0, gst: 0, total: subtotal },
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
      restaurant: i.variant || 'Regular',
      sku: `SWD-GEN-${String(i.id).replace(/[^0-9]/g, '') || '00'}`,
    })),
  };

  try {
    const raw = localStorage.getItem('swadishtt-orders');
    const existing = raw ? JSON.parse(raw) : [];
    localStorage.setItem('swadishtt-orders', JSON.stringify([order, ...(Array.isArray(existing) ? existing : [])]));
  } catch (err) {
    console.error('[unified checkout] Failed to save Swadishtt order locally:', err);
  }

  try {
    await fetch('/api/swadishtt/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order, customerEmail: address.email }),
    });
  } catch (err) {
    console.error('[unified checkout] Swadishtt Firestore sync failed:', err);
  }

  try {
    await fetch('/api/swadishtt/orders/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        newStatus: 'CONFIRMED',
        customerEmail: address.email,
        customerName: address.name,
        orderData: order,
      }),
    });
  } catch (err) {
    console.error('[unified checkout] Swadishtt confirmation email failed:', err);
  }

  return {
    key: 'swadishtt',
    name: STORE_NAMES.swadishtt,
    theme: 'swadishtt',
    id: orderId,
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
    subtotal,
    trackingPath: `/services/swadisht/order-tracking?id=${orderId}`,
  };
}

export const STORE_PLACERS = {
  grokly: placeGroklyOrder,
  instastyle: placeInstaStyleOrder,
  swadishtt: placeSwadishttOrder,
};

// Records the cross-store summary at /api/orders once every brand-specific
// order above has been placed, so a single unifiedOrderId can look up
// "what did this payment cover" across all of them. Best-effort: never blocks
// checkout from completing since each brand's own order already succeeded.
export async function postUnifiedOrderRecord({ unifiedOrderId, user, address, paymentMethod, payment, subtotal, platformFee, grandTotal, itemCount, results }) {
  try {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order: {
          id: unifiedOrderId,
          status: 'PLACED',
          placedAt: new Date().toISOString(),
          userId: user?.uid || null,
          customerEmail: address.email,
          customerName: address.name,
          address,
          ...(paymentMethod === 'cod'
            ? { paymentMethod: 'cod' }
            : { paymentMethod: 'razorpay', razorpayOrderId: payment.orderId, razorpayPaymentId: payment.paymentId }),
          subtotal,
          platformFee,
          grandTotal,
          itemCount,
          stores: results.map((r) => ({
            key: r.key,
            name: r.name,
            orderId: r.id,
            itemCount: r.itemCount,
            subtotal: r.subtotal,
            trackingPath: r.trackingPath,
          })),
        },
      }),
    });
  } catch (err) {
    console.error('[unified checkout] Unified order record failed:', err);
  }
}
