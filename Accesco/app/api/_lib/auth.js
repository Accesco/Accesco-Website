import { adminAuth } from '../../../lib/firebaseAdmin';

export async function verifyAuthToken(request) {
  const authHeader = request.headers.get('authorization');
  const requestedUid = request.headers.get('x-user-id');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return { uid: null, error: 'Missing or invalid Authorization header' };
  }
  
  if (!requestedUid) {
    return { uid: null, error: 'Missing x-user-id header' };
  }
  
  try {
    const token = authHeader.split('Bearer ')[1];
    const decoded = await adminAuth.verifyIdToken(token);

    // Anonymous sessions exist only to hold a pre-signup referral visit (see
    // lib/referralService.js). They are not accounts and must never satisfy
    // an authenticated API call.
    if (decoded.firebase?.sign_in_provider === 'anonymous') {
      return { uid: null, error: 'Unauthorized: anonymous session' };
    }

    // Verify that the requested UID matches the token's UID or phone number.
    // Phone-only accounts may be keyed on full E.164 digits or on the bare 10
    // typed at signup (pre-normalization), so both forms are accepted.
    const tokenUid = decoded.uid;
    const tokenPhone = decoded.phone_number ? decoded.phone_number.replace(/[^\d]/g, '') : null;
    // Only a genuine truncation, never a duplicate of tokenPhone itself.
    const tokenPhoneLocal = tokenPhone && tokenPhone.length > 10 ? tokenPhone.slice(-10) : null;

    const allowedUids = [tokenUid, tokenPhone, tokenPhoneLocal].filter(Boolean);

    if (!allowedUids.includes(requestedUid)) {
      return { uid: null, error: 'Unauthorized: User ID mismatch' };
    }
    
    return { uid: requestedUid, error: null };
  } catch (err) {
    console.error('Token verification error:', err);
    return { uid: null, error: 'Invalid or expired token' };
  }
}
