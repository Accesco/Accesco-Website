import { db } from './firebase';
import { collection, query, where, getDocs, setDoc, doc, orderBy, limit } from 'firebase/firestore';

const COLLECTION = 'referralProfiles';

/**
 * Generates a random alphanumeric referral code (e.g. ACC8X2A)
 */
function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ACC';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Initializes a referral profile for a newly signed up waitlist user
 * @param {string} email 
 * @param {string} name 
 * @param {string} referredByCode 
 * @returns {Promise<string>} The generated referral code
 */
export async function initializeReferralProfile(email, name, referredByCode = null) {
  try {
    const emailLowerCase = email.trim().toLowerCase();
    
    // Check if profile exists already to prevent duplicates
    const q = query(collection(db, COLLECTION), where('email', '==', emailLowerCase));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return snapshot.docs[0].data().referralCode;
    }

    const newCode = generateReferralCode();
    
    // Create new referral profile
    await setDoc(doc(db, COLLECTION, emailLowerCase), {
      email: emailLowerCase,
      name: name?.trim() || '',
      referralCode: newCode,
      referredBy: referredByCode || null,
      referralCount: 0,
      coins: 0,
      createdAt: new Date().toISOString()
    });

    // If referred by someone, trigger the attribution API securely
    if (referredByCode) {
      await fetch('/api/referral/attribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          refereeEmail: emailLowerCase,
          referredBy: referredByCode
        }),
      }).catch(err => console.error("Failed to attribute referral:", err));
    }

    return newCode;
  } catch (error) {
    console.error("Error initializing referral profile:", error);
    throw error;
  }
}

/**
 * Fetches the user's referral stats
 */
export async function getUserReferralStats(email) {
  if (!email) return null;
  const emailLowerCase = email.trim().toLowerCase();
  
  const q = query(collection(db, COLLECTION), where('email', '==', emailLowerCase));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    return snapshot.docs[0].data();
  }
  return null;
}

/**
 * Fetches top 10 leaderboard
 */
export async function getLeaderboard() {
  const q = query(collection(db, COLLECTION), orderBy('referralCount', 'desc'), limit(10));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    // Only return safe public info
    return {
      name: data.name || 'Anonymous',
      referralCount: data.referralCount,
      coins: data.coins
    };
  });
}
