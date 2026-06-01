'use client';

import React from 'react';
import AccescoHeader from '../../components/AccescoHeader';
import Footer from '../../components/Footer';
import './press.css';

const pressReleases = [
  {
    id: 0,
    title: "The Argha Sengupta Story: From Cycling Through Siliguri Markets to Building India's Intelligent Commerce Platform",
    date: 'May 25, 2026',
    category: 'Featured Article',
    excerpt: "While most 19-year-olds are figuring out college majors, Argha Sengupta is preparing to launch Accesco Living, India's first circular commerce ecosystem.",
    image: '/images/entrepreneur-pioneer-argha.jpg',
    readTime: '6 min read',
    url: 'https://entrepreneurpioneer.com/the-argha-sengupta-story-from-cycling-through-siliguri-markets/',
    logo: '/images/entrepreneur-pioneer-logo.png',
    isFeatured: true,
  },
  {
    id: 1,
    title: 'Accesco Living Announces India\'s First Intelligent Circular Commerce Ecosystem',
    date: 'May 10, 2026',
    category: 'Company News',
    excerpt: 'Combining three distinct ventures—Grokly for essentials, Swadishtt for dining, and InstaStyle for instant fashion—into a single, coordinated budget-first ecosystem.',
    image: '/images/banners/hero-main.jpg',
    readTime: '4 min read',
  },
  {
    id: 2,
    title: 'FarmChain Network Direct Sourcing Scale Expansion Across Karnataka',
    date: 'April 28, 2026',
    category: 'Ecosystem',
    excerpt: 'Accesco Living announces direct sourcing contracts with over 1500 local Karnataka farmers, bypassing mandi intermediaries and tripling producer income.',
    image: '/images/banners/hero-grokly.jpg',
    readTime: '3 min read',
  },
  {
    id: 3,
    title: 'InstaStyle Launches 20-Minute Instant Trial & Reverse Fashion Loop in Bengaluru',
    date: 'April 15, 2026',
    category: 'Product Launch',
    excerpt: 'Redefining fast-commerce with trial-at-doorstep fitting and a carbon-credit reverse commerce loop for apparel recycling and zero-waste fashion.',
    image: '/images/banners/hero-swadishtt.png',
    readTime: '5 min read',
  },
];



export default function PressPage() {
  return (
    <>
      <AccescoHeader />
      <main className="press-page">
        
        {/* Hero Section */}
        <section className="press-hero">
          <div className="press-container">

            <h1 className="press-hero-title">Press & Media Center</h1>
            <p className="press-hero-description">
              Discover the latest announcements, media resources, brand assets, 
              and updates from the Accesco Living ecosystem.
            </p>
          </div>
        </section>

        {/* Press Releases Section */}
        <section className="press-articles-section">
          <div className="press-container">
            <div className="press-section-header">
              <div>
                <h2 className="press-section-title">Latest Announcements</h2>
                <p className="press-section-subtitle">Official press releases and stories from our team</p>
              </div>
            </div>

            <div className="press-grid">
              {pressReleases.map((release) => (
                <article key={release.id} className={`press-card ${release.isFeatured ? 'featured' : ''}`}>
                  <div className="press-card-image-wrap">
                    <img 
                      src={release.image} 
                      alt={release.title} 
                      className="press-card-image"
                      onError={(e) => {
                        e.currentTarget.src = '/images/banners/hero-main.jpg';
                      }}
                    />
                    <span className="press-card-badge">{release.category}</span>
                    {release.logo && (
                      <div className="pioneer-logo-badge">
                        <img src={release.logo} alt="Publisher Logo" />
                      </div>
                    )}
                  </div>
                  
                  <div className="press-card-body">
                    <div className="press-card-meta">
                      <span className="press-card-date">{release.date}</span>
                      <span>•</span>
                      <span>{release.readTime}</span>
                    </div>
                    
                    <h3 className="press-card-title">{release.title}</h3>
                    <p className="press-card-excerpt">{release.excerpt}</p>
                    
                    <a 
                      href={release.url || "/blogs"} 
                      target={release.url ? "_blank" : undefined}
                      rel={release.url ? "noopener noreferrer" : undefined}
                      className="press-card-link"
                    >
                      {release.url ? "Read Article" : "Read Release"}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>



        {/* Press Contact Section */}
        <section className="press-contact-section">
          <div className="press-container">
            <div className="press-contact-card">
              <h2>Media & Inquiry Contact</h2>
              <p>
                For all official media, journalism, speaking opportunity, 
                and partnership inquiries, please contact our PR department.
              </p>
              
              <div className="press-contact-details">
                <div className="press-contact-item">
                  <strong>PR & Media Email</strong>
                  <a href="mailto:press@accescoliving.com">press@accescoliving.com</a>
                </div>
                
                <div className="press-contact-item">
                  <strong>Corporate Hotline</strong>
                  <a href="tel:+919972706940">+91 99727 06940</a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
