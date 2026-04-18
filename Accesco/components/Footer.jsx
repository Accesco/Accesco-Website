'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer id="contact">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-logo-wrapper">
              <Image
                src="/images/accesco_white.png"
                alt="AccesCo Logo"
                width={80}
                height={80}
                loading="lazy"
                className="brand-logo-img"
              />
            </div>
            <h3 className="brand-name">Accesco Living</h3>
            <p className="brand-tagline">Smartly Simplified For Everyday India</p>
            
            {/* Social Links */}
            <div className="social-section">
              <h4 className="social-title">Connect With Us</h4>
              <div className="social-links">
                <a 
                  href="https://www.instagram.com/accescoliving?igsh=MWI5dHBuOTB4Nm1uYQ==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Instagram"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a 
                  href="https://x.com/accesco_living?s=21" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="X (Twitter)"
                >
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
                <a 
                  href="https://www.youtube.com/@accescoliving" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="YouTube"
                >
                  <i className="fa-brands fa-youtube"></i>
                </a>
                <a 
                  href="https://www.linkedin.com/company/acceso-living/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="LinkedIn"
                >
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a 
                  href="https://www.threads.net/@accescoliving" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Threads"
                >
                  <i className="ri-threads-line"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="footer-links-grid">
            {/* Company */}
            <div className="footer-column">
              <h4 className="column-title">Company</h4>
              <ul className="column-links">
                <li><Link href="/about">About Us</Link></li>
                <li><a href="https://www.linkedin.com/company/acceso-living/" target="_blank" rel="noopener noreferrer">Careers</a></li>
               
                <li><Link href="/contact">Contact Us</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className="footer-column">
              <h4 className="column-title">Services</h4>
              <ul className="column-links">
                <li><Link href="/services/grokly">Grokly</Link></li>
                <li><Link href="/services/swadisht">Swadishtt</Link></li>
                <li><Link href="/services/instastyle">InstaStyle</Link></li>
                <li><Link href="/services/dinex">DineX</Link></li>
                <li><Link href="/services/localmeds">LocalMeds</Link></li>
              </ul>
            </div>

            {/* Partner Programs */}
            <div className="footer-column">
              <h4 className="column-title">Partner Programs</h4>
              <ul className="column-links">
                <li><Link href="/partner/creator">Content Creator</Link></li>
                <li><Link href="/partner/vendor">Vendor Partner</Link></li>
                <li><Link href="/partner/delivery">Delivery Partner</Link></li>
                
              </ul>
            </div>

            {/* Resources */}
            <div className="footer-column">
              <h4 className="column-title">Resources</h4>
              <ul className="column-links">
                <li><Link href="/qtcvideos">QTC Videos</Link></li>
                
                <li><Link href="/blogs">Blog</Link></li>
               
              </ul>
            </div>

            {/* Legal */}
            <div className="footer-column">
              <h4 className="column-title">Legal</h4>
              <ul className="column-links">
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/cookies">Cookie Policy</Link></li>
                <li><Link href="/refund">Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Download Section */}
          <div className="footer-download">
            <h4 className="download-title">Download App</h4>
            <p className="download-desc">Get the full experience on mobile</p>
            <div className="app-badges">
              <a href="#" target="_blank" rel="noopener noreferrer" className="app-badge">
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                  alt="App Store" 
                  width={120} 
                  height={40} 
                  loading="lazy"
                  style={{ width: '120px', height: 'auto', display: 'block', borderRadius: 0 }}
                />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="app-badge">
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Google Play" 
                  width={135} 
                  height={40} 
                  loading="lazy"
                  style={{ width: '120px', height: 'auto', display: 'block', borderRadius: 0 }}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">© 2025 AccesCo Living. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        footer {
          background: linear-gradient(180deg, #1a0014 0%, #0d0009 100%);
          position: relative;
          overflow: hidden;
        }

        footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(122, 0, 66, 0.5), transparent);
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .footer-main {
          display: grid;
          grid-template-columns: 1fr 2.5fr 0.9fr;
          gap: 20px;
          padding: 10px 0 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Brand Section */
        .footer-brand {
          display: flex;
          flex-direction: column;
        }

        .brand-logo-wrapper {
          width: 80px;
          height: 80px;
          margin-bottom: 20px;
          position: relative;
        }

        .brand-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 4px 12px rgba(122, 0, 66, 0.3));
        }

        .brand-name {
          font-size: 32px;
          font-weight: 900;
          color: #ffffff;
          margin: 0 0 16px 0;
          letter-spacing: -0.5px;
          font-family: 'Davetica', sans-serif;
        }

        .brand-tagline {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.7;
          margin: 0 0 40px 0;
          max-width: 320px;
        }

        /* Social Section */
        .social-section {
          margin-top: auto;
        }

        .social-title {
          font-size: 16px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin: 0 0 20px 0;
        }

        .social-links {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .social-link {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: rgba(122, 0, 66, 0.25);
          border: 2px solid rgba(122, 0, 66, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.9);
          font-size: 22px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
        }

        .social-link:hover {
          background: linear-gradient(135deg, #7A0042, #9d0054);
          border-color: #9d0054;
          color: #ffffff;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(122, 0, 66, 0.5);
        }

        /* Links Grid */
        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 32px;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
        }

        .column-title {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin: 0 0 28px 0;
        }

        .column-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .column-links li {
          line-height: 1.5;
        }

        .column-links a {
          color: rgba(255, 255, 255, 0.75);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-block;
          position: relative;
        }

        .column-links a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, #7A0042, #ffb347);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .column-links a:hover {
          color: #ffffff;
          transform: translateX(4px);
        }

        .column-links a:hover::after {
          width: 100%;
        }

        /* Download Section */
        .footer-download {
          display: flex;
          flex-direction: column;
        }

        .download-title {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin: 0 0 16px 0;
        }

        .download-desc {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.75);
          margin: 0 0 28px 0;
          line-height: 1.6;
        }

        .app-badges {
          display: flex;
          flex-direction: row;
          gap: 12px;
        }

        .app-badge {
          display: block;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: visible;
          border-radius: 0;
        }

        .app-badge:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }

        .app-badge img {
          display: block;
          width: auto;
          height: auto;
          border-radius: 0;
          object-fit: contain;
        }

        /* Footer Bottom */
        .footer-bottom {
          padding: 32px 0;
        }

        .footer-bottom-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }

        .copyright {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
          font-weight: 500;
        }

        .footer-bottom-links {
          display: flex;
          gap: 36px;
          flex-wrap: wrap;
        }

        .footer-bottom-links a {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .footer-bottom-links a:hover {
          color: #ffffff;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .footer-main {
            grid-template-columns: 1fr;
            gap: 60px;
          }

          .footer-links-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 40px;
          }
        }

        @media (max-width: 768px) {
          .footer-container {
            padding: 0 24px;
          }

          .footer-main {
            padding: 60px 0 40px;
            gap: 50px;
          }

          .footer-links-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }

          .footer-links-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }

          .brand-name {
            font-size: 24px;
          }

          .brand-tagline {
            font-size: 14px;
          }

          .social-links {
            gap: 10px;
          }

          .social-link {
            width: 42px;
            height: 42px;
            font-size: 16px;
          }

          .footer-bottom-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .footer-bottom-links {
            gap: 20px;
          }
        }

        @media (max-width: 480px) {
          .footer-container {
            padding: 0 16px;
          }

          .footer-main {
            padding: 50px 0 30px;
          }

          .footer-links-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .brand-logo-wrapper {
            width: 70px;
            height: 70px;
          }

          .brand-name {
            font-size: 22px;
          }

          .footer-bottom {
            padding: 24px 0;
          }

          .copyright {
            font-size: 13px;
          }

          .footer-bottom-links {
            flex-direction: column;
            gap: 12px;
          }

          .footer-bottom-links a {
            font-size: 13px;
          }
        }
      `}</style>
    </footer>
  );
}
