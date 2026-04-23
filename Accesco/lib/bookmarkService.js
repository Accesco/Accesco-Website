import { db } from './firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';

const COLLECTION = 'userBookmarks';

/**
 * Get user's bookmarked blog IDs
 * @param {string} userEmail - User's email address
 * @returns {Promise<string[]>} Array of bookmarked blog IDs
 */
export async function getUserBookmarks(userEmail) {
  if (!userEmail) return [];
  
  try {
    const q = query(
      collection(db, COLLECTION),
      where('userEmail', '==', userEmail.toLowerCase())
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => doc.data().blogId);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
}

/**
 * Add a bookmark
 * @param {string} userEmail - User's email address
 * @param {string} blogId - Blog post ID to bookmark
 * @returns {Promise<void>}
 */
export async function addBookmark(userEmail, blogId) {
  if (!userEmail || !blogId) {
    throw new Error('User email and blog ID are required');
  }

  try {
    const docId = `${userEmail.toLowerCase()}_${blogId}`;
    await setDoc(doc(db, COLLECTION, docId), {
      userEmail: userEmail.toLowerCase(),
      blogId: blogId,
      bookmarkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
}

/**
 * Remove a bookmark
 * @param {string} userEmail - User's email address
 * @param {string} blogId - Blog post ID to unbookmark
 * @returns {Promise<void>}
 */
export async function removeBookmark(userEmail, blogId) {
  if (!userEmail || !blogId) {
    throw new Error('User email and blog ID are required');
  }

  try {
    const docId = `${userEmail.toLowerCase()}_${blogId}`;
    await deleteDoc(doc(db, COLLECTION, docId));
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
}

/**
 * Check if a blog is bookmarked
 * @param {string} userEmail - User's email address
 * @param {string} blogId - Blog post ID
 * @returns {Promise<boolean>}
 */
export async function isBookmarked(userEmail, blogId) {
  if (!userEmail || !blogId) return false;

  try {
    const bookmarks = await getUserBookmarks(userEmail);
    return bookmarks.includes(blogId);
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return false;
  }
}
