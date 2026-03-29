'use client';


import { useState, useEffect } from 'react';
import Image from 'next/image';
import './blogs.css';
import { fetchBlogs, addBlog } from '../../lib/blogService';

export default function BlogsPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showReader, setShowReader] = useState(false);
  const [showWriter, setShowWriter] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);

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

      {/* Header */}
      <header>
        <div className="top-bar">
          <div className="logo-area" onClick={() => filterArchive('All')}>
            <Image src="/images/accesco_original.png" alt="ACCESCO" width={36} height={36} />
            <span>ACCESCO LIVING</span>
          </div>
          <ul className="nav-links" id="mainNav">
            <li className={activeCategory === 'All' ? 'active' : ''} onClick={() => filterArchive('All')}>Archive</li>
            <li className={activeCategory === 'Business' ? 'active' : ''} onClick={() => filterArchive('Business')}>Business</li>
            <li className={activeCategory === 'Innovation' || activeCategory === 'Technology' ? 'active' : ''} onClick={() => filterArchive('Innovation')}>Innovation</li>
            <li className={activeCategory === 'Lifestyle' ? 'active' : ''} onClick={() => filterArchive('Lifestyle')}>Lifestyle</li>
          </ul>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button className="btn-pill" onClick={openWriter}>
              <i className="ri-quill-pen-fill"></i>
              <span>Draft Narrative</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="hero-canvas">
        <section className="hero-viewport">
          <video autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-particles-in-dark-space-4112-large.mp4" type="video/mp4" />
          </video>
          <div className="hero-shimmer"></div>
          <div className="hero-text-box">
            <h1>The Intelligent Edit.</h1>
            <p>Curated perspectives and deep dives into the trends shaping our digital and cultural landscape.</p>
            <button className="btn-pill light" onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}>Begin Reading</button>
          </div>
        </section>
      </div>

      {/* Main Archive */}
      <main className="content-archive">
        <div className="archive-header">
          <h2 id="activeCategory">{activeCategory === 'All' ? 'Latest Collection' : activeCategory}</h2>
          <span className="count">{filteredPosts.length} Narratives</span>
        </div>
        <div id="storyContainer" className="story-grid">
          {filteredPosts.map((post) => (
            <article key={post.id} className="story-card" onClick={() => openReader(post)}>
              <div className="story-visual">
                <Image src={post.image || '/images/download (2).png'} alt={post.title} fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
              <span className="story-tag">{post.category}</span>
              <h3 className="story-headline">{post.title}</h3>
              <p className="story-summary">{post.excerpt}</p>
              <span className="btn-action-text">Read Archive Entry</span>
            </article>
          ))}
        </div>
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

      {/* Footer */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo-row">
              <Image src="/images/accesco_original.png" alt="ACCESCO" width={40} height={40} />
              <span>ACCESCO BLOGS</span>
            </div>
            <p className="footer-tagline">Empowering digital excellence through innovation. Explore our community insights.</p>
          </div>
          <div className="footer-col"><h4>Company</h4><ul><li>About Us</li><li>Careers</li><li>Partner</li></ul></div>
          <div className="footer-col"><h4>Resources</h4><ul><li>Help Center</li><li>Legal</li><li>Support</li></ul></div>
          <div className="footer-col">
            <h4>Social Links</h4>
            <div className="footer-socials">
              <a href="#" className="social-link"><i className="ri-instagram-line"></i></a>
              <a href="#" className="social-link"><i className="ri-twitter-fill"></i></a>
              <a href="#" className="social-link"><i className="ri-linkedin-box-fill"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">© 2026 ACCESCO BLOGS — ALL RIGHTS RESERVED.</div>
      </footer>

      {/* ── Reader Modal ── */}
      {showReader && selectedPost && (
        <div className="modal-overlay" onClick={closeModals}>
          <button className="modal-close" onClick={closeModals}><i className="ri-close-line"></i></button>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="reader-top">
              <span className="story-tag">{selectedPost.category}</span>
              <h1 className="reader-h1">{selectedPost.title}</h1>
              <p style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '15px' }}>
                By {selectedPost.author || 'ACCESCO Editorial Team'}
              </p>
            </div>
            <Image
              src={selectedPost.image || '/images/download (2).png'}
              alt={selectedPost.title}
              width={1200} height={600}
              unoptimized
              style={{ width: '100%', height: 'auto', borderRadius: '28px', marginBottom: '4rem', boxShadow: '0 40px 80px rgba(0,0,0,0.15)' }}
            />
            <div className="reader-article"><p>{selectedPost.content}</p></div>
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
    </>
  );
}
