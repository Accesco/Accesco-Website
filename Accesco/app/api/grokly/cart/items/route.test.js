/**
 * Tests for POST /api/grokly/cart/items — add/increment, product/stock
 * validation, and per-user isolation (the cart collection path is scoped
 * to the verified caller's own uid by construction — see
 * _lib/groklyCart.js's getCartCollection).
 */

jest.mock('@/app/api/_lib/auth', () => ({ verifyAuthToken: jest.fn() }));

const products = {}; // productId -> data
const cartsByUid = {}; // uid -> { itemId -> data }

jest.mock('@/lib/firebaseAdmin', () => ({
  adminDb: {
    collection: jest.fn((name) => {
      if (name === 'products') {
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
              if (sub !== 'grokly_cart') throw new Error(`unexpected subcollection ${sub}`);
              cartsByUid[uid] = cartsByUid[uid] || {};
              return {
                doc: (itemId) => ({ __type: 'cartItem', uid, itemId }),
              };
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
  const res = await POST(makeRequest({ productId: 'sku1', quantity: 1 }));
  expect(res.status).toBe(401);
});

test('rejects a missing productId', async () => {
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  const res = await POST(makeRequest({ quantity: 1 }));
  expect(res.status).toBe(400);
});

test('rejects a non-positive-integer quantity', async () => {
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  const res = await POST(makeRequest({ productId: 'sku1', quantity: -1 }));
  expect(res.status).toBe(400);
});

test('404s for an unknown product', async () => {
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  const res = await POST(makeRequest({ productId: 'ghost', quantity: 1 }));
  expect(res.status).toBe(404);
});

test('404s for a product belonging to a different venture', async () => {
  products.sku1 = { name: 'Some Dish', price: 100, ventureId: 'swadishtt', inStock: true };
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  const res = await POST(makeRequest({ productId: 'sku1', quantity: 1 }));
  expect(res.status).toBe(404);
});

test('adds a new item to an empty cart', async () => {
  products.sku1 = { name: 'Rice', price: 50, mrp: 60, ventureId: 'grokly', inStock: true, stockQty: 10 };
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  const res = await POST(makeRequest({ productId: 'sku1', quantity: 2 }));
  expect(res.status).toBe(201);
  const body = await res.json();
  expect(body.item.quantity).toBe(2);
  expect(cartsByUid.user1.sku1.quantity).toBe(2);
});

test('adding an already-present product increments quantity instead of duplicating', async () => {
  products.sku1 = { name: 'Rice', price: 50, ventureId: 'grokly', inStock: true, stockQty: 10 };
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  await POST(makeRequest({ productId: 'sku1', quantity: 2 }));
  const res = await POST(makeRequest({ productId: 'sku1', quantity: 3 }));
  const body = await res.json();
  expect(body.item.quantity).toBe(5);
  expect(Object.keys(cartsByUid.user1)).toHaveLength(1);
});

test('rejects out-of-stock product', async () => {
  products.sku1 = { name: 'Rice', price: 50, ventureId: 'grokly', inStock: false };
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  const res = await POST(makeRequest({ productId: 'sku1', quantity: 1 }));
  expect(res.status).toBe(409);
});

test('rejects a quantity exceeding available stock', async () => {
  products.sku1 = { name: 'Rice', price: 50, ventureId: 'grokly', inStock: true, stockQty: 2 };
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  const res = await POST(makeRequest({ productId: 'sku1', quantity: 5 }));
  expect(res.status).toBe(409);
});

test('different users adding the same product get isolated cart rows', async () => {
  products.sku1 = { name: 'Rice', price: 50, ventureId: 'grokly', inStock: true, stockQty: 100 };
  verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
  await POST(makeRequest({ productId: 'sku1', quantity: 1 }));
  verifyAuthToken.mockResolvedValue({ uid: 'user2', error: null });
  await POST(makeRequest({ productId: 'sku1', quantity: 7 }));

  expect(cartsByUid.user1.sku1.quantity).toBe(1);
  expect(cartsByUid.user2.sku1.quantity).toBe(7);
});
