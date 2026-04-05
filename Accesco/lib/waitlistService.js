import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const COLLECTION = 'waitlistUsers';

/**
 * Save a waitlist signup to Firestore.
 * @param {{ name?: string; email: string; phone: string }} data
 * @returns {Promise<string>} New document id
 */
export async function addWaitlistEntry(data) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    name: data.name?.trim() || '',
    email: data.email.trim(),
    phone: data.phone.trim(),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
