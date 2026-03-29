'use client'

import Link from 'next/link'

export default function InstaStyleCard() {
  return (
    <>
      <section className="instastyle-section">
        <div className="instastyle-container">
          <div className="instastyle-card">
            {/* Left Side - Content */}
            <div className="instastyle-content">
              <div className="new-badge">
                <span className="pulse-dot"></span>
                NEW SERVICE
              </div>
              
              <h2 className="instastyle-title">InstaStyle</h2>
              
              <p className="instastyle-description">
                A new wave of clothing and self-expression — designed to 
                elevate your style. Experience personalized fashion at your fingertips.
              </p>

              <div className="features-list">
                <div className="feature-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <span>Personalized Style Recommendations</span>
                </div>
                <div className="feature-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <span>Curated Fashion Collections</span>
                </div>
                <div className="feature-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <span>Express Delivery</span>
                </div>
              </div>

              <div className="cta-buttons">
                <Link href="/services/instastyle">
                  <button className="explore-btn">
                    Explore InstaStyle
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </Link>
                
                <div className="coming-soon-badge">
                  <span className="shimmer">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="instastyle-visual">
              <div className="video-preview">
                <video autoPlay muted loop playsInline>
                  <source src="/videos/fashion-opener.mp4" type="video/mp4" />
                </video>
                <div className="video-overlay"></div>
                
                <div className="brand-overlay">
                  <h3>InstaStyle</h3>
                  <p>Redefining Fashion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .instastyle-section {
          padding: 80px 20px;
          background: linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%);
        }

        .instastyle-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .instastyle-card {
          background: white;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }

        .instastyle-content {
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .new-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(139, 10, 20, 0.08);
          color: #8b0a14;
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 20px;
          width: fit-content;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #8b0a14;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
        }

        .instastyle-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 900;
          color: #1a1a1a;
          margin: 0 0 20px 0;
          letter-spacing: -1px;
        }

        .instastyle-description {
          font-size: 18px;
          line-height: 1.7;
          color: #666;
          margin: 0 0 32px 0;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 36px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          color: #333;
          font-weight: 600;
        }

        .feature-item svg {
          color: #8b0a14;
          flex-shrink: 0;
        }

        .cta-buttons {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .explore-btn {
          background: linear-gradient(135deg, #8b0a14 0%, #c03b3b 100%);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          box-shadow: 0 8px 24px rgba(139, 10, 20, 0.3);
        }

        .explore-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(139, 10, 20, 0.4);
        }

        .coming-soon-badge {
          padding: 12px 24px;
          border-radius: 50px;
          border: 2px solid #e0e0e0;
          background: #f8f8f8;
          font-size: 14px;
          font-weight: 700;
          color: #666;
          letter-spacing: 1px;
          text-transform: uppercase;
          overflow: hidden;
          position: relative;
        }

        .shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(
            90deg,
            #666 0%,
            #999 50%,
            #666 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }

        .instastyle-visual {
          position: relative;
          min-height: 500px;
        }

        .video-preview {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .video-preview video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0.6) 100%
          );
        }

        .brand-overlay {
          position: absolute;
          bottom: 40px;
          left: 40px;
          color: white;
          z-index: 1;
        }

        .brand-overlay h3 {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 900;
          margin: 0 0 8px 0;
          letter-spacing: 1px;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .brand-overlay p {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .instastyle-card {
            grid-template-columns: 1fr;
          }

          .instastyle-content {
            padding: 40px 32px;
          }

          .instastyle-title {
            font-size: 36px;
          }

          .instastyle-visual {
            min-height: 400px;
          }
        }

        @media (max-width: 640px) {
          .instastyle-section {
            padding: 40px 16px;
          }

          .instastyle-content {
            padding: 32px 24px;
          }

          .instastyle-title {
            font-size: 32px;
          }

          .instastyle-description {
            font-size: 16px;
          }

          .cta-buttons {
            flex-direction: column;
            width: 100%;
          }

          .explore-btn {
            width: 100%;
            justify-content: center;
          }

          .coming-soon-badge {
            width: 100%;
            text-align: center;
          }

          .instastyle-visual {
            min-height: 300px;
          }

          .brand-overlay {
            bottom: 24px;
            left: 24px;
          }

          .brand-overlay h3 {
            font-size: 28px;
          }
        }
      `}</style>
    </>
  )
}
