import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken } from '@/app/api/_lib/auth';
import { isPositiveInteger } from '@/app/api/_lib/validators';
import {
  getCartCollection,
  getProductAvailabilityError,
  toCartItemResponse,
  PRODUCTS_COLLECTION,
} from '@/app/api/_lib/swadishttCart';

export const dynamic = 'force-dynamic';

// PATCH /api/swadishtt/cart/items/{itemId} — set the item's quantity
// (itemId is productId + customizations — see buildCartItemId in
// _lib/swadishttCart.js and items/route.js).
export async function PATCH(request, { params }) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const { itemId } = params;
    const body = await request.json();
    const quantity = body.quantity;

    if (!isPositiveInteger(quantity)) {
      return NextResponse.json({ error: 'quantity must be a positive integer' }, { status: 400 });
    }

    const itemRef = getCartCollection(uid).doc(itemId);

    const result = await adminDb.runTransaction(async (tx) => {
      const itemSnap = await tx.get(itemRef);
      if (!itemSnap.exists) {
        return { error: 'Cart item not found', status: 404 };
      }
      const data = itemSnap.data();

      const productSnap = await tx.get(adminDb.collection(PRODUCTS_COLLECTION).doc(data.productId));
      const product = productSnap.exists ? productSnap.data() : null;

      const availabilityError = getProductAvailabilityError(product);
      if (availabilityError) return availabilityError;

      const unitPrice = Number(product.price || 0);
      tx.update(itemRef, { quantity, unitPrice, updatedAt: FieldValue.serverTimestamp() });

      return {
        item: toCartItemResponse({ itemId, data: { ...data, quantity, unitPrice }, product }),
      };
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ message: 'Cart item updated', item: result.item }, { status: 200 });
  } catch (error) {
    console.error('Error updating Swadishtt cart item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/swadishtt/cart/items/{itemId} — remove a single item
export async function DELETE(request, { params }) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const { itemId } = params;
    const itemRef = getCartCollection(uid).doc(itemId);
    const itemSnap = await itemRef.get();

    if (!itemSnap.exists) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    await itemRef.delete();

    return NextResponse.json({ message: 'Item removed from cart' }, { status: 200 });
  } catch (error) {
    console.error('Error removing Swadishtt cart item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
