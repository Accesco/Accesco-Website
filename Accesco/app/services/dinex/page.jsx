'use client'


import './dinex.css'

export default function DineXPage() {

  return (
    <div className="dx-wrapper">
      {/* Background blobs */}
      <div className="dx-blob dx-blob-1" />
      <div className="dx-blob dx-blob-2" />
      <div className="dx-blob dx-blob-3" />

      {/* Nav */}
      <nav className="dx-nav">
        <div className="dx-nav-inner">
          <div className="dx-nav-brand">
            <span className="dx-nav-icon">🍽️</span>
            <span className="dx-nav-name">DineX</span>
          </div>
          <div className="dx-nav-links">
            <a href="/services/swadisht" className="dx-back-link">← Back to Swadishtt</a>
            <span className="dx-coming-badge">Coming Soon</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="dx-hero">
        <div className="dx-hero-content">

          <div className="dx-icon-glow">
            <div className="dx-big-icon">🍽️</div>
          </div>

          <div className="dx-tag">🌟 Fine dining, reimagined</div>

          <h1 className="dx-headline">
            Reserve. Dine.<br />
            <span className="dx-headline-accent">Experience DineX.</span>
          </h1>

          <p className="dx-subtext">
            DineX brings you premium restaurant reservations, exclusive table bookings, and
            curated fine-dining experiences — all in one seamless platform.
          </p>

          {/* Coming Soon */}
          <div className="dx-coming-soon-display">
            <span className="dx-cs-text">Coming Soon</span>
          </div>
        </div>

        {/* Floating icons */}
        <div className="dx-floaties">
          <div className="dx-float dx-float-1">🥂</div>
          <div className="dx-float dx-float-2">🍷</div>
          <div className="dx-float dx-float-3">🫕</div>
          <div className="dx-float dx-float-4">🌹</div>
          <div className="dx-float dx-float-5">🍾</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="dx-footer">
        <span className="dx-footer-icon">🍽️</span>
        <p className="dx-footer-text">© 2026 DineX · A Swadishtt Experience</p>
        <p className="dx-footer-sub">Premium dining, coming soon.</p>
      </footer>
    </div>
  )
}
