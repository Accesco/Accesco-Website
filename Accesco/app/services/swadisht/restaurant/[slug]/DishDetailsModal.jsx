"use client";

/**
 * DishDetailsModal
 * ----------------------------------------------------------------------------
 * Drop-in dish details interface for the existing Swadishtt restaurant page.
 * It renders ONLY into class names that already exist in your restaurant
 * .module.css — no new page, no new design system, no route change.
 *
 * Usage inside your existing page.jsx (3 additions, nothing removed):
 *
 *   import DishDetailsModal from './DishDetailsModal';
 *   const [detailDish, setDetailDish] = useState(null);
 *
 *   // on the existing dish card:
 *   <div className={styles.dishCard} onClick={() => setDetailDish(dish)}>
 *
 *   // at the end of the page JSX:
 *   {detailDish && (
 *     <DishDetailsModal
 *       dish={detailDish}
 *       styles={styles}
 *       restaurant={restaurant}
 *       onClose={() => setDetailDish(null)}
 *       onAdd={(dish, qty) => { addToCart(dish, qty); setDetailDish(null); }}
 *     />
 *   )}
 *
 * `styles` is passed in so this file makes no assumption about your CSS
 * module's path. Every optional field renders only when the data exists.
 */

import { useEffect, useState } from "react";

/** "1–2 people" × 3  ->  "3–6 people". Falls back to the raw string. */
function scaleServes(serves, qty) {
  if (!serves || qty <= 1) return serves;
  const numbers = serves.match(/\d+/g);
  if (!numbers) return serves;
  let i = 0;
  return serves.replace(/\d+/g, () => String(Number(numbers[i++]) * qty));
}

export default function DishDetailsModal({
  dish,
  styles,
  restaurant,
  onClose,
  onAdd,
  initialQuantity = 1,
}) {
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (!dish) return null;

  const total = dish.price * quantity;
  const hasNutrition =
    dish.protein != null || dish.carbs != null || dish.fats != null;

  return (
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={dish.name}
      onClick={onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Close dish details"
        >
          ×
        </button>

        {dish.image && (
          // eslint-disable-next-line @next/next/no-img-element -- dish images come from mixed external hosts, not covered by next/image remotePatterns
          <img className={styles.modalImage} src={dish.image} alt={dish.name} />
        )}

        <div className={styles.modalContent}>
          <h2>{dish.name}</h2>

          {(dish.origin || restaurant?.name) && (
            <p className={styles.modalOrigin}>
              {[dish.origin, restaurant?.name].filter(Boolean).join(" · ")}
            </p>
          )}

          {dish.description && <p>{dish.description}</p>}

          {dish.preparation && (
            <p className={styles.modalPreparation}>{dish.preparation}</p>
          )}

          {/* Dietary badges */}
          <div className={styles.modalBadgeRow}>
            <span
              className={
                dish.isVeg ? styles.modalBadgeVeg : styles.modalBadgeNonVeg
              }
            >
              {dish.isVeg ? "Pure Veg" : "Non-Veg"}
            </span>
            {dish.isVegan && (
              <span className={styles.modalBadgeVeg}>Vegan</span>
            )}
            {dish.isGlutenFree === true && (
              <span className={styles.modalBadgeNeutral}>Gluten free</span>
            )}
            {dish.isGlutenFree === false && (
              <span className={styles.modalBadgeNeutral}>Contains gluten</span>
            )}
            {dish.spiceLevel && (
              <span className={styles.modalBadgeNeutral}>
                {dish.spiceLevel}
              </span>
            )}
            {dish.isBestseller && (
              <span className={styles.modalBadgeNeutral}>Bestseller</span>
            )}
          </div>

          {/* Calories / serves / portion */}
          {(dish.calories != null || dish.serves || dish.servingSize) && (
            <div className={styles.modalMetaRow}>
              {dish.calories != null && (
                <span>{dish.calories * quantity} kcal</span>
              )}
              {dish.serves && (
                <span>Serves {scaleServes(dish.serves, quantity)}</span>
              )}
              {dish.servingSize && <span>{dish.servingSize}</span>}
            </div>
          )}

          {hasNutrition && (
            <p className={styles.modalIngredients}>
              Per serving:{" "}
              {[
                dish.protein != null ? `${dish.protein} g protein` : null,
                dish.carbs != null ? `${dish.carbs} g carbs` : null,
                dish.fats != null ? `${dish.fats} g fat` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}

          {Array.isArray(dish.ingredients) && dish.ingredients.length > 0 && (
            <p className={styles.modalIngredients}>
              <strong>Ingredients:</strong> {dish.ingredients.join(", ")}
            </p>
          )}

          {Array.isArray(dish.allergens) && dish.allergens.length > 0 && (
            <p className={styles.modalAllergens}>
              <strong>Allergens:</strong> {dish.allergens.join(", ")}
            </p>
          )}

          {/* Quantity */}
          <div className={styles.modalQtyRow}>
            <span className={styles.modalQtyLabel}>Quantity</span>
            <div className={styles.quantityControl}>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Total + CTA */}
          <div className={styles.modalFooter}>
            <div>
              <div className={styles.modalTotalLabel}>Total</div>
              <div className={styles.modalTotalPrice}>₹{total}</div>
            </div>
            <button type="button" onClick={() => onAdd?.(dish, quantity)}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
