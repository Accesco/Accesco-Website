"use client";

/**
 * Swadishtt — restaurant detail page
 * ----------------------------------------------------------------------------
 * ⚠️ READ BEFORE OVERWRITING
 * This is a RECONSTRUCTION, not a diff of your file. It was written against
 * `restaurant.module.css` so that every class in that stylesheet is used, and
 * it wires in the new DishDetailsModal. Your real page almost certainly has
 * things this doesn't know about (search, offers strip, related restaurants,
 * analytics, your exact CartContext method names).
 *
 * Diff this against your existing page before replacing it. The only genuinely
 * NEW parts you need are marked  // ── NEW ──  below; everything else is my
 * best reconstruction of what you already have.
 */

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { RESTAURANTS } from "../../lib/swadishttData";
import DishDetailsModal from "./DishDetailsModal"; // ── NEW ──
import styles from "./restaurant.module.css";

const FILTERS = [
  { id: "all", label: "All Dishes" },
  { id: "veg", label: "Pure Veg" },
  { id: "nonveg", label: "Non-Veg" },
];

const VISIBLE_STEP = 12;

export default function RestaurantPage() {
  const { slug } = useParams();
  const router = useRouter();

  /**
   * CartContext adapter — your provider's method names may differ.
   * Point these at the real ones and delete the fallbacks.
   */
  const cart = useCart() || {};
  const addToCart = cart.addToCart || cart.addItem || cart.add;
  const updateQuantity =
    cart.updateQuantity || cart.updateItemQuantity || cart.setQuantity;
  const cartItems = cart.items || cart.cart || cart.cartItems || [];

  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [detailDish, setDetailDish] = useState(null); // ── NEW ──
  const [isLoading, setIsLoading] = useState(true);

  const restaurant = useMemo(
    () =>
      RESTAURANTS.find((r) => r.slug === slug || String(r.id) === String(slug)),
    [slug],
  );

  useEffect(() => {
    setIsLoading(false);
  }, [slug]);

  const dishes = useMemo(() => {
    const menu = restaurant?.menu || [];
    if (filter === "veg") return menu.filter((d) => d.isVeg);
    if (filter === "nonveg") return menu.filter((d) => !d.isVeg);
    return menu;
  }, [restaurant, filter]);

  const visibleDishes = showAll ? dishes : dishes.slice(0, VISIBLE_STEP);

  const qtyInCart = (dishId) =>
    cartItems.find((i) => i.id === dishId)?.quantity || 0;

  const cartCount = cartItems.reduce((n, i) => n + (i.quantity || 1), 0);
  const cartTotal = cartItems.reduce(
    (n, i) => n + i.price * (i.quantity || 1),
    0,
  );

  /** Single place where a dish becomes a cart line — keeps the unified cart consistent. */
  const handleAdd = (dish, quantity = 1) => {
    addToCart?.(
      {
        id: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        isVeg: dish.isVeg,
        venture: "Swadishtt", // ── NEW ── lets the unified cart group by brand
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      },
      quantity,
    );
  };

  if (isLoading) {
    return <div className={styles.loadingPage}>Loading restaurant…</div>;
  }

  if (!restaurant) {
    return (
      <div className={styles.loadingPage}>
        <p className={styles.notFoundTitle}>
          We couldn&apos;t find that restaurant
        </p>
        <Link href="/services/swadisht" className={styles.notFoundLink}>
          Back to Swadishtt
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          {restaurant.video ? (
            <video
              className={styles.heroVideo}
              src={restaurant.video}
              poster={restaurant.coverImage}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- cover images come from mixed external hosts
            <img
              className={styles.heroVideo}
              src={restaurant.coverImage}
              alt={restaurant.name}
            />
          )}
        </div>

        <div className={styles.heroShade} />

        <div className={styles.heroContent}>
          <div className={styles.eyebrowRow}>
            <span className={styles.locationPill}>
              {restaurant.location?.area}, {restaurant.location?.city}
            </span>
            {restaurant.offers?.[0] && (
              <span className={styles.hotBadge}>
                {restaurant.offers[0].title}
              </span>
            )}
          </div>

          <h1>{restaurant.name}</h1>

          {restaurant.offers?.[0]?.description && (
            <p className={styles.restaurantDescription}>
              {restaurant.offers[0].description}
            </p>
          )}

          <div className={styles.restaurantMeta}>
            <span className={styles.rating}>
              ★ {restaurant.rating} ({restaurant.ratingCount} ratings)
            </span>
            <span>{restaurant.deliveryTime}</span>
            <span>₹{restaurant.priceForTwo} for two</span>
            {restaurant.timings && (
              <span>
                {restaurant.timings.open} – {restaurant.timings.close}
              </span>
            )}
          </div>

          <div className={styles.cardDivider} />

          <div className={styles.cuisineBlock}>
            <span className={styles.cuisineLabel}>Cuisines</span>
            <div className={styles.cuisineChips}>
              {restaurant.cuisines?.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        {restaurant.logoImage && (
          <div className={styles.heroBadge}>
            {/* eslint-disable-next-line @next/next/no-img-element -- logos come from mixed external hosts */}
            <img src={restaurant.logoImage} alt={`${restaurant.name} logo`} />
          </div>
        )}
      </section>

      {/* ============ MENU ============ */}
      <section className={styles.menuSection}>
        <div className={styles.menuShell}>
          <div className={styles.menuHeaderRow}>
            <div className={styles.menuHeading}>
              <h2>Menu</h2>
              <p className={styles.menuSubtext}>
                Prepared fresh, delivered hot
              </p>
            </div>

            <div className={styles.filterTabs}>
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={filter === f.id ? styles.activeTab : undefined}
                  onClick={() => {
                    setFilter(f.id);
                    setShowAll(false);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className={styles.filterMeta}>
              <span className={styles.dishCount}>{dishes.length} dishes</span>
              {dishes.length > VISIBLE_STEP && (
                <span
                  className={styles.viewAllLink}
                  onClick={() => setShowAll((v) => !v)}
                >
                  {showAll ? "Show less" : "View all"}
                </span>
              )}
            </div>
          </div>

          <div className={styles.menuList}>
            {visibleDishes.map((dish) => {
              const qty = qtyInCart(dish.id);
              return (
                <div
                  key={dish.id}
                  className={styles.dishCard}
                  role="button"
                  tabIndex={0}
                  onClick={() => setDetailDish(dish)} // ── NEW ──
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setDetailDish(dish);
                  }} // ── NEW ──
                >
                  <div className={styles.dishImageWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- dish images come from mixed external hosts */}
                    <img src={dish.image} alt={dish.name} />
                    {dish.isBestseller && (
                      <span className={styles.bestseller}>Bestseller</span>
                    )}
                    <span className={styles.dishVegBadge}>
                      <span
                        className={
                          dish.isVeg ? styles.vegMark : styles.nonVegMark
                        }
                      />
                    </span>
                  </div>

                  <div className={styles.dishDetails}>
                    <div className={styles.dishTitleRow}>
                      <h3>{dish.name}</h3>
                      <div className={styles.dishTags}>
                        <span>Freshly Made</span>
                        <span>{dish.isVeg ? "Pure Veg" : "Non-Veg"}</span>
                      </div>
                    </div>

                    <div className={styles.dishFooter}>
                      <span className={styles.dishPrice}>₹{dish.price}</span>

                      {qty > 0 ? (
                        <div
                          className={styles.quantityControl}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity?.(dish.id, qty - 1)}
                          >
                            −
                          </button>
                          <span>{qty}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity?.(dish.id, qty + 1)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className={styles.addButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailDish(dish);
                          }}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CART BAR ============ */}
      {cartCount > 0 && (
        <Link href="/cart" className={styles.cartBar}>
          <span>
            {cartCount} {cartCount === 1 ? "item" : "items"} · ₹{cartTotal}
          </span>
          <span>View cart →</span>
        </Link>
      )}

      {/* ============ DISH DETAILS MODAL ============ */}
      {/* ── NEW ── */}
      {detailDish && (
        <DishDetailsModal
          dish={detailDish}
          styles={styles}
          restaurant={restaurant}
          onClose={() => setDetailDish(null)}
          onAdd={(dish, quantity) => {
            handleAdd(dish, quantity);
            setDetailDish(null);
          }}
        />
      )}
    </div>
  );
}
