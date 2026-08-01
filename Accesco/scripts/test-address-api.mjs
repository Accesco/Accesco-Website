import fs from 'fs';

// Helper to make API requests
async function makeRequest(url, method, token, userId, body) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (userId) headers['x-user-id'] = userId;
  if (body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`http://localhost:3000/api/${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

async function runTests() {
  const token = process.env.FIREBASE_ID_TOKEN;
  const userId = process.env.USER_ID;

  if (!token || !userId) {
    console.error('Please provide FIREBASE_ID_TOKEN and USER_ID environment variables.');
    console.error('Usage: FIREBASE_ID_TOKEN=... USER_ID=... node scripts/test-address-api.mjs');
    process.exit(1);
  }

  console.log('--- RUNNING ADDRESS API TESTS ---');

  // 1. Unauthorized Request
  console.log('\\n1. Testing Unauthorized Request...');
  const resUnauth = await makeRequest('addresses', 'GET', null, userId);
  console.log('Expected: 401. Got:', resUnauth.status);

  // 2. Missing User ID Request
  console.log('\\n2. Testing Missing User ID Request...');
  const resNoUser = await makeRequest('addresses', 'GET', token, null);
  console.log('Expected: 401. Got:', resNoUser.status);

  // 3. Create Address
  console.log('\\n3. Testing Create Address...');
  const createPayload = {
    type: 'Home',
    displayAddress: '123 Test St',
    fullAddress: '123 Test St, Test City, 123456',
    lat: 12.123,
    lng: 77.123,
    isDefault: true
  };
  const resCreate = await makeRequest('addresses', 'POST', token, userId, createPayload);
  console.log('Create Response:', resCreate.status, resCreate.data);
  const addressId = resCreate.data?.address?.id;

  if (!addressId) {
    console.error('Failed to create address. Cannot continue tests.');
    process.exit(1);
  }

  // 4. List Addresses
  console.log('\\n4. Testing List Addresses...');
  const resList = await makeRequest('addresses', 'GET', token, userId);
  console.log('List Response:', resList.status, 'Count:', resList.data?.addresses?.length);

  // 5. Update Address
  console.log('\\n5. Testing Update Address...');
  const resUpdate = await makeRequest(`addresses/${addressId}`, 'PUT', token, userId, { type: 'Work' });
  console.log('Update Response:', resUpdate.status, resUpdate.data);

  // 6. Select Address
  console.log('\\n6. Testing Select Address...');
  const resSelect = await makeRequest(`addresses/${addressId}/select`, 'PUT', token, userId);
  console.log('Select Response:', resSelect.status, resSelect.data);

  // 7. Delete Address
  console.log('\\n7. Testing Delete Address...');
  const resDelete = await makeRequest(`addresses/${addressId}`, 'DELETE', token, userId);
  console.log('Delete Response:', resDelete.status, resDelete.data);

  console.log('\\n--- TESTS COMPLETE ---');
}

runTests();
