/**
 * Server-only stock validation/decrement helpers, shared by the Grokly and
 * InstaStyle order-creation routes. These reuse each vertical's own existing
 * stock representation rather than introducing a third inventory model:
 *   - Grokly: flat numeric `stockQty` on products/{sku} (client SDK, matching
 *     app/api/products/route.js's existing access pattern for that collection)
 *   - InstaStyle: per-size `inventory: {size: count}` on instastyle_products,
 *     resolved via the same resolveProductRef/getAvailableStock helpers the
 *     InstaStyle cart backend already validates against (_lib/instastyleCart.js)
 *
 * Both are called from *inside* the order route's own transaction, planning
 * — not applying — the decrement: callers must do all `transaction.get()`
 * reads (via these planners) before any `transaction.set/update()` write,
 * per Firestore's transaction rules. Idempotency comes from the order route
 * itself only calling into these when the order doc doesn't already exist
 * (see the callers) — a retried request for the same order.id never re-plans
 * or re-applies a decrement.
 */

import { collection, doc } from 'firebase/firestore';
import { resolveProductRef, getAvailableStock } from './instastyleCart';

// Returns { error, status } if any item is short on stock, otherwise
// { decrements: [{ ref, newQty }] } for the caller to transaction.update().
// Items with no tracked stockQty field (untracked/unlimited) or pointing at
// an unknown/removed product are skipped rather than blocking the order.
export async function planGroklyStockDecrements(transaction, db, items) {
  const entries = (items || [])
    .filter((item) => item && (Number(item.quantity) || 0) > 0)
    .map((item) => ({ item, ref: doc(collection(db, 'products'), String(item.id)) }));

  if (entries.length === 0) return { decrements: [] };

  const snaps = await Promise.all(entries.map(({ ref }) => transaction.get(ref)));

  const decrements = [];
  for (let i = 0; i < entries.length; i++) {
    const snap = snaps[i];
    const { item, ref } = entries[i];
    const requested = Number(item.quantity) || 0;
    if (!snap.exists()) continue;

    const data = snap.data();
    if (data.stockQty === undefined || data.stockQty === null) continue;

    const available = Number(data.stockQty) || 0;
    if (available < requested) {
      return {
        error: `Insufficient stock for "${data.name || item.id}" (only ${available} left)`,
        status: 409,
      };
    }
    decrements.push({ ref, newQty: Math.max(0, available - requested) });
  }

  return { decrements };
}

// Same shape as planGroklyStockDecrements, but for InstaStyle's admin-SDK
// products (resolved by ID first, then by the `id` field — same lookup
// order the cart backend uses) and per-size inventory map. Static-catalog
// items (resolveProductRef returns null — nothing in Firestore for them)
// have no stock to track and are skipped, matching the cart backend's own
// treatment of them (getAvailableStock returns null = unlimited/untracked).
export async function planInstaStyleStockDecrements(transaction, items) {
  const withRefs = [];
  for (const item of items || []) {
    if (!item || (Number(item.quantity) || 0) <= 0) continue;
    const ref = await resolveProductRef(item.id);
    if (ref) withRefs.push({ item, ref });
  }

  if (withRefs.length === 0) return { decrements: [] };

  const snaps = await Promise.all(withRefs.map(({ ref }) => transaction.get(ref)));

  const decrements = [];
  for (let i = 0; i < withRefs.length; i++) {
    const snap = snaps[i];
    const { item, ref } = withRefs[i];
    const requested = Number(item.quantity) || 0;
    if (!snap.exists) continue;

    const data = snap.data();
    const size = item.selectedSize || item.size || null;
    const available = getAvailableStock(data, size);
    if (available === null) continue; // untracked for this size/product

    if (available < requested) {
      return {
        error: `Insufficient stock for "${data.name || item.id}"${size ? ` (size ${size})` : ''} (only ${available} left)`,
        status: 409,
      };
    }
    decrements.push({
      ref,
      field: `inventory.${size}`,
      newQty: Math.max(0, available - requested),
    });
  }

  return { decrements };
}
