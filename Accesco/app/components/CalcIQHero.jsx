// components/CalcIQHero.jsx
'use client'

import { useState, useEffect } from 'react'

export default function CalcIQHero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const savings = 24500
  const growth = 12

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

 const handleLaunchCalculator = () => {
  window.location.href = '/xpense-meter'
}

  return (
    <section className="calciq-hero">
      <div className="calciq-container">
        {/* Powered by AI badge */}
        <div className="ai-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
            <path d="M2 17L12 22L22 17" opacity="0.7" />
            <path d="M2 12L12 17L22 12" opacity="0.4" />
          </svg>
          POWERED BY AI
        </div>

        <div className="calciq-content">
          {/* Left side - Text content */}
          <div className="calciq-left">
            <h1 className="calciq-title">
              <span className="title-white">Xpense</span>
              {' '}
              <span className="title-yellow">Meter</span>
            </h1>

            <p className="calciq-description">
              Stop guessing where your money goes. Visualize your savings, 
              track expenses, and forecast your future wealth with one tap.
            </p>

            <button className="launch-btn" onClick={handleLaunchCalculator}>
              Explore Xpense Meter
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          {/* Right side - Savings card */}
          <div className="savings-card">
            <div className="savings-header">
              <span className="savings-label">Total Savings</span>
              <button className="dots-menu">⋯</button>
            </div>

            <div className="savings-amount">
              <span className="rupee">₹</span>
              {savings.toLocaleString('en-IN')}
            </div>

            <div className="growth-indicator">
              <span className="growth-text">+{growth}%</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14l5-5 5 5z"/>
              </svg>
            </div>

            {/* Progress dots */}
            <div className="progress-dots">
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .calciq-hero {
          width: 100%;
          padding: 40px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 500px;
        }

        .calciq-container {
          max-width: 1200px;
          width: 100%;
          background: linear-gradient(135deg, #4a0e4e 0%, #2d1b69 100%);
          border-radius: 32px;
          padding: 48px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .calciq-container::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          border-radius: 50%;
        }

        .ai-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          color: white;
          padding: 10px 20px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 32px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .calciq-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .calciq-left {
          color: white;
        }

        .calciq-title {
          font-size: 56px;
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 24px 0;
          letter-spacing: -2px;
        }

        .title-white {
          color: white;
        }

        .title-yellow {
          color: #ffd93d;
        }

        .calciq-description {
          font-size: 18px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
          margin: 0 0 36px 0;
          max-width: 480px;
        }

        .launch-btn {
          background: linear-gradient(135deg, #ffd93d 0%, #ffb627 100%);
          color: #2d1b69;
          border: none;
          padding: 18px 36px;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          box-shadow: 0 8px 24px rgba(255, 217, 61, 0.4);
        }

        .launch-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(255, 217, 61, 0.5);
        }

        .savings-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          padding: 32px;
          position: relative;
          overflow: hidden;
        }

        .savings-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
          pointer-events: none;
        }

        .savings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .savings-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 600;
        }

        .dots-menu {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 24px;
          cursor: pointer;
          padding: 4px 8px;
        }

        .savings-amount {
          color: white;
          font-size: 48px;
          font-weight: 900;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }

        .rupee {
          font-size: 32px;
        }

        .growth-indicator {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 255, 127, 0.15);
          color: #00ff7f;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 32px;
        }

        .growth-text {
          display: flex;
          align-items: center;
        }

        .progress-dots {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .dot {
          width: 40px;
          height: 4px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .dot.active {
          background: #00ff7f;
          width: 50px;
        }

        @media (max-width: 968px) {
          .calciq-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .calciq-title {
            font-size: 42px;
          }

          .calciq-container {
            padding: 32px 24px;
          }

          .savings-amount {
            font-size: 36px;
          }
        }

        @media (max-width: 640px) {
          .calciq-title {
            font-size: 32px;
          }

          .calciq-description {
            font-size: 16px;
          }

          .launch-btn {
            padding: 16px 28px;
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  )
}
