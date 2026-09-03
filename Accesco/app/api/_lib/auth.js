import { adminAuth } from '../../../lib/firebaseAdmin';

export async function verifyAuthToken(request) {
  const authHeader = request.headers.get('authorization');
  const requestedUid = request.headers.get('x-user-id');

  if (!authHeader?.startsWith('Bearer ')) {
    return { uid: null, email: null, phone: null, allowedUids: [], decoded: null, error: 'Missing or invalid Authorization header' };
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    const decoded = await adminAuth.verifyIdToken(token);

    // Anonymous sessions exist only to hold a pre-signup referral visit (see
    // lib/referralService.js). They are not accounts and must never satisfy
    // an authenticated API call.
    if (decoded.firebase?.sign_in_provider === 'anonymous') {
      return { uid: null, email: null, phone: null, allowedUids: [], decoded: null, error: 'Unauthorized: anonymous session' };
    }

    // Verify that the requested UID matches the token's UID or phone number.
    // Phone-only accounts may be keyed on full E.164 digits or on the bare 10
    // typed at signup (pre-normalization), so both forms are accepted.
    const tokenUid = decoded.uid;
    const tokenPhone = decoded.phone_number ? decoded.phone_number.replace(/[^\d]/g, '') : null;
    const tokenPhoneLocal = tokenPhone && tokenPhone.length > 10 ? tokenPhone.slice(-10) : null;
    const tokenEmail = decoded.email || null;

    const allowedUids = [tokenUid, tokenPhone, tokenPhoneLocal].filter(Boolean);

    // If requestedUid doesn't match the token's direct claims (e.g. Google-auth user
    // sending custom profile phone number as x-user-id), safely fallback to the verified tokenUid.
    let resolvedUid = requestedUid || tokenUid;
    if (requestedUid && !allowedUids.includes(requestedUid)) {
      resolvedUid = tokenUid;
    }

    return { uid: resolvedUid, email: tokenEmail, phone: tokenPhone, allowedUids, decoded, error: null };
  } catch (err) {
    console.error('Token verification error:', err);
    return { uid: null, email: null, phone: null, allowedUids: [], decoded: null, error: 'Invalid or expired token' };
  }
}
