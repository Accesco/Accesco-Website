import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken } from '@/app/api/_lib/auth';
import { isPositiveInteger } from '@/app/api/_lib/validators';
import {
  resolveProduct,
  getCartCollection,
  getProductAvailabilityError,
  toCartItemResponse,
  buildCartItemId,
} from '@/app/api/_lib/swadishttCart';

export const dynamic = 'force-dynamic';

// POST /api/swadishtt/cart/items — add a dish to the cart. The cart item
// doc is keyed by productId + customizations (see buildCartItemId in
// swadishttCart.js): the same dish with the same customizations (including
// the common case of none) increments quantity on the existing row; the
// same dish with *different* customizations gets its own separate row.
export async function POST(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const body = await request.json();
    const productId = typeof body.productId === 'string' ? body.productId.trim() : '';
    const requestedQuantity = body.quantity === undefined ? 1 : body.quantity;
    const customizations = body.customizations && typeof body.customizations === 'object' && !Array.isArray(body.customizations)
      ? body.customizations
      : {};

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }
    if (!isPositiveInteger(requestedQuantity)) {
      return NextResponse.json({ error: 'quantity must be a positive integer' }, { status: 400 });
    }

    const resolved = await resolveProduct(productId);
    if (!resolved) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const itemId = buildCartItemId(productId, customizations);
    const itemRef = getCartCollection(uid).doc(itemId);

    const result = await adminDb.runTransaction(async (tx) => {
      const [productSnap, itemSnap] = await Promise.all([tx.get(resolved.ref), tx.get(itemRef)]);

      if (!productSnap.exists) {
        return { error: 'Product not found', status: 404 };
      }
      const product = productSnap.data();

      const availabilityError = getProductAvailabilityError(product);
      if (availabilityError) return availabilityError;

      const existingQuantity = itemSnap.exists ? Number(itemSnap.data().quantity) || 0 : 0;
      const newQuantity = existingQuantity + requestedQuantity;
      const unitPrice = Number(product.price || 0);

      const itemData = {
        productId,
        customizations,
        name: product.name || '',
        image: product.image || '',
        restaurantId: product.restaurantId || '',
        restaurantName: product.restaurantName || '',
        quantity: newQuantity,
        unitPrice,
        updatedAt: FieldValue.serverTimestamp(),
        ...(itemSnap.exists ? {} : { addedAt: FieldValue.serverTimestamp() }),
      };

      tx.set(itemRef, itemData, { merge: true });

      return {
        item: toCartItemResponse({
          itemId,
          data: { ...itemData, quantity: newQuantity },
          product,
        }),
      };
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ message: 'Item added to cart', item: result.item }, { status: 201 });
  } catch (error) {
    console.error('Error adding item to Swadishtt cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
