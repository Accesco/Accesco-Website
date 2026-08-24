import { adminDb } from '../../../lib/firebaseAdmin';
import { verifyAuthToken } from './auth';

// users/{uid}.role is the sole source of truth for admin access. Missing
// field or missing doc both resolve to 'user' — fail closed, never assume
// admin. Nothing in the API surface ever lets a client set this field (see
// api/profile PUT, which only ever writes name/phone/email).
export async function getUserRole(uid) {
  try {
    const snap = await adminDb.collection('users').doc(uid).get();
    const role = snap.exists ? snap.data()?.role : null;
    return role === 'admin' ? 'admin' : 'user';
  } catch (err) {
    console.error('[authz] Failed to resolve role:', err);
    return 'user';
  }
}

// Verifies the Firebase token and requires the resolved role to be 'admin'.
// Returns { uid, role, error, status } — status is 401 for a missing/invalid
// token, 403 for a valid token that isn't admin.
export async function requireAdmin(request) {
  const { uid, error } = await verifyAuthToken(request);
  if (error) {
    return { uid: null, role: null, error, status: 401 };
  }

  const role = await getUserRole(uid);
  if (role !== 'admin') {
    return { uid, role, error: 'Forbidden: admin role required', status: 403 };
  }

  return { uid, role, error: null, status: 200 };
}

// Verifies the Firebase token and requires the caller to either own
// resourceOwnerUid or be admin. Use for endpoints returning/mutating a
// specific user's data where the owner is already known (e.g. an order
// already fetched by id).
export async function requireOwnerOrAdmin(request, resourceOwnerUid) {
  const { uid, allowedUids, error } = await verifyAuthToken(request);
  if (error) {
    return { uid: null, role: null, error, status: 401 };
  }

  if (uid === resourceOwnerUid || (Array.isArray(allowedUids) && allowedUids.includes(resourceOwnerUid))) {
    return { uid, role: 'user', error: null, status: 200 };
  }

  const role = await getUserRole(uid);
  if (role === 'admin') {
    return { uid, role: 'admin', error: null, status: 200 };
  }

  return { uid, role: null, error: 'Forbidden', status: 403 };
}
