'use client'


import './localmeds.css'
import JsonLd from '../../../components/JsonLd';
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Pharmacy Delivery",
  name: "LocalMeds by Accesco Living",
  description:
    "Medicine delivery, healthcare access, consultations and lab services delivered quickly to your doorstep.",
  url: "https://accescoliving.com/services/localmeds",
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
export default function LocalMedsPage() {

  return (
  <>
    <JsonLd data={serviceSchema} />
    <div className="lm-wrapper">
      {/* Animated background blobs */}
      <div className="lm-blob lm-blob-1" />
      <div className="lm-blob lm-blob-2" />
      <div className="lm-blob lm-blob-3" />

      {/* Header nav */}
      <nav className="lm-nav">
        <div className="lm-nav-inner">
          <div className="lm-nav-brand">
            <img src="/images/localmeds-logo.png" alt="LocalMeds" className="lm-nav-logo" />
            <span className="lm-nav-name">LocalMeds</span>
          </div>
          <span className="lm-coming-badge">Coming Soon</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="lm-hero">
        <div className="lm-hero-content">
          <div className="lm-logo-glow">
            <img src="/images/localmeds-logo.png" alt="LocalMeds Logo" className="lm-hero-logo" />
          </div>

          <div className="lm-tag">🚀 Something amazing is coming</div>

          <h1 className="lm-headline">
            Your Health,<br />
            <span className="lm-headline-accent">Delivered Fast.</span>
          </h1>

          <p className="lm-subtext">
            LocalMeds is revolutionizing healthcare access — medicines, consultations, and lab tests,
            all delivered to your doorstep in minutes.
          </p>

          {/* Coming Soon Badge */}
          <div className="lm-coming-soon-display">
            <span className="lm-cs-text">Coming Soon</span>
          </div>
        </div>

        {/* Floating pills decoration */}
        <div className="lm-floating-pills">
          <div className="lm-pill lm-pill-1">💊</div>
          <div className="lm-pill lm-pill-2">🩺</div>
          <div className="lm-pill lm-pill-3">🔬</div>
          <div className="lm-pill lm-pill-4">❤️</div>
          <div className="lm-pill lm-pill-5">🏥</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lm-footer">
        <img src="/images/localmeds-logo.png" alt="LocalMeds" className="lm-footer-logo" />
        <p className="lm-footer-text">© 2026 LocalMeds. All rights reserved.</p>
        <p className="lm-footer-sub">Healthcare at your fingertips — coming soon.</p>
      </footer>
    </div>
  </>
  )
}
