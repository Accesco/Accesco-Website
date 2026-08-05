/**
 * Profile Service - Client side API wrapper for Profile Management
 */

export async function fetchProfile(getIdToken, userId) {
  const token = await getIdToken();
  if (!token || !userId) return { profile: null, error: 'Not authenticated' };

  try {
    const response = await fetch('/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-user-id': userId
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch profile');
    }

    const data = await response.json();
    return { profile: data.profile, error: null };
  } catch (error) {
    console.error('fetchProfile error:', error);
    return { profile: null, error: error.message };
  }
}

export async function updateProfile(getIdToken, userId, profileData) {
  const token = await getIdToken();
  if (!token || !userId) throw new Error('Not authenticated');

  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId
    },
    body: JSON.stringify(profileData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update profile');
  }

  return response.json();
}

export async function updateDeliveryAddress(getIdToken, userId, addressData) {
  const token = await getIdToken();
  if (!token || !userId) throw new Error('Not authenticated');

  const response = await fetch('/api/profile/address', {
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
    throw new Error(errorData.error || 'Failed to update delivery address');
  }

  return response.json();
}

export async function uploadProfileImage(getIdToken, userId, file) {
  const token = await getIdToken();
  if (!token || !userId) throw new Error('Not authenticated');

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/profile/image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upload profile image');
  }

  return response.json();
}

export async function deleteProfileImage(getIdToken, userId) {
  const token = await getIdToken();
  if (!token || !userId) throw new Error('Not authenticated');

  const response = await fetch('/api/profile/image', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete profile image');
  }

  return response.json();
}
