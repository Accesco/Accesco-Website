'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function GameFrame({ title, cssPath, scripts = [], children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Load game scripts sequentially
    const loadScripts = async (srcs) => {
      for (const src of srcs) {
        await new Promise((resolve, reject) => {
          const existing = document.querySelector(`script[src="${src}"]`);
          if (existing) { resolve(); return; }
          const s = document.createElement('script');
          s.src = src;
          s.onload = resolve;
          s.onerror = resolve; // don't block on error
          document.body.appendChild(s);
        });
      }
    };
    if (scripts.length > 0) loadScripts(scripts);
  }, [scripts]);

  return (
    <div style={{ minHeight: '100vh', background: '#0c0b0e' }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(12,11,14,0.9)',
        backdropFilter: 'blur(12px)',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(251,191,36,0.15)',
      }}>
        <Link href="/games" style={{
          color: '#fbbf24', fontWeight: 700, fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 6,
          textDecoration: 'none',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.5px',
        }}>
          ← Back to Arena
        </Link>
        <span style={{
          color: '#fff', fontWeight: 900, fontSize: 14,
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: 1,
        }}>{title}</span>
        <div style={{ width: 90 }}></div>
      </div>
      <div ref={containerRef} style={{ paddingTop: '50px', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
}
