'use client';

import React from 'react';
import Image from 'next/image';
import styles from './DownloadSection.module.css';

export default function DownloadSection() {
  return (
    <section style={{ padding: '0 40px 80px', background: '#FFFDF8' }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        background: 'linear-gradient(135deg, #1A0A0F 0%, #2D0818 50%, #1A0A0F 100%)',
        borderRadius: '32px', padding: '72px 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: '-60px', right: '10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(122,0,66,0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', left: '5%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,150,62,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Shimmer top border */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(200,150,62,0.5), transparent)',
        }} />

        <div className={styles.dlGrid}>

          {/* Left — copy */}
          <div>
            <div className="ac-chip" style={{
              background: 'rgba(200,150,62,0.12)', border: '1px solid rgba(200,150,62,0.22)',
              color: '#C8963E', marginBottom: '20px', display: 'inline-flex', padding: '5px 14px', borderRadius: '9999px',
              fontFamily: "'Sora', sans-serif", fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase'
            }}>
              Download Now
            </div>

            <h2 style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              color: '#FFFDF8', letterSpacing: '-0.03em',
              margin: '0 0 16px', lineHeight: 1.1,
            }}>
              One App.{' '}
              <span style={{
                background: 'linear-gradient(135deg, #C8963E, #E8B96A)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Infinite
              </span>{' '}
              Possibilities.
            </h2>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1rem', color: 'rgba(255,253,248,0.55)',
              lineHeight: 1.75, marginBottom: '36px', maxWidth: '480px',
            }}>
              From 10-minute <strong style={{ color: '#4CAF50' }}>Grokly</strong> deliveries to{' '}
              <strong style={{ color: '#9C27B0' }}>InstaStyle</strong> fashion rentals. Download Accesco!
            </p>

            {/* Store buttons */}
            <div className="dl-buttons-wrap" style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap', marginBottom: '32px', alignItems: 'center', flexDirection: 'row' }}>
              <style>{`
                .dl-store-btn {
                  display: inline-block;
                  transition: transform 0.2s ease;
                  text-decoration: none;
                }
                .dl-store-btn:hover {
                  transform: translateY(-2px);
                }
                .dl-store-btn img {
                  height: 40px;
                  width: auto;
                  display: block;
                  border-radius: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                  background: transparent !important;
                }
              `}</style>
              <a href="#" className="dl-store-btn">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                />
              </a>
              <a href="#" className="dl-store-btn">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store"
                />
              </a>
            </div>

            {/* Trust badges */}
            <div className="dl-trust-wrap" style={{ display: 'flex', gap: '24px', flexWrap: 'nowrap', width: 'auto', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              {[
                { num: '10K+', label: 'Early Users' },
                { num: '4.9 / 5', label: 'Rating' },
                { num: '100%', label: 'Secure' }
              ].map((item) => (
                <div key={item.label || item.num} style={{ textAlign: 'left', flex: '0 0 auto' }}>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: '#C8963E', whiteSpace: 'nowrap' }}>{item.num}</div>
                  {item.label && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', color: 'rgba(255,253,248,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{item.label}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Premium Stadium Poster Mockup */}
          <div className={styles.posterContainer}>
            <div style={{
              width: '100%',
              maxWidth: '380px',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
              border: '1px solid rgba(255,255,255,0.15)',
              background: '#1A0A0F',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Image
                src="/images/banners/launchsoon.png"
                alt="Accesco Living - Launching Soon"
                width={380}
                height={480}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'contain',
                }}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
