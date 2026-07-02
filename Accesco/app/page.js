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
  const deliveryRef = useRef(null);
const [deliveryVisible, setDeliveryVisible] = useState(false);
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
  useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      setDeliveryVisible(entry.isIntersecting);
    },
    { threshold: 0.35 }
  );

  if (deliveryRef.current) {
    observer.observe(deliveryRef.current);
  }

  return () => observer.disconnect();
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
       <section
  id="services"
  style={{
    padding: 'clamp(60px, 8vw, 100px) 0',
    background: '#FFFDF8',
    position: 'relative'
  }}
>
         

          <div className="intelligencePosterRow">

  {/* Intelligence Image */}
  <div className="intelligenceSection">
    
    <picture>
  <source
    media="(max-width: 768px)"
    srcSet="/images/YOUR-MOBILE-IMAGE.jpeg"
  />
    <Image
  src="/images/intelligence-layer.png"
  alt="Accesco Intelligence Layer"
  width={1600}
  height={900}
  className="intelligenceImage"
  sizes="100vw"
  quality={80}
/>
</picture>
  </div>

  {/* Poster */}
  <div className="postersSectionWrapper">
    <div
      className="postersTiltCard"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        e.currentTarget.style.transform =
          `perspective(800px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.03)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
      }}
    >
      <img
        src="/images/poster-newspaper.jpeg"
        alt="Accesco Living - Something exciting is coming"
        className="postersTiltImg"
      />
    </div>
  </div>

</div>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(122,0,66,0.03) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(200,150,62,0.03) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

  <div
    ref={deliveryRef}
    className={`deliveryHeadingFrame ${deliveryVisible ? "is-visible" : ""}`}
    style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 clamp(20px, 4vw, 40px)',
      position: 'relative'
    }}
  >
<div className="floatingHeroItems">
  <img src="/images/burger.png" className="popItem popBurger" alt="Burger" />
  <img src="/images/pizza.png" className="popItem popPizza" alt="Pizza" />
  <img src="/images/Grocery.png" className="popItem popGrocery" alt="Grocery Basket" />
  <img src="/images/hoodie.png" className="popItem popHoodie" alt="Hoodie" />
  <img src="/images/salad.png" className="popItem popSalad" alt="Salad" />
  <img src="/images/Jeans.png" className="popItem popJeans" alt="Jeans" />
</div>
              <h2 style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
fontSize: 'clamp(2.45rem, 4.9vw, 4.4rem)',
                color: '#1A0A0F', letterSpacing: '-0.04em',
                margin: '0 0 8px', lineHeight: 1.1,
              }}>
                India solved delivery in 10 minutes.<br />
                <span style={{
  fontFamily: "'Inter', sans-serif",
  color: '#2B1A24',
  fontWeight: 550,
  fontSize: 'clamp(1rem, 3.8vw, 2rem)',
  lineHeight: 1.2,
}}>
  Nobody solved the household in 10 years.
</span>

              </h2>
              <p style={{
 fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: 'clamp(1.15rem, 1.5vw, 1.4rem)',
  color: '#6B5B65',
  maxWidth: '900px',
  lineHeight: 1.5,
  
}}>
                Groceries, food and fashion at your doorstep in minutes — sourced straight from producers, built to circulate, and engineered so the value of everything you buy keeps working for your household—Intelligent Hyperlocal delivery app that fits your life. </p>
            </div>   {/* deliveryHeadingFrame */}
          

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
                        <Image src="/images/swadisht/swadisht_logo1.JPG" alt="Swadishtt Meals" fill style={{ objectFit: 'cover' }} />
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
 
  
  
            
       r .services-container-wrapper {
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

        /* ── Mobile: show all 3 cards simultaneously, no scroll ── */
        @media (max-width: 960px) {
          .services-container-wrapper {
            overflow: visible !important;
          }

          .services-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1f) !important;
            gap: 8px !important;
            width: 100% !important;
            overflow: visible !important;
            scroll-snap-type: none !important;
            padding-bottom: 0 !important;
            margin: 0 !important;
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

          .services-grid > div {
            width: 100% !important;
            min-width: 0 !important;
            max-width: none !important;
            flex-shrink: 0 !important;
          }

          .servicesArrow {
            display: none !important;
          }

          .service-card-visual {
            height: 120px !important;
          }

          .service-card-body {
            padding: 10px 10px 14px !important;
          }

          .service-card-name {
          font-family: 'Inter', sans-serif;
  font-weight: 700;
            font-size: 0.9rem !important;
            margin-bottom: 4px !important;
          }

          .service-card-desc {
            font-size: 0.7rem !important;
            line-height: 1.3 !important;
          }

          .service-card-cta {
            padding: 9px 6px !important;
            font-size: 0.65rem !important;
            border-radius: 8px !important;
          }

          .service-icon-circle {
            width: 40px !important;
            height: 40px !important;
            top: 100px !important;
            right: 8px !important;
            padding: 6px !important;
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

        @media (max-width: 480px) {
          .services-grid {
            gap: 6px !important;
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
            overflow: visible !important;
            scroll-snap-type: none !important;
            padding-bottom: 0 !important;
            margin: 0 !important;
          }
          .services-grid > div {
            width: 100% !important;
            min-width: 0 !important;
            max-width: none !important;
            flex-shrink: 0 !important;
          }
/* Grokly */
.services-grid > div:nth-child(1) {
  grid-column: 1;
  grid-row: 1;
}

/* Swadisht - full width */
.services-grid > div:nth-child(2) {
  grid-column: 1 / -1;
  grid-row: 2;
}

/* InstaStyle */
.services-grid > div:nth-child(3) {
  grid-column: 2;
  grid-row: 1;
}
  
       .service-card-visual {
  height: 120px !important;   /* was 85px */
}

.service-card-body {
  padding: 10px 10px 12px !important;   /* was 6px 6px 8px */
}
          .service-card-name {
          font-family: 'Inter', sans-serif;
  font-weight: 700;
            font-size: 0.72rem !important;
            margin-bottom: 2px !important;
          }
          .service-card-desc {
            display: none !important;
          }
          .service-card-cta {
            padding: 6px 2px !important;
            font-size: 0.55rem !important;
            border-radius: 6px !important;
          }
          .service-icon-circle {
            width: 26px !important;
            height: 26px !important;
            top: 72px !important;
            right: 4px !important;
            padding: 3px !important;
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
          font-family: 'Inter', sans-serif;
  font-weight: 700;
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
  border-radius: 8px;

  font-family: 'Inter', sans-serif;
  font-size: 0.98rem;
  font-weight: 700;
  letter-spacing: -0.02em;
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
      ` }} />
      </>
  );
}