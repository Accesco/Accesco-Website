'use client';

import React from 'react';

export default function VideoCard({ video, onClick, index }) {
  return (
    <div
      className="qtc-video-card"
      onClick={onClick}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="qtc-video-thumbnail">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
          />
        ) : (
          <video
            src={video.videoUrl}
            preload="metadata"
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onLoadedMetadata={(e) => { e.target.currentTime = 1; }}
          />
        )}
        {video.duration && <div className="qtc-duration-badge">{video.duration}</div>}
        <div className="qtc-play-overlay">
          <div className="qtc-play-icon">
            <i className="ri-play-fill"></i>
          </div>
        </div>
      </div>
      <div className="qtc-card-body">
        <div className="qtc-video-tag">{video.category}</div>
        <h3 className="qtc-card-title">{video.title}</h3>
        <p className="qtc-card-desc">{video.description}</p>
      </div>
    </div>
  );
}
