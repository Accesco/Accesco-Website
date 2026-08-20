/**
 * Tests for POST /api/swadishtt/cart/items — add/increment, product/
 * availability validation, and per-user isolation. Mirrors the Grokly cart
 * items test structure (see app/api/grokly/cart/items/route.test.js).
 */

jest.mock('@/app/api/_lib/auth', () => ({ verifyAuthToken: jest.fn() }));

const products = {};
const cartsByUid = {};

jest.mock('@/lib/firebaseAdmin', () => ({
  adminDb: {
    collection: jest.fn((name) => {
      if (name === 'swadishtt_products') {
        return {
          doc: (id) => ({
            __type: 'product',
            id,
            get: async () => ({ exists: !!products[id], data: () => products[id] }),
          }),
        };
      }
      if (name === 'users') {
        return {
          doc: (uid) => ({
            collection: (sub) => {
              if (sub !== 'swadishtt_cart') throw new Error(`unexpected subcollection ${sub}`);
              cartsByUid[uid] = cartsByUid[uid] || {};
              return { doc: (itemId) => ({ __type: 'cartItem', uid, itemId }) };
            },
          }),
        };
      }
      throw new Error(`unexpected collection ${name}`);
    }),
    runTransaction: jest.fn(async (fn) => {
      const tx = {
        get: async (ref) => {
          if (ref.__type === 'product') {
            const data = products[ref.id];
            return { exists: !!data, data: () => data };
          }
          const data = (cartsByUid[ref.uid] || {})[ref.itemId];
          return { exists: !!data, data: () => data };
        },
        set: (ref, data) => {
          cartsByUid[ref.uid] = cartsByUid[ref.uid] || {};
          cartsByUid[ref.uid][ref.itemId] = { ...(cartsByUid[ref.uid][ref.itemId] || {}), ...data };
        },
      };
      return fn(tx);
    }),
  },
}));

jest.mock('firebase-admin/firestore', () => ({
  FieldValue: { serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP') },
}));

const { verifyAuthToken } = require('@/app/api/_lib/auth');
const { POST } = require('./route');

function makeRequest(body) {
  return { json: async () => body };
}

beforeEach(() => {
  jest.clearAllMocks();
  Object.keys(products).forEach((k) => delete products[k]);
  Object.keys(cartsByUid).forEach((k) => delete cartsByUid[k]);
});

test('rejects an unauthenticated request', async () => {
  verifyAuthToken.mockResolvedValue({ uid: null, error: 'Missing or invalid Authorization header' });
  const res = await POST(makeRequest({ productId: 'dish1', quantity: 1 }));
  expect(res.status).toBe(401);
});

test('404s for an unknown dish', async () => {
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  const res = await POST(makeRequest({ productId: 'ghost', quantity: 1 }));
  expect(res.status).toBe(404);
});

test('404s for a deactivated dish', async () => {
  products.dish1 = { name: 'Palak Paneer', price: 260, isActive: false };
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  const res = await POST(makeRequest({ productId: 'dish1', quantity: 1 }));
  expect(res.status).toBe(404);
});

test('rejects an out-of-stock dish', async () => {
  products.dish1 = { name: 'Palak Paneer', price: 260, isActive: true, inStock: false };
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  const res = await POST(makeRequest({ productId: 'dish1', quantity: 1 }));
  expect(res.status).toBe(409);
});

test('adds a new item to the cart', async () => {
  products.dish1 = { name: 'Palak Paneer', price: 260, isActive: true, inStock: true, restaurantId: 'r1' };
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  const res = await POST(makeRequest({ productId: 'dish1', quantity: 2 }));
  expect(res.status).toBe(201);
  const body = await res.json();
  expect(body.item.quantity).toBe(2);
  expect(body.item.subtotal).toBe(520);
});

test('adding an already-present dish (same/no customizations) increments quantity — same cart line', async () => {
  products.dish1 = { name: 'Palak Paneer', price: 260, isActive: true, inStock: true };
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  await POST(makeRequest({ productId: 'dish1', quantity: 1 }));
  const res = await POST(makeRequest({ productId: 'dish1', quantity: 2 }));
  const body = await res.json();
  expect(body.item.quantity).toBe(3);
  expect(Object.keys(cartsByUid.user1)).toHaveLength(1);
});

test('same product + same customizations (any key order) merges into one cart line', async () => {
  products.dish1 = { name: 'Palak Paneer', price: 260, isActive: true, inStock: true };
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  await POST(makeRequest({ productId: 'dish1', quantity: 1, customizations: { spice: 'hot', addOn: 'extra-cheese' } }));
  const res = await POST(makeRequest({ productId: 'dish1', quantity: 1, customizations: { addOn: 'extra-cheese', spice: 'hot' } }));
  const body = await res.json();
  expect(res.status).toBe(201);
  expect(body.item.quantity).toBe(2);
  expect(Object.keys(cartsByUid.user1)).toHaveLength(1);
});

test('same product + different customizations creates a separate cart line', async () => {
  products.dish1 = { name: 'Palak Paneer', price: 260, isActive: true, inStock: true };
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  await POST(makeRequest({ productId: 'dish1', quantity: 1, customizations: { spice: 'mild' } }));
  await POST(makeRequest({ productId: 'dish1', quantity: 1, customizations: { spice: 'hot' } }));

  expect(Object.keys(cartsByUid.user1)).toHaveLength(2);
  const rows = Object.values(cartsByUid.user1);
  expect(rows.every((r) => r.productId === 'dish1' && r.quantity === 1)).toBe(true);
});

test('a customized line and a no-customization line for the same dish stay separate', async () => {
  products.dish1 = { name: 'Palak Paneer', price: 260, isActive: true, inStock: true };
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  await POST(makeRequest({ productId: 'dish1', quantity: 1 }));
  await POST(makeRequest({ productId: 'dish1', quantity: 1, customizations: { spice: 'hot' } }));

  expect(Object.keys(cartsByUid.user1)).toHaveLength(2);
});

test('different users get isolated cart rows for the same dish', async () => {
  products.dish1 = { name: 'Palak Paneer', price: 260, isActive: true, inStock: true };
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  await POST(makeRequest({ productId: 'dish1', quantity: 1 }));
  verifyAuthToken.mockResolvedValue({ uid: 'user2', error: null });
  await POST(makeRequest({ productId: 'dish1', quantity: 5 }));

  expect(Object.values(cartsByUid.user1)[0].quantity).toBe(1);
  expect(Object.values(cartsByUid.user2)[0].quantity).toBe(5);
});
