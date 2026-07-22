'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import SwadishttHeader from '../../components/SwadishttHeader';
import { useSwadishtt } from '../../contexts/SwadishttContext';
import { RESTAURANTS } from '../../lib/swadishttData';
import styles from './restaurant.module.css';

function DishModal({ dish, onClose, onAdd }) {
  if (!dish) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <article
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className={styles.modalClose}
          type="button"
          aria-label="Close dish details"
          onClick={onClose}
        >
          ×
        </button>

        <img
          className={styles.modalImage}
          src={dish.image}
          alt={dish.name}
        />

        <div className={styles.modalContent}>
          <span
            className={
              dish.isVeg ? styles.vegMark : styles.nonVegMark
            }
          />

          <h2>{dish.name}</h2>
          <p>{dish.description}</p>

          <div className={styles.modalFooter}>
            <strong>₹{dish.price}</strong>

            <button type="button" onClick={() => onAdd(dish)}>
              + Add
            </button>
          </div>
        </div>
      </article>
    </div>
  );
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

  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : params?.slug;

  const restaurant = useMemo(
    () =>
      RESTAURANTS.find(
        (item) => item.slug === slug
      ),
    [slug]
  );

  const visibleMenu = useMemo(() => {
    if (!restaurant) return [];

    if (activeFilter === 'veg') {
      return restaurant.menu.filter(
        (dish) => dish.isVeg
      );
    }

    if (activeFilter === 'non-veg') {
      return restaurant.menu.filter(
        (dish) => !dish.isVeg
      );
    }

    return restaurant.menu;
  }, [activeFilter, restaurant]);

  if (!restaurant) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loader} />
        <p>Loading restaurant…</p>
      </main>
    );
  }

  const location = [
    restaurant.location?.area,
    restaurant.location?.city,
  ]
    .filter(Boolean)
    .join(' · ');

  const description =
    restaurant.description ||
    `Hand-prepared favourites with bright, authentic ${
      restaurant.cuisines?.[0] || 'regional'
    } flavours, cooked fresh and delivered warm.`;

  const quantityFor = (dishId) =>
    cart.find((item) => item.id === dishId)
      ?.quantity || 0;

  const addDish = (dish) => {
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
  };

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      {/* HERO VIDEO/IMAGE ONLY */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          {restaurant.video ? (
            <video
              className={styles.heroVideo}
              autoPlay
              muted
              loop
              playsInline
              poster={restaurant.coverImage}
            >
              <source
                src={restaurant.video}
                type="video/mp4"
              />
            </video>
          ) : (
            <img
              className={styles.heroVideo}
              src={restaurant.coverImage}
              alt={restaurant.name}
            />
          )}

          <div className={styles.heroShade} />
        </div>
      </section>

      {/* CARD AND MENU */}
      <section className={styles.menuSection}>
        <div className={styles.menuShell}>
          {/* RESTAURANT CARD IS NOW IN NORMAL FLOW */}
          <article
            className={styles.restaurantCard}
            style={{
              position: 'relative',
              inset: 'auto',
              top: 'auto',
              right: 'auto',
              bottom: 'auto',
              left: 'auto',
              display: 'block',
              visibility: 'visible',
              opacity: 1,
              transform: 'none',
              margin: '0 auto 38px',
              zIndex: 10,
            }}
          >
            <div className={styles.eyebrowRow}>
              <span>
                {location || 'Bengaluru'}
              </span>

              <span className={styles.hotBadge}>
                ♨ Hot &amp; Popular
              </span>
            </div>

            <h1>{restaurant.name}</h1>

            <p
              className={
                styles.restaurantDescription
              }
            >
              {description}
            </p>

            <div
              className={
                styles.restaurantMeta
              }
            >
              <span className={styles.rating}>
                ★ {restaurant.rating}
              </span>

              <span>
                {restaurant.ratingCount || 100}
                + ratings
              </span>

              <span>
                ◷ {restaurant.deliveryTime}
              </span>
            </div>

            <div
              className={styles.cardDivider}
            />

            <div
              className={styles.cuisineBlock}
            >
              <span
                className={styles.cuisineLabel}
              >
                Cuisine
              </span>

              <div
                className={styles.cuisineChips}
              >
                {restaurant.cuisines.map(
                  (cuisine) => (
                    <span key={cuisine}>
                      {cuisine}
                    </span>
                  )
                )}
              </div>
            </div>
          </article>

          {/* FILTERS */}
          <div
            className={styles.filterTabs}
            role="tablist"
            aria-label="Menu filters"
          >
            {[
              ['popular', 'Popular'],
              ['veg', 'Veg'],
              ['non-veg', 'Non-Veg'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={
                  activeFilter === value
                }
                className={
                  activeFilter === value
                    ? styles.activeTab
                    : ''
                }
                onClick={() =>
                  setActiveFilter(value)
                }
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.menuHeading}>
            <h2>Featured Items</h2>

            <span>
              {visibleMenu.length} dishes
            </span>
          </div>

          <div className={styles.menuList}>
            {visibleMenu.map((dish) => {
              const quantity =
                quantityFor(dish.id);

              return (
                <article
                  key={dish.id}
                  className={styles.dishCard}
                  onClick={() =>
                    setSelectedDish(dish)
                  }
                >
                  <div
                    className={
                      styles.dishImageWrap
                    }
                  >
                    <img
                      src={dish.image}
                      alt={dish.name}
                      onError={(event) => {
                        event.currentTarget.onerror =
                          null;

                        event.currentTarget.src =
                          restaurant.coverImage;
                      }}
                    />

                    {dish.isBestseller && (
                      <span
                        className={
                          styles.bestseller
                        }
                      >
                        Bestseller
                      </span>
                    )}
                  </div>

                  <div
                    className={
                      styles.dishDetails
                    }
                  >
                    <div
                      className={
                        styles.dishTitleRow
                      }
                    >
                      <h3>{dish.name}</h3>

                      <span
                        className={
                          dish.isVeg
                            ? styles.vegMark
                            : styles.nonVegMark
                        }
                      />
                    </div>

                    <p>{dish.description}</p>

                    <div
                      className={
                        styles.dishTags
                      }
                    >
                      <span>
                        {dish.isVeg
                          ? 'Pure Veg'
                          : 'Non-Veg'}
                      </span>

                      {dish.isBestseller && (
                        <span>
                          Most loved
                        </span>
                      )}

                      <span>
                        Freshly made
                      </span>
                    </div>

                    <strong
                      className={
                        styles.dishPrice
                      }
                    >
                      ₹{dish.price}
                    </strong>
                  </div>

                  <div
                    className={
                      styles.dishAction
                    }
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >
                    {quantity === 0 ? (
                      <button
                        type="button"
                        className={
                          styles.addButton
                        }
                        onClick={() =>
                          addDish(dish)
                        }
                      >
                        + Add
                      </button>
                    ) : (
                      <div
                        className={
                          styles.quantityControl
                        }
                      >
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              dish.id,
                              quantity - 1
                            )
                          }
                        >
                          −
                        </button>

                        <span>{quantity}</span>

                        <button
                          type="button"
                          onClick={() =>
                            addDish(dish)
                          }
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <DishModal
        dish={selectedDish}
        onClose={() =>
          setSelectedDish(null)
        }
        onAdd={addDish}
      />

      {cartCount > 0 && (
        <Link
          href="/services/swadisht/cart"
          className={styles.cartBar}
        >
          <span>
            {cartCount} items · ₹{cartTotal}
          </span>

          <strong>View Cart →</strong>
        </Link>
      )}
    </div>
  );
}