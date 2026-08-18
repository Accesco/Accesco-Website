"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSwadishtt } from "../contexts/SwadishttContext";
import SwadishttHeader from "../components/SwadishttHeader";
import styles from "./swipe-eat.module.css";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";

const DISH_CARDS = [
  {
    id: "se-1",
    sku: "SWD-SE-BTCK-01",
    name: "Butter Chicken",
    restaurant: "Punjabi Tadka",
    rating: 4.8,
    price: 350,
    calories: 480,
    cuisine: "North Indian",
    mood: ["Comfort", "Rich"],
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=500&fit=crop",
    isVeg: false,
    tags: ["Bestseller", "Spicy"],
    deliveryTime: "30 mins",
  },
  {
    id: "se-2",
    sku: "SWD-SE-MLDS-02",
    name: "Masala Dosa",
    restaurant: "South Spice",
    rating: 4.6,
    price: 120,
    calories: 280,
    cuisine: "South Indian",
    mood: ["Light", "Crispy"],
    image:
      "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=500&fit=crop",
    isVeg: true,
    tags: ["Classic"],
    deliveryTime: "20 mins",
  },
  {
    id: "se-3",
    sku: "SWD-SE-HYDBY-03",
    name: "Hyderabadi Biryani",
    restaurant: "Dum Pukht",
    rating: 4.9,
    price: 420,
    calories: 620,
    cuisine: "Mughlai",
    mood: ["Festive", "Rich"],
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=500&fit=crop",
    isVeg: false,
    tags: ["Bestseller"],
    deliveryTime: "45 mins",
  },
  {
    id: "se-4",
    sku: "SWD-SE-PNTK-04",
    name: "Paneer Tikka",
    restaurant: "Tandoor House",
    rating: 4.5,
    price: 280,
    calories: 320,
    cuisine: "North Indian",
    mood: ["Snack", "Smoky"],
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&h=500&fit=crop",
    isVeg: true,
    tags: ["Starter"],
    deliveryTime: "25 mins",
  },
  {
    id: "se-5",
    sku: "SWD-SE-CHBH-05",
    name: "Chole Bhature",
    restaurant: "Amritsari Dhaba",
    rating: 4.7,
    price: 180,
    calories: 540,
    cuisine: "Punjabi",
    mood: ["Hearty", "Comfort"],
    image:
      "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&h=500&fit=crop",
    isVeg: true,
    tags: ["Classic", "Filling"],
    deliveryTime: "30 mins",
  },
  {
    id: "se-6",
    sku: "SWD-SE-MLFC-06",
    name: "Malabar Fish Curry",
    restaurant: "Coastal Kitchen",
    rating: 4.8,
    price: 360,
    calories: 410,
    cuisine: "South Indian",
    mood: ["Tangy", "Coastal"],
    image:
      "https://images.unsplash.com/photo-1574484284002-952d92a03a52?w=600&h=500&fit=crop",
    isVeg: false,
    tags: ["Authentic", "Spicy"],
    deliveryTime: "35 mins",
  },
  {
    id: "se-7",
    sku: "SWD-SE-DMBR-07",
    name: "Dal Makhani",
    restaurant: "Punjab Grill",
    rating: 4.7,
    price: 220,
    calories: 380,
    cuisine: "North Indian",
    mood: ["Comfort", "Creamy"],
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=500&fit=crop",
    isVeg: true,
    tags: ["Slow-Cooked"],
    deliveryTime: "40 mins",
  },
  {
    id: "se-8",
    sku: "SWD-SE-RGJSH-08",
    name: "Rogan Josh",
    restaurant: "Kashmir Kitchen",
    rating: 4.9,
    price: 420,
    calories: 540,
    cuisine: "Kashmiri",
    mood: ["Rich", "Festive"],
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=500&fit=crop",
    isVeg: false,
    tags: ["Royal"],
    deliveryTime: "50 mins",
  },
  {
    id: "se-9",
    sku: "SWD-SE-PLPNR-09",
    name: "Palak Paneer",
    restaurant: "Shree Thali",
    rating: 4.5,
    price: 240,
    calories: 310,
    cuisine: "North Indian",
    mood: ["Healthy", "Comfort"],
    image:
      "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600&h=500&fit=crop",
    isVeg: true,
    tags: ["Healthy"],
    deliveryTime: "28 mins",
  },
  {
    id: "se-10",
    sku: "SWD-SE-VDABY-10",
    name: "Vada Pav",
    restaurant: "Mumbai Street",
    rating: 4.4,
    price: 60,
    calories: 280,
    cuisine: "Mumbai Street",
    mood: ["Snack", "Tangy"],
    image:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=500&fit=crop",
    isVeg: true,
    tags: ["Street Food"],
    deliveryTime: "15 mins",
  },
  {
    id: "se-11",
    sku: "SWD-SE-CHKN65-11",
    name: "Chicken 65",
    restaurant: "Andhra Spice",
    rating: 4.8,
    price: 300,
    calories: 420,
    cuisine: "South Indian",
    mood: ["Spicy", "Crispy"],
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=500&fit=crop",
    isVeg: false,
    tags: ["Spicy", "Bestseller"],
    deliveryTime: "25 mins",
  },
  {
    id: "se-12",
    sku: "SWD-SE-PNRCRY-12",
    name: "Prawn Curry",
    restaurant: "Goa Shack",
    rating: 4.6,
    price: 480,
    calories: 390,
    cuisine: "Coastal",
    mood: ["Coastal", "Tangy"],
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=500&fit=crop",
    isVeg: false,
    tags: ["Seafood"],
    deliveryTime: "40 mins",
  },
  {
    id: "se-13",
    sku: "SWD-SE-ALUPRT-13",
    name: "Aloo Paratha",
    restaurant: "Haveli Dhaba",
    rating: 4.5,
    price: 120,
    calories: 380,
    cuisine: "Punjabi",
    mood: ["Comfort", "Filling"],
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=500&fit=crop",
    isVeg: true,
    tags: ["Breakfast", "Classic"],
    deliveryTime: "20 mins",
  },
  {
    id: "se-14",
    sku: "SWD-SE-CHKNCRY-14",
    name: "Chicken Curry",
    restaurant: "Desi Tadka",
    rating: 4.6,
    price: 320,
    calories: 450,
    cuisine: "North Indian",
    mood: ["Homestyle", "Rich"],
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=500&fit=crop",
    isVeg: false,
    tags: ["Homestyle"],
    deliveryTime: "35 mins",
  },
  {
    id: "se-15",
    sku: "SWD-SE-GLTK-15",
    name: "Gulab Jamun",
    restaurant: "Mithai Palace",
    rating: 4.7,
    price: 90,
    calories: 240,
    cuisine: "Dessert",
    mood: ["Sweet", "Festive"],
    image:
      "https://images.unsplash.com/photo-1666189565449-c4f1ab43e5c8?w=600&h=500&fit=crop",
    isVeg: true,
    tags: ["Dessert", "Sweet"],
    deliveryTime: "18 mins",
  },
];

const SWIPE_THRESHOLD = 100;

function SwipeCard({ dish, onSwipe, isTop, isInCart }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-15, 15]);
  const addOpacity = useTransform(x, [20, 120], [0, 1]);
  const removeOpacity = useTransform(x, [-20, -120], [0, 1]);
  const cardOpacity = useTransform(x, [-300, 0, 300], [0.6, 1, 0.6]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe("like", dish);
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe("skip", dish);
    }
  };

  if (!isTop) {
    return (
      <div className={styles.cardBehind}>
        <Image src={dish.image} alt={dish.name} fill sizes="(max-width: 768px) 90vw, 400px" className={styles.cardImage} />
        <div className={styles.cardImageOverlay} />
      </div>
    );
  }

  return (
    <motion.article
      className={`${styles.card} ${isInCart ? styles.cardInCart : ""}`}
      style={{ x, rotate, opacity: cardOpacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.92, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileTap={{ cursor: "grabbing" }}
    >
      <motion.div className={styles.badgeAdd} style={{ opacity: addOpacity }}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        ADD TO CART
      </motion.div>
      <motion.div
        className={styles.badgeRemove}
        style={{ opacity: removeOpacity }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        {isInCart ? "REMOVE" : "SKIP"}
      </motion.div>

      <div className={styles.cardImageWrap}>
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          sizes="(max-width: 768px) 90vw, 400px"
          className={styles.cardImage}
          draggable={false}
        />
        <div className={styles.cardImageOverlay} />
        <span className={styles.bookmarkIcon} aria-hidden="true" />
        <div className={styles.cardBadges}>
          {dish.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className={styles.vegIndicator}>
          <span
            className={
              dish.isVeg
                ? styles.vegDot
                : dish.tags.includes("Spicy")
                  ? styles.spicyDot
                  : styles.nonVegDot
            }
          />
        </div>
        {isInCart && (
          <div className={styles.inCartBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4H5.21l-.94-2H1v2h2l3.6 7.59L3.62 17H19v-2H6.42l-1.25-2.25z" />
            </svg>
            In Cart
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <div>
            <h2 className={styles.dishName}>{dish.name}</h2>
            <p className={styles.restaurantName}>{dish.restaurant}</p>
          </div>
          <div className={styles.ratingPill}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={styles.ratingIcon}
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            {dish.rating}
          </div>
        </div>
        <div className={styles.cardMeta}>
          <span className={styles.price}>&#8377;{dish.price}</span>
          <span className={styles.dot}>&#183;</span>
          <span>{dish.calories} cal</span>
          <span className={styles.dot}>&#183;</span>
          <span>{dish.deliveryTime}</span>
        </div>
        <div className={styles.moodTags}>
          {dish.mood.map((m) => (
            <span key={m} className={styles.moodTag}>
              {m}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function SwipeEatPage() {
  const { addToCart } = useSwadishtt();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cart, setCart] = useState([]); // { dish, qty }[]
  const [lastAction, setLastAction] = useState(null);
  const [showMobileCart, setShowMobileCart] = useState(false);

  const currentDish = DISH_CARDS[currentIndex];
  const nextDish = DISH_CARDS[currentIndex + 1];
  const isDone = currentIndex >= DISH_CARDS.length;

  const isInCart = (dish) => cart.some((c) => c.dish.id === dish?.id);
  const cartTotal = cart.reduce((sum, c) => sum + c.dish.price * c.qty, 0);

  const handleSwipe = (direction, dish) => {
    if (!dish) return;
    if (direction === "like") {
      if (!isInCart(dish)) {
        setCart((prev) => [...prev, { dish, qty: 1 }]);
        addToCart({
          id: dish.id,
          name: dish.name,
          price: dish.price,
          image: dish.image,
          sku: dish.sku,
          restaurant: dish.restaurant,
          quantity: 1,
        });
        setLastAction("added");
      }
    } else {
      // Left swipe — remove if in cart
      if (isInCart(dish)) {
        setCart((prev) => prev.filter((c) => c.dish.id !== dish.id));
        setLastAction("removed");
      } else {
        setLastAction("skipped");
      }
    }
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => setLastAction(null), 1200);
    }, 80);
  };

  const handleUndo = () => {
    if (currentIndex === 0) return;
    const prevDish = DISH_CARDS[currentIndex - 1];
    if (isInCart(prevDish)) {
      setCart((prev) => prev.filter((c) => c.dish.id !== prevDish.id));
    }
    setCurrentIndex((prev) => prev - 1);
  };

  const updateQty = (dishId, delta) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.dish.id !== dishId) return c;
          const newQty = c.qty + delta;
          if (newQty < 1) return null;
          return { ...c, qty: newQty };
        })
        .filter(Boolean),
    );
  };

  const removeFromCart = (dishId) => {
    setCart((prev) => prev.filter((c) => c.dish.id !== dishId));
  };

  const handleCheckout = () => {
    router.push("/services/swadisht/checkout");
  };

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      {/* Toast */}
      <AnimatePresence>
        {lastAction && (
          <motion.div
            key={lastAction}
            className={`${styles.toast} ${lastAction === "added" ? styles.toastAdd : lastAction === "removed" ? styles.toastRemove : styles.toastSkip}`}
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            {lastAction === "added" ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Added to cart
              </>
            ) : lastAction === "removed" ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                </svg>
                Removed from cart
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Skipped
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile cart toggle */}
      {cart.length > 0 && (
        <button
          className={styles.mobileCartToggle}
          onClick={() => setShowMobileCart(true)}
          aria-label="View cart"
        >
          <Image
            src="/images/swadisht/categories/cart-icon.png"
            alt=""
            width={22}
            height={22}
            className={styles.cartIconImage}
          />
          <span className={styles.cartBadge}>
            {cart.reduce((s, c) => s + c.qty, 0)}
          </span>
        </button>
      )}

      <main className={styles.layout}>
        {/* Deck section */}
        <section className={styles.deckSection}>
          <div className={styles.pageHeader}>
            <p className={styles.heroKicker}>Artisanal Dish Discovery</p>
            <h1 className={styles.title}>
              <span className={styles.titleLight}>Swipe</span>
              <span className={styles.titleAccent}>Eat</span>
            </h1>
            <p className={styles.subtitle}>
              Swipe right to add, left to skip or remove
            </p>
          </div>

          <div className={styles.deckArrows} aria-hidden="true">
            <Image
              src="/images/swadisht/categories/Squiggle_Arrow_left.png"
              alt=""
              width={168}
              height={168}
              className={styles.arrowLeft}
            />
            <Image
              src="/images/swadisht/categories/Squiggle_Arrow_right.png"
              alt=""
              width={168}
              height={168}
              className={styles.arrowRight}
            />
          </div>

          <div className={styles.swipeArea}>
            <AnimatePresence mode="popLayout">
              {isDone ? (
                <motion.div
                  key="done"
                  className={styles.doneState}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className={styles.doneIconWrap}>
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h2 className={styles.doneTitle}>All Dishes Reviewed</h2>
                  <p className={styles.doneSub}>
                    {cart.length > 0
                      ? `${cart.length} dish${cart.length > 1 ? "es" : ""} in your cart.`
                      : "No dishes saved this round."}
                  </p>
                  <div className={styles.doneActions}>
                    <Link
                      href="/services/swadisht"
                      className={styles.btnSecondary}
                    >
                      Browse Restaurants
                    </Link>
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={() => {
                        setCurrentIndex(0);
                        setCart([]);
                      }}
                    >
                      Start Over
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className={styles.cardStack}>
                  <div className={styles.remainingPill}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className={styles.remainingPillIcon}
                    >
                      <path d="M8.5 14.5a3.5 3.5 0 1 0 7 0c0-2.2-1.6-3.4-2.7-4.5-.9-.8-1.4-1.8-1.3-3-.6.6-1.5 1.8-1.5 3.2 0 1.2-.7 2-1.5 2.8-.8.7-1.3 1.5-1.3 2.5z" />
                      <path d="M12 20.5a2.5 2.5 0 0 0 2.5-2.5c0-1.5-1.2-2.3-2-3-.6-.5-1-.9-1-1.6-.8.8-1.5 1.9-1.5 3.1A2.5 2.5 0 0 0 12 20.5z" />
                    </svg>
                    <span>
                      {Math.max(
                        0,
                        DISH_CARDS.length - DISH_CARDS.indexOf(currentDish),
                      )}{" "}
                      remaining
                    </span>
                  </div>
                  <div className={styles.swipeIndicatorLeft} aria-hidden="true">
                    <div className={styles.swipeIndicatorCross}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </div>
                    <Image
                      src="/images/swadisht/categories/Squiggle_Arrow_left.png"
                      alt=""
                      width={301}
                      height={267}
                      className={styles.swipeIndicatorArrow}
                    />
                  </div>
                  {nextDish && (
                    <SwipeCard
                      key={nextDish.id}
                      dish={nextDish}
                      onSwipe={handleSwipe}
                      isTop={false}
                      isInCart={false}
                    />
                  )}
                  {currentDish && (
                    <SwipeCard
                      key={currentDish.id}
                      dish={currentDish}
                      onSwipe={handleSwipe}
                      isTop={true}
                      isInCart={isInCart(currentDish)}
                    />
                  )}
                  <div
                    className={styles.swipeIndicatorRight}
                    aria-hidden="true"
                  >
                    <Image
                      src="/images/swadisht/categories/cart-green.png"
                      alt=""
                      width={104}
                      height={92}
                      className={styles.swipeIndicatorIcon}
                    />
                    <Image
                      src="/images/swadisht/categories/Squiggle_Arrow_right.png"
                      alt=""
                      width={267}
                      height={221}
                      className={styles.swipeIndicatorArrow}
                    />
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {!isDone && (
            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.skipBtn}
                onClick={() => handleSwipe("skip", currentDish)}
                aria-label={
                  isInCart(currentDish) ? "Remove from cart" : "Skip dish"
                }
              >
                {isInCart(currentDish) ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                className={styles.undoBtn}
                onClick={handleUndo}
                disabled={currentIndex === 0}
                aria-label="Undo last action"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 14 4 9 9 4" />
                  <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
                </svg>
              </button>
              <button
                type="button"
                className={styles.likeBtn}
                onClick={() => handleSwipe("like", currentDish)}
                disabled={isInCart(currentDish)}
                aria-label="Add to cart"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </div>
          )}
        </section>

        {/* Cart Sidebar */}
        <aside
          className={`${styles.cartSection} ${showMobileCart ? styles.cartOpen : ""}`}
        >
          <button
            className={styles.cartClose}
            onClick={() => setShowMobileCart(false)}
            aria-label="Close cart"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className={styles.cartHeader}>
            <div className={styles.cartHeaderTop}>
              <h3>
                <span className={styles.cartHeaderIcon}>
                  <Image
                    src="/images/swadisht/categories/cart-icon-wrap.png"
                    alt=""
                    width={40}
                    height={40}
                    className={styles.cartHeaderIconImage}
                  />
                </span>
                My Cart
              </h3>
              <span className={styles.cartCount}>
                {cart.reduce((s, c) => s + c.qty, 0)} items
              </span>
            </div>
            <p className={styles.cartHeaderHint}>
              Swipe right to add dishes you love
            </p>
          </div>

          <div className={styles.cartItems}>
            {cart.length === 0 ? (
              <div className={styles.emptyCart}>
                <Image
                  src="/images/swadisht/categories/cart-icon-wrap.png"
                  alt=""
                  width={110}
                  height={110}
                  className={styles.emptyCartWrap}
                />
                <p className={styles.emptyCartTitle}>Your cart is empty</p>
                <p className={styles.emptyCartSub}>
                  Swipe right on dishes you love to add them here
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {cart.map(({ dish, qty }) => (
                  <motion.div
                    key={dish.id}
                    className={styles.cartItem}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: -30,
                      height: 0,
                      marginBottom: 0,
                      padding: 0,
                    }}
                    transition={{ duration: 0.22 }}
                    layout="position"
                  >
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      width={58}
                      height={58}
                      className={styles.cartThumb}
                    />
                    <div className={styles.cartItemInfo}>
                      <p className={styles.cartItemNameRow}>
                        <span
                          className={
                            dish.isVeg
                              ? styles.vegDot
                              : dish.tags.includes("Spicy")
                                ? styles.spicyDot
                                : styles.nonVegDot
                          }
                        />
                        <span className={styles.cartItemName}>{dish.name}</span>
                      </p>
                      <p className={styles.cartItemRestaurant}>
                        {dish.restaurant}
                      </p>
                      <p className={styles.cartItemPrice}>
                        &#8377;{(dish.price * qty).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className={styles.cartItemControls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQty(dish.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        {qty === 1 ? (
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                          </svg>
                        ) : (
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        )}
                      </button>
                      <span className={styles.qtyValue}>{qty}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQty(dish.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {cart.length > 0 && (
            <div className={styles.cartFooter}>
              <div className={styles.cartSummary}>
                <div className={styles.cartSummaryRow}>
                  <span>Subtotal</span>
                  <span>&#8377;{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className={styles.cartSummaryRow}>
                  <span>Delivery fee</span>
                  <span className={styles.freeDelivery}>FREE</span>
                </div>
                <div className={styles.cartTotal}>
                  <span className={styles.cartTotalLabel}>Total</span>
                  <span className={styles.cartTotalValue}>
                    &#8377;{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <button onClick={handleCheckout} className={styles.ctaBtn}>
                Proceed to Checkout
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </aside>
      </main>

      {showMobileCart && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setShowMobileCart(false)}
        />
      )}
    </div>
  );
}
