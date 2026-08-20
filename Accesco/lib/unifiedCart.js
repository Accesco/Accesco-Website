/**
 * Read-only aggregator over the three independent brand carts
 * (Swadishtt, Grokly, InstaStyle). Each brand owns its own Firestore doc
 * and item shape; this module normalizes them for the main site's
 * unified Cart Page without touching each brand's own cart logic.
 */
import { useCallback, useEffect, useState } from 'react';
import { getProductById } from '@/lib/groklyProducts';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function getCartIdentifier(user) {
  return user?.uid || auth?.currentUser?.uid || 'guest';
}

export async function getInstaStyleCart(user) {
  const identifier = getCartIdentifier(user);
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
  const identifier = getCartIdentifier(user);
  if (!identifier) return;
  try {
    await setDoc(doc(db, 'instastyle_carts', identifier), { cart: items, updatedAt: Date.now() });
  } catch (err) {
    console.error('[unifiedCart] Failed to save InstaStyle cart to Firestore:', err);
  }
}

export async function getGroklyCart(user) {
  const identifier = getCartIdentifier(user);
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
  const identifier = getCartIdentifier(user);
  if (!identifier) return;
  try {
    await setDoc(doc(db, 'grokly_carts', identifier), { cart: cartMap, updatedAt: Date.now() });
  } catch (err) {
    console.error('[unifiedCart] Failed to save Grokly cart to Firestore:', err);
  }
}

// Backend-aware Grokly cart helpers for authenticated users
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

export async function setGroklyCartAndSync(cartMap, user, getIdToken) {
  await setGroklyCart(user, cartMap);

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

const swadishttSyncVersions = new Map();

/**
 * Reads the Swadishtt cart. Authenticated callers that pass getIdToken get
 * the backend cart; guests use Firestore by identifier.
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

  const identifier = getCartIdentifier(user);
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
 * Writes the Swadishtt cart. Writes to Firestore doc and syncs to backend API if authenticated.
 */
export async function setSwadishttCart(user, items, getIdToken) {
  const identifier = getCartIdentifier(user);
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
 */
export async function clearAllBrandCarts({ user, getIdToken } = {}) {
  await setGroklyCart(user, {});
  await setInstaStyleCart(user, []);
  await setSwadishttCart(user, [], getIdToken);

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

/**
 * Builds the normalized store list for the Cart Page.
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

  const groklyCartMap = (await getGroklyCartFromBackend(user, getIdToken)) || (await getGroklyCart(user));
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
 * the other two verticals.
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
      const cart = (await getGroklyCartFromBackend(user, getIdToken)) || (await getGroklyCart(user));
      const next = { ...cart };
      if (nextQty <= 0) delete next[item.id];
      else next[item.id] = nextQty;
      await setGroklyCartAndSync(next, user, getIdToken);
    } else if (storeKey === 'instastyle') {
      const cart = await getInstaStyleCart(user);
      const matches = (c) => c.id === item.id && c.selectedSize === item.selectedSize && c.selectedColor === item.selectedColor;
      const next = nextQty <= 0
        ? cart.filter((c) => !matches(c))
        : cart.map((c) => (matches(c) ? { ...c, quantity: nextQty } : c));
      await setInstaStyleCart(user, next);
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
