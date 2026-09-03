import { db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Normalizes user ID key for Firestore document reference.
 * @param {Object|string} user - Firebase User object or user ID string
 * @returns {string|null}
 */
export function getUserId(user) {
  if (!user) return null;
  if (typeof user === 'string') return user;
  return user.uid || (user.phone ? user.phone.replace(/[^\d]/g, '') : null);
}

/**
 * Reads user profile and subcollections from Firestore.
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export async function getUserProfileData(userId) {
  if (!userId) return null;

  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    const data = snap.exists() ? snap.data() : {};

    // Fetch transactions from subcollection
    let transactions = [];
    try {
      const txQuery = query(
        collection(db, 'users', userId, 'transactions'),
        orderBy('createdAt', 'desc')
      );
      const txSnap = await getDocs(txQuery);
      transactions = txSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (txErr) {
      console.warn('Could not load transactions subcollection:', txErr);
    }

    return {
      walletBalance: typeof data.walletBalance === 'number' ? data.walletBalance : 0,
      redeemedCoupons: Array.isArray(data.redeemedCoupons) ? data.redeemedCoupons : [],
      hasFreeDelivery: Boolean(data.hasFreeDelivery),
      savedAddresses: Array.isArray(data.savedAddresses) ? data.savedAddresses : [],
      upiList: Array.isArray(data.upiList) ? data.upiList : [],
      savedCards: Array.isArray(data.savedCards) ? data.savedCards : [],
      bookmarks: Array.isArray(data.bookmarks) ? data.bookmarks : [],
      subscriptions: Array.isArray(data.subscriptions) ? data.subscriptions : [],
      notificationSettings: data.notificationSettings || null,
      language: data.language || 'English',
      currency: data.currency || 'INR (₹)',
      userVouchers: Array.isArray(data.userVouchers) ? data.userVouchers : [],
      discounts: data.discounts || {},
      transactions,
    };
  } catch (error) {
    console.error('Error fetching user profile data from Firebase:', error);
    return null;
  }
}

/**
 * Updates wallet balance and logs transaction to Firestore subcollection.
 * @param {string} userId
 * @param {number} newBalance
 * @param {Object} transaction
 * @returns {Promise<boolean>}
 */
export async function updateWalletBalanceInFirebase(userId, newBalance, transaction) {
  if (!userId) return false;

  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { walletBalance: newBalance, updatedAt: serverTimestamp() }, { merge: true });

    if (transaction) {
      const txRef = doc(collection(db, 'users', userId, 'transactions'));
      await setDoc(txRef, {
        ...transaction,
        id: transaction.id || txRef.id,
        userId,
        balanceAfter: newBalance,
        createdAt: new Date().toISOString(),
      });
    }

    return true;
  } catch (error) {
    console.error('Error updating wallet balance in Firebase:', error);
    return false;
  }
}

/**
 * Update arbitrary profile fields in Firestore (addresses, cards, settings, etc.)
 * @param {string} userId
 * @param {Object} fieldsToUpdate
 * @returns {Promise<boolean>}
 */
export async function updateUserFieldsInFirebase(userId, fieldsToUpdate) {
  if (!userId) return false;

  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        ...fieldsToUpdate,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Error updating user fields in Firebase:', error);
    return false;
  }
}

/**
 * Executes promo/coupon redemption in Firestore.
 * Handles FREEDEL, SWADISHT50, ACCESCO20, and generic wallet credits.
 * @param {string} userId
 * @param {string} rawCode
 * @param {number} currentBalance
 * @param {Array} currentRedeemed
 * @returns {Promise<Object>} Result object with success/error status and updated data
 */
