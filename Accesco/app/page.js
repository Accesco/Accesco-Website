'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './homepage.css';
import AccescoHeader from '../components/AccescoHeader';
import Hero from '../components/Hero';
import AppShowcase from '../components/AppShowcase';
import Footer from '../components/Footer';
import JsonLd from '../components/JsonLd';
export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const scrollRef = useRef(null);
const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Accesco Living",
  "operatingSystem": "Android, iOS",
  "applicationCategory": "ShoppingApplication",
  "url": "https://www.accescoliving.com",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  }
};
  useEffect(() => {
    setIsClient(true);
  }, []);

  const scroll = (direction) => {
  if (scrollRef.current) {
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth',
    });
  }
};

 return (
  <>
    <JsonLd data={softwareApplicationSchema} />
    <AccescoHeader />
      <main>
        {/* ── Hero Section ── */}
        <Hero />

        {/* ── Services Section ── */}
        <section id="services" style={{ padding: 'clamp(60px, 8vw, 100px) 0', background: '#FFFDF8', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(122,0,66,0.03) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(200,150,62,0.03) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 40px)', position: 'relative' }}>
            <div style={{ marginBottom: '60px' }}>

              <h2 style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: '#1A0A0F', letterSpacing: '-0.03em',
                margin: '0 0 16px', lineHeight: 1.12,
              }}>
                India solved delivery in 10 minutes.<br />
                <span className="ac-gradient-text">Nobody solved the household in 10 years.</span>
              </h2>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '1.05rem', color: '#6B5B65',
                maxWidth: '560px', lineHeight: 1.7,
              }}>
                From Fresh groceries to curated meals, fast curated fashion delivery to instant medicine—Intelligent hyperlocal commerce that fits your life.
              </p>
            </div>

            <div className="services-container-wrapper">
              <div className="servicesWrap">
                <button
                  type="button"
                  className="servicesArrow servicesArrowLeft"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    scroll('left');
                  }}
                  aria-label="Previous"
                >
                  ‹
                </button>

                <div ref={scrollRef} id="services-scroll-container" className="services-grid">
                  {/* Card 1: Grokly */}
                  <div style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="service-premium-card grokly-card">
                      <div className="service-card-visual">
                        <Image src="/images/grokly-new1.png" alt="Grokly Groceries" fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div className="service-icon-circle">
                        <Image src="/images/grokly-icon.png" alt="Grokly" width={40} height={40} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                      </div>
                      <div className="service-card-body">
                        <h3 className="service-card-name">Grokly</h3>
                        <p className="service-card-desc">Fresh groceries & curated essentials at your doorstep</p>
                        <Link href="/services/grokly" className="service-card-cta grokly-btn">Shop Groceries</Link>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Swadishtt */}
                  <div style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="service-premium-card swadisht-card">
                      <div className="service-card-visual">
                        <Image src="/images/swadisht-new1.png" alt="Swadishtt Meals" fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div className="service-icon-circle">
                        <Image src="/images/swadisht/swadisht_logo.JPG" alt="Swadishtt" width={40} height={40} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                      </div>
                      <div className="service-card-body">
                        <h3 className="service-card-name">Swadishtt</h3>
                        <p className="service-card-desc">Meals made only for you!</p>
                        <Link href="/services/swadisht" className="service-card-cta swadishtt-btn">Order Food</Link>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: InstaStyle */}
                  <div style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="service-premium-card instastyle-card">
                      <div className="service-card-visual">
                        <Image src="/images/fashion-new1.png" alt="InstaStyle Fashion" fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div className="service-icon-circle">
                        <Image src="/images/instastyle-logo.png" alt="InstaStyle" width={40} height={40} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                      </div>
                      <div className="service-card-body">
                        <h3 className="service-card-name">InstaStyle</h3>
                        <p className="service-card-desc">Outfit ready, before you are!</p>
                        <Link href="/services/instastyle" className="service-card-cta instastyle-btn">Explore Fashion</Link>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="servicesArrow servicesArrowRight"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    scroll('right');
                  }}
                  aria-label="Next"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Xpense Meter Section ── */}
        <section className="xpense-meter-section">
          <div className="xpense-container">
            <div className="xpense-content">
              <div className="xpense-header">
                <h2 className="xpense-title">
                  Smart budgeting built for <span className="xpense-highlight">your income cycle</span>
                </h2>
                <p className="xpense-description">
                  Track and manage your household expenses dynamically relative to your salary schedule.
                </p>

                <div className="xpense-features">
                  <div className="feature-item">
                    <span className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                        <line x1="12" y1="4" x2="12" y2="20" />
                      </svg>
                    </span>
                    <div className="feature-text">
                      <h4>Salary Sync</h4>
                      <p>Adapts your monthly budget limits to your payroll cycle.</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                    </span>
                    <div className="feature-text">
                      <h4>Budget Alerts</h4>
                      <p>Get notified instantly before you exceed category limits.</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                      </svg>
                    </span>
                    <div className="feature-text">
                      <h4>Smart Goals</h4>
                      <p>Track and secure your savings targets automatically.</p>
                    </div>
                  </div>
                </div>

                <div className="xpense-actions">
                  <Link href="/calculator" className="xpense-cta">
                    Launch calculator
                  </Link>
                  <Link href="#waitlist" className="xpense-secondary-cta">
                    Join waitlist
                  </Link>
                </div>
              </div>

              <div className="xpense-visual">
                <div className="xpense-dashboard-card">
                  <div className="dashboard-header">
                    <div className="header-meta">
                      <span className="dashboard-title">Xpense Meter</span>
                      <p className="dashboard-subtitle">Transform your financial habits with intelligent expense tracking and predictive analytics.</p>
                    </div>
                    <Link href="/calculator" className="dashboard-calc-link">
                      Launch Calculator
                    </Link>
                  </div>
                  
                  <div className="dashboard-grid">
                    <div className="dashboard-item">
                      <span className="item-label">Monthly Limit</span>
                      <span className="item-value">₹50,000</span>
                    </div>

                    <div className="dashboard-item">
                      <span className="item-label">Current Spent</span>
                      <span className="item-value" style={{ color: '#7A0042' }}>₹45,280</span>
                    </div>

                    <div className="dashboard-item item-full">
                      <span className="item-label">Remaining Balance</span>
                      <span className="item-value" style={{ color: '#2E7D32' }}>₹4,720</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Waitlist / App Showcase ── */}
        <AppShowcase />

