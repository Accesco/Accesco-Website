'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './homepage.css';
import AccescoHeader from '../components/AccescoHeader';
import Hero from '../components/Hero';
import AppShowcase from '../components/AppShowcase';
import DownloadSection from '../components/DownloadSection';
import Footer from '../components/Footer';

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <AccescoHeader />

      <main>
        {/* ── Hero Section ── */}
        <Hero />

        {/* ── Services Section — Premium Redesign ── */}
        <section id="services" style={{ padding: '100px 0', background: '#FFFDF8', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(122,0,66,0.03) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(200,150,62,0.03) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px', position: 'relative' }}>
            <div style={{ marginBottom: '60px' }}>
              <div className="ac-chip ac-chip-maroon" style={{ marginBottom: '18px' }}>
                Your Daily Services
              </div>
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
                From Fresh groceries to curated meals, fast curated fashion delivery to instant medicine- Intelligent hyperlocal commerce that fits your life.
              </p>
            </div>

            <div className="services-container-wrapper">

              <div id="services-scroll-container" className="services-grid">
                <a href="/services/grokly" style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="service-premium-card grokly-card">
                    <div className="service-card-visual">
                      <Image src="/images/grokly-new.png" alt="Grokly Groceries" fill style={{ objectFit: 'cover' }} />
                      <div className="service-icon-circle">
                        <Image src="/images/grokly-icon.png" alt="Grokly" width={32} height={32} style={{ objectFit: 'contain', width: '32px', height: '32px' }} />
                      </div>
                    </div>
                    <div className="service-card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 className="service-card-name">Grokly</h3>
                        <span className="service-tag-green">22 mins</span>
                      </div>
                      <p className="service-card-desc">Fresh groceries to your door, fast.</p>
                      <div className="service-card-meta">
                        <span>10 AM – 11 PM</span>
                        <span>5 km radius</span>
                      </div>
                      <div className="service-card-cta grokly-btn">Shop Groceries</div>
                    </div>
                  </div>
                </a>

                <a href="/services/swadisht" style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="service-premium-card swadisht-card">
                    <div className="service-card-visual">
                      <Image src="/images/swadisht-new.png" alt="Swadishtt Meals" fill style={{ objectFit: 'cover' }} />
                      <div className="service-icon-circle">
                        <Image src="/images/swadisht/swadisht-icon.png" alt="Swadishtt" width={32} height={32} style={{ objectFit: 'contain', width: '32px', height: '32px' }} />
                      </div>
                    </div>
                    <div className="service-card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 className="service-card-name">Swadishtt</h3>
                        <span className="service-tag-red">35 mins</span>
                      </div>
                      <p className="service-card-desc">Home-style meals, delivered warm.</p>
                      <div className="service-card-meta">
                        <span>200+ Dishes</span>
                        <span>Hot &amp; Fresh</span>
                      </div>
                      <div className="service-card-cta swadishtt-btn">Order Food</div>
                    </div>
                  </div>
                </a>

                <a href="/services/instastyle" style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="service-premium-card instastyle-card">
                    <div className="service-card-visual">
                      <Image src="/images/fashion-new.png" alt="InstaStyle Fashion" fill style={{ objectFit: 'cover' }} />
                      <div className="service-icon-circle">
                        <Image src="/images/instastyle-icon.png" alt="InstaStyle" width={32} height={32} style={{ objectFit: 'contain', width: '32px', height: '32px' }} />
                      </div>
                    </div>
                    <div className="service-card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 className="service-card-name">InstaStyle</h3>
                        <span className="service-tag-purple">Trending</span>
                      </div>
                      <p className="service-card-desc">Rent the runway, own the moment.</p>
                      <div className="service-card-meta">
                        <span>Premium Brands</span>
                        <span>3–7 Days</span>
                      </div>
                      <div className="service-card-cta instastyle-btn">Explore Fashion</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            .services-container-wrapper { position: relative; width: 100%; display: flex; align-items: center; }
            .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; width: 100%; }
            @media (max-width: 960px) {
              .services-grid { 
                display: flex; 
                overflow-x: auto; 
                scroll-snap-type: x mandatory; 
                padding: 20px; 
                gap: 20px;
                scroll-padding: 0 20px;
                scrollbar-width: thin;
              }
              .services-grid::-webkit-scrollbar { display: block; height: 6px; }
              .services-grid::-webkit-scrollbar-track { background: transparent; }
              .services-grid::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
              .services-grid > a { 
                flex: 0 0 calc(100% - 40px); 
                scroll-snap-align: center; 
              }
              .scroll-arrow { display: none !important; }
              .services-container-wrapper { padding: 0; }
            }

            .xpense-box-container {
              max-width: 1200px;
              margin: 0 auto;
              width: 92%;
              box-sizing: border-box;
              overflow: visible;
            }

            @media (max-width: 960px) {
              .xpense-box-container { 
                grid-template-columns: 1fr !important; 
                padding: 40px 16px !important; 
                gap: 24px !important; 
                text-align: center !important;
                border-radius: 20px !important;
                margin: 0 auto !important;
                width: 95% !important;
              }       }

            @media (max-width: 480px) {
              .scroll-arrow { width: 40px; height: 40px; font-size: 20px; }
            }

            .service-premium-card { background: #fff; border-radius: 24px; border: 1px solid rgba(122,0,66,0.08); overflow: hidden; transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s cubic-bezier(0.22,1,0.36,1); cursor: pointer; height: 100%; }
            .service-premium-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(122,0,66,0.12); }
            .service-card-visual { height: 200px; position: relative; overflow: hidden; }
            .service-card-body { padding: 24px; }
            .service-card-name { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.35rem; color: #1A0A0F; margin: 0; }
            .service-tag-green { background: rgba(46,125,50,0.1); color: #2E7D32; font-family: 'Sora', sans-serif; font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 9999px; }
            .service-tag-red { background: rgba(122,0,66,0.08); color: #7A0042; font-family: 'Sora', sans-serif; font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 9999px; }
            .service-tag-purple { background: rgba(74,20,140,0.08); color: #4A148C; font-family: 'Sora', sans-serif; font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 9999px; }
            .service-icon-circle { position: absolute; bottom: -20px; right: 24px; width: 44px; height: 44px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); z-index: 2; transition: transform 0.3s cubic-bezier(0.22,1,0.36,1); }
            .service-premium-card:hover .service-icon-circle { transform: translateY(-4px) scale(1.1); }
            .service-card-desc { font-family: 'DM Sans', sans-serif; font-size: 0.92rem; color: #6B5B65; margin: 0 0 16px; }
            .service-card-meta { display: flex; gap: 16px; margin-bottom: 20px; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; color: #9E8E98; }
            .service-card-cta { display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 12px; border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 0.85rem; font-weight: 700; transition: all 0.3s; margin-top: 4px; }
            .grokly-btn { background: rgba(46,125,50,0.08); color: #2E7D32; }
            .swadishtt-btn { background: rgba(122,0,66,0.06); color: #7A0042; }
            .instastyle-btn { background: rgba(74,20,140,0.06); color: #4A148C; }
            .service-premium-card:hover .grokly-btn { background: #2E7D32; color: #fff; }
            .service-premium-card:hover .swadishtt-btn { background: #7A0042; color: #fff; }
            .service-premium-card:hover .instastyle-btn { background: #4A148C; color: #fff; }
            .xpense-card-float { transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); cursor: pointer; }
            .xpense-details { max-height: 0; opacity: 0; overflow: hidden; transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); margin-top: 0; }
            .xpense-card-float:hover { transform: translateY(-10px) scale(1.05) rotate(0deg) !important; z-index: 10 !important; box-shadow: 0 30px 60px rgba(0,0,0,0.15) !important; }
            .xpense-card-float:hover .xpense-details { max-height: 120px; opacity: 1; margin-top: 16px; }
          ` }} />
        </section>

        {/* ── Xpense Meter Section ── */}
        <section style={{ padding: '80px 0', background: '#FFFDF8', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
            <div style={{
              background: '#FFF5F7', borderRadius: '48px', padding: '100px 80px',
              border: '1px solid #FFE5E9', display: 'grid',
              gridTemplateColumns: '1fr 1.2fr', gap: '80px', alignItems: 'center',
              position: 'relative', overflow: 'hidden'
            }} className="xpense-box-container">
              <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(122, 0, 66, 0.04) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
              <div>
                <div className="ac-chip ac-chip-maroon" style={{ marginBottom: '20px' }}>Financial Intelligence</div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#1A0A0F', margin: '0 0 20px', lineHeight: 1.1 }}>
                  Xpense<br /><span className="ac-gradient-text">Meter</span>
                </h2>
                <p style={{ fontSize: '1.05rem', color: '#6B5B65', lineHeight: 1.75, marginBottom: '36px' }}>
                  Transform your financial habits with intelligent expense tracking and predictive analytics.
                </p>
                <Link href="/calculator" style={{ display: 'inline-block', padding: '14px 32px', background: '#1A0A0F', color: '#FFFDF8', borderRadius: '9999px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', position: 'relative', zIndex: 2 }}>
                  Launch Calculator →
                </Link>
              </div>

              <div style={{ position: 'relative', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="xpense-visual-wrap">
                <div className="xpense-card-float" style={{ position: 'absolute', top: '5%', right: '0%', width: '260px', background: '#FFFDF8', padding: '24px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(122,0,66,0.12)', border: '2px solid #FFE5E9', zIndex: 3, transform: 'rotate(2deg)', color: '#000' }}>
                  <div style={{ color: '#7A0042', fontWeight: 900, marginBottom: '8px', fontSize: '1rem' }}>✦ Smart Categorization</div>
                  <div style={{ fontSize: '0.85rem', color: '#1A0A0F', fontWeight: 600 }}>AI-powered automatic expense sorting</div>
                  <div className="xpense-details">
                    <div style={{ background: '#FDF2F5', padding: '12px', borderRadius: '12px', border: '1px solid rgba(122,0,66,0.1)', marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}><span style={{ color: '#1A0A0F', fontWeight: 500 }}>Groceries</span><span style={{ fontWeight: 800, color: '#7A0042' }}>45%</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span style={{ color: '#1A0A0F', fontWeight: 500 }}>Dining</span><span style={{ fontWeight: 800, color: '#7A0042' }}>25%</span></div>
                    </div>
                  </div>
                </div>

                <div style={{ width: '100%', maxWidth: '280px', background: '#1A0A0F', boxShadow: '0 40px 100px rgba(26,10,15,0.2)', borderRadius: '32px', padding: '32px', position: 'relative', zIndex: 2, color: '#FFFDF8' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ opacity: 0.6, fontSize: '0.7rem', marginBottom: '4px' }}>Monthly Overview</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>₹45,280</div>
                      <div style={{ background: 'rgba(46,125,50,0.15)', color: '#4ADE80', padding: '2px 6px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>+12.5%</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Savings Goal</div>
                      <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>68% Complete</div>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: '68%', height: '100%', background: '#C8963E', borderRadius: '10px' }} />
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ opacity: 0.6, fontSize: '0.7rem', marginBottom: '2px' }}>Top Category</div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Food &amp; Dining</div>
                    </div>
                    <div style={{ width: '32px', height: '32px', background: '#7A0042', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m19 9-7 7-7-7"/></svg>
                    </div>
                  </div>
                </div>

                <div className="xpense-card-float" style={{ position: 'absolute', bottom: '5%', left: '0%', width: '260px', background: '#C8963E', padding: '24px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(200,150,62,0.2)', zIndex: 1, color: '#000', transform: 'rotate(-3deg)' }}>
                  <div style={{ fontWeight: 900, marginBottom: '8px', fontSize: '1rem' }}>✦ Goal Tracking</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9, marginBottom: '16px' }}>Achieve milestones faster</div>
                  <div className="xpense-details">
                    <div style={{ padding: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>Investment</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>68% Complete</div>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(0,0,0,0.15)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: '68%', height: '100%', background: '#000', borderRadius: '10px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            .xpense-box-container {
              max-width: 1200px;
              margin: 0 auto;
              width: calc(100% - 40px);
              box-sizing: border-box;
            }
            @media (max-width: 960px) {
              .xpense-box-container { 
                grid-template-columns: 1fr !important; 
                padding: 48px 20px !important; 
                gap: 32px !important; 
                text-align: center !important;
                border-radius: 24px !important;
                margin: 0 10px !important;
                width: calc(100% - 20px) !important;
              }
              .xpense-visual-wrap { 
                height: auto !important;
                margin-top: 16px !important;
                display: flex !important;
                justify-content: center !important;
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
          ` }} />
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
    </>
  );
}
