'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import './blogs.css';
import { fetchBlogs, addBlog } from '../../lib/blogService';
import AccescoHeader from '../../components/AccescoHeader';
import Footer from '../../components/Footer';

export default function BlogsPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showReader, setShowReader] = useState(false);
  const [showWriter, setShowWriter] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states — matches Firestore field structure
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('Business');
  const [postAuthor, setPostAuthor] = useState('');
  const [postImgUrl, setPostImgUrl] = useState('');
  const [postDate, setPostDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [publishing, setPublishing] = useState(false);

  // ── Load blogs from Firestore on mount ──────────────────────────────────────
  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    setLoading(true);
    try {
      const data = await fetchBlogs();
      setPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      console.error('Failed to load blogs:', err);
    } finally {
      setLoading(false);
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
    setSelectedPost(post);
    setShowReader(true);
    document.body.style.overflow = 'hidden';
  };

  const openWriter = () => {
    setShowWriter(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModals = () => {
    setShowReader(false);
    setShowWriter(false);
    setSelectedPost(null);
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

  return (
    <>
      {/* Loading Screen */}
      {loading && (
        <div id="loadingScreen" className="loading-screen">
          <div className="loader-video-wrap">
            <video autoPlay muted loop playsInline>
              <source src="/images/loading.mp4" type="video/mp4" />
            </video>
          </div>
          <span className="loader-text">Curating Collection...</span>
        </div>
      )}

      {/* Common Website Header */}
      <AccescoHeader />

      {/* Hero Section */}
      <div className="hero-canvas">
        <section className="hero-viewport">
          <video autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop">
            <source src="/images/blog-video-animation.MP4" type="video/mp4" />
          </video>
          <div className="hero-shimmer"></div>
          <div className="hero-text-box">
            <h1>Stories That Matter</h1>
            <p>Insights, innovations, and ideas from the world of modern living and technology.</p>
          </div>
        </section>
      </div>

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
            <p className="archive-subtitle">
              {searchQuery ? `Found ${filteredPosts.length} results for "${searchQuery}"` : 'Discover insights and stories from our community'}
            </p>
          </div>
          <span className="count">{filteredPosts.length} {filteredPosts.length === 1 ? 'Story' : 'Stories'}</span>
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
              <article key={post.id} className="story-card" onClick={() => openReader(post)} style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="story-visual">
                  <Image src={post.image || '/images/download (2).png'} alt={post.title} fill style={{ objectFit: 'cover' }} unoptimized />
                  <div className="story-overlay">
                    <span className="read-time"><i className="ri-time-line"></i> 5 min read</span>
                  </div>
                </div>
                <div className="story-content">
                  <div className="story-meta">
                    <span className="story-tag">{post.category}</span>
                    <span className="story-date">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3 className="story-headline">{post.title}</h3>
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

      {/* ── Reader Modal ── */}
      {showReader && selectedPost && (
        <div className="modal-overlay" onClick={closeModals}>
          <button className="modal-close" onClick={closeModals}><i className="ri-close-line"></i></button>
          <div className="modal-container reader-container" onClick={(e) => e.stopPropagation()}>
            <div className="reader-top">
              <div className="reader-meta-row">
                <span className="story-tag">{selectedPost.category}</span>
                <span className="reader-date">{new Date(selectedPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <h1 className="reader-h1">{selectedPost.title}</h1>
              <div className="reader-author-row">
                <div className="author-info">
                  <div className="author-avatar">
                    <i className="ri-user-fill"></i>
                  </div>
                  <div>
                    <p className="author-name">{selectedPost.author || 'ACCESCO Editorial Team'}</p>
                    <p className="author-meta">5 min read • {new Date(selectedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="reader-actions">
                  <button className="icon-btn" title="Share"><i className="ri-share-line"></i></button>
                  <button className="icon-btn" title="Bookmark"><i className="ri-bookmark-line"></i></button>
                </div>
              </div>
            </div>
            <Image
              src={selectedPost.image || '/images/download (2).png'}
              alt={selectedPost.title}
              width={1200} height={600}
              unoptimized
              style={{ width: '100%', height: 'auto', borderRadius: '20px', marginBottom: '3rem', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
            />
            <div className="reader-article">
              <p>{selectedPost.content}</p>
            </div>
            <div className="reader-footer">
              <div className="reader-tags">
                <span className="tag-item">{selectedPost.category}</span>
                <span className="tag-item">Featured</span>
              </div>
              <div className="reader-share">
                <p>Share this story</p>
                <div className="share-buttons">
                  <button className="share-btn"><i className="ri-twitter-x-line"></i></button>
                  <button className="share-btn"><i className="ri-facebook-fill"></i></button>
                  <button className="share-btn"><i className="ri-linkedin-fill"></i></button>
                  <button className="share-btn"><i className="ri-link"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

                {/* Image URL */}
                <div className="field-group">
                  <label className="form-label">Image URL <span className="label-hint">(Cloudinary)</span></label>
                  <input
                    type="text"
                    value={postImgUrl}
                    onChange={(e) => setPostImgUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                    className="form-select"
                  />
                  {postImgUrl && (
                    <img
                      src={postImgUrl}
                      alt="Cover preview"
                      className="img-preview"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <p className="field-hint">Upload on cloudinary.com first, then paste URL here.</p>
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
