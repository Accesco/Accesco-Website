'use client';


import React, { useState, useMemo } from 'react';
import './style.css';
import AccescoHeader from '@/components/AccescoHeader';
import VideoCard from '@/components/VideoCard';
import VideoModal from '@/components/VideoModal';
import Footer from '@/components/Footer';

const videos = [
  {
    id: 1,
    title: 'About Us',
    category: 'About',
    duration: '00:28',
    description: 'Internal resource session for global operations teams.',
    thumbnail: '/images/thumbnail_1.jpg',
    videoUrl: '/images/video_1.mp4',
  },
  {
    id: 2,
    title: 'Delivery Process Overview',
    category: 'Riders',
    duration: '00:25',
    description: 'Internal resource session for global operations teams.',
    thumbnail: '/images/thumbnail_3.jpg',
    videoUrl: '/images/video_3.mp4',
  },
  {
    id: 3,
    title: 'Money Morph',
    category: 'About',
    duration: '',
    description: 'Stability starts with understanding where your everyday spending goes.',
    thumbnail: '',
    videoUrl: '/images/IMG_0065.mp4',
  },
  {
    id: 4,
    title: 'Prime Access',
    category: 'About',
    duration: '00:30',
    description: 'India\’s next-gen commerce ecosystem, with premium access from day one.',
    thumbnail: '/images/QTC1.jpeg',
    videoUrl: '/video/qtc (1).mp4',
  },
  {
    id: 5,
    title: 'Living Smarter',
    category: 'Riders',
    duration: '00:30',
    description: 'In a world full of chaos, Accesco Living understands your lifestyle.',
    thumbnail: '/images/QTC2.jpeg',
    videoUrl: '/video/qtc (2).MP4',
  },
  {
    id: 6,
    title: 'Dining Reimagined',
    category: 'About',
    duration: '00:30',
    description: 'Discover, plan, order, or create meals tailored to your mood.',
    thumbnail: '/images/QTC3.jpeg',
    videoUrl: '/video/qtc (3).MP4',
  },
  {
    id: 7,
    title: 'Everyday Savings',
    category: 'Riders',
    duration: '00:30',
    description: 'Free delivery shouldn’t feel revolutionary — but here we are.',
    thumbnail: '/images/QTC4.jpeg',
    videoUrl: '/video/qtc (4).MP4',
  },
  {
    id: 8,
    title: 'Budget Simplified',
    category: 'About',
    duration: '00:30',
    description: 'A commerce ecosystem designed to help you spend better, not more.',
    thumbnail: '/images/QTC5.jpeg',
    videoUrl: '/video/qtc (5).MP4',
  },
  {
    id: 9,
    title: 'Style Delivered',
    category: 'Riders',
    duration: '00:30',
    description: 'Fast fashion delivery, without compromising comfort or confidence.',
    thumbnail: '/images/QTC7.jpeg',
    videoUrl: '/video/qtc (6).MP4',
  },
  {
    id: 10,
    title: 'Effortless Living',
    category: 'About',
    duration: '00:30',
    description: 'Not another delivery app — an ecosystem that understands you.',
    thumbnail:'/images/QTC6.jpeg',
    videoUrl: '/video/qtc (7).MP4',
  },
  {
    id: 11,
    title: 'Marketing Hack',
    category: 'Riders',
    duration: '00:30',
    description: 'Our marketing team consists of courage and zero budget.',
    thumbnail: '/images/QTC8.jpeg',
    videoUrl: '/video/qtc (8).MP4',
  },
];

export default function QTCPage() {
  const [currentFilter, setCurrentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const filteredVideos = useMemo(() => {
    let result = videos;
    if (currentFilter !== 'All') {
      result = result.filter((v) => v.category === currentFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [currentFilter, searchQuery]);

  return (
    <>
      <AccescoHeader />

      <main className="qtc-container">
        {/* HERO SECTION */}
        <section className="qtc-hero">
          <video
            className="qtc-hero-video"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/qtc-mobile-hero.jpg"
          >
            <source src="/images/qtcbackground.mp4" type="video/mp4" />
          </video>
          <div className="qtc-hero-overlay"></div>

          <div className="qtc-hero-content">
            <div className="qtc-badge">
              <span className="dot" />
              Featured Session
            </div>
            <h1 className="qtc-title">
              Turning your expectations into <span className="gradient-text">everyday convenience.</span>
            </h1>
            <p className="qtc-hero-subtitle">
              Explore our exclusive QTC digital repository. High-definition walkthroughs, internal operations blueprints, and step-by-step masterclasses designed for the Accesco Living community.
            </p>
            <div className="qtc-stats-bar">
              <div className="qtc-stat-item">
                <span className="qtc-stat-num">11</span>
                <span className="qtc-stat-label">Walkthroughs</span>
              </div>
              <div className="qtc-stat-divider" />
              <div className="qtc-stat-item">
                <span className="qtc-stat-num">1080p</span>
                <span className="qtc-stat-label">Ultra-HD</span>
              </div>
              <div className="qtc-stat-divider" />
              <div className="qtc-stat-item">
                <span className="qtc-stat-num">100%</span>
                <span className="qtc-stat-label">Transcripts</span>
              </div>
            </div>
          </div>
        </section>

        {/* VIDEO LIBRARY HEADER */}
        <section className="qtc-header">
          <div>
            <h2>Video Library</h2>
            <p>Internal QTC resources and workflow sessions.</p>
          </div>

          <div className="qtc-controls">
            <div className="qtc-search-wrap">
              <i className="ri-search-line"></i>
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="qtc-search-input"
              />
            </div>

            <div className="qtc-filters">
              {['All', 'About', 'Riders'].map((cat) => (
                <button
                  key={cat}
                  className={`qtc-filter-btn ${currentFilter === cat ? 'active' : ''}`}
                  onClick={() => setCurrentFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* VIDEO GRID */}
        <section className="qtc-grid">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => setSelectedVideo(video)}
                index={index}
              />
            ))
          ) : (
            <div className="qtc-empty">
              <i className="ri-video-off-line"></i>
              <p>No videos found for your search.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </>
  );
}
