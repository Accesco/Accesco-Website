'use client';

import React from 'react';
import Image from 'next/image';

export default function AccesCoStories() {
  const stories = [
    {
      id: 1,
      category: 'INNOVATION',
      date: '12 Jan 2026',
      title: "Grokly: India's Smart Grocery Delivery System That Runs Your Household Automatically",
      description:
        'Discover how Grokly uses intelligent automation to manage your pantry and ensure you never run out of essentials.',
      image: '/images/blog-grokly.jpg',
      link: '#'
    },
    {
      id: 2,
      category: 'OUR STORY',
      date: '05 Jan 2026',
      title: 'AccesCo Living: A Story That Started Long Before the Company',
      description:
        "Step behind the scenes of the vision that built India's first daily-living ecosystem for the modern consumer.",
      image: '/images/blog-accesco.jpg',
      link: '#'
    },
    {
      id: 3,
      category: 'LIFESTYLE',
      date: '01 Jan 2026',
      title: 'A Day With AccesCo Living: How Life Changes When Everything Works Together',
      description:
        'Explore how a unified ecosystem of groceries, fashion, and finance streamlines every part of your routine.',
      image: '/images/blog-lifestyle.jpg',
      link: '#'
    }
  ];

  return (
    <section className="accesco-stories-section">
      <style jsx>{`
        .accesco-stories-section {
          padding: 90px 20px;
          background: #fff2eb;
        }

        .stories-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .stories-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .stories-kicker {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 16px;
        }

        .stories-title {
          font-size: 48px;
          font-weight: 900;
          color: #000;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }

        .stories-subtitle {
          font-size: 18px;
          color: #666;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .stories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
        }

        .story-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }

        .story-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(112, 4, 87, 0.15);
        }

        .story-image-wrapper {
          position: relative;
          width: 100%;
          height: 240px;
          background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
          overflow: hidden;
        }

        .story-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .story-card:hover .story-image-wrapper img {
          transform: scale(1.05);
        }

        .story-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: #fff;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
          box-shadow: 0 4px 12px rgba(112, 4, 87, 0.3);
        }

        .story-content {
          padding: 24px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .story-date {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #999;
          margin-bottom: 12px;
        }

        .story-date i {
          font-size: 14px;
        }

        .story-title {
          font-size: 22px;
          font-weight: 800;
          color: #000;
          margin-bottom: 12px;
          line-height: 1.3;
          letter-spacing: -0.5px;
        }

        .story-description {
          font-size: 15px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
          flex-grow: 1;
        }

        .story-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--accent);
          font-weight: 800;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: gap 0.3s ease;
        }

        .story-link:hover {
          gap: 12px;
        }

        .story-link i {
          font-size: 16px;
          transition: transform 0.3s ease;
        }

        .story-card:hover .story-link i {
          transform: translateX(4px);
        }

        @media (max-width: 900px) {
          .stories-title {
            font-size: 36px;
          }

          .stories-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        @media (max-width: 768px) {
          .accesco-stories-section {
            padding: 60px 16px;
          }

          .stories-title {
            font-size: 32px;
          }

          .stories-subtitle {
            font-size: 16px;
          }

          .story-title {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="stories-container">
        <div className="stories-header">
          <div className="stories-kicker">LIFESTYLE & INSIGHTS</div>
          <h2 className="stories-title">The AccesCo Stories</h2>
          <p className="stories-subtitle">
            Your guide to intelligent living, from financial hacks to the latest in sustainable fashion.
          </p>
        </div>

        <div className="stories-grid">
          {stories.map((story) => (
            <a href={story.link} key={story.id} className="story-card">
              <div className="story-image-wrapper">
                <Image
                  src={story.image}
                  alt={story.title}
                  width={400}
                  height={240}
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="story-badge">{story.category}</div>
              </div>

              <div className="story-content">
                <div className="story-date">
                  <i className="ri-calendar-line"></i>
                  <span>{story.date}</span>
                </div>

                <h3 className="story-title">{story.title}</h3>

                <p className="story-description">{story.description}</p>

                <div className="story-link">
                  <span>Read Article</span>
                  <i className="ri-arrow-right-line"></i>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
