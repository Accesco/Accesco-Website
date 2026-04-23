'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import './blog-post.css';
import { fetchBlogs } from '../../../lib/blogService';
import { getUserBookmarks, addBookmark, removeBookmark } from '../../../lib/bookmarkService';
import { useAuth } from '../../components/AuthProvider';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    loadPost();
    loadBookmarks();
  }, [params.id, user]);

  async function loadPost() {
    setLoading(true);
    try {
      const data = await fetchBlogs();
      const foundPost = data.find(p => p.id === params.id);
      setPost(foundPost);
    } catch (err) {
      console.error('Failed to load blog:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadBookmarks() {
    if (user?.email) {
      try {
        const bookmarks = await getUserBookmarks(user.email);
        setBookmarkedPosts(bookmarks);
      } catch (err) {
        console.error('Failed to load bookmarks:', err);
      }
    } else {
      const saved = localStorage.getItem('bookmarkedPosts');
      if (saved) {
        setBookmarkedPosts(JSON.parse(saved));
      }
    }
  }

  const handleShare = async (platform) => {
    if (!post) return;
    
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `Check out this article: ${post.title}`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: url
    };

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
          await navigator.share({
            title: post.title,
            text: post.excerpt,
            url: url,
          });
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error('Share failed:', err);
          }
        }
      } else {
        handleShare('copy');
      }
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const toggleBookmark = async (postId) => {
    if (user?.email) {
      try {
        const isCurrentlyBookmarked = bookmarkedPosts.includes(postId);
        
        if (isCurrentlyBookmarked) {
          await removeBookmark(user.email, postId);
          setBookmarkedPosts(prev => prev.filter(id => id !== postId));
        } else {
          await addBookmark(user.email, postId);
          setBookmarkedPosts(prev => [...prev, postId]);
        }
      } catch (error) {
        console.error('Bookmark error:', error);
      }
    } else {
      setBookmarkedPosts(prev => {
        const newBookmarks = prev.includes(postId)
          ? prev.filter(id => id !== postId)
          : [...prev, postId];
        
        localStorage.setItem('bookmarkedPosts', JSON.stringify(newBookmarks));
        return newBookmarks;
      });
    }
  };

  const isBookmarked = (postId) => bookmarkedPosts.includes(postId);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader-video-wrap">
          <video autoPlay muted loop playsInline>
            <source src="/images/loading.mp4" type="video/mp4" />
          </video>
        </div>
        <span className="loader-text">Loading Article...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="error-container">
        <h1>Article Not Found</h1>
        <p>The article you're looking for doesn't exist.</p>
        <button className="btn-pill" onClick={() => router.push('/blogs')}>
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <>
      <article className="blog-post-page">
        <div className="blog-post-container">
          {/* Header Section */}
          <header className="post-header">
            <button className="back-button" onClick={() => router.push('/blogs')}>
              <i className="ri-arrow-left-line"></i>
              <span>Back to Stories</span>
            </button>
            
            <div className="post-meta-row">
              <span className="post-category">{post.category}</span>
              <span className="post-date">
                {new Date(post.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>

            <h1 className="post-title">{post.title}</h1>

            <div className="post-author-row">
              <div className="author-info">
                <div className="author-avatar">
                  <i className="ri-user-fill"></i>
                </div>
                <div>
                  <p className="author-name">{post.author || 'ACCESCO Editorial Team'}</p>
                  <p className="author-meta">
                    5 min read • {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              
              <div className="post-actions">
                <button 
                  className="action-btn" 
                  title="Share" 
                  onClick={() => handleShare('native')}
                >
                  <i className="ri-share-line"></i>
                </button>
                <button 
                  className={`action-btn ${isBookmarked(post.id) ? 'bookmarked' : ''}`}
                  title={isBookmarked(post.id) ? 'Remove bookmark' : 'Bookmark'}
                  onClick={() => toggleBookmark(post.id)}
                >
                  <i className={isBookmarked(post.id) ? 'ri-bookmark-fill' : 'ri-bookmark-line'}></i>
                </button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="post-featured-image">
            <Image
              src={post.image || '/images/download (2).png'}
              alt={post.title}
              width={1200}
              height={675}
              unoptimized
              priority
            />
          </div>

          {/* Article Content */}
          <div className="post-content">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Footer Section */}
          <footer className="post-footer">
            <div className="post-tags">
              <span className="tag-item">{post.category}</span>
              <span className="tag-item">Featured</span>
              <span className="tag-item">Editor's Pick</span>
            </div>

            <div className="post-share-section">
              <p>Share this story</p>
              <div className="share-buttons">
                <button 
                  className="share-btn" 
                  title="Share on X (Twitter)"
                  onClick={() => handleShare('twitter')}
                >
                  <i className="ri-twitter-x-line"></i>
                </button>
                <button 
                  className="share-btn" 
                  title="Share on Facebook"
                  onClick={() => handleShare('facebook')}
                >
                  <i className="ri-facebook-fill"></i>
                </button>
                <button 
                  className="share-btn" 
                  title="Share on LinkedIn"
                  onClick={() => handleShare('linkedin')}
                >
                  <i className="ri-linkedin-fill"></i>
                </button>
                <button 
                  className="share-btn" 
                  title="Copy link"
                  onClick={() => handleShare('copy')}
                >
                  <i className="ri-link"></i>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </article>
    </>
  );
}
