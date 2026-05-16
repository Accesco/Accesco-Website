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
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100svh;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
          font-family: 'DM Sans', sans-serif;
          padding: 130px 20px 20px 20px; /* Reduced bottom padding to keep scroll button visible */
          overflow: hidden;
        }

        .hero-bg-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.85;
          z-index: 0;
        }

        .hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.3) 0%,
            rgba(0,0,0,0.5) 50%,
            rgba(0,0,0,0.9) 100%
          );
          z-index: 1;
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
          /* Removed margin: auto so flexGrow spacers handle vertical centering perfectly */
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
          /* Removed margin-bottom to ensure gap provides equal spacing */
        }

        .hero-title {
          font-family: 'Sora', sans-serif;
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
          font-family: 'Sora', sans-serif;
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
          font-family: 'Sora', sans-serif;
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
          gap: 16px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 10px;
        }

        .app-btn-link {
          display: inline-block;
          transition: transform 0.2s ease;
        }

        .app-btn-link img {
          height: clamp(36px, 6vw, 48px);
          width: auto;
          display: block;
        }

        .app-btn-link:hover {
          transform: translateY(-2px);
        }

        .scroll-down-btn {
          position: relative;
          z-index: 2;
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
          margin-top: 30px;
          margin-bottom: 0;
          padding-top: 0;
        }

        .scroll-down-btn:hover {
          opacity: 1;
          transform: translateY(4px);
        }
        
        .scroll-down-btn i {
          font-size: 24px;
          line-height: 1;
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
            padding: 90px 15px 40px 15px; /* Added padding top to avoid overlapping header */
          }
          .hero-bottom-spacer {
            display: none; /* Removes bottom spacer on mobile to push content down like Zomato */
          }
          .hero-main-content {
            gap: 12px;
          }
          .hero-logo-img {
            width: 90px; /* Reduced to fit all content within viewport */
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
          .app-btn-link img { 
            height: 32px;
          }
          .hero-app-buttons {
            margin-top: 5px;
          }
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
      >
        <source src="/images/start.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Top Spacer */}
      <div className="hero-top-spacer"></div>

      <div className="hero-main-content">
        <img
          src="/images/accesco_white.png"
          className="hero-logo-img"
          alt="Accesco Original White Logo"
        />

        <h1 className="hero-title">Accesco Living</h1>

        <div className="hero-kicker">
          India's #1 Intelligent Circular Commerce Ecosystem
        </div>

        <div className="hero-sub">
          Delivering Groceries, Food, Fashion, and Financial Intelligence — all under one unified platform
        </div>

        <a href="#waitlist" className="join-waitlist-btn">JOIN WAITLIST</a>
        
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
        SCROLL DOWN <i className="ri-arrow-down-s-line"></i>
      </a>

      {/* Bottom Spacer */}
      <div className="hero-bottom-spacer"></div>
    </section>
  );
}
