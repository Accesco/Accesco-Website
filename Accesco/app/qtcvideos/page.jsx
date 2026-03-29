'use client';


import React, { useState, useMemo } from 'react';
import './style.css';
import SidebarMenu from '@/components/SidebarMenu';
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
      <SidebarMenu />

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
