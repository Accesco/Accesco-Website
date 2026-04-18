'use client';

import { useEffect } from 'react';
import './homepage.css';
import AccescoHeader from '../components/AccescoHeader';
import Hero from '../components/Hero';
import AppShowcase from '../components/AppShowcase';
import DownloadSection from '../components/DownloadSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';


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

        {/* Xpense Meter Section - Premium Design */}
        <section className="xpense-meter-section">
          <div className="xpense-container">
            <div className="xpense-content">
              <div className="xpense-header">
                <h2 className="xpense-title">
                  Xpense Meter
                </h2>
                <p className="xpense-description">
                  Transform your financial habits with intelligent expense tracking, 
                  predictive analytics, and personalized savings recommendations powered by AI.
                </p>
                <div className="xpense-features">
                  <div className="feature-item">
                    <div className="feature-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2L12.09 6.26L17 7L13 10.74L13.91 16L10 13.27L6.09 16L7 10.74L3 7L7.91 6.26L10 2Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className="feature-text">
                      <h4>Smart Categorization</h4>
                      <p>AI-powered automatic expense sorting</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M3 3V17H17V7H11L9 5H3Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className="feature-text">
                      <h4>Predictive Budgeting</h4>
                      <p>Forecast spending patterns accurately</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 1L13 7L20 7L15 12L17 19L10 15L3 19L5 12L0 7L7 7L10 1Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className="feature-text">
                      <h4>Goal Tracking</h4>
                      <p>Achieve financial milestones faster</p>
                    </div>
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
                <div className="xpense-card-stack">
                  <div className="xpense-card xpense-card-1">
                    <div className="card-header">
                      <div className="card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <span className="card-label">Monthly Overview</span>
                    </div>
                    <div className="card-value">₹45,280</div>
                    <div className="card-trend positive">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>+12.5%</span>
                    </div>
                  </div>
                  
                  <div className="xpense-card xpense-card-2">
                    <div className="card-header">
                      <div className="card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span className="card-label">Savings Goal</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '68%' }}></div>
                    </div>
                    <div className="card-progress-text">68% Complete</div>
                  </div>
                  
                  <div className="xpense-card xpense-card-3">
                    <div className="card-header">
                      <div className="card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <span className="card-label">Top Category</span>
                    </div>
                    <div className="category-item">
                      <span className="category-name">Food & Dining</span>
                      <span className="category-amount">₹12,450</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* App Showcase from bottom half */}
        <AppShowcase />

        {/* FAQ Section */}
        <FAQSection />

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
