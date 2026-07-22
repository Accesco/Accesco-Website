'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

const BACKGROUND_IMAGE_URL =
  'PASTE_YOUR_DIRECT_BACKGROUND_IMAGE_LINK_HERE';

const REELS = [
  {
    id: 'paneer-tikka',
    title: 'Smoky Paneer Tikka',
    restaurant: 'Royal Tandoor',
    videoFile: '1-paneer-tikka.mp4',
    description:
      'Smoky paneer tikka, charred peppers and a fresh squeeze of lemon.',
    tags: ['#PaneerLove', '#TandooriCravings', '#SwadishttReels'],
    orderItems: [
      {
        name: 'Smoky Paneer Tikka',
        detail: '1 plate',
        price: 279,
        image:
          'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=180&h=180&fit=crop',
      },
      {
        name: 'Mint Chutney',
        detail: '1 cup',
        price: 39,
        image:
          'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=180&h=180&fit=crop',
      },
      {
        name: 'Masala Onions',
        detail: '1 portion',
        price: 29,
        image:
          'https://images.unsplash.com/photo-1508747703725-719777637510?w=180&h=180&fit=crop',
      },
    ],
  },
  {
    id: 'chocolate-cake',
    title: 'Belgian Chocolate Lava Cake',
    restaurant: 'Sweet Treats',
    videoFile: '2-chocolate-cake.mp4',
    description:
      'Decadent Belgian chocolate lava cake with a melt-in-your-mouth centre.',
    tags: ['#ChocolateLove', '#DessertGoals', '#SwadishttReels'],
    orderItems: [
      {
        name: 'Belgian Chocolate Lava Cake',
        detail: '1 piece',
        price: 249,
        image:
          'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=180&h=180&fit=crop',
      },
      {
        name: 'Vanilla Ice Cream',
        detail: '1 scoop',
        price: 69,
        image:
          'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=180&h=180&fit=crop',
      },
      {
        name: 'Chocolate Sauce',
        detail: '30 ml',
        price: 39,
        image:
          'https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=180&h=180&fit=crop',
      },
    ],
  },
  {
    id: 'lasagna',
    title: 'Cheesy Baked Lasagna',
    restaurant: 'Pizza Corner',
    videoFile: '3-lasagana.mp4',
    description:
      'Layers of pasta, rich tomato sauce and molten cheese baked until golden.',
    tags: ['#CheesePull', '#ItalianCravings', '#SwadishttReels'],
    orderItems: [
      {
        name: 'Cheesy Baked Lasagna',
        detail: '1 serving',
        price: 349,
        image:
          'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=180&h=180&fit=crop',
      },
      {
        name: 'Garlic Bread',
        detail: '4 pieces',
        price: 119,
        image:
          'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=180&h=180&fit=crop',
      },
      {
        name: 'Herb Dip',
        detail: '30 ml',
        price: 39,
        image:
          'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=180&h=180&fit=crop',
      },
    ],
  },
  {
    id: 'gulab-jamun',
    title: 'Warm Gulab Jamun',
    restaurant: 'Sweet Treats',
    videoFile: '4-gulab-jamoon.mp4',
    description:
      'Soft, warm gulab jamuns soaked in fragrant cardamom syrup.',
    tags: ['#IndianDessert', '#SweetCravings', '#SwadishttReels'],
    orderItems: [
      {
        name: 'Warm Gulab Jamun',
        detail: '4 pieces',
        price: 129,
        image:
          'https://images.unsplash.com/photo-1666190094765-9688bbf9743a?w=180&h=180&fit=crop',
      },
      {
        name: 'Rabri',
        detail: '1 cup',
        price: 79,
        image:
          'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=180&h=180&fit=crop',
      },
      {
        name: 'Pistachio Crumble',
        detail: '1 topping',
        price: 29,
        image:
          'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=180&h=180&fit=crop',
      },
    ],
  },
  {
    id: 'french-fries',
    title: 'Crispy French Fries',
    restaurant: 'Burger Junction',
    videoFile: '5-french-fries.mp4',
    description:
      'Golden, crunchy fries tossed with our signature seasoning.',
    tags: ['#FriesForever', '#SnackTime', '#SwadishttReels'],
    orderItems: [
      {
        name: 'Crispy French Fries',
        detail: '1 regular',
        price: 149,
        image:
          'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=180&h=180&fit=crop',
      },
      {
        name: 'Cheese Dip',
        detail: '30 ml',
        price: 49,
        image:
          'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=180&h=180&fit=crop',
      },
      {
        name: 'Smoky Mayo',
        detail: '30 ml',
        price: 39,
        image:
          'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=180&h=180&fit=crop',
      },
    ],
  },
  {
    id: 'roll',
    title: 'Loaded Food Roll',
    restaurant: 'Burger Junction',
    videoFile: '6-roll.mp4',
    description:
      'A warm, loaded roll packed with fresh veggies and bold sauces.',
    tags: ['#RollGoals', '#StreetFood', '#SwadishttReels'],
    orderItems: [
      {
        name: 'Loaded Food Roll',
        detail: '1 roll',
        price: 189,
        image:
          'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=180&h=180&fit=crop',
      },
      {
        name: 'Masala Fries',
        detail: '1 small',
        price: 99,
        image:
          'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=180&h=180&fit=crop',
      },
      {
        name: 'Mint Mayo',
        detail: '30 ml',
        price: 39,
        image:
          'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=180&h=180&fit=crop',
      },
    ],
  },
  {
    id: 'momo',
    title: 'Steaming Hot Momos',
    restaurant: 'China Wok Express',
    videoFile: '8-momo.mp4',
    description:
      'Juicy steamed momos served piping hot with fiery chilli dip.',
    tags: ['#MomoLove', '#SteamAndServe', '#SwadishttReels'],
    orderItems: [
      {
        name: 'Steaming Hot Momos',
        detail: '6 pieces',
        price: 179,
        image:
          'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=180&h=180&fit=crop',
      },
      {
        name: 'Chilli Dip',
        detail: '30 ml',
        price: 39,
        image:
          'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=180&h=180&fit=crop',
      },
      {
        name: 'Clear Soup',
        detail: '1 cup',
        price: 69,
        image:
          'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=180&h=180&fit=crop',
      },
    ],
  },
  {
    id: 'biryani',
    title: 'Classic Dum Biryani',
    restaurant: 'Biryani House',
    videoFile: '9-biryani.mp4',
    description:
      'Fragrant basmati rice, slow-cooked masala and a dramatic dum reveal.',
    tags: ['#BiryaniLove', '#DumCooked', '#SwadishttReels'],
    orderItems: [
      {
        name: 'Classic Dum Biryani',
        detail: '1 portion',
        price: 299,
        image:
          'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=180&h=180&fit=crop',
      },
      {
        name: 'Boondi Raita',
        detail: '1 cup',
        price: 59,
        image:
          'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=180&h=180&fit=crop',
      },
      {
        name: 'Mirchi Salan',
        detail: '1 cup',
        price: 69,
        image:
          'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=180&h=180&fit=crop',
      },
    ],
  },
  {
    id: 'pasta',
    title: 'Creamy Italian Pasta',
    restaurant: 'Cafe Mocha',
    videoFile: '10-pasta.mp4',
    description:
      'Silky pasta coated in a creamy herb sauce and finished with parmesan.',
    tags: ['#PastaNight', '#CreamyGoodness', '#SwadishttReels'],
    orderItems: [
      {
        name: 'Creamy Italian Pasta',
        detail: '1 plate',
        price: 279,
        image:
          'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=180&h=180&fit=crop',
      },
      {
        name: 'Garlic Bread',
        detail: '4 pieces',
        price: 119,
        image:
          'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=180&h=180&fit=crop',
      },
      {
        name: 'Parmesan Topping',
        detail: '1 portion',
        price: 49,
        image:
          'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=180&h=180&fit=crop',
      },
    ],
  },
  {
    id: 'pizza',
    title: 'Cheesy Loaded Pizza',
    restaurant: 'Pizza Corner',
    videoFile: '11-pizza.mp4',
    description:
      'A loaded pizza with bubbling cheese, colourful toppings and crisp edges.',
    tags: ['#PizzaLove', '#CheesePull', '#SwadishttReels'],
    orderItems: [
      {
        name: 'Cheesy Loaded Pizza',
        detail: '1 medium',
        price: 399,
        image:
          'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=180&h=180&fit=crop',
      },
      {
        name: 'Garlic Bread',
        detail: '4 pieces',
        price: 119,
        image:
          'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=180&h=180&fit=crop',
      },
      {
        name: 'Jalapeño Dip',
        detail: '30 ml',
        price: 49,
        image:
          'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=180&h=180&fit=crop',
      },
    ],
  },
].map((reel, index) => ({
  ...reel,
  views: 1400 + index * 184,
  comments: 85 + index * 13,
  videoUrl: `/video/swadisht-reels/${reel.videoFile}`,
}));

