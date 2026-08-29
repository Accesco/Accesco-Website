'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ServicesCarousel() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="servicesWrap">
      <button
        type="button"
        className="servicesArrow servicesArrowLeft"
        onClick={() => scroll('left')}
        aria-label="Previous service"
      >
        ‹
      </button>

      <div ref={scrollRef} id="services-scroll-container" className="services-grid">
        {/* Grokly */}
        <Link href="/services/grokly" className="serviceCardLinkWrap" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }} aria-label="Open Grokly service page">
          <div className="service-premium-card grokly-card">
            <div className="service-card-visual" style={{ cursor: 'pointer' }}>
              <Image src="/images/grokly-new2.png" alt="Grokly Groceries" fill className="serviceCardVisualImage" sizes="(max-width: 768px) 100vw, 340px" />
            </div>
            <div className="service-icon-circle">
              <Image src="/images/grokly-icon.png" alt="Grokly" width={40} height={40} className="serviceIconCircleImage" />
            </div>
            <div className="service-card-body">
              <h3 className="service-card-name">Grokly</h3>
              <p className="service-card-desc">Fresh groceries & curated essentials at your doorstep</p>
              <div className="service-card-cta grokly-btn">Shop Groceries</div>
            </div>
          </div>
        </Link>

        {/* Swadishtt */}
        <Link href="/services/swadisht" className="serviceCardLinkWrap" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }} aria-label="Open Swadishtt service page">
          <div className="service-premium-card swadisht-card">
            <div className="service-card-visual" style={{ cursor: 'pointer' }}>
              <Image src="/images/swadisht/swadisht_logo1.JPG" alt="Swadishtt Meals" fill className="serviceCardVisualImage" sizes="(max-width: 768px) 100vw, 340px" />
            </div>
            <div className="service-icon-circle">
              <Image src="/images/swadisht/swadisht_logo.JPG" alt="Swadishtt" width={40} height={40} className="serviceIconCircleImage" />
            </div>
            <div className="service-card-body">
              <h3 className="service-card-name">Swadishtt</h3>
              <p className="service-card-desc">Meals made only for you!</p>
              <div className="service-card-cta swadishtt-btn">Order Food</div>
            </div>
          </div>
        </Link>

        {/* InstaStyle */}
        <Link href="/services/instastyle" className="serviceCardLinkWrap" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }} aria-label="Open InstaStyle service page">
          <div className="service-premium-card instastyle-card">
            <div className="service-card-visual" style={{ cursor: 'pointer' }}>
              <Image src="/images/fashion-new2.png" alt="InstaStyle Fashion" fill className="serviceCardVisualImage" sizes="(max-width: 768px) 100vw, 340px" />
            </div>
            <div className="service-icon-circle">
              <Image src="/images/instastyle-logo.png" alt="InstaStyle" width={40} height={40} className="serviceIconCircleImage" />
            </div>
            <div className="service-card-body">
              <h3 className="service-card-name">InstaStyle</h3>
              <p className="service-card-desc">Outfit ready, before you are!</p>
              <div className="service-card-cta instastyle-btn">Explore Fashion</div>
            </div>
          </div>
        </Link>
      </div>

      <button
        type="button"
        className="servicesArrow servicesArrowRight"
        onClick={() => scroll('right')}
        aria-label="Next service"
      >
        ›
      </button>
    </div>
  );
}
