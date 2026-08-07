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

    // Verify that the requested UID matches the token's UID or phone number
    const tokenUid = decoded.uid;
    const tokenPhone = decoded.phone_number ? decoded.phone_number.replace(/[^\d]/g, '') : null;
    
    if (requestedUid !== tokenUid && requestedUid !== tokenPhone) {
      return { uid: null, error: 'Unauthorized: User ID mismatch' };
    }
    
    return { uid: requestedUid, error: null };
  } catch (err) {
    console.error('Token verification error:', err);
    return { uid: null, error: 'Invalid or expired token' };
  }
}
