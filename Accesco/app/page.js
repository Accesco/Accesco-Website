'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './homepage.css';
import AccescoHeader from '../components/AccescoHeader';
import Hero from '../components/Hero';
import AppShowcase from '../components/AppShowcase';
import DownloadSection from '../components/DownloadSection';
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
  className="servicesArrow servicesArrowRight"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    scroll('right');
  }}
>
  ›
</button>

                <div ref={scrollRef} id="services-scroll-container" className="services-grid">
                  {/* Card 1: Grokly */}
                  <a href="/services/grokly" style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="service-premium-card grokly-card">
                      <div className="service-card-visual">
                        <Image src="/images/grokly-new.png" alt="Grokly Groceries" fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div className="service-icon-circle">
                        <Image src="/images/grokly-icon.png" alt="Grokly" width={40} height={40} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                      </div>
                      <div className="service-card-body">
                        <h3 className="service-card-name">Grokly</h3>
                        <p className="service-card-desc">Fresh groceries & curated essentials at your doorstep</p>
                        <div className="service-card-cta grokly-btn">Shop Groceries →</div>
                      </div>
                    </div>
                  </a>

                  {/* Card 2: Swadishtt */}
                  <a href="/services/swadisht" style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="service-premium-card swadisht-card">
                      <div className="service-card-visual">
                        <Image src="/images/swadisht-new.png" alt="Swadishtt Meals" fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div className="service-icon-circle">
                        <Image src="/images/swadisht/swadisht_logo.JPG" alt="Swadishtt" width={40} height={40} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                      </div>
                      <div className="service-card-body">
                        <h3 className="service-card-name">Swadishtt</h3>
                        <p className="service-card-desc">Meals made only for you!</p>
                        <div className="service-card-cta swadishtt-btn">Order Food →</div>
                      </div>
                    </div>
                  </a>

                  {/* Card 3: InstaStyle */}
                  <a href="/services/instastyle" style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="service-premium-card instastyle-card">
                      <div className="service-card-visual">
                        <Image src="/images/fashion-new.png" alt="InstaStyle Fashion" fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div className="service-icon-circle">
                        <Image src="/images/instastyle-logo.png" alt="InstaStyle" width={40} height={40} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                      </div>
                      <div className="service-card-body">
                        <h3 className="service-card-name">InstaStyle</h3>
                        <p className="service-card-desc">Outfit ready, before you are!</p>
                        <div className="service-card-cta instastyle-btn">Explore Fashion →</div>
                      </div>
                    </div>
                  </a>
                </div>

                <button className="servicesArrow servicesArrowRight" onClick={() => scroll('right')}>›</button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Xpense Meter Section ── */}
        <section style={{ padding: '80px 0', background: '#FFFDF8', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
            <div className="xpense-box-container" style={{
              background: 'linear-gradient(135deg, #0A0305 0%, #1D0E15 100%)', borderRadius: '48px', padding: '100px 80px',
              border: '1.5px solid rgba(200, 150, 62, 0.45)', display: 'grid',
              gridTemplateColumns: '1fr 1.2fr', gap: '80px', alignItems: 'center',
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            }}>
              {/* Premium 3D Golden-Bronze Sphere Background */}
              <div style={{
                position: 'absolute',
                top: '5%',
                right: '8%',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #FFF0D0 0%, #E8C37C 25%, #C8963E 50%, #7A5314 75%, #2A1C05 100%)',
                boxShadow: 'inset -20px -20px 50px rgba(0,0,0,0.85), 0 30px 60px rgba(0,0,0,0.5)',
                opacity: 0.85,
                zIndex: 1,
                pointerEvents: 'none',
              }} />

              {/* Glowing Background Glows */}
              <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(200, 150, 62, 0.08) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
              
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div className="ac-chip" style={{
                  marginBottom: '20px',
                  background: 'rgba(200, 150, 62, 0.15)',
                  border: '1px solid rgba(200, 150, 62, 0.35)',
                  color: '#E8C37C',
                  display: 'inline-flex',
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>
                  Financial Intelligence
                </div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#FFFDF8', margin: '0 0 20px', lineHeight: 1.1 }}>
                  Xpense<br />
                  <span style={{
                    background: 'linear-gradient(135deg, #C8963E 0%, #F5D79B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Meter
                  </span>
                </h2>
                <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.75, marginBottom: '36px' }}>
                  Transform your financial habits with intelligent expense tracking and predictive analytics.
                </p>
                <Link href="/calculator" style={{
                  display: 'inline-block',
                  padding: '16px 36px',
                  background: 'linear-gradient(135deg, #C8963E 0%, #A27221 100%)',
                  color: '#0A0305',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 10px 25px rgba(200, 150, 62, 0.35)',
                  position: 'relative',
                  zIndex: 3,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                className="xpense-launch-btn">
                  Launch Calculator →
                </Link>
              </div>

              <div className="xpense-visual-wrap" style={{ position: 'relative', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '340px', margin: '0 auto', zIndex: 2 }}>
                {/* Floating Card 1 (Dark Glassmorphic + Gold Border) */}
                <div className="xpense-card-float" style={{
                  position: 'absolute', top: '5%', right: '-10%', width: '100%', maxWidth: '240px',
                  background: 'rgba(10, 5, 8, 0.88)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                  padding: '24px', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                  border: '1.5px solid rgba(200, 150, 62, 0.45)', zIndex: 3, transform: 'rotate(2deg)', color: '#FFFDF8'
                }}>
                  <div style={{ color: '#E8C37C', fontWeight: 900, marginBottom: '8px', fontSize: '1rem' }}>✦ Smart Categorization</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>AI-powered automatic expense sorting</div>
                  <div className="xpense-details">
                    <div style={{ background: 'rgba(200, 150, 62, 0.08)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(200, 150, 62, 0.25)', marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}><span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Groceries</span><span style={{ fontWeight: 800, color: '#E8C37C' }}>45%</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Dining</span><span style={{ fontWeight: 800, color: '#E8C37C' }}>25%</span></div>
                    </div>
                  </div>
                </div>

                {/* Main Dark Card (High Contrast Gold Accented) */}
                <div style={{
                  width: '100%', maxWidth: '280px',
                  background: 'linear-gradient(135deg, #120509 0%, #200C16 100%)',
                  boxShadow: '0 40px 90px rgba(0,0,0,0.65)',
                  borderRadius: '32px', padding: '32px', position: 'relative', zIndex: 2, color: '#FFFDF8',
                  border: '1.5px solid rgba(200, 150, 62, 0.65)'
                }}>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ opacity: 0.65, fontSize: '0.7rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Overview</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFDF8' }}>₹45,280</div>
                      <div style={{ background: 'rgba(74,222,128,0.15)', color: '#4ADE80', padding: '2px 6px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>+12.5%</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>Savings Goal</div>
                      <div style={{ fontSize: '0.85rem', opacity: 0.8, color: '#E8C37C' }}>68% Complete</div>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: '68%', height: '100%', background: '#C8963E', borderRadius: '10px' }} />
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <div style={{ opacity: 0.65, fontSize: '0.7rem', marginBottom: '2px' }}>Top Category</div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFDF8' }}>Food &amp; Dining</div>
                    </div>
                    <div style={{ width: '32px', height: '32px', background: '#C8963E', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0305" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m19 9-7 7-7-7"/></svg>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2 (Golden Gradient + Black Text) */}
                <div className="xpense-card-float" style={{
                  position: 'absolute', bottom: '5%', right: '-10%', width: '100%', maxWidth: '240px',
                  background: 'linear-gradient(135deg, #C8963E 0%, #F5D79B 100%)', padding: '24px', borderRadius: '24px',
                  boxShadow: '0 20px 45px rgba(200, 150, 62, 0.35)', zIndex: 4, color: '#0A0305', transform: 'rotate(-3deg)'
                }}>
                  <div style={{ fontWeight: 900, marginBottom: '8px', fontSize: '1rem', color: '#0A0305' }}>✦ Goal Tracking</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.95, marginBottom: '16px', color: 'rgba(10,3,5,0.85)' }}>Achieve milestones faster</div>
                  <div className="xpense-details">
                    <div style={{ padding: '12px', background: 'rgba(0,0,0,0.07)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>Investment</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>68% Complete</div>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(0,0,0,0.12)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: '68%', height: '100%', background: '#0A0305', borderRadius: '10px' }} />
                      </div>
                    </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

        {/* ── Waitlist / App Showcase ── */}
        <AppShowcase />

        {/* ── Download Section ── */}
        <DownloadSection />
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

          .services-grid > a {
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
            width: 42px;
            height: 42px;
            border-radius: 50%;
            border: none;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: 700;
            background: white;
            color: #7A0042;
            box-shadow: 0 8px 24px rgba(0,0,0,0.18);
            cursor: pointer;
          }

          .servicesArrowLeft {
            left: -6px;
          }

          .servicesArrowRight {
            right: -6px;
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

        .service-premium-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(122,0,66,0.12);
        }

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
          background: #4A148C;
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

        .xpense-card-float:hover {
          z-index: 10 !important;
        }

        .xpense-card-float:hover .xpense-details {
          max-height: 120px;
          opacity: 1;
          margin-top: 16px;
        }
      ` }} />
      </>
  );
}