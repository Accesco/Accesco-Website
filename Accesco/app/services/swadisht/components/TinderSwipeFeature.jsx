'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { HeartCrack, Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const dummyDishes = [
  { id: '1', name: 'Butter Chicken', description: 'Creamy and rich tomato-based curry.', cover: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', isVeg: false },
  { id: '2', name: 'Palak Paneer', description: 'Fresh spinach and soft cottage cheese cubes.', cover: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80', isVeg: true },
  { id: '3', name: 'Mutton Biryani', description: 'Aromatic basmati rice cooked with tender mutton.', cover: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=600&q=80', isVeg: false },
  { id: '4', name: 'Dal Makhani', description: 'Slow-cooked black lentils with butter and cream.', cover: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', isVeg: true },
  { id: '5', name: 'Chicken Tikka Masala', description: 'Roasted chicken chunks in a spicy sauce.', cover: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80', isVeg: false },
  { id: '6', name: 'Paneer Butter Masala', description: 'Cottage cheese in a creamy tomato gravy.', cover: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80', isVeg: true },
  { id: '7', name: 'Fish Curry', description: 'Spicy and tangy coastal style fish curry.', cover: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&q=80', isVeg: false },
  { id: '8', name: 'Chole Bhature', description: 'Spicy chickpeas served with fried bread.', cover: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', isVeg: true },
  { id: '9', name: 'Tandoori Chicken', description: 'Yogurt and spice marinated chicken cooked in a tandoor.', cover: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80', isVeg: false },
  { id: '10', name: 'Malai Kofta', description: 'Potato and paneer balls in a rich, creamy sauce.', cover: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=600&q=80', isVeg: true },
];

export function SwipeModal({ onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      
      {/* Left Dislike Guide */}
      <div style={{ position: 'absolute', left: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#ef4444', pointerEvents: 'none', zIndex: 10 }}>
        <HeartCrack size={48} />
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.1em' }}>NOPE</span>
      </div>

      {/* Right Like Guide */}
      <div style={{ position: 'absolute', right: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#22c55e', pointerEvents: 'none', zIndex: 10 }}>
        <Heart size={48} />
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.1em' }}>LIKE</span>
      </div>

      {/* The Deck Component */}
      <Deck onClose={onClose} />
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          color: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '50%',
          padding: '8px',
          cursor: 'pointer',
          zIndex: 99999
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>,
    document.body
  );
}

function Deck({ onClose }) {
  const router = useRouter();
  const [dishes, setDishes] = useState(dummyDishes);
  const [swipeCount, setSwipeCount] = useState(0);
  const [likedDishes, setLikedDishes] = useState([]);

  // Pre-calculate random rotations once for the deck so they stay consistent
  // Use a ref or useMemo to avoid re-calculating on every render, but here we can just assign statically for dummy data
  // or just calculate based on index.
  const getRandomRotation = (index) => {
    // Just pseudo-random based on id/index to keep it stable
    const rotations = [0, -3, 5, -5, 3, -2, 4];
    return rotations[index % rotations.length];
  };

  const handleSwipe = (direction, dish) => {
    if (direction === 'right') {
      setLikedDishes(prev => {
        const newLikes = [...prev, dish];
        return newLikes;
      });
    }

    setDishes(prev => prev.slice(1));
    const newCount = swipeCount + 1;
    setSwipeCount(newCount);

    if (newCount === 10) {
      setTimeout(() => {
        const finalLikes = direction === 'right' 
          ? [...likedDishes, dish] 
          : likedDishes;
          
        localStorage.setItem('swadisht_user_preferences', JSON.stringify(finalLikes));
        onClose();
        router.push('/services/swadisht/foryou');
      }, 400); // Wait for the last card animation to finish
    }
  };

  const topCards = [...dishes].slice(0, 3).reverse();

  return (
    <div style={{ position: 'relative', width: '320px', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {topCards.map((dish, index) => {
        const topCardIndex = topCards.length - 1 - index;
        return (
          <SwipeCard 
            key={dish.id} 
            dish={dish} 
            index={topCardIndex} 
            rotationOffset={getRandomRotation(parseInt(dish.id))}
            onSwipe={(dir) => handleSwipe(dir, dish)} 
          />
        );
      })}
      
      {dishes.length === 0 && (
        <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 500 }}>
          Processing your preferences...
        </div>
      )}
    </div>
  );
}

function SwipeCard({ dish, index, rotationOffset, onSwipe }) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  // Stacking effect
  const isTop = index === 0;
  const targetScale = isTop ? 1 : 0.95;
  const targetRotate = isTop ? 0 : rotationOffset;

  useEffect(() => {
    controls.start({ 
      scale: targetScale, 
      rotate: targetRotate,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    });
  }, [isTop, targetScale, targetRotate, controls]);

  const handleDragEnd = async (e, info) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe('left');
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  return (
    <motion.div
      style={{
        x,
        zIndex: 50 - index,
        position: 'absolute',
        width: 320,
        height: 480,
        backgroundColor: '#1a1a1a',
        border: '1px solid #374151',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        cursor: 'grab',
        pointerEvents: 'auto',
      }}
      initial={{ scale: targetScale, rotate: targetRotate }}
      animate={controls}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
    >
      {/* Top 70% Image */}
      <div style={{ position: 'relative', width: '100%', height: '70%', overflow: 'hidden', pointerEvents: 'none' }}>
        <Image
          src={dish.cover}
          alt={dish.name}
          fill
          sizes="(max-width: 400px) 100vw, 400px"
          style={{ objectFit: 'cover' }}
          priority={isTop}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)', height: '96px' }} />
      </div>

      {/* Bottom 30% Details */}
      <div style={{ position: 'relative', width: '100%', height: '30%', backgroundColor: 'white', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', border: `2px solid ${dish.isVeg ? '#16a34a' : '#dc2626'}` }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: dish.isVeg ? '#16a34a' : '#dc2626' }}></div>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0, lineHeight: 1.2 }}>{dish.name}</h3>
        </div>
        <p style={{ color: '#4b5563', fontSize: '0.875rem', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{dish.description}</p>
      </div>
    </motion.div>
  );
}