const STARTER_COMMENTS = [
  {
    id: 'starter-1',
    name: 'sweet_tooth_101',
    text: 'Absolutely divine! The final reveal is just perfect. 🤎',
    time: '2h',
    likes: 36,
  },
];

function Icon({ name, filled = false, size = 22 }) {
  const icons = {
    back: <path d="m15 18-6-6 6-6" />,
    heart: (
      <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    comment: (
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-3.8-.8L3 21l1.7-5a8.6 8.6 0 1 1 16.3-4.5Z" />
    ),
    bookmark: <path d="M6 3.8h12v17l-6-3.8-6 3.8v-17Z" />,
    share: (
      <>
        <path d="m21 3-8.4 18-2.2-7.4L3 11 21 3Z" />
        <path d="M10.4 13.6 21 3" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    bag: (
      <>
        <path d="M6 8h12l-1 13H7L6 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
    arrowRight: <path d="m9 18 6-6-6-6" />,
    send: (
      <>
        <path d="m21 3-8.4 18-2.2-7.4L3 11 21 3Z" />
        <path d="M10.4 13.6 21 3" />
      </>
    ),
    fullscreen: (
      <>
        <path d="M8 3H3v5" />
        <path d="M16 3h5v5" />
        <path d="M21 16v5h-5" />
        <path d="M3 16v5h5" />
      </>
    ),
    play: <path d="m9 6 8 6-8 6V6Z" />,
    pause: (
      <>
        <path d="M9 5v14" />
        <path d="M15 5v14" />
      </>
    ),
    volume: (
      <>
        <path d="M5 9v6h4l5 4V5L9 9H5Z" />
        <path d="M17 8.5a5 5 0 0 1 0 7" />
      </>
    ),
    muted: (
      <>
        <path d="M5 9v6h4l5 4V5L9 9H5Z" />
        <path d="m18 9 4 4" />
        <path d="m22 9-4 4" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
      </>
    ),
    scooter: (
      <>
        <circle cx="7" cy="18" r="2.5" />
        <circle cx="18" cy="18" r="2.5" />
        <path d="M9.5 18h5.5l2-8h-5l-2 5H6" />
        <path d="M15 7h3l2 3" />
        <path d="M7 15 5 9h4" />
      </>
    ),
    quality: (
      <>
        <path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z" />
        <path d="m9.5 12 1.7 1.7 3.5-4" />
      </>
    ),
    package: (
      <>
        <path d="m3 7 9-4 9 4-9 4-9-4Z" />
        <path d="M3 7v10l9 4 9-4V7" />
        <path d="M12 11v10" />
      </>
    ),
    truck: (
      <>
        <path d="M3 6h11v10H3z" />
        <path d="M14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </>
    ),
    sparkle: (
      <>
        <path d="M12 2l1.2 3.8L17 7l-3.8 1.2L12 12l-1.2-3.8L7 7l3.8-1.2L12 2Z" />
        <path d="M19 13l.7 2.3L22 16l-2.3.7L19 19l-.7-2.3L16 16l2.3-.7L19 13Z" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}

function formatCount(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace('.0', '')}K`;
  }

  return String(value);
}

function formatTime(value) {
  if (!Number.isFinite(value)) {
    return '0:00';
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${seconds}`;
}

export default function FoodStoriesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState(() => new Set());
  const [saved, setSaved] = useState(() => new Set());
  const [commentsByReel, setCommentsByReel] = useState({});
  const [commentText, setCommentText] = useState('');
  const [cartItems, setCartItems] = useState(() => new Set());
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(6);
  const [duration, setDuration] = useState(30);
  const [videoFailed, setVideoFailed] = useState(false);
  const [toast, setToast] = useState('');

const videoRef = useRef(null);
const wheelLockRef = useRef(false);
const wheelDeltaRef = useRef(0);
const wheelResetRef = useRef(null);
const touchStartYRef = useRef(null);

const [scrollDirection, setScrollDirection] = useState('next');

  const reel = REELS[activeIndex];

  const comments = useMemo(
    () => [
      ...STARTER_COMMENTS,
      ...(commentsByReel[reel.id] || []),
    ],
    [commentsByReel, reel.id],
  );

  const isLiked = liked.has(reel.id);
  const isSaved = saved.has(reel.id);

  const toggleSet = (setter, id) => {
    setter((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

const changeReel = (direction) => {
  if (wheelLockRef.current) {
    return;
  }

  wheelLockRef.current = true;

  setScrollDirection(direction > 0 ? 'next' : 'previous');

  setActiveIndex((current) => {
    const next = current + direction;

    if (next < 0) {
      return REELS.length - 1;
    }

    if (next >= REELS.length) {
      return 0;
    }

    return next;
  });

  window.setTimeout(() => {
    wheelLockRef.current = false;
  }, 560);
};

const handleWheel = (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (wheelLockRef.current) {
    return;
  }

  wheelDeltaRef.current += event.deltaY;

  if (wheelResetRef.current) {
    window.clearTimeout(wheelResetRef.current);
  }

  wheelResetRef.current = window.setTimeout(() => {
    wheelDeltaRef.current = 0;
  }, 130);

  if (Math.abs(wheelDeltaRef.current) < 55) {
    return;
  }

  const direction = wheelDeltaRef.current > 0 ? 1 : -1;

  wheelDeltaRef.current = 0;

  changeReel(direction);
};

const handleTouchStart = (event) => {
  touchStartYRef.current = event.touches[0]?.clientY ?? null;
};

const handleTouchEnd = (event) => {
  if (touchStartYRef.current === null) {
    return;
  }

  const endY = event.changedTouches[0]?.clientY;

  if (typeof endY !== 'number') {
    touchStartYRef.current = null;
    return;
  }

  const distance = touchStartYRef.current - endY;

  touchStartYRef.current = null;

  if (Math.abs(distance) < 45) {
    return;
  }

  changeReel(distance > 0 ? 1 : -1);
};

  const togglePlayback = () => {
    const video = videoRef.current;

    if (!video || videoFailed) {
      return;
    }

    if (video.paused) {
      video.play().catch(() => undefined);
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleProgress = (event) => {
    const video = videoRef.current;

    if (!video || !duration) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width),
    );

    video.currentTime = ratio * duration;
    setCurrentTime(video.currentTime);
  };

  const shareReel = async () => {
    const url =
      `${window.location.origin}` +
      `/services/swadisht/food-stories?reel=${reel.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: reel.title,
          text: reel.description,
          url,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setToast('Reel link copied');
      }
    } catch {
      // User closed the share sheet.
    }
  };

  const openFullscreen = () => {
    videoRef.current?.requestFullscreen?.();
  };

  const postComment = (event) => {
    event.preventDefault();

    const text = commentText.trim();

    if (!text) {
      return;
    }

    setCommentsByReel((current) => ({
      ...current,
      [reel.id]: [
        ...(current[reel.id] || []),
        {
          id: String(Date.now()),
          name: 'you',
          text,
          time: 'now',
          likes: 0,
        },
      ],
    }));

    setCommentText('');
  };

  useEffect(() => {
    const requested = new URLSearchParams(
      window.location.search,
    ).get('reel');

    if (!requested) {
      return;
    }

    const requestedIndex = REELS.findIndex(
      (item) => item.id === requested,
    );

    if (requestedIndex >= 0) {
      setActiveIndex(requestedIndex);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    setVideoFailed(false);
    setCurrentTime(0);
    setDuration(30);
    setIsPlaying(true);

    if (!video) {
      return;
    }

    video.muted = muted;
    video.load();
    video.play().catch(() => undefined);
  }, [activeIndex, muted]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'ArrowDown') {
        changeReel(1);
      }

      if (event.key === 'ArrowUp') {
        changeReel(-1);
      }

      if (event.key === ' ') {
        event.preventDefault();
        togglePlayback();
      }

      if (event.key.toLowerCase() === 'm') {
        setMuted((current) => !current);
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  });

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setToast('');
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const backgroundStyle =
    BACKGROUND_IMAGE_URL &&
    !BACKGROUND_IMAGE_URL.startsWith('PASTE_')
      ? {
          '--swadishtt-reel-background': `url("${BACKGROUND_IMAGE_URL}")`,
        }
      : undefined;

  return (
    <main
      className="sw-reel-page"
      style={backgroundStyle}
    >
      <header className="sw-stories-header">
        <div className="sw-header-left">
          <Link
            href="/services/swadisht"
            className="sw-header-control"
            aria-label="Back to Swadishtt"
          >
            <Icon name="back" size={22} />
          </Link>

          <Link
            href="/services/swadisht"
            className="sw-header-logo-link"
            aria-label="Swadishtt home"
          >
            <img
              src="/images/swadisht/swadisht_logo.JPG"
              alt="Swadishtt"
              className="sw-header-logo"
            />
          </Link>

          <div className="sw-header-copy">
            <h1>
              Discover Your Next <span>Favourite Bite</span>
            </h1>
            <p>Shorts. Stories. Swaad.</p>
          </div>
        </div>

        <button
          type="button"
          className="sw-header-control"
          onClick={() => setMuted((current) => !current)}
          aria-label={muted ? 'Turn sound on' : 'Mute sound'}
        >
          <Icon name={muted ? 'muted' : 'volume'} size={20} />
        </button>
      </header>

      <div
        key={reel.id}
        className="sw-reel-shell"
      >
<section
  key={reel.id}
  className={`sw-video-card ${
    scrollDirection === 'next'
      ? 'sw-reel-enter-next'
      : 'sw-reel-enter-previous'
  }`}
  onWheel={handleWheel}
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
  tabIndex={0}
  aria-label={`${reel.title} reel`}
>
          {!videoFailed && (
            <video
              key={reel.videoUrl}
              ref={videoRef}
              className="sw-video"
              src={reel.videoUrl}
              muted={muted}
              loop
              playsInline
              preload="auto"
              onClick={togglePlayback}
              onLoadedMetadata={(event) => {
                setDuration(event.currentTarget.duration || 30);
              }}
              onTimeUpdate={(event) => {
                setCurrentTime(event.currentTarget.currentTime);
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setVideoFailed(true)}
            />
          )}

          {videoFailed && (
            <div className="sw-video-fallback">
              <span>Video unavailable</span>
              <strong>{reel.title}</strong>
              <p>{reel.videoFile}</p>
            </div>
          )}

          <div className="sw-video-shade" />

          <div className="sw-video-topbar">
            <span className="sw-trending-pill">
              <span aria-hidden="true">🔥</span>
              Trending
            </span>

            <button
              type="button"
              className="sw-video-more"
              aria-label="More options"
            >
              <Icon name="more" size={21} />
            </button>
          </div>

          <button
            type="button"
            className="sw-play-toggle"
            onClick={togglePlayback}
            aria-label={isPlaying ? 'Pause reel' : 'Play reel'}
          >
            <Icon
              name={isPlaying ? 'pause' : 'play'}
              filled={!isPlaying}
              size={20}
            />
          </button>

          <button
            type="button"
            className="sw-volume-toggle"
            onClick={() => setMuted((current) => !current)}
            aria-label={muted ? 'Turn sound on' : 'Mute sound'}
          >
            <Icon name={muted ? 'muted' : 'volume'} size={18} />
          </button>

          <div className="sw-video-actions">
            <button
              type="button"
              className={
                isLiked
                  ? 'sw-action-button sw-action-active'
                  : 'sw-action-button'
              }
              onClick={() => toggleSet(setLiked, reel.id)}
              aria-label="Like reel"
            >
              <span>
                <Icon name="heart" filled={isLiked} />
              </span>
              <b>{formatCount(reel.views + (isLiked ? 1 : 0))}</b>
            </button>

            <button
              type="button"
              className="sw-action-button"
              onClick={() => {
                document
                  .querySelector('.sw-comments-card')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              aria-label="View comments"
            >
              <span>
                <Icon name="comment" />
              </span>
              <b>{reel.comments + (commentsByReel[reel.id]?.length || 0)}</b>
            </button>

            <button
              type="button"
              className={
                isSaved
                  ? 'sw-action-button sw-action-active'
                  : 'sw-action-button'
              }
              onClick={() => toggleSet(setSaved, reel.id)}
              aria-label="Save reel"
            >
              <span>
                <Icon name="bookmark" filled={isSaved} />
              </span>
              <b>SAVE</b>
            </button>

            <button
              type="button"
              className="sw-action-button"
              onClick={shareReel}
              aria-label="Share reel"
            >
              <span>
                <Icon name="share" />
              </span>
              <b>SHARE</b>
            </button>
          </div>

          <div className="sw-video-copy">
            <strong>{reel.title}</strong>
            <p>{reel.description}</p>

            <div className="sw-video-tags">
              {reel.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <div
            className="sw-progress-track"
            role="slider"
            aria-label="Video progress"
            aria-valuemin={0}
            aria-valuemax={Math.max(1, duration)}
            aria-valuenow={currentTime}
            tabIndex={0}
            onClick={handleProgress}
          >
            <div
              className="sw-progress-fill"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(0, (currentTime / Math.max(1, duration)) * 100),
                )}%`,
              }}
            />

            <span
              className="sw-progress-thumb"
              style={{
                left: `${Math.min(
                  100,
                  Math.max(0, (currentTime / Math.max(1, duration)) * 100),
                )}%`,
              }}
            />
          </div>

          <div className="sw-video-footer">
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <button
              type="button"
              onClick={openFullscreen}
              aria-label="Open video fullscreen"
            >
              <Icon name="fullscreen" size={18} />
            </button>
          </div>
        </section>

       <aside
  key={`details-${reel.id}`}
  className="sw-details-column sw-details-enter"
>
          <section className="sw-details-card">
            <div className="sw-about-section">
              <h2>About this reel</h2>
              <p>{reel.description}</p>
              <p className="sw-about-highlight">
  Made fresh, finished beautifully, and impossible to resist.
</p>

              <div className="sw-outline-tags">
                {reel.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className="sw-delivery-card">
              <div className="sw-delivery-heading">
                <span className="sw-delivery-icon">
                  <Icon name="scooter" size={30} />
                </span>

                <div>
                  <strong>Delivered in 11 minutes</strong>
                  <span>Hot, fresh &amp; on your table in no time.</span>
                </div>
              </div>

              <div className="sw-delivery-features">
                <div>
                  <Icon name="sparkle" size={20} />
                  <span>Wide Range</span>
                </div>

                <div>
                  <Icon name="quality" size={20} />
                  <span>Top Quality</span>
                </div>

                <div>
                  <Icon name="package" size={20} />
                  <span>Safe Packaging</span>
                </div>

                <div>
                  <Icon name="truck" size={20} />
                  <span>Superfast Delivery</span>
                </div>
              </div>
            </div>

            <div className="sw-order-section">
              <h3>Order this now</h3>

              <div className="sw-order-list">
                {reel.orderItems.map((item) => {
                  const itemKey = `${reel.id}-${item.name}`;
                  const added = cartItems.has(itemKey);

                  return (
                    <div className="sw-order-item" key={item.name}>
                      <img src={item.image} alt="" />

                      <div>
                        <strong>{item.name}</strong>
                        <span>
                          {item.detail} &nbsp;•&nbsp; ₹{item.price}
                        </span>
                      </div>

                      <button
                        type="button"
                        className={added ? 'sw-add-button sw-added' : 'sw-add-button'}
                        onClick={() => {
                          toggleSet(setCartItems, itemKey);
                          setToast(added ? 'Removed from order' : 'Added to order');
                        }}
                        aria-label={
                          added
                            ? `Remove ${item.name}`
                            : `Add ${item.name}`
                        }
                      >
                        <Icon name={added ? 'quality' : 'plus'} size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="sw-order-actions">
                <Link
                  href={`/services/swadisht/restaurant/${reel.restaurant
                    .toLowerCase()
                    .replaceAll(' ', '-')}`}
                  className="sw-primary-button"
                >
                  <Icon name="bag" size={18} />
                  Order now
                </Link>

                <button type="button" className="sw-secondary-button">
                  View recipe
                  <Icon name="arrowRight" size={18} />
                </button>
              </div>
            </div>
          </section>

          <section className="sw-comments-card">
            <div className="sw-comments-heading">
              <h3>
                Comments ({reel.comments + (commentsByReel[reel.id]?.length || 0)})
              </h3>

              <button type="button">View all</button>
            </div>

            <form className="sw-comment-box" onSubmit={postComment}>
              <span className="sw-avatar">A</span>

              <input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Add a comment..."
              />

              <button
                type="submit"
                disabled={!commentText.trim()}
                aria-label="Post comment"
              >
                <Icon name="send" size={18} />
              </button>
            </form>

            <div className="sw-comments-list">
              {comments.map((comment) => (
                <article className="sw-comment" key={comment.id}>
                  <span className="sw-comment-avatar">
                    {comment.name.charAt(0).toUpperCase()}
                  </span>

                  <div className="sw-comment-content">
                    <div>
                      <strong>{comment.name}</strong>
                      <span>{comment.time}</span>
                    </div>

                    <p>{comment.text}</p>
                    <button type="button">Reply</button>
                  </div>

                  <button
                    type="button"
                    className="sw-comment-like"
                    aria-label="Like comment"
                  >
                    <Icon name="heart" size={17} />
                    <span>{comment.likes}</span>
                  </button>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {toast && <div className="sw-toast">{toast}</div>}

      <style jsx global>{`
        .sw-reel-page,
        .sw-reel-page * {
          box-sizing: border-box;
        }

        .sw-reel-page {
          position: fixed;
          inset: 0;
          z-index: 9999;
          overflow-y: auto;
          color: #321a21;
          background-color: #fff7f0;
          background-image:
            linear-gradient(
              rgba(255, 250, 245, 0.76),
              rgba(255, 250, 245, 0.76)
            ),
            var(--swadishtt-reel-background, none),
            radial-gradient(
              circle at 10% 12%,
              rgba(152, 44, 69, 0.07),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 86%,
              rgba(215, 140, 74, 0.08),
              transparent 32%
            );
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          background-attachment: fixed;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .sw-reel-shell {
          width: min(1120px, calc(100% - 36px));
          min-height: 100dvh;
          margin: 0 auto;
          padding: 26px 0;
          display: grid;
          grid-template-columns: minmax(360px, 410px) minmax(420px, 1fr);
          align-items: stretch;
          gap: 38px;
        }

       .sw-video-card {
  position: sticky;
  top: 26px;
  height: calc(100dvh - 52px);
  min-height: 660px;
  overflow: hidden;

  overscroll-behavior: contain;
  touch-action: pan-y;

  border: 1px solid rgba(92, 34, 49, 0.12);
  border-radius: 25px;
  background: #150c08;
}

        .sw-video,
        .sw-video-shade,
        .sw-video-fallback {
          position: absolute;
          inset: 0;
        }

        .sw-video {
          z-index: 1;
          width: 100%;
          height: 100%;
          object-fit: cover;
          background: #120a08;
          cursor: pointer;
        }

        .sw-video-fallback {
          z-index: 1;
          padding: 34px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 8px;
          color: #ffffff;
          text-align: center;
          background:
            radial-gradient(
              circle at 50% 18%,
              rgba(222, 129, 83, 0.3),
              transparent 28%
            ),
            linear-gradient(150deg, #6c1c35, #1b0f12 70%);
        }

        .sw-video-fallback span {
          color: rgba(255, 255, 255, 0.65);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .sw-video-fallback strong {
          max-width: 280px;
          font-family: Georgia, serif;
          font-size: 30px;
        }

        .sw-video-fallback p {
          margin: 0;
          color: rgba(255, 255, 255, 0.58);
          font-size: 12px;
        }

        .sw-video-shade {
          z-index: 2;
          pointer-events: none;
          background:
            linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.34) 0%,
              rgba(0, 0, 0, 0.02) 35%,
              rgba(0, 0, 0, 0.08) 58%,
              rgba(0, 0, 0, 0.8) 100%
            );
        }

        .sw-video-topbar {
          position: absolute;
          top: 22px;
          right: 22px;
          left: 22px;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sw-trending-pill {
          min-height: 31px;
          padding: 0 13px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          color: #ffffff;
          background: rgba(43, 29, 22, 0.42);
          backdrop-filter: blur(12px);
          font-size: 11px;
          font-weight: 700;
        }

        .sw-video-more,
        .sw-play-toggle,
        .sw-volume-toggle,
        .sw-video-footer button {
          padding: 0;
          border: 0;
          color: #ffffff;
          background: transparent;
          cursor: pointer;
        }

        .sw-play-toggle {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 5;
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 50%;
          opacity: 0;
          background: rgba(16, 10, 8, 0.42);
          backdrop-filter: blur(10px);
          transform: translate(-50%, -50%);
          transition: opacity 160ms ease;
        }

        .sw-video-card:hover .sw-play-toggle {
          opacity: 1;
        }

        .sw-volume-toggle {
          position: absolute;
          top: 66px;
          right: 23px;
          z-index: 5;
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 50%;
          background: rgba(20, 12, 10, 0.34);
          backdrop-filter: blur(10px);
        }

        .sw-video-actions {
          position: absolute;
          right: 17px;
          bottom: 122px;
          z-index: 6;
          display: grid;
          gap: 14px;
        }

        .sw-action-button {
          padding: 0;
          display: grid;
          justify-items: center;
          gap: 5px;
          border: 0;
          color: #ffffff;
          background: transparent;
          cursor: pointer;
        }

        .sw-action-button > span {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 50%;
          color: #a61e43;
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.2);
          transition:
            color 160ms ease,
            background 160ms ease,
            transform 160ms ease;
        }

        .sw-action-button:hover > span {
          transform: translateY(-2px);
        }

        .sw-action-button b {
          color: #ffffff;
          font-size: 10px;
          line-height: 1;
          text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
        }

        .sw-action-active > span {
          color: #ffffff;
          border-color: #b10f3b;
          background: linear-gradient(145deg, #d2274a, #97163b);
        }

        .sw-video-copy {
          position: absolute;
          right: 76px;
          bottom: 86px;
          left: 18px;
          z-index: 5;
          color: #ffffff;
        }

        .sw-video-copy > strong {
          display: block;
          margin-bottom: 7px;
          font-size: 14px;
          font-weight: 800;
        }

        .sw-video-copy > p {
          max-width: 300px;
          margin: 0;
          color: rgba(255, 255, 255, 0.88);
          font-size: 11px;
          line-height: 1.52;
        }

        .sw-video-tags {
          margin-top: 13px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .sw-video-tags span {
          padding: 6px 9px;
          border-radius: 999px;
          color: #ffffff;
          background: rgba(83, 19, 38, 0.74);
          backdrop-filter: blur(8px);
          font-size: 9px;
          font-weight: 700;
        }

        .sw-progress-track {
          position: absolute;
          right: 18px;
          bottom: 53px;
          left: 18px;
          z-index: 7;
          height: 4px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.35);
          cursor: pointer;
        }

        .sw-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: #b71040;
        }

        .sw-progress-thumb {
          position: absolute;
          top: 50%;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.22);
          transform: translate(-50%, -50%);
        }

        .sw-video-footer {
          position: absolute;
          right: 18px;
          bottom: 16px;
          left: 18px;
          z-index: 7;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
        }

        .sw-details-column {
          min-width: 0;
          display: grid;
          align-content: start;
          gap: 17px;
        }

        .sw-details-card,
        .sw-comments-card {
          border: 1px solid rgba(113, 48, 62, 0.08);
          border-radius: 20px;
          background: rgba(255, 252, 248, 0.86);
          box-shadow:
            0 20px 48px rgba(76, 36, 46, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(14px);
        }

        .sw-details-card {
          padding: 18px;
        }

        .sw-about-section h2,
        .sw-order-section h3,
        .sw-comments-heading h3 {
          margin: 0;
          color: #8b1738;
          font-size: 13px;
          font-weight: 850;
        }

        .sw-about-section p {
          margin: 11px 0 0;
          color: #4c3a3f;
          font-size: 12px;
          line-height: 1.55;
        }

        .sw-outline-tags {
          margin-top: 14px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .sw-outline-tags span {
          padding: 7px 11px;
          border: 1px solid rgba(164, 28, 65, 0.32);
          border-radius: 999px;
          color: #a31d45;
          background: rgba(255, 255, 255, 0.48);
          font-size: 9px;
          font-weight: 750;
        }

        .sw-delivery-card {
          margin-top: 17px;
          padding: 14px;
          border: 1px solid rgba(187, 95, 66, 0.13);
          border-radius: 14px;
          background:
            linear-gradient(
              115deg,
              rgba(255, 248, 241, 0.96),
              rgba(255, 240, 229, 0.78)
            );
        }

        .sw-delivery-heading {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sw-delivery-icon {
          color: #a71d42;
        }

        .sw-delivery-heading > div {
          display: grid;
          gap: 4px;
        }

        .sw-delivery-heading strong {
          color: #90193a;
          font-size: 12px;
        }

        .sw-delivery-heading span {
          color: #604b50;
          font-size: 10px;
        }

        .sw-delivery-features {
          margin-top: 16px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 9px;
        }

        .sw-delivery-features > div {
          min-width: 0;
          display: grid;
          justify-items: center;
          gap: 6px;
          color: #a01c42;
          text-align: center;
        }

        .sw-delivery-features span {
          color: #7a4f59;
          font-size: 8px;
          line-height: 1.2;
        }

        .sw-order-section {
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid rgba(109, 48, 62, 0.09);
        }

        .sw-order-list {
          margin-top: 11px;
          display: grid;
          gap: 10px;
        }

        .sw-order-item {
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr) auto;
          align-items: center;
          gap: 10px;
        }

        .sw-order-item img {
          width: 44px;
          height: 44px;
          display: block;
          border-radius: 10px;
          object-fit: cover;
          background: #f3e6df;
        }

        .sw-order-item > div {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .sw-order-item strong {
          overflow: hidden;
          color: #39272c;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sw-order-item span {
          color: #756166;
          font-size: 9px;
        }

        .sw-add-button {
          width: 30px;
          height: 30px;
          padding: 0;
          display: grid;
          place-items: center;
          border: 1px solid rgba(174, 31, 70, 0.38);
          border-radius: 50%;
          color: #b11f48;
          background: #ffffff;
          cursor: pointer;
          transition:
            color 160ms ease,
            background 160ms ease;
        }

        .sw-add-button.sw-added {
          color: #ffffff;
          background: #a71c42;
        }

        .sw-order-actions {
          margin-top: 17px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .sw-primary-button,
        .sw-secondary-button {
          min-height: 44px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
          cursor: pointer;
        }

        .sw-primary-button {
          border: 0;
          color: #ffffff;
          background: linear-gradient(135deg, #bd1544, #8d0d34);
          box-shadow: 0 10px 22px rgba(139, 16, 52, 0.2);
        }

        .sw-secondary-button {
          border: 1px solid rgba(139, 23, 58, 0.16);
          color: #8d1738;
          background: rgba(255, 255, 255, 0.72);
        }

        .sw-comments-card {
          padding: 17px;
        }

        .sw-comments-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sw-comments-heading button,
        .sw-comment-content button {
          padding: 0;
          border: 0;
          color: #9b173e;
          background: transparent;
          font-size: 9px;
          font-weight: 750;
          cursor: pointer;
        }

        .sw-comment-box {
          margin-top: 13px;
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr) 32px;
          align-items: center;
          gap: 9px;
        }

        .sw-avatar,
        .sw-comment-avatar {
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #ffffff;
          background: linear-gradient(145deg, #cf7d64, #7e203d);
          font-weight: 800;
        }

        .sw-avatar {
          width: 34px;
          height: 34px;
          font-size: 11px;
        }

        .sw-comment-box input {
          min-width: 0;
          height: 38px;
          padding: 0 13px;
          border: 1px solid rgba(105, 62, 72, 0.12);
          border-radius: 999px;
          outline: none;
          color: #3c2a2f;
          background: rgba(255, 255, 255, 0.72);
          font-size: 10px;
        }

        .sw-comment-box input:focus {
          border-color: rgba(161, 28, 65, 0.34);
        }

        .sw-comment-box > button {
          width: 32px;
          height: 32px;
          padding: 0;
          display: grid;
          place-items: center;
          border: 0;
          color: #a11c43;
          background: transparent;
          cursor: pointer;
        }

        .sw-comment-box > button:disabled {
          opacity: 0.35;
          cursor: default;
        }

        .sw-comments-list {
          margin-top: 13px;
          display: grid;
          gap: 14px;
        }

        .sw-comment {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr) auto;
          align-items: start;
          gap: 10px;
        }

        .sw-comment-avatar {
          width: 34px;
          height: 34px;
          font-size: 10px;
        }

        .sw-comment-content {
          min-width: 0;
        }

        .sw-comment-content > div {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .sw-comment-content strong {
          color: #33242a;
          font-size: 10px;
        }

        .sw-comment-content span {
          color: #9a888d;
          font-size: 9px;
        }

        .sw-comment-content p {
          margin: 5px 0 6px;
          color: #4f3c42;
          font-size: 10px;
          line-height: 1.45;
        }

        .sw-comment-like {
          padding: 0;
          display: grid;
          justify-items: center;
          gap: 2px;
          border: 0;
          color: #a31b42;
          background: transparent;
          cursor: pointer;
        }

        .sw-comment-like span {
          font-size: 9px;
        }

        .sw-toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          z-index: 100;
          padding: 11px 17px;
          border-radius: 999px;
          color: #ffffff;
          background: rgba(60, 27, 36, 0.94);
          box-shadow: 0 12px 30px rgba(53, 24, 32, 0.24);
          font-size: 11px;
          font-weight: 750;
          transform: translateX(-50%);
        }

        @media (max-width: 920px) {
          .sw-reel-shell {
            width: min(760px, calc(100% - 28px));
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .sw-video-card {
            position: relative;
            top: auto;
            height: min(76dvh, 720px);
            min-height: 600px;
          }
        }

        @media (max-width: 560px) {
          .sw-reel-page {
            background-attachment: scroll;
          }

          .sw-reel-shell {
            width: 100%;
            padding: 0;
            gap: 0;
          }

          .sw-video-card {
            height: 100dvh;
            min-height: 0;
            border: 0;
            border-radius: 0;
            box-shadow: none;
          }

          .sw-details-column {
            padding: 14px;
            background: #fff7f0;
          }

          .sw-details-card,
          .sw-comments-card {
            border-radius: 17px;
          }

          .sw-video-actions {
            bottom: 132px;
          }

          .sw-video-copy {
            bottom: 92px;
          }

          .sw-delivery-features {
            grid-template-columns: repeat(2, 1fr);
          }

          .sw-order-actions {
            grid-template-columns: 1fr;
          }
        }

        /* =========================================================
   FINAL REFERENCE LAYOUT OVERRIDES
   Paste this at the very bottom of the page CSS
   ========================================================= */

/* Desktop: wheel changes reels instead of moving the page */
.sw-reel-page {
  overflow: hidden !important;
}

/* Match the compact two-column spacing from the reference */
.sw-reel-shell {
  width: min(860px, calc(100% - 40px)) !important;
  min-height: 100dvh !important;
  margin: 0 auto !important;
  padding: 24px 0 18px !important;

  display: grid !important;
  grid-template-columns: 400px 355px !important;
  align-items: start !important;
  justify-content: center !important;
  gap: 40px !important;

  animation: swReelEnter 460ms
    cubic-bezier(0.22, 0.78, 0.22, 1) both;
}

@keyframes swReelEnter {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Reel dimensions */
.sw-video-card {
  position: sticky !important;
  top: 24px !important;

  width: 400px !important;
  height: min(620px, calc(100dvh - 48px)) !important;
  min-height: 560px !important;

  overflow: hidden !important;
  overscroll-behavior: contain !important;
  touch-action: pan-y !important;

  border-radius: 24px !important;

  box-shadow:
    0 28px 65px rgba(66, 30, 39, 0.17),
    0 7px 20px rgba(66, 30, 39, 0.08) !important;
}

/* Right column */
.sw-details-column {
  width: 355px !important;
  min-width: 0 !important;

  display: grid !important;
  align-content: start !important;
  gap: 12px !important;
}

.sw-details-card,
.sw-comments-card {
  border: 1px solid rgba(113, 48, 62, 0.08) !important;
  border-radius: 17px !important;

  background: rgba(255, 252, 248, 0.92) !important;

  box-shadow:
    0 16px 38px rgba(76, 36, 46, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;

  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
}

.sw-details-card {
  padding: 16px !important;
}

.sw-comments-card {
  padding: 15px 16px !important;
}

/* About section */
.sw-about-section h2 {
  margin: 0 !important;
  font-size: 13px !important;
}

.sw-about-section p {
  margin: 8px 0 0 !important;
  color: #4c3a3f !important;
  font-size: 11px !important;
  line-height: 1.48 !important;
}

/* Replace the unwanted sweet-cravings sentence using CSS */
.sw-about-section p:nth-of-type(2) {
  font-size: 0 !important;
  line-height: 0 !important;
}

.sw-about-section p:nth-of-type(2)::after {
  content: "Made fresh, finished beautifully, and impossible to resist.";
  display: block;

  color: #6e3d49;
  font-size: 11px;
  font-weight: 650;
  line-height: 1.48;
}

/* Hashtag pills */
.sw-outline-tags {
  margin-top: 11px !important;

  display: flex !important;
  flex-wrap: wrap !important;
  gap: 7px !important;
}

.sw-outline-tags span {
  padding: 6px 10px !important;

  border: 1px solid rgba(164, 28, 65, 0.3) !important;
  border-radius: 999px !important;

  color: #a31d45 !important;
  background: rgba(255, 255, 255, 0.52) !important;

  font-size: 8px !important;
  font-weight: 750 !important;
}

/* Delivery box */
.sw-delivery-card {
  margin-top: 13px !important;
  padding: 12px !important;

  border-radius: 13px !important;

  background:
    linear-gradient(
      115deg,
      rgba(255, 248, 241, 0.97),
      rgba(255, 240, 229, 0.78)
    ) !important;
}

.sw-delivery-heading {
  gap: 10px !important;
}

.sw-delivery-heading strong {
  font-size: 11px !important;
}

.sw-delivery-heading span {
  font-size: 9px !important;
}

.sw-delivery-features {
  margin-top: 13px !important;

  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 7px !important;
}

.sw-delivery-features span {
  font-size: 7px !important;
}

/* Order section */
.sw-order-section {
  margin-top: 14px !important;
  padding-top: 13px !important;
}

.sw-order-list {
  margin-top: 9px !important;

  display: grid !important;
  gap: 8px !important;
}

.sw-order-item {
  display: grid !important;
  grid-template-columns: 40px minmax(0, 1fr) auto !important;
  align-items: center !important;
  gap: 9px !important;
}

.sw-order-item img {
  width: 40px !important;
  height: 40px !important;

  border-radius: 9px !important;
}

.sw-order-item strong {
  font-size: 10px !important;
}

.sw-order-item span {
  font-size: 8px !important;
}

.sw-add-button {
  width: 28px !important;
  height: 28px !important;
}

/* Bottom order buttons */
.sw-order-actions {
  margin-top: 14px !important;

  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 10px !important;
}

.sw-primary-button,
.sw-secondary-button {
  min-height: 40px !important;
  padding: 0 13px !important;

  border-radius: 9px !important;

  font-size: 10px !important;
}

/* Comments */
.sw-comments-heading h3 {
  font-size: 12px !important;
}

.sw-comment-box {
  margin-top: 11px !important;
}

.sw-comments-list {
  margin-top: 11px !important;
  gap: 11px !important;
}

.sw-comment-content p {
  margin: 4px 0 5px !important;
  font-size: 9px !important;
}

/* Reel overlay spacing */
.sw-video-actions {
  right: 16px !important;
  bottom: 116px !important;
  gap: 12px !important;
}

.sw-action-button > span {
  width: 40px !important;
  height: 40px !important;
}

.sw-video-copy {
  right: 72px !important;
  bottom: 84px !important;
  left: 17px !important;
}

.sw-video-copy > strong {
  margin-bottom: 6px !important;
  font-size: 12px !important;
}

.sw-video-copy > p {
  font-size: 10px !important;
  line-height: 1.45 !important;
}

.sw-video-tags {
  margin-top: 11px !important;
  gap: 5px !important;
}

.sw-video-tags span {
  padding: 5px 8px !important;
  font-size: 8px !important;
}

.sw-progress-track {
  right: 17px !important;
  bottom: 49px !important;
  left: 17px !important;
}

.sw-video-footer {
  right: 17px !important;
  bottom: 14px !important;
  left: 17px !important;
}

/* Tablet/mobile must scroll normally */
@media (max-width: 920px) {
  .sw-reel-page {
    overflow-y: auto !important;
  }

  .sw-reel-shell {
    width: min(760px, calc(100% - 28px)) !important;
    min-height: auto !important;
    padding: 18px 0 !important;

    grid-template-columns: 1fr !important;
    gap: 18px !important;
  }

  .sw-video-card {
    position: relative !important;
    top: auto !important;

    width: 100% !important;
    height: min(76dvh, 720px) !important;
    min-height: 600px !important;
  }

  .sw-details-column {
    width: 100% !important;
  }
}

@media (max-width: 560px) {
  .sw-reel-shell {
    width: 100% !important;
    padding: 0 !important;
    gap: 0 !important;
  }

  .sw-video-card {
    width: 100% !important;
    height: 100dvh !important;
    min-height: 0 !important;

    border-radius: 0 !important;
  }

  .sw-details-column {
    padding: 14px !important;
  }

  .sw-order-actions {
    grid-template-columns: 1fr !important;
  }
}

/* =====================================================
   INSTAGRAM-STYLE REEL SCROLL + FIXED COMMENTS PANEL
   ===================================================== */

/* Remove the previous whole-layout animation */
.sw-reel-shell {
  animation: none !important;
}

/* Only the reel transitions */
.sw-video-card {
  overscroll-behavior: contain !important;
  touch-action: pan-y !important;
  will-change: transform, opacity;
}

.sw-reel-enter-next {
  animation:
    swInstaNext 520ms
    cubic-bezier(0.2, 0.82, 0.2, 1)
    both !important;
}

.sw-reel-enter-previous {
  animation:
    swInstaPrevious 520ms
    cubic-bezier(0.2, 0.82, 0.2, 1)
    both !important;
}

@keyframes swInstaNext {
  from {
    opacity: 0.35;
    transform:
      translateY(13%)
      scale(0.985);
  }

  to {
    opacity: 1;
    transform:
      translateY(0)
      scale(1);
  }
}

@keyframes swInstaPrevious {
  from {
    opacity: 0.35;
    transform:
      translateY(-13%)
      scale(0.985);
  }

  to {
    opacity: 1;
    transform:
      translateY(0)
      scale(1);
  }
}

/* Soft transition for the information panel */
.sw-details-enter {
  animation:
    swDetailsEnter 380ms ease-out
    both;
}

@keyframes swDetailsEnter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Keep the desktop page fixed */
.sw-reel-page {
  overflow: hidden !important;
}

/* Let the complete right column scroll independently */
.sw-details-column {
  position: sticky !important;
  top: 24px !important;

  width: 355px !important;
  max-height: calc(100dvh - 48px) !important;

  overflow-x: hidden !important;
  overflow-y: auto !important;
  overscroll-behavior: contain !important;

  padding-right: 7px !important;
  padding-bottom: 24px !important;

  scrollbar-width: thin;
  scrollbar-color:
    rgba(145, 27, 59, 0.24)
    transparent;
}

/* Chrome and Edge scrollbar */
.sw-details-column::-webkit-scrollbar {
  width: 5px;
}

.sw-details-column::-webkit-scrollbar-track {
  background: transparent;
}

.sw-details-column::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background:
    rgba(145, 27, 59, 0.22);
}

.sw-details-column::-webkit-scrollbar-thumb:hover {
  background:
    rgba(145, 27, 59, 0.38);
}

/* Ensure comments can reach the bottom */
.sw-comments-card {
  flex-shrink: 0 !important;
  min-height: max-content !important;
  margin-bottom: 22px !important;
  overflow: visible !important;
}

.sw-comments-list {
  padding-bottom: 8px !important;
}

/* Prevent wheel events on the right panel
   from changing the reel */
.sw-details-column {
  pointer-events: auto;
}

/* Tablet and mobile: normal page scrolling */
@media (max-width: 920px) {
  .sw-reel-page {
    overflow-y: auto !important;
  }

  .sw-details-column {
    position: static !important;

    width: 100% !important;
    max-height: none !important;

    overflow: visible !important;

    padding-right: 0 !important;
    padding-bottom: 24px !important;

    scrollbar-width: none;
  }

  .sw-details-column::-webkit-scrollbar {
    display: none;
  }

  .sw-video-card {
    touch-action: pan-y !important;
  }
}


/* =====================================================
   RESTORED ONE-LINE SWADISHTT HEADER
   ===================================================== */

.sw-stories-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 80;
  height: 84px;
  padding: 0 clamp(20px, 4vw, 64px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(107, 29, 58, 0.08);
  background: rgba(255, 250, 245, 0.9);
  box-shadow: 0 8px 28px rgba(72, 34, 43, 0.055);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.sw-header-left {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 13px;
}

.sw-header-control {
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  padding: 0;
  display: grid;
  place-items: center;
  border: 1px solid rgba(107, 29, 58, 0.14);
  border-radius: 50%;
  color: #7b1d3b;
  background: rgba(255, 255, 255, 0.9);
  box-shadow:
    0 7px 19px rgba(72, 34, 43, 0.075),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
  cursor: pointer;
  text-decoration: none;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.sw-header-control:hover {
  border-color: rgba(107, 29, 58, 0.3);
  box-shadow:
    0 10px 24px rgba(72, 34, 43, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.98);
  transform: translateY(-1px);
}

.sw-header-logo-link {
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 13px;
  background: #ffffff;
  text-decoration: none;
}

.sw-header-logo {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.sw-header-copy {
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 14px;
}

.sw-header-copy h1 {
  margin: 0;
  color: #25181b;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(23px, 2.25vw, 37px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.045em;
  white-space: nowrap;
}

.sw-header-copy h1 span {
  color: #7d1d3b;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    sans-serif;
  font-weight: 500;
  letter-spacing: -0.035em;
}

.sw-header-copy p {
  margin: 0;
  padding-left: 14px;
  border-left: 1px solid rgba(107, 29, 58, 0.16);
  color: #79676c;
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.025em;
  white-space: nowrap;
}

/* Keep the restored header above the full layout */
.sw-reel-shell {
  height: 100dvh !important;
  min-height: 0 !important;
  padding: 104px 0 18px !important;
}

.sw-video-card {
  position: relative !important;
  top: auto !important;
  height: min(620px, calc(100dvh - 122px)) !important;
  min-height: 520px !important;
}

.sw-details-column {
  position: relative !important;
  top: auto !important;
  max-height: calc(100dvh - 122px) !important;
  padding-bottom: 18px !important;
}

/* The right panel scrolls without changing the reel */
.sw-details-column {
  overflow-y: auto !important;
  overscroll-behavior: contain !important;
}

/* Mobile/tablet */
@media (max-width: 920px) {
  .sw-stories-header {
    height: 74px;
    padding: 0 14px;
  }

  .sw-header-left {
    gap: 9px;
  }

  .sw-header-control {
    width: 40px;
    height: 40px;
  }

  .sw-header-logo-link {
    width: 40px;
    height: 40px;
    border-radius: 11px;
  }

  .sw-header-copy {
    gap: 0;
  }

  .sw-header-copy h1 {
    max-width: calc(100vw - 158px);
    overflow: hidden;
    font-size: 18px;
    line-height: 1.05;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sw-header-copy p {
    display: none;
  }

  .sw-reel-page {
    overflow-y: auto !important;
  }

  .sw-reel-shell {
    width: min(760px, calc(100% - 28px)) !important;
    height: auto !important;
    min-height: 100dvh !important;
    padding: 92px 0 18px !important;
  }

  .sw-video-card {
    width: 100% !important;
    height: min(76dvh, 720px) !important;
    min-height: 600px !important;
  }

  .sw-details-column {
    position: static !important;
    width: 100% !important;
    max-height: none !important;
    overflow: visible !important;
    padding-right: 0 !important;
  }
}

@media (max-width: 560px) {
  .sw-stories-header {
    height: 66px;
    padding: 0 10px;
  }

  .sw-header-control {
    width: 38px;
    height: 38px;
  }

  .sw-header-logo-link {
    width: 38px;
    height: 38px;
  }

  .sw-header-copy h1 {
    max-width: calc(100vw - 144px);
    font-size: 15px;
  }

  .sw-reel-shell {
    width: 100% !important;
    padding: 66px 0 0 !important;
  }

  .sw-video-card {
    height: calc(100dvh - 66px) !important;
    min-height: 0 !important;
    border-radius: 0 !important;
  }

  .sw-details-column {
    padding: 14px !important;
  }
}

      `}</style>
    </main>
  );
}