'use client'

import Link from 'next/link'

export default function InstaStyleCard() {
  return (
    <section className="instastyle-section">
      <div className="instastyle-container">
        <div className="instastyle-card">
          <div className="instastyle-content">
            <div className="new-badge">
              <span className="pulse-dot" />
              STYLE EDIT
            </div>

            <h2 className="instastyle-title">InstaStyle</h2>

            <p className="instastyle-description">
              A fashion-first space for quick browsing, saved looks, and outfit planning built for everyday shopping.
            </p>

            <div className="features-list">
              <div className="feature-item">
                <span className="feature-mark" />
                <span>Browse curated drops by mood, fit, and occasion</span>
              </div>
              <div className="feature-item">
                <span className="feature-mark" />
                <span>Keep favorites, sizes, and profile details in one place</span>
              </div>
              <div className="feature-item">
                <span className="feature-mark" />
                <span>Open the catalog, wishlist, or profile in a single tap</span>
              </div>
            </div>

            <div className="cta-buttons">
              <Link href="/services/instastyle" className="explore-btn">
                Explore InstaStyle
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <div className="secondary-pill">
                Fashion preview
              </div>
            </div>
          </div>

          <div className="instastyle-visual" aria-hidden="true">
            <div className="mirror-frame">
              <div className="mirror-glow" />
              <div className="mirror-panel">
                <div className="mirror-topbar">
                  <span>Live edit</span>
                  <span>InstaStyle</span>
                </div>

                <div className="mirror-look">
                  <div className="look-card look-card-left" />
                  <div className="look-card look-card-center">
                    <span className="look-label">New drop</span>
                  </div>
                  <div className="look-card look-card-right" />
                </div>

                <div className="mirror-footer">
                  <div>
                    <strong>Saved edits</strong>
                    <span>Try, compare, shop</span>
                  </div>
                  <div className="mirror-stat">04</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .instastyle-section {
          padding: 80px 20px;
          background:
            radial-gradient(circle at top left, rgba(255, 208, 196, 0.35), transparent 35%),
            linear-gradient(135deg, #faf3ee 0%, #f6efe8 50%, #efe6de 100%);
        }

        .instastyle-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .instastyle-card {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          overflow: hidden;
          border-radius: 32px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 248, 243, 0.94));
          box-shadow: 0 24px 60px rgba(54, 26, 16, 0.14);
          border: 1px solid rgba(102, 67, 51, 0.08);
        }

        .instastyle-content {
          padding: 64px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .new-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 9px 18px;
          width: fit-content;
          border-radius: 999px;
          background: rgba(118, 74, 55, 0.08);
          color: #734534;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 22px;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #8f5641;
          box-shadow: 0 0 0 0 rgba(143, 86, 65, 0.35);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(143, 86, 65, 0.28);
          }
          70% {
            transform: scale(1.08);
            box-shadow: 0 0 0 12px rgba(143, 86, 65, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(143, 86, 65, 0);
          }
        }

        .instastyle-title {
          margin: 0 0 18px;
          color: #241611;
          font-size: 48px;
          line-height: 0.95;
          letter-spacing: -0.05em;
        }

        .instastyle-description {
          margin: 0 0 32px;
          color: #6d5a50;
          font-size: 18px;
          line-height: 1.75;
          max-width: 560px;
        }

        .features-list {
          display: grid;
          gap: 14px;
          margin-bottom: 34px;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #3f2b22;
          font-size: 16px;
          line-height: 1.5;
          font-weight: 600;
        }

        .feature-mark {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          margin-top: 6px;
          flex-shrink: 0;
          background: linear-gradient(135deg, #8f5641, #d28b67);
          box-shadow: 0 8px 18px rgba(143, 86, 65, 0.26);
        }

        .cta-buttons {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .explore-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 28px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2d1812, #8f5641);
          color: #fff;
          text-decoration: none;
          font-weight: 800;
          letter-spacing: 0.02em;
          box-shadow: 0 18px 30px rgba(45, 24, 18, 0.22);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .explore-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 34px rgba(45, 24, 18, 0.28);
        }

        .secondary-pill {
          padding: 14px 20px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(143, 86, 65, 0.14);
          color: #6a4a3c;
          font-size: 14px;
          font-weight: 700;
        }

        .instastyle-visual {
          position: relative;
          min-height: 520px;
          padding: 28px;
          background:
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.45), transparent 26%),
            linear-gradient(160deg, #4a2f26 0%, #1d1513 100%);
        }

        .mirror-frame {
          position: relative;
          height: 100%;
          border-radius: 28px;
          padding: 18px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.03));
          border: 1px solid rgba(255, 255, 255, 0.12);
          overflow: hidden;
        }

        .mirror-glow {
          position: absolute;
          inset: 18% auto auto 12%;
          width: 220px;
          height: 220px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255, 221, 200, 0.35), transparent 68%);
          filter: blur(14px);
        }

        .mirror-panel {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 26px;
          border-radius: 24px;
          background: linear-gradient(180deg, rgba(255, 248, 242, 0.13), rgba(255, 248, 242, 0.04));
          backdrop-filter: blur(16px);
        }

        .mirror-topbar,
        .mirror-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          color: rgba(255, 244, 236, 0.86);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .mirror-topbar span:last-child {
          color: #fff;
        }

        .mirror-look {
          display: grid;
          grid-template-columns: 1fr 1.15fr 1fr;
          gap: 14px;
          align-items: stretch;
          min-height: 360px;
          margin: 24px 0;
        }

        .look-card {
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
          background-size: cover;
          background-position: center;
        }

        .look-card-left {
          transform: translateY(30px);
          background: linear-gradient(180deg, rgba(255, 225, 207, 0.18), rgba(255, 255, 255, 0.05)),
            radial-gradient(circle at top, rgba(255, 205, 177, 0.55), transparent 60%),
            linear-gradient(160deg, #6c4a3d, #281916);
        }

        .look-card-center {
          position: relative;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06)),
            linear-gradient(160deg, #d8a07a, #6c4535);
          border-color: rgba(255, 220, 197, 0.22);
        }

        .look-card-right {
          transform: translateY(30px);
          background: linear-gradient(180deg, rgba(255, 225, 207, 0.18), rgba(255, 255, 255, 0.05)),
            linear-gradient(160deg, #382822, #1d1411);
        }

        .look-label {
          position: absolute;
          bottom: 18px;
          left: 18px;
          padding: 9px 14px;
          border-radius: 999px;
          background: rgba(255, 248, 243, 0.9);
          color: #2f1e18;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .mirror-footer {
          align-items: flex-end;
        }

        .mirror-footer strong,
        .mirror-footer span {
          display: block;
        }

        .mirror-footer strong {
          color: #fff7f0;
          font-size: 15px;
          margin-bottom: 4px;
          letter-spacing: 0;
          text-transform: none;
        }

        .mirror-footer span {
          color: rgba(255, 244, 236, 0.72);
          font-size: 13px;
          letter-spacing: 0;
          text-transform: none;
        }

        .mirror-stat {
          width: 58px;
          height: 58px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: #fff;
          font-size: 18px;
          font-weight: 800;
          background: linear-gradient(135deg, rgba(255, 225, 207, 0.34), rgba(255, 255, 255, 0.08));
          border: 1px solid rgba(255, 255, 255, 0.16);
        }

        @media (max-width: 1024px) {
          .instastyle-card {
            grid-template-columns: 1fr;
          }

          .instastyle-content {
            padding: 44px 32px;
          }

          .instastyle-title {
            font-size: 38px;
          }

          .instastyle-visual {
            min-height: 440px;
          }
        }

        @media (max-width: 640px) {
          .instastyle-section {
            padding: 40px 16px;
          }

          .instastyle-content {
            padding: 32px 22px;
          }

          .instastyle-title {
            font-size: 32px;
          }

          .instastyle-description {
            font-size: 16px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: stretch;
          }

          .explore-btn,
          .secondary-pill {
            width: 100%;
            justify-content: center;
            text-align: center;
          }

          .instastyle-visual {
            min-height: 340px;
            padding: 16px;
          }

          .mirror-panel {
            padding: 18px;
          }

          .mirror-look {
            min-height: 220px;
            gap: 10px;
          }

          .look-card-left,
          .look-card-right {
            transform: translateY(18px);
          }

          .mirror-footer {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  )
}
