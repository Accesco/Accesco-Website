/**
 * Tests for PATCH/DELETE /api/grokly/cart/items/[itemId] — quantity update
 * and single-item removal, both scoped to the caller's own cart collection.
 */

jest.mock('@/app/api/_lib/auth', () => ({ verifyAuthToken: jest.fn() }));

const products = {};
const cartsByUid = {};

jest.mock('@/lib/firebaseAdmin', () => ({
  adminDb: {
    collection: jest.fn((name) => {
      if (name === 'products') {
        return { doc: (id) => ({ __type: 'product', id }) };
      }
      if (name === 'users') {
        return {
          doc: (uid) => ({
            collection: (sub) => {
              if (sub !== 'grokly_cart') throw new Error(`unexpected subcollection ${sub}`);
              cartsByUid[uid] = cartsByUid[uid] || {};
              return {
                doc: (itemId) => ({
                  __type: 'cartItem',
                  uid,
                  itemId,
                  get: async () => {
                    const data = (cartsByUid[uid] || {})[itemId];
                    return { exists: !!data, data: () => data };
                  },
                  delete: async () => {
                    delete cartsByUid[uid][itemId];
                  },
                }),
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
        update: (ref, data) => {
          cartsByUid[ref.uid][ref.itemId] = { ...cartsByUid[ref.uid][ref.itemId], ...data };
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
const { PATCH, DELETE: DELETE_ITEM } = require('./route');

function makeRequest(body) {
  return { json: async () => body };
}

beforeEach(() => {
  jest.clearAllMocks();
  Object.keys(products).forEach((k) => delete products[k]);
  Object.keys(cartsByUid).forEach((k) => delete cartsByUid[k]);
});

describe('PATCH', () => {
  test('rejects unauthenticated requests', async () => {
    verifyAuthToken.mockResolvedValue({ uid: null, error: 'Invalid or expired token' });
    const res = await PATCH(makeRequest({ quantity: 2 }), { params: { itemId: 'sku1' } });
    expect(res.status).toBe(401);
  });

  test('404s for a cart item that does not exist', async () => {
    verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
    const res = await PATCH(makeRequest({ quantity: 2 }), { params: { itemId: 'sku1' } });
    expect(res.status).toBe(404);
  });

  test('updates quantity within stock', async () => {
    products.sku1 = { name: 'Rice', price: 50, inStock: true, stockQty: 10 };
    cartsByUid.user1 = { sku1: { productId: 'sku1', quantity: 1, unitPrice: 50 } };
    verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
    const res = await PATCH(makeRequest({ quantity: 4 }), { params: { itemId: 'sku1' } });
    expect(res.status).toBe(200);
    expect(cartsByUid.user1.sku1.quantity).toBe(4);
  });

  test('rejects a quantity update exceeding stock', async () => {
    products.sku1 = { name: 'Rice', price: 50, inStock: true, stockQty: 3 };
    cartsByUid.user1 = { sku1: { productId: 'sku1', quantity: 1, unitPrice: 50 } };
    verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
    const res = await PATCH(makeRequest({ quantity: 10 }), { params: { itemId: 'sku1' } });
    expect(res.status).toBe(409);
    expect(cartsByUid.user1.sku1.quantity).toBe(1); // unchanged
  });

  test('a user cannot update another user\'s cart item (isolated collections)', async () => {
    products.sku1 = { name: 'Rice', price: 50, inStock: true, stockQty: 10 };
    cartsByUid.owner = { sku1: { productId: 'sku1', quantity: 1, unitPrice: 50 } };
    verifyAuthToken.mockResolvedValue({ uid: 'attacker', error: null });
    // "attacker" has their own (empty) grokly_cart collection — the same
    // itemId in a different uid's cart is a completely different document,
    // so this 404s rather than touching the owner's item.
    const res = await PATCH(makeRequest({ quantity: 99 }), { params: { itemId: 'sku1' } });
    expect(res.status).toBe(404);
    expect(cartsByUid.owner.sku1.quantity).toBe(1);
  });
});

describe('DELETE', () => {
  test('rejects unauthenticated requests', async () => {
    verifyAuthToken.mockResolvedValue({ uid: null, error: 'Invalid or expired token' });
    const res = await DELETE_ITEM(makeRequest(), { params: { itemId: 'sku1' } });
    expect(res.status).toBe(401);
  });

  test('404s for a cart item that does not exist', async () => {
    verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
    const res = await DELETE_ITEM(makeRequest(), { params: { itemId: 'sku1' } });
    expect(res.status).toBe(404);
  });

  test('removes an item from the cart', async () => {
    cartsByUid.user1 = { sku1: { productId: 'sku1', quantity: 2 } };
    verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
    const res = await DELETE_ITEM(makeRequest(), { params: { itemId: 'sku1' } });
    expect(res.status).toBe(200);
    expect(cartsByUid.user1.sku1).toBeUndefined();
  });
});
