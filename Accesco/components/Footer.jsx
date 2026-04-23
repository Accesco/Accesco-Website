'use client';

import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="brand-logo" style={{ textDecoration: 'none' }}>
              <img src="/images/accesco_white.png" alt="Accesco Logo" style={{ height: '32px', width: 'auto', marginRight: '10px' }} />
              <span className="logo-ac">Accesco</span>
              <span className="logo-living">Living</span>
            </Link>
            <p className="brand-desc">
              India's first intelligent circular commerce ecosystem. 
              Delivering Groceries, Food, Fashion, and Financial Intelligence — all under one unified platform.
            </p>
            <div className="social-links">
              <a href="https://twitter.com/accescoliving" aria-label="Twitter"><i className="ri-twitter-x-line"></i></a><a href="https://instagram.com/accescoliving" aria-label="Instagram"><i className="ri-instagram-line"></i></a><a href="https://linkedin.com/company/accescoliving" aria-label="LinkedIn"><i className="ri-linkedin-fill"></i></a>
            </div>
          </div>
          
          <div className="footer-links-grid">
            <div className="footer-column">
              <h4>Services</h4>
              <ul>
                <li><Link href="/services/grokly">Grokly Groceries</Link></li>
                <li><Link href="/services/swadisht">Swadishtt Meals</Link></li>
                <li><Link href="/services/instastyle">InstaStyle Fashion</Link></li>
                <li><Link href="/services/dinex">DineX Premium</Link></li>
                <li><Link href="/services/localmeds">LocalMeds</Link></li>
                <li><Link href="/calculator">Xpense Meter</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/sustainability">Sustainability</Link></li>
                <li><Link href="/press">Press & Media</Link></li>
                <li><Link href="/blogs">Blogs</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><Link href="/contact">Help & Support</Link></li>
                <li><Link href="/partner">Partner with Us</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/referral">Referral Program</Link></li>
                <li><Link href="/investors">Investor Relations</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} Accesco Living India Pvt Ltd. All rights reserved.
          </div>
          <div className="footer-legal">
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/refunds">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
