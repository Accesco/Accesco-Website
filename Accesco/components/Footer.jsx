'use client';

import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">

        {/* Top Section */}
        <div className="footer-top">

          {/* Brand Column */}
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

            {/* Social Icons */}
            <div className="social-links">
              <a href="https://twitter.com/accescoliving" aria-label="Twitter (X)">
                <i className="ri-twitter-x-line"></i>
              </a>
              <a href="https://instagram.com/accescoliving" aria-label="Instagram">
                <i className="ri-instagram-line"></i>
              </a>
              <a href="https://linkedin.com/company/accescoliving" aria-label="LinkedIn">
                <i className="ri-linkedin-fill"></i>
              </a>
              <a href="https://facebook.com/accescoliving" aria-label="Facebook">
                <i className="ri-facebook-fill"></i>
              </a>
              <a href="https://youtube.com/@accescoliving" aria-label="YouTube">
                <i className="ri-youtube-fill"></i>
              </a>
              <a href="https://threads.net/@accescoliving" aria-label="Threads">
                <i className="ri-at-line"></i>
              </a>
            </div>

            {/* App Badges */}
            <div className="footer-app-badges">
              <a href="#" className="footer-badge-link">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                />
              </a>
              <a href="#" className="footer-badge-link">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store"
                />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="footer-links-grid">
            <div className="footer-column">
              <h4>Services</h4>
              <ul>
                <li><Link href="/services/grokly">Grokly</Link></li>
                <li><Link href="/services/swadisht">Swadishtt</Link></li>
                <li><Link href="/services/instastyle">InstaStyle</Link></li>
                <li><Link href="/services/dinex">DineX</Link></li>
                <li><Link href="/services/localmeds">LocalMeds</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/press">Press &amp; Media</Link></li>
                <li><Link href="/blogs">Blogs</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><Link href="/contact">Help &amp; Support</Link></li>
                <li><Link href="/partner">Partner with Us</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/referral">Referral Program</Link></li>
                <li><Link href="/investors">Investor Relations</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Accesco Living. All rights reserved.
          </p>
          <div className="footer-legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookies">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
