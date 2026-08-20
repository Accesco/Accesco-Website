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

export function getGroklyCart() {
  const parsed = readJSON(GROKLY_KEY, {});
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
}

export function setGroklyCart(cartMap) {
  writeJSON(GROKLY_KEY, cartMap);
}

// Backend-aware Grokly cart helpers — kept separate from getGroklyCart/
// setGroklyCart above (which stay synchronous, localStorage-only, and are
// used elsewhere — e.g. getUnifiedCartCount's header-badge count — where
// an extra network round trip isn't warranted) rather than changing those
// functions' signatures, since some existing callers use them
// synchronously and a signature change would ripple out to every one of
// them. These are used by the unified /cart page specifically, where
// showing the real backend-authoritative cart for a logged-in user matters.
export async function getGroklyCartFromBackend(user, getIdToken) {
  if (!user?.uid || typeof getIdToken !== 'function') return null;
  try {
    const token = await getIdToken();
    if (!token) return null;
    const res = await fetch('/api/grokly/cart', {
      headers: { Authorization: `Bearer ${token}`, 'x-user-id': user.uid },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const map = {};
    (data.items || []).forEach((item) => { map[item.productId] = item.quantity; });
    return map;
  } catch (err) {
    console.error('[unifiedCart] Failed to load Grokly cart from backend:', err);
    return null;
  }
}

// Writes cartMap to localStorage (as setGroklyCart always has) and, for
// authenticated callers, also diffs it against the backend's current cart
// and applies only the changed keys — safe because Grokly cart identity is
// just the productId (no customizations complexity), so the diff key
// matches the backend's own doc-id scheme exactly with no client-side
// re-derivation risk.
export async function setGroklyCartAndSync(cartMap, user, getIdToken) {
  writeJSON(GROKLY_KEY, cartMap);

  if (!user?.uid || typeof getIdToken !== 'function') return;

  try {
    const token = await getIdToken();
    if (!token) return;
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'x-user-id': user.uid };

    const res = await fetch('/api/grokly/cart', { headers });
    const backendItems = res.ok ? (await res.json()).items || [] : [];
    const backendMap = {};
    backendItems.forEach((item) => { backendMap[item.productId] = item.quantity; });

    const allIds = new Set([...Object.keys(backendMap), ...Object.keys(cartMap)]);
    for (const id of allIds) {
      const newQty = Number(cartMap[id]) || 0;
      const oldQty = Number(backendMap[id]) || 0;
      if (newQty === oldQty) continue;

      if (newQty <= 0) {
        await fetch(`/api/grokly/cart/items/${encodeURIComponent(id)}`, { method: 'DELETE', headers });
      } else if (oldQty === 0) {
        await fetch('/api/grokly/cart/items', {
          method: 'POST',
          headers,
          body: JSON.stringify({ productId: id, quantity: newQty }),
        });
      } else {
        await fetch(`/api/grokly/cart/items/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ quantity: newQty }),
        });
      }
    }
  } catch (err) {
    console.error('[unifiedCart] Failed to sync Grokly cart to backend:', err);
  }
}

export function setInstaStyleCart(items) {
  writeJSON(INSTASTYLE_KEY, items);
}

function getGroklyIdentifier(user) {
  return user?.uid || user?.email || getGroklyDeviceId();
}

// Firestore mirror of the guest Grokly cart, keyed by device/uid (see
// GroklyContext.jsx's identical grokly_carts/{identifier} guest mirror).
// Named distinctly from getGroklyCart/setGroklyCart above (the synchronous
// localStorage pair most call sites use) — both used to share those names
// and merged onto non-overlapping lines, which git's line-based merge
// doesn't treat as a conflict even though redeclaring the same export twice
// is a SyntaxError.
export async function getGroklyCartFirestoreMirror(user) {
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

export async function setGroklyCartFirestoreMirror(user, cartMap) {
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

function swadishttItemToBackendPayload(item) {
  return {
    productId: item.id,
    quantity: item.quantity || 1,
    customizations: item.customizations && typeof item.customizations === 'object' ? item.customizations : {},
  };
}

function backendItemToSwadishttItem(item) {
  return {
    id: item.productId,
    name: item.name,
    price: item.unitPrice,
    image: item.image,
    restaurant: item.restaurantName,
    quantity: item.quantity,
    customizations: item.customizations || {},
  };
}

// Guards concurrent setSwadishttCart calls for the same uid (fired on every
// cart-array change — see SwadishttContext.jsx's save effect) from
// interleaving out of order: an older, still-in-flight sync is dropped
// once a newer one has started for the same user.
const swadishttSyncVersions = new Map();

/**
 * Reads the Swadishtt cart. Authenticated callers that pass getIdToken get
 * the real backend cart (app/api/swadishtt/cart — ownership-enforced,
 * validates against the live swadishtt_products catalog); everyone else
 * (guests, or any caller that doesn't pass a token) keeps the existing
 * direct Firestore-by-identifier read, unchanged.
 */
export async function getSwadishttCart(user, getIdToken) {
  if (user?.uid && typeof getIdToken === 'function') {
    try {
      const token = await getIdToken();
      if (token) {
        const res = await fetch('/api/swadishtt/cart', {
          headers: { Authorization: `Bearer ${token}`, 'x-user-id': user.uid },
        });
        if (res.ok) {
          const data = await res.json();
          return (data.items || []).map(backendItemToSwadishttItem);
        }
      }
    } catch (err) {
      console.error('[unifiedCart] Failed to load Swadishtt cart from backend, falling back:', err);
    }
  }

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

/**
 * Writes the Swadishtt cart. Guests (or any caller without getIdToken) keep
 * the existing direct Firestore-by-identifier write, unchanged. Authenticated
 * callers additionally sync to the real backend cart: since this is called
 * with the *whole* new cart array on every change (not a diff), and
 * replicating the backend's productId+customizations doc-id derivation
 * client-side would risk drifting out of sync with it, the sync clears the
 * backend cart and re-adds each item — simple and always correct, at the
 * cost of a brief window where a concurrent read sees an empty backend
 * cart. The version guard below prevents an old, slow save from clobbering
 * a newer one if two saves overlap.
 */
export async function setSwadishttCart(user, items, getIdToken) {
  const identifier = getSwadishttIdentifier(user);
  if (identifier) {
    try {
      await setDoc(doc(db, 'swadishtt_carts', identifier), { cart: items, updatedAt: Date.now() });
    } catch (err) {
      console.error('[unifiedCart] Failed to save Swadishtt cart to Firestore:', err);
    }
  }

  if (!user?.uid || typeof getIdToken !== 'function') return;

  const myVersion = (swadishttSyncVersions.get(user.uid) || 0) + 1;
  swadishttSyncVersions.set(user.uid, myVersion);
  const stillCurrent = () => swadishttSyncVersions.get(user.uid) === myVersion;

  try {
    const token = await getIdToken();
    if (!token || !stillCurrent()) return;
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'x-user-id': user.uid };

    await fetch('/api/swadishtt/cart', { method: 'DELETE', headers });
    if (!stillCurrent()) return;

    for (const item of items) {
      if (!stillCurrent()) return;
      await fetch('/api/swadishtt/cart/items', {
        method: 'POST',
        headers,
        body: JSON.stringify(swadishttItemToBackendPayload(item)),
      }).catch((err) => console.error('[unifiedCart] Failed to sync a Swadishtt cart item:', err));
    }
  } catch (err) {
    console.error('[unifiedCart] Failed to sync Swadishtt cart to backend:', err);
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

  await setSwadishttCart(user, [], getIdToken);

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
      const headers = { Authorization: `Bearer ${token}`, 'x-user-id': user.uid };
      await Promise.all([
        fetch('/api/instastyle/cart', { method: 'DELETE', headers }),
        fetch('/api/grokly/cart', { method: 'DELETE', headers }),
      ]);
    }
  } catch (err) {
    console.error('[unifiedCart] Failed to clear an authenticated backend cart:', err);
  }
}

/** Total item count across all three brand carts — used for the header badge. */
export async function getUnifiedCartCount(user) {
  const swadishttCart = await getSwadishttCart(user);
  const swadishttCount = swadishttCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const groklyCart = await getGroklyCartFirestoreMirror(user);
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

/**
 * Builds the normalized { key, name, theme, items[], subtotal, savings, itemCount }[]
 * for the Cart Page. Pass getIdToken so authenticated users' Grokly and
 * Swadishtt items come from the real backend carts (app/api/{grokly,
 * swadishtt}/cart) instead of only ever reading this browser's local
 * mirror — omitting it (or being a guest) falls back to that local read
 * exactly as before, so existing guest behavior is unchanged.
 */
export async function buildUnifiedStores(user, getIdToken) {
  const swadishttCart = await getSwadishttCart(user, getIdToken);
  const swadishttItems = swadishttCart.map((item, idx) => ({
    key: `swadishtt-${item.id}-${idx}`,
    id: item.id,
    name: item.name,
    variant: item.restaurant || 'Regular',
    price: item.price,
    image: item.image,
    quantity: item.quantity || 1,
    customizations: item.customizations || {},
  }));

  const groklyCartMap = (await getGroklyCartFromBackend(user, getIdToken)) || getGroklyCart();
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
export function useOtherStoreItems(user, excludeKey, getIdToken) {
  const [stores, setStores] = useState([]);

  const refresh = useCallback(async () => {
    const built = await buildUnifiedStores(user, getIdToken);
    setStores(built);
  }, [user, getIdToken]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateQuantity = useCallback(async (storeKey, item, nextQty) => {
    if (storeKey === 'swadishtt') {
      const cart = await getSwadishttCart(user, getIdToken);
      const next = nextQty <= 0
        ? cart.filter((c) => c.id !== item.id)
        : cart.map((c) => (c.id === item.id ? { ...c, quantity: nextQty } : c));
      await setSwadishttCart(user, next, getIdToken);
    } else if (storeKey === 'grokly') {
      const cart = (await getGroklyCartFromBackend(user, getIdToken)) || getGroklyCart();
      const next = { ...cart };
      if (nextQty <= 0) delete next[item.id];
      else next[item.id] = nextQty;
      await setGroklyCartAndSync(next, user, getIdToken);
    } else if (storeKey === 'instastyle') {
      const cart = getInstaStyleCart();
      const matches = (c) => c.id === item.id && c.selectedSize === item.selectedSize && c.selectedColor === item.selectedColor;
      const next = nextQty <= 0
        ? cart.filter((c) => !matches(c))
        : cart.map((c) => (matches(c) ? { ...c, quantity: nextQty } : c));
      setInstaStyleCart(next);
    }
    await refresh();
  }, [user, getIdToken, refresh]);

  const removeItem = useCallback(
    (storeKey, item) => updateQuantity(storeKey, item, 0),
    [updateQuantity],
  );

  const otherStores = stores.filter((s) => s.key !== excludeKey && s.items.length > 0);

  return { otherStores, updateQuantity, removeItem };
}
