/**
 * Unit tests for the stock-planning helpers used by the Grokly and
 * InstaStyle order-creation transactions (see inventory.js's header
 * comment). Firestore itself is mocked — these exercise only the
 * sufficient/insufficient/exact-depletion/zero-stock decision logic and the
 * "plan reads, caller applies" idempotency shape, not real Firestore.
 */

jest.mock('firebase/firestore', () => ({
  collection: jest.fn((db, name) => ({ __col: name })),
  doc: jest.fn((colRef, id) => ({ __col: colRef.__col, __id: id })),
}));

jest.mock('@/lib/firebaseAdmin', () => ({
  adminDb: {
    collection: jest.fn((name) => ({
      doc: jest.fn((id) => ({ __col: name, __id: id })),
      where: jest.fn(() => ({
        limit: jest.fn(() => ({ get: jest.fn().mockResolvedValue({ empty: true, docs: [] }) })),
      })),
    })),
  },
}));

jest.mock('@/lib/mockData', () => ({ getProductById: jest.fn(() => null) }));

const { planGroklyStockDecrements, planInstaStyleStockDecrements } = require('./inventory');

// A fake transaction whose `get` answers from an in-memory product map keyed
// by "collection/id", using the client-SDK exists()-as-a-method shape
// (matches how planGroklyStockDecrements reads its snapshots).
function fakeClientTransaction(products) {
  return {
    get: jest.fn(async (ref) => {
      const key = `${ref.__col}/${ref.__id}`;
      const data = products[key];
      return { exists: () => !!data, data: () => data };
    }),
  };
}

describe('planGroklyStockDecrements', () => {
  test('sufficient stock: plans a decrement, no error', async () => {
    const tx = fakeClientTransaction({ 'products/sku1': { name: 'Rice', stockQty: 10 } });
    const result = await planGroklyStockDecrements(tx, {}, [{ id: 'sku1', quantity: 3 }]);
    expect(result.error).toBeUndefined();
    expect(result.decrements).toEqual([{ ref: { __col: 'products', __id: 'sku1' }, newQty: 7 }]);
  });

  test('insufficient stock: returns a 409 error, no decrements', async () => {
    const tx = fakeClientTransaction({ 'products/sku1': { name: 'Rice', stockQty: 2 } });
    const result = await planGroklyStockDecrements(tx, {}, [{ id: 'sku1', quantity: 5 }]);
    expect(result.error).toMatch(/insufficient stock/i);
    expect(result.status).toBe(409);
  });

  test('exact stock depletion: requesting exactly the available amount succeeds, leaves 0', async () => {
    const tx = fakeClientTransaction({ 'products/sku1': { name: 'Rice', stockQty: 5 } });
    const result = await planGroklyStockDecrements(tx, {}, [{ id: 'sku1', quantity: 5 }]);
    expect(result.error).toBeUndefined();
    expect(result.decrements[0].newQty).toBe(0);
  });

  test('zero stock: any positive request is rejected', async () => {
    const tx = fakeClientTransaction({ 'products/sku1': { name: 'Rice', stockQty: 0 } });
    const result = await planGroklyStockDecrements(tx, {}, [{ id: 'sku1', quantity: 1 }]);
    expect(result.error).toMatch(/insufficient stock/i);
  });

  test('product with untracked stock (no stockQty field) is skipped, never blocks the order', async () => {
    const tx = fakeClientTransaction({ 'products/sku1': { name: 'Untracked item' } });
    const result = await planGroklyStockDecrements(tx, {}, [{ id: 'sku1', quantity: 100 }]);
    expect(result.error).toBeUndefined();
    expect(result.decrements).toEqual([]);
  });

  test('unknown/removed product is skipped, never blocks the order', async () => {
    const tx = fakeClientTransaction({});
    const result = await planGroklyStockDecrements(tx, {}, [{ id: 'gone', quantity: 1 }]);
    expect(result.error).toBeUndefined();
    expect(result.decrements).toEqual([]);
  });

  test('zero/negative quantity items are ignored', async () => {
    const tx = fakeClientTransaction({ 'products/sku1': { stockQty: 5 } });
    const result = await planGroklyStockDecrements(tx, {}, [{ id: 'sku1', quantity: 0 }]);
    expect(result.decrements).toEqual([]);
  });

  test('duplicate/retry processing: re-planning against the already-decremented value correctly reflects the new balance (only one decrement is ever applied per real transaction)', async () => {
    // Simulates what a genuine retry against updated Firestore state would
    // see — the route itself is what prevents this from running twice for
    // the same order (see the "order doc already exists" idempotency guard
    // in app/api/grokly/orders/route.js); this proves the planner's own math
    // is consistent when called against the post-decrement balance rather
    // than silently re-decrementing from the original value.
    const tx1 = fakeClientTransaction({ 'products/sku1': { stockQty: 10 } });
    const first = await planGroklyStockDecrements(tx1, {}, [{ id: 'sku1', quantity: 4 }]);
    expect(first.decrements[0].newQty).toBe(6);

    const tx2 = fakeClientTransaction({ 'products/sku1': { stockQty: first.decrements[0].newQty } });
    const second = await planGroklyStockDecrements(tx2, {}, [{ id: 'sku1', quantity: 4 }]);
    expect(second.decrements[0].newQty).toBe(2);
  });

  test('multiple concurrent-style calls against independent snapshots never produce a negative stock plan', async () => {
    // Two "concurrent" order attempts both reading the same starting stock
    // of 5, each requesting 4 — in real Firestore only one would actually
    // commit (the other retries against the post-commit value and fails);
    // this checks the planner itself never plans a negative balance even if
    // called naively against a stale snapshot.
    const stock = { 'products/sku1': { stockQty: 5 } };
    const txA = fakeClientTransaction(stock);
    const txB = fakeClientTransaction(stock);
    const [a, b] = await Promise.all([
      planGroklyStockDecrements(txA, {}, [{ id: 'sku1', quantity: 4 }]),
      planGroklyStockDecrements(txB, {}, [{ id: 'sku1', quantity: 4 }]),
    ]);
    // Both see the same stale snapshot (5) since they're independent fakes,
    // so both "succeed" here — real Firestore's transaction retry is what
    // prevents both from actually committing. Neither individual plan goes
    // negative, which is the property this planner is responsible for.
    expect(a.decrements[0].newQty).toBeGreaterThanOrEqual(0);
    expect(b.decrements[0].newQty).toBeGreaterThanOrEqual(0);
  });
});

