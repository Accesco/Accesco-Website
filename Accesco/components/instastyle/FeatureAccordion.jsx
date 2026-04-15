'use client';

import { useRef, useState } from 'react';
import './feature-accordion.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Premium high-fidelity fashion placeholders from Unsplash
const PHOTOS = [
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80', // 01 Drop (editorial high-fashion)
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', // 02 Curated (premium apparel)
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80', // 03 Perfect Fit (Bug 3: Tailored fit)
  'https://images.unsplash.com/photo-1529139574466-a303027c028b?w=1200&q=80', // 04 Vibe Check (Bug 3: Group vibe)
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80', // 05 Complete Look (fashion rack)
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80'  // 06 Moment (dynamic runway)
];

export default function FeatureAccordion() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // ── GSAP Scroll-Lock (Pinned Scrollytelling) ──
  useGSAP(() => {
    if (!sectionRef.current) return;

    // Register plugin if needed (already registered in page.jsx, but safe to re-check locally if isolated)
    gsap.registerPlugin(ScrollTrigger);

    // 1. PIN THE SECTION
    const pinTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',    // Lock when section hits top of viewport
      end: '+=2200',       // ~360px per box × 6 boxes — enough to cycle through all
      pin: true,           // Lock it!
      scrub: true,
      onUpdate: (self) => {
        // 2. SCRUB THROUGH THE BOXES
        const totalItems = 6;
        let p = self.progress;

        // Edge cases
        if (p >= 1) p = 0.999;
        if (p < 0) p = 0;

        // Math to figure out which box is active
        const newIndex = Math.floor(p * totalItems);
        setActiveIndex(newIndex);

        // 3. SPECIAL VIBE CHECK ANIMATION (Index 3)
        const pollFill = sectionRef.current.querySelector('.is-poll-fill');
        if (pollFill) {
          if (newIndex === 3) {
            pollFill.classList.add('is-filled');
          } else {
            pollFill.classList.remove('is-filled');
          }
        }
      }
    });

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
          start: 'top 60%', // trigger before it pins
        }
      }
    );

    return () => {
      // Clean up the specific trigger
      pinTrigger.kill();
    };
  }, { scope: sectionRef });

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
                'Never Miss a Drop',
                'Curated For You',
                'Your Perfect Fit',
                'The Vibe Check',
                'Complete the Look',
                'Dress for the Moment'
              ].map((label, idx) => (
                <div
                  key={idx}
                  className={`is-dot ${activeIndex === idx ? 'is-dot--active' : ''}`}
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

            {/* BOX 01 */}
            <div className={`is-acc-item ${activeIndex === 0 ? 'is-active' : ''}`}>
              <div className="is-acc-bg" style={{ backgroundImage: `url('${PHOTOS[0]}')` }}></div>
              <div className="is-gold-line"></div>
              <div className="is-acc-overlay"></div>
              <div className="is-acc-collapsed">
                <span className="is-acc-num">01</span>
                <span className="is-acc-title">Never Miss a Drop</span>
                <div className="is-acc-preview" style={{ backgroundImage: `url('${PHOTOS[0]}')` }} />
              </div>
              <div className="is-acc-expanded">
                <span className="is-acc-num">01</span>
                <h3 className="is-acc-heading">Never Miss a Drop</h3>
                <p className="is-acc-desc">
                  Be the first to know about exclusive releases, limited drops, and trending styles before they sell out. Real-time alerts for every brand you follow.
                </p>
                <div className="is-chips">
                  <span className="is-chip is-chip-accent" style={{ transitionDelay: activeIndex === 0 ? '0.2s' : '0s' }}>Instant Alerts</span>
                  <span className="is-chip" style={{ transitionDelay: activeIndex === 0 ? '0.26s' : '0s' }}>Limited Drops</span>
                  <span className="is-chip" style={{ transitionDelay: activeIndex === 0 ? '0.32s' : '0s' }}>Trend Tracking</span>
                </div>
              </div>
            </div>

            {/* BOX 02 */}
            <div className={`is-acc-item ${activeIndex === 1 ? 'is-active' : ''}`}>
              <div className="is-acc-bg" style={{ backgroundImage: `url('${PHOTOS[1]}')` }}></div>
              <div className="is-gold-line"></div>
              <div className="is-acc-overlay"></div>
              <div className="is-acc-collapsed">
                <span className="is-acc-num">02</span>
                <span className="is-acc-title">Curated For You</span>
                <div className="is-acc-preview" style={{ backgroundImage: `url('${PHOTOS[1]}')` }} />
              </div>
              <div className="is-acc-expanded">
                <span className="is-acc-num">02</span>
                <h3 className="is-acc-heading">Curated For You</h3>
                <p className="is-acc-desc">
                  Personalized recommendations tailored to your unique taste. Our AI learns what you love with every swipe, save, and purchase.
                </p>
                <div className="is-chips">
                  <span className="is-chip is-chip-accent" style={{ transitionDelay: activeIndex === 1 ? '0.2s' : '0s' }}>AI-Powered</span>
                  <span className="is-chip" style={{ transitionDelay: activeIndex === 1 ? '0.26s' : '0s' }}>Style Memory</span>
                  <span className="is-chip" style={{ transitionDelay: activeIndex === 1 ? '0.32s' : '0s' }}>Smart Picks</span>
                </div>
              </div>
            </div>

            {/* BOX 03 */}
            <div className={`is-acc-item ${activeIndex === 2 ? 'is-active' : ''}`}>
              <div className="is-acc-bg" style={{ backgroundImage: `url('${PHOTOS[2]}')` }}></div>
              <div className="is-gold-line"></div>
              <div className="is-acc-overlay"></div>
              <div className="is-acc-collapsed">
                <span className="is-acc-num">03</span>
                <span className="is-acc-title">Your Perfect Fit</span>
                <div className="is-acc-preview" style={{ backgroundImage: `url('${PHOTOS[2]}')` }} />
              </div>
              <div className="is-acc-expanded">
                <span className="is-acc-num">03</span>
                <h3 className="is-acc-heading">Your Perfect Fit</h3>
                <p className="is-acc-desc">
                  Smart sizing per brand and category. The Size Memory Engine learns your exact measurements — zero wrong sizes, ever.
                </p>
                <div className="is-chips">
                  <span className="is-chip is-chip-accent" style={{ transitionDelay: activeIndex === 2 ? '0.2s' : '0s' }}>Zero Wrong Sizes</span>
                  <span className="is-chip" style={{ transitionDelay: activeIndex === 2 ? '0.26s' : '0s' }}>Per-Brand Fit</span>
                  <span className="is-chip" style={{ transitionDelay: activeIndex === 2 ? '0.32s' : '0s' }}>Size Memory</span>
                </div>
              </div>
            </div>

            {/* BOX 04 — VIBE CHECK */}
            <div className={`is-acc-item is-vibe ${activeIndex === 3 ? 'is-active' : ''}`}>
              <div className="is-acc-bg" style={{ backgroundImage: `url('${PHOTOS[3]}')` }}></div>

              {/* Collapsed state for Vibe Check (added so it acts like normal row) */}
              <div className="is-acc-collapsed">
                <span className="is-acc-num">04</span>
                <span className="is-acc-title">The Vibe Check</span>
                <div className="is-acc-preview" style={{ backgroundImage: `url('${PHOTOS[3]}')` }} />
              </div>

              <div className="is-vibe-overlay" style={{ opacity: activeIndex === 3 ? 1 : 0, transition: 'opacity 0.4s' }}></div>

              <div className="is-vibe-content" style={{ opacity: activeIndex === 3 ? 1 : 0, pointerEvents: activeIndex === 3 ? 'auto' : 'none', transition: 'opacity 0.4s 0.2s' }}>
                <span className="is-vibe-label">Featured</span>
                <h3 className="is-vibe-heading">The Vibe Check</h3>
                <p className="is-vibe-desc">
                  Shopping is a team sport. Share your looks, start a poll, and get your squad's approval before you check out.
                </p>
                <div className="is-squad-row">
                  <div className="is-avatars">
                    <div className="is-av av-y">P</div>
                    <div className="is-av av-g">R</div>
                    <div className="is-av av-p">A</div>
                  </div>
                  <span className="is-squad-text">
                    <b>3 friends</b> are voting now
                  </span>
                </div>
                <div className="is-poll-row">
                  <span className="is-poll-opt poll-a">A 68%</span>
                  <span className="is-poll-opt poll-b">B 20%</span>
                  <span className="is-poll-opt poll-c">C 12%</span>
                  <div className="is-poll-bar">
                    <div className="is-poll-fill"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOX 05 */}
            <div className={`is-acc-item ${activeIndex === 4 ? 'is-active' : ''}`}>
              <div className="is-acc-bg" style={{ backgroundImage: `url('${PHOTOS[4]}')` }}></div>
              <div className="is-gold-line"></div>
              <div className="is-acc-overlay"></div>
              <div className="is-acc-collapsed">
                <span className="is-acc-num">05</span>
                <span className="is-acc-title">Complete the Look</span>
                <div className="is-acc-preview" style={{ backgroundImage: `url('${PHOTOS[4]}')` }} />
              </div>
              <div className="is-acc-expanded">
                <span className="is-acc-num">05</span>
                <h3 className="is-acc-heading">Complete the Look</h3>
                <p className="is-acc-desc">
                  Get instant suggestions to finish your outfit with the perfect accessories and layers. AI pairing that actually works.
                </p>
                <div className="is-chips">
                  <span className="is-chip is-chip-accent" style={{ transitionDelay: activeIndex === 4 ? '0.2s' : '0s' }}>Smart Pairing</span>
                  <span className="is-chip" style={{ transitionDelay: activeIndex === 4 ? '0.26s' : '0s' }}>Accessories</span>
                  <span className="is-chip" style={{ transitionDelay: activeIndex === 4 ? '0.32s' : '0s' }}>Full Outfits</span>
                </div>
              </div>
            </div>

            {/* BOX 06 */}
            <div className={`is-acc-item ${activeIndex === 5 ? 'is-active' : ''}`}>
              <div className="is-acc-bg" style={{ backgroundImage: `url('${PHOTOS[5]}')` }}></div>
              <div className="is-gold-line"></div>
              <div className="is-acc-overlay"></div>
              <div className="is-acc-collapsed">
                <span className="is-acc-num">06</span>
                <span className="is-acc-title">Dress for the Moment</span>
                <div className="is-acc-preview" style={{ backgroundImage: `url('${PHOTOS[5]}')` }} />
              </div>
              <div className="is-acc-expanded">
                <span className="is-acc-num">06</span>
                <h3 className="is-acc-heading">Dress for the Moment</h3>
                <p className="is-acc-desc">
                  Find styles for every occasion — casual hangouts to black tie. Tell us the vibe, we build the complete look in 15 minutes.
                </p>
                <div className="is-chips">
                  <span className="is-chip is-chip-accent" style={{ transitionDelay: activeIndex === 5 ? '0.2s' : '0s' }}>Occasion-Ready</span>
                  <span className="is-chip" style={{ transitionDelay: activeIndex === 5 ? '0.26s' : '0s' }}>Event Styling</span>
                  <span className="is-chip" style={{ transitionDelay: activeIndex === 5 ? '0.32s' : '0s' }}>15 min</span>
                </div>
              </div>
            </div>

          </div>
          {/* /.is-acc-stack */}
        </div>
        {/* /.is-scroll-right */}
      </div>
      {/* /.is-scroll-inner */}
    </section>
  );
}
