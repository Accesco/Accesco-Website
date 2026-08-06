// Integration test script for the InstaStyle cart API.
// Follows the same pattern as scripts/test-address-api.mjs / test-profile-api.mjs:
// hits a running `npm run dev` server with a real Firebase ID token.
//
// Usage:
//   FIREBASE_ID_TOKEN=... USER_ID=... PRODUCT_ID=<instastyle_products id> [PRODUCT_SIZE=M] \
//     node scripts/test-cart-api.mjs

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
  const productId = process.env.PRODUCT_ID;
  const size = process.env.PRODUCT_SIZE || null;

  if (!token || !userId) {
    console.error('Please provide FIREBASE_ID_TOKEN and USER_ID environment variables.');
    console.error('Usage: FIREBASE_ID_TOKEN=... USER_ID=... PRODUCT_ID=... [PRODUCT_SIZE=...] node scripts/test-cart-api.mjs');
    process.exit(1);
  }

  console.log('--- RUNNING INSTASTYLE CART API TESTS ---');

  console.log('\n1. Testing Unauthorized Request (no token)...');
  const resUnauth = await makeRequest('instastyle/cart', 'GET', null, userId);
  console.log('Expected: 401. Got:', resUnauth.status);

  console.log('\n2. Testing Missing User ID Request...');
  const resNoUser = await makeRequest('instastyle/cart', 'GET', token, null);
  console.log('Expected: 401. Got:', resNoUser.status);

  console.log('\n3. Clearing cart to start from a known state...');
  const resClearInitial = await makeRequest('instastyle/cart', 'DELETE', token, userId);
  console.log('Clear Response:', resClearInitial.status, resClearInitial.data);

  console.log('\n4. Testing Get Empty Cart...');
  const resEmpty = await makeRequest('instastyle/cart', 'GET', token, userId);
  console.log(
    'Expected: 200, 0 items. Got:', resEmpty.status,
    'items:', resEmpty.data?.items?.length,
    'summary:', resEmpty.data?.summary
  );

  if (!productId) {
    console.warn('\nPRODUCT_ID not provided — skipping add/update/remove/stock tests.');
    console.warn('Re-run with PRODUCT_ID=<an instastyle_products id> [PRODUCT_SIZE=<size>] to cover them.');
    console.log('\n--- TESTS COMPLETE (partial) ---');
    return;
  }

  console.log('\n5. Testing Add With Invalid Product...');
  const resInvalidProduct = await makeRequest('instastyle/cart/items', 'POST', token, userId, {
    productId: 'does-not-exist-xyz',
    size,
    quantity: 1,
  });
  console.log('Expected: 404. Got:', resInvalidProduct.status, resInvalidProduct.data);

  console.log('\n6. Testing Add With Invalid Quantity...');
  const resInvalidQty = await makeRequest('instastyle/cart/items', 'POST', token, userId, {
    productId,
    size,
    quantity: 0,
  });
  console.log('Expected: 400. Got:', resInvalidQty.status, resInvalidQty.data);

  console.log('\n7. Testing Add Item...');
  const resAdd = await makeRequest('instastyle/cart/items', 'POST', token, userId, {
    productId,
    size,
    quantity: 1,
  });
  console.log('Add Response:', resAdd.status, resAdd.data);
  const itemId = resAdd.data?.item?.itemId;

  if (!itemId) {
    console.error('Failed to add item. Cannot continue remaining tests.');
    process.exit(1);
  }

  console.log('\n8. Testing Duplicate Add (should increment quantity, not add a row)...');
  const resDup = await makeRequest('instastyle/cart/items', 'POST', token, userId, {
    productId,
    size,
    quantity: 2,
  });
  console.log(
    'Expected same itemId', itemId, 'and quantity 3. Got itemId:',
    resDup.data?.item?.itemId, 'quantity:', resDup.data?.item?.quantity
  );

  console.log('\n9. Testing List Cart After Duplicate Add (expect exactly 1 row)...');
  const resList = await makeRequest('instastyle/cart', 'GET', token, userId);
  console.log('Row count:', resList.data?.items?.length, 'Summary:', resList.data?.summary);

  console.log('\n10. Testing Update Quantity...');
  const resUpdate = await makeRequest(`instastyle/cart/items/${itemId}`, 'PATCH', token, userId, { quantity: 5 });
  console.log('Update Response:', resUpdate.status, resUpdate.data);

  console.log('\n11. Testing Update With Invalid Quantity...');
  const resUpdateInvalid = await makeRequest(`instastyle/cart/items/${itemId}`, 'PATCH', token, userId, { quantity: -1 });
  console.log('Expected: 400. Got:', resUpdateInvalid.status, resUpdateInvalid.data);

  console.log('\n12. Testing Update Non-Existent Item...');
  const resUpdateMissing = await makeRequest('instastyle/cart/items/does-not-exist', 'PATCH', token, userId, { quantity: 1 });
  console.log('Expected: 404. Got:', resUpdateMissing.status, resUpdateMissing.data);

  console.log('\n13. Testing Stock Validation (huge quantity)...');
  const resStock = await makeRequest(`instastyle/cart/items/${itemId}`, 'PATCH', token, userId, { quantity: 999999 });
  console.log('Expected: 409 if this size tracks stock, 200 if untracked. Got:', resStock.status, resStock.data);

  console.log('\n14. Testing Remove Item...');
  const resRemove = await makeRequest(`instastyle/cart/items/${itemId}`, 'DELETE', token, userId);
  console.log('Remove Response:', resRemove.status, resRemove.data);

  console.log('\n15. Testing Remove Already-Removed Item...');
  const resRemoveAgain = await makeRequest(`instastyle/cart/items/${itemId}`, 'DELETE', token, userId);
  console.log('Expected: 404. Got:', resRemoveAgain.status, resRemoveAgain.data);

  console.log('\n16. Re-adding an item, then testing Clear Cart...');
  await makeRequest('instastyle/cart/items', 'POST', token, userId, { productId, size, quantity: 1 });
  const resClear = await makeRequest('instastyle/cart', 'DELETE', token, userId);
  console.log('Clear Response:', resClear.status, resClear.data);

  const resFinal = await makeRequest('instastyle/cart', 'GET', token, userId);
  console.log('Final cart size (expect 0):', resFinal.data?.items?.length);

  console.log('\n--- TESTS COMPLETE ---');
}

runTests();
