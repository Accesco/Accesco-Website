/**
 * Past Orders Service — fetches a user's order history for the "Order Again"
 * sections. Reuses each service's existing orders GET API, which already
 * supports lookup by `userId` or `email`.
 */

// Maps a service key to its orders API endpoint.
const ORDERS_ENDPOINT = {
  grokly: '/api/grokly/orders',
  instastyle: '/api/instastyle/orders',
  swadisht: '/api/swadishtt/orders',
  swadishtt: '/api/swadishtt/orders',
};

/**
 * Fetch past orders for a service.
 * @param {object} params
 * @param {'grokly'|'instastyle'|'swadisht'|'swadishtt'} params.service
 * @param {string} [params.userId] - the logged-in user's uid, e.g. from useAuth()
 * @param {string} [params.email] - the logged-in user's email, e.g. from useAuth()
 * @param {Function|string} [params.getIdToken] - function returning ID token or token string
 * @param {number} [params.limit=20] - max orders to return
 * @returns {Promise<Array>} orders (most recent first)
 */
export async function fetchPastOrders({ service, userId, email, getIdToken, limit = 20 } = {}) {
  const endpoint = ORDERS_ENDPOINT[service];
  if (!endpoint) throw new Error(`Unknown service: ${service}`);

  if (!userId && !email) {
    // Not logged in / no identifier — nothing to fetch
    return [];
  }

  const params = new URLSearchParams();
  if (userId) params.set('userId', userId);
  else if (email) params.set('email', email);

  const headers = { 'Content-Type': 'application/json' };
  if (getIdToken) {
    try {
      const token = typeof getIdToken === 'function' ? await getIdToken() : getIdToken;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
        if (userId) headers['x-user-id'] = userId;
      }
    } catch (e) {
      console.warn('[pastOrders] Token resolution warning:', e);
    }
  }

  const res = await fetch(`${endpoint}?${params.toString()}`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) {
    console.error(`[pastOrders] ${service} fetch failed (${res.status})`);
    return [];
  }

  const data = await res.json();
  const orders = Array.isArray(data.orders) ? data.orders : [];
  return orders.slice(0, limit);
}

