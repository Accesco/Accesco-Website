'use client'


import './swadisht-cafe.css'
import JsonLd from '../../../components/JsonLd';
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Cafe",
  name: "Swadishtt Cafe by Accesco Living",
  description:
    "Cafe experiences featuring artisan coffee, baked goods, beverages and curated cafe dining.",
  url: "https://accescoliving.com/services/swadisht-cafe",
  provider: {
    "@type": "Organization",
    name: "Accesco Living",
    url: "https://accescoliving.com",
  },
  areaServed: {
    "@type": "City",
    name: "Bengaluru",
  },
};
export default function SwadisshtCafePage() {

  return (
    <div className="sc-wrapper">
      {/* Steam/warmth blobs */}
      <div className="sc-blob sc-blob-1" />
      <div className="sc-blob sc-blob-2" />
      <div className="sc-blob sc-blob-3" />

      {/* Nav */}
      <nav className="sc-nav">
        <div className="sc-nav-inner">
          <div className="sc-nav-brand">
            <span className="sc-nav-icon">☕</span>
            <span className="sc-nav-name">Swadishtt Cafe</span>
          </div>
          <div className="sc-nav-links">
            <a href="/services/swadisht" className="sc-back-link">← Back to Swadishtt</a>
            <span className="sc-coming-badge">Coming Soon</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="sc-hero">
        <div className="sc-hero-content">

          {/* Big icon with glow */}
          <div className="sc-icon-glow">
            <div className="sc-big-icon">☕</div>
          </div>

          <div className="sc-tag">✨ A new cafe experience is brewing</div>

          <h1 className="sc-headline">
            Sip. Savour.<br />
            <span className="sc-headline-accent">Swadishtt Cafe.</span>
          </h1>

          <p className="sc-subtext">
            Your favourite cafe experience is coming to Swadishtt — artisan coffee, freshly baked
            pastries, and a cozy ambience, all at your fingertips.
          </p>

          {/* Coming Soon */}
          <div className="sc-coming-soon-display">
            <span className="sc-cs-text">Coming Soon</span>
          </div>
        </div>

        {/* Floating food/cafe items */}
        <div className="sc-floaties">
          <div className="sc-float sc-float-1">🥐</div>
          <div className="sc-float sc-float-2">🍰</div>
          <div className="sc-float sc-float-3">🫖</div>
          <div className="sc-float sc-float-4">🍩</div>
          <div className="sc-float sc-float-5">🧁</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="sc-footer">
        <span className="sc-footer-icon">☕</span>
        <p className="sc-footer-text">© 2026 Swadishtt Cafe · A Swadishtt Experience</p>
        <p className="sc-footer-sub">Crafted with warmth — coming soon.</p>
      </footer>
    </div>
  )
}
