'use client';

import Link from 'next/link';

export default function BookmarksSection({
  bookmarks,
  setBookmarks,
  bookmarkFilter,
  setBookmarkFilter,
}) {
  const filtered = bookmarks.filter(
    (b) => bookmarkFilter === 'All' || b.service === bookmarkFilter
  );

  return (
    <div className="settings-card profile-panel-card">
      <div className="settings-card-header">
        <span>My Bookmarked Items ({bookmarks.length})</span>
      </div>

      <div className="bookmark-filters">
        {['All', 'Grokly', 'Swadishtt', 'InstaStyle'].map((cat) => (
          <button
            type="button"
            key={cat}
            className={`filter-tab ${bookmarkFilter === cat ? 'active' : ''}`}
            onClick={() => setBookmarkFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-panel-state">
          <i className="ri-bookmark-line empty-panel-icon" />
          <h4>No Bookmarked Items Found</h4>
          <p>Tap the bookmark or heart icon while browsing Grokly, Swadishtt, or InstaStyle to save your favorite items here.</p>
          <Link href="/services/grokly" className="panel-btn-primary">
            Explore Accesco Services
          </Link>
        </div>
      ) : (
        <div className="bookmarks-list">
          {filtered.map((bm) => (
            <div key={bm.id} className="bookmark-item">
              <div className="bm-emoji">{bm.image || '🛒'}</div>
              <div className="bm-info">
                <strong>{bm.title || bm.name}</strong>
                <small>
                  <span className="bm-service-tag">{bm.service || 'Accesco'}</span> · {bm.price}
                </small>
              </div>
              <div className="bm-actions">
                <Link
                  href={
                    bm.service === 'Grokly'
                      ? '/services/grokly'
                      : bm.service === 'Swadishtt'
                      ? '/services/swadisht'
                      : '/services/instastyle'
                  }
                  className="panel-btn-primary btn-sm"
                >
                  View
                </Link>
                <button
                  type="button"
                  className="btn-text btn-danger"
                  onClick={() =>
                    setBookmarks((prev) => prev.filter((b) => b.id !== bm.id))
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
