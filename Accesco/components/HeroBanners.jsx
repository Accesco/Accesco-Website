'use client';

import Image from 'next/image';
import Link from 'next/link';

/**
 * HeroBanners.jsx — Cinematic premium hero banners with full overlay and copy.
 */

/* ── Shared styles ────────────────────────────────── */
const heroSection = {
  position: 'relative',
  width: '100%',
  height: 'clamp(320px, 45vw, 560px)',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'flex-end',
};

const chip = (color = '#7A0042') => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '5px 14px',
  borderRadius: '9999px',
  background: 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.25)',
  color: '#fff',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: '12px',
});

const dot = (color = '#4ade80') => ({
  width: 7,
  height: 7,
  borderRadius: '50%',
  background: color,
  boxShadow: `0 0 6px ${color}`,
  animation: 'heroPulse 2s infinite',
});

/* ── Grokly Hero ──────────────────────────────────── */
export function GroklyHero() {
  return (
    <section style={heroSection}>
      <style>{`
        @keyframes heroPulse { 
          0%,100%{opacity:1;transform:scale(1)} 
          50%{opacity:.6;transform:scale(1.25)} 
        }

        .hero-inner-grokly { 
          position:absolute;
          inset:0; 
        }

        .hero-inner-grokly img { 
          width:100%;
          height:100%;
          object-fit: cover;
          object-position: center 75%;
        }

        /* 🔥 MOBILE ONLY IMAGE CHANGE */
        @media (max-width: 768px) {
          section {
            height: 500px !important;
          }

          .hero-inner-grokly img {
            content: url('/images/banners/hero-grokly-mobile.jpg');
            object-position: center bottom;
          }
        }
      `}</style>

      {/* Image */}
      <div className="hero-inner-grokly">
        <img 
          src="/images/banners/hero-grokly.jpg" 
          alt="Grokly fresh groceries" 
        />
      </div>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(10,30,10,0.82) 0%, rgba(10,30,10,0.35) 55%, transparent 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(24px, 4vw, 56px) clamp(20px, 4vw, 48px)',
      }}>
        <div style={{ marginBottom: '14px' }}>
          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            letterSpacing: '0.22em',
            color: '#ffffff',
            textTransform: 'uppercase',
            marginBottom: '6px',
            marginLeft: '-0.06em',
          }}>
            GROKLY
          </div>

          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#fff',
          }}>
            Fresh groceries, thoughtfully curated
          </div>
        </div>

        <h1 style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(1.3rem, 3vw, 2.4rem)',
          color: '#fff',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          margin: '0 0 10px',
          maxWidth: 560,
        }}>
          Groceries in 
          <span style={{ color: '#4ade80' }}> 11 minutes flat.</span>
        </h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
          color: 'rgba(255,255,255,0.82)',
          margin: '0 0 24px',
          maxWidth: 440,
        }}>
          Farm-fresh essentials sourced directly from Karnataka farms. No middlemen. Full transparency.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/services/grokly" style={{
            padding: '11px 28px', borderRadius: 9999,
            background: '#4ade80', color: '#0a1e0a',
            fontFamily: "'Sora', sans-serif", fontWeight: 800,
            fontSize: '0.88rem', textDecoration: 'none',
            transition: 'all 0.25s',
          }}>
            Shop Now →
          </Link>

          <span style={{
            padding: '11px 20px', borderRadius: 9999,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', fontSize: '0.85rem',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Free delivery on ₹199+
          </span>
        </div>
      </div>
    </section>
  );
}

/* ── Swadishtt Hero ───────────────────────────────── */
export function SwadishttHero() {
  return (
    <section style={heroSection}>
      <style>{`
        .hero-inner-sw { position:absolute;inset:0; }
        .hero-inner-sw img { width:100%;height:100%;object-fit:cover;object-position:center 60%; }

   @media (max-width: 768px) {
  .hero-content-swadishtt {
    position: absolute !important;
    left: 20px !important;
    right: 20px !important;
    bottom: 24px !important;
    top: auto !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .hero-content-swadishtt h1 {
    font-size: 1.4rem !important;
    line-height: 1.15 !important;
    margin: 0 0 8px !important;
    max-width: 310px !important;
  }

  .hero-content-swadishtt p {
    font-size: 0.85rem !important;
    line-height: 1.4 !important;
    margin: 0 0 14px !important;
    max-width: 310px !important;
  }

  .hero-content-swadishtt a,
  .hero-content-swadishtt span {
    padding: 9px 16px !important;
    font-size: 0.8rem !important;
  }
}
      `}</style>

      <div className="hero-inner-sw">
        <img src="/images/banners/hero-swadishtt.png" alt="Swadishtt home-style meals" />
      </div>

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(60,10,10,0.88) 0%, rgba(60,10,10,0.4) 55%, transparent 100%)',
      }} />

      <div className="hero-content-swadishtt" style={{
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(24px, 4vw, 56px) clamp(20px, 4vw, 48px)',
      }}>
        <h1 style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(1.6rem, 4vw, 3.2rem)',
          color: '#fff',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          margin: '0 0 10px',
          maxWidth: 560,
        }}>
          Ghar jaisa khana,<br />
          <span style={{ color: '#fbbf24' }}>30 minutes away.</span>
        </h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
          color: 'rgba(255,255,255,0.82)',
          margin: '0 0 24px',
          maxWidth: 440,
        }}>
          200+ dishes from our cloud kitchens. Hot, fresh, and built for the Indian household.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/services/swadisht" style={{
            padding: '11px 28px', borderRadius: 9999,
            background: '#E23744', color: '#fff',
            fontFamily: "'Sora', sans-serif", fontWeight: 800,
            fontSize: '0.88rem', textDecoration: 'none',
          }}>
            Order Food →
          </Link>

          <span style={{
            padding: '11px 20px', borderRadius: 9999,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', fontSize: '0.85rem',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            ₹0 delivery on first order
          </span>
        </div>
      </div>
    </section>
  );
}

/* ── Accesco About Hero ───────────────────────────── */
export function AccescoHero() {
  return (
    <section style={{
      ...heroSection,
      height: '480px',
      alignItems: 'center',
    }}>
      <style>{`
        .hero-inner-ac { position:absolute;inset:0; }
        .hero-inner-ac img { width:100%;height:100%;object-fit:cover;object-position:center; }
      `}</style>

      <div className="hero-inner-ac">
        <img src="/images/banners/hero-main.jpg" alt="Accesco Living" />
      </div>

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(26,10,15,0.95) 0%, rgba(26,10,15,0.7) 50%, rgba(26,10,15,0.4) 100%)',
      }} />

      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: 1200, margin: '0 auto',
        padding: '120px clamp(20px, 4vw, 48px) 40px',
      }}>
        <h1 style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(1.6rem, 4vw, 3.2rem)',
          color: '#fff',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          margin: '0 0 10px',
          maxWidth: 620,
        }}>
          The household platform<br />
          <span style={{ color: '#c8963e' }}>India was waiting for.</span>
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
          color: 'rgba(255,255,255,0.82)',
          margin: '0 0 24px',
          maxWidth: 480,
        }}>
          Groceries. Food. Fashion. One intelligent ecosystem built around the way you live.
        </p>
      </div>
    </section>
  );
}

