/**
 * Centralized Order Service
 * Shared order persistence, retrieval, and status update logic for Grokly, Swadishtt, and InstaStyle.
 */

import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION_MAP = {
  grokly: 'grokly_orders',
  swadishtt: 'swadishtt_orders',
  instastyle: 'instastyle_orders',
};

/**
 * Gets the Firestore collection name for a venture.
 */
export function getCollectionName(venture = 'grokly') {
  const normalized = String(venture).toLowerCase();
  return COLLECTION_MAP[normalized] || `${normalized}_orders`;
}

/**
 * Normalizes an order object to ensure a unified schema across all ventures.
 */
export function normalizeOrderSchema(orderData, venture = 'grokly') {
  const now = new Date().toISOString();
  const orderId = orderData.id || orderData.orderId || `${venture.toUpperCase().slice(0, 3)}-${Date.now()}`;

  const subtotal = Number(orderData.subtotal || orderData.totals?.subtotal || 0);
  const deliveryFee = Number(orderData.deliveryFee || orderData.totals?.deliveryFee || 0);
  const platformFee = Number(orderData.platformFee || orderData.handlingFee || orderData.totals?.platformFee || 0);
  const gst = Number(orderData.gst || orderData.tax || orderData.totals?.gst || 0);
  const discount = Number(orderData.discount || orderData.speedDiscount || orderData.totals?.discount || 0);
  const total = Number(orderData.total || orderData.totals?.total || Math.max(0, subtotal + deliveryFee + platformFee + gst - discount));

  return {
    id: orderId,
    orderId: orderId,
    service: venture.toLowerCase(),
    venture: orderData.venture || venture,
    customerName: orderData.customerName || orderData.address?.fullName || orderData.delivery?.name || 'Valued Customer',
    customerEmail: orderData.customerEmail || orderData.email || orderData.address?.email || null,
    phone: orderData.phone || orderData.delivery?.phone || orderData.address?.phone || '',
    userId: orderData.userId || null,
    deviceId: orderData.deviceId || null,
    deliveryAddress: orderData.deliveryAddress || orderData.address || orderData.delivery || {},
    landmark: orderData.landmark || orderData.address?.landmark || orderData.delivery?.landmark || '',
    city: orderData.city || orderData.address?.city || orderData.delivery?.city || '',
    state: orderData.state || orderData.address?.state || orderData.delivery?.state || '',
    pincode: orderData.pincode || orderData.address?.pincode || orderData.delivery?.pincode || '',
    items: Array.isArray(orderData.items) ? orderData.items : [],
    subtotal,
    deliveryFee,
    platformFee,
    gst,
    discount,
    total,
    totals: {
      subtotal,
      deliveryFee,
      platformFee,
      gst,
      discount,
      total,
    },
    coupon: orderData.coupon || null,
    paymentMethod: orderData.paymentMethod || 'razorpay',
    paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === 'cod' ? 'PENDING' : 'SUCCESS'),
    razorpayOrderId: orderData.razorpayOrderId || null,
    razorpayPaymentId: orderData.razorpayPaymentId || null,
    razorpaySignature: orderData.razorpaySignature || null,
    status: orderData.status || 'CONFIRMED',
    statusHistory: orderData.statusHistory || [
      { status: orderData.status || 'CONFIRMED', timestamp: now },
    ],
    deliveryPartner: orderData.deliveryPartner || {
      name: 'Ravi Kumar',
      phone: '+91 9876543210',
      distanceKm: 1.8,
      etaMinutes: orderData.eta || 15,
      statusText: 'Rider is assigned and heading to pickup location',
    },
    tracking: orderData.tracking || {
      lat: orderData.deliveryLat || null,
      lng: orderData.deliveryLng || null,
      eta: orderData.eta || 15,
    },
    estimatedDelivery: orderData.estimatedDelivery || orderData.eta || 15,
    timestamp: orderData.timestamp || orderData.placedAt || now,
    placedAt: orderData.placedAt || orderData.timestamp || now,
    updatedAt: now,
  };
}

/**
 * Persists an order to Firestore safely.
 */
export async function saveOrderToFirestore(venture, rawOrderData) {
  const collectionName = getCollectionName(venture);
  const normalized = normalizeOrderSchema(rawOrderData, venture);

  try {
    const docRef = doc(collection(db, collectionName), normalized.id);
    await setDoc(
      docRef,
      {
        ...normalized,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true, order: normalized };
  } catch (error) {
    console.error(`[OrderService] Firestore write failed for ${collectionName}:`, error);
    // Return order object even on DB fallback so local workflow continues
    return { success: false, order: normalized, error: error.message };
  }
}

/**
 * Fetches orders from Firestore by id, deviceId, userId, or customerEmail.
 */
export async function fetchOrdersFromFirestore(venture, { id, deviceId, userId, email, limitCount = 50 }) {
  const collectionName = getCollectionName(venture);
  const colRef = collection(db, collectionName);

  try {
    if (id) {
      const docSnap = await getDoc(doc(colRef, id));
      if (!docSnap.exists()) return { order: null };
      return { order: { id: docSnap.id, ...docSnap.data() } };
    }

    let q;
    if (deviceId) {
      q = query(colRef, where('deviceId', '==', deviceId), limit(limitCount));
    } else if (userId) {
      q = query(colRef, where('userId', '==', userId), limit(limitCount));
    } else if (email) {
      q = query(colRef, where('customerEmail', '==', email), limit(limitCount));
    } else {
      q = query(colRef, orderBy('createdAt', 'desc'), limit(limitCount));
    }

    const snapshot = await getDocs(q);
    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    // Client-side sort by timestamp descending
    orders.sort((a, b) => new Date(b.timestamp || b.createdAt || 0) - new Date(a.timestamp || a.createdAt || 0));

    return { orders };
  } catch (error) {
    console.error(`[OrderService] Firestore fetch error for ${collectionName}:`, error);
    return { orders: [], error: error.message };
  }
}

/**
 * Updates an existing order's status in Firestore.
 */
export async function updateOrderStatusInFirestore(venture, orderId, newStatus, extraData = {}) {
  const collectionName = getCollectionName(venture);
  const now = new Date().toISOString();

  try {
    const docRef = doc(db, collectionName, orderId);
    const docSnap = await getDoc(docRef);

    let history = [];
    if (docSnap.exists()) {
      history = docSnap.data().statusHistory || [];
    }
    history.push({ status: newStatus, timestamp: now });

    await updateDoc(docRef, {
      status: newStatus,
      statusHistory: history,
      updatedAt: serverTimestamp(),
      ...extraData,
    });

    return { success: true, status: newStatus };
  } catch (error) {
    console.error(`[OrderService] Status update failed for ${orderId}:`, error);
    return { success: false, error: error.message };
  }
}
