/**
 * Wallet Service - Client side API wrapper for balance + redemption
 * (mirrors lib/xpenseMeterService.js's shape/conventions).
 */

export async function fetchWallet(getIdToken, userId) {
  const token = await getIdToken();
  if (!token || !userId) return { wallet: null, error: 'Not authenticated' };

  try {
    const response = await fetch('/api/wallet', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-user-id': userId,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch wallet');
    }

    return { wallet: data, error: null };
  } catch (error) {
    console.error('fetchWallet error:', error);
    return { wallet: null, error: error.message };
  }
}

export async function redeemCode(getIdToken, userId, code) {
  const token = await getIdToken();
  if (!token || !userId) throw new Error('Not authenticated');

  const response = await fetch('/api/wallet/redeem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-user-id': userId,
    },
    body: JSON.stringify({ code }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to redeem code');
  }

  return data;
}
