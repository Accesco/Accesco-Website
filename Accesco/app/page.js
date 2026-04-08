'use client';

import { useEffect } from 'react';
import './homepage.css';
import AccescoHeader from '../components/AccescoHeader';
import Hero from '../components/Hero';
import AppShowcase from '../components/AppShowcase';
import DownloadSection from '../components/DownloadSection';
import Footer from '../components/Footer';
import InstaStyleCard from './components/InstaStyleCard'

export default function HomePage() {
  useEffect(() => {
    const scripts = ['/js/sidebar-menu.js', '/js/stack-cards.js'];
    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onerror = () => console.log(`Optional: ${src}`);
      document.body.appendChild(script);
    });
  }, []);

  return (
    <>
      <AccescoHeader />
      
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Services Section */}
        <section id="services" className="services-enhanced">
          <div className="services-content">
            <div className="services-pretitle">YOUR DAILY SERVICES</div>
            <h2 className="services-title">Everything You Need, One Platform</h2>
            <p className="services-subtitle">
              From fresh groceries to premium dining, instant rides to curated fashion — experience intelligent commerce that fits your life.
            </p>

            <div className="services-grid">
              {/* Grokly */}
              <a href="/services/grokly" className="service-item">
                <div className="service-visual grokly-visual"></div>
                <div className="service-content">
                  <div className="service-top">
                    <h3 className="service-name">Grokly</h3>
                    <span className="service-tag tag-green">22 mins</span>
                  </div>
                  <p className="service-desc">Fresh groceries to your door, fast.</p>
                  <div className="service-meta">
                    <span><i className="ri-time-line"></i> 10 AM - 11 PM</span>
                    <span><i className="ri-map-pin-line"></i> 5 km</span>
                  </div>
                  <button className="service-action"><span>ORDER NOW →</span></button>
                </div>
              </a>

              {/* Swadishtt */}
              <a href="/services/swadisht" className="service-item">
                <div className="service-visual swadisht-visual"></div>
                <div className="service-content">
                  <div className="service-top">
                    <h3 className="service-name">Swadishtt</h3>
                    <span className="service-tag tag-red">35 mins</span>
                  </div>
                  <p className="service-desc">Home-style meals, delivered warm.</p>
                  <div className="service-meta">
                    <span><i className="ri-restaurant-line"></i> 200+ Dishes</span>
                    <span><i className="ri-time-line"></i> Hot & Fresh</span>
                  </div>
                  <button className="service-action"><span>ORDER NOW →</span></button>
                </div>
              </a>

              {/* InstaStyle */}
              <a href="/services/instastyle" className="service-item">
                <div className="service-visual instastyle-visual"></div>
                <div className="service-content">
                  <div className="service-top">
                    <h3 className="service-name">InstaStyle</h3>
                    <span className="service-tag tag-purple">Trending</span>
                  </div>
                  <p className="service-desc">Rent the runway, own the moment.</p>
                  <div className="service-meta">
                    <span><i className="ri-shirt-line"></i> Premium Brands</span>
                    <span><i className="ri-calendar-line"></i> 3-7 Days</span>
                  </div>
                  <button className="service-action"><span>EXPLORE →</span></button>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Xpense Meter Section - Meta Engineering Standards */}
        <section className="xpense-meter-section">
          <div className="xpense-container">
            <div className="xpense-content">
              <div className="xpense-header">
               
                <h2 className="xpense-title">
                  Xpense <span className="xpense-highlight">Meter</span>
                </h2>
                <p className="xpense-description">
                  Transform your financial habits with intelligent expense tracking, 
                  predictive analytics, and personalized savings recommendations.
                </p>
                <div className="xpense-features">
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2L12.09 6.26L17 7L13 10.74L13.91 16L10 13.27L6.09 16L7 10.74L3 7L7.91 6.26L10 2Z" fill="currentColor"/>
                    </svg>
                    Smart categorization
                  </div>
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M3 3V17H17V7H11L9 5H3Z" fill="currentColor"/>
                    </svg>
                    Predictive budgeting
                  </div>
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 1L13 7L20 7L15 12L17 19L10 15L3 19L5 12L0 7L7 7L10 1Z" fill="currentColor"/>
                    </svg>
                    Goal tracking
                  </div>
                </div>
                <a href="/calculator" className="xpense-cta">
                  <span>Launch Calculator</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10H16M16 10L12 6M16 10L12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
              
              <div className="xpense-visual">
                <div className="image-placeholder">
                  <div className="placeholder-icon">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <rect x="8" y="16" width="48" height="32" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M16 28L24 20L32 28L40 20L48 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="20" cy="24" r="2" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="placeholder-text">
                    <div className="placeholder-title">Dashboard Preview</div>
                    <div className="placeholder-subtitle">Image will be added here</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* App Showcase from bottom half */}
        <AppShowcase />

        {/* InstaStyle Spotlight */}
        <InstaStyleCard />

        {/* Download Section from bottom half */}
        <DownloadSection />
      </main>

      {/* Footer from bottom half */}
      <Footer />

      <df-messenger
        intent="WELCOME"
        chat-title="AccesCo AI"
        agent-id="8beafa4a-339b-44ff-a386-62d386a2481b"
        language-code="en"
        chat-icon="/images/IMG_5111.PNG"
      ></df-messenger>
    </>
  );
}
