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
    id: 4,
    title: 'Is Your Delivery App Fast Enough But Never Smart Enough?',
    date: 'June 2, 2026',
    category: 'Media Coverage',
    excerpt: 'At 9pm you have no milk left. You open an app order it. It takes 10 minutes. Problem solved. However, there is something to be noted here...',
    image: '/images/successsaga-cover.jpg',
    readTime: '5 min read',
    url: 'https://successsaga.com/is-your-delivery-app-fast-enough-but-never-smart-enough/',
    logo: '/logos/successsaga.png',
  },
  {
    id: 8,
    title: 'Accesco Living Launches Beta in Bengaluru Targets 20,000 Early Users in 45 Days',
    date: 'June 13, 2026',
    category: 'Media Coverage',
    excerpt: 'Many people in India use a lot of different apps to manage their daily needs. They buy groceries on one app, food on another and clothes on another app. Accesco Living, a company based in Bengaluru has started a beta program this week.',
    image: '/images/achievetimes.jpg',
    readTime: '4 min read',
    url: 'https://achievetimes.com/accesco-living-launches-beta-in-bengaluru-targets-20000-early/',
    logo: '/logos/achieve-times.jpeg',
  },
];

const pressKitItems = [
  {
    id: 'about',
    title: 'About Accesco',
    description: 'Company overview, mission & pitch deck',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    files: [{ name: 'Accesco Deck', url: '/pdfs/Accesco_deck.pdf', type: 'PDF' }],
  },
  {
    id: 'founder-bio',
    title: 'Founder Bio',
    description: 'Founding team photos and bios',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="9" height="9" rx="1" />
        <rect x="13" y="2" width="9" height="9" rx="1" />
        <rect x="2" y="13" width="9" height="9" rx="1" />
        <rect x="13" y="13" width="9" height="9" rx="1" />
      </svg>
    ),
    files: [
      { name: 'Founders Photo 1', url: '/Press/FoundersPIC1.PNG', type: 'IMG' },
      { name: 'Founders Photo 2', url: '/Press/FoundersPIC2.PNG', type: 'IMG' },
      { name: 'Founders Photo 3', url: '/Press/FoundersPIC3.PNG', type: 'IMG' },
      { name: 'Founders Photo 4', url: '/Press/FoundersPIC4.PNG', type: 'IMG' },
    ],
  },
  {
    id: 'founder-photos',
    title: 'Founder Photos',
    description: 'Individual hi-res portrait photos',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    files: [
      { name: 'Founder 1', url: '/Press/Founder1.jpeg', type: 'IMG' },
      { name: 'Founder 2', url: '/Press/Founder2.jpeg', type: 'IMG' },
      { name: 'Founder 3', url: '/Press/Founder3.PNG', type: 'IMG' },
      { name: 'Founder 4', url: '/Press/Founder4.jpeg', type: 'IMG' },
    ],
  },
  {
    id: 'logo-files',
    title: 'Logo Files',
    description: 'Brand logos in multiple formats',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    files: [
      { name: 'Logo 1', url: '/Press/LOGO1.PNG', type: 'IMG' },
      { name: 'Logo 2', url: '/Press/LOGO2.PNG', type: 'IMG' },
      { name: 'Logo 3', url: '/Press/LOGO3.jpeg', type: 'IMG' },
      { name: 'Logo 4', url: '/Press/LOGO4.jpeg', type: 'IMG' },
    ],
  },
];


export default function PressPage() {
  const [activeModal, setActiveModal] = React.useState(null);

  const openModal = (item) => setActiveModal(item);
  const closeModal = () => setActiveModal(null);

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
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PRESS KIT Section */}
        <section className="press-kit-section">
          <div className="press-container">
            <div className="press-kit-header">
              <h2 className="press-kit-heading">Brand Assets & Resources</h2>
              <p className="press-kit-subtext">Download official brand materials, founder bios, and media assets for editorial use.</p>
            </div>

            <div className="press-kit-cards-grid">
              {pressKitItems.map((item) => (
                <button
                  key={item.id}
                  className="press-kit-item-card"
                  onClick={() => openModal(item)}
                  aria-label={`Open ${item.title}`}
                >
                  <div className="press-kit-item-icon">
                    {item.icon}
                  </div>
                  <div className="press-kit-item-body">
                    <h3 className="press-kit-item-title">{item.title}</h3>
                    <p className="press-kit-item-desc">{item.description}</p>
                  </div>
                  <div className="press-kit-item-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Press Kit Modal */}
        {activeModal && (
          <div className="press-modal-overlay" onClick={closeModal}>
            <div className="press-modal" onClick={(e) => e.stopPropagation()}>
              <div className="press-modal-header">
                <div className="press-modal-icon">{activeModal.icon}</div>
                <div>
                  <h3 className="press-modal-title">{activeModal.title}</h3>
                  <p className="press-modal-desc">{activeModal.description}</p>
                </div>
                <button className="press-modal-close" onClick={closeModal} aria-label="Close">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="press-modal-files">
                {activeModal.files.map((file, idx) => (
                  <a
                    key={idx}
                    href={file.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press-modal-file-row"
                  >
                    <span className="press-modal-file-type">{file.type}</span>
                    <span className="press-modal-file-name">{file.name}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

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
