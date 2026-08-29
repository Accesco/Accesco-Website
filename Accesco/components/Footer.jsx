'use client';

import Link from 'next/link';
import Image from 'next/image';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="accesco-footer-root">
      <div className="footer-main-content">
        
        <div className="footer-grid-layout">
          {/* Left Brand Column */}
          <div className="footer-brand-col">
            <Link href="/" className="logo-component">
              <Image 
                src="/images/ac-logo.png" 
                alt="Accesco Living Logo" 
                className="logo-component-icon" 
                width={60} 
                height={60} 
              />
              <span className="logo-wordmark">Accesco Living</span>
            </Link>
            
            <p className="brand-desc">
              India's first intelligent circular commerce ecosystem. Delivering Groceries, Food, and Fashion under one unified platform.
            </p>
            
            {/* Social Links with WCAG Discernible Name Labels */}
            <div className="social-row">
              <a 
                href="https://x.com/accesco_living?s=11" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon"
                aria-label="Follow Accesco Living on X (Twitter)"
              >
                <i className="ri-twitter-x-line" aria-hidden="true"></i>
              </a>

              <a 
                href="https://www.instagram.com/accescostore?utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon"
                aria-label="Follow Accesco Living on Instagram"
              >
                <i className="ri-instagram-line" aria-hidden="true"></i>
              </a>

              <a 
                href="https://www.linkedin.com/company/accesco-living/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon"
                aria-label="Follow Accesco Living on LinkedIn"
              >
                <i className="ri-linkedin-fill" aria-hidden="true"></i>
              </a>

              <a 
                href="https://www.facebook.com/share/1BMyjWcU1B/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon"
                aria-label="Follow Accesco Living on Facebook"
              >
                <i className="ri-facebook-fill" aria-hidden="true"></i>
              </a>

              <a 
                href="https://youtube.com/@accescoliving?si=Xzk9m4vzZqW6-lje" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon"
                aria-label="Subscribe to Accesco Living on YouTube"
              >
                <i className="ri-youtube-fill" aria-hidden="true"></i>
              </a>

              <a 
                href="https://pin.it/77fE8R0rC" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon"
                aria-label="Follow Accesco Living on Pinterest"
              >
                <i className="ri-pinterest-fill" aria-hidden="true"></i>
              </a>

              <a 
                href="mailto:support@accescoliving.com" 
                className="social-icon"
                aria-label="Send email to Accesco Support"
              >
                <i className="ri-mail-send-line" aria-hidden="true"></i>
              </a>
            </div>
            
            <div className="app-badges">
              <a 
                href="#" 
                className="app-badge"
                aria-label="Download Accesco Living app on Google Play Store"
              >
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Google Play Store" 
                  className="badge-img" 
                  width={135} 
                  height={40} 
                />
              </a>

              <a 
                href="#" 
                className="app-badge"
                aria-label="Download Accesco Living app on Apple App Store"
              >
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                  alt="Apple App Store" 
                  className="badge-img " 
                  width={135} 
                  height={24} 
                />
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
              <Link href="/accesco-library" className="link-item">Accesco Library</Link>
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
              <Link href="/careers" className="link-item">Careers</Link>
            </div>

            <div className="link-group">
              <h4 className="col-title">FOR DELIVERY PARTNERS</h4>
              <Link href="/partner" className="link-item">Partner with us</Link>
              <Link href="/partner/delivery" className="link-item">Apps for you</Link>
            </div>
          </div>
        </div>

        <div className="footer-watermark">
          accesco
        </div>

        <div className="footer-divider-faint"></div>

        <div className="bottom-bar">
          <span className="copyright-text">
            © {currentYear} Accesco Living. All rights reserved.
          </span>

          <span className="copyright-text">
            Bengaluru, Karnataka • India
          </span>
        </div>

      </div>
    </footer>
  );
}