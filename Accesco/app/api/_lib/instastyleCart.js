// Shared helpers for the InstaStyle cart routes (app/api/instastyle/cart/**).
// Keeps product resolution, stock validation and response shaping in one
// place so the route handlers stay thin and consistent.
import { adminDb } from '@/lib/firebaseAdmin';

export const PRODUCTS_COLLECTION = 'instastyle_products';

export function getCartCollection(uid) {
  return adminDb.collection('users').doc(uid).collection('cart');
}

function normalizeKeyPart(value) {
  const cleaned = String(value ?? 'none')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return cleaned || 'none';
}

// Deterministic per-variant doc ID so "add to cart" is a single transactional
// read-modify-write on one document instead of a query-then-write — this is
// what actually prevents duplicate rows and race conditions on concurrent adds.
export function buildCartItemId(productId, size, color) {
  return `${normalizeKeyPart(productId)}__${normalizeKeyPart(size)}__${normalizeKeyPart(color)}`;
}

// Finds the instastyle_products doc for a given product identifier. Mirrors
// the lookup order already used by the product detail page: try the doc ID
// first, fall back to querying the `id` field.
export async function resolveProductRef(productId) {
  const directRef = adminDb.collection(PRODUCTS_COLLECTION).doc(productId);
  const directSnap = await directRef.get();
  if (directSnap.exists) return directRef;

  const query = await adminDb
    .collection(PRODUCTS_COLLECTION)
    .where('id', '==', productId)
    .limit(1)
    .get();

  return query.empty ? null : query.docs[0].ref;
}

// Product must exist, not be soft-deleted, and be in stock. Returns null when ok.
export function getProductAvailabilityError(product) {
  if (!product) return { status: 404, error: 'Product not found' };
  if (product.deletedAt || product.isDeleted) return { status: 404, error: 'Product not found' };
  if (product.inStock === false) return { status: 409, error: 'Product is out of stock' };
  return null;
}

// Validates a requested size against the product's size list, when it has one.
export function validateSizeSelection(product, size) {
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  if (sizes.length === 0) return null;
  if (!size) return { status: 400, error: 'size is required for this product' };

  const validSizes = sizes.map((s) => (typeof s === 'string' ? s : s?.name || s?.size));
  if (!validSizes.includes(size)) {
    return { status: 400, error: `Size "${size}" is not available for this product` };
  }
  return null;
}

// Validates a requested color against the product's color list, when it has one.
export function validateColorSelection(product, color) {
  const colors = Array.isArray(product.colors) ? product.colors : [];
  if (colors.length === 0) return null;
  if (!color) return { status: 400, error: 'color is required for this product' };

  const validColors = colors.map((c) => (typeof c === 'string' ? c : c?.name));
  if (!validColors.includes(color)) {
    return { status: 400, error: `Color "${color}" is not available for this product` };
  }
  return null;
}

// Per-size stock count, if the product tracks it. Null means untracked/unlimited.
export function getAvailableStock(product, size) {
  if (size && product?.inventory && Object.prototype.hasOwnProperty.call(product.inventory, size)) {
    const n = Number(product.inventory[size]);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function toCartItemResponse({ itemId, data, product }) {
  const unitPrice = Number(data.unitPrice) || 0;
  const quantity = Number(data.quantity) || 0;
  const availabilityError = getProductAvailabilityError(product);
  const availableStock = product ? getAvailableStock(product, data.size) : null;
  const isAvailable = !availabilityError && (availableStock === null || availableStock >= quantity);

  return {
    itemId,
    productId: data.productId,
    name: data.name,
    brand: data.brand,
    image: data.image,
    slug: data.slug,
    size: data.size,
    color: data.color,
    quantity,
    unitPrice,
    subtotal: Math.round(unitPrice * quantity * 100) / 100,
    isAvailable,
    availableStock,
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
