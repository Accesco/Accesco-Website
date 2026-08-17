/**
 * Read-only aggregator over the three independent brand carts
 * (Swadishtt, Grokly, InstaStyle). Each brand owns its own storage key
 * and item shape; this module normalizes them for the main site's
 * unified Cart Page without touching each brand's own cart logic.
 */
import { useCallback, useEffect, useState } from 'react';
import { getProductById } from '@/lib/groklyProducts';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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

export function getInstaStyleCart() {
  const parsed = readJSON(INSTASTYLE_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function setInstaStyleCart(items) {
  writeJSON(INSTASTYLE_KEY, items);
}

function getGroklyIdentifier(user) {
  return user?.uid || user?.email || getGroklyDeviceId();
}

export async function getGroklyCart(user) {
  const identifier = getGroklyIdentifier(user);
  if (!identifier) return {};
  try {
    const snap = await getDoc(doc(db, 'grokly_carts', identifier));
    if (!snap.exists()) return {};
    const cart = snap.data()?.cart;
    return cart && typeof cart === 'object' && !Array.isArray(cart) ? cart : {};
  } catch (err) {
    console.error('[unifiedCart] Failed to load Grokly cart from Firestore:', err);
    return {};
  }
}

export async function setGroklyCart(user, cartMap) {
  const identifier = getGroklyIdentifier(user);
  if (!identifier) return;
  try {
    await setDoc(doc(db, 'grokly_carts', identifier), { cart: cartMap, updatedAt: Date.now() });
  } catch (err) {
    console.error('[unifiedCart] Failed to save Grokly cart to Firestore:', err);
  }
}

const GROKLY_DEVICE_ID_KEY = 'grokly_device_id';

function getGroklyDeviceId() {
  if (typeof window === 'undefined') return null;
  let deviceId = localStorage.getItem(GROKLY_DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = `device_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
    localStorage.setItem(GROKLY_DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

// Swadishtt's cart has no localStorage mirror at all — Firestore is read on
// every access. `swadishtt_device_id` is not cart *data*, just an opaque
// per-browser key so guests (no Firebase auth) get a stable Firestore doc to
// read/write across reloads; there's no anonymous Firebase auth in this app
// to derive one from instead.
const SWADISHTT_DEVICE_ID_KEY = 'swadishtt_device_id';

function getSwadishttDeviceId() {
  if (typeof window === 'undefined') return null;
  let deviceId = localStorage.getItem(SWADISHTT_DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = `device_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
    localStorage.setItem(SWADISHTT_DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

function getSwadishttIdentifier(user) {
  return user?.uid || user?.email || getSwadishttDeviceId();
}

/** Reads the Swadishtt cart straight from Firestore (`swadishtt_carts/{identifier}`). */
export async function getSwadishttCart(user) {
  const identifier = getSwadishttIdentifier(user);
  if (!identifier) return [];
  try {
    const snap = await getDoc(doc(db, 'swadishtt_carts', identifier));
    if (!snap.exists()) return [];
    const cart = snap.data()?.cart;
    return Array.isArray(cart) ? cart : [];
  } catch (err) {
    console.error('[unifiedCart] Failed to load Swadishtt cart from Firestore:', err);
    return [];
  }
}

/** Writes the Swadishtt cart straight to Firestore (`swadishtt_carts/{identifier}`). */
export async function setSwadishttCart(user, items) {
  const identifier = getSwadishttIdentifier(user);
  if (!identifier) return;
  try {
    await setDoc(doc(db, 'swadishtt_carts', identifier), { cart: items, updatedAt: Date.now() });
  } catch (err) {
    console.error('[unifiedCart] Failed to save Swadishtt cart to Firestore:', err);
  }
}

/**
 * Clears all three brand carts after a successful unified checkout.
 * Called from a page that sits outside every brand's own cart context/provider,
 * so it has to reach into each brand's storage directly instead of calling
 * their `clearCart()`. Swadishtt (Firestore-only) and the Grokly Firestore
 * mirror / authenticated InstaStyle backend cart are all best-effort so a
 * slow/failed network call never blocks checkout from completing.
 */
export async function clearAllBrandCarts({ user, getIdToken } = {}) {
  setGroklyCart({});
  setInstaStyleCart([]);

  await setSwadishttCart(user, []);

  try {
    const identifier = user?.uid || user?.email || getGroklyDeviceId();
    if (identifier) {
      await setDoc(doc(db, 'grokly_carts', identifier), { cart: {}, updatedAt: Date.now() });
    }
  } catch (err) {
    console.error('[unifiedCart] Failed to clear Grokly Firestore cart:', err);
  }

  try {
    const token = typeof getIdToken === 'function' ? await getIdToken() : null;
    if (token && user?.uid) {
      await fetch('/api/instastyle/cart', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': user.uid,
        },
      });
    }
  } catch (err) {
    console.error('[unifiedCart] Failed to clear InstaStyle backend cart:', err);
  }
}

/** Total item count across all three brand carts — used for the header badge. */
export async function getUnifiedCartCount(user) {
  const swadishttCart = await getSwadishttCart(user);
  const swadishttCount = swadishttCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const groklyCart = await getGroklyCart(user);
  const groklyCount = Object.values(groklyCart).reduce((sum, qty) => sum + (qty || 0), 0);
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
export async function buildUnifiedStores(user) {
  const swadishttCart = await getSwadishttCart(user);
  const swadishttItems = swadishttCart.map((item, idx) => ({
    key: `swadishtt-${item.id}-${idx}`,
    id: item.id,
    name: item.name,
    variant: item.restaurant || 'Regular',
    price: item.price,
    image: item.image,
    quantity: item.quantity || 1,
  }));

  const groklyCartMap = await getGroklyCart(user);
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

/**
 * For a vertical's own cart drawer/page: everything the user has added in
 * the *other* two verticals, so their own cart isn't the only thing visible
 * before they head to the combined checkout. `excludeKey` is that vertical's
 * own store key ('grokly' | 'swadishtt' | 'instastyle') — dropped from the
 * result alongside any store with no items.
 *
 * `updateQuantity`/`removeItem` reuse the same per-brand read/write calls as
 * app/cart/page.jsx's own quantity control, so edits made here are visible
 * there (and vice versa) — there's only one underlying cart per brand.
 */
export function useOtherStoreItems(user, excludeKey) {
  const [stores, setStores] = useState([]);

  const refresh = useCallback(async () => {
    const built = await buildUnifiedStores(user);
    setStores(built);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateQuantity = useCallback(async (storeKey, item, nextQty) => {
    if (storeKey === 'swadishtt') {
      const cart = await getSwadishttCart(user);
      const next = nextQty <= 0
        ? cart.filter((c) => c.id !== item.id)
        : cart.map((c) => (c.id === item.id ? { ...c, quantity: nextQty } : c));
      await setSwadishttCart(user, next);
    } else if (storeKey === 'grokly') {
      const cart = getGroklyCart();
      const next = { ...cart };
      if (nextQty <= 0) delete next[item.id];
      else next[item.id] = nextQty;
      setGroklyCart(next);
    } else if (storeKey === 'instastyle') {
      const cart = getInstaStyleCart();
      const matches = (c) => c.id === item.id && c.selectedSize === item.selectedSize && c.selectedColor === item.selectedColor;
      const next = nextQty <= 0
        ? cart.filter((c) => !matches(c))
        : cart.map((c) => (matches(c) ? { ...c, quantity: nextQty } : c));
      setInstaStyleCart(next);
    }
    await refresh();
  }, [user, refresh]);

  const removeItem = useCallback(
    (storeKey, item) => updateQuantity(storeKey, item, 0),
    [updateQuantity],
  );

  const otherStores = stores.filter((s) => s.key !== excludeKey && s.items.length > 0);

  return { otherStores, updateQuantity, removeItem };
}
