/**
 * Past Orders Service — fetches a user's order history for the "Order Again"
 * sections. Reuses each service's existing orders GET API, which already
 * supports lookup by `userId` or `email`.
 */

// Maps a service key to its orders API endpoint.
const ORDERS_ENDPOINT = {
  grokly: '/api/grokly/orders',
  instastyle: '/api/instastyle/orders',
  // swadisht uses the same shape when its route is available
  swadisht: '/api/swadisht/orders',
};

/**
 * Read the logged-in user from localStorage (set by AuthProvider on login).
 * @returns {{ uid?: string, email?: string, phone?: string } | null}
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('accesco_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Fetch past orders for a service.
 * @param {object} params
 * @param {'grokly'|'instastyle'|'swadisht'} params.service
 * @param {string} [params.userId] - falls back to the logged-in user's uid
 * @param {string} [params.email] - falls back to the logged-in user's email
 * @param {number} [params.limit=20] - max orders to return
 * @returns {Promise<Array>} orders (most recent first)
 */
export async function fetchPastOrders({ service, userId, email, limit = 20 } = {}) {
  const endpoint = ORDERS_ENDPOINT[service];
  if (!endpoint) throw new Error(`Unknown service: ${service}`);

  // Resolve identity from the logged-in user when not explicitly provided
  const user = getCurrentUser();
  const uid = userId || user?.uid;
  const mail = email || user?.email;

  if (!uid && !mail) {
    // Not logged in / no identifier — nothing to fetch
    return [];
  }

  const params = new URLSearchParams();
  if (uid) params.set('userId', uid);
  else if (mail) params.set('email', mail);

  const res = await fetch(`${endpoint}?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    console.error(`[pastOrders] ${service} fetch failed (${res.status})`);
    return [];
  }

  const data = await res.json();
  const orders = Array.isArray(data.orders) ? data.orders : [];
  return orders.slice(0, limit);
}
