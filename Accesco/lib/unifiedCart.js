/**
 * Read-only aggregator over the three independent brand carts
 * (Swadishtt, Grokly, InstaStyle). Each brand owns its own storage key
 * and item shape; this module normalizes them for the main site's
 * unified Cart Page without touching each brand's own cart logic.
 */
import { getProductById } from '@/lib/groklyProducts';

const SWADISHTT_KEY = 'swadishtt-cart';
const GROKLY_KEY = 'grokly_cart';
const INSTASTYLE_KEY = 'instastyle_cart';

function readJSON(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getSwadishttCart() {
  const parsed = readJSON(SWADISHTT_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function getGroklyCart() {
  const parsed = readJSON(GROKLY_KEY, {});
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
}

export function getInstaStyleCart() {
  const parsed = readJSON(INSTASTYLE_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function setSwadishttCart(items) {
  writeJSON(SWADISHTT_KEY, items);
}

export function setGroklyCart(cartMap) {
  writeJSON(GROKLY_KEY, cartMap);
}

export function setInstaStyleCart(items) {
  writeJSON(INSTASTYLE_KEY, items);
}

/** Total item count across all three brand carts — used for the header badge. */
export function getUnifiedCartCount() {
  const swadishttCount = getSwadishttCart().reduce((sum, item) => sum + (item.quantity || 1), 0);
  const groklyCount = Object.values(getGroklyCart()).reduce((sum, qty) => sum + (qty || 0), 0);
  const instastyleCount = getInstaStyleCart().reduce((sum, item) => sum + (item.quantity || 1), 0);
  return swadishttCount + groklyCount + instastyleCount;
}

function withTotals(store) {
  const subtotal = store.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = store.items.reduce(
    (sum, item) => sum + Math.max(0, (item.mrp || item.price) - item.price) * item.quantity,
    0
  );
  const itemCount = store.items.reduce((sum, item) => sum + item.quantity, 0);
  return { ...store, subtotal, savings, itemCount };
}

/** Builds the normalized { key, name, theme, items[], subtotal, savings, itemCount }[] for the Cart Page. */
export function buildUnifiedStores() {
  const swadishttItems = getSwadishttCart().map((item, idx) => ({
    key: `swadishtt-${item.id}-${idx}`,
    id: item.id,
    name: item.name,
    variant: item.restaurant || 'Regular',
    price: item.price,
    image: item.image,
    quantity: item.quantity || 1,
  }));

  const groklyCartMap = getGroklyCart();
  const groklyItems = Object.entries(groklyCartMap)
    .map(([productId, qty]) => {
      const product = getProductById(productId);
      if (!product || !qty) return null;
      return {
        key: `grokly-${productId}`,
        id: productId,
        name: product.name,
        variant: product.unit || product.brand || '',
        price: product.price,
        mrp: product.mrp,
        image: product.image,
        quantity: qty,
      };
    })
    .filter(Boolean);

  const instastyleItems = getInstaStyleCart().map((item, idx) => ({
    key: `instastyle-${item.id}-${item.selectedSize || ''}-${item.selectedColor || ''}-${idx}`,
    id: item.id,
    name: item.name,
    variant: item.selectedSize ? `Size: ${item.selectedSize}` : (item.brand || ''),
    price: item.discountedPrice || item.price,
    mrp: item.price,
    image: item.image,
    quantity: item.quantity || 1,
    selectedSize: item.selectedSize,
    selectedColor: item.selectedColor,
  }));

  return [
    { key: 'swadishtt', name: 'Swadishtt', theme: 'swadishtt', items: swadishttItems },
    { key: 'grokly', name: 'Grokly', theme: 'grokly', items: groklyItems },
    { key: 'instastyle', name: 'Insta Style', theme: 'instastyle', items: instastyleItems },
  ].map(withTotals);
}
