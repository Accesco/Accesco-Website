/**
 * Unit tests for bookmarkService to verify:
 * 1. Anonymous sessions cannot read/write/delete bookmarks
 * 2. Unauthenticated calls are rejected
 * 3. User UID is derived from auth session (IDOR prevention)
 */

jest.mock('./firebase', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn((_db, _col, id) => ({ id, path: `${_col}/${id}` })),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

const { auth } = require('./firebase');
const { setDoc, deleteDoc, getDocs } = require('firebase/firestore');
const { getUserBookmarks, addBookmark, removeBookmark, isBookmarked } = require('./bookmarkService');

beforeEach(() => {
  jest.clearAllMocks();
  auth.currentUser = null;
});

describe('bookmarkService authorization & IDOR safety', () => {
  test('getUserBookmarks returns empty array when unauthenticated', async () => {
    auth.currentUser = null;
    const result = await getUserBookmarks('attacker-supplied-user-id');
    expect(result).toEqual([]);
    expect(getDocs).not.toHaveBeenCalled();
  });

  test('getUserBookmarks returns empty array for anonymous session', async () => {
    auth.currentUser = { uid: 'anon-123', isAnonymous: true };
    const result = await getUserBookmarks('victim-user-id');
    expect(result).toEqual([]);
    expect(getDocs).not.toHaveBeenCalled();
  });

  test('getUserBookmarks queries only the authenticated user UID regardless of argument', async () => {
    auth.currentUser = { uid: 'auth-user-456', isAnonymous: false, email: 'user@accesco.in' };
    getDocs.mockResolvedValue({
      docs: [
        { data: () => ({ blogId: 'blog-post-1' }) },
        { data: () => ({ blogId: 'blog-post-2' }) },
      ],
    });

    const result = await getUserBookmarks('malicious-target-uid');
    expect(result).toEqual(['blog-post-1', 'blog-post-2']);
    const { where } = require('firebase/firestore');
    expect(where).toHaveBeenCalledWith('userId', '==', 'auth-user-456');
  });

  test('addBookmark throws error when user is unauthenticated', async () => {
    auth.currentUser = null;
    await expect(addBookmark('user1', 'blog1')).rejects.toThrow(
      'User must be authenticated with a non-anonymous account'
    );
    expect(setDoc).not.toHaveBeenCalled();
  });

  test('addBookmark throws error when session is anonymous', async () => {
    auth.currentUser = { uid: 'anon-123', isAnonymous: true };
    await expect(addBookmark('user1', 'blog1')).rejects.toThrow(
      'User must be authenticated with a non-anonymous account'
    );
    expect(setDoc).not.toHaveBeenCalled();
  });

  test('addBookmark stores document using authenticated UID instead of client parameter', async () => {
    auth.currentUser = { uid: 'auth-user-789', isAnonymous: false, email: 'real@accesco.in' };
    await addBookmark('attacker-tried-to-impersonate-victim', 'blog-post-100');

    expect(setDoc).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'auth-user-789_blog-post-100' }),
      expect.objectContaining({
        userId: 'auth-user-789',
        userEmail: 'real@accesco.in',
        blogId: 'blog-post-100',
      })
    );
  });

  test('removeBookmark throws error for anonymous session', async () => {
    auth.currentUser = { uid: 'anon-123', isAnonymous: true };
    await expect(removeBookmark('user1', 'blog1')).rejects.toThrow(
      'User must be authenticated with a non-anonymous account'
    );
    expect(deleteDoc).not.toHaveBeenCalled();
  });

  test('removeBookmark deletes document keyed by authenticated UID', async () => {
    auth.currentUser = { uid: 'auth-user-789', isAnonymous: false };
    await removeBookmark('victim-uid', 'blog-post-100');

    expect(deleteDoc).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'auth-user-789_blog-post-100' })
    );
  });

  test('isBookmarked returns true when blog is in user bookmarks and false otherwise', async () => {
    auth.currentUser = { uid: 'auth-user-789', isAnonymous: false };
    getDocs.mockResolvedValue({
      docs: [{ data: () => ({ blogId: 'blog-post-100' }) }],
    });

    await expect(isBookmarked('auth-user-789', 'blog-post-100')).resolves.toBe(true);
    await expect(isBookmarked('auth-user-789', 'blog-post-999')).resolves.toBe(false);
  });
});
