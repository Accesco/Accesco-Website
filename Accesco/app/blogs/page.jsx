'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './blogs.css';
import { fetchBlogs, addBlog } from '../../lib/blogService';
import { addBookmark, removeBookmark, getUserBookmarks } from '../../lib/bookmarkService';
import AccescoHeader from '../../components/AccescoHeader';
import Footer from '../../components/Footer';
import { useAuth } from '../components/AuthProvider';

export default function BlogsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showWriter, setShowWriter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  // Form states — matches Firestore field structure
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('Business');
  const [postAuthor, setPostAuthor] = useState('');
  const [postImgUrl, setPostImgUrl] = useState('');
  const [postDate, setPostDate] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // ── Load blogs from Firestore on mount ──────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    setPostDate(new Date().toISOString().split('T')[0]);
    loadBlogs();
    loadBookmarks();
  }, [user]);

  async function loadBlogs() {
    setLoading(true);
    const minTimer = new Promise((resolve) => setTimeout(resolve, 2500));
    try {
      const fetchPromise = fetchBlogs();
      const [data] = await Promise.all([fetchPromise, minTimer]);
      const hiddenTitles = ['AccesGo: Moving People, Respecting Lives\n'];

const visibleBlogs = data.filter(
  (blog) => !hiddenTitles.includes(blog.title)
);

setPosts(visibleBlogs);
setFilteredPosts(visibleBlogs);
    } catch (err) {
      console.error('Failed to load blogs:', err);
      await minTimer;
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
      // Load from localStorage for non-logged-in users
      const saved = localStorage.getItem('bookmarkedPosts');
      if (saved) {
        try {
          setBookmarkedPosts(JSON.parse(saved));
        } catch (err) {
          console.error('Failed to parse bookmarks:', err);
        }
      }
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

  useEffect(() => {
    filterArchive(activeCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  // ── Modal helpers ─────────────────────────────────────────────────────────────
  const openReader = (post) => {
    router.push(`/blogs/${post.id}`);
  };

  const openWriter = () => {
    setShowWriter(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModals = () => {
    setShowWriter(false);
    document.body.style.overflow = 'auto';
    setPostTitle('');
    setPostContent('');
    setPostCategory('Business');
    setPostAuthor('');
    setPostImgUrl('');
    setPostDate(new Date().toISOString().split('T')[0]);
    setPublishing(false);
  };

  // ── Publish to Firestore ─────────────────────────────────────────────────────
  const publishPost = async () => {
    if (!postTitle.trim() || !postContent.trim()) {
      alert('Please fill in at least the Title and Content.');
      return;
    }

    setPublishing(true);
    try {
      const finalImage = postImgUrl.trim() || '/images/download (2).png';
      const finalExcerpt = postContent.trim().substring(0, 200) + '...';

      const newId = await addBlog({
        title:    postTitle.trim(),
        content:  postContent.trim(),
        category: postCategory,
        author:   postAuthor.trim() || 'ACCESCO Editorial Team',
        image:    finalImage,
        excerpt:  finalExcerpt,
        date:     postDate,
      });

      const newPost = {
        id:       newId,
        title:    postTitle.trim(),
        content:  postContent.trim(),
        category: postCategory,
        author:   postAuthor.trim() || 'ACCESCO Editorial Team',
        image:    finalImage,
        excerpt:  finalExcerpt,
        date:     postDate,
      };

      setPosts((prev) => [newPost, ...prev]);
      closeModals();
      alert('Narrative published successfully!');
    } catch (err) {
      console.error('Publish failed:', err);
      alert('Failed to publish. Check the console for details.');
    } finally {
      setPublishing(false);
    }
  };

  // ── Handle Image Upload ──────────────────────────────────────────────────────
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setPostImgUrl(data.url);
      } else {
        alert('Failed to upload image: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
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
    if (user?.email) {
      // Use Firebase for logged-in users
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
        alert('Failed to update bookmark. Please try again.');
      }
    } else {
      // Use localStorage for non-logged-in users
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

  return (
    <>
      {/* Loading Screen */}
      {loading && (
        <div id="loadingScreen" className="loading-screen">
          <div className="loader-video-wrap">
            <video autoPlay muted loop playsInline>
              <source src="/images/blog-video-animation.MP4" type="video/mp4" />
            </video>
          </div>
          <span className="loader-text">Curating Collection...</span>
        </div>
      )}

      {/* Common Website Header */}
 <section className="blog-inspo-hero">
  

  <div className="hero-header-wrap">
    <AccescoHeader />
  </div>

  <div className="blog-hero-center">
    <h1>blog.</h1>

    <div className="hero-categories">
      {['All', 'Groceries', 'Food', 'Fashion', 'Company news'].map((cat) => (
        <button key={cat}>{cat}</button>
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
              <button className="btn-pill" onClick={openWriter}>
                <i className="ri-quill-pen-fill"></i>
                <span>Write</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Archive */}
      <main className="content-archive">
        <div className="archive-header">
          <div>
            <h2 id="activeCategory">{searchQuery ? 'Search Results' : activeCategory === 'All' ? 'Latest Stories' : activeCategory}</h2>
            <p className="archive-subtitle" suppressHydrationWarning>
              {mounted
                ? (searchQuery ? `Found ${filteredPosts.length} results for "${searchQuery}"` : 'Discover insights and stories from our community')
                : 'Discover insights and stories from our community'}
            </p>
          </div>
          <span className="count" suppressHydrationWarning>
            {mounted ? `${filteredPosts.length} ${filteredPosts.length === 1 ? 'Story' : 'Stories'}` : 'Stories'}
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
                <div className="story-visual">
                 
<Image
  src={
    post.title?.includes('Dark Stores')
      ? '/images/blogs/dark-stores.jpg'
      : post.title?.includes('Sunday Meal Prep')
      ? '/images/blogs/meal-prep.jpg'
      : post.title?.includes('All-in-One Smart Lifestyle Ecosystem')
      ? '/images/blogs/accesco-ecosystem.jpg'
      : post.title?.includes('Best Grocery Delivery Service')
      ? '/images/blogs/grocery-delivery.jpg'
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
                </div>
                <div className="story-content">
                  <div className="story-meta">
                    <span className="story-date">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3 className="story-headline">{post.title}</h3>
                  <p className="story-summary">{post.excerpt}</p>
                  <div className="story-footer">
                    <span className="story-author">
                      <i className="ri-user-line"></i>
                      {post.author || 'ACCESCO Editorial'}
                    </span>
                    <span className="read-more" onClick={() => openReader(post)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openReader(post); }}>
                      Read more <i className="ri-arrow-right-line"></i>
                    </span>
                  </div>
                </div>
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
        <div className="mobile-nav-item" style={{ color: 'var(--accent)' }} onClick={openWriter}>
          <i className="ri-add-circle-fill"></i><span>Write</span>
        </div>
      </div>

      {/* ── Writer Modal ── */}
      {showWriter && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-container write-modal" onClick={(e) => e.stopPropagation()}>

            {/* Left Sidebar */}
            <div className="write-sidebar">
              <h2>Draft Narrative</h2>

              <div className="sidebar-fields">

                {/* Collection */}
                <div className="field-group">
                  <label className="form-label">Collection</label>
                  <select value={postCategory} onChange={(e) => setPostCategory(e.target.value)} className="form-select">
                    <option>Business</option>
                    <option>Innovation</option>
                    <option>Lifestyle</option>
                    <option>Finance</option>
                    <option>Design</option>
                    <option>Culture</option>
                    <option>Opinion</option>
                  </select>
                </div>

                {/* Author */}
                <div className="field-group">
                  <label className="form-label">Author Name</label>
                  <input
                    type="text"
                    value={postAuthor}
                    onChange={(e) => setPostAuthor(e.target.value)}
                    placeholder="e.g. Argha Sengupta"
                    className="form-select"
                  />
                </div>

                {/* Date */}
                <div className="field-group">
                  <label className="form-label">Publish Date</label>
                  <input
                    type="date"
                    value={postDate}
                    onChange={(e) => setPostDate(e.target.value)}
                    className="form-select"
                  />
                </div>

                {/* Image Upload */}
                <div className="field-group">
                  <label className="form-label">Cover Image</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="form-select"
                      style={{ padding: '8px' }}
                      disabled={uploadingImage}
                      id="imageUploadInput"
                    />
                    {uploadingImage && (
                      <div style={{ 
                        padding: '12px', 
                        background: 'rgba(122, 0, 66, 0.1)', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <i className="ri-loader-4-line" style={{ animation: 'spin 1s linear infinite', color: '#7A0042' }}></i>
                        <span style={{ color: '#7A0042', fontSize: '0.9rem' }}>Uploading to Cloudinary...</span>
                      </div>
                    )}
                    {postImgUrl && !uploadingImage && (
                      <div style={{ 
                        padding: '12px', 
                        background: 'rgba(16, 185, 129, 0.1)', 
                        borderRadius: '8px',
                        border: '2px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        <img
                          src={postImgUrl}
                          alt="Cover preview"
                          className="img-preview"
                          style={{ 
                            width: '100%',
                            maxHeight: '200px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            marginBottom: '8px'
                          }}
                          onError={(e) => { 
                            console.error('Image failed to load:', postImgUrl);
                            e.target.style.display = 'none'; 
                          }}
                        />
                        <p style={{ 
                          color: '#10b981', 
                          fontSize: '0.85rem',
                          margin: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <i className="ri-check-line"></i> Image uploaded successfully
                        </p>
                        <button
                          type="button"
                          onClick={() => setPostImgUrl('')}
                          style={{
                            marginTop: '8px',
                            padding: '6px 12px',
                            background: 'transparent',
                            border: '1px solid #ef4444',
                            color: '#ef4444',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <i className="ri-delete-bin-line"></i> Remove Image
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="field-hint">Upload an image (max 10MB). Auto-optimized and stored on Cloudinary CDN.</p>
                </div>

              </div>{/* end sidebar-fields */}

              {/* Buttons — always visible at bottom */}
              <div className="sidebar-actions">
                <button
                  className="btn-pill publish-btn"
                  onClick={publishPost}
                  disabled={publishing}
                >
                  {publishing ? 'Publishing...' : 'Publish Narrative'}
                </button>
                <button onClick={closeModals} className="cancel-btn">
                  Cancel Draft
                </button>
              </div>
            </div>

            {/* Right — Title + Content */}
            <div className="write-main">
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Headline..."
                className="post-title-input"
              />
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Deep dive into your thoughts..."
                className="post-content-textarea"
              />
            </div>

          </div>
        </div>
      )}

      {/* Common Website Footer */}
      <Footer />
    </>
  );
}
