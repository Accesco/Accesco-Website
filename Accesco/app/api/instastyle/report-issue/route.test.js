/**
 * Tests for POST /api/instastyle/report-issue. Unlike the Swadishtt
 * equivalent, this route's frontend currently sources orderId from a
 * hardcoded demo array rather than real orders (see route.js's comment), so
 * ownership is enforced only when the id resolves to a real
 * instastyle_orders doc — these tests cover both that resolved case and the
 * (today, always-true) unresolved case.
 */

jest.mock('../../_lib/auth', () => ({ verifyAuthToken: jest.fn() }));
jest.mock('../../_lib/authz', () => ({ requireOwnerOrAdmin: jest.fn() }));

const orders = {};
jest.mock('@/lib/firebase', () => ({ db: {} }));
jest.mock('firebase/firestore', () => ({
  collection: jest.fn((db, name) => ({ __col: name })),
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

const { verifyAuthToken } = require('../../_lib/auth');
const { requireOwnerOrAdmin } = require('../../_lib/authz');
const { addDoc } = require('firebase/firestore');
const { POST } = require('./route');

function makeRequest(body) {
  return { json: async () => body };
}

beforeEach(() => {
  jest.clearAllMocks();
  Object.keys(orders).forEach((k) => delete orders[k]);
});

test('unauthenticated caller: 401, no report filed', async () => {
  verifyAuthToken.mockResolvedValue({ uid: null, error: 'Missing or invalid Authorization header' });
  const res = await POST(makeRequest({ orderId: 'AC-2041' }));
  expect(res.status).toBe(401);
  expect(addDoc).not.toHaveBeenCalled();
});

test('order id does not resolve to a real order (today\'s demo-data case): still succeeds, no ownership check performed', async () => {
  verifyAuthToken.mockResolvedValue({ uid: 'some-uid', error: null });
  const res = await POST(makeRequest({ orderId: 'AC-2041', issueType: 'size_fit' }));
  expect(res.status).toBe(200);
  expect(requireOwnerOrAdmin).not.toHaveBeenCalled();
  expect(addDoc).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({ orderId: 'AC-2041', userId: 'some-uid' })
  );
});

test('order id resolves to a real order owned by someone else: 403, no report filed', async () => {
  orders['real-order-1'] = { userId: 'owner-uid' };
  verifyAuthToken.mockResolvedValue({ uid: 'someone-else', error: null });
  requireOwnerOrAdmin.mockResolvedValue({ uid: 'someone-else', error: 'Forbidden', status: 403 });
  const res = await POST(makeRequest({ orderId: 'real-order-1' }));
  expect(res.status).toBe(403);
  expect(addDoc).not.toHaveBeenCalled();
});

test('order id resolves to a real order owned by the caller: succeeds', async () => {
  orders['real-order-1'] = { userId: 'owner-uid' };
  verifyAuthToken.mockResolvedValue({ uid: 'owner-uid', error: null });
  requireOwnerOrAdmin.mockResolvedValue({ uid: 'owner-uid', error: null, status: 200 });
  const res = await POST(makeRequest({ orderId: 'real-order-1' }));
  expect(res.status).toBe(200);
});

test('admin can file against a real order they do not own', async () => {
  orders['real-order-1'] = { userId: 'owner-uid' };
  verifyAuthToken.mockResolvedValue({ uid: 'admin-uid', error: null });
  requireOwnerOrAdmin.mockResolvedValue({ uid: 'admin-uid', role: 'admin', error: null, status: 200 });
  const res = await POST(makeRequest({ orderId: 'real-order-1' }));
  expect(res.status).toBe(200);
});
