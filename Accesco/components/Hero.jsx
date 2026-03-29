'use client';

import React from 'react';
import Image from 'next/image';

export default function Hero() {
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
          padding-top: 160px;
          width: 100%;
        }

        .hero-logo-img {
          width: 150px;
          height: 150px;
          margin: 0 auto 30px;
          filter: drop-shadow(0 10px 30px rgba(255, 255, 255, 0.3));
        }

        .hero-title {
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 900;
          margin-bottom: 16px;
          letter-spacing: -2px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        /* ── Kicker — bold white text, no border ── */
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
          margin-bottom: 20px;
          background: none;
          border: none;
          box-shadow: none;
          padding: 0;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
        .hero-kicker::before { content: none; }
        .hero-kicker::after  { content: none; }

        .hero-sub {
          font-size: clamp(16px, 2.5vw, 22px);
          max-width: 700px;
          margin: 0 auto 40px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
        }

        .hero-ctas {
          margin-bottom: 40px;
        }

        .cta-pill {
          background: linear-gradient(135deg, #ffd86f, #ffb347);
          color: #1f0f12;
          padding: 16px 40px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(255, 184, 70, 0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .cta-pill:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(255, 184, 70, 0.6);
        }

        .hero-app-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 40px;
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
          .hero-kicker { font-size: 11px; padding: 10px 20px; letter-spacing: 1.5px; }
        }
      `}</style>

      <video className="hero-bg-video" autoPlay muted loop playsInline poster="/images/poster.jpg">
        <source src="/images/start.mp4" type="video/mp4" />
      </video>

      <div className="hero-grid">
        <Image
          src="/images/accesco_white.png"
          className="hero-logo-img"
          alt="AccesCo Logo"
          width={150}
          height={150}
          priority
        />

        <h1 className="hero-title">Accesco Living</h1>

        <div className="hero-kicker">
          India&apos;s first circular intelligent commerce platform.
        </div>

        <p className="hero-sub">
          Groceries, fashion, food, finance &amp; more — all in one intelligent ecosystem.
        </p>

        <div className="hero-ctas">
          <a href="#services">
            <button className="cta-pill">Explore Services</button>
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
