'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // 1. High-performance position tracking with GSAP quickTo
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.4, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.4, ease: 'power3' });

    const moveCursor = (e) => {
      // Hide browser cursor once custom cursor starts moving
      if (document.body.style.cursor !== 'none') {
        document.body.style.cursor = 'none';
        // Also hide it for all interactable elements
        const style = document.createElement('style');
        style.id = 'cursor-none-override';
        style.innerHTML = 'a, button, [role="button"] { cursor: none !important; }';
        document.head.appendChild(style);
      }
      xTo(e.clientX);
      yTo(e.clientY);
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, { 
        scale: 1.5, 
        duration: 0.3, 
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.8)'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { 
        scale: 1, 
        duration: 0.3, 
        backgroundColor: '#FFFFFF',
        backdropFilter: 'none',
        border: 'none'
      });
    };

    const hoverElements = document.querySelectorAll('a, button, [role="button"]');
    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    window.addEventListener('mousemove', moveCursor);

    // Initial state: hidden until move
    gsap.set(cursor, { 
      xPercent: -50, 
      yPercent: -50,
      opacity: 0,
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.style.cursor = '';
      const style = document.getElementById('cursor-none-override');
      if (style) style.remove();
      hoverElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      className="custom-cursor"
    />
  );
}
