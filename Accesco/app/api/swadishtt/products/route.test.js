/**
 * Tests for GET/POST /api/swadishtt/products — public read (with isActive
 * filtering) and admin-gated create with required-field validation.
 */

jest.mock('../../_lib/authz', () => ({ requireAdmin: jest.fn() }));
jest.mock('@/lib/firebase', () => ({ db: {} }));

let seededDocs = [];
jest.mock('firebase/firestore', () => ({
  collection: jest.fn((db, name) => ({ __col: name })),
  where: jest.fn((field, op, value) => ({ field, op, value })),
  limit: jest.fn((n) => ({ __limit: n })),
  query: jest.fn((colRef, ...clauses) => ({ __col: colRef.__col, clauses })),
  getDocs: jest.fn(async (q) => {
    const whereClauses = q.clauses.filter((c) => c.field);
    const matches = seededDocs.filter((d) =>
      whereClauses.every((c) => d.data[c.field] === c.value)
    );
    return {
      forEach: (fn) => matches.forEach((d) => fn({ id: d.id, data: () => d.data })),
    };
  }),
  addDoc: jest.fn(async (colRef, data) => {
    const id = `doc-${seededDocs.length + 1}`;
    seededDocs.push({ id, data });
    return { id };
  }),
}));

const { requireAdmin } = require('../../_lib/authz');
const { GET, POST } = require('./route');

function makeGetRequest(qs = '') {
  return { url: `http://localhost/api/swadishtt/products${qs}` };
}
function makePostRequest(body) {
  return { json: async () => body };
}

beforeEach(() => {
  jest.clearAllMocks();
  seededDocs = [];
});

describe('GET /api/swadishtt/products', () => {
  test('returns active products', async () => {
    seededDocs = [
      { id: '1', data: { name: 'Dish A', restaurantId: 'r1', isActive: true } },
      { id: '2', data: { name: 'Dish B', restaurantId: 'r1', isActive: false } },
    ];
    const res = await GET(makeGetRequest());
    const body = await res.json();
    expect(body.products).toHaveLength(1);
    expect(body.products[0].name).toBe('Dish A');
  });

  test('filters by restaurantId', async () => {
    seededDocs = [
      { id: '1', data: { name: 'Dish A', restaurantId: 'r1', isActive: true } },
      { id: '2', data: { name: 'Dish C', restaurantId: 'r2', isActive: true } },
    ];
    const res = await GET(makeGetRequest('?restaurantId=r2'));
    const body = await res.json();
    expect(body.products).toHaveLength(1);
    expect(body.products[0].name).toBe('Dish C');
  });
});

describe('POST /api/swadishtt/products', () => {
  test('rejects a non-admin caller', async () => {
    requireAdmin.mockResolvedValue({ error: 'Forbidden: admin role required', status: 403 });
    const res = await POST(makePostRequest({ name: 'X', price: 10, restaurantId: 'r1' }));
    expect(res.status).toBe(403);
  });

  test('rejects missing required fields', async () => {
    requireAdmin.mockResolvedValue({ error: null, status: 200, uid: 'admin1' });
    const res = await POST(makePostRequest({ name: 'X' }));
    expect(res.status).toBe(400);
  });

  test('creates a product as an admin', async () => {
    requireAdmin.mockResolvedValue({ error: null, status: 200, uid: 'admin1' });
    const res = await POST(makePostRequest({ name: 'Palak Paneer', price: 260, restaurantId: 'r1' }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.product.name).toBe('Palak Paneer');
    expect(body.product.ventureId).toBe('swadishtt');
    expect(seededDocs).toHaveLength(1);
  });
});
