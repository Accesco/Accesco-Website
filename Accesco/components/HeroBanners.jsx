'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useState, useEffect } from 'react';
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

        @media (max-width: 768px) {
  section {
    height: 340px !important;
    min-height: 340px !important;
  }

  .hero-inner-sw img {
    height: 100% !important;
    object-fit: cover !important;
    object-position: center 58% !important;
  }

  .hero-content-swadishtt {
    position: absolute !important;
    left: 20px !important;
    right: 20px !important;
    bottom: 20px !important;
    top: auto !important;
    padding: 0 !important;
    margin: 0 !important;
  }
        }
      `}</style>

      {/* Image */}
      <div className="hero-inner-grokly">
        <Image 
          src="/images/banners/hero-grokly.jpg" 
          alt="Grokly fresh groceries" 
          width={1200}
          height={600}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
            Shop Now
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
  const banners = [
    {
      image: '/images/banners/hero-swadishtt.png',
  title: 'Ghar jaisa khana,',
  highlight: '30 minutes away.',
  description:
    '200+ dishes from our cloud kitchens. Hot, fresh, and built for the Indian household.',
  showButtons: true,
    },
    {
      image: '/images/banners/hero-swadishtt-1.png',
      title: 'Craving something special?',
      highlight: 'Order it fresh.',
      description:
        'From biryani to comfort meals, get your favourites delivered hot and fast.',
    },
    {
      image: '/images/banners/hero-swadishtt-3.png'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();

    setTouchStart(null);
  };

  const activeBanner = banners[currentSlide];
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, 3000);

  return () => clearInterval(timer);
}, [banners.length]);
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        padding: '96px 16px 15px',
        background: `
  radial-gradient(
    circle at top left,
    rgba(220, 30, 30, 0.22) 0%,
    rgba(220, 30, 30, 0.10) 20%,
    rgba(255, 255, 255, 0) 54%
  ),
  linear-gradient(
    to bottom right,
    #fff5f5 0%,
    #fff8f8 42%,
    #ffffff 100%
  )
`,
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .hero-inner-sw {
          position: absolute;
          inset: 0;
        }

        .hero-inner-sw img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
        }

        .hero-arrow-sw {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 4;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.28);
          background: rgba(0,0,0,0.22);
          color: #fff;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          transition: all 0.25s ease;
        }

        .hero-arrow-sw:hover {
          background: rgba(0,0,0,0.38);
        }

        .hero-arrow-left-sw {
          left: 14px;
        }

        .hero-arrow-right-sw {
          right: 14px;
        }

        .hero-dots-sw {
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          display: flex;
          gap: 8px;
        }

        .hero-dot-sw {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          border: none;
          background: rgba(255,255,255,0.45);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .hero-dot-sw.active {
          width: 24px;
          background: #fff;
        }

        @media (max-width: 1024px) {
          .hero-card-sw {
            aspect-ratio: 1850 / 900 !important;
          }
        }

        @media (max-width: 768px) {
          .swadishtt-hero-section {
            padding: 40px 16px 15px !important;
          }
          .hero-card-sw {
            aspect-ratio: 16 / 9 !important;
            border-radius: 16px !important;
          }
          .hero-content-swadishtt {
            position: absolute !important;
            left: 20px !important;
            right: 20px !important;
            bottom: 30px !important;
            top: auto !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .hero-content-swadishtt h1 {
            font-size: 1.6rem !important;
            margin-bottom: 8px !important;
          }
          .hero-content-swadishtt p {
            font-size: 0.85rem !important;
            max-width: 100% !important;
          }
          .hero-cta-sw {
            display: none !important;
          }
          .hero-arrow-sw {
            display: none !important;
          }
          .hero-dots-sw {
            bottom: 12px !important;
            z-index: 5 !important;
          }
        }
      `}</style>

      <div
        className="hero-card-sw"
        onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1850px',
          aspectRatio: '1850 / 720',
          margin: '0 auto',
          borderRadius: '34px',
          overflow: 'hidden',
          boxShadow: '0 28px 80px rgba(0,0,0,0.18)',
        }}
      >
        <div className="hero-inner-sw">
          <Image src={activeBanner.image} alt="Swadishtt hero banner" width={1850} height={720} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(
                90deg,
                rgba(45, 0, 0, 0.82) 0%,
                rgba(100, 0, 0, 0.56) 38%,
                rgba(150, 0, 0, 0.16) 70%,
                rgba(40, 0, 0, 0.08) 100%
              ),
              radial-gradient(
                circle at top left,
                rgba(255, 80, 80, 0.12),
                transparent 44%
              )
            `,
          }}
        />

        <button
          className="hero-arrow-sw hero-arrow-left-sw"
          onClick={(e) => {
  e.stopPropagation();
  prevSlide();
}}
          aria-label="Previous banner"
        >
          ‹
        </button>

        <button
          className="hero-arrow-sw hero-arrow-right-sw"
          onClick={(e) => {
  e.stopPropagation();
  nextSlide();
}}
          aria-label="Next banner"
        >
          ›
        </button>

        <div
          className="hero-content-swadishtt"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(40px, 5vw, 78px)',
          }}
        >
          <h1
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 850,
              fontSize: 'clamp(2.1rem, 3.6vw, 4.5rem)',
              color: '#fff',
              letterSpacing: '-0.045em',
              lineHeight: 1.02,
              margin: '0 0 18px',
              maxWidth: 620,
              textShadow: '0 8px 24px rgba(0,0,0,0.22)',
            }}
          >
            {activeBanner.title}
            <br />
            <span
              style={{
                color: '#fbbf24',
                fontWeight: 500,
              }}
            >
              {activeBanner.highlight}
            </span>
          </h1>

          <>
  <p
    style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 'clamp(0.95rem, 1.25vw, 1.08rem)',
      color: 'rgba(255,255,255,0.88)',
      margin: 0,
      maxWidth: 500,
      lineHeight: 1.55,
      textShadow: '0 4px 16px rgba(0,0,0,0.20)',
    }}
  >
    {activeBanner.description}
  </p>

  {activeBanner.showButtons && (
    <div
  className="hero-cta-sw"
  style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
>
      
      <Link
        href="/services/swadisht"
        style={{
          padding: '11px 28px',
          borderRadius: 9999,
          background: '#E23744',
          color: '#fff',
          fontFamily: "'Sora', sans-serif",
          fontWeight: 800,
          fontSize: '0.88rem',
          textDecoration: 'none',
          boxShadow: '0 10px 24px rgba(226,55,68,0.28)',
        }}
      >
        Order Food
      </Link>

      <span
        style={{
          padding: '11px 20px',
          borderRadius: 9999,
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          fontSize: '0.85rem',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        ₹0 delivery on first order
      </span>
    </div>
  )}
</>
        </div>

        <div className="hero-dots-sw">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`hero-dot-sw ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 
/* ── Accesco About Hero ───────────────────────────── */
export function AccescoHero() {
  return (
    <section
      style={{
        ...heroSection,
        height: '650px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <picture>
        <source
          media="(max-width: 768px)"
          srcSet="/images/banners/join-mobile.jpg"
        />

        <Image
          src="/images/banners/join-desktop.jpg"
          alt="Accesco Living"
          width={1920}
          height={650}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 10%',
          }}
        />
      </picture>
    </section>
  );
}