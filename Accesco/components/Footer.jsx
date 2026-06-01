'use client';

import Link from 'next/link';
import './Footer.css';
import { useEffect, useState } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="accesco-footer-root">
      <div className="footer-main-content">
        
        <div className="footer-grid-layout">
          {/* Left Brand Column */}
          <div className="footer-brand-col">
            <Link href="/" className="logo-component">
              <img src="/images/ac-logo.png" alt="AC" style={{ width: '32px', height: 'auto' }} />
              <span className="logo-wordmark">Accesco Living</span>
            </Link>
            
            <p className="brand-desc">
              India's first intelligent circular commerce ecosystem. Delivering Groceries, Food, Fashion, and Financial Intelligence — all under one unified platform.
            </p>
            
            <div className="social-row">
              <a href="https://x.com/accesco_living?s=11" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="ri-twitter-x-line"></i></a>
              <a href="https://www.instagram.com/accescoliving" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="ri-instagram-line"></i></a>
              <a href="https://www.linkedin.com/company/acceso-living/" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="ri-linkedin-fill"></i></a>
              <a href="https://www.facebook.com/share/1BMyjWcU1B/" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="ri-facebook-fill"></i></a>
              <a href="https://youtube.com/@accescoliving?si=Xzk9m4vzZqW6-lje" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="ri-youtube-fill"></i></a>
              <a href="https://pin.it/77fE8R0rC" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="ri-pinterest-fill"></i></a>
              <a href="mailto:support@accescoliving.com" className="social-icon"><i className="ri-mail-send-line"></i></a>
            </div>
            
            <div className="app-badges">
              <a href="#" className="app-badge">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="badge-img" />
              </a>
              <a href="#" className="app-badge">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="badge-img" />
              </a>
            </div>
          </div>

          {/* Right Links Columns */}
          <div className="footer-links-col">
            <div className="link-group">
              <h4 className="col-title">SERVICES</h4>
              <Link href="/services/grokly" className="link-item">Grokly</Link>
              <Link href="/services/swadisht" className="link-item">Swadishtt</Link>
              <Link href="/services/instastyle" className="link-item">InstaStyle</Link>
            </div>
            
            <div className="link-group">
              <h4 className="col-title">COMPANY</h4>
              <Link href="/about" className="link-item">About Us</Link>
              <Link href="/qtcvideos" className="link-item">QTC Videos</Link>
              <Link href="/press" className="link-item">Press & Media</Link>
              <Link href="/blogs" className="link-item">Blogs</Link>
              <Link href="/terms" className="link-item">Terms of Service</Link>
              <Link href="/privacy" className="link-item">Privacy Policy</Link>
              <Link href="/refund" className="link-item">Refund & Cancellation Policy</Link>
            </div>
            
            <div className="link-group">
              <h4 className="col-title">RESOURCES</h4>
              <Link href="/contact" className="link-item">Help & Support</Link>
              <Link href="/faq" className="link-item">FAQ</Link>
              <Link href="/referral" className="link-item">Referral Program</Link>
              <Link href="/investor-relations" className="link-item">Investor Relations</Link>
            </div>

            <div className="link-group">
              <h4 className="col-title">FOR DELIVERY PARTNERS</h4>
              <Link href="/partner" className="link-item">Partner with us</Link>
              <Link href="/apps-for-you" className="link-item">Apps for you</Link>
            </div>
          </div>
        </div>

        <div className="footer-divider-faint"></div>

        {/* Bottom Bar */}
        <div className="bottom-bar">
          <span className="copyright-text">© {currentYear} Accesco Living. All rights reserved.</span>
        </div>
        
      </div>
    </footer>
  );
}
