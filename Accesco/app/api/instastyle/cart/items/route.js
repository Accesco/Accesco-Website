import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken } from '@/app/api/_lib/auth';
import { isPositiveInteger } from '@/app/api/_lib/validators';
import {
  resolveProductRef,
  getCartCollection,
  buildCartItemId,
  getProductAvailabilityError,
  validateSizeSelection,
  validateColorSelection,
  getAvailableStock,
  toCartItemResponse,
} from '@/app/api/_lib/instastyleCart';

export const dynamic = 'force-dynamic';

// POST /api/instastyle/cart/items — add a product to the cart.
// If the same product+size+color already exists, its quantity is increased
// instead of inserting another row.
export async function POST(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const body = await request.json();
    const productId = typeof body.productId === 'string' ? body.productId.trim() : '';
    const size = typeof body.size === 'string' && body.size.trim() ? body.size.trim() : null;
    const color = typeof body.color === 'string' && body.color.trim() ? body.color.trim() : null;
    const requestedQuantity = body.quantity === undefined ? 1 : body.quantity;

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }
    if (!isPositiveInteger(requestedQuantity)) {
      return NextResponse.json({ error: 'quantity must be a positive integer' }, { status: 400 });
    }

    const productRef = await resolveProductRef(productId);
    if (!productRef) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Deterministic doc ID keyed on product+size+color: the transaction below
    // is a single read-modify-write on this one document, which is what
    // actually prevents duplicate rows and race conditions on concurrent adds.
    const itemId = buildCartItemId(productId, size, color);
    const itemRef = getCartCollection(uid).doc(itemId);

    const result = await adminDb.runTransaction(async (tx) => {
      const [productSnap, itemSnap] = await Promise.all([tx.get(productRef), tx.get(itemRef)]);

      if (!productSnap.exists) {
        return { error: 'Product not found', status: 404 };
      }
      const product = productSnap.data();

      const availabilityError = getProductAvailabilityError(product);
      if (availabilityError) return availabilityError;

      const sizeError = validateSizeSelection(product, size);
      if (sizeError) return sizeError;

      const colorError = validateColorSelection(product, color);
      if (colorError) return colorError;

      const existingQuantity = itemSnap.exists ? Number(itemSnap.data().quantity) || 0 : 0;
      const newQuantity = existingQuantity + requestedQuantity;

      const availableStock = getAvailableStock(product, size);
      if (availableStock !== null && newQuantity > availableStock) {
        return {
          status: 409,
          error:
            availableStock === 0
              ? 'This item is out of stock'
              : `Only ${availableStock} unit(s) left in stock`,
        };
      }

      const unitPrice = Number(product.discountedPrice || product.price || 0);
      const itemData = {
        productId,
        productDocId: productRef.id,
        name: product.name || '',
        brand: product.brand || '',
        image: product.images?.[0]?.url || '',
        slug: product.slug || '',
        size,
        color,
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
    console.error('Error adding item to cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
