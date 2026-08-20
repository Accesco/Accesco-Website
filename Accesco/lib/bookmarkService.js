import { db } from './firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';

const COLLECTION = 'userBookmarks';

/**
 * Get user's bookmarked blog IDs
 * @param {string} userIdOrEmail - User's UID or email address
 * @returns {Promise<string[]>} Array of bookmarked blog IDs
 */
export async function getUserBookmarks(userIdOrEmail) {
  if (!userIdOrEmail) return [];
  
  try {
    const key = String(userIdOrEmail).toLowerCase();
    const q = query(
      collection(db, COLLECTION),
      where('userKey', '==', key)
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
 * @param {string} userIdOrEmail - User's UID or email address
 * @param {string} blogId - Blog post ID to bookmark
 * @returns {Promise<void>}
 */
export async function addBookmark(userIdOrEmail, blogId) {
  if (!userIdOrEmail || !blogId) {
    throw new Error('User identifier and blog ID are required');
  }

  try {
    const key = String(userIdOrEmail).toLowerCase();
    const docId = `${key}_${blogId}`;
    await setDoc(doc(db, COLLECTION, docId), {
      userKey: key,
      userEmail: key.includes('@') ? key : null,
      userId: !key.includes('@') ? key : null,
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
 * @param {string} userIdOrEmail - User's UID or email address
 * @param {string} blogId - Blog post ID to unbookmark
 * @returns {Promise<void>}
 */
export async function removeBookmark(userIdOrEmail, blogId) {
  if (!userIdOrEmail || !blogId) {
    throw new Error('User identifier and blog ID are required');
  }

  try {
    const key = String(userIdOrEmail).toLowerCase();
    const docId = `${key}_${blogId}`;
    await deleteDoc(doc(db, COLLECTION, docId));
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
}

/**
 * Check if a blog is bookmarked
 * @param {string} userIdOrEmail - User's UID or email address
 * @param {string} blogId - Blog post ID
 * @returns {Promise<boolean>}
 */
export async function isBookmarked(userIdOrEmail, blogId) {
  if (!userIdOrEmail || !blogId) return false;

  try {
    const bookmarks = await getUserBookmarks(userIdOrEmail);
    return bookmarks.includes(blogId);
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return false;
  }
}
