'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './StyleStories.module.css';

const STORIES = [
  {
    id: 'summer-coords',
    title: 'Summer Co-ords',
    subtitle: 'Effortless & Chic',
    views: 24100,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&h=1200&fit=crop&q=90',
    video: '/video/instastyle-reels/1-summer-coords.mp4',
    description: 'A breathable co-ord edit built around easy tailoring, soft structure and effortless summer polish.',
    tags: ['#SummerStyle', '#CoOrdSet', '#InstaStyleStories'],
    products: [
      ['Linen Blend Blazer', 'Sand beige', 2499, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=180&h=180&fit=crop&q=85'],
      ['Wide-Leg Trousers', 'Relaxed fit', 1899, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=180&h=180&fit=crop&q=85'],
      ['Minimal Shoulder Bag', 'Tan', 1499, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=180&h=180&fit=crop&q=85'],
    ],
  },
  {
    id: 'minimal-everyday',
    title: 'Minimal Everyday',
    subtitle: 'Clean. Classy. Timeless.',
    views: 18700,
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&h=1200&fit=crop&q=90',
    video: '/video/instastyle-reels/2-minimal-everyday.mp4',
    description: 'A refined everyday uniform with clean lines, quiet tones and pieces designed to work together.',
    tags: ['#MinimalStyle', '#EverydayEdit', '#InstaStyleStories'],
    products: [
      ['Fitted Ribbed Top', 'Chocolate brown', 999, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=180&h=180&fit=crop&q=85'],
      ['Tailored Ivory Trousers', 'High rise', 1799, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=180&h=180&fit=crop&q=85'],
      ['Structured Handbag', 'Mocha', 1999, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=180&h=180&fit=crop&q=85'],
    ],
  },
  {
    id: 'office-ready',
    title: 'Office Ready',
    subtitle: 'Power meets style',
    views: 21300,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&h=1200&fit=crop&q=90',
    video: '/video/instastyle-reels/3-office-ready.mp4',
    description: 'Sharp tailoring, confident proportions and polished accessories for a modern workday wardrobe.',
    tags: ['#OfficeStyle', '#PowerDressing', '#InstaStyleStories'],
    products: [
      ['Structured Black Blazer', 'Single breasted', 2899, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=180&h=180&fit=crop&q=85'],
      ['Silk Finish Shirt', 'Ivory', 1599, 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=180&h=180&fit=crop&q=85'],
      ['Leather Work Tote', 'Black', 2499, 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=180&h=180&fit=crop&q=85'],
    ],
  },
  {
    id: 'streetwear-edit',
    title: 'Streetwear Edit',
    subtitle: 'Bold. Trendy. You.',
    views: 16800,
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=900&h=1200&fit=crop&q=90',
    video: '/video/instastyle-reels/4-streetwear-edit.mp4',
    description: 'Relaxed silhouettes, statement graphics and practical accessories for an expressive city look.',
    tags: ['#Streetwear', '#UrbanEdit', '#InstaStyleStories'],
    products: [
      ['Oversized Graphic Tee', 'Black', 1199, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=180&h=180&fit=crop&q=85'],
      ['Relaxed Cargo Pants', 'Charcoal', 1999, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=180&h=180&fit=crop&q=85'],
      ['Crossbody Utility Bag', 'Dark brown', 1399, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=180&h=180&fit=crop&q=85'],
    ],
  },
  {
    id: 'vacation-fits',
    title: 'Vacation Fits',
    subtitle: 'Sun. Sea. Style.',
    views: 15200,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&h=1200&fit=crop&q=90',
    video: '/video/instastyle-reels/5-vacation-fits.mp4',
    description: 'Lightweight dresses, cheerful prints and easy accessories made for warm-weather escapes.',
    tags: ['#VacationStyle', '#ResortWear', '#InstaStyleStories'],
    products: [
      ['Printed Summer Dress', 'Yellow floral', 1899, 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=180&h=180&fit=crop&q=85'],
      ['Woven Sun Hat', 'Natural', 899, 'https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=180&h=180&fit=crop&q=85'],
      ['Mini Sling Bag', 'Cream', 1299, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=180&h=180&fit=crop&q=85'],
    ],
  },
  {
    id: 'new-in',
    title: 'New In',
    subtitle: "Fresh styles you'll love",
    views: 19600,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&h=1200&fit=crop&q=90',
    video: '/video/instastyle-reels/6-new-in.mp4',
    description: 'A first look at newly arrived silhouettes, elevated neutrals and fresh seasonal accessories.',
    tags: ['#NewIn', '#FreshDrop', '#InstaStyleStories'],
    products: [
      ['Sculpted Midi Dress', 'Soft ivory', 2299, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=180&h=180&fit=crop&q=85'],
      ['Pointed Slingback Heels', 'Nude', 1999, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=180&h=180&fit=crop&q=85'],
      ['Mini Leather Bag', 'Camel', 1799, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=180&h=180&fit=crop&q=85'],
    ],
  },
];

const STARTER_COMMENTS = [
  { id: 'c1', name: 'style.diary', text: 'The styling is so clean. Saving this whole look!', time: '2h', likes: 36 },
];

const paths = {
  back: <path d="m15 18-6-6 6-6" />,
  heart: <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
  comment: <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-3.8-.8L3 21l1.7-5a8.6 8.6 0 1 1 16.3-4.5Z" />,
  bookmark: <path d="M6 3.8h12v17l-6-3.8-6 3.8v-17Z" />,
  share: <><path d="m21 3-8.4 18-2.2-7.4L3 11 21 3Z" /><path d="M10.4 13.6 21 3" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  bag: <><path d="M6 8h12l-1 13H7L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  arrowRight: <path d="m9 18 6-6-6-6" />,
  send: <><path d="m21 3-8.4 18-2.2-7.4L3 11 21 3Z" /><path d="M10.4 13.6 21 3" /></>,
  fullscreen: <><path d="M8 3H3v5" /><path d="M16 3h5v5" /><path d="M21 16v5h-5" /><path d="M3 16v5h5" /></>,
  play: <path d="m9 6 8 6-8 6V6Z" />,
  pause: <><path d="M9 5v14" /><path d="M15 5v14" /></>,
  volume: <><path d="M5 9v6h4l5 4V5L9 9H5Z" /><path d="M17 8.5a5 5 0 0 1 0 7" /></>,
  muted: <><path d="M5 9v6h4l5 4V5L9 9H5Z" /><path d="m18 9 4 4" /><path d="m22 9-4 4" /></>,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  hanger: <><path d="M12 7a2.2 2.2 0 1 0-2.2-2.2" /><path d="m12 7 9 6-2 3H5l-2-3 9-6Z" /></>,
  quality: <><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z" /><path d="m9.5 12 1.7 1.7 3.5-4" /></>,
  package: <><path d="m3 7 9-4 9 4-9 4-9-4Z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></>,
  truck: <><path d="M3 6h11v10H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
  sparkle: <><path d="M12 2l1.2 3.8L17 7l-3.8 1.2L12 12l-1.2-3.8L7 7l3.8-1.2L12 2Z" /><path d="M19 13l.7 2.3L22 16l-2.3.7L19 19l-.7-2.3L16 16l2.3-.7L19 13Z" /></>,
  eye: <><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.8" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
};

function Icon({ name, filled = false, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

const count = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}K` : String(n));
const time = (n) => `${Math.floor(n / 60)}:${Math.floor(n % 60).toString().padStart(2, '0')}`;

export default function StyleStories() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState(new Set());
  const [saved, setSaved] = useState(new Set());
  const [added, setAdded] = useState(new Set());
  const [commentsByStory, setCommentsByStory] = useState({});
  const [commentText, setCommentText] = useState('');
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(10);
  const [failed, setFailed] = useState(false);
  const [direction, setDirection] = useState('next');
  const [toast, setToast] = useState('');

  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const wheelLock = useRef(false);
  const wheelTotal = useRef(0);
  const wheelTimer = useRef(null);
  const touchStart = useRef(null);

  const story = STORIES[index];
  const comments = useMemo(
    () => [...STARTER_COMMENTS, ...(commentsByStory[story.id] || [])],
    [commentsByStory, story.id],
  );

  const toggle = (setter, id) =>
    setter((old) => {
      const next = new Set(old);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const openStory = (i = 0) => {
    setIndex(i);
    setDirection('next');
    setOpen(true);
  };

  const change = (step) => {
    if (wheelLock.current) return;
    wheelLock.current = true;
    setDirection(step > 0 ? 'next' : 'previous');
    setIndex((old) => (old + step + STORIES.length) % STORIES.length);
    window.setTimeout(() => { wheelLock.current = false; }, 520);
  };

  const onWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wheelLock.current) return;
    wheelTotal.current += e.deltaY;
    if (wheelTimer.current) window.clearTimeout(wheelTimer.current);
    wheelTimer.current = window.setTimeout(() => { wheelTotal.current = 0; }, 130);
    if (Math.abs(wheelTotal.current) < 55) return;
    const step = wheelTotal.current > 0 ? 1 : -1;
    wheelTotal.current = 0;
    change(step);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v || failed) return;
    if (v.paused) {
      v.play().catch(() => undefined);
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const seek = (e) => {
    const v = videoRef.current;
    if (!v || failed || !duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * duration;
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: story.title, text: story.description, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setToast('Story link copied');
      }
    } catch {}
  };

  const addComment = (e) => {
    e.preventDefault();
    const textValue = commentText.trim();
    if (!textValue) return;
    setCommentsByStory((old) => ({
      ...old,
      [story.id]: [...(old[story.id] || []), { id: Date.now(), name: 'you', text: textValue, time: 'now', likes: 0 }],
    }));
    setCommentText('');
  };

  useEffect(() => {
    if (!open) return undefined;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = old; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setFailed(false);
    setCurrent(0);
    setDuration(10);
    setPlaying(true);
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    v.load();
    v.play().catch(() => undefined);
  }, [index, open, muted]);

  useEffect(() => {
    if (!open) return undefined;
    const key = (e) => {
      if (e.key === 'ArrowDown') change(1);
      if (e.key === 'ArrowUp') change(-1);
      if (e.key === 'Escape') setOpen(false);
      if (e.key.toLowerCase() === 'm') setMuted((x) => !x);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <>
      <section className={styles.outerShell}>
        <div className={styles.section}>
          <div className={styles.intro}>
            <div className={styles.titleRow}>
              <span className={styles.titleIcon}><Icon name="bag" size={31} /></span>
              <h2>Style Stories</h2>
            </div>
            <p>Fashion inspiration,<br />trending looks and more</p>
            <button className={styles.exploreButton} onClick={() => openStory(0)}>
              <span>Explore All</span><Icon name="arrowRight" size={16} />
            </button>
          </div>

          <div className={styles.divider} />

          <div className={styles.storiesArea}>
            <div ref={trackRef} className={styles.track}>
              {STORIES.map((item, i) => (
                <button key={item.id} className={styles.card} onClick={() => openStory(i)}>
                  <img src={item.image} alt={item.title} className={styles.cardImage} />
                  <span className={styles.cardShade} />
                  <span className={styles.views}><Icon name="play" filled size={10} />{count(item.views)}</span>
                  <span className={styles.cardCopy}><strong>{item.title}</strong><small>{item.subtitle}</small></span>
                </button>
              ))}
            </div>
            <button className={styles.nextButton} onClick={() => trackRef.current?.scrollBy({ left: 500, behavior: 'smooth' })}>
              <Icon name="chevron" size={20} />
            </button>
          </div>
        </div>
      </section>

      {open && (
        <main className={styles.reelsPage}>
          <header className={styles.reelsHeader}>
            <div className={styles.headerLeft}>
              <button className={styles.headerCircle} onClick={() => setOpen(false)}><Icon name="back" size={24} /></button>
              <span className={styles.headerLogo}><img src="/images/instastyle-logo.png" alt="InstaStyle" /></span>
              <div className={styles.headerTitle}>
                <h1>Discover Your Next <span>Signature Look</span></h1>
                <i />
                <p>Shorts. Stories. Style.</p>
              </div>
            </div>
            <button className={styles.headerCircle} onClick={() => setMuted((x) => !x)}>
              <Icon name={muted ? 'muted' : 'volume'} size={22} />
            </button>
          </header>

          <div className={styles.reelsBody}>
            <div className={styles.reelsShell}>
              <section
                key={story.id}
                className={`${styles.videoCard} ${direction === 'next' ? styles.enterNext : styles.enterPrevious}`}
                onWheel={onWheel}
                onTouchStart={(e) => { touchStart.current = e.touches[0]?.clientY ?? null; }}
                onTouchEnd={(e) => {
                  if (touchStart.current == null) return;
                  const end = e.changedTouches[0]?.clientY;
                  const distance = touchStart.current - end;
                  touchStart.current = null;
                  if (Math.abs(distance) >= 45) change(distance > 0 ? 1 : -1);
                }}
                tabIndex={0}
              >
                {!failed && (
                  <video
                    key={story.video}
                    ref={videoRef}
                    className={styles.video}
                    src={story.video}
                    poster={story.image}
                    muted={muted}
                    loop
                    playsInline
                    preload="auto"
                    onClick={togglePlay}
                    onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 10)}
                    onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onError={() => setFailed(true)}
                  />
                )}
                {failed && <img src={story.image} alt={story.title} className={styles.videoFallbackImage} />}
                <div className={styles.videoShade} />

                <div className={styles.videoTopbar}>
                  <span className={styles.trendingPill}>✦ Trending</span>
                  <button className={styles.clearIconButton}><Icon name="more" size={21} /></button>
                </div>

                {!failed && (
                  <button className={styles.playToggle} onClick={togglePlay}>
                    <Icon name={playing ? 'pause' : 'play'} filled={!playing} size={20} />
                  </button>
                )}

                <button className={styles.volumeToggle} onClick={() => setMuted((x) => !x)}>
                  <Icon name={muted ? 'muted' : 'volume'} size={18} />
                </button>

                <div className={styles.videoActions}>
                  <button className={`${styles.actionButton} ${liked.has(story.id) ? styles.actionActive : ''}`} onClick={() => toggle(setLiked, story.id)}>
                    <span><Icon name="heart" filled={liked.has(story.id)} /></span><b>{count(story.views + (liked.has(story.id) ? 1 : 0))}</b>
                  </button>
                  <button className={styles.actionButton}>
                    <span><Icon name="comment" /></span><b>{98 + index * 11 + (commentsByStory[story.id]?.length || 0)}</b>
                  </button>
                  <button className={`${styles.actionButton} ${saved.has(story.id) ? styles.actionActive : ''}`} onClick={() => toggle(setSaved, story.id)}>
                    <span><Icon name="bookmark" filled={saved.has(story.id)} /></span><b>Save</b>
                  </button>
                  <button className={styles.actionButton} onClick={share}>
                    <span><Icon name="share" /></span><b>Share</b>
                  </button>
                </div>

                <div className={styles.videoCopy}>
                  <strong>{story.title}</strong>
                  <p>{story.description}</p>
                  <div className={styles.videoTags}>{story.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>

                <div className={styles.progressTrack} onClick={seek}>
                  <div className={styles.progressFill} style={{ width: `${Math.min(100, (current / Math.max(1, duration)) * 100)}%` }} />
                  <span className={styles.progressThumb} style={{ left: `${Math.min(100, (current / Math.max(1, duration)) * 100)}%` }} />
                </div>

                <div className={styles.videoFooter}>
                  <span>{time(current)} / {time(duration)}</span>
                  <button onClick={() => videoRef.current?.requestFullscreen?.()}><Icon name="fullscreen" size={18} /></button>
                </div>
              </section>

              <aside className={styles.detailsColumn}>
                <section className={styles.detailsCard}>
                  <div className={styles.aboutSection}>
                    <h2>About this look</h2>
                    <p>{story.description}</p>
                    <p className={styles.aboutHighlight}>Curated pieces, considered styling and an effortless finish.</p>
                    <div className={styles.outlineTags}>{story.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </div>

                  <div className={styles.deliveryCard}>
                    <div className={styles.deliveryHeading}>
                      <span><Icon name="hanger" size={30} /></span>
                      <div><strong>Styled and delivered with care</strong><small>Premium fashion, protected from studio to doorstep.</small></div>
                    </div>
                    <div className={styles.deliveryFeatures}>
                      <div><Icon name="sparkle" size={20} /><span>Curated Edit</span></div>
                      <div><Icon name="quality" size={20} /><span>Quality Checked</span></div>
                      <div><Icon name="package" size={20} /><span>Premium Packaging</span></div>
                      <div><Icon name="truck" size={20} /><span>Fast Delivery</span></div>
                    </div>
                  </div>

                  <div className={styles.orderSection}>
                    <h3>Shop this look</h3>
                    <div className={styles.orderList}>
                      {story.products.map(([name, detail, price, image]) => {
                        const key = `${story.id}-${name}`;
                        const active = added.has(key);
                        return (
                          <div className={styles.orderItem} key={name}>
                            <img src={image} alt="" />
                            <div><strong>{name}</strong><span>{detail} • ₹{price.toLocaleString()}</span></div>
                            <button className={`${styles.addButton} ${active ? styles.added : ''}`} onClick={() => { toggle(setAdded, key); setToast(active ? 'Removed from bag' : 'Added to bag'); }}>
                              <Icon name={active ? 'quality' : 'plus'} size={18} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <div className={styles.orderActions}>
                      <button className={styles.primaryButton} onClick={() => setToast('Look added to bag')}><Icon name="bag" size={18} />Shop the look</button>
                      <button className={styles.secondaryButton}>View products<Icon name="arrowRight" size={18} /></button>
                    </div>
                  </div>
                </section>

                <section className={styles.commentsCard}>
                  <div className={styles.commentsHeading}>
                    <h3>Comments ({98 + index * 11 + (commentsByStory[story.id]?.length || 0)})</h3>
                    <button>View all</button>
                  </div>
                  <form className={styles.commentBox} onSubmit={addComment}>
                    <span className={styles.avatar}>A</span>
                    <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." />
                    <button type="submit" disabled={!commentText.trim()}><Icon name="send" size={18} /></button>
                  </form>
                  <div className={styles.commentsList}>
                    {comments.map((comment) => (
                      <article className={styles.comment} key={comment.id}>
                        <span className={styles.commentAvatar}>{comment.name.charAt(0).toUpperCase()}</span>
                        <div className={styles.commentContent}>
                          <div><strong>{comment.name}</strong><span>{comment.time}</span></div>
                          <p>{comment.text}</p>
                          <button>Reply</button>
                        </div>
                        <button className={styles.commentLike}><Icon name="heart" size={17} /><span>{comment.likes}</span></button>
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