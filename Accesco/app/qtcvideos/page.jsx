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
    title: 'QTC Feature Highlight',
    category: 'About',
    duration: '',
    description: 'A showcase of QTC features and capabilities for our platform.',
    thumbnail: '',
    videoUrl: '/images/IMG_0065.mp4',
  },
  {
    id: 4,
    title: 'QTC Video 1',
    category: 'About',
    duration: '00:30',
    description: 'Quick training content for team operations and workflows.',
    thumbnail: '/images/thumbnail_1.jpg',
    videoUrl: '/video/qtc (1).mp4',
  },
  {
    id: 5,
    title: 'QTC Video 2',
    category: 'Riders',
    duration: '00:30',
    description: 'Delivery process and rider guidelines overview.',
    thumbnail: '/images/thumbnail_3.jpg',
    videoUrl: '/video/qtc (2).MP4',
  },
  {
    id: 6,
    title: 'QTC Video 3',
    category: 'About',
    duration: '00:30',
    description: 'Platform features and capabilities demonstration.',
    thumbnail: '/images/thumbnail_1.jpg',
    videoUrl: '/video/qtc (3).MP4',
  },
  {
    id: 7,
    title: 'QTC Video 4',
    category: 'Riders',
    duration: '00:30',
    description: 'Advanced delivery techniques and best practices.',
    thumbnail: '/images/thumbnail_3.jpg',
    videoUrl: '/video/qtc (4).MP4',
  },
  {
    id: 8,
    title: 'QTC Video 5',
    category: 'About',
    duration: '00:30',
    description: 'Company culture and team collaboration insights.',
    thumbnail: '/images/thumbnail_1.jpg',
    videoUrl: '/video/qtc (5).MP4',
  },
  {
    id: 9,
    title: 'QTC Video 6',
    category: 'Riders',
    duration: '00:30',
    description: 'Safety protocols and operational standards.',
    thumbnail: '/images/thumbnail_3.jpg',
    videoUrl: '/video/qtc (6).MP4',
  },
  {
    id: 10,
    title: 'QTC Video 7',
    category: 'About',
    duration: '00:30',
    description: 'Customer service excellence and quality standards.',
    thumbnail: '/images/thumbnail_1.jpg',
    videoUrl: '/video/qtc (7).MP4',
  },
  {
    id: 11,
    title: 'QTC Video 8',
    category: 'Riders',
    duration: '00:30',
    description: 'Performance optimization and efficiency tips.',
    thumbnail: '/images/thumbnail_3.jpg',
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
            poster="/assets/hero_poster.jpg"
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
              Turning your expectations into everyday convenience.
            </h1>
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
