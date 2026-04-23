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
              color: '#C8963E', marginBottom: '20px',
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
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px', alignItems: 'center' }}>
              <a href="#" style={{ textDecoration: 'none', display: 'block' }}>
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  width={156}
                  height={46}
                  loading="lazy"
                  style={{ display: 'block', borderRadius: '8px', height: '44px', width: 'auto' }}
                />
              </a>
              <a href="#" style={{ textDecoration: 'none', display: 'block' }}>
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store"
                  width={140}
                  height={46}
                  loading="lazy"
                  style={{ display: 'block', borderRadius: '8px', height: '44px', width: 'auto' }}
                />
              </a>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {[['10K+', 'Early Users'], ['4.9 / 5', 'Rating'], ['100%', 'Secure']].map(([num, label]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#C8963E' }}>{num}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: 'rgba(255,253,248,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — QR Box */}
          <div className={styles.dlQr} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', flexShrink: 0,
          }}>
            <div style={{
              background: '#FFFDF8', borderRadius: '20px', padding: '20px',
              boxShadow: '0 0 0 1px rgba(122,0,66,0.1), 0 20px 50px rgba(0,0,0,0.4)',
            }}>
              <Image
                src="/images/QR.png"
                alt="Scan QR Code to Download"
                width={140}
                height={140}
                loading="lazy"
              />
            </div>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.8rem', color: 'rgba(255,253,248,0.4)',
              letterSpacing: '0.06em',
            }}>
              Scan to Download
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