export async function redeemCouponInFirebase(userId, rawCode, currentBalance = 0, currentRedeemed = []) {
  if (!userId) return { success: false, error: 'User is not logged in' };
  const targetCode = rawCode.trim().toUpperCase();

  if (currentRedeemed.includes(targetCode)) {
    return { success: false, error: `❌ Coupon code '${targetCode}' has already been redeemed!` };
  }

  const validCodes = ['ACCESCO20', 'SWADISHT50', 'FREEDEL', 'WELCOME50', 'CASHBACK50', 'WALLET50'];
  if (!validCodes.includes(targetCode)) {
    return { success: false, error: `❌ Invalid or expired coupon code '${targetCode}'.` };
  }

  const updatedRedeemed = [...currentRedeemed, targetCode];
  const dateStr = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const userDocRef = doc(db, 'users', userId);

  if (targetCode === 'FREEDEL') {
    // FREEDEL MUST NOT ADD CASH TO WALLET, ONLY ACTIVATE FREE DELIVERY PASS
    const newTx = {
      id: `tx_${Date.now()}`,
      userId,
      title: 'Free Delivery Pass Activated (FREEDEL)',
      code: 'FREEDEL',
      type: 'perk',
      benefitType: 'free_delivery',
      walletCredit: 0,
      discountAmount: 0,
      amount: 'Free Delivery Pass',
      balanceAfter: currentBalance,
      createdAt: new Date().toISOString(),
      date: dateStr,
    };

    await setDoc(
      userDocRef,
      {
        redeemedCoupons: updatedRedeemed,
        hasFreeDelivery: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    const txRef = doc(collection(db, 'users', userId, 'transactions'));
    await setDoc(txRef, newTx);

    return {
      success: true,
      message: `🚚 Coupon code 'FREEDEL' successfully applied! Free Delivery Pass activated across all services.`,
      hasFreeDelivery: true,
      newBalance: currentBalance,
      newRedeemed: updatedRedeemed,
      newTx,
    };
  } else if (targetCode === 'SWADISHT50') {
    const newTx = {
      id: `tx_${Date.now()}`,
      userId,
      title: 'Coupon Redeemed (SWADISHT50)',
      code: 'SWADISHT50',
      type: 'discount',
      benefitType: 'food_discount',
      discountAmount: 50,
      walletCredit: 0,
      amount: 'Food Delivery Discount: ₹50',
      balanceAfter: currentBalance,
      createdAt: new Date().toISOString(),
      date: dateStr,
    };

    await setDoc(
      userDocRef,
      {
        redeemedCoupons: updatedRedeemed,
        'discounts.swadisht': 50,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    const txRef = doc(collection(db, 'users', userId, 'transactions'));
    await setDoc(txRef, newTx);

    return {
      success: true,
      message: `🎉 Coupon code 'SWADISHT50' successfully applied! ₹50 food delivery discount is now active for your Swadishtt orders.`,
      newBalance: currentBalance,
      newRedeemed: updatedRedeemed,
      swadishtDiscount: 50,
      newTx,
    };
  } else if (targetCode === 'ACCESCO20') {
    const newTx = {
      id: `tx_${Date.now()}`,
      userId,
      title: 'Coupon Redeemed (ACCESCO20)',
      code: 'ACCESCO20',
      type: 'discount',
      benefitType: 'grocery_discount',
      discountAmount: '20%',
      walletCredit: 0,
      amount: 'Grocery Discount: 20%',
      balanceAfter: currentBalance,
      createdAt: new Date().toISOString(),
      date: dateStr,
    };

    await setDoc(
      userDocRef,
      {
        redeemedCoupons: updatedRedeemed,
        'discounts.grokly': '20%',
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    const txRef = doc(collection(db, 'users', userId, 'transactions'));
    await setDoc(txRef, newTx);

    return {
      success: true,
      message: `🎉 Coupon code 'ACCESCO20' successfully applied! 20% grocery discount activated for Grokly orders.`,
      newBalance: currentBalance,
      newRedeemed: updatedRedeemed,
      groklyDiscount: '20%',
      newTx,
    };
  } else {
    // Wallet credit coupons (WELCOME50, CASHBACK50, WALLET50)
    const reward = 50;
    const newBal = currentBalance + reward;

    const newTx = {
      id: `tx_${Date.now()}`,
      userId,
      title: `Coupon Redeemed (${targetCode})`,
      code: targetCode,
      type: 'credit',
      benefitType: 'wallet_credit',
      walletCredit: reward,
      discountAmount: 0,
      amount: reward,
      balanceAfter: newBal,
      createdAt: new Date().toISOString(),
      date: dateStr,
    };

    await setDoc(
      userDocRef,
      {
        redeemedCoupons: updatedRedeemed,
        walletBalance: newBal,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    const txRef = doc(collection(db, 'users', userId, 'transactions'));
    await setDoc(txRef, newTx);

    return {
      success: true,
      message: `🎉 Coupon code '${targetCode}' successfully applied! ₹${reward} added to your wallet balance. New Balance: ₹${newBal}.`,
      newBalance: newBal,
      newRedeemed: updatedRedeemed,
      newTx,
    };
  }
}

/**
 * Safe, one-time migration of legacy localStorage data into Firebase for an authenticated user.
 * Firebase data takes precedence; localStorage is read, written to Firestore if absent, verified, and then removed.
 * @param {string} userId
 */
export async function migrateLocalStorageToFirebase(userId) {
  if (!userId || typeof window === 'undefined') return;

  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    const firebaseData = snap.exists() ? snap.data() : {};

    const userKey = userId;
    const updates = {};
    const keysToRemove = [];

    // 1. Wallet Balance Migration
    const localBalStr = localStorage.getItem(`accesco_wallet_balance_${userKey}`) || localStorage.getItem('grokly_wallet_balance');
    if (localBalStr !== null && typeof firebaseData.walletBalance !== 'number') {
      const parsedBal = parseFloat(localBalStr);
      if (!isNaN(parsedBal)) {
        updates.walletBalance = parsedBal;
      }
    }
    keysToRemove.push(`accesco_wallet_balance_${userKey}`, 'grokly_wallet_balance');

    // 2. Free Delivery Pass Migration
    const localFreeDel = localStorage.getItem(`accesco_free_delivery_${userKey}`) || localStorage.getItem('grokly_free_delivery') || localStorage.getItem('swadishtt_free_delivery');
    if (localFreeDel === 'true' && firebaseData.hasFreeDelivery === undefined) {
      updates.hasFreeDelivery = true;
    }
    keysToRemove.push(`accesco_free_delivery_${userKey}`, 'grokly_free_delivery', 'swadishtt_free_delivery');

    // 3. Redeemed Coupons Migration
    const localRedeemed = localStorage.getItem(`accesco_redeemed_coupons_${userKey}`);
    if (localRedeemed && (!Array.isArray(firebaseData.redeemedCoupons) || firebaseData.redeemedCoupons.length === 0)) {
      try {
        const parsedRedeemed = JSON.parse(localRedeemed);
        if (Array.isArray(parsedRedeemed)) {
          updates.redeemedCoupons = parsedRedeemed;
        }
      } catch (e) {}
    }
    keysToRemove.push(`accesco_redeemed_coupons_${userKey}`);

    // 4. Saved Addresses
    const localAddresses = localStorage.getItem(`accesco_saved_addresses_${userKey}`) || localStorage.getItem('accesco_saved_addresses');
    if (localAddresses && (!Array.isArray(firebaseData.savedAddresses) || firebaseData.savedAddresses.length === 0)) {
      try {
        const parsed = JSON.parse(localAddresses);
        if (Array.isArray(parsed)) updates.savedAddresses = parsed;
      } catch (e) {}
    }
    keysToRemove.push(`accesco_saved_addresses_${userKey}`, 'accesco_saved_addresses');

    // 5. Saved UPI & Cards
    const localUpi = localStorage.getItem(`accesco_upi_list_${userKey}`);
    if (localUpi && (!Array.isArray(firebaseData.upiList) || firebaseData.upiList.length === 0)) {
      try {
        const parsed = JSON.parse(localUpi);
        if (Array.isArray(parsed)) updates.upiList = parsed;
      } catch (e) {}
    }
    keysToRemove.push(`accesco_upi_list_${userKey}`);

    const localCards = localStorage.getItem(`accesco_saved_cards_${userKey}`);
    if (localCards && (!Array.isArray(firebaseData.savedCards) || firebaseData.savedCards.length === 0)) {
      try {
        const parsed = JSON.parse(localCards);
        if (Array.isArray(parsed)) updates.savedCards = parsed;
      } catch (e) {}
    }
    keysToRemove.push(`accesco_saved_cards_${userKey}`);

    // 6. User Vouchers
    const localVouchers = localStorage.getItem(`accesco_user_vouchers`) || localStorage.getItem(`instastyle_vouchers`);
    if (localVouchers && (!Array.isArray(firebaseData.userVouchers) || firebaseData.userVouchers.length === 0)) {
      try {
        const parsed = JSON.parse(localVouchers);
        if (Array.isArray(parsed)) updates.userVouchers = parsed;
      } catch (e) {}
    }
    keysToRemove.push(`accesco_user_vouchers`, `instastyle_vouchers`);

    // 7. Transactions Migration
    const localTxStr = localStorage.getItem(`accesco_wallet_transactions_${userKey}`);
    if (localTxStr) {
      try {
        const parsedTx = JSON.parse(localTxStr);
        if (Array.isArray(parsedTx) && parsedTx.length > 0) {
          const txCol = collection(db, 'users', userId, 'transactions');
          const txSnap = await getDocs(txCol);
          if (txSnap.empty) {
            for (const tx of parsedTx) {
              const txRef = doc(txCol);
              await setDoc(txRef, {
                ...tx,
                id: tx.id || txRef.id,
                userId,
                createdAt: tx.createdAt || new Date().toISOString(),
              });
            }
          }
        }
      } catch (e) {}
    }
    keysToRemove.push(`accesco_wallet_transactions_${userKey}`);

    // 8. Location Migration
    const localLocation = localStorage.getItem('userLocation');
    if (localLocation && !firebaseData.selectedLocation) {
      try {
        const parsedLoc = JSON.parse(localLocation);
        if (parsedLoc) updates.selectedLocation = parsedLoc;
      } catch (e) {
        updates.selectedLocation = { displayAddress: localLocation, fullAddress: localLocation };
      }
    }
    keysToRemove.push('userLocation');

    // 9. Grokly Baskets Migration
    const localBaskets = localStorage.getItem('grokly_baskets');
    if (localBaskets && (!Array.isArray(firebaseData.savedBaskets) || firebaseData.savedBaskets.length === 0)) {
      try {
        const parsed = JSON.parse(localBaskets);
        if (Array.isArray(parsed)) updates.savedBaskets = parsed;
      } catch (e) {}
    }
    keysToRemove.push('grokly_baskets');

    // 10. Additional legacy keys to purge upon verification
    keysToRemove.push(
      `accesco_swadisht_discount_${userKey}`,
      `swadishtt_coupon_50`,
      `accesco_grokly_discount_${userKey}`,
      `accesco_waitlist_registered`,
      `accesco_user`,
      `grokly_cart`,
      `grokly_orders`,
      `agriConnectCart`,
      `grokly_device_id`,
      `swadishtt_device_id`,
      `instastyle_device_id`,
      `instastyle_cart`,
      `instastyle_wishlist`,
      `instastyle_orders`,
      `instastyle_inventory`,
      `swadishtt-orders`,
      `sw_issue_reports`,
      `sw_container_returns`,
      `instastyle_custom_products`,
      `instastyle_circular_credits`,
      `instastyle_activity_log`,
      `instastyle_profile`,
      `grokly_wishlist`,
      `grokly_recycled_bags_count`,
      `grokly_eco_history`,
      `swadishtt-health-profile`,
      `swadishtt-health-mode`,
      `userLocation`,
      `SAVED_ADDRESSES_KEY`,
      `accesso_cookie_consent`,
      `accesco_cookie_consent`
    );

    // Perform Firestore update if there's legacy data to migrate
    if (Object.keys(updates).length > 0) {
      await setDoc(userDocRef, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
    }

    // Verify Firestore snapshot before purging localStorage keys
    const verifySnap = await getDoc(userDocRef);
    if (verifySnap.exists()) {
      keysToRemove.forEach((key) => {
        try {
          localStorage.removeItem(key);
        } catch (e) {}
      });
    }
  } catch (err) {
    console.error('Error migrating localStorage to Firebase:', err);
  }
}

/**
 * Safely purges any legacy application-owned keys from localStorage.
 * Third-party SDK keys (e.g. Razorpay 'rzp_*', reCAPTCHA '_grecaptcha', Firebase internal) are strictly preserved.
 */
export function purgeLegacyLocalStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return;

  const preservedPrefixes = ['rzp_', '_grecaptcha', 'firebase:'];
  const preservedExact = ['_grecaptcha', 'rzp_checkout_anon_id', 'rzp_device_id'];

  const isPreserved = (key) => {
    if (preservedExact.includes(key)) return true;
    return preservedPrefixes.some((prefix) => key.startsWith(prefix));
  };

  const knownLegacyKeys = [
    'accesco_cookie_consent',
    'accesso_cookie_consent',
    'swadishtt_device_id',
    'grokly_device_id',
    'instastyle_device_id',
    'swadishtt-orders',
    'grokly_orders',
    'instastyle_orders',
    'grokly_cart',
    'instastyle_cart',
    'agriConnectCart',
    'userLocation',
    'accesco_user',
    'accesco_waitlist_registered',
    'sw_issue_reports',
    'sw_container_returns',
    'swadishtt-health-profile',
    'swadishtt-health-mode',
    'instastyle_custom_products',
    'instastyle_circular_credits',
    'instastyle_activity_log',
    'instastyle_profile',
    'instastyle_wishlist',
    'grokly_wishlist',
    'grokly_baskets',
    'grokly_recycled_bags_count',
    'grokly_eco_history',
    'grokly_wallet_balance',
    'grokly_free_delivery',
    'swadishtt_free_delivery',
    'swadishtt_coupon_50',
    'accesco_user_vouchers',
    'instastyle_vouchers',
    'accesco_saved_addresses',
    'SAVED_ADDRESSES_KEY',
  ];

  try {
    // 1. Remove known legacy keys
    knownLegacyKeys.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch (e) {}
    });

    // 2. Scan and remove any remaining app-prefixed keys while leaving third-party intact
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) allKeys.push(key);
    }

    allKeys.forEach((key) => {
      if (isPreserved(key)) return;
      if (
        key.startsWith('accesco_') ||
        key.startsWith('accesso_') ||
        key.startsWith('swadishtt') ||
        key.startsWith('sw_') ||
        key.startsWith('grokly_') ||
        key.startsWith('instastyle_')
      ) {
        try {
          localStorage.removeItem(key);
        } catch (e) {}
      }
    });
  } catch (e) {
    console.warn('Error purging legacy localStorage:', e);
  }
}
