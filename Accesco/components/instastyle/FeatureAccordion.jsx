'use client';

import { useRef, useState } from 'react';
import './feature-accordion.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Premium high-fidelity fashion placeholders from Unsplash
const PHOTOS = [
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
  'https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=1200&q=80',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80'
];

export default function FeatureAccordion() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // ── Interaction Logic ──
  useGSAP(() => {
    if (!sectionRef.current) return;

    // Sub-animation: Fade in the massive heading gently
    gsap.fromTo(sectionRef.current.querySelector('.is-scroll-heading'),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%', 
        }
      }
    );
  }, { scope: sectionRef });

  const handleItemClick = (index) => {
    setActiveIndex(index);
    
    // Trigger the Vibe Check fill animation if it's the Vibe Check section
    const pollFill = sectionRef.current.querySelector('.is-poll-fill');
    if (pollFill) {
      if (index === 2) { // "The Vibe Check" is at index 2 (01, 02, 03...)
        pollFill.classList.add('is-filled');
      } else {
        pollFill.classList.remove('is-filled');
      }
    }
  };

  return (
    <section className="is-scroll-section" id="whyInstastyle" ref={sectionRef}>
      <div className="is-scroll-inner">

        {/* ============================================================
            LEFT: Sticky label panel (desktop only) 
            Note: Since whole section is pinned, this is naturally stationary
            ============================================================ */}
        <div className="is-scroll-left">
          <div className="is-scroll-sticky">
            <span className="is-eyebrow">Why InstaStyle</span>
            <h2 className="is-scroll-heading">
              Everything<br />fashion<br />should be.
            </h2>

            {/* Progress dots — highlight active box */}
            <div className="is-progress-dots">
              {[
                '15-20 Min Delivery',
                'Trial at Doorstep',
                'The Vibe Check',
                'Instant Outfit Builder',
                'Size Memory Engine',
                'Thrift Marketplace',
                'Virtual Try-On',
                'SwipeStyle Discovery'
              ].map((label, idx) => (
                <div
                  key={idx}
                  className={`is-dot ${activeIndex === idx ? 'is-dot--active' : ''}`}
                  onClick={() => handleItemClick(idx)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="is-dot-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            RIGHT: Accordion Stack 
            ============================================================ */}
        <div className="is-scroll-right">

          {/* Mobile-only header block */}
          <div className="is-mobile-header">
            <span className="is-eyebrow">Why InstaStyle</span>
            <h2 className="is-scroll-heading" style={{ opacity: 1, transform: 'none' }}>
              Everything fashion should be.
            </h2>
          </div>

          <div className="is-acc-stack">
            {[
              { title: '15-20 Min Delivery', desc: 'High-demand outfits pre-stocked inside integrated dark stores enabling near-instant delivery.' },
              { title: 'Trial at Doorstep', desc: 'Try selected outfits at home while the rider waits up to 15 minutes. Pay only for items you keep.' },
              { title: 'The Vibe Check', desc: 'Shopping is a team sport. Share options with friends, start a poll, and get squad approval.', isVibe: true },
              { title: 'Instant Outfit Builder', desc: 'Select an occasion and InstaStyle instantly curates a complete ready-to-wear outfit for you.' },
              { title: 'Size Memory Engine', desc: 'Learns your exact fit preference per brand and category. Never wrong-sizes an order again.' },
              { title: 'Thrift Marketplace', desc: 'Curated resale marketplace where users and vendors sell verified pre-owned fashion.' },
              { title: 'Virtual Try-On', desc: 'See how any outfit looks on you instantly using our advanced AI-powered virtual mirror.' },
              { title: 'SwipeStyle Discovery', desc: 'Find your next favorite look with a personalized, swipe-based discovery feed.' }
            ].map((feature, idx) => {
              if (feature.isVibe) {
                return (
                <div 
                  key={idx} 
                  className={`is-acc-item is-vibe ${activeIndex === idx ? 'is-active' : ''}`}
                  onClick={() => handleItemClick(idx)}
                  style={{ cursor: 'pointer' }}
                >
                    <div className="is-acc-bg" style={{ backgroundImage: `url('${PHOTOS[idx]}')`, opacity: activeIndex === idx ? 0.85 : 0.55 }}></div>
                    <div className="is-gold-line"></div>
                    <div className="is-acc-collapsed">
                      <span className="is-acc-num">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="is-acc-title">{feature.title}</span>
                      <div className="is-acc-preview" style={{ backgroundImage: `url('${PHOTOS[idx]}')` }} />
                    </div>
                    <div className="is-vibe-overlay" style={{ opacity: activeIndex === idx ? 1 : 0, transition: 'opacity 0.4s' }}></div>
                    <div className="is-vibe-content" style={{ opacity: activeIndex === idx ? 1 : 0, pointerEvents: activeIndex === idx ? 'auto' : 'none', transition: 'opacity 0.4s 0.2s' }}>
                      <span className="is-vibe-label">Featured</span>
                      <h3 className="is-vibe-heading">{feature.title}</h3>
                      <p className="is-vibe-desc">{feature.desc}</p>
                      <div className="is-squad-row">
                        <div className="is-avatars">
                          <div className="is-av av-y">P</div>
                          <div className="is-av av-g">R</div>
                          <div className="is-av av-p">A</div>
                        </div>
                        <span className="is-squad-text"><b>3 friends</b> are voting now</span>
                      </div>
                      <div className="is-poll-row">
                        <span className="is-poll-opt poll-a">A 68%</span>
                        <span className="is-poll-opt poll-b">B 20%</span>
                        <span className="is-poll-opt poll-c">C 12%</span>
                        <div className="is-poll-bar"><div className="is-poll-fill"></div></div>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div 
                  key={idx} 
                  className={`is-acc-item ${activeIndex === idx ? 'is-active' : ''}`}
                  onClick={() => handleItemClick(idx)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="is-acc-bg" style={{ backgroundImage: `url('${PHOTOS[idx]}')` }}></div>
                  <div className="is-gold-line"></div>
                  <div className="is-acc-overlay"></div>
                  <div className="is-acc-collapsed">
                    <span className="is-acc-num">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="is-acc-title">{feature.title}</span>
                    <div className="is-acc-preview" style={{ backgroundImage: `url('${PHOTOS[idx]}')` }} />
                  </div>
                  <div className="is-acc-expanded">
                    <span className="is-acc-num">{String(idx + 1).padStart(2, '0')}</span>
                    <h3 className="is-acc-heading">{feature.title}</h3>
                    <p className="is-acc-desc">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* /.is-acc-stack */}
        </div>
        {/* /.is-scroll-right */}
      </div>
      {/* /.is-scroll-inner */}
    </section>
  );
}
