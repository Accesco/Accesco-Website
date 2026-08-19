/**
 * Tests for POST/GET /api/feedback — score range validation, previously-
 * dropped field persistence, and the new admin-only reporting GET.
 */

jest.mock('@/lib/firebase', () => ({ db: {} }));
jest.mock('../_lib/authz', () => ({ requireAdmin: jest.fn() }));

let saved = [];
jest.mock('firebase/firestore', () => ({
  collection: jest.fn((db, name) => ({ __col: name })),
  addDoc: jest.fn(async (colRef, data) => {
    const id = `doc-${saved.length + 1}`;
    saved.push({ id, data });
    return { id };
  }),
  getDocs: jest.fn(async () => ({
    forEach: (fn) => saved.forEach((d) => fn({ id: d.id, data: () => d.data })),
  })),
  query: jest.fn((colRef) => colRef),
  orderBy: jest.fn(),
  limit: jest.fn(),
  serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP'),
}));

const { requireAdmin } = require('../_lib/authz');
const { POST, GET } = require('./route');

function makeRequest(body) {
  return { json: async () => body };
}

beforeEach(() => {
  jest.clearAllMocks();
  saved = [];
});

describe('POST /api/feedback', () => {
  test.each([-1, 11, 5.5, 'not a number', null, undefined])('rejects an invalid score: %p', async (score) => {
    const res = await POST(makeRequest({ score, review: 'ok' }));
    expect(res.status).toBe(400);
    expect(saved).toHaveLength(0);
  });

  test.each([0, 5, 10])('accepts a valid score: %p', async (score) => {
    const res = await POST(makeRequest({ score, review: 'ok' }));
    expect(res.status).toBe(200);
  });

  test('persists usageLikelihood and earlyAccess (previously silently dropped)', async () => {
    await POST(makeRequest({
      score: 9,
      review: 'Great!',
      usageLikelihood: 'Very Likely',
      earlyAccess: 'Yes',
    }));
    expect(saved[0].data.usageLikelihood).toBe('Very Likely');
    expect(saved[0].data.earlyAccess).toBe('Yes');
  });

  test('truncates review to 300 chars', async () => {
    await POST(makeRequest({ score: 8, review: 'x'.repeat(500) }));
    expect(saved[0].data.review).toHaveLength(300);
  });
});

describe('GET /api/feedback', () => {
  test('rejects a non-admin caller', async () => {
    requireAdmin.mockResolvedValue({ error: 'Forbidden: admin role required', status: 403 });
    const res = await GET({});
    expect(res.status).toBe(403);
  });

  test('returns submissions for an admin caller', async () => {
    saved = [{ id: '1', data: { score: 9, review: 'Great' } }];
    requireAdmin.mockResolvedValue({ error: null, status: 200, uid: 'admin1' });
    const res = await GET({});
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.feedback).toHaveLength(1);
  });
});
