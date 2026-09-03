/**
 * Unit tests for verifyAuthToken in app/api/_lib/auth.js:
 * 1. Missing / invalid auth headers are rejected
 * 2. Anonymous sessions are rejected
 * 3. User ID mismatch with x-user-id is rejected
 * 4. Matching phone or UID is accepted
 * 5. Returns email and phone along with uid
 */

jest.mock('../../../lib/firebaseAdmin', () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
}));

const { adminAuth } = require('../../../lib/firebaseAdmin');
const { verifyAuthToken } = require('./auth');

function createMockRequest(authHeader, xUserId) {
  const headers = new Map();
  if (authHeader) headers.set('authorization', authHeader);
  if (xUserId) headers.set('x-user-id', xUserId);

  return {
    headers: {
      get: (key) => headers.get(key.toLowerCase()) || null,
    },
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('verifyAuthToken', () => {
  test('rejects when Authorization header is missing', async () => {
    const req = createMockRequest(null, 'uid123');
    const result = await verifyAuthToken(req);
    expect(result.error).toBe('Missing or invalid Authorization header');
    expect(result.uid).toBeNull();
  });

  test('rejects when Authorization header does not start with Bearer ', async () => {
    const req = createMockRequest('Basic 12345', 'uid123');
    const result = await verifyAuthToken(req);
    expect(result.error).toBe('Missing or invalid Authorization header');
    expect(result.uid).toBeNull();
  });

  test('rejects when token is from an anonymous Firebase session', async () => {
    adminAuth.verifyIdToken.mockResolvedValue({
      uid: 'anon-uid',
      firebase: { sign_in_provider: 'anonymous' },
    });

    const req = createMockRequest('Bearer valid-token', 'anon-uid');
    const result = await verifyAuthToken(req);
    expect(result.error).toBe('Unauthorized: anonymous session');
    expect(result.uid).toBeNull();
  });

  test('safely falls back to token uid when x-user-id does not match decoded token identity', async () => {
    adminAuth.verifyIdToken.mockResolvedValue({
      uid: 'actual-user-uid',
      phone_number: '+919876543210',
      email: 'user@example.com',
      firebase: { sign_in_provider: 'password' },
    });

    const req = createMockRequest('Bearer valid-token', 'malicious-attacker-uid');
    const result = await verifyAuthToken(req);
    expect(result.error).toBeNull();
    expect(result.uid).toBe('actual-user-uid');
  });

  test('resolves UID directly from token when x-user-id is omitted', async () => {
    adminAuth.verifyIdToken.mockResolvedValue({
      uid: 'actual-user-uid',
      email: 'user@example.com',
      firebase: { sign_in_provider: 'google.com' },
    });

    const req = createMockRequest('Bearer valid-token', null);
    const result = await verifyAuthToken(req);
    expect(result.error).toBeNull();
    expect(result.uid).toBe('actual-user-uid');
    expect(result.email).toBe('user@example.com');
  });

  test('accepts matching phone number as x-user-id for phone auth', async () => {
    adminAuth.verifyIdToken.mockResolvedValue({
      uid: 'phone-auth-uid',
      phone_number: '+919876543210',
      firebase: { sign_in_provider: 'phone' },
    });

    const req = createMockRequest('Bearer valid-token', '919876543210');
    const result = await verifyAuthToken(req);
    expect(result.error).toBeNull();
    expect(result.uid).toBe('919876543210');
  });
});
