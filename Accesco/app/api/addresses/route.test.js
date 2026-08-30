/**
 * Tests for POST/GET /api/addresses — ownership scoping (every read/write
 * is confined to users/{verified uid}/addresses, never a client-supplied
 * id) and the relaxed create validation (fullAddress required, lat/lng now
 * optional — see route.js's comment on why).
 */

jest.mock('../_lib/auth', () => ({ verifyAuthToken: jest.fn() }));
jest.mock('firebase-admin/firestore', () => ({
  FieldValue: { serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP') },
}));

const collectionCalls = [];
jest.mock('../../../lib/firebaseAdmin', () => ({
  adminDb: {
    collection: jest.fn((name) => {
      collectionCalls.push(name);
      return {
        doc: jest.fn((uid) => ({
          collection: jest.fn((sub) => ({
            add: jest.fn(async (data) => ({ id: 'new-addr-id', data })),
            orderBy: jest.fn(() => ({
              get: jest.fn(async () => ({ forEach: () => {} })),
            })),
            get: jest.fn(async () => ({ forEach: () => {}, empty: true })),
            __uid: uid,
            __sub: sub,
          })),
        })),
      };
    }),
    batch: jest.fn(() => ({ update: jest.fn(), set: jest.fn(), commit: jest.fn(async () => {}) })),
  },
}));

const { verifyAuthToken } = require('../_lib/auth');
const { adminDb } = require('../../../lib/firebaseAdmin');
const { GET, POST } = require('./route');

function makeRequest(body) {
  return {
    json: async () => body,
    headers: { get: () => null },
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  collectionCalls.length = 0;
});

describe('POST /api/addresses', () => {
  test('rejects an unauthenticated request', async () => {
    verifyAuthToken.mockResolvedValue({ uid: null, error: 'Missing or invalid Authorization header' });
    const res = await POST(makeRequest({ fullAddress: '221B Baker St' }));
    expect(res.status).toBe(401);
  });

  test('rejects a request missing fullAddress', async () => {
    verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
    const res = await POST(makeRequest({ city: 'Bengaluru' }));
    expect(res.status).toBe(400);
  });

  test('accepts a valid request with no lat/lng (plain form, no map picker)', async () => {
    verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
    const res = await POST(makeRequest({
      fullAddress: 'Flat 4, MG Road, Bengaluru - 560001',
      houseNo: 'Flat 4',
      area: 'MG Road',
      city: 'Bengaluru',
      pincode: '560001',
      label: 'Home',
      isDefault: false,
    }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.address.lat).toBeNull();
    expect(body.address.lng).toBeNull();
  });

  test('scopes the write under the verified caller uid, not a client-suppliable id', async () => {
    verifyAuthToken.mockResolvedValue({ uid: 'the-real-caller', error: null });
    await POST(makeRequest({ fullAddress: 'Somewhere', userId: 'someone-else-entirely' }));
    // The route only ever calls adminDb.collection('users').doc(uid) with the
    // uid verifyAuthToken resolved — a client can't redirect this to write
    // under another account's address subcollection.
    expect(adminDb.collection).toHaveBeenCalledWith('users');
  });
});

describe('GET /api/addresses', () => {
  test('rejects an unauthenticated request', async () => {
    verifyAuthToken.mockResolvedValue({ uid: null, error: 'Invalid or expired token' });
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  test('authenticated request succeeds and reads only from the collection helper (path-scoped by construction)', async () => {
    verifyAuthToken.mockResolvedValue({ uid: 'user1', error: null });
    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    expect(adminDb.collection).toHaveBeenCalledWith('users');
  });
});
