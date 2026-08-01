/**
 * Address Service - Client side API wrapper for Address Management
 */

export async function fetchSavedAddresses(getIdToken, userId) {
  const token = await getIdToken();
  if (!token || !userId) return { addresses: [], error: 'Not authenticated' };

  try {
    const response = await fetch('/api/addresses', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-user-id': userId
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch addresses');
    }

    const data = await response.json();
    return { addresses: data.addresses, error: null };
  } catch (error) {
    console.error('fetchSavedAddresses error:', error);
    return { addresses: [], error: error.message };
  }
}

export async function createAddress(getIdToken, userId, addressData) {
  const token = await getIdToken();
  if (!token || !userId) throw new Error('Not authenticated');

  const response = await fetch('/api/addresses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId
    },
    body: JSON.stringify(addressData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create address');
  }

  return response.json();
}

export async function updateAddress(getIdToken, userId, addressId, addressData) {
  const token = await getIdToken();
  if (!token || !userId) throw new Error('Not authenticated');

  const response = await fetch(`/api/addresses/${addressId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId
    },
    body: JSON.stringify(addressData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update address');
  }

  return response.json();
}

export async function deleteAddress(getIdToken, userId, addressId) {
  const token = await getIdToken();
  if (!token || !userId) throw new Error('Not authenticated');

  const response = await fetch(`/api/addresses/${addressId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete address');
  }

  return response.json();
}

export async function selectAddress(getIdToken, userId, addressId) {
  const token = await getIdToken();
  if (!token || !userId) throw new Error('Not authenticated');

  const response = await fetch(`/api/addresses/${addressId}/select`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to select address');
  }

  return response.json();
}
