'use client';

import Image from 'next/image';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <style jsx>{`
        .hero {
          position: relative;
          width: 100%;
          min-height: 100vh;
          min-height: 100svh;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
          font-family: 'Avenir Next', sans-serif;
          padding: 130px 20px 40px 20px;
          overflow: hidden;
        }

        .hero-bg-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 1;
          z-index: 0;
          filter: brightness(2);
        }
          .hero::after {
           content: "";
           position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 35%;
  background: linear-gradient(
  to bottom,
  transparent 0%,
  rgba(255, 182, 193, 0.3) 40%,
  #FFB6C1 100%
);
  z-index: 1;
  pointer-events: none;
}

        .hero-main-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 1000px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .hero-top-spacer {
          flex-grow: 1;
          min-height: 20px;
        }

        .hero-bottom-spacer {
          flex-grow: 1;
          min-height: 20px;
        }

        .hero-logo-img {
          width: clamp(120px, 16vw, 170px);
          height: auto;
          object-fit: contain;
        }

        .hero-title {
          font-family: 'Avenir Next', sans-serif;
          font-size: clamp(32px, 5.5vw, 54px);
          font-weight: 900;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: #fff;
          text-shadow: 0 4px 25px rgba(0,0,0,0.7);
        }

        .hero-kicker {
          display: block;
          color: #fff;
          font-family: 'Avenir Next', sans-serif;
          font-weight: 700;
          letter-spacing: -0.01em;
          font-size: clamp(18px, 3.8vw, 30px);
          line-height: 1.2;
          text-align: center;
          margin: 0;
          text-shadow: 0 4px 20px rgba(0,0,0,0.6);
        }

        .hero-sub {
          font-size: clamp(14px, 2vw, 18px);
          color: rgba(255, 255, 255, 0.9);
          font-weight: 400;
          line-height: 1.6;
          max-width: 750px;
          margin: 0;
          text-shadow: 0 2px 12px rgba(0,0,0,0.6);
        }

        .join-waitlist-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #FFF;
          color: #1A0A0F;
          font-family: 'Avenir Next', sans-serif;
          font-weight: 900;
          font-size: clamp(15px, 2.5vw, 18px);
          letter-spacing: 2px;
          padding: 14px 48px;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 12px 35px rgba(255,255,255,0.25);
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .join-waitlist-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 50px rgba(255,255,255,0.4);
        }

        .hero-app-buttons {
          display: flex;
          gap: 18px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .app-btn-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 12px;
          background: #fff;
          border: 1px solid rgba(255,255,255,0.55);
          box-shadow: 0 8px 24px rgba(0,0,0,0.22);
          transition: all 0.3s ease;
        }

        .app-btn-link img {
          height: clamp(44px, 6.5vw, 56px);
          width: auto;
          display: block;
          border-radius: 8px !important;
          background: transparent !important;
        }

        .scroll-down-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 3px;
          text-decoration: none;
          opacity: 0.8;
          transition: all 0.3s ease;
          margin-top: 32px;
          z-index: 10;
        }

        .scroll-down-btn:hover {
          opacity: 1;
          transform: translateY(4px);
        }

        .scroll-down-btn i {
          font-size: 24px;
          line-height: 1;
          margin-top: 6px;
          animation: hero-bounce 2s infinite;
          display: inline-block;
        }

        @keyframes hero-bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(6px);
          }
          60% {
            transform: translateY(3px);
          }
        }

        @media (max-width: 1024px) {
          .hero {
            padding: 120px 20px 40px 20px;
          }
          .hero-main-content {
            gap: 12px;
          }
          .hero-logo-img {
            width: 140px;
          }
          .hero-title {
            font-size: 32px;
          }
          .hero-kicker {
            font-size: 20px;
          }
          .hero-sub {
            font-size: 13px;
          }
        }

        @media (max-width: 768px) {
          .hero {
            padding: 90px 15px 40px 15px;
          }
          .hero-bottom-spacer {
            display: none;
          }
          .hero-main-content {
            gap: 12px;
          }
          .hero-logo-img {
            width: 90px;
          }
          .hero-title {
            font-size: 24px;
          }
          .hero-kicker {
            font-size: 16px;
          }
          .hero-sub {
            font-size: 12px;
          }
          .join-waitlist-btn {
            padding: 12px 36px;
            font-size: 14px;
            margin-top: 5px;
          }
          .app-btn-link {
            border-radius: 12px;
            padding: 2px;
          }
          .app-btn-link img { 
            height: 38px;
            border-radius: 10px !important;
          }
          .hero-app-buttons {
            margin-top: 5px;
          }
        }
      `}</style>

      {/* Decorative background video marked accessible-hidden for screen readers */}
      <video
        className="hero-bg-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/accesco_white.png"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/images/herovideo.MP4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Top Spacer */}
      <div className="hero-top-spacer"></div>

      <div className="hero-main-content">
        <Image
          src="/images/accesco_white.png"
          className="hero-logo-img"
          alt="Accesco Original White Logo"
          width={170}
          height={166}
          priority
          sizes="(max-width: 768px) 90px, 170px"
        />

        <h1 className="hero-title">Accesco Living</h1>

        <div className="hero-kicker">
          India's #1 Intelligent Circular Commerce Ecosystem
        </div>

        <div className="hero-sub">
          Accesco | India’s Intelligent delivery app
        </div>

        <a href="#services" className="scroll-down-btn">
          SCROLL DOWN <i className="ri-arrow-down-s-line"></i>
        </a>
      </div>

      {/* Bottom Spacer */}
      <div className="hero-bottom-spacer"></div>
    </section>
  );
}