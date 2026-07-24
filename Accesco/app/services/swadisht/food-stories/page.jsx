"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const DISHES = [
  {
    id: "pasta",
    title: "Cheesy Baked Pasta",
    restaurant: "The Pasta Project",
    username: "@foodie_delhi",
    location: "Gurgaon, India",
    price: 249,
    rating: 4.8,
    reviews: "2.4K",
    video: "/video/swadisht-reels/10-pasta.mp4",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=1200&h=900&fit=crop",
    description:
      "Creamy white sauce pasta baked to perfection with loads of mozzarella cheese, aromatic herbs and fresh vegetables.",
    caption: "Too cheesy to handle! 😍",
    tags: ["#Trending", "#CheeseLovers", "#MustTry"],
    likes: "24.8K",
    comments: "1.2K",
    saves: "5.6K",
  },
  {
    id: "paneer",
    title: "Paneer Tikka Masala",
    restaurant: "Royal Tandoor",
    username: "@indianfoodstories",
    location: "Bengaluru, India",
    price: 229,
    rating: 4.7,
    reviews: "1.9K",
    video: "/video/swadisht-reels/1-paneer-tikka.mp4",
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1200&h=900&fit=crop",
    description:
      "Smoky paneer tikka served with creamy tomato gravy, charred peppers and freshly prepared mint chutney.",
    caption: "The perfect smoky paneer bite! 🔥",
    tags: ["#PaneerLove", "#Tandoori", "#FreshlyMade"],
    likes: "19.4K",
    comments: "986",
    saves: "4.8K",
  },
  {
    id: "burger",
    title: "Loaded Cheese Burger",
    restaurant: "Burger Junction",
    username: "@burgerdiaries",
    location: "Mumbai, India",
    price: 199,
    rating: 4.6,
    reviews: "1.7K",
    video: "/video/swadisht-reels/6-roll.mp4",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=900&fit=crop",
    description:
      "A juicy grilled patty topped with molten cheese, caramelised onions, crisp vegetables and signature sauce.",
    caption: "Loaded, cheesy and worth every bite 🍔",
    tags: ["#BurgerLove", "#CheesePull", "#FoodGoals"],
    likes: "21.6K",
    comments: "1.1K",
    saves: "5.1K",
  },
  {
    id: "noodles",
    title: "Veg Hakka Noodles",
    restaurant: "China Wok Express",
    username: "@streetfoodindia",
    location: "Delhi, India",
    price: 189,
    rating: 4.5,
    reviews: "1.5K",
    video: "/video/swadisht-reels/8-momo.mp4",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1200&h=900&fit=crop",
    description:
      "Wok-tossed noodles loaded with fresh vegetables, aromatic sauces and the perfect amount of smoky flavour.",
    caption: "That wok-tossed flavour hits different! 🍜",
    tags: ["#NoodleLove", "#WokTossed", "#StreetFood"],
    likes: "17.9K",
    comments: "875",
    saves: "4.2K",
  },
  {
    id: "cake",
    title: "Chocolate Lava Cake",
    restaurant: "Sweet Treats",
    username: "@dessertfirst",
    location: "Pune, India",
    price: 149,
    rating: 4.8,
    reviews: "2.1K",
    video: "/video/swadisht-reels/2-chocolate-cake.mp4",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1200&h=900&fit=crop",
    description:
      "A rich Belgian chocolate cake with a warm molten centre, baked fresh and served with chocolate sauce.",
    caption: "Wait for that chocolate centre! 🍫",
    tags: ["#ChocolateLove", "#DessertGoals", "#SweetCravings"],
    likes: "28.3K",
    comments: "1.8K",
    saves: "7.4K",
  },
];

const INITIAL_COMMENTS = [
  {
    id: "comment-1",
    name: "Ananya Verma",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    text: "Super cheesy and absolutely delicious! Will order again for sure.",
    time: "2 hours ago",
    likes: 243,
  },
  {
    id: "comment-2",
    name: "Rohit Singh",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
    text: "Perfectly baked and super filling. Loved the flavour!",
    time: "4 hours ago",
    likes: 187,
  },
  {
    id: "comment-3",
    name: "Mehak Sharma",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
    text: "The best meal I’ve had in a long time. Packaging was great too!",
    time: "5 hours ago",
    likes: 132,
  },
];

function Icon({ name, size = 20, filled = false }) {
  const icons = {
    heart: (
      <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    comment: (
      <path d="M21 11.5a8.5 8.5 0 0 1-9 8.5 10 10 0 0 1-3.8-.8L3 21l1.7-5A8.5 8.5 0 1 1 21 11.5Z" />
    ),
    bookmark: <path d="M6 3.5h12v17L12 17l-6 3.5v-17Z" />,
    share: (
      <>
        <circle cx="18" cy="5" r="2.5" />
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="18" cy="19" r="2.5" />
        <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
      </>
    ),
    volume: (
      <>
        <path d="M5 9v6h4l5 4V5L9 9H5Z" />
        <path d="M17 9a4 4 0 0 1 0 6" />
      </>
    ),
    muted: (
      <>
        <path d="M5 9v6h4l5 4V5L9 9H5Z" />
        <path d="m18 9 4 4m0-4-4 4" />
      </>
    ),
    fullscreen: <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />,
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </>
    ),
    bag: (
      <>
        <path d="M6 8h12l-1 13H7L6 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

function Story({
  dish,
  index,
  active,
  onSelectDish,
  onChangeDish,
  scrollDirection,
}) {
  const videoRef = useRef(null);
  const scrollLockedRef = useRef(false);
  const wheelDeltaRef = useRef(0);
  const wheelResetRef = useRef(null);
  const touchStartYRef = useRef(null);

  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [progress, setProgress] = useState(0);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(INITIAL_COMMENTS);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (active && !commentsOpen) {
      video.play().catch(() => undefined);
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [active, commentsOpen]);

  const togglePlayback = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      video.play().catch(() => undefined);
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const openComments = () => {
    videoRef.current?.pause();
    setPlaying(false);
    setCommentsOpen(true);
  };

  const closeComments = () => {
    setCommentsOpen(false);

    if (active) {
      videoRef.current?.play().catch(() => undefined);
      setPlaying(true);
    }
  };

  const submitComment = (event) => {
    event.preventDefault();

    const text = commentText.trim();

    if (!text) return;

    setComments((current) => [
      ...current,
      {
        id: `comment-${Date.now()}`,
        name: "You",
        image: "",
        text,
        time: "now",
        likes: 0,
      },
    ]);

    setCommentText("");
  };

  const shareDish = async () => {
    const url = `${window.location.origin}/services/swadisht/food-stories?dish=${dish.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: dish.title,
          text: dish.description,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // Share menu closed.
    }
  };

  const changeReel = (direction) => {
    if (scrollLockedRef.current) return;

    scrollLockedRef.current = true;
    onChangeDish(direction);

    window.setTimeout(() => {
      scrollLockedRef.current = false;
    }, 850);
  };

  const handleReelWheel = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (scrollLockedRef.current) return;

    wheelDeltaRef.current += event.deltaY;

    if (wheelResetRef.current) {
      window.clearTimeout(wheelResetRef.current);
    }

    wheelResetRef.current = window.setTimeout(() => {
      wheelDeltaRef.current = 0;
    }, 160);

    if (Math.abs(wheelDeltaRef.current) < 100) return;

    const direction = wheelDeltaRef.current > 0 ? 1 : -1;

    wheelDeltaRef.current = 0;
    changeReel(direction);
  };

  const handleReelTouchStart = (event) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleReelTouchEnd = (event) => {
    if (touchStartYRef.current === null) return;

    const endY = event.changedTouches[0]?.clientY;

    if (typeof endY !== "number") return;

    const distance = touchStartYRef.current - endY;

    touchStartYRef.current = null;

    if (Math.abs(distance) < 45) return;

    changeReel(distance > 0 ? 1 : -1);
  };

  const suggestions = DISHES.filter((item) => item.id !== dish.id).slice(0, 4);

  return (
    <section className="fs-story" data-index={index}>
      <div className="fs-content">
        <div className="fs-heading">
          <h1>
            Discover food worth <span>craving.</span>
          </h1>
          <p>Real people try it. Real reviews. Order instantly.</p>
        </div>

        <div className="fs-main-grid">
          <article
            className="fs-video-card"
            onWheel={handleReelWheel}
            onTouchStart={handleReelTouchStart}
            onTouchEnd={handleReelTouchEnd}
          >
            <div
              className={`fs-reel-frame ${
                scrollDirection === "next"
                  ? "fs-reel-enter-next"
                  : "fs-reel-enter-previous"
              }`}
            >
              <video
                ref={videoRef}
                src={dish.video}
                poster={dish.image}
                muted={muted}
                loop
                playsInline
                preload={active ? "auto" : "metadata"}
                onClick={togglePlayback}
                onTimeUpdate={(event) => {
                  const video = event.currentTarget;

                  if (video.duration) {
                    setProgress((video.currentTime / video.duration) * 100);
                  }
                }}
              />

              <div className="fs-video-overlay" />

              <div className="fs-creator">
                <img src={dish.image} alt="" />

                <div>
                  <strong>{dish.username}</strong>
                  <span>{dish.location}</span>
                </div>

                <button
                  type="button"
                  className={following ? "active" : ""}
                  onClick={() => setFollowing((value) => !value)}
                >
                  {following ? "Following" : "Follow"}
                </button>

                <span className="fs-grid-icon">
                  <Icon name="grid" size={15} />
                </span>
              </div>

              {!playing && (
                <button
                  type="button"
                  className="fs-play"
                  onClick={togglePlayback}
                  aria-label="Play"
                >
                  ▶
                </button>
              )}

              <div className="fs-reel-actions">
                <button
                  type="button"
                  className={liked ? "active" : ""}
                  onClick={() => setLiked((value) => !value)}
                >
                  <span>
                    <Icon name="heart" size={20} filled={liked} />
                  </span>
                  <b>{dish.likes}</b>
                </button>

                <button type="button" onClick={openComments}>
                  <span>
                    <Icon name="comment" size={20} />
                  </span>
                  <b>{dish.comments}</b>
                </button>

                <button
                  type="button"
                  className={saved ? "active" : ""}
                  onClick={() => setSaved((value) => !value)}
                >
                  <span>
                    <Icon name="bookmark" size={19} filled={saved} />
                  </span>
                  <b>{dish.saves}</b>
                </button>

                <button type="button" onClick={shareDish}>
                  <span>
                    <Icon name="share" size={19} />
                  </span>
                  <b>Share</b>
                </button>
              </div>

              <div className="fs-video-copy">
                <strong>{dish.title} 🍝</strong>
                <p>{dish.caption}</p>

                <div>
                  {dish.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className="fs-video-controls">
                <button
                  type="button"
                  onClick={() => setMuted((value) => !value)}
                >
                  <Icon name={muted ? "muted" : "volume"} size={15} />
                </button>

                <small>0:08 / 0:15</small>

                <div className="fs-progress">
                  <span style={{ width: `${progress}%` }} />
                </div>

                <button
                  type="button"
                  onClick={() => videoRef.current?.requestFullscreen?.()}
                >
                  <Icon name="fullscreen" size={15} />
                </button>
              </div>
            </div>

            {commentsOpen && (
              <div className="fs-comments-backdrop" onClick={closeComments}>
                <section
                  className="fs-comments-panel"
                  onClick={(event) => event.stopPropagation()}
                >
                  <header>
                    <h3>Comments</h3>
                    <button type="button" onClick={closeComments}>
                      ×
                    </button>
                  </header>

                  <div className="fs-drawer-comments">
                    {comments.map((comment) => (
                      <article key={comment.id}>
                        {comment.image ? (
                          <img src={comment.image} alt="" />
                        ) : (
                          <span className="fs-avatar">Y</span>
                        )}

                        <div>
                          <strong>{comment.name}</strong>
                          <small>{comment.time}</small>
                          <p>{comment.text}</p>
                          <button type="button">Reply</button>
                        </div>

                        <span>♡</span>
                      </article>
                    ))}
                  </div>

                  <form onSubmit={submitComment}>
                    <span className="fs-avatar">Y</span>

                    <input
                      value={commentText}
                      onChange={(event) => setCommentText(event.target.value)}
                      placeholder="Add a comment..."
                      autoFocus
                    />

                    <button type="submit" disabled={!commentText.trim()}>
                      Post
                    </button>
                  </form>
                </section>
              </div>
            )}
          </article>

          <aside className="fs-right-column">
            <section className="fs-product-card">
              <div className="fs-product-top">
                <span>🔥 Trending Today</span>
                <strong>₹{dish.price}</strong>
              </div>

              <h2>{dish.title}</h2>

              <div className="fs-rating">
                <span>☆</span>
                <strong>{dish.rating}</strong>
                <small>({dish.reviews} reviews)</small>
              </div>

              <p className="fs-description">{dish.description}</p>

              <div className="fs-benefits">
                <div>
                  <span className="green">♧</span>
                  <small>MADE</small>
                  <strong>Fresh Daily</strong>
                </div>

                <div>
                  <span className="blue">♢</span>
                  <small>HYGIENIC</small>
                  <strong>Preparation</strong>
                </div>

                <div>
                  <span className="orange">◷</span>
                  <small>DELIVERED</small>
                  <strong>Piping Hot</strong>
                </div>

                <div>
                  <span className="pink">♡</span>
                  <small>LOVED BY</small>
                  <strong>10K+ Foodies</strong>
                </div>
              </div>

              <Link href="/services/swadisht/cart" className="fs-main-order">
                Order Now
                <span>₹{dish.price}</span>
                <Icon name="arrow" size={16} />
              </Link>
            </section>

            <section className="fs-review-card">
              <div className="fs-review-heading">
                <h3>What people are saying</h3>
                <button type="button" onClick={openComments}>
                  See all reviews
                </button>
              </div>

              {INITIAL_COMMENTS.map((comment) => (
                <article key={comment.id}>
                  <img src={comment.image} alt="" />

                  <div>
                    <strong>{comment.name}</strong>
                    <span>☆ ☆ ☆ ☆ ☆</span>
                    <p>{comment.text}</p>
                    <small>♡ {comment.likes}</small>
                  </div>

                  <time>{comment.time}</time>
                </article>
              ))}
            </section>
          </aside>
        </div>

        <section className="fs-more">
          <header>
            <h3>More dishes you’ll love </h3>
            <button
              type="button"
              onClick={() => onSelectDish((index + 1) % DISHES.length)}
            >
              View all
            </button>
          </header>

          <div className="fs-dish-row">
            {suggestions.map((item) => {
              const itemIndex = DISHES.findIndex(
                (dishItem) => dishItem.id === item.id,
              );

              return (
                <button
                  type="button"
                  className="fs-dish-card"
                  key={item.id}
                  onClick={() => onSelectDish(itemIndex)}
                >
                  <div>
                    <img src={item.image} alt={item.title} />
                    <span>▶</span>
                  </div>

                  <h4>{item.title}</h4>

                  <footer>
                    <span>☆ {item.rating}</span>
                    <strong>₹{item.price}</strong>
                  </footer>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}

export default function FoodStoriesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [scrollDirection, setScrollDirection] = useState("next");
  const parentReelLockRef = useRef(false);
  const parentUnlockTimerRef = useRef(null);

  const activeDish = DISHES[activeIndex];

  const selectDish = (index) => {
    setScrollDirection(index >= activeIndex ? "next" : "previous");
    setActiveIndex(index);
    setQuantity(1);
  };

  const changeDish = (direction) => {
    if (parentReelLockRef.current) return;

    parentReelLockRef.current = true;
    setScrollDirection(direction > 0 ? "next" : "previous");

    setActiveIndex((current) => {
      const next = current + direction;

      if (next < 0) {
        return DISHES.length - 1;
      }

      if (next >= DISHES.length) {
        return 0;
      }

      return next;
    });

    setQuantity(1);

    if (parentUnlockTimerRef.current) {
      window.clearTimeout(parentUnlockTimerRef.current);
    }

    parentUnlockTimerRef.current = window.setTimeout(() => {
      parentReelLockRef.current = false;
    }, 900);
  };

  useEffect(() => {
    return () => {
      if (parentUnlockTimerRef.current) {
        window.clearTimeout(parentUnlockTimerRef.current);
      }
    };
  }, []);

  return (
    <main className="fs-page">
      <header className="fs-navbar">
        <div className="fs-navbar-inner">
          <Link href="/services/swadisht" className="fs-brand">
            <img src="/images/swadisht/swadisht_logo.JPG" alt="" />
            <strong>Swadishtt</strong>
          </Link>

          <nav>
            <Link href="/services/swadisht" className="active">
              Discover
            </Link>
            <Link href="/services/swadisht">Meals</Link>
            <Link href="/services/swadisht">Offers</Link>
            <Link href="/services/swadisht/food-stories">Food Stories</Link>
            <Link href="/services/swadisht">Favourites</Link>
          </nav>

          <div className="fs-nav-actions">
            <input type="search" placeholder="Search for dishes, cuisines..." />

            <Link href="/services/swadisht/cart">
              <Icon name="bag" size={17} />
              Cart
            </Link>
          </div>
        </div>
      </header>

      <div className="fs-feed">
        <Story
          key={activeDish.id}
          dish={activeDish}
          index={activeIndex}
          active
          onSelectDish={selectDish}
          onChangeDish={changeDish}
          scrollDirection={scrollDirection}
        />
      </div>

      <footer className="fs-sticky-bar">
        <div className="fs-sticky-product">
          <img src={activeDish.image} alt="" />

          <div>
            <strong>{activeDish.title}</strong>
            <span>Serves 1 • {activeDish.restaurant}</span>
          </div>
        </div>

        <div className="fs-sticky-actions">
          <div>
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            >
              −
            </button>

            <span>{quantity}</span>

            <button
              type="button"
              onClick={() => setQuantity((current) => current + 1)}
            >
              +
            </button>
          </div>

          <Link href="/services/swadisht/cart">
            Order Now
            <span>₹{activeDish.price * quantity}</span>
          </Link>
        </div>
      </footer>

      <style jsx global>{`
        .fs-page,
        .fs-page * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          overflow: hidden;
        }

        .fs-page {
          height: 100dvh;
          overflow: hidden;
          background: #fffdfa;
          color: #121827;
          font-family: Inter, Arial, sans-serif;
        }

        .fs-navbar {
          position: relative;
          z-index: 100;
          height: 48px;
          border-bottom: 1px solid #e6e6e8;
          background: #ffffff;
        }

        .fs-navbar-inner {
          width: min(1280px, calc(100% - 28px));
          height: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
        }

        .fs-brand {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #ed174c;
          text-decoration: none;
        }

        .fs-brand img {
          width: 25px;
          height: 29px;
          object-fit: contain;
        }

        .fs-brand strong {
          font-size: 16px;
        }

        .fs-navbar nav {
          display: flex;
          align-items: center;
          align-self: stretch;
          gap: 24px;
          margin-left: 27px;
        }

        .fs-navbar nav a {
          display: flex;
          align-items: center;
          color: #747b88;
          font-size: 11px;
          font-weight: 500;
          text-decoration: none;
        }

        .fs-navbar nav a.active {
          border-bottom: 2px solid #ed174c;
          color: #ed174c;
        }

        .fs-nav-actions {
          display: flex;
          align-items: center;
          gap: 17px;
          margin-left: auto;
        }

        .fs-nav-actions input {
          width: 220px;
          height: 30px;
          padding: 0 14px;
          border: 0;
          border-radius: 18px;
          outline: none;
          background: #f4f5f7;
          color: #5f6673;
          font-size: 10px;
        }

        .fs-nav-actions a {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #ed174c;
          font-size: 11px;
          font-weight: 700;
          text-decoration: none;
        }

        .fs-feed {
          height: calc(100dvh - 48px);
          overflow-x: hidden;
          overflow-y: auto;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
          overscroll-behavior-y: contain;
          scrollbar-width: none;
        }

        .fs-feed::-webkit-scrollbar {
          display: none;
        }

        .fs-story {
          min-height: 100%;
          padding: 14px 16px 74px;
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        .fs-content {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .fs-heading {
          margin-bottom: 15px;
          text-align: center;
        }

        .fs-heading h1 {
          margin: 0;
          color: #121827;
          font-size: clamp(29px, 3vw, 38px);
          font-weight: 850;
          letter-spacing: -1.8px;
          line-height: 1.05;
        }

        .fs-heading h1 span {
          color: #ed174c;
        }

        .fs-heading p {
          margin: 7px 0 0;
          color: #7c8390;
          font-size: 11px;
        }

        .fs-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(340px, 0.92fr);
          gap: 20px;
          align-items: start;
        }

        .fs-video-card {
          position: relative;
          height: 445px;
          overflow: hidden;
          border-radius: 14px;
          background: #651329;
          color: #ffffff;
          box-shadow: 0 13px 30px rgba(43, 22, 27, 0.18);
        }

        .fs-video-card video {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .fs-video-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            rgba(28, 0, 8, 0.26),
            transparent 34%,
            transparent 55%,
            rgba(112, 0, 32, 0.87)
          );
        }

        .fs-creator {
          position: absolute;
          top: 13px;
          right: 14px;
          left: 14px;
          z-index: 4;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .fs-creator > img {
          width: 31px;
          height: 31px;
          object-fit: cover;
          border: 2px solid #ffffff;
          border-radius: 50%;
        }

        .fs-creator > div {
          display: grid;
        }

        .fs-creator strong {
          font-size: 10px;
        }

        .fs-creator span {
          margin-top: 2px;
          color: rgba(255, 255, 255, 0.82);
          font-size: 8px;
        }

        .fs-creator button {
          margin-left: auto;
          padding: 6px 14px;
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.17);
          color: #ffffff;
          cursor: pointer;
          font-size: 9px;
          font-weight: 700;
        }

        .fs-creator button.active {
          background: #ffffff;
          color: #ed174c;
        }

        .fs-grid-icon {
          display: grid;
          place-items: center;
          color: #ffffff;
        }

        .fs-play {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 6;
          width: 50px;
          height: 50px;
          border: 1px solid rgba(255, 255, 255, 0.65);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.22);
          color: #ffffff;
          cursor: pointer;
        }

        .fs-reel-actions {
          position: absolute;
          right: 12px;
          bottom: 82px;
          z-index: 5;
          display: grid;
          gap: 8px;
        }

        .fs-reel-actions button {
          display: grid;
          justify-items: center;
          gap: 2px;
          padding: 0;
          border: 0;
          background: transparent;
          color: #ffffff;
          cursor: pointer;
        }

        .fs-reel-actions button > span {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #ffffff;
          color: #2e2930;
          box-shadow: 0 3px 9px rgba(0, 0, 0, 0.2);
        }

        .fs-reel-actions button.active > span {
          color: #ed174c;
        }

        .fs-reel-actions b {
          color: #ffffff;
          font-size: 8px;
        }

        .fs-video-copy {
          position: absolute;
          right: 70px;
          bottom: 59px;
          left: 14px;
          z-index: 5;
        }

        .fs-video-copy > strong {
          display: inline-flex;
          padding: 6px 10px;
          border-radius: 15px;
          background: rgba(219, 18, 71, 0.88);
          font-size: 9px;
        }

        .fs-video-copy p {
          margin: 6px 0;
          font-size: 9px;
        }

        .fs-video-copy > div {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .fs-video-copy > div span {
          padding: 3px 7px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.14);
          font-size: 7px;
        }

        .fs-video-controls {
          position: absolute;
          right: 13px;
          bottom: 12px;
          left: 13px;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 9px;
          border-radius: 7px;
          background: rgba(177, 8, 53, 0.62);
        }

        .fs-video-controls button {
          display: grid;
          place-items: center;
          padding: 0;
          border: 0;
          background: transparent;
          color: #ffffff;
          cursor: pointer;
        }

        .fs-video-controls small {
          flex: none;
          font-size: 8px;
        }

        .fs-progress {
          height: 3px;
          flex: 1;
          overflow: hidden;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.28);
        }

        .fs-progress span {
          display: block;
          height: 100%;
          background: #ff365f;
        }

        .fs-right-column {
          display: grid;
          gap: 13px;
        }

        .fs-product-card,
        .fs-review-card {
          border: 1px solid #e1e3e7;
          border-radius: 13px;
          background: #ffffff;
          box-shadow: 0 3px 9px rgba(30, 27, 31, 0.05);
        }

        .fs-product-card {
          height: 253px;
          padding: 15px;
        }

        .fs-product-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .fs-product-top > span {
          padding: 5px 9px;
          border: 1px solid #f4d8af;
          border-radius: 14px;
          background: #fffaf0;
          color: #c97913;
          font-size: 8px;
          font-weight: 700;
        }

        .fs-product-top > strong {
          color: #ed174c;
          font-size: 19px;
        }

        .fs-product-card h2 {
          margin: 8px 0 3px;
          font-size: 18px;
          line-height: 1.15;
        }

        .fs-rating {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .fs-rating > span {
          color: #f2ad00;
          font-size: 14px;
        }

        .fs-rating strong {
          font-size: 9px;
        }

        .fs-rating small {
          color: #989eaa;
          font-size: 8px;
        }

        .fs-description {
          height: 35px;
          margin: 10px 0;
          overflow: hidden;
          color: #717986;
          font-size: 9px;
          line-height: 1.45;
        }

        .fs-benefits {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          padding: 9px 11px;
          border: 1px solid #ebecf0;
          border-radius: 9px;
          background: #fafafa;
        }

        .fs-benefits > div {
          display: grid;
          grid-template-columns: 21px 1fr;
          grid-template-rows: auto auto;
          align-items: center;
        }

        .fs-benefits > div > span {
          grid-row: 1 / 3;
          font-size: 15px;
        }

        .fs-benefits small {
          color: #989eaa;
          font-size: 6px;
        }

        .fs-benefits strong {
          font-size: 8px;
        }

        .fs-benefits .green {
          color: #12b86a;
        }

        .fs-benefits .blue {
          color: #397cff;
        }

        .fs-benefits .orange {
          color: #ff9417;
        }

        .fs-benefits .pink {
          color: #ed174c;
        }

        .fs-main-order {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 37px;
          margin-top: 10px;
          border-radius: 8px;
          background: #ed174c;
          color: #ffffff;
          box-shadow: 0 5px 12px rgba(237, 23, 76, 0.22);
          font-size: 10px;
          font-weight: 750;
          text-decoration: none;
        }

        .fs-main-order span {
          padding-left: 8px;
          border-left: 1px solid rgba(255, 255, 255, 0.4);
        }

        .fs-review-card {
          height: 179px;
          padding: 11px 15px;
          overflow: hidden;
        }

        .fs-review-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 3px;
        }

        .fs-review-heading h3 {
          margin: 0;
          font-size: 11px;
        }

        .fs-review-heading button {
          border: 0;
          background: transparent;
          color: #ed174c;
          cursor: pointer;
          font-size: 7px;
          font-weight: 700;
        }

        .fs-review-card article {
          display: grid;
          grid-template-columns: 25px 1fr auto;
          gap: 7px;
          padding: 6px 0;
          border-bottom: 1px solid #eeeeef;
        }

        .fs-review-card article:last-child {
          border-bottom: 0;
        }

        .fs-review-card article img {
          width: 25px;
          height: 25px;
          object-fit: cover;
          border-radius: 50%;
        }

        .fs-review-card article > div {
          min-width: 0;
        }

        .fs-review-card article strong {
          display: block;
          font-size: 7px;
        }

        .fs-review-card article div > span {
          display: block;
          color: #f2ad00;
          font-size: 6px;
        }

        .fs-review-card article p {
          margin: 2px 0;
          overflow: hidden;
          color: #7b818c;
          font-size: 6.5px;
          line-height: 1.3;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .fs-review-card article small {
          color: #df4970;
          font-size: 6px;
        }

        .fs-review-card article time {
          color: #a1a6b0;
          font-size: 5.5px;
          white-space: nowrap;
        }

        .fs-more {
          margin-top: 18px;
        }

        .fs-more > header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 9px;
        }

        .fs-more h3 {
          margin: 0;
          font-size: 13px;
        }

        .fs-more header button {
          border: 0;
          background: transparent;
          color: #ed174c;
          cursor: pointer;
          font-size: 8px;
          font-weight: 700;
        }

        .fs-dish-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .fs-dish-card {
          overflow: hidden;
          padding: 0;
          border: 1px solid #e1e3e6;
          border-radius: 11px;
          background: #ffffff;
          color: #161a23;
          cursor: pointer;
          text-align: left;
        }

        .fs-dish-card > div {
          position: relative;
          height: 88px;
          overflow: hidden;
        }

        .fs-dish-card img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .fs-dish-card > div span {
          position: absolute;
          top: 50%;
          left: 50%;
          display: grid;
          place-items: center;
          width: 25px;
          height: 25px;
          border: 2px solid #ed174c;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: #ffffff;
          color: #ed174c;
          font-size: 8px;
        }

        .fs-dish-card h4 {
          margin: 7px 9px 4px;
          overflow: hidden;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .fs-dish-card footer {
          display: flex;
          justify-content: space-between;
          padding: 0 9px 7px;
          font-size: 7px;
        }

        .fs-dish-card footer strong {
          color: #ed174c;
        }

        .fs-sticky-bar {
          position: fixed;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 200;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px max(16px, calc((100% - 1180px) / 2));
          border-top: 1px solid #e5e6e8;
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 -5px 16px rgba(31, 26, 28, 0.07);
          backdrop-filter: blur(12px);
        }

        .fs-sticky-product {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .fs-sticky-product img {
          width: 38px;
          height: 38px;
          object-fit: cover;
          border-radius: 7px;
        }

        .fs-sticky-product > div {
          display: grid;
          gap: 2px;
        }

        .fs-sticky-product strong {
          font-size: 9px;
        }

        .fs-sticky-product span {
          color: #8c929d;
          font-size: 7px;
        }

        .fs-sticky-actions {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .fs-sticky-actions > div {
          display: flex;
          align-items: center;
          gap: 11px;
          height: 38px;
          padding: 0 12px;
          border-radius: 8px;
          background: #f3f4f6;
        }

        .fs-sticky-actions button {
          border: 0;
          background: transparent;
          color: #747b87;
          cursor: pointer;
          font-size: 16px;
        }

        .fs-sticky-actions > div span {
          font-size: 10px;
          font-weight: 700;
        }

        .fs-sticky-actions > a {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 40px;
          min-width: 150px;
          padding: 0 16px;
          border-radius: 8px;
          background: #ed174c;
          color: #ffffff;
          font-size: 10px;
          font-weight: 750;
          text-decoration: none;
        }

        .fs-sticky-actions > a span {
          padding-left: 10px;
          border-left: 1px solid rgba(255, 255, 255, 0.4);
        }

        .fs-comments-backdrop {
          position: absolute;
          inset: 0;
          z-index: 30;
          display: flex;
          justify-content: flex-end;
          background: rgba(15, 9, 11, 0.46);
          backdrop-filter: blur(3px);
        }

        .fs-comments-panel {
          width: min(350px, 88%);
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          color: #171923;
          box-shadow: -14px 0 30px rgba(0, 0, 0, 0.22);
        }

        .fs-comments-panel > header {
          height: 52px;
          flex: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          border-bottom: 1px solid #e9eaed;
        }

        .fs-comments-panel h3 {
          margin: 0;
          font-size: 14px;
        }

        .fs-comments-panel > header button {
          width: 29px;
          height: 29px;
          border: 0;
          border-radius: 50%;
          background: #f3f4f5;
          cursor: pointer;
          font-size: 20px;
        }

        .fs-drawer-comments {
          flex: 1;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 4px 14px;
        }

        .fs-drawer-comments article {
          display: grid;
          grid-template-columns: 31px 1fr 20px;
          gap: 8px;
          padding: 11px 0;
          border-bottom: 1px solid #ededee;
        }

        .fs-drawer-comments img,
        .fs-avatar {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          object-fit: cover;
          border-radius: 50%;
        }

        .fs-avatar {
          background: linear-gradient(135deg, #f5ccd9, #ed174c);
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
        }

        .fs-drawer-comments article div {
          min-width: 0;
        }

        .fs-drawer-comments article strong {
          margin-right: 6px;
          font-size: 9px;
        }

        .fs-drawer-comments article small {
          color: #9a9ea8;
          font-size: 7px;
        }

        .fs-drawer-comments article p {
          margin: 4px 0;
          color: #626873;
          font-size: 9px;
          line-height: 1.4;
        }

        .fs-drawer-comments article button {
          padding: 0;
          border: 0;
          background: transparent;
          color: #9297a1;
          cursor: pointer;
          font-size: 7px;
        }

        .fs-comments-panel form {
          flex: none;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-top: 1px solid #e8e9eb;
        }

        .fs-comments-panel form input {
          min-width: 0;
          height: 34px;
          flex: 1;
          padding: 0 11px;
          border: 1px solid #dedfe3;
          border-radius: 18px;
          outline: none;
          background: #f7f7f8;
          font-size: 9px;
        }

        .fs-comments-panel form input:focus {
          border-color: #ed174c;
        }

        .fs-comments-panel form button {
          border: 0;
          background: transparent;
          color: #ed174c;
          cursor: pointer;
          font-size: 9px;
          font-weight: 700;
        }

        .fs-comments-panel form button:disabled {
          color: #b7bac1;
        }

        @media (max-width: 850px) {
          .fs-navbar {
            height: 50px;
          }

          .fs-navbar-inner {
            width: calc(100% - 24px);
          }

          .fs-navbar nav,
          .fs-nav-actions input {
            display: none;
          }

          .fs-nav-actions {
            margin-left: auto;
          }

          .fs-feed {
            height: calc(100dvh - 50px);
          }

          .fs-story {
            min-height: 100%;
            padding: 14px 12px 83px;
          }

          .fs-content {
            width: 100%;
          }

          .fs-heading h1 {
            font-size: 27px;
          }

          .fs-main-grid {
            display: block;
          }

          .fs-video-card {
            height: min(61svh, 520px);
            min-height: 450px;
          }

          .fs-right-column {
            margin-top: 13px;
          }

          .fs-product-card {
            height: auto;
          }

          .fs-description {
            height: auto;
          }

          .fs-review-card {
            height: 220px;
          }

          .fs-more {
            margin-top: 17px;
          }

          .fs-dish-row {
            display: flex;
            gap: 11px;
            overflow-x: auto;
            padding-bottom: 8px;
            scrollbar-width: none;
          }

          .fs-dish-row::-webkit-scrollbar {
            display: none;
          }

          .fs-dish-card {
            flex: 0 0 70%;
          }

          .fs-sticky-bar {
            padding: 6px 10px;
          }

          .fs-sticky-product > div {
            display: none;
          }

          .fs-sticky-actions {
            flex: 1;
            justify-content: flex-end;
          }

          .fs-sticky-actions > a {
            min-width: 115px;
            padding: 0 11px;
          }

          .fs-comments-panel {
            width: 100%;
          }
        }

        /* ===== FINAL DESKTOP FIT OVERRIDE ===== */

        @media (min-width: 851px) {
          .fs-story {
            padding: 9px 16px 62px !important;
          }

          .fs-content {
            width: min(1320px, calc(100% - 32px)) !important;
          }

          .fs-heading {
            margin-bottom: 12px !important;
          }

          .fs-heading h1 {
            font-size: 32px !important;
            line-height: 1 !important;
          }

          .fs-heading p {
            margin-top: 6px !important;
            font-size: 10px !important;
          }

          /* Video becomes narrower; right column gets more width */
          .fs-main-grid {
            --stage-height: clamp(360px, 52dvh, 408px);

            grid-template-columns:
              minmax(0, 1.18fr)
              minmax(390px, 0.92fr) !important;

            gap: 18px !important;
            align-items: start !important;
          }

          .fs-video-card {
            width: 100% !important;
            height: var(--stage-height) !important;
            min-height: 0 !important;
          }

          /* Both boxes must fit within the video's height */
          .fs-right-column {
            height: var(--stage-height) !important;
            min-height: 0 !important;
            display: grid !important;
            grid-template-rows:
              minmax(0, 1.45fr)
              minmax(0, 1fr) !important;

            gap: 12px !important;
          }

          .fs-product-card,
          .fs-review-card {
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: hidden !important;
          }

          /* Keep the order button inside the first box */
          .fs-product-card {
            display: flex !important;
            flex-direction: column !important;
            padding: 12px 14px !important;
          }

          .fs-product-card h2 {
            margin: 6px 0 2px !important;
            font-size: 17px !important;
            line-height: 1.1 !important;
          }

          .fs-product-top > span {
            padding: 4px 8px !important;
            font-size: 7px !important;
          }

          .fs-product-top > strong {
            font-size: 17px !important;
          }

          .fs-rating {
            line-height: 1 !important;
          }

          .fs-description {
            height: auto !important;
            margin: 7px 0 !important;
            display: -webkit-box;
            overflow: hidden !important;
            font-size: 8px !important;
            line-height: 1.35 !important;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .fs-benefits {
            gap: 5px 8px !important;
            padding: 7px 9px !important;
          }

          .fs-benefits > div > span {
            font-size: 13px !important;
          }

          .fs-benefits small {
            font-size: 5.5px !important;
          }

          .fs-benefits strong {
            font-size: 7px !important;
          }

          .fs-main-order {
            height: 32px !important;
            min-height: 32px !important;
            margin-top: auto !important;
            font-size: 9px !important;
          }

          /* Compact review box */
          .fs-review-card {
            padding: 8px 13px !important;
            overflow-y: auto !important;
            scrollbar-width: none;
          }

          .fs-review-card::-webkit-scrollbar {
            display: none;
          }

          .fs-review-heading {
            margin-bottom: 1px !important;
          }

          .fs-review-heading h3 {
            font-size: 10px !important;
          }

          .fs-review-card article {
            gap: 6px !important;
            padding: 4px 0 !important;
          }

          .fs-review-card article img {
            width: 22px !important;
            height: 22px !important;
          }

          .fs-review-card article strong {
            font-size: 6.5px !important;
          }

          .fs-review-card article p {
            margin: 1px 0 !important;
            font-size: 6px !important;
            line-height: 1.2 !important;
          }

          .fs-review-card article time,
          .fs-review-card article small {
            font-size: 5px !important;
          }

          /* Make recommendation cards fit underneath */
          .fs-more {
            margin-top: 12px !important;
          }

          .fs-more > header {
            margin-bottom: 6px !important;
          }

          .fs-more h3 {
            font-size: 12px !important;
          }

          .fs-dish-row {
            gap: 12px !important;
          }

          .fs-dish-card > div {
            height: 70px !important;
          }

          .fs-dish-card h4 {
            margin: 5px 8px 3px !important;
            font-size: 8px !important;
          }

          .fs-dish-card footer {
            padding: 0 8px 5px !important;
            font-size: 6.5px !important;
          }
        }

        /* ===== FONT SIZE + SCROLLABLE RIGHT COLUMN ===== */

        @media (min-width: 851px) {
          /* Keep the right-side cards inside the available height */
          .fs-right-column {
            height: var(--stage-height) !important;
            min-height: 0 !important;

            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;

            overflow-x: hidden !important;
            overflow-y: auto !important;
            overscroll-behavior: contain;

            padding-right: 5px !important;

            scrollbar-width: thin;
            scrollbar-color: rgba(237, 23, 76, 0.45) transparent;
          }

          .fs-right-column::-webkit-scrollbar {
            width: 4px;
          }

          .fs-right-column::-webkit-scrollbar-track {
            background: transparent;
          }

          .fs-right-column::-webkit-scrollbar-thumb {
            border-radius: 20px;
            background: rgba(237, 23, 76, 0.45);
          }

          /* Let both cards use their actual content height */
          .fs-product-card,
          .fs-review-card {
            width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            flex: 0 0 auto !important;
            overflow: visible !important;
          }

          .fs-product-card {
            padding: 14px 15px !important;
          }

          .fs-review-card {
            padding: 11px 14px !important;
          }

          /* Slight overall font increase */
          .fs-navbar nav a,
          .fs-nav-actions a {
            font-size: 12px !important;
          }

          .fs-nav-actions input {
            font-size: 11px !important;
          }

          .fs-heading h1 {
            font-size: 34px !important;
          }

          .fs-heading p {
            font-size: 11.5px !important;
          }

          .fs-creator strong {
            font-size: 11px !important;
          }

          .fs-creator span {
            font-size: 8.5px !important;
          }

          .fs-creator button {
            font-size: 9.5px !important;
          }

          .fs-video-copy > strong {
            font-size: 10px !important;
          }

          .fs-video-copy p {
            font-size: 9.5px !important;
          }

          .fs-video-copy > div span {
            font-size: 7.5px !important;
          }

          .fs-product-top > span {
            font-size: 8px !important;
          }

          .fs-product-top > strong {
            font-size: 18px !important;
          }

          .fs-product-card h2 {
            font-size: 19px !important;
          }

          .fs-rating strong {
            font-size: 10px !important;
          }

          .fs-rating small {
            font-size: 8.5px !important;
          }

          .fs-description {
            height: auto !important;
            font-size: 9.5px !important;
            line-height: 1.4 !important;
          }

          .fs-benefits small {
            font-size: 6.5px !important;
          }

          .fs-benefits strong {
            font-size: 7.5px !important;
          }

          .fs-main-order {
            min-height: 34px !important;
            height: 34px !important;
            margin-top: 10px !important;
            font-size: 10px !important;
          }

          .fs-review-heading h3 {
            font-size: 11.5px !important;
          }

          .fs-review-heading button {
            font-size: 7.5px !important;
          }

          .fs-review-card article {
            padding: 6px 0 !important;
          }

          .fs-review-card article img {
            width: 26px !important;
            height: 26px !important;
          }

          .fs-review-card article strong {
            font-size: 8px !important;
          }

          .fs-review-card article div > span {
            font-size: 7px !important;
          }

          .fs-review-card article p {
            margin: 2px 0 !important;
            font-size: 7px !important;
            line-height: 1.35 !important;
          }

          .fs-review-card article small,
          .fs-review-card article time {
            font-size: 6px !important;
          }

          .fs-more h3 {
            font-size: 13px !important;
          }

          .fs-more header button {
            font-size: 8.5px !important;
          }

          .fs-dish-card h4 {
            font-size: 9px !important;
          }

          .fs-dish-card footer {
            font-size: 7px !important;
          }

          .fs-sticky-product strong {
            font-size: 10px !important;
          }

          .fs-sticky-product span {
            font-size: 8px !important;
          }
        }

        /* ===== LARGER RIGHT-COLUMN TEXT ===== */

        @media (min-width: 851px) {
          .fs-product-top > span {
            font-size: 10px !important;
          }

          .fs-product-top > strong {
            font-size: 22px !important;
          }

          .fs-product-card h2 {
            font-size: 22px !important;
            line-height: 1.15 !important;
          }

          .fs-rating > span {
            font-size: 16px !important;
          }

          .fs-rating strong {
            font-size: 12px !important;
          }

          .fs-rating small {
            font-size: 10px !important;
          }

          .fs-description {
            font-size: 11px !important;
            line-height: 1.45 !important;
          }

          .fs-benefits small {
            font-size: 7.5px !important;
          }

          .fs-benefits strong {
            font-size: 9px !important;
          }

          .fs-benefits > div > span {
            font-size: 15px !important;
          }

          .fs-main-order {
            font-size: 11.5px !important;
          }

          .fs-review-heading h3 {
            font-size: 14px !important;
          }

          .fs-review-heading button {
            font-size: 9px !important;
          }

          .fs-review-card article strong {
            font-size: 10.5px !important;
          }

          .fs-review-card article div > span {
            font-size: 8.5px !important;
          }

          .fs-review-card article p {
            font-size: 9px !important;
            line-height: 1.4 !important;
          }

          .fs-review-card article small {
            font-size: 8px !important;
          }

          .fs-review-card article time {
            font-size: 7.5px !important;
          }
        }

        /* Slightly larger review text */
        .fs-review-heading h3 {
          font-size: 15px !important;
        }

        .fs-review-heading button {
          font-size: 9.5px !important;
        }

        .fs-review-card article strong {
          font-size: 11.5px !important;
        }

        .fs-review-card article div > span {
          font-size: 9px !important;
        }

        .fs-review-card article p {
          font-size: 10px !important;
          line-height: 1.45 !important;
        }

        .fs-review-card article small {
          font-size: 8.5px !important;
        }

        .fs-review-card article time {
          font-size: 8px !important;
        }

        /* ===== VISIBLE COMMENT DRAWER TEXT ===== */

        .fs-comments-panel > header h3 {
          font-size: 18px !important;
        }

        .fs-drawer-comments article strong {
          font-size: 14px !important;
          font-weight: 700 !important;
        }

        .fs-drawer-comments article small {
          font-size: 10.5px !important;
        }

        .fs-drawer-comments article p {
          margin: 7px 0 !important;
          font-size: 13px !important;
          line-height: 1.5 !important;
        }

        .fs-drawer-comments article button {
          font-size: 11px !important;
        }

        .fs-drawer-comments article > span:last-child {
          font-size: 22px !important;
        }

        .fs-comments-panel form input {
          font-size: 13px !important;
        }

        .fs-comments-panel form button {
          font-size: 12px !important;
        }
        /* ===== CLEAR, READABLE COMMENT TEXT ===== */

        .fs-review-heading h3,
        .fs-comments-panel > header h3 {
          font-size: 20px !important;
        }

        .fs-review-heading button {
          font-size: 12px !important;
        }

        /* User names */
        .fs-review-card article strong,
        .fs-drawer-comments article strong {
          font-size: 16px !important;
          font-weight: 750 !important;
        }

        /* Comment time */
        .fs-review-card article time,
        .fs-drawer-comments article small {
          font-size: 11px !important;
        }

        /* Star rating */
        .fs-review-card article div > span {
          font-size: 13px !important;
        }

        /* Main comment text */
        .fs-review-card article p,
        .fs-drawer-comments article p {
          margin: 7px 0 !important;
          font-size: 15px !important;
          line-height: 1.5 !important;
        }

        /* Like count and Reply */
        .fs-review-card article small,
        .fs-drawer-comments article button {
          font-size: 12px !important;
        }

        /* Profile photos */
        .fs-review-card article img,
        .fs-drawer-comments article img,
        .fs-drawer-comments .fs-avatar {
          width: 40px !important;
          height: 40px !important;
        }

        /* More breathing space between comments */
        .fs-review-card article,
        .fs-drawer-comments article {
          padding: 14px 0 !important;
          gap: 12px !important;
        }

        /* ===== BALANCED COMMENT TEXT SIZE ===== */

        .fs-review-heading h3,
        .fs-comments-panel > header h3 {
          font-size: 16px !important;
        }

        .fs-review-heading button {
          font-size: 10px !important;
        }

        .fs-review-card article strong,
        .fs-drawer-comments article strong {
          font-size: 13px !important;
          font-weight: 700 !important;
        }

        .fs-review-card article time,
        .fs-drawer-comments article small {
          font-size: 9px !important;
        }

        .fs-review-card article div > span {
          font-size: 10px !important;
        }

        .fs-review-card article p,
        .fs-drawer-comments article p {
          margin: 5px 0 !important;
          font-size: 12px !important;
          line-height: 1.4 !important;
        }

        .fs-review-card article small,
        .fs-drawer-comments article button {
          font-size: 9.5px !important;
        }

        .fs-review-card article img,
        .fs-drawer-comments article img,
        .fs-drawer-comments .fs-avatar {
          width: 32px !important;
          height: 32px !important;
        }

        .fs-review-card article,
        .fs-drawer-comments article {
          padding: 9px 0 !important;
          gap: 9px !important;
        }

        /* ===== RECOMMENDATION CARDS — TARGET DESIGN ===== */

        @media (min-width: 851px) {
          .fs-more {
            position: relative;
            width: min(1180px, 100%) !important;
            margin: 24px auto 0 !important;
          }

          .fs-more > header {
            margin-bottom: 20px !important;
          }

          .fs-more h3 {
            margin: 0 !important;
            font-size: 19px !important;
            font-weight: 800 !important;
            letter-spacing: -0.3px !important;
          }

          .fs-more header button {
            font-size: 12px !important;
            font-weight: 700 !important;
          }

          .fs-dish-row {
            display: grid !important;
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            gap: 22px !important;
          }

          .fs-dish-card {
            width: 100% !important;
            overflow: hidden !important;
            border: 1px solid #dfe1e5 !important;
            border-radius: 15px !important;
            background: #ffffff !important;
            box-shadow: 0 2px 8px rgba(25, 27, 35, 0.04) !important;
          }

          .fs-dish-card > div {
            position: relative !important;
            width: 100% !important;
            height: 146px !important;
            overflow: hidden !important;
          }

          .fs-dish-card img {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
            object-fit: cover !important;
            object-position: center !important;
          }

          .fs-dish-card > div span {
            width: 34px !important;
            height: 34px !important;
            border: 2px solid #ed174c !important;
            border-radius: 50% !important;
            background: rgba(255, 255, 255, 0.94) !important;
            color: #ed174c !important;
            font-size: 11px !important;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12) !important;
          }

          .fs-dish-card h4 {
            margin: 14px 14px 9px !important;
            overflow: hidden !important;
            color: #161a25 !important;
            font-size: 13px !important;
            font-weight: 750 !important;
            line-height: 1.2 !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
          }

          .fs-dish-card footer {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 0 14px 14px !important;
            font-size: 11px !important;
          }

          .fs-dish-card footer span {
            color: #323846 !important;
            font-weight: 650 !important;
          }

          .fs-dish-card footer span::first-letter {
            color: #f5b400 !important;
          }

          .fs-dish-card footer strong {
            color: #ed174c !important;
            font-size: 12px !important;
            font-weight: 750 !important;
          }

          /* White circular carousel arrow */
          .fs-more::after {
            content: "›";
            position: absolute;
            top: 132px;
            right: -17px;
            z-index: 5;

            display: grid;
            place-items: center;

            width: 38px;
            height: 38px;

            border: 1px solid #dfe1e5;
            border-radius: 50%;

            background: #ffffff;
            color: #737985;

            box-shadow: 0 3px 10px rgba(25, 27, 35, 0.12);

            font-size: 23px;
            line-height: 1;

            pointer-events: none;
          }
        }

        /* Only the video changes like an Instagram reel */
        @media (min-width: 851px) {
          .fs-feed {
            height: calc(100dvh - 48px) !important;
            overflow: hidden !important;
            scroll-snap-type: none !important;
          }

          .fs-story {
            min-height: 0 !important;
            height: 100% !important;
            overflow: hidden !important;
            scroll-snap-align: none !important;
          }

          .fs-video-card {
            overscroll-behavior: contain;
            touch-action: pan-y;
          }
        }

        /* ===== VIDEO-ONLY INSTAGRAM REEL ANIMATION ===== */

        .fs-video-card {
          position: relative;
          overflow: hidden !important;
          isolation: isolate;
          background: #651329;
        }

        .fs-reel-frame {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: inherit;
          will-change: transform, opacity;
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
        }

        .fs-reel-enter-next {
          animation: fsReelEnterNext 460ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .fs-reel-enter-previous {
          animation: fsReelEnterPrevious 460ms cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        @keyframes fsReelEnterNext {
          from {
            opacity: 0.82;
            transform: translate3d(0, 100%, 0);
          }

          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes fsReelEnterPrevious {
          from {
            opacity: 0.82;
            transform: translate3d(0, -100%, 0);
          }

          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .fs-right-column {
          animation: fsDetailsRefresh 220ms ease both;
        }

        @keyframes fsDetailsRefresh {
          from {
            opacity: 0.76;
          }

          to {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fs-reel-enter-next,
          .fs-reel-enter-previous,
          .fs-right-column {
            animation: none !important;
          }
        }

        /* ===== KEEP RECOMMENDATIONS ABOVE THE FIXED ORDER BAR ===== */

        @media (min-width: 851px) {
          .fs-feed {
            height: calc(100dvh - 48px - 58px) !important;
          }

          .fs-story {
            padding-bottom: 10px !important;
          }
        }

        /* Compact layout for shorter laptop screens */
        @media (min-width: 851px) and (max-height: 820px) {
          .fs-heading {
            margin-bottom: 8px !important;
          }

          .fs-heading h1 {
            font-size: 30px !important;
          }

          .fs-heading p {
            margin-top: 4px !important;
          }

          .fs-main-grid {
            --stage-height: clamp(315px, 43dvh, 350px) !important;
          }

          .fs-more {
            margin-top: 10px !important;
          }

          .fs-more > header {
            margin-bottom: 7px !important;
          }

          .fs-dish-card > div {
            height: 92px !important;
          }

          .fs-dish-card h4 {
            margin: 7px 10px 4px !important;
            font-size: 10px !important;
          }

          .fs-dish-card footer {
            padding: 0 10px 7px !important;
            font-size: 8px !important;
          }

          .fs-more::after {
            top: 82px !important;
          }
        }
      `}</style>
    </main>
  );
}