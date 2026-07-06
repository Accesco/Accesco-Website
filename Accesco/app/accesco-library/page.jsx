'use client';

import React, { useState, useMemo } from 'react';
import AccescoHeader from '@/components/AccescoHeader';
import VideoCard from '@/components/VideoCard';
import VideoModal from '@/components/VideoModal';
import Footer from '@/components/Footer';
import './style.css';


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
    description: "India's next-gen commerce ecosystem, with premium access from day one.",
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
    description: "Free delivery shouldn't feel revolutionary — but here we are.",
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
    thumbnail: '/images/QTC6.jpeg',
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

export default function AccescoLibraryPage() {
  const [activeSegment, setActiveSegment] = useState('videos');
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

  const segments = [
    { id: 'resources', label: 'Resource Library', iconClass: 'ri-book-open-line' },
    { id: 'videos',    label: 'Explore & Videos Library', iconClass: 'ri-play-circle-line' },
    { id: 'knowledge', label: 'Knowledge Library', iconClass: 'ri-brain-line' },
  ];

  return (
    <>
      <AccescoHeader />

      <main className="lib-container">
  {/* ── HERO ── */}
<section className="lib-hero">
  <div className="lib-hero-center">
    <h1>library</h1>
  </div>
</section>

        {/* ── SEGMENT TABS ── */}
        <div className="lib-tabs-wrap">
          <div className="lib-tabs">
            {segments.map((seg) => (
              <button
                key={seg.id}
                className={`lib-tab-btn ${activeSegment === seg.id ? 'active' : ''}`}
                onClick={() => setActiveSegment(seg.id)}
              >
                <span className="lib-tab-icon">
                  <i className={seg.iconClass}></i>
                </span>
                <span className="lib-tab-label">{seg.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── SEGMENT: RESOURCE LIBRARY ── */}
        {activeSegment === 'resources' && (
          <section className="lib-segment-section">
            <div className="lib-segment-header">
              <h2>Resource Library</h2>
              <p>Guides, playbooks, and internal documents — all in one place.</p>
            </div>
            <div className="lib-coming-soon">
              <div className="lib-coming-icon">
                <i className="ri-book-open-line"></i>
              </div>
              <h3>Coming Soon</h3>
              <p>We're compiling our best resources. Check back shortly!</p>
            </div>
          </section>
        )}

        {/* ── SEGMENT: EXPLORE & VIDEOS LIBRARY ── */}
        {activeSegment === 'videos' && (
          <>
            <section className="lib-segment-section lib-videos-header">
              <div className="lib-segment-inner">
                <div>
                  <h2>Explore &amp; Videos Library</h2>
                  <p>Internal QTC resources and video workflow sessions.</p>
                </div>

                <div className="lib-controls">
                  <div className="lib-search-wrap">
                    <i className="ri-search-line" />
                    <input
                      type="text"
                      placeholder="Search videos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="lib-search-input"
                    />
                  </div>

                  <div className="lib-filters">
                    {['All', 'About', 'Riders'].map((cat) => (
                      <button
                        key={cat}
                        className={`lib-filter-btn ${currentFilter === cat ? 'active' : ''}`}
                        onClick={() => setCurrentFilter(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="lib-grid">
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
                <div className="lib-empty">
                  <i className="ri-video-off-line" />
                  <p>No videos found for your search.</p>
                </div>
              )}
            </section>
          </>
        )}

        {/* ── SEGMENT: KNOWLEDGE LIBRARY ── */}
        {activeSegment === 'knowledge' && (
          <section className="lib-segment-section">
            <div className="lib-segment-header">
              <h2>Knowledge Library</h2>
              <p>Articles, deep-dives, and research by the Accesco team.</p>
            </div>
            <div className="lib-coming-soon">
              <div className="lib-coming-icon">
                <i className="ri-brain-line"></i>
              </div>
              <h3>Coming Soon</h3>
              <p>Our knowledge base is being built with care. Stay tuned!</p>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </>
  );
}
