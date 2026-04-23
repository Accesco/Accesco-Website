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
          min-height: 100svh;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: visible;
          padding: 60px 20px;
          box-sizing: border-box;
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
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }

        .hero-logo-img {
          width: clamp(60px, 10vw, 120px);
          height: auto;
          filter: drop-shadow(0 10px 30px rgba(255, 255, 255, 0.3));
          margin-bottom: clamp(10px, 2vh, 20px);
        }

        .hero-title {
          font-size: clamp(28px, 5vw, 64px);
          font-weight: 900;
          margin-bottom: 8px;
          letter-spacing: -1.5px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          line-height: 1.1;
        }

        .hero-kicker {
          display: block;
          color: #fff;
          font-weight: 800;
          letter-spacing: -0.3px;
          text-transform: none;
          font-size: clamp(16px, 3.5vw, 28px);
          line-height: 1.2;
          text-align: center;
          text-shadow: 0 2px 16px rgba(0,0,0,0.5);
          margin-bottom: clamp(8px, 2vh, 12px);
        }

        .hero-sub {
          font-size: clamp(13px, 2vw, 18px);
          max-width: 600px;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 auto clamp(16px, 3vh, 24px);
        }

        .hero-action-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(12px, 2vh, 20px);
          margin-top: 10px;
          width: 100%;
        }

        .hero-ctas {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .cta-pill {
          background: white;
          color: #1f0f12;
          padding: clamp(10px, 2vh, 14px) clamp(24px, 4vw, 36px);
          border-radius: 50px;
          font-weight: 800;
          font-size: clamp(13px, 1.5vw, 15px);
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
          gap: 12px;
          justify-content: center;
          flex-wrap: nowrap;
          align-items: center;
        }

        .app-btn-link img {
          height: clamp(30px, 5vh, 44px);
          width: auto;
          transition: transform 0.2s ease;
          display: block;
        }

        .app-btn-link:hover img {
          transform: translateY(-3px);
        }

        .scroll-down-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          animation: bounce 2s infinite;
          text-decoration: none;
          margin-top: clamp(15px, 4vh, 30px);
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }

        @media (max-width: 768px) {
          .hero { 
            min-height: auto !important; 
            padding: 100px 20px 60px !important; 
          }
          .hero-action-group { gap: 16px; }
          .hero-app-buttons { 
            display: flex !important; 
            flex-direction: row !important;
            justify-content: center !important;
            gap: 10px !important;
          }
          .hero-app-buttons .app-btn-link img { height: 36px !important; }
          .cta-pill { width: 100%; max-width: 240px; }
          .scroll-down-btn { margin-top: 15px; }
        }
        
        @media (max-height: 600px) {
          .hero { padding: 30px 20px; justify-content: flex-start; }
          .hero-grid { transform: scale(0.9); transform-origin: top center; }
          .scroll-down-btn { display: none; }
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

        <div className="hero-action-group">
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
        </div>

        <a href="#services" className="scroll-down-btn">
          Scroll down <i className="ri-arrow-down-s-line"></i>
        </a>
      </div>
    </section>
  );
}
