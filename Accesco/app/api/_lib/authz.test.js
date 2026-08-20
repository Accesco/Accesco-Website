/**
 * Unit tests for the authorization helpers built on top of verifyAuthToken
 * (see authz.js's header comment). verifyAuthToken and adminDb are mocked
 * so these tests exercise only authz.js's own role-resolution/gating logic,
 * not Firebase itself.
 */

jest.mock('./auth', () => ({
  verifyAuthToken: jest.fn(),
}));

jest.mock('../../../lib/firebaseAdmin', () => ({
  adminDb: {
    collection: jest.fn(),
  },
}));

const { verifyAuthToken } = require('./auth');
const { adminDb } = require('../../../lib/firebaseAdmin');
const { getUserRole, requireAdmin, requireOwnerOrAdmin } = require('./authz');

// Builds a fake Firestore doc().get() chain returning the given role (or a
// missing doc when role is undefined).
function mockUserDoc(role) {
  const get = jest.fn().mockResolvedValue(
    role === undefined
      ? { exists: false }
      : { exists: true, data: () => ({ role }) }
  );
  adminDb.collection.mockReturnValue({ doc: () => ({ get }) });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getUserRole', () => {
  test('defaults to "user" when the doc is missing', async () => {
    mockUserDoc(undefined);
    await expect(getUserRole('uid1')).resolves.toBe('user');
  });

  test('defaults to "user" when the role field is missing', async () => {
    mockUserDoc(null);
    await expect(getUserRole('uid1')).resolves.toBe('user');
  });

  test('defaults to "user" for any non-admin role value (fails closed)', async () => {
    mockUserDoc('superuser');
    await expect(getUserRole('uid1')).resolves.toBe('user');
  });

  test('resolves "admin" only for an exact admin role', async () => {
    mockUserDoc('admin');
    await expect(getUserRole('uid1')).resolves.toBe('admin');
  });

  test('fails closed to "user" if Firestore throws', async () => {
    adminDb.collection.mockReturnValue({
      doc: () => ({ get: jest.fn().mockRejectedValue(new Error('boom')) }),
    });
    await expect(getUserRole('uid1')).resolves.toBe('user');
  });
});

describe('requireAdmin', () => {
  test('rejects with 401 on a missing/invalid token', async () => {
    verifyAuthToken.mockResolvedValue({ uid: null, error: 'Missing or invalid Authorization header' });
    const result = await requireAdmin({});
    expect(result).toEqual({ uid: null, role: null, error: expect.any(String), status: 401 });
  });

  test('rejects with 403 for a valid token with no role field', async () => {
    verifyAuthToken.mockResolvedValue({ uid: 'uid1', error: null });
    mockUserDoc(undefined);
    const result = await requireAdmin({});
    expect(result.status).toBe(403);
    expect(result.uid).toBe('uid1');
  });

  test('rejects with 403 for a valid token with role "user"', async () => {
    verifyAuthToken.mockResolvedValue({ uid: 'uid1', error: null });
    mockUserDoc('user');
    const result = await requireAdmin({});
    expect(result.status).toBe(403);
  });

  test('succeeds for a valid token with role "admin"', async () => {
    verifyAuthToken.mockResolvedValue({ uid: 'admin-uid', error: null });
    mockUserDoc('admin');
    const result = await requireAdmin({});
    expect(result).toEqual({ uid: 'admin-uid', role: 'admin', error: null, status: 200 });
  });
});

describe('requireOwnerOrAdmin', () => {
  test('rejects with 401 on a missing/invalid token', async () => {
    verifyAuthToken.mockResolvedValue({ uid: null, error: 'Invalid or expired token' });
    const result = await requireOwnerOrAdmin({}, 'owner-uid');
    expect(result.status).toBe(401);
  });

  test('succeeds when the caller is the resource owner, without a role lookup', async () => {
    verifyAuthToken.mockResolvedValue({ uid: 'owner-uid', error: null });
    const result = await requireOwnerOrAdmin({}, 'owner-uid');
    expect(result).toEqual({ uid: 'owner-uid', role: 'user', error: null, status: 200 });
    expect(adminDb.collection).not.toHaveBeenCalled();
  });

  test('succeeds when the caller is not the owner but is admin', async () => {
    verifyAuthToken.mockResolvedValue({ uid: 'admin-uid', error: null });
    mockUserDoc('admin');
    const result = await requireOwnerOrAdmin({}, 'owner-uid');
    expect(result).toEqual({ uid: 'admin-uid', role: 'admin', error: null, status: 200 });
  });

  test('rejects with 403 when the caller is neither the owner nor admin', async () => {
    verifyAuthToken.mockResolvedValue({ uid: 'someone-else', error: null });
    mockUserDoc('user');
    const result = await requireOwnerOrAdmin({}, 'owner-uid');
    expect(result.status).toBe(403);
  });
});
