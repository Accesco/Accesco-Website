'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { getUserBookmarks, addBookmark, removeBookmark } from '../../../lib/bookmarkService';

function buildShareUrls(post, url) {
  const text = `Check out this article: ${post.title}`;
  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    copy: url,
  };
}

async function sharePost(post, platform) {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const shareUrls = buildShareUrls(post, url);

  if (platform === 'copy') {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  } else if (platform === 'native') {
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.excerpt, url });
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Share failed:', err);
      }
    } else {
      sharePost(post, 'copy');
    }
  } else {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  }
}

function useBookmark(post) {
  const { user } = useAuth();
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    loadBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function loadBookmarks() {
    if (user?.email) {
      try {
        setBookmarkedPosts(await getUserBookmarks(user.email));
      } catch (err) {
        console.error('Failed to load bookmarks:', err);
      }
    } else {
      const saved = localStorage.getItem('bookmarkedPosts');
      if (saved) setBookmarkedPosts(JSON.parse(saved));
    }
  }

  const toggleBookmark = async () => {
    if (user?.email) {
      try {
        const isCurrentlyBookmarked = bookmarkedPosts.includes(post.id);
        if (isCurrentlyBookmarked) {
          await removeBookmark(user.email, post.id);
          setBookmarkedPosts((prev) => prev.filter((id) => id !== post.id));
        } else {
          await addBookmark(user.email, post.id);
          setBookmarkedPosts((prev) => [...prev, post.id]);
        }
      } catch (error) {
        console.error('Bookmark error:', error);
      }
    } else {
      setBookmarkedPosts((prev) => {
        const newBookmarks = prev.includes(post.id)
          ? prev.filter((id) => id !== post.id)
          : [...prev, post.id];
        localStorage.setItem('bookmarkedPosts', JSON.stringify(newBookmarks));
        return newBookmarks;
      });
    }
  };

  return { isBookmarked: bookmarkedPosts.includes(post.id), toggleBookmark };
}

export function HeaderActions({ post }) {
  const { isBookmarked, toggleBookmark } = useBookmark(post);

  return (
    <div className="post-actions">
      <button className="action-btn" title="Share" onClick={() => sharePost(post, 'native')}>
        <i className="ri-share-line"></i>
      </button>
      <button
        className={`action-btn ${isBookmarked ? 'bookmarked' : ''}`}
        title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
        onClick={toggleBookmark}
      >
        <i className={isBookmarked ? 'ri-bookmark-fill' : 'ri-bookmark-line'}></i>
      </button>
    </div>
  );
}

export function ShareRow({ post }) {
  return (
    <div className="post-share-section">
      <p>Share this story</p>
      <div className="share-buttons">
        <button className="share-btn" title="Share on X (Twitter)" onClick={() => sharePost(post, 'twitter')}>
          <i className="ri-twitter-x-line"></i>
        </button>
        <button className="share-btn" title="Share on Facebook" onClick={() => sharePost(post, 'facebook')}>
          <i className="ri-facebook-fill"></i>
        </button>
        <button className="share-btn" title="Share on LinkedIn" onClick={() => sharePost(post, 'linkedin')}>
          <i className="ri-linkedin-fill"></i>
        </button>
        <button className="share-btn" title="Copy link" onClick={() => sharePost(post, 'copy')}>
          <i className="ri-link"></i>
        </button>
      </div>
    </div>
  );
}
