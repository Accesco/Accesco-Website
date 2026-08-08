/**
 * Xpense Meter Service - Client side API wrapper for budgets + spend summary
 */

export async function fetchXpenseSummary(getIdToken, userId, month) {
  const token = await getIdToken();
  if (!token || !userId) return { summary: null, error: 'Not authenticated' };

  try {
    const qs = month ? `?month=${encodeURIComponent(month)}` : '';
    const response = await fetch(`/api/xpense-meter/summary${qs}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-user-id': userId,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch Xpense Meter summary');
    }

    return { summary: data, error: null };
  } catch (error) {
    console.error('fetchXpenseSummary error:', error);
    return { summary: null, error: error.message };
  }
}

export async function saveXpenseBudget(getIdToken, userId, { month, totalBudget, budgets }) {
  const token = await getIdToken();
  if (!token || !userId) throw new Error('Not authenticated');

  const response = await fetch('/api/xpense-meter/budget', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-user-id': userId,
    },
    body: JSON.stringify({ month, totalBudget, budgets }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to save budget');
  }

  return data;
}
