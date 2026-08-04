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
    console.error('Usage: FIREBASE_ID_TOKEN=... USER_ID=... node scripts/test-profile-api.mjs');
    process.exit(1);
  }

  console.log('--- RUNNING PROFILE API TESTS ---');

  // 1. Unauthorized Request
  console.log('\n1. Testing Unauthorized Request...');
  const resUnauth = await makeRequest('profile', 'GET', null, userId);
  console.log('Expected: 401. Got:', resUnauth.status);

  // 2. Missing User ID Request
  console.log('\n2. Testing Missing User ID Request...');
  const resNoUser = await makeRequest('profile', 'GET', token, null);
  console.log('Expected: 401. Got:', resNoUser.status);

  // 3. Get Profile
  console.log('\n3. Testing Get Profile...');
  const resGet = await makeRequest('profile', 'GET', token, userId);
  console.log('Get Response:', resGet.status, resGet.data);

  // 4. Update Profile — invalid (missing name)
  console.log('\n4. Testing Update Profile with missing name (expect 400)...');
  const resInvalid = await makeRequest('profile', 'PUT', token, userId, {
    name: '',
    phone: '9000000000',
    email: 'sample@gmail.com',
  });
  console.log('Expected: 400. Got:', resInvalid.status, resInvalid.data);

  // 5. Update Profile — valid
  console.log('\n5. Testing Update Profile (valid)...');
  const resUpdate = await makeRequest('profile', 'PUT', token, userId, {
    name: 'Test User',
    phone: '9000000000',
    email: 'testuser@example.com',
  });
  console.log('Update Response:', resUpdate.status, resUpdate.data);

  // 6. Update Delivery Address — invalid pincode
  console.log('\n6. Testing Update Address with invalid pincode (expect 400)...');
  const resAddrInvalid = await makeRequest('profile/address', 'PUT', token, userId, {
    address: '221B Baker Street',
    city: 'Bengaluru',
    pincode: '123',
  });
  console.log('Expected: 400. Got:', resAddrInvalid.status, resAddrInvalid.data);

  // 7. Update Delivery Address — valid
  console.log('\n7. Testing Update Address (valid)...');
  const resAddr = await makeRequest('profile/address', 'PUT', token, userId, {
    address: '221B Baker Street, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
  });
  console.log('Address Response:', resAddr.status, resAddr.data);

  // 8. Upload Profile Image (requires a sample.jpg next to this script)
  console.log('\n8. Testing Upload Profile Image...');
  const samplePath = new URL('./sample.jpg', import.meta.url);
  if (fs.existsSync(samplePath)) {
    const fileBuffer = fs.readFileSync(samplePath);
    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer], { type: 'image/jpeg' }), 'sample.jpg');

    const res = await fetch('http://localhost:3000/api/profile/image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-user-id': userId,
      },
      body: formData,
    });
    const data = await res.json().catch(() => null);
    console.log('Upload Response:', res.status, data);
  } else {
    console.log('Skipped — place a sample.jpg next to this script to test uploads.');
  }

  // 9. Delete Profile Image
  console.log('\n9. Testing Delete Profile Image...');
  const resDeleteImage = await makeRequest('profile/image', 'DELETE', token, userId);
  console.log('Delete Image Response:', resDeleteImage.status, resDeleteImage.data);

  console.log('\n--- TESTS COMPLETE ---');
}

runTests();
