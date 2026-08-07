'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './GroceryStories.module.css';

const STORIES = [
  {
    id: 'fresh-veggies',
    title: 'Farm Fresh Veggies',
    views: 12400,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&h=1200&fit=crop&q=90',
    videoUrl: '/video/grokly-reels/1-farm-fresh-veggies.mp4',
    description: 'See how fresh vegetables are selected, quality-checked, packed and prepared for delivery.',
    tags: ['#FarmFresh', '#VeggieHaul', '#GroklyStories'],
    items: [
      ['Fresh Vegetable Basket', '1 basket', 199, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=180&h=180&fit=crop&q=85'],
      ['Tomato - Hybrid', '500 g', 28, 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=180&h=180&fit=crop&q=85'],
      ['Green Capsicum', '250 g', 49, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=180&h=180&fit=crop&q=85'],
    ],
  },
  {
    id: 'pantry',
    title: 'Organize Your Pantry',
    views: 18900,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&h=1200&fit=crop&q=90',
    videoUrl: '/video/grokly-reels/2-organize-your-pantry.mp4',
    description: 'Smart pantry staples, simple organisation ideas and everyday essentials that save time.',
    tags: ['#PantryGoals', '#SmartStorage', '#GroklyStories'],
    items: [
      ['Premium Basmati Rice', '1 kg', 149, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=180&h=180&fit=crop&q=85'],
      ['Toor Dal', '500 g', 96, 'https://images.unsplash.com/photo-1615485737651-580c9159c89c?w=180&h=180&fit=crop&q=85'],
      ['Storage Jar Set', '3 pieces', 299, 'https://images.unsplash.com/photo-1584473457493-17c4c24290c8?w=180&h=180&fit=crop&q=85'],
    ],
  },
  {
    id: 'cleaning',
    title: 'Cleaning Essentials You Need',
    views: 16200,
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=900&h=1200&fit=crop&q=90',
    videoUrl: '/video/grokly-reels/3-cleaning-essentials.mp4',
    description: 'A quick guide to reliable home-cleaning essentials for a fresher everyday space.',
    tags: ['#CleanHome', '#DailyEssentials', '#GroklyStories'],
    items: [
      ['Multipurpose Cleaner', '500 ml', 129, 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=180&h=180&fit=crop&q=85'],
      ['Microfibre Cloths', '3 pieces', 99, 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=180&h=180&fit=crop&q=85'],
      ['Dishwash Liquid', '750 ml', 119, 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=180&h=180&fit=crop&q=85'],
    ],
  },
  {
    id: 'breakfast',
    title: 'Quick Breakfast Ideas',
    views: 21300,
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=900&h=1200&fit=crop&q=90',
    videoUrl: '/video/grokly-reels/4-quick-breakfast.mp4',
    description: 'Fast breakfast combinations made with simple staples for busy weekday mornings.',
    tags: ['#QuickBreakfast', '#MorningFuel', '#GroklyStories'],
    items: [
      ['Farm Fresh Eggs', '6 pieces', 72, 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=180&h=180&fit=crop&q=85'],
      ['Whole Wheat Bread', '400 g', 55, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=180&h=180&fit=crop&q=85'],
      ['Toned Milk', '500 ml', 31, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=180&h=180&fit=crop&q=85'],
    ],
  },
  {
    id: 'daily-care',
    title: 'Daily Care Must-Haves',
    views: 14700,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&h=1200&fit=crop&q=90',
    videoUrl: '/video/grokly-reels/5-daily-care.mp4',
    description: 'Everyday personal-care picks selected for simple routines and dependable daily use.',
    tags: ['#DailyCare', '#SelfCare', '#GroklyStories'],
    items: [
      ['Gentle Body Lotion', '400 ml', 249, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=180&h=180&fit=crop&q=85'],
      ['Hand Wash', '250 ml', 99, 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=180&h=180&fit=crop&q=85'],
      ['Bathing Soap', '3 pieces', 135, 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=180&h=180&fit=crop&q=85'],
    ],
  },
  {
    id: 'stock-up',
    title: 'Stock Up & Save More',
    views: 17100,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&h=1200&fit=crop&q=90',
    videoUrl: '/video/grokly-reels/6-stock-up-and-save.mp4',
    description: 'Build a practical monthly essentials basket and save more by planning the right quantities.',
    tags: ['#MonthlyStockUp', '#SmartSavings', '#GroklyStories'],
    items: [
      ['Monthly Staples Combo', '1 combo', 699, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=180&h=180&fit=crop&q=85'],
      ['Whole Wheat Atta', '5 kg', 289, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=180&h=180&fit=crop&q=85'],
      ['Cooking Oil', '1 L', 159, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=180&h=180&fit=crop&q=85'],
    ],
  },
];

const BASE_COMMENT = {
  id: 'starter',
  name: 'smart_shopper',
  text: 'This is actually useful. Adding these to my next basket!',
  time: '2h',
  likes: 24,
};

function formatCount(value) {
  return value >= 1000
    ? `${(value / 1000).toFixed(1).replace('.0', '')}K`
    : String(value);
}

function formatTime(value) {
  if (!Number.isFinite(value)) return '0:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function Icon({ name, filled = false, size = 22 }) {
  const paths = {
    back: <path d="m15 18-6-6 6-6" />,
    heart: <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    comment: <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-3.8-.8L3 21l1.7-5a8.6 8.6 0 1 1 16.3-4.5Z" />,
    bookmark: <path d="M6 3.8h12v17l-6-3.8-6 3.8v-17Z" />,
    share: <><path d="m21 3-8.4 18-2.2-7.4L3 11 21 3Z" /><path d="M10.4 13.6 21 3" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    bag: <><path d="M6 8h12l-1 13H7L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    arrow: <path d="m9 18 6-6-6-6" />,
    send: <><path d="m21 3-8.4 18-2.2-7.4L3 11 21 3Z" /><path d="M10.4 13.6 21 3" /></>,
    fullscreen: <><path d="M8 3H3v5" /><path d="M16 3h5v5" /><path d="M21 16v5h-5" /><path d="M3 16v5h5" /></>,
    play: <path d="m9 6 8 6-8 6V6Z" />,
    pause: <><path d="M9 5v14" /><path d="M15 5v14" /></>,
    volume: <><path d="M5 9v6h4l5 4V5L9 9H5Z" /><path d="M17 8.5a5 5 0 0 1 0 7" /></>,
    muted: <><path d="M5 9v6h4l5 4V5L9 9H5Z" /><path d="m18 9 4 4" /><path d="m22 9-4 4" /></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
    scooter: <><circle cx="7" cy="18" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M9.5 18h5.5l2-8h-5l-2 5H6" /><path d="M15 7h3l2 3" /><path d="M7 15 5 9h4" /></>,
    quality: <><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z" /><path d="m9.5 12 1.7 1.7 3.5-4" /></>,
    package: <><path d="m3 7 9-4 9 4-9 4-9-4Z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></>,
    truck: <><path d="M3 6h11v10H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    sparkle: <><path d="M12 2l1.2 3.8L17 7l-3.8 1.2L12 12l-1.2-3.8L7 7l3.8-1.2L12 2Z" /><path d="M19 13l.7 2.3L22 16l-2.3.7L19 19l-.7-2.3L16 16l2.3-.7L19 13Z" /></>,
    eye: <><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.8" /></>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

export default function GroceryStories() {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState(() => new Set());
  const [saved, setSaved] = useState(() => new Set());
  const [added, setAdded] = useState(() => new Set());
  const [commentsByStory, setCommentsByStory] = useState({});
  const [commentText, setCommentText] = useState('');
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10);
  const [videoFailed, setVideoFailed] = useState(false);
  const [direction, setDirection] = useState('next');
  const [toast, setToast] = useState('');

  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const wheelLockRef = useRef(false);
  const wheelDeltaRef = useRef(0);
  const wheelResetRef = useRef(null);
  const touchYRef = useRef(null);

  const story = STORIES[activeIndex];
  const isLiked = liked.has(story.id);
  const isSaved = saved.has(story.id);
  const comments = useMemo(() => [BASE_COMMENT, ...(commentsByStory[story.id] || [])], [commentsByStory, story.id]);

  const toggleSet = (setter, id) => setter((current) => {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const openStories = (index = 0) => {
    setActiveIndex(index);
    setDirection('next');
    setOpen(true);
  };

  const changeStory = (step) => {
    if (wheelLockRef.current) return;
    wheelLockRef.current = true;
    setDirection(step > 0 ? 'next' : 'previous');
    setActiveIndex((current) => (current + step + STORIES.length) % STORIES.length);
    window.setTimeout(() => { wheelLockRef.current = false; }, 520);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (wheelLockRef.current) return;
    wheelDeltaRef.current += event.deltaY;
    if (wheelResetRef.current) window.clearTimeout(wheelResetRef.current);
    wheelResetRef.current = window.setTimeout(() => { wheelDeltaRef.current = 0; }, 130);
    if (Math.abs(wheelDeltaRef.current) < 55) return;
    const step = wheelDeltaRef.current > 0 ? 1 : -1;
    wheelDeltaRef.current = 0;
    changeStory(step);
  };

  const handleTouchStart = (event) => {
    touchYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchYRef.current === null) return;
    const endY = event.changedTouches[0]?.clientY;
    if (typeof endY !== 'number') return;
    const distance = touchYRef.current - endY;
    touchYRef.current = null;
    if (Math.abs(distance) >= 45) changeStory(distance > 0 ? 1 : -1);
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video || videoFailed) return;
    if (video.paused) {
      video.play().catch(() => undefined);
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const seek = (event) => {
    const video = videoRef.current;
    if (!video || videoFailed || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    video.currentTime = ratio * duration;
  };

  const shareStory = async () => {
    try {
      if (navigator.share) await navigator.share({ title: story.title, text: story.description, url: window.location.href });
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setToast('Story link copied');
      }
    } catch {}
  };

  const postComment = (event) => {
    event.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    setCommentsByStory((current) => ({
      ...current,
      [story.id]: [...(current[story.id] || []), { id: String(Date.now()), name: 'you', text, time: 'now', likes: 0 }],
    }));
    setCommentText('');
  };

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setVideoFailed(false);
    setCurrentTime(0);
    setDuration(10);
    setPlaying(true);
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    video.load();
    video.play().catch(() => undefined);
  }, [activeIndex, open, muted]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'ArrowDown') changeStory(1);
      if (event.key === 'ArrowUp') changeStory(-1);
      if (event.key === 'Escape') setOpen(false);
      if (event.key.toLowerCase() === 'm') setMuted((value) => !value);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <section className={styles.section}>
        <div className={styles.intro}>
          <div className={styles.sparkle}><Icon name="sparkle" size={52} /></div>
          <h2>Watch Grocery Stories</h2>
          <p>Get a behind-the-scenes look at how everyday products are selected, packed, and delivered perfectly.</p>
          <button type="button" className={styles.watchAll} onClick={() => openStories(0)}>Watch All</button>
        </div>

        <div className={styles.divider} />

        <div className={styles.storiesArea}>
          <div ref={trackRef} className={styles.track}>
            {STORIES.map((item, index) => (
              <button key={item.id} type="button" className={styles.card} onClick={() => openStories(index)}>
                <Image src={item.image} alt={item.title} fill sizes="250px" className={styles.cardImage} />
                <span className={styles.cardOverlay} />
                <span className={styles.views}><Icon name="eye" size={11} />{formatCount(item.views)}</span>
                <strong>{item.title}</strong>
              </button>
            ))}
          </div>
          <button type="button" className={styles.nextButton} onClick={() => trackRef.current?.scrollBy({ left: 540, behavior: 'smooth' })} aria-label="Show more grocery stories">
            <Icon name="arrow" size={20} />
          </button>
        </div>
      </section>

      {open && (
        <main className={styles.reelsPage}>
          <header className={styles.reelsHeader}>
            <div className={styles.headerLeft}>
              <button type="button" className={styles.headerCircle} onClick={() => setOpen(false)} aria-label="Back to Grokly"><Icon name="back" size={24} /></button>
              <span className={styles.headerLogo}><Image src="/images/grokly-icon.png" alt="Grokly" width={54} height={54} /></span>
              <div className={styles.headerTitle}>
                <h1>Discover Your Next <span>Smart Pick</span></h1>
                <i />
                <p>Shorts. Stories. Smarter shopping.</p>
              </div>
            </div>
            <button type="button" className={styles.headerCircle} onClick={() => setMuted((value) => !value)} aria-label="Toggle sound"><Icon name={muted ? 'muted' : 'volume'} size={22} /></button>
          </header>

          <div className={styles.reelsBody}>
            <div className={styles.reelsShell}>
              <section key={story.id} className={`${styles.videoCard} ${direction === 'next' ? styles.enterNext : styles.enterPrevious}`} onWheel={handleWheel} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} tabIndex={0}>
                {!videoFailed && (
                  <video key={story.videoUrl} ref={videoRef} className={styles.video} src={story.videoUrl} poster={story.image} muted={muted} loop playsInline preload="auto" onClick={togglePlayback} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 10)} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setVideoFailed(true)} />
                )}
                {videoFailed && <Image src={story.image} alt={story.title} fill sizes="400px" className={styles.videoFallbackImage} />}
                <div className={styles.videoShade} />

                <div className={styles.videoTopbar}>
                  <span className={styles.trendingPill}>🔥 Trending</span>
                  <button type="button" className={styles.clearIconButton} aria-label="More options"><Icon name="more" size={21} /></button>
                </div>

                {!videoFailed && <button type="button" className={styles.playToggle} onClick={togglePlayback} aria-label="Toggle playback"><Icon name={playing ? 'pause' : 'play'} filled={!playing} size={20} /></button>}
                <button type="button" className={styles.volumeToggle} onClick={() => setMuted((value) => !value)} aria-label="Toggle sound"><Icon name={muted ? 'muted' : 'volume'} size={18} /></button>

                <div className={styles.videoActions}>
                  <button type="button" className={`${styles.actionButton} ${isLiked ? styles.actionActive : ''}`} onClick={() => toggleSet(setLiked, story.id)}><span><Icon name="heart" filled={isLiked} /></span><b>{formatCount(story.views + (isLiked ? 1 : 0))}</b></button>
                  <button type="button" className={styles.actionButton} onClick={() => document.querySelector(`.${styles.commentsCard}`)?.scrollIntoView({ behavior: 'smooth' })}><span><Icon name="comment" /></span><b>{85 + activeIndex * 13 + (commentsByStory[story.id]?.length || 0)}</b></button>
                  <button type="button" className={`${styles.actionButton} ${isSaved ? styles.actionActive : ''}`} onClick={() => toggleSet(setSaved, story.id)}><span><Icon name="bookmark" filled={isSaved} /></span><b>Save</b></button>
                  <button type="button" className={styles.actionButton} onClick={shareStory}><span><Icon name="share" /></span><b>Share</b></button>
                </div>

                <div className={styles.videoCopy}>
                  <strong>{story.title}</strong>
                  <p>{story.description}</p>
                  <div className={styles.videoTags}>{story.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>

                <div className={styles.progressTrack} onClick={seek}>
                  <div className={styles.progressFill} style={{ width: `${Math.min(100, Math.max(0, currentTime / Math.max(1, duration) * 100))}%` }} />
                  <span className={styles.progressThumb} style={{ left: `${Math.min(100, Math.max(0, currentTime / Math.max(1, duration) * 100))}%` }} />
                </div>

                <div className={styles.videoFooter}>
                  <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                  <button type="button" onClick={() => videoRef.current?.requestFullscreen?.()} aria-label="Fullscreen"><Icon name="fullscreen" size={18} /></button>
                </div>
              </section>

              <aside key={`details-${story.id}`} className={styles.detailsColumn}>
                <section className={styles.detailsCard}>
                  <div className={styles.aboutSection}>
                    <h2>About this story</h2>
                    <p>{story.description}</p>
                    <p className={styles.aboutHighlight}>Smart picks, dependable quality, delivered without the extra effort.</p>
                    <div className={styles.outlineTags}>{story.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </div>

                  <div className={styles.deliveryCard}>
                    <div className={styles.deliveryHeading}><span><Icon name="scooter" size={30} /></span><div><strong>Delivered in 11 minutes</strong><small>Fresh essentials, right at your doorstep.</small></div></div>
                    <div className={styles.deliveryFeatures}>
                      <div><Icon name="sparkle" size={20} /><span>Wide Range</span></div>
                      <div><Icon name="quality" size={20} /><span>Top Quality</span></div>
                      <div><Icon name="package" size={20} /><span>Safe Packaging</span></div>
                      <div><Icon name="truck" size={20} /><span>Superfast Delivery</span></div>
                    </div>
                  </div>

                  <div className={styles.orderSection}>
                    <h3>Add these to your basket</h3>
                    <div className={styles.orderList}>
                      {story.items.map(([name, detail, price, image]) => {
                        const key = `${story.id}-${name}`;
                        const selected = added.has(key);
                        return (
                          <div className={styles.orderItem} key={name}>
                            <Image src={image} alt="" width={40} height={40} />
                            <div><strong>{name}</strong><span>{detail} &nbsp;•&nbsp; ₹{price}</span></div>
                            <button type="button" className={`${styles.addButton} ${selected ? styles.added : ''}`} onClick={() => { toggleSet(setAdded, key); setToast(selected ? 'Removed from basket' : 'Added to basket'); }}><Icon name={selected ? 'quality' : 'plus'} size={18} /></button>
                          </div>
                        );
                      })}
                    </div>
                    <div className={styles.orderActions}>
                      <button type="button" className={styles.primaryButton} onClick={() => setToast('Basket updated')}><Icon name="bag" size={18} />Add to basket</button>
                      <button type="button" className={styles.secondaryButton}>View products<Icon name="arrow" size={18} /></button>
                    </div>
                  </div>
                </section>

                <section className={styles.commentsCard}>
                  <div className={styles.commentsHeading}><h3>Comments ({85 + activeIndex * 13 + (commentsByStory[story.id]?.length || 0)})</h3><button type="button">View all</button></div>
                  <form className={styles.commentBox} onSubmit={postComment}>
                    <span className={styles.avatar}>A</span>
                    <input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add a comment..." />
                    <button type="submit" disabled={!commentText.trim()} aria-label="Post comment"><Icon name="send" size={18} /></button>
                  </form>
                  <div className={styles.commentsList}>
                    {comments.map((comment) => (
                      <article className={styles.comment} key={comment.id}>
                        <span className={styles.commentAvatar}>{comment.name.charAt(0).toUpperCase()}</span>
                        <div className={styles.commentContent}><div><strong>{comment.name}</strong><span>{comment.time}</span></div><p>{comment.text}</p><button type="button">Reply</button></div>
                        <button type="button" className={styles.commentLike}><Icon name="heart" size={17} /><span>{comment.likes}</span></button>
                      </article>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </div>

          {toast && <div className={styles.toast}>{toast}</div>}
        </main>
      )}
    </>
  );
}