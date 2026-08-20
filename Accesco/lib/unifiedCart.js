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

let guestDeviceId = null;
function getGuestDeviceId() {
  if (!guestDeviceId) {
    guestDeviceId = `guest_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
  }
  return guestDeviceId;
}

function getUserIdentifier(user) {
  return user?.uid || user?.email || getGuestDeviceId();
}

export async function getInstaStyleCart(user) {
  const identifier = getUserIdentifier(user);
  if (!identifier) return [];
  try {
    const snap = await getDoc(doc(db, 'instastyle_carts', identifier));
    if (!snap.exists()) return [];
    const cart = snap.data()?.cart;
    return Array.isArray(cart) ? cart : [];
  } catch (err) {
    console.error('[unifiedCart] Failed to load InstaStyle cart from Firestore:', err);
    return [];
  }
}

export async function setInstaStyleCart(user, items) {
  const identifier = getUserIdentifier(user);
  if (!identifier) return;
  try {
    await setDoc(doc(db, 'instastyle_carts', identifier), { cart: items, updatedAt: Date.now() });
  } catch (err) {
    console.error('[unifiedCart] Failed to save InstaStyle cart to Firestore:', err);
  }
}

export async function getGroklyCart(user) {
  const identifier = getUserIdentifier(user);
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
  const identifier = getUserIdentifier(user);
  if (!identifier) return;
  try {
    await setDoc(doc(db, 'grokly_carts', identifier), { cart: cartMap, updatedAt: Date.now() });
  } catch (err) {
    console.error('[unifiedCart] Failed to save Grokly cart to Firestore:', err);
  }
}

/** Reads the Swadishtt cart straight from Firestore (`swadishtt_carts/{identifier}`). */
export async function getSwadishttCart(user) {
  const identifier = getUserIdentifier(user);
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
  const identifier = getUserIdentifier(user);
  if (!identifier) return;
  try {
    await setDoc(doc(db, 'swadishtt_carts', identifier), { cart: items, updatedAt: Date.now() });
  } catch (err) {
    console.error('[unifiedCart] Failed to save Swadishtt cart to Firestore:', err);
  }
}

/**
 * Clears all three brand carts after a successful unified checkout in Firestore.
 */
export async function clearAllBrandCarts({ user, getIdToken } = {}) {
  await setGroklyCart(user, {});
  await setInstaStyleCart(user, []);
  await setSwadishttCart(user, []);

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
  const instastyleCart = await getInstaStyleCart(user);
  const instastyleCount = instastyleCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
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

  const instastyleCart = await getInstaStyleCart(user);
  const instastyleItems = instastyleCart.map((item, idx) => ({
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
 * before they head to the combined checkout.
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
      const cart = await getGroklyCart(user);
      const next = { ...cart };
      if (nextQty <= 0) delete next[item.id];
      else next[item.id] = nextQty;
      await setGroklyCart(user, next);
    } else if (storeKey === 'instastyle') {
      const cart = await getInstaStyleCart(user);
      const matches = (c) => c.id === item.id && c.selectedSize === item.selectedSize && c.selectedColor === item.selectedColor;
      const next = nextQty <= 0
        ? cart.filter((c) => !matches(c))
        : cart.map((c) => (matches(c) ? { ...c, quantity: nextQty } : c));
      await setInstaStyleCart(user, next);
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
