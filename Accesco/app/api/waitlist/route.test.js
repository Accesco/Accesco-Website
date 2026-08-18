/**
 * Tests for POST /api/waitlist — the signup write moved here from the
 * browser (see lib/waitlistService.js). Covers validation, rate limiting,
 * and the duplicate check that's now actually enforced at write time
 * instead of only gating the UI.
 */

jest.mock('@/lib/firebaseAdmin', () => ({
  adminDb: { collection: jest.fn() },
}));
jest.mock('firebase-admin/firestore', () => ({
  FieldValue: { serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP') },
}));
jest.mock('../_lib/otp-store', () => ({ checkRateLimit: jest.fn() }));

const { adminDb } = require('@/lib/firebaseAdmin');
const { checkRateLimit } = require('../_lib/otp-store');
const { POST } = require('./route');

function makeRequest(body) {
  return {
    headers: { get: () => '127.0.0.1' },
    json: async () => body,
  };
}

function mockFirestore({ existingPhoneMatch = false, existingEmailMatch = false } = {}) {
  const added = [];
  adminDb.collection.mockReturnValue({
    where: jest.fn(() => ({
      limit: jest.fn(() => ({
        get: jest.fn(async () => ({ empty: !existingPhoneMatch && !existingEmailMatch })),
      })),
    })),
    add: jest.fn(async (data) => {
      added.push(data);
      return { id: `doc-${added.length}` };
    }),
  });
  return added;
}

beforeEach(() => {
  jest.clearAllMocks();
  checkRateLimit.mockReturnValue({ allowed: true });
});

test('rejects an invalid email', async () => {
  mockFirestore();
  const res = await POST(makeRequest({ email: 'not-an-email', phone: '9876543210', name: 'Test' }));
  expect(res.status).toBe(400);
});

test('rejects an invalid phone', async () => {
  mockFirestore();
  const res = await POST(makeRequest({ email: 'a@b.com', phone: '123', name: 'Test' }));
  expect(res.status).toBe(400);
});

test('rejects when rate-limited by IP', async () => {
  mockFirestore();
  checkRateLimit.mockImplementation((key) => ({ allowed: !key.startsWith('waitlist_ip:') }));
  const res = await POST(makeRequest({ email: 'a@b.com', phone: '9876543210' }));
  expect(res.status).toBe(429);
});

test('rejects when rate-limited by email', async () => {
  mockFirestore();
  checkRateLimit.mockImplementation((key) => ({ allowed: !key.startsWith('waitlist_email:') }));
  const res = await POST(makeRequest({ email: 'a@b.com', phone: '9876543210' }));
  expect(res.status).toBe(429);
});

test('rejects a duplicate phone/email — enforced server-side, not just a UI gate', async () => {
  const added = mockFirestore({ existingPhoneMatch: true });
  const res = await POST(makeRequest({ email: 'a@b.com', phone: '9876543210' }));
  expect(res.status).toBe(409);
  expect(added).toHaveLength(0);
});

test('accepts a valid, non-duplicate signup and writes it', async () => {
  const added = mockFirestore();
  const res = await POST(makeRequest({ email: 'a@b.com', phone: '9876543210', name: 'Test User', interests: 'grokly' }));
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body.success).toBe(true);
  expect(added).toHaveLength(1);
  expect(added[0]).toMatchObject({ email: 'a@b.com', phone: '9876543210', name: 'Test User' });
});

test('normalizes email to lowercase/trimmed before storing', async () => {
  const added = mockFirestore();
  await POST(makeRequest({ email: '  Test@Example.COM ', phone: '9876543210' }));
  expect(added[0].email).toBe('test@example.com');
});
