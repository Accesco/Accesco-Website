'use client';

import Image from 'next/image';
import { useRef } from 'react';

export default function TiltCard() {
  const cardRef = useRef(null);
  const rectRef = useRef(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e) => {
    if (!rectRef.current && cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    if (!rect) return;

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
    }
  };

  return (
    <div className="postersSectionWrapper">
      <div
        ref={cardRef}
        className="postersTiltCard"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src="/images/poster-newspaper.jpeg"
          alt="Accesco Living - Something exciting is coming"
          className="postersTiltImg"
          width={340}
          height={510}
          sizes="(max-width: 768px) 100vw, 340px"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
}