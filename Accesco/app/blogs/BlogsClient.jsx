'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './blogs.css';
import { addBookmark, removeBookmark, getUserBookmarks } from '../../lib/bookmarkService';
import AccescoHeader from '../../components/AccescoHeader';
import Footer from '../../components/Footer';
import { useAuth } from '../components/AuthProvider';

export default function BlogsClient({ initialPosts }) {
  const { user, uid } = useAuth();
  const [posts, setPosts] = useState(initialPosts);
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    loadBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, uid]);

  async function loadBookmarks() {
    if (user || uid) {
      try {
        const bookmarks = await getUserBookmarks();
        setBookmarkedPosts(bookmarks);
      } catch (err) {
        console.error('Failed to load bookmarks:', err);
      }
    } else {
      setBookmarkedPosts([]);
    }
  }

  // ── Category filter ──────────────────────────────────────────────────────────
  const filterArchive = (category) => {
    setActiveCategory(category);
    setSearchQuery('');
    if (category === 'All') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.category?.toLowerCase() === category.toLowerCase() ||
          (category === 'Innovation' && post.category === 'Technology')
      );
      setFilteredPosts(filtered);
    }
  };

  // ── Search filter ────────────────────────────────────────────────────────────
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      filterArchive(activeCategory);
      return;
    }
    const searchLower = query.toLowerCase();
    const filtered = posts.filter(
      (post) =>
        post.title?.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower) ||
        post.author?.toLowerCase().includes(searchLower)
    );
    setFilteredPosts(filtered);
  };

  // ── Share Functions ──────────────────────────────────────────────────────────
  const handleShare = async (platform, post) => {
    const url = typeof window !== 'undefined' ? window.location.origin + '/blogs' : '';
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
        alert('Failed to copy link');
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
        // Fallback to copy
        handleShare('copy', post);
      }
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  // ── Bookmark Functions ───────────────────────────────────────────────────────
  const toggleBookmark = async (postId) => {
    if (!user && !uid) {
      alert('Please sign in to bookmark articles.');
      return;
    }

    try {
      const isCurrentlyBookmarked = bookmarkedPosts.includes(postId);

      if (isCurrentlyBookmarked) {
        await removeBookmark(postId);
        setBookmarkedPosts(prev => prev.filter(id => id !== postId));
      } else {
        await addBookmark(postId);
        setBookmarkedPosts(prev => [...prev, postId]);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      alert('Failed to update bookmark. Please try again.');
    }
  };

  const isBookmarked = (postId) => bookmarkedPosts.includes(postId);

  return (
    <>
      {/* Common Website Header */}
      <AccescoHeader />

      <section className="blog-inspo-hero">
        <div className="blog-hero-center">
          <h1>blog.</h1>

    <div className="hero-categories">
      {[
        { label: 'All Stories', value: 'All' },
        { label: 'Business', value: 'Business' },
        { label: 'Innovation', value: 'Innovation' },
        { label: 'Lifestyle', value: 'Lifestyle' },
      ].map(({ label, value }) => (
        <button
          key={value}
          type="button"
          className={
            activeCategory === value ||
            (value === 'Innovation' && activeCategory === 'Technology')
              ? 'active'
              : ''
          }
          onClick={() => filterArchive(value)}
        >
          {label}
        </button>
      ))}
    </div>
  </div>

  <div className="blog-hero-bottom-row">
    <p>
      Ideas for smarter living — guides, product news and the thinking behind
      India's intelligent commerce ecosystem.
    </p>

   <div className="hero-search">
  <input
    type="text"
    placeholder="Search articles..."
    value={searchQuery}
    onChange={(e) => handleSearch(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        document
          .getElementById("storyContainer")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }}
  />

  <button
    onClick={() =>
      document
        .getElementById("storyContainer")
        ?.scrollIntoView({ behavior: "smooth" })
    }
  >
    Search
  </button>
</div>
  </div>
</section>

      {/* Blog Navigation Bar */}
      <div className="blog-nav-wrapper">
        <div className="blog-nav-container">
          <nav className="blog-nav">
            <ul className="blog-nav-links">
              <li className={activeCategory === 'All' ? 'active' : ''} onClick={() => filterArchive('All')}>All Stories</li>
              <li className={activeCategory === 'Business' ? 'active' : ''} onClick={() => filterArchive('Business')}>Business</li>
              <li className={activeCategory === 'Innovation' || activeCategory === 'Technology' ? 'active' : ''} onClick={() => filterArchive('Innovation')}>Innovation</li>
              <li className={activeCategory === 'Lifestyle' ? 'active' : ''} onClick={() => filterArchive('Lifestyle')}>Lifestyle</li>
            </ul>
            <div className="blog-nav-actions">
              <div className="search-box">
                <i className="ri-search-line"></i>
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Archive */}
      <main className="content-archive">
        <div className="archive-header">
          <div>
            <h2 id="activeCategory">{searchQuery ? 'Search Results' : activeCategory === 'All' ? 'Latest Stories' : activeCategory}</h2>
            <p className="archive-subtitle">
              {searchQuery ? `Found ${filteredPosts.length} results for "${searchQuery}"` : 'Discover insights and stories from our community'}
            </p>
          </div>
          <span className="count">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'Story' : 'Stories'}
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <i className="ri-file-search-line"></i>
            <h3>No stories found</h3>
            <p>Try adjusting your search or browse all stories</p>
            <button className="btn-pill" onClick={() => { setSearchQuery(''); filterArchive('All'); }}>
              View All Stories
            </button>
          </div>
        ) : (
          <div id="storyContainer" className="story-grid">
            {filteredPosts.map((post, index) => (
              <article key={post.id} className="story-card" style={{ animationDelay: `${index * 0.05}s` }}>
                <Link href={`/blogs/${post.id}`} className="story-visual">

<Image
  src={
    post.title?.includes('What a City Actually Demands of You')
      ? '/images/blogs/what-a-city-actually-demands.jpg'
    : post.title?.includes('Dark Stores')
      ? '/images/blogs/dark-stores.jpg'
    : post.title?.includes('Sunday Meal Prep')
      ? '/images/blogs/meal-prep.jpg'
    : post.title?.includes('All-in-One Smart Lifestyle Ecosystem')
      ? '/images/blogs/accesco-ecosystem.jpg'
    : post.title?.includes('Best Grocery Delivery Service')
      ? '/images/blogs/grocery-delivery.jpg'
    : post.title?.includes('Accesco Living Launches Public Beta')
      ? '/images/blogs/launch-date.png'
    : post.image || '/images/download (2).png'
  }
  alt={post.title}
  fill
  style={{ objectFit: 'cover' }}
  unoptimized
/>
                  <div className="story-overlay">
                    <span className="read-time"><i className="ri-time-line"></i> 5 min read</span>
                  </div>
                </Link>
                <Link href={`/blogs/${post.id}`} className="story-content">
                  <div className="story-meta">
                    <span className="story-date">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3 className="story-headline">
                    {post.title}
                  </h3>
                  <p className="story-summary">{post.excerpt}</p>
                  <div className="story-footer">
                    <span className="story-author">
                      <i className="ri-user-line"></i>
                      {post.author || 'ACCESCO Editorial'}
                    </span>
                    <span className="read-more">
                      Read more <i className="ri-arrow-right-line"></i>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <div className="mobile-bottom-nav">
        <div className={`mobile-nav-item ${activeCategory === 'All' ? 'active' : ''}`} onClick={() => filterArchive('All')}>
          <i className="ri-home-4-line"></i><span>Home</span>
        </div>
        <div className={`mobile-nav-item ${activeCategory === 'Business' ? 'active' : ''}`} onClick={() => filterArchive('Business')}>
          <i className="ri-briefcase-line"></i><span>Biz</span>
        </div>
        <div className={`mobile-nav-item ${activeCategory === 'Innovation' ? 'active' : ''}`} onClick={() => filterArchive('Innovation')}>
          <i className="ri-cpu-line"></i><span>Tech</span>
        </div>
      </div>

      {/* Common Website Footer */}
      <Footer />
    </>
  );
}
