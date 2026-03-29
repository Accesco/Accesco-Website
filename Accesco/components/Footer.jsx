'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer id="contact" style={{ background: 'linear-gradient(135deg, #4a0e4e 0%, #2d0a2e 100%)', padding: '60px 0 0 0' }}>
      <div className="footer-grid">
        <div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div className="logo" style={{ width: '110px', height: '110px', fontSize: '18px' }}>
              <Image
                src="/images/accesco_white.png"
                alt="AccesCo Logo"
                width={110}
                height={110}
                loading="lazy"
              />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: 'white', fontSize: '24px' }}>
                AccesCo Living
              </div>
              <div style={{ color: '#d8b3e0', marginTop: '6px', maxWidth: '250px' }}>
                Smartly Simplified For Everyday India
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'white', letterSpacing: '1.5px', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>COMPANY</h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, color: '#d8b3e0', marginTop: '14px', fontSize: '15px', lineHeight: 2 }}>
            <li><Link href="/about" style={{ color: '#d8b3e0', textDecoration: 'none', transition: 'color 0.2s' }}>About Us</Link></li>
            <li><a href="https://www.linkedin.com/company/acceso-living/" target="_blank" rel="noopener noreferrer" style={{ color: '#d8b3e0', textDecoration: 'none', transition: 'color 0.2s' }}>Careers</a></li>
            <li><Link href="/partner" style={{ color: '#d8b3e0', textDecoration: 'none', transition: 'color 0.2s' }}>Partner With Us</Link></li>
            <li><Link href="/terms" style={{ color: '#d8b3e0', textDecoration: 'none', transition: 'color 0.2s' }}>Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', letterSpacing: '1.5px', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>OUR SERVICES</h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, color: '#d8b3e0', marginTop: '14px', fontSize: '15px', lineHeight: 2 }}>
            <li><Link href="/services/grokly" style={{ color: '#d8b3e0', textDecoration: 'none', transition: 'color 0.2s' }}>Grokly</Link></li>
            <li><Link href="/services/swadisht" style={{ color: '#d8b3e0', textDecoration: 'none', transition: 'color 0.2s' }}>Swadishtt</Link></li>
            <li><Link href="/services/instastyle" style={{ color: '#d8b3e0', textDecoration: 'none', transition: 'color 0.2s' }}>InstaStyle</Link></li>
            <li><Link href="/services/dinex" style={{ color: '#d8b3e0', textDecoration: 'none', transition: 'color 0.2s' }}>DineX</Link></li>
            <li><Link href="/services/localmeds" style={{ color: '#d8b3e0', textDecoration: 'none', transition: 'color 0.2s' }}>LocalMeds</Link></li>
            <li><Link href="/services/swadisht-cafe" style={{ color: '#d8b3e0', textDecoration: 'none', transition: 'color 0.2s' }}>Swadishtt Cafe</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', letterSpacing: '1.5px', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>RESOURCES</h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, color: '#d8b3e0', marginTop: '14px', fontSize: '15px', lineHeight: 2 }}>
            <li><Link href="#" style={{ color: '#d8b3e0', textDecoration: 'none', transition: 'color 0.2s' }}>Metrics & Certificates</Link></li>
            <li><Link href="/qtcvideos" style={{ color: '#d8b3e0', textDecoration: 'none', transition: 'color 0.2s' }}>QTC Videos</Link></li>
            <li><Link href="/blogs" id="blog-link" style={{ color: '#d8b3e0', textDecoration: 'none', transition: 'color 0.2s' }}>Blogs</Link></li>
            <li><Link href="/contact" style={{ color: '#d8b3e0', textDecoration: 'none', transition: 'color 0.2s' }}>Help & Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', letterSpacing: '1.5px', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>SOCIAL LINKS</h4>
          <div className="social-links" style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <a href="https://www.instagram.com/accescoliving?igsh=MWI5dHBuOTB4Nm1uYQ==" target="_blank" className="social-icon" aria-label="Instagram" rel="noopener noreferrer" style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#6b1f73', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '1px solid #8b3f93', transition: 'all 0.3s', fontSize: '18px' }}>
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://x.com/accesco_living?s=21" target="_blank" className="social-icon" aria-label="X" rel="noopener noreferrer" style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#6b1f73', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '1px solid #8b3f93', transition: 'all 0.3s', fontSize: '18px' }}>
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="https://www.youtube.com/@accescoliving" target="_blank" className="social-icon" aria-label="YouTube" rel="noopener noreferrer" style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#6b1f73', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '1px solid #8b3f93', transition: 'all 0.3s', fontSize: '18px' }}>
              <i className="fa-brands fa-youtube"></i>
            </a>
            <a href="https://www.linkedin.com/company/acceso-living/" target="_blank" className="social-icon" aria-label="LinkedIn" rel="noopener noreferrer" style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#6b1f73', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '1px solid #8b3f93', transition: 'all 0.3s', fontSize: '18px' }}>
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="https://www.threads.net/@accescoliving" target="_blank" className="social-icon" aria-label="Threads" rel="noopener noreferrer" style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#6b1f73', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '1px solid #8b3f93', transition: 'all 0.3s', fontSize: '18px' }}>
              <i className="ri-threads-line"></i>
            </a>
          </div>

          <div className="app-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Image src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" className="app-btn-img" alt="App Store" width={135} height={40} loading="lazy" />
            <Image src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="app-btn-img" alt="Google Play" width={135} height={40} loading="lazy" />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '50px', paddingTop: '20px', paddingBottom: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', color: '#d8b3e0', fontSize: '13px', textAlign: 'center' }}>
        © 2025 AccesCo — All rights reserved.
      </div>

      <style jsx>{`
        .footer-grid {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px 50px 40px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 40px;
        }

        .social-icon:hover {
          background: #fff !important;
          color: #4a0e4e !important;
          transform: translateY(-3px);
        }

        .footer-grid a:hover {
          color: #fff !important;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            padding: 0 24px 40px 24px;
          }
        }
      `}</style>
    </footer>
  );
}
