'use client';

import { useEffect } from 'react';
import './homepage.css';
import AccescoHeader from '../components/AccescoHeader';
import Hero from '../components/Hero';
import AppShowcase from '../components/AppShowcase';
import DownloadSection from '../components/DownloadSection';
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

        {/* CalcIQ Section */}
        <section className="calciq-section">
          <div className="calciq-container">
            <div className="calciq-info">
              <div className="calciq-badge">
                <i className="ri-sparkling-2-fill"></i> POWERED BY AI
              </div>
              <h2>Xpense <span>Meter</span></h2>
              <p>
                Stop guessing where your money goes. Visualize your savings, track expenses, 
                and forecast your future wealth with one tap.
              </p>
              <a href="/calculator" className="calciq-btn">
                Launch Calculator <i className="ri-arrow-right-line"></i>
              </a>
            </div>

            <div className="calciq-visual">
              <div className="glass-interface">
                <div className="ui-header">
                  <span>Total Savings</span>
                  <i className="ri-more-fill"></i>
                </div>
                <div className="ui-balance">
                  ₹24,500 <span>+12% <i className="ri-arrow-up-fill"></i></span>
                </div>
                <div className="ui-graph">
                  <div className="ui-bar b1"></div>
                  <div className="ui-bar b2"></div>
                  <div className="ui-bar b3"></div>
                  <div className="ui-bar b4"></div>
                  <div className="ui-bar b5"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* App Showcase from bottom half */}
        <AppShowcase />

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
