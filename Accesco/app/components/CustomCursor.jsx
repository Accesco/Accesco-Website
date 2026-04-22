'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    // 1. Hide default cursor
    document.body.style.cursor = 'none';

    const cursor = cursorRef.current;
    
    // 2. Setup GSAP quickTo for smooth lag effect
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3" });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.3 });
    };

    // 3. Magnetic Hover Listeners
    const handleTagHover = (e) => {
      if (e.target.closest('a, button, [data-magnetic]')) {
        gsap.to(cursor, { scale: 2.5, duration: 0.3 });
      } else {
        gsap.to(cursor, { scale: 1, duration: 0.3 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleTagHover);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleTagHover);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        body {
          cursor: none !important;
        }
        a, button, [role="button"] {
          cursor: none !important;
        }
      `}</style>
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '24px',
          height: '24px',
          backgroundColor: '#fff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 100001,
          mixBlendMode: 'difference',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </>
  );
}
