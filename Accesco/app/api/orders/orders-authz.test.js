/**
 * Unit tests for orders endpoint IDOR protections:
 * 1. User A cannot query User B's orders with ?userId=UserB (returns 403 Forbidden)
 * 2. User A cannot access User B's order by ID (returns 403 Forbidden)
 * 3. User A can query their own orders
 * 4. Admin can query any user's orders
 * 5. Unauthenticated requests are rejected (returns 401 Unauthorized)
 */

jest.mock('../_lib/auth', () => ({
  verifyAuthToken: jest.fn(),
}));

jest.mock('../_lib/authz', () => ({
  getUserRole: jest.fn(),
  requireAdmin: jest.fn(),
  requireOwnerOrAdmin: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  where: jest.fn(),
}));

const { verifyAuthToken } = require('../_lib/auth');
const { getUserRole } = require('../_lib/authz');
const { getDoc, getDocs } = require('firebase/firestore');
const { GET } = require('./route');

function createMockRequest(url, headers = {}) {
  const headerMap = new Map(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
  return {
    url,
    headers: {
      get: (k) => headerMap.get(k.toLowerCase()) || null,
    },
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Orders API IDOR & Authorization', () => {
  test('rejects unauthenticated requests with 401', async () => {
    verifyAuthToken.mockResolvedValue({
      uid: null,
      error: 'Missing or invalid Authorization header',
    });

    const req = createMockRequest('http://localhost:3000/api/orders?userId=userA');
    const res = await GET(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Missing or invalid Authorization header');
  });

  test('blocks User A from querying User B orders (returns 403 Forbidden)', async () => {
    verifyAuthToken.mockResolvedValue({
      uid: 'user-A',
      email: 'userA@example.com',
      allowedUids: ['user-A'],
      error: null,
    });
    getUserRole.mockResolvedValue('user');

    const req = createMockRequest('http://localhost:3000/api/orders?userId=user-B', {
      authorization: 'Bearer token-A',
    });
    const res = await GET(req);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toBe('Forbidden');
    expect(getDocs).not.toHaveBeenCalled();
  });

  test('blocks User A from viewing User B order by ID (returns 403 Forbidden)', async () => {
    verifyAuthToken.mockResolvedValue({
      uid: 'user-A',
      email: 'userA@example.com',
      allowedUids: ['user-A'],
      error: null,
    });
    getUserRole.mockResolvedValue('user');

    getDoc.mockResolvedValue({
      exists: () => true,
      id: 'order-999',
      data: () => ({ userId: 'user-B', customerEmail: 'userB@example.com', total: 500 }),
    });

    const req = createMockRequest('http://localhost:3000/api/orders?id=order-999', {
      authorization: 'Bearer token-A',
    });
    const res = await GET(req);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toBe('Forbidden');
  });

  test('allows User A to view their own order by ID', async () => {
    verifyAuthToken.mockResolvedValue({
      uid: 'user-A',
      email: 'userA@example.com',
      allowedUids: ['user-A'],
      error: null,
    });
    getUserRole.mockResolvedValue('user');

    getDoc.mockResolvedValue({
      exists: () => true,
      id: 'order-123',
      data: () => ({ userId: 'user-A', total: 350 }),
    });

    const req = createMockRequest('http://localhost:3000/api/orders?id=order-123', {
      authorization: 'Bearer token-A',
    });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.order).toEqual(expect.objectContaining({ id: 'order-123', userId: 'user-A', total: 350 }));
  });

  test('allows Admin to query any user orders with ?userId=userB', async () => {
    verifyAuthToken.mockResolvedValue({
      uid: 'admin-1',
      email: 'admin@example.com',
      allowedUids: ['admin-1'],
      error: null,
    });
    getUserRole.mockResolvedValue('admin');

    getDocs.mockResolvedValue([
      { id: 'order-B1', data: () => ({ userId: 'user-B', total: 100 }) },
    ]);

    const req = createMockRequest('http://localhost:3000/api/orders?userId=user-B', {
      authorization: 'Bearer admin-token',
    });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.orders).toHaveLength(1);
    expect(data.orders[0].id).toBe('order-B1');
  });
});
