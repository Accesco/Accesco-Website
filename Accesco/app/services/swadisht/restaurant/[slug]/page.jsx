"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import SwadishttHeader from "../../components/SwadishttHeader";
import { useSwadishtt } from "../../contexts/SwadishttContext";
import { RESTAURANTS } from "../../lib/swadishttData";
import styles from "./restaurant.module.css";


const HERO_FALLBACK_IMAGE = "/images/swadisht/Swadishtt-kitchen-bg.png";
const RESTAURANT_LOGO = "/images/swadisht/swadisht_logo.JPG";

/* ============ DISH DETAILS MODAL ============
   Extends the existing dish modal in place (same trigger: clicking a dish
   card). Adds quantity selection, dietary badges, and a dynamic total.
   Only renders fields that actually exist on the dish object — nothing is
   invented. Pass a `key={dish.id}` at the call site so quantity resets
   whenever a different dish is opened. */
function DishModal({ dish, onClose, onAdd }) {
  const [qty, setQty] = useState(1);

  if (!dish) return null;

  const total = (dish.price || 0) * qty;

  const dietaryBadges = [
    dish.isVeg ? "Pure Veg" : "Non-Veg",
    dish.isVegan && "Vegan",
    dish.isGlutenFree && "Gluten Free",
    dish.spiceLevel && `${dish.spiceLevel} Spice`,
  ].filter(Boolean);

  const handleAdd = () => {
    onAdd(dish, qty);
    onClose();
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <article className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.modalClose}
          type="button"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        <Image
          className={styles.modalImage}
          src={dish.image}
          alt={dish.name}
          width={520}
          height={280}
        />

        <div className={styles.modalContent}>
          <h2>{dish.name}</h2>
          {dish.description && <p>{dish.description}</p>}

          <div className={styles.modalBadgeRow}>
            {dietaryBadges.map((label) => (
              <span
                key={label}
                className={
                  label === "Pure Veg" || label === "Vegan"
                    ? styles.modalBadgeVeg
                    : label === "Non-Veg"
                      ? styles.modalBadgeNonVeg
                      : styles.modalBadgeNeutral
                }
              >
                {label}
              </span>
            ))}
          </div>

          {(dish.calories > 0 || dish.serves) && (
            <div className={styles.modalMetaRow}>
              {dish.calories > 0 && <span>🔥 {dish.calories} kcal</span>}
              {dish.serves && <span>🍽 Serves {dish.serves}</span>}
            </div>
          )}

          {dish.allergens?.length > 0 && (
            <p className={styles.modalAllergens}>
              Contains: {dish.allergens.join(", ")}
            </p>
          )}

          {dish.ingredients?.length > 0 && (
            <p className={styles.modalIngredients}>
              <strong>Ingredients:</strong> {dish.ingredients.join(", ")}
            </p>
          )}

          <div className={styles.modalQtyRow}>
            <span className={styles.modalQtyLabel}>Quantity</span>
            <div className={styles.quantityControl}>
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <div>
              <div className={styles.modalTotalLabel}>Total</div>
              <strong className={styles.modalTotalPrice}>₹{total}</strong>
            </div>
            <button type="button" onClick={handleAdd}>
              Add to Cart
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

// Maps a swadishtt_products backend doc onto the same {id, name, category,
// description, price, image, isVeg, isBestseller} shape the static
// RESTAURANTS[].menu[] entries already use, so nothing else on this page
// needs to change based on which source a dish came from.
function toMenuItem(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    price: product.price,
    image: product.image,
    isVeg: product.isVeg,
    isBestseller: product.isBestseller,
    inStock: product.inStock,
  };
}

