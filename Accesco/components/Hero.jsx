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
          height: 100vh;
          height: 100svh;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
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
          padding: 80px 20px 40px;
        }

        .hero-logo-img {
          width: clamp(60px, 10vw, 120px);
          height: auto;
          filter: drop-shadow(0 10px 30px rgba(255, 255, 255, 0.3));
          margin-bottom: clamp(10px, 2vh, 20px);
        }

        .hero-title {
          font-size: clamp(32px, 6vw, 72px);
          font-weight: 900;
          margin-bottom: 8px;
          letter-spacing: -1.5px;
          line-height: 1.1;
        }

        .hero-kicker {
          display: block;
          color: #fff;
          font-weight: 800;
          letter-spacing: -0.3px;
          text-transform: none;
          font-size: clamp(20px, 4.5vw, 36px);
          line-height: 1.2;
          text-align: center;
          margin-bottom: clamp(12px, 2vh, 16px);
          background: transparent;
          text-shadow: none;
        }

        .hero-sub {
          font-size: clamp(14px, 2.5vw, 20px);
          max-width: 700px;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.95);
          margin: 0 auto clamp(20px, 3vh, 32px);
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
          height: 64px;
          padding: 0 56px;
          border-radius: 60px;
          font-weight: 900;
          font-size: clamp(18px, 2.5vw, 22px);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(245,184,0,0.35);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
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
          gap: 10px;
          color: #FFFDF8;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          animation: bounce 2s infinite;
          text-decoration: none;
          margin-top: clamp(25px, 6vh, 45px);
          opacity: 0.9;
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
            gap: 8px !important;
            width: 100% !important;
            max-width: 320px !important;
            margin: 0 auto !important;
          }
          .hero-app-buttons .app-btn-link { flex: 1; max-width: 140px; }
          .hero-app-buttons .app-btn-link img { 
            height: 38px !important; 
            width: 100% !important;
            object-fit: contain;
          }
          .cta-pill { width: 100%; max-width: 240px; }
          .scroll-down-btn { margin-top: 15px; }
        }
        
        @media (max-height: 700px), (max-width: 768px) {
          .hero { height: 100svh !important; justify-content: center !important; }
          .hero-grid { transform: scale(1); margin-top: 10px; padding: 60px 20px 20px; }
          .scroll-down-btn { display: inline-flex !important; margin-top: 15px; }
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
          width={100}
          height={100}
          priority
          style={{ width: 'clamp(80px, 12vh, 120px)', height: 'clamp(80px, 12vh, 120px)', objectFit: 'contain', marginBottom: '10px' }}
        />

        <h1 className="hero-title" style={{ fontSize: 'clamp(2.8rem, 8vh, 5.2rem)', marginBottom: '12px' }}>Accesco Living</h1>

        <div className="hero-kicker" style={{ fontSize: 'clamp(1.2rem, 3.2vh, 2rem)', marginBottom: '15px', fontWeight: 800 }}>
          India&apos;s #1 Intelligent Circular Commerce Ecosystem
        </div>

        <p className="hero-sub" style={{ fontSize: 'clamp(0.85rem, 1.8vh, 1.15rem)', maxWidth: '600px', margin: '0 auto 15px', lineHeight: 1.4 }}>
          Delivering Groceries, Food, Fashion, and Financial Intelligence — all under one unified platform
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
