'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer id="contact" style={{ background: 'linear-gradient(180deg, #0F0508 0%, #07020A 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Top shimmer line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(122,0,66,0.5), rgba(200,150,62,0.4), transparent)',
      }} />

      {/* Decorative glow orbs */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(122,0,66,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '0', left: '-60px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,150,62,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>

        {/* ── Main Grid ── */}
        <div className="footer-main-grid">

          {/* Brand column */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Image
                  src="/images/accesco_white.png"
                  alt="accesco living"
                  width={40}
                  height={40}
                  loading="lazy"
                  style={{ width: '40px', height: '40px', objectFit: 'contain', filter: 'invert(15%) sepia(85%) saturate(4529%) hue-rotate(316deg) brightness(85%) contrast(101%) drop-shadow(0 4px 12px rgba(122,0,66,0.2))' }}
                />
                <span style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  color: '#FFFDF8',
                  letterSpacing: '-0.01em',
                }}>
                  Accesco Living
                </span>
              </div>
            </Link>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.88rem',
              color: 'rgba(255,253,248,0.45)',
              lineHeight: 1.7,
              marginBottom: '28px',
              maxWidth: '240px',
            }}>
              Smartly Simplified For Everyday India
            </p>

            {/* Social links — real hrefs preserved */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
              {[
                {
                  label: 'Instagram', href: 'https://www.instagram.com/accescoliving?igsh=MWI5dHBuOTB4Nm1uYQ==',
                  icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />,
                },
                {
                  label: 'Twitter / X', href: 'https://x.com/accesco_living?s=21',
                  icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
                },
                {
                  label: 'YouTube', href: 'https://www.youtube.com/@accescoliving',
                  icon: <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
                },
                {
                  label: 'LinkedIn', href: 'https://www.linkedin.com/company/acceso-living/',
                  icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />,
                },
                {
                  label: 'Threads', href: 'https://www.threads.net/@accescoliving',
                  icon: <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.125 14.5c-1.25 0-2.375-.5-3-1.375l-.375-.375c-.5-.625-.875-1.375-1-2.25-.125-.625-.125-1.25 0-1.875.125-.875.5-1.625 1-2.25l.375-.375c.625-.875 1.75-1.375 3-1.375 2.5 0 4.375 1.875 4.375 4.375s-1.875 4.375-4.375 4.375zm0-7.25c-1.625 0-2.875 1.25-2.875 2.875s1.25 2.875 2.875 2.875 2.875-1.25 2.875-2.875-1.25-2.875-2.875-2.875zm2.875 4.25c-.125.75-.5 1.375-1.125 1.875-.5.375-1.125.625-1.75.625s-1.25-.25-1.75-.625c-.625-.5-1-1.125-1.125-1.875h-1.25c.125 1.375.875 2.5 1.875 3.125.625.375 1.5.625 2.25.625s1.625-.25 2.25-.625c1-.625 1.75-1.75 1.875-3.125h-1.25z" />,
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: 'rgba(255,253,248,0.06)',
                    border: '1px solid rgba(255,253,248,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,253,248,0.5)',
                    textDecoration: 'none',
                    transition: 'background 0.2s, color 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(122,0,66,0.5)';
                    e.currentTarget.style.color = '#FFFDF8';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,253,248,0.06)';
                    e.currentTarget.style.color = 'rgba(255,253,248,0.5)';
                    e.currentTarget.style.transform = '';
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">{s.icon}</svg>
                </a>
              ))}
            </div>

            {/* Store badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { store: 'App Store', sub: 'Download on the', href: '#' },
                { store: 'Google Play', sub: 'GET IT ON', href: '#' },
              ].map((b) => (
                <a
                  key={b.store}
                  href={b.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 16px',
                    background: 'rgba(255,253,248,0.05)',
                    border: '1px solid rgba(255,253,248,0.1)',
                    borderRadius: '12px', textDecoration: 'none',
                    transition: 'background 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,253,248,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,253,248,0.05)'; e.currentTarget.style.transform = ''; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFDF8">
                    {b.store === 'Google Play'
                      ? <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.37.6 1.23 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z" />
                      : <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    }
                  </svg>
                  <div>
                    <div style={{ fontSize: '0.58rem', opacity: 0.5, fontFamily: "'DM Sans', sans-serif", color: '#FFFDF8' }}>{b.sub}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, fontFamily: "'Sora', sans-serif", color: '#FFFDF8' }}>{b.store}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="footer-links-columns">
            {[
              { title: 'Company', links: [{ label: 'About Us', href: '/about' }, { label: 'Careers', href: 'https://www.linkedin.com/company/acceso-living/', ext: true }, { label: 'Contact Us', href: '/contact' }] },
              { title: 'Services', links: [{ label: 'Grokly', href: '/services/grokly' }, { label: 'Swadishtt', href: '/services/swadisht' }, { label: 'InstaStyle', href: '/services/instastyle' }, { label: 'DineX', href: '/services/dinex' }, { label: 'LocalMeds', href: '/services/localmeds' }] },
              { title: 'Partner Programs', links: [{ label: 'Content Creator', href: '/partner/creator' }, { label: 'Vendor Partner', href: '/partner/vendor' }, { label: 'Delivery Partner', href: '/partner/delivery' }] },
              { title: 'Resources', links: [{ label: 'QTC Videos', href: '/qtcvideos' }, { label: 'Blog', href: '/blogs' }] },
              { title: 'Legal', links: [{ label: 'Terms of Service', href: '/terms' }, { label: 'Privacy Policy', href: '/privacy' }, { label: 'Cookie Policy', href: '/cookies' }, { label: 'Refund Policy', href: '/refund' }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,253,248,0.3)',
                  marginBottom: '18px',
                }}>
                  {col.title}
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.ext ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', color: 'rgba(255,253,248,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#C8963E'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,253,248,0.5)'; }}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', color: 'rgba(255,253,248,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#C8963E'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,253,248,0.5)'; }}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 0', borderTop: '1px solid rgba(255,253,248,0.06)',
          flexWrap: 'wrap', gap: '16px',
        }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: 'rgba(255,253,248,0.3)', margin: 0 }}>
            2025 &copy; Accesco Living. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Cookie Policy', '/cookies']].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: 'rgba(255,253,248,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,253,248,0.6)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,253,248,0.3)'; }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-main-grid {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 60px;
          padding: 60px 0 32px;
          border-bottom: 1px solid rgba(255,253,248,0.06);
        }
        .footer-links-columns {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 28px;
        }
        @media (max-width: 1100px) {
          .footer-links-columns { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 860px) {
          .footer-main-grid { grid-template-columns: 1fr; gap: 48px; padding: 40px 0; }
          .footer-links-columns { 
            grid-template-columns: repeat(2, 1fr); 
            gap: 40px 20px; 
          }
        }
        @media (max-width: 480px) {
          .footer-links-columns { 
            grid-template-columns: 1fr 1fr; 
            gap: 24px 16px; 
          }
          .footer-main-grid { text-align: left; gap: 32px; padding: 32px 0; }
          footer > div { padding: 0 24px !important; }
          .footer-links-columns > div:last-child { grid-column: 1 / -1; }
        }
      `}</style>
    </footer>
  );
}
