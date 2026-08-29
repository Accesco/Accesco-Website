// Shared helpers for the Swadishtt cart routes (app/api/swadishtt/cart/**).
// Mirrors _lib/groklyCart.js's shape but resolves against the new
// swadishtt_products catalog (see app/api/swadishtt/products/route.js)
// instead of the shared `products` collection, and uses no numeric
// stock-quantity concept — Swadishtt menu items only ever tracked a
// boolean `inStock`/`isActive` in the source static data, so that's the
// only availability signal there is to enforce.
//
// Unlike Grokly, cart items here are keyed by productId *plus*
// customizations (SwadishttContext.jsx's cart supports arbitrary per-item
// customizations — e.g. spice level, add-ons — and two lines for the same
// dish with different customizations must stay separate rows; the same
// dish with the same customizations should merge/increment). No caller in
// this codebase actually populates customizations today (every real
// addToCart call uses the default {}), but the identity model supports it
// regardless, matching the existing frontend's own equality check
// (JSON.stringify(customizations) comparison) rather than a narrower
// backend contract that would only work for the common case.
import { adminDb } from '@/lib/firebaseAdmin';

export const PRODUCTS_COLLECTION = 'swadishtt_products';

export function getCartCollection(uid) {
  return adminDb.collection('users').doc(uid).collection('swadishtt_cart');
}

function normalizeKeyPart(value) {
  const cleaned = String(value ?? 'none')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return cleaned || 'none';
}

// Deterministic serialization of a customizations object: same keys/values
// (any order) always produce the same key, so "same product + same
// customizations" reliably merges into the same cart row/idempotency key,
// while any differing key or value produces a different one.
function customizationsKey(customizations) {
  if (!customizations || typeof customizations !== 'object' || Array.isArray(customizations)) {
    return 'default';
  }
  const keys = Object.keys(customizations).sort();
  if (keys.length === 0) return 'default';
  return keys.map((k) => `${normalizeKeyPart(k)}-${normalizeKeyPart(customizations[k])}`).join('_');
}

// Deterministic per-(product, customizations) doc ID, mirroring
// _lib/instastyleCart.js's buildCartItemId — this is what makes "add to
// cart" a single transactional read-modify-write instead of a query-then-
// write, and what makes a retried add idempotent.
export function buildCartItemId(productId, customizations) {
  return `${normalizeKeyPart(productId)}__${customizationsKey(customizations)}`;
}

export async function resolveProduct(productId) {
  const ref = adminDb.collection(PRODUCTS_COLLECTION).doc(String(productId));
  const snap = await ref.get();
  if (!snap.exists) return null;
  return { ref, data: snap.data() };
}

// Product must exist, not be deactivated, and be in stock. Returns null when ok.
export function getProductAvailabilityError(product) {
  if (!product) return { status: 404, error: 'Product not found' };
  if (product.isActive === false) return { status: 404, error: 'Product not found' };
  if (product.inStock === false) return { status: 409, error: 'Product is out of stock' };
  return null;
}

export function toCartItemResponse({ itemId, data, product }) {
  const unitPrice = Number(data.unitPrice) || 0;
  const quantity = Number(data.quantity) || 0;
  const availabilityError = getProductAvailabilityError(product);

  return {
    itemId,
    productId: data.productId,
    name: data.name,
    image: data.image,
    restaurantId: data.restaurantId,
    restaurantName: data.restaurantName,
    customizations: data.customizations || {},
    quantity,
    unitPrice,
    subtotal: Math.round(unitPrice * quantity * 100) / 100,
    isAvailable: !availabilityError,
  };
}

export function buildCartSummary(items) {
  const availableItems = items.filter((item) => item.isAvailable);
  const totalQuantity = availableItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Math.round(availableItems.reduce((sum, item) => sum + item.subtotal, 0) * 100) / 100;

  return {
    totalItems: items.length,
    totalQuantity,
    subtotal,
    totalAmount: subtotal,
  };
}