</main>
      <Footer />

      {isClient && (
        <df-messenger
          intent="WELCOME"
          chat-title="Accesco AI"
          agent-id="8beafa4a-339b-44ff-a386-62d386a2481b"
          language-code="en"
          chat-icon="/images/IMG_5111.PNG"
        />
      )}

      {/* ── Combined & Optimized Styles ── */}
            <style dangerouslySetInnerHTML={{ __html: `
            
        .services-container-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .servicesWrap {
          position: relative;
          width: 100%;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          width: 100%;
        }

        .servicesArrow {
          display: none;
        }

        @media (max-width: 960px) {
          .services-container-wrapper {
            overflow: visible;
          }

          .services-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding: 0 20px;
            gap: 16px;
            scrollbar-width: none;
            scroll-behavior: smooth;
          }

          .services-grid::-webkit-scrollbar {
            display: none;
          }

          .services-grid > div {
            flex: 0 0 100%;
            min-width: 100%;
            max-width: 100%;
            scroll-snap-align: center;
            scroll-snap-stop: always;
            padding: 0;
            box-sizing: border-box;
          }

          .servicesArrow {
            display: flex !important;
            position: absolute;
            top: 42%;
            transform: translateY(-50%);
            z-index: 999;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid rgba(122,0,66,0.1);
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 700;
            background: white;
            color: #7A0042;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .servicesArrow:hover {
            background: #7A0042;
            color: white;
          }

          .servicesArrowLeft {
            left: 4px;
          }

          .servicesArrowRight {
            right: 4px;
          }

          .xpense-box-container {
            grid-template-columns: 1fr !important;
            padding: 48px 20px !important;
            text-align: center !important;
            margin: 0 10px !important;
            width: calc(100% - 20px) !important;
          }

          .xpense-visual-wrap {
            height: auto !important;
            margin-top: 16px !important;
          }

          .xpense-visual-wrap > div:not(:nth-child(2)) {
            display: none !important;
          }

          .xpense-visual-wrap > div:nth-child(2) {
            position: relative !important;
            transform: none !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 280px !important;
          }
        }

        .service-premium-card {
          position: relative;
          background: #fff;
          border-radius: 24px;
          border: 1px solid rgba(122,0,66,0.08);
          overflow: hidden;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        /* hover interaction removed for premium cards per request */

        .service-card-visual {
          height: 200px;
          position: relative;
          overflow: hidden;
        }

        .service-card-body {
          padding: 20px 20px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .service-card-name {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 1.35rem;
          color: #1A0A0F;
          margin: 0 0 8px;
        }

        .service-icon-circle {
          position: absolute;
          top: 170px;
          right: 20px;
          width: 60px;
          height: 60px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          z-index: 2;
          padding: 10px;
        }

        .service-card-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          border-radius: 12px;
          font-family: 'Sora', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
        }

        .grokly-btn {
          background: #2E7D32;
          color: #fff;
        }

        .swadishtt-btn {
          background: #7A0042;
          color: #fff;
        }

        .instastyle-btn {
          background:  #8B5E3C;
          color: #fff;
        }

        .xpense-details {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: all 0.4s ease;
        }

        .xpense-card-float {
          transition: all 0.4s ease;
        }

        /* xpense-card hover interactions removed */
      `} } />
      </>
  );
}