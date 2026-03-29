'use client'


export default function InstaStylePage() {
  return (
    <>
      <div className="instastyle-page">
        {/* Background Video */}
        <div className="bg">
          <video autoPlay muted loop playsInline>
            <source src="/images/instastyle.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Grain Overlay */}
        <div className="grain"></div>

        {/* Vignette Effect */}
        <div className="vignette"></div>

        {/* Main Content */}
        <div className="container">
          <h1 className="brand">InstaStyle</h1>
          <p className="subtitle">
            A new wave of clothing and self-expression — designed to elevate your style.
          </p>
          <div className="badge">Coming Soon</div>
        </div>

        {/* Footer */}
        <div className="footer">© 2025 InstaStyle. All Rights Reserved.</div>
      </div>

      <style jsx>{`
        /* RESET & BASE */
        .instastyle-page {
          position: fixed;
          inset: 0;
          font-family: 'Outfit', sans-serif;
          color: #fff;
          overflow: hidden;
          background: #000;
          padding: env(safe-area-inset-top) env(safe-area-inset-right)
                   env(safe-area-inset-bottom) env(safe-area-inset-left);
          display: flex;
          flex-direction: column;
        }

        /* Background Video */
        .bg {
          position: fixed;
          inset: 0;
          z-index: -3;
          overflow: hidden;
        }

        .bg video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Dark overlay */
        .bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            rgba(0, 0, 0, 0.45),
            rgba(0, 0, 0, 0.82)
          );
        }

        /* Grain Texture */
        .grain {
          position: absolute;
          inset: 0;
          background: url("https://www.transparenttextures.com/patterns/asfalt-dark.png");
          opacity: 0.18;
          pointer-events: none;
          z-index: -2;
        }

        /* Vignette Effect */
        .vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, transparent 55%, rgba(0, 0, 0, 0.85));
          pointer-events: none;
          z-index: -1;
        }

        /* Main Content Container */
        .container {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 0 clamp(12px, 5vw, 40px);
        }

        /* Brand Logo */
        .brand {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          background: linear-gradient(to bottom, #fff, #ffecec);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0px 6px 24px rgba(0, 0, 0, 0.65);
          font-size: clamp(44px, 10vw, 100px);
          margin-bottom: clamp(8px, 2vh, 16px);
        }

        /* Subtitle */
        .subtitle {
          font-size: clamp(16px, 3vw, 28px);
          opacity: 0.94;
          max-width: min(680px, 90vw);
          line-height: 1.45;
          margin-bottom: clamp(30px, 6vh, 60px);
        }

        /* Coming Soon Badge */
        .badge {
          display: inline-block;
          padding: clamp(6px, 1.4vh, 14px) clamp(18px, 4vw, 45px);
          border-radius: 40px;
          border: 1px solid rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(8px);
          background: rgba(0, 0, 0, 0.38);
          font-size: clamp(14px, 2.5vw, 20px);
          letter-spacing: clamp(1px, 0.7vw, 4px);
          font-weight: 600;
          text-transform: uppercase;
          opacity: 0.95;
        }

        /* Footer */
        .footer {
          width: 100%;
          text-align: center;
          font-size: clamp(11px, 2vw, 14px);
          opacity: 0.6;
          padding-bottom: clamp(10px, 2vh, 20px);
        }

        /* Landscape Mobile Fix */
        @media (orientation: landscape) and (max-height: 500px) {
          .container {
            justify-content: flex-start;
            padding-top: 8vh;
          }
          .subtitle {
            margin-bottom: 24px;
          }
          .footer {
            bottom: 10px;
          }
        }
      `}</style>
    </>
  )
}
