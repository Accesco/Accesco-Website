'use client';

import React from 'react';
import Image from 'next/image';

export default function Hero() {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed, user interaction may be required:", error);
      });
    }
  }, []);

  return (
    <section className="hero" id="home">
      <style jsx>{`
        .hero {
          min-height: 100vh;
          background: #000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 0 20px 60px 20px;
        }

        .hero-bg-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.8;
          z-index: 0;
        }

        .hero-grid {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
          color: #fff;
          padding-top: 120px;
          width: 100%;
        }

        .hero-logo-img {
          width: 120px;
          height: 120px;
          filter: drop-shadow(0 10px 30px rgba(255, 255, 255, 0.3));
        }

        .hero-title {
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 900;
          margin-bottom: 10px;
          letter-spacing: -2px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .hero-kicker {
          display: block;
          color: #fff;
          font-weight: 800;
          letter-spacing: -0.3px;
          text-transform: none;
          font-size: clamp(22px, 4vw, 34px);
          line-height: 1.25;
          text-align: center;
          text-shadow: 0 2px 16px rgba(0,0,0,0.5);
        }

        .hero-sub {
          font-size: clamp(16px, 2.5vw, 22px);
          max-width: 700px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 auto 40px;
        }

        .cta-pill {
          background: white;
          color: #1f0f12;
          padding: 16px 40px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(245,184,0,0.35);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .cta-pill:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(245,184,0,0.5);
        }

        .hero-app-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 40px;
        }

        .app-btn-link img {
          height: 50px;
          width: auto;
          transition: transform 0.2s ease;
        }

        .app-btn-link:hover img {
          transform: translateY(-3px);
        }

        .scroll-down-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          animation: bounce 2s infinite;
          text-decoration: none;
          margin-top: 40px;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }

        @media (max-width: 768px) {
          .hero { min-height: 90vh; padding: 0 20px 40px; }
          .hero-grid { padding-top: 110px; }
          .hero-app-buttons { flex-direction: column; align-items: center; }
          .app-btn-link img { height: 45px; }
        }
      `}</style>

      <video 
        ref={videoRef}
        className="hero-bg-video" 
        autoPlay 
        muted 
        loop 
        playsInline 
        preload="auto"
        style={{ pointerEvents: 'none' }}
      >
        <source src="/images/start.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="hero-grid">
        <Image
          src="/images/accesco_white.png"
          className="hero-logo-img"
          alt="accesco logo"
          width={120}
          height={120}
          priority
          style={{ width: '120px', height: '120px', objectFit: 'contain' }}
        />

        <h1 className="hero-title">Accesco Living</h1>

        <div className="hero-kicker">
          India&apos;s  #1  intelligent delivery app
        </div>

        <p className="hero-sub">
          Experience seamless curated meals, grocery & fashion essentials ordering at your doorstep
        </p>

        <div className="hero-ctas">
          <a href="#app-showcase">
            <button className="cta-pill">
              Join Waitlist
            </button>
          </a>
        </div>

        <div className="hero-app-buttons">
          <a href="#" className="app-btn-link">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Get it on Google Play"
            />
          </a>
          <a href="#" className="app-btn-link">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
              alt="Download on the App Store"
            />
          </a>
        </div>

        <a href="#services" className="scroll-down-btn">
          Scroll down <i className="ri-arrow-down-s-line"></i>
        </a>
      </div>
    </section>
  );
}
