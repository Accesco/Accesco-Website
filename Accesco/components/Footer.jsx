'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-logo">
              <span className="logo-ac">Accesco</span>
              <span className="logo-living">Living</span>
            </div>
            <p className="brand-desc">
              India's first intelligent circular commerce ecosystem. 
              Delivering Groceries, Food, Fashion, and Financial Intelligence — all under one unified platform.
            </p>
            <div className="social-links">
              <a href="https://twitter.com/accescoliving" aria-label="Twitter"><i className="ri-twitter-x-line"></i></a>
              <a href="https://instagram.com/accescoliving" aria-label="Instagram"><i className="ri-instagram-line"></i></a>
              <a href="https://linkedin.com/company/accescoliving" aria-label="LinkedIn"><i className="ri-linkedin-fill"></i></a>
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

      <style dangerouslySetInnerHTML={{ __html: `
        .footer-wrapper {
          background: #1A0A0F;
          padding: 80px 0 32px 0;
          color: #FFFDF8;
          font-family: 'DM Sans', sans-serif;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 80px;
          margin-bottom: 60px;
        }

        .footer-brand {
          max-width: 320px;
        }

        .brand-logo {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 20px;
        }

        .logo-ac {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 1.5rem;
          color: #FFFDF8;
        }

        .logo-living {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 1.5rem;
          color: #C8963E;
        }

        .brand-desc {
          font-size: 0.9rem;
          color: rgba(255, 253, 248, 0.7);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .social-links {
          display: flex;
          gap: 16px;
        }

        .social-links a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          color: #FFFDF8;
          text-decoration: none;
          transition: all 0.3s;
          font-size: 1.2rem;
        }

        .social-links a:hover {
          background: #7A0042;
          transform: translateY(-2px);
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .footer-column h4 {
          font-family: 'Sora', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 24px;
          color: #FFFDF8;
        }

        .footer-column ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-column ul li {
          margin-bottom: 14px;
        }

        .footer-column ul li a {
          color: rgba(255, 253, 248, 0.7);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .footer-column ul li a:hover {
          color: #C8963E;
        }

        .footer-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin-bottom: 32px;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-copyright {
          font-size: 0.8rem;
          color: rgba(255, 253, 248, 0.5);
        }

        .footer-legal {
          display: flex;
          gap: 24px;
        }

        .footer-legal a {
          font-size: 0.8rem;
          color: rgba(255, 253, 248, 0.5);
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-legal a:hover {
          color: #FFFDF8;
        }

        @media (max-width: 960px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          
          .footer-links-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .footer-bottom {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .footer-legal {
            flex-wrap: wrap;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .footer-links-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      ` }} />
    </footer>
  );
}