describe('planInstaStyleStockDecrements', () => {
  const { adminDb } = require('@/lib/firebaseAdmin');

  function mockResolvedRef(id, exists, data) {
    adminDb.collection.mockImplementation((name) => ({
      doc: (docId) => ({ __col: name, __id: docId, get: async () => ({ exists: docId === id && exists, data: () => data }) }),
      where: () => ({ limit: () => ({ get: async () => ({ empty: true, docs: [] }) }) }),
    }));
  }

  // planInstaStyleStockDecrements resolves refs via resolveProductRef
  // (non-transactional .get()) before reading them transactionally — this
  // fake transaction only needs to answer transaction.get(ref).
  function fakeAdminTransaction(dataByDocId) {
    return {
      get: jest.fn(async (ref) => {
        const data = dataByDocId[ref.__id];
        return { exists: !!data, data: () => data };
      }),
    };
  }

  test('sufficient per-size stock: plans a decrement', async () => {
    mockResolvedRef('shirt1', true, { name: 'Shirt', inventory: { M: 8 } });
    const tx = fakeAdminTransaction({ shirt1: { name: 'Shirt', inventory: { M: 8 } } });
    const result = await planInstaStyleStockDecrements(tx, [{ id: 'shirt1', selectedSize: 'M', quantity: 2 }]);
    expect(result.error).toBeUndefined();
    expect(result.decrements).toHaveLength(1);
    expect(result.decrements[0]).toMatchObject({ field: 'inventory.M', newQty: 6 });
    expect(result.decrements[0].ref.__id).toBe('shirt1');
  });

  test('insufficient stock for the requested size: rejected', async () => {
    mockResolvedRef('shirt1', true, { name: 'Shirt', inventory: { M: 1 } });
    const tx = fakeAdminTransaction({ shirt1: { name: 'Shirt', inventory: { M: 1 } } });
    const result = await planInstaStyleStockDecrements(tx, [{ id: 'shirt1', selectedSize: 'M', quantity: 3 }]);
    expect(result.error).toMatch(/insufficient stock/i);
    expect(result.status).toBe(409);
  });

  test('exact depletion for a size leaves 0, does not error', async () => {
    mockResolvedRef('shirt1', true, { name: 'Shirt', inventory: { M: 3 } });
    const tx = fakeAdminTransaction({ shirt1: { name: 'Shirt', inventory: { M: 3 } } });
    const result = await planInstaStyleStockDecrements(tx, [{ id: 'shirt1', selectedSize: 'M', quantity: 3 }]);
    expect(result.decrements[0].newQty).toBe(0);
  });

  test('zero stock for a size: any positive request rejected', async () => {
    mockResolvedRef('shirt1', true, { name: 'Shirt', inventory: { M: 0 } });
    const tx = fakeAdminTransaction({ shirt1: { name: 'Shirt', inventory: { M: 0 } } });
    const result = await planInstaStyleStockDecrements(tx, [{ id: 'shirt1', selectedSize: 'M', quantity: 1 }]);
    expect(result.error).toMatch(/insufficient stock/i);
  });

  test('product with no inventory map (untracked) is skipped', async () => {
    mockResolvedRef('shirt1', true, { name: 'Shirt' });
    const tx = fakeAdminTransaction({ shirt1: { name: 'Shirt' } });
    const result = await planInstaStyleStockDecrements(tx, [{ id: 'shirt1', selectedSize: 'M', quantity: 100 }]);
    expect(result.error).toBeUndefined();
    expect(result.decrements).toEqual([]);
  });

  test('static-catalog item (no Firestore doc at all) is skipped, never blocks the order', async () => {
    // resolveProductRef finds nothing in Firestore and mockData.getProductById
    // is mocked to return null too, so resolution yields no ref at all.
    adminDb.collection.mockImplementation((name) => ({
      doc: () => ({ __col: name, get: async () => ({ exists: false }) }),
      where: () => ({ limit: () => ({ get: async () => ({ empty: true, docs: [] }) }) }),
    }));
    const tx = fakeAdminTransaction({});
    const result = await planInstaStyleStockDecrements(tx, [{ id: 'static-1', selectedSize: 'M', quantity: 1 }]);
    expect(result.error).toBeUndefined();
    expect(result.decrements).toEqual([]);
  });
});
