import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuthToken } from '@/app/api/_lib/auth';
import { isPositiveInteger } from '@/app/api/_lib/validators';
import {
  getCartCollection,
  getProductAvailabilityError,
  getAvailableStock,
  toCartItemResponse,
  PRODUCTS_COLLECTION,
} from '@/app/api/_lib/groklyCart';

export const dynamic = 'force-dynamic';

// PATCH /api/grokly/cart/items/{itemId} — set the item's quantity (itemId
// is the productId — see items/route.js). Covers increase/decrease/update:
// the client computes the new absolute quantity and sends it here.
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

      const availableStock = getAvailableStock(product);
      if (availableStock !== null && quantity > availableStock) {
        return {
          status: 409,
          error:
            availableStock === 0
              ? 'This item is out of stock'
              : `Only ${availableStock} unit(s) left in stock`,
        };
      }

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
    console.error('Error updating Grokly cart item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/grokly/cart/items/{itemId} — remove a single item
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
    console.error('Error removing Grokly cart item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
