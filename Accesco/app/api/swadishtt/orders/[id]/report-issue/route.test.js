/**
 * Tests for POST /api/swadishtt/orders/[id]/report-issue — order must exist
 * and the caller must own it (or be admin). requireOwnerOrAdmin itself is
 * already unit-tested in app/api/_lib/authz.test.js, so it's mocked here to
 * isolate this route's own orchestration: does it look the order up first,
 * does it pass the order's real owner through, does it 404/403 correctly.
 */

jest.mock('../../../../_lib/authz', () => ({ requireOwnerOrAdmin: jest.fn() }));

const orders = {};
jest.mock('@/lib/firebase', () => ({ db: {} }));
jest.mock('firebase/firestore', () => ({
  collection: jest.fn((db, name) => ({ __col: name })),
  // route.js calls doc(db, 'collectionName', id) — the 3-arg form — not
  // doc(collectionRef, id), so this mock needs to handle both shapes.
  doc: jest.fn((a, b, c) =>
    c !== undefined ? { __col: b, __id: c } : { __col: a.__col, __id: b }
  ),
  getDoc: jest.fn(async (ref) => {
    const data = orders[ref.__id];
    return { exists: () => !!data, data: () => data };
  }),
  addDoc: jest.fn(async () => ({ id: 'report-1' })),
  serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP'),
}));

const { requireOwnerOrAdmin } = require('../../../../_lib/authz');
const { addDoc } = require('firebase/firestore');
const { POST } = require('./route');

function makeRequest(body) {
  return { json: async () => body };
}

beforeEach(() => {
  jest.clearAllMocks();
  Object.keys(orders).forEach((k) => delete orders[k]);
});

describe('POST /api/swadishtt/orders/[id]/report-issue', () => {
  test('order not found: 404, no report filed', async () => {
    const res = await POST(makeRequest({ issueType: 'missing' }), { params: { id: 'ghost-order' } });
    expect(res.status).toBe(404);
    expect(requireOwnerOrAdmin).not.toHaveBeenCalled();
    expect(addDoc).not.toHaveBeenCalled();
  });

  test('unauthenticated caller: 401, no report filed', async () => {
    orders['order-1'] = { userId: 'owner-uid' };
    requireOwnerOrAdmin.mockResolvedValue({ uid: null, error: 'Missing or invalid Authorization header', status: 401 });
    const res = await POST(makeRequest({}), { params: { id: 'order-1' } });
    expect(res.status).toBe(401);
    expect(addDoc).not.toHaveBeenCalled();
  });

  test('order owner: succeeds, report is filed with the owner uid', async () => {
    orders['order-1'] = { userId: 'owner-uid' };
    requireOwnerOrAdmin.mockResolvedValue({ uid: 'owner-uid', role: 'user', error: null, status: 200 });
    const res = await POST(makeRequest({ issueType: 'missing' }), { params: { id: 'order-1' } });
    expect(res.status).toBe(200);
    expect(requireOwnerOrAdmin).toHaveBeenCalledWith(expect.anything(), 'owner-uid');
    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ orderId: 'order-1', userId: 'owner-uid' })
    );
  });

  test('non-owner: 403, no report filed', async () => {
    orders['order-1'] = { userId: 'owner-uid' };
    requireOwnerOrAdmin.mockResolvedValue({ uid: 'someone-else', role: 'user', error: 'Forbidden', status: 403 });
    const res = await POST(makeRequest({}), { params: { id: 'order-1' } });
    expect(res.status).toBe(403);
    expect(addDoc).not.toHaveBeenCalled();
  });

  test('admin acting on another user\'s order: succeeds', async () => {
    orders['order-1'] = { userId: 'owner-uid' };
    requireOwnerOrAdmin.mockResolvedValue({ uid: 'admin-uid', role: 'admin', error: null, status: 200 });
    const res = await POST(makeRequest({ issueType: 'wrong_item' }), { params: { id: 'order-1' } });
    expect(res.status).toBe(200);
    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ orderId: 'order-1', userId: 'admin-uid' })
    );
  });
});
