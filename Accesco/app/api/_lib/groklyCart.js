// Shared helpers for the Grokly cart routes (app/api/grokly/cart/**).
// Mirrors _lib/instastyleCart.js's shape (product resolution, stock
// validation, response shaping kept out of the route handlers) adapted to
// Grokly's simpler product model: no size/color variants, flat numeric
// `stockQty` instead of a per-size inventory map, and products living in
// the shared `products` collection (scoped by `ventureId`) rather than a
// dedicated `instastyle_products`-style collection.
import { adminDb } from '@/lib/firebaseAdmin';

export const PRODUCTS_COLLECTION = 'products';
export const VENTURE_ID = 'grokly';

export function getCartCollection(uid) {
  return adminDb.collection('users').doc(uid).collection('grokly_cart');
}

// Grokly products are always keyed by their own sku (see
// app/api/products/route.js's POST, which writes doc(db, 'products', sku)),
// so resolving one is a direct doc lookup — no id-field fallback query
// needed the way InstaStyle's mixed static/Firestore catalog requires.
export async function resolveProduct(productId) {
  const ref = adminDb.collection(PRODUCTS_COLLECTION).doc(String(productId));
  const snap = await ref.get();
  if (!snap.exists) return null;

  const data = snap.data();
  // A cart shouldn't silently accept a product from a different venture
  // just because it happens to share the sku namespace.
  if (data.ventureId && data.ventureId !== VENTURE_ID) return null;

  return { ref, data };
}

// Product must exist and be in stock. Returns null when ok.
export function getProductAvailabilityError(product) {
  if (!product) return { status: 404, error: 'Product not found' };
  if (product.deletedAt || product.isDeleted) return { status: 404, error: 'Product not found' };
  if (product.inStock === false) return { status: 409, error: 'Product is out of stock' };
  return null;
}

// Flat numeric stock count, if the product tracks it. Null means
// untracked/unlimited — matches the convention already established in
// _lib/instastyleCart.js's getAvailableStock and _lib/inventory.js's
// planGroklyStockDecrements (same stockQty field, same "missing means
// untracked" rule) instead of introducing a second interpretation of it.
export function getAvailableStock(product) {
  if (!product || product.stockQty === undefined || product.stockQty === null) return null;
  const n = Number(product.stockQty);
  return Number.isFinite(n) ? n : null;
}

export function toCartItemResponse({ itemId, data, product }) {
  const unitPrice = Number(data.unitPrice) || 0;
  const quantity = Number(data.quantity) || 0;
  const availabilityError = getProductAvailabilityError(product);
  const availableStock = product ? getAvailableStock(product) : null;
  const isAvailable = !availabilityError && (availableStock === null || availableStock >= quantity);

  return {
    itemId,
    productId: data.productId,
    name: data.name,
    brand: data.brand,
    image: data.image,
    unit: data.unit,
    quantity,
    unitPrice,
    mrp: Number(data.mrp) || unitPrice,
    subtotal: Math.round(unitPrice * quantity * 100) / 100,
    isAvailable,
    availableStock,
  };
}

export function buildCartSummary(items) {
  const availableItems = items.filter((item) => item.isAvailable);
  const totalQuantity = availableItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Math.round(availableItems.reduce((sum, item) => sum + item.subtotal, 0) * 100) / 100;
  const savings = Math.round(
    availableItems.reduce((sum, item) => sum + Math.max(0, item.mrp - item.unitPrice) * item.quantity, 0) * 100
  ) / 100;

  return {
    totalItems: items.length,
    totalQuantity,
    subtotal,
    savings,
    totalAmount: subtotal,
  };
}