export default function RestaurantDetailPage() {
  const params = useParams();
  const {
    addToCart,
    cart = [],
    updateQuantity,
  } = useSwadishtt();

  const [activeFilter, setActiveFilter] =
    useState('popular');

  const [selectedDish, setSelectedDish] =
    useState(null);

  // Backend-driven menu with a static fallback — mirrors the pattern
  // already used for InstaStyle's catalog (Firestore-backed products with
  // the bundled static list as a fallback, see _lib/instastyleCart.js's
  // resolveProduct): if a restaurant's dishes haven't been migrated yet
  // (see scripts/seed-swadishtt-products.mjs) or the fetch fails, the page
  // keeps working off the static menu exactly as it did before.
  const [backendMenu, setBackendMenu] = useState(null); // null = not loaded yet
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState(false);
  const heroVideoRef = useRef(null);

  useEffect(() => {
    heroVideoRef.current?.play().catch(() => {});
  }, []);

  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const restaurant = useMemo(
    () => RESTAURANTS.find((r) => r.slug === slug),
    [slug],
  );

  useEffect(() => {
    if (!restaurant) return;
    let cancelled = false;
    setMenuLoading(true);
    setMenuError(false);

    fetch(`/api/swadishtt/products?restaurantId=${encodeURIComponent(restaurant.id)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Request failed'))))
      .then((data) => {
        if (cancelled) return;
        setBackendMenu((data.products || []).map(toMenuItem));
      })
      .catch(() => {
        if (!cancelled) {
          setMenuError(true);
          setBackendMenu(null);
        }
      })
      .finally(() => {
        if (!cancelled) setMenuLoading(false);
      });

    return () => { cancelled = true; };
  }, [restaurant]);

  // Prefer the backend catalog once it's loaded and non-empty (this
  // restaurant has been seeded — see scripts/seed-swadishtt-products.mjs);
  // otherwise fall back to the static menu, so a not-yet-migrated
  // restaurant or a failed request never shows an empty page.
  const activeMenu = backendMenu && backendMenu.length > 0 ? backendMenu : restaurant?.menu || [];

  const visibleMenu = useMemo(() => {
    if (!restaurant) return [];

    if (activeFilter === 'veg') {
      return activeMenu.filter(
        (dish) => dish.isVeg
      );
    }

    if (activeFilter === 'non-veg') {
      return activeMenu.filter(
        (dish) => !dish.isVeg
      );
    }

    return activeMenu;
  }, [activeFilter, activeMenu, restaurant]);

  if (!restaurant) {
    return (
      <main className={styles.loadingPage}>
        <p className={styles.notFoundTitle}>Restaurant not found</p>
        <p>We couldn&apos;t find a restaurant at this address.</p>
        <Link href="/services/swadisht" className={styles.notFoundLink}>
          Back to Swadishtt
        </Link>
      </main>
    );
  }

  const location = [restaurant.location?.area, restaurant.location?.city]
    .filter(Boolean)
    .join(", ");
  const description =
    restaurant.description ||
    `Hand-prepared favourites with bright, authentic ${restaurant.cuisines?.[0] || "regional"} flavours, cooked fresh and delivered warm.`;

  const quantityFor = (id) => cart.find((i) => i.id === id)?.quantity || 0;

  /* addDish now accepts an optional quantity (defaults to 1, matching the
     existing "+ Add" button behaviour). It calls addToCart once per unit,
     relying on the existing context to increment quantity for an id already
     in the cart — the same assumption the existing "+" control already
     depends on. No context/cart logic was changed. */
  const addDish = (dish, qty = 1) => {
    for (let i = 0; i < qty; i += 1) {
      addToCart({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        restaurant: restaurant.name,
        calories: dish.calories || 0,
        protein: dish.protein || 0,
        carbs: dish.carbs || 0,
        fats: dish.fats || 0,
      });
    }
  };

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);
  const cartTotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      {/* HERO WRAPPER — plain relative box; the badge lives here (outside
          .hero's overflow:hidden) so its circle never gets clipped */}
      <div style={{ position: "relative" }}>
        <section className={styles.hero}>
          <div className={styles.heroMedia}>
            {restaurant.video ? (
              <video
                ref={heroVideoRef}
                className={styles.heroVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                fetchPriority="low"
                poster={restaurant.coverImage || HERO_FALLBACK_IMAGE}
              >
                <source src={restaurant.video} type="video/mp4" />
              </video>
            ) : (
              <Image
                className={styles.heroVideo}
                src={restaurant.coverImage || HERO_FALLBACK_IMAGE}
                alt={restaurant.name}
                fill
                sizes="100vw"
                priority
              />
            )}
            <div className={styles.heroShade} />
          </div>

          <div
            className={styles.heroContent}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 5,
              padding: "40px 40px 60px",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "18px",
            }}
          >
            <div className={styles.eyebrowRow}>
              <span className={styles.locationPill}>
                📍 {(location || "Bengaluru").toUpperCase()}
              </span>
              <span className={styles.hotBadge}>  KORAMANGALA, BANGALORE</span>
            </div>

            <h1
              style={{
                  margin: 0,
                fontWeight: 900,
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(46px, 5.6vw, 68px)",
                lineHeight: 1,
                color: "#fff",
                textShadow: "0 2px 12px rgba(0,0,0,0.65)",
 }}
            >
              {restaurant.name}
            </h1>
            <p
              className={styles.restaurantDescription}
              style={{
                margin: 0,
                maxWidth: "560px",
                fontSize: "17px",
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.95)",
                textShadow: "0 1px 5px rgba(0,0,0,0.6)",
              }}
            >
              {description}
            </p>

           <div
  className={styles.restaurantMeta}
  style={{
    margin: 0,
    display: "flex",
    alignItems: "flex-start",
    gap: "28px",
    color: "#fff",
    textShadow: "0 1px 4px rgba(0,0,0,0.6)",
  }}
>
  {/* Rating */}
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <span
      className={styles.rating}
      style={{
        fontSize: "15px",
        fontWeight: 700,
      }}
    >
      ★ {restaurant.rating}
    </span>

    <span
      style={{
        fontSize: "12px",
        opacity: 0.8,
      }}
    >
      {restaurant.ratingCount || 100}+ ratings
    </span>
  </div>

  {/* Delivery Time */}
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <span
      style={{
        fontSize: "15px",
        fontWeight: 700,
      }}
    >
      ◷ {restaurant.deliveryTime}
    </span>

    <span
      style={{
        fontSize: "12px",
        opacity: 0.8,
      }}
    >
      Delivery Time
    </span>
  </div>

  {/* Delivery */}
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <span
      style={{
        fontSize: "15px",
        fontWeight: 700,
      }}
    >
      🛵 Fast
    </span>

    <span
      style={{
        fontSize: "12px",
        opacity: 0.8,
      }}
    >
      and Reliable
    </span>
  </div>
</div>

{/* Cuisine */}
<div
  className={styles.cuisineBlock}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginTop: "16px",
  }}
>
  <span
    className={styles.cuisineLabel}
    style={{
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "1px",
      textTransform: "uppercase",
    }}
  >
    Cuisine
  </span>

  <div className={styles.cuisineChips}>
    {restaurant.cuisines.map((c) => (
      <span key={c}>{c}</span>
    ))}
  </div>
</div>
          </div>
        </section>

        {/* Logo badge — sits outside .hero, straddling the wrapper's bottom
            edge, so it renders as a full circle instead of a clipped half */}
        <div
          className={styles.heroBadge}
          style={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            zIndex: 6,
            transform: "translate(-50%, 50%)",
          }}
        >
          <Image src={RESTAURANT_LOGO} alt="Swadishtt" width={44} height={44} />
        </div>
      </div>

      {/* MENU — fixed grid, no horizontal scroll */}
      <section className={styles.menuSection}>
        <div className={styles.menuShell}>
          <div className={styles.menuHeaderRow}>
            <div>
              <div className={styles.menuHeading}>
                <h2>⭐ Featured Items</h2>
              </div>
              <p className={styles.menuSubtext}>
                Some of our most loved dishes, just for you!
              </p>
            </div>

            <div
              className={styles.filterTabs}
              role="tablist"
              aria-label="Menu filters"
            >
              {[
                ["popular", "★ Popular"],
                ["veg", "🌿 Veg"],
                ["non-veg", "🔥 Non-Veg"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === value}
                  className={activeFilter === value ? styles.activeTab : ""}
                  onClick={() => setActiveFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className={styles.filterMeta}>
              <span className={styles.dishCount}>
                {menuLoading ? 'Updating menu…' : `${visibleMenu.length} dishes`}
              </span>
              <span className={styles.viewAllLink}>View All Dishes ›</span>
            </div>
          </div>

          {!menuLoading && visibleMenu.length === 0 ? (
            <p style={{ padding: '24px 0', color: '#666' }}>
              {menuError
                ? 'Could not load the menu right now — please try again shortly.'
                : 'No dishes available in this category right now.'}
            </p>
          ) : (
          <div className={styles.menuList}>
            {visibleMenu.map((dish) => {
              const quantity = quantityFor(dish.id);
              return (
                <article
                  key={dish.id}
                  className={styles.dishCard}
                  onClick={() => setSelectedDish(dish)}
                >
                  <div className={styles.dishImageWrap}>
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      sizes="(max-width: 720px) 45vw, 33vw"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = restaurant.coverImage;
                      }}
                    />
                    <span className={styles.dishVegBadge}>
                      <span
                        className={
                          dish.isVeg ? styles.vegMark : styles.nonVegMark
                        }
                      />
                    </span>
                    {dish.isBestseller && (
                      <span className={styles.bestseller}>Bestseller</span>
                    )}
                  </div>

                  <div className={styles.dishDetails}>
                    <div className={styles.dishTitleRow}>
                      <h3>{dish.name}</h3>
                      <div className={styles.dishTags}>
                        <span>Freshly made</span>
                        <span>{dish.isVeg ? "Pure Veg" : "Non-Veg"}</span>
                      </div>
                    </div>

                    <div className={styles.dishFooter}>
                      <strong className={styles.dishPrice}>
                        ₹{dish.price}
                      </strong>
                      <div
                        className={styles.dishAction}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {quantity === 0 ? (
                          <button
                            type="button"
                            className={styles.addButton}
                            onClick={() => addDish(dish)}
                          >
                            + Add
                          </button>
                        ) : (
                          <div className={styles.quantityControl}>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(dish.id, quantity - 1)
                              }
                            >
                              −
                            </button>
                            <span>{quantity}</span>
                            <button type="button" onClick={() => addDish(dish)}>
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          )}
        </div>
      </section>

      <DishModal
        key={selectedDish?.id || "none"}
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAdd={addDish}
      />

      {cartCount > 0 && (
        <Link href="/services/swadisht/cart" className={styles.cartBar}>
          <span>
            {cartCount} items · ₹{cartTotal}
          </span>
          <strong>View Cart →</strong>
        </Link>
      )}
    </div>
  );
}