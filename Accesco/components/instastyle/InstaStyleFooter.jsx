'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import InstaStyleLogo from './InstaStyleLogo';
import '../Footer.css';
import { useEffect, useState } from 'react';

export default function InstaStyleFooter() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="accesco-footer-root">
      <div className="footer-main-content">
        
        <div className="footer-grid-layout">
          {/* Left Brand Column */}
          <div className="footer-brand-col">
            <Link href="/services/instastyle" className="logo-component">
              <InstaStyleLogo style={{ width: '40px', height: 'auto' }} />
              <span className="logo-wordmark">INSTASTYLE</span>
            </Link>
            
            <p className="brand-desc">
              Accesco's fashion vertical built around fast discovery, curated edits, and try-before-you-buy convenience. Outfit ready, before you are!
            </p>
            
            <div className="social-row">
              <a href="https://x.com/accesco_living?s=21" className="social-icon"><i className="ri-twitter-x-line"></i></a>
              <a href="https://www.instagram.com/accescoliving?igsh=MWI5dHBuOTB4Nm1uYQ==" className="social-icon"><i className="ri-instagram-line"></i></a>
              <a href="https://www.linkedin.com/company/acceso-living/" className="social-icon"><i className="ri-linkedin-fill"></i></a>
              <a href="#" className="social-icon"><i className="ri-facebook-fill"></i></a>
              <a href="https://www.youtube.com/@accescoliving" className="social-icon"><i className="ri-youtube-fill"></i></a>
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
              <h4 className="col-title">SHOP</h4>
              <Link href="/services/instastyle/catalog?sort=newest" className="link-item">New Arrivals</Link>
              <Link href="/services/instastyle/catalog?sort=popular" className="link-item">Best Sellers</Link>
              <Link href="/services/instastyle/catalog?sale=true" className="link-item">Sale</Link>
              <Link href="/services/instastyle/virtual-tryon" className="link-item">Virtual Try-On</Link>
              <Link href="/services/instastyle/swipestyle" className="link-item">SwipeStyle</Link>
            </div>
            
            <div className="link-group">
              <h4 className="col-title">COMPANY</h4>
              <Link href="/about" className="link-item">About Us</Link>
              <Link href="/services/instastyle/careers" className="link-item">Careers</Link>
              <Link href="/services/instastyle/press" className="link-item">Press</Link>
              <Link href="/services/instastyle/blogs" className="link-item">Blog</Link>
            </div>
            
            <div className="link-group">
              <h4 className="col-title">SUPPORT</h4>
              <Link href="/services/instastyle/help" className="link-item">Help Center</Link>
              <Link href="/services/instastyle/orders" className="link-item">Track Order</Link>
              <Link href="/services/instastyle/returns" className="link-item">Returns</Link>
              <Link href="/terms" className="link-item">Terms of Service</Link>
              <Link href="/privacy" className="link-item">Privacy Policy</Link>
            </div>

            <div className="link-group">
              <h4 className="col-title">PARTNERS</h4>
              <Link href="/services/instastyle/ambassadors" className="link-item">Ambassador Program</Link>
              <Link href="/services/instastyle/stylists" className="link-item">Stylist Portal</Link>
              <Link href="/services/instastyle/influencers" className="link-item">Influencer Hub</Link>
              <Link href="/partner" className="link-item">Vendor Relations</Link>
            </div>
          </div>
        </div>

        <div className="footer-divider-faint"></div>

        {/* Bottom Bar */}
        <div className="bottom-bar">
          <span className="copyright-text">© {currentYear} InstaStyle by Accesco Living. All rights reserved.</span>
        </div>
        
      </div>
    </footer>
  );
}
