import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken } from '@/app/api/_lib/auth';
import { isPositiveInteger } from '@/app/api/_lib/validators';
import {
  resolveProduct,
  getCartCollection,
  getProductAvailabilityError,
  getAvailableStock,
  toCartItemResponse,
} from '@/app/api/_lib/groklyCart';

export const dynamic = 'force-dynamic';

// POST /api/grokly/cart/items — add a product to the cart. Grokly has no
// size/color variants, so (unlike InstaStyle) the cart item doc is simply
// keyed by productId — one row per product, matching the shape the old
// localStorage cart ({ productId: quantity }) already used. If the product
// is already in the cart, its quantity is increased instead of inserting a
// second row.
export async function POST(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const body = await request.json();
    const productId = typeof body.productId === 'string' ? body.productId.trim() : '';
    const requestedQuantity = body.quantity === undefined ? 1 : body.quantity;

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

    const itemRef = getCartCollection(uid).doc(productId);

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

      const availableStock = getAvailableStock(product);
      if (availableStock !== null && newQuantity > availableStock) {
        return {
          status: 409,
          error:
            availableStock === 0
              ? 'This item is out of stock'
              : `Only ${availableStock} unit(s) left in stock`,
        };
      }

      const unitPrice = Number(product.price || 0);
      const itemData = {
        productId,
        name: product.name || '',
        brand: product.brand || '',
        image: product.image || '',
        unit: product.unit || '',
        quantity: newQuantity,
        unitPrice,
        mrp: Number(product.mrp) || unitPrice,
        updatedAt: FieldValue.serverTimestamp(),
        ...(itemSnap.exists ? {} : { addedAt: FieldValue.serverTimestamp() }),
      };

      tx.set(itemRef, itemData, { merge: true });

      return {
        item: toCartItemResponse({
          itemId: productId,
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
    console.error('Error adding item to Grokly cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
