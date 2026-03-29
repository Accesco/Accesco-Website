'use client';

import React, { useEffect, useRef } from 'react';

export default function VideoModal({ video, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (video) {
      document.addEventListener('keydown', handleEscape);
      // Small delay to let modal render before playing
      setTimeout(() => videoRef.current?.play(), 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [video, onClose]);

  if (!video) return null;

  return (
    <div
      className="qtc-modal-overlay"
      onClick={onClose}
    >
      <button className="qtc-modal-close" onClick={onClose}>
        <i className="ri-close-fill"></i>
      </button>
      <div
        className="qtc-modal-inner"
        onClick={(e) => e.stopPropagation()}
      >
        <video ref={videoRef} controls className="qtc-modal-video">
          <source src={video.videoUrl} type="video/mp4" />
        </video>
      </div>
      <div className="qtc-modal-info">
        <h3 className="qtc-modal-title">{video.title}</h3>
        <p className="qtc-modal-meta">{video.category} • {video.duration}</p>
      </div>
    </div>
  );
}
