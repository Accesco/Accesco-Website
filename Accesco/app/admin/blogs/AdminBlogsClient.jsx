'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import '../../blogs/blogs.css';
import './admin-blogs.css';
import { fetchBlogs } from '../../../lib/blogService';

function PasswordGate({ onAuthenticated }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/blog-admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        onAuthenticated();
      } else {
        setError(data.error || 'Incorrect password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-gate">
      <form className="admin-gate-card" onSubmit={submit}>
        <h1>Blog Admin</h1>
        <p>Enter the marketing password to manage blog posts.</p>
        {error && <div className="admin-gate-error">{error}</div>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        <button type="submit" disabled={loading || !password}>
          {loading ? 'Checking...' : 'Enter'}
        </button>
      </form>
    </div>
  );
}

const emptyForm = {
  title: '',
  content: '',
  category: 'Business',
  author: '',
  image: '',
  localArea: '',
  backlinkUrl: '',
};

function WriterModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial.data);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    setUploadingImage(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, image: data.url }));
      } else {
        setError('Failed to upload image: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const submit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError('Please fill in at least the Title and Content.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const url = initial.id ? `/api/blog-admin/blogs/${initial.id}` : '/api/blog-admin/blogs';
      const method = initial.id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        onSaved();
      } else {
        setError(data.error || 'Save failed');
      }
    } catch (err) {
      setError('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container write-modal" onClick={(e) => e.stopPropagation()}>
        <div className="write-sidebar">
          <h2>{initial.id ? 'Edit Narrative' : 'Draft Narrative'}</h2>

          <div className="sidebar-fields">
            <div className="field-group">
              <label className="form-label">Collection</label>
              <select value={form.category} onChange={setField('category')} className="form-select">
                <option>Business</option>
                <option>Innovation</option>
                <option>Lifestyle</option>
                <option>Finance</option>
                <option>Design</option>
                <option>Culture</option>
                <option>Opinion</option>
              </select>
            </div>

            <div className="field-group">
              <label className="form-label">Author Name</label>
              <input
                type="text"
                value={form.author}
                onChange={setField('author')}
                placeholder="e.g. Argha Sengupta"
                className="form-select"
              />
            </div>

            <div className="field-group">
              <label className="form-label">Local Area</label>
              <input
                type="text"
                value={form.localArea}
                onChange={setField('localArea')}
                placeholder="e.g. Koramangala, Bengaluru"
                className="form-select"
              />
              <p className="field-hint">The neighbourhood/city this post targets for local SEO.</p>
            </div>

            <div className="field-group">
              <label className="form-label">Backlink URL</label>
              <input
                type="url"
                value={form.backlinkUrl}
                onChange={setField('backlinkUrl')}
                placeholder="https://partner-site.com/guest-post"
                className="form-select"
              />
              <p className="field-hint">Where this post (or a version of it) was published externally.</p>
            </div>

            <div className="field-group">
              <label className="form-label">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="form-select"
                style={{ padding: '8px' }}
                disabled={uploadingImage}
              />
              {uploadingImage && <p className="field-hint">Uploading...</p>}
              {form.image && !uploadingImage && (
                <Image
                  src={form.image}
                  alt="Cover preview"
                  width={800}
                  height={200}
                  className="img-preview"
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px' }}
                  unoptimized
                />
              )}
            </div>
          </div>

          {error && <div className="admin-gate-error">{error}</div>}

          <div className="sidebar-actions">
            <button className="btn-pill publish-btn" onClick={submit} disabled={saving}>
              {saving ? 'Saving...' : initial.id ? 'Save Changes' : 'Publish Narrative'}
            </button>
            <button onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </div>

        <div className="write-main">
          <input
            type="text"
            value={form.title}
            onChange={setField('title')}
            placeholder="Headline..."
            className="post-title-input"
          />
          <textarea
            value={form.content}
            onChange={setField('content')}
            placeholder="Deep dive into your thoughts..."
            className="post-content-textarea"
          />
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [writerState, setWriterState] = useState(null); // { id, data } or null
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadPosts = async () => {
    setLoading(true);
    const data = await fetchBlogs();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const openNew = () => setWriterState({ id: null, data: emptyForm });
  const openEdit = (post) =>
    setWriterState({
      id: post.id,
      data: {
        title: post.title,
        content: post.content,
        category: post.category,
        author: post.author,
        image: post.image,
        localArea: post.localArea || '',
        backlinkUrl: post.backlinkUrl || '',
      },
    });

  const handleSaved = () => {
    setWriterState(null);
    loadPosts();
  };

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setDeletingId(post.id);
    try {
      await fetch(`/api/blog-admin/blogs/${post.id}`, { method: 'DELETE' });
      loadPosts();
    } finally {
      setDeletingId(null);
    }
  };

  const logout = async () => {
    await fetch('/api/blog-admin/session', { method: 'DELETE' });
    window.location.reload();
  };

  const searchLower = searchQuery.trim().toLowerCase();
  const filteredPosts = searchLower
    ? posts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchLower) ||
          post.excerpt?.toLowerCase().includes(searchLower) ||
          post.content?.toLowerCase().includes(searchLower) ||
          post.author?.toLowerCase().includes(searchLower) ||
          post.category?.toLowerCase().includes(searchLower) ||
          post.localArea?.toLowerCase().includes(searchLower)
      )
    : posts;

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="admin-header">
          <div className="admin-brand">
            <span className="admin-brand-mark">B</span>
            <div>
              <h1>Blog Admin</h1>
              <p className="admin-subtitle">{posts.length} {posts.length === 1 ? 'post' : 'posts'} published</p>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={logout}>
            <i className="ri-logout-box-r-line"></i> Log out
          </button>
        </div>
      </div>

      <div className="admin-post-list">
        <div className="admin-toolbar">
          <div className="admin-search-wrap">
            <i className="ri-search-line"></i>
            <input
              type="text"
              className="admin-search-input"
              placeholder="Search by title, author, category, local area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="admin-new-btn" onClick={openNew}>
            <i className="ri-add-line"></i> New Post
          </button>
        </div>

        {loading ? (
          <div className="admin-empty">
            <i className="ri-loader-4-line admin-empty-icon spin"></i>
            <p>Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="admin-empty">
            <i className="ri-file-list-3-line admin-empty-icon"></i>
            <p>{searchQuery ? `No posts match "${searchQuery}".` : 'No posts yet. Write your first one.'}</p>
            {!searchQuery && (
              <button className="admin-new-btn" onClick={openNew}>
                <i className="ri-add-line"></i> New Post
              </button>
            )}
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="admin-post-row">
              <div className="admin-post-thumb">
                {post.image ? (
                  <Image src={post.image} alt={post.title} fill unoptimized style={{ objectFit: 'cover' }} />
                ) : (
                  <i className="ri-image-line"></i>
                )}
              </div>
              <div className="admin-post-info">
                <h3>{post.title}</h3>
                <div className="admin-post-meta">
                  <span className="admin-category-badge">{post.category}</span>
                  <span><i className="ri-calendar-line"></i> {post.date}</span>
                  {post.localArea && <span><i className="ri-map-pin-line"></i> {post.localArea}</span>}
                  {post.backlinkUrl && <span><i className="ri-link"></i> backlink set</span>}
                </div>
              </div>
              <div className="admin-post-actions">
                <button className="admin-edit-btn" onClick={() => openEdit(post)}>
                  <i className="ri-pencil-line"></i> Edit
                </button>
                <button
                  className="admin-delete-btn"
                  onClick={() => handleDelete(post)}
                  disabled={deletingId === post.id}
                >
                  <i className="ri-delete-bin-line"></i> {deletingId === post.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {writerState && (
        <WriterModal
          initial={writerState}
          onClose={() => setWriterState(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default function AdminBlogsClient() {
  const [checked, setChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch('/api/blog-admin/session')
      .then((res) => res.json())
      .then((data) => setAuthenticated(!!data.authenticated))
      .finally(() => setChecked(true));
  }, []);

  if (!checked) return null;

  return authenticated ? (
    <AdminDashboard />
  ) : (
    <PasswordGate onAuthenticated={() => setAuthenticated(true)} />
  );
}
