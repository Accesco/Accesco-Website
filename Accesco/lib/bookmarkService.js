import { auth, db } from './firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';

const COLLECTION = 'userBookmarks';

/**
 * Helper to obtain the authenticated, non-anonymous Firebase user UID
 * @returns {string|null}
 */
function getAuthenticatedUid() {
  const currentUser = auth?.currentUser;
  if (!currentUser || currentUser.isAnonymous) {
    return null;
  }
  return currentUser.uid;
}

/**
 * Get user's bookmarked blog IDs
 * Derives user identity from the authenticated Firebase Auth session to prevent IDOR.
 * @param {string} [_userIdOrEmail] - Optional legacy parameter; verified against auth session
 * @returns {Promise<string[]>} Array of bookmarked blog IDs
 */
export async function getUserBookmarks(_userIdOrEmail) {
  const uid = getAuthenticatedUid();
  if (!uid) return [];
  
  try {
    const q = query(
      collection(db, COLLECTION),
      where('userId', '==', uid)
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(d => d.data().blogId);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
}

/**
 * Add a bookmark
 * Derives user identity from the authenticated Firebase Auth session.
 * @param {string} [_userIdOrEmail] - Optional legacy identifier
 * @param {string} blogId - Blog post ID to bookmark
 * @returns {Promise<void>}
 */
export async function addBookmark(_userIdOrEmail, blogId) {
  const currentUser = auth?.currentUser;
  const uid = getAuthenticatedUid();
  
  if (!uid || !currentUser) {
    throw new Error('User must be authenticated with a non-anonymous account to add bookmarks');
  }
  
  // Handle case where caller passes (blogId) directly
  const actualBlogId = typeof _userIdOrEmail === 'string' && !blogId ? _userIdOrEmail : blogId;
  if (!actualBlogId) {
    throw new Error('Blog ID is required');
  }

  try {
    const docId = `${uid}_${actualBlogId}`;
    await setDoc(doc(db, COLLECTION, docId), {
      userId: uid,
      userEmail: currentUser.email || null,
      blogId: actualBlogId,
      bookmarkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
}

/**
 * Remove a bookmark
 * Derives user identity from the authenticated Firebase Auth session.
 * @param {string} [_userIdOrEmail] - Optional legacy identifier
 * @param {string} blogId - Blog post ID to unbookmark
 * @returns {Promise<void>}
 */
export async function removeBookmark(_userIdOrEmail, blogId) {
  const uid = getAuthenticatedUid();
  if (!uid) {
    throw new Error('User must be authenticated with a non-anonymous account to remove bookmarks');
  }

  const actualBlogId = typeof _userIdOrEmail === 'string' && !blogId ? _userIdOrEmail : blogId;
  if (!actualBlogId) {
    throw new Error('Blog ID is required');
  }

  try {
    const docId = `${uid}_${actualBlogId}`;
    await deleteDoc(doc(db, COLLECTION, docId));
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
}

/**
 * Check if a blog is bookmarked
 * @param {string} [_userIdOrEmail] - Optional legacy identifier
 * @param {string} blogId - Blog post ID
 * @returns {Promise<boolean>}
 */
export async function isBookmarked(_userIdOrEmail, blogId) {
  const actualBlogId = typeof _userIdOrEmail === 'string' && !blogId ? _userIdOrEmail : blogId;
  if (!actualBlogId) return false;

  try {
    const bookmarks = await getUserBookmarks();
    return bookmarks.includes(actualBlogId);
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return false;
  }
}

