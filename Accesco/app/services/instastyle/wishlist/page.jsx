'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './wishlist.module.css';
import { useCart } from '@/contexts/CartContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useCart();
  const totalValue = wishlist.reduce(
    (sum, product) => sum + (product.discountedPrice || product.price || 0),
    0
  );
  const averageValue = wishlist.length > 0 ? Math.round(totalValue / wishlist.length) : 0;

  const brandCount = wishlist.reduce((acc, product) => {
    const key = product.brand || 'Other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const topBrands = Object.entries(brandCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Saved pieces</p>
        <h1>Your wishlist</h1>
        <p className={styles.subtitle}>
          Keep the outfits you like in one place and move them to checkout when you are ready.
        </p>
        <div className={styles.actions}>
          <Link href="/services/instastyle/catalog" className={styles.primaryAction}>Continue shopping</Link>
          <Link href="/services/instastyle/profile" className={styles.secondaryAction}>Open profile</Link>
        </div>
      </section>

      <section className={styles.summaryStrip}>
        <article className={styles.summaryCard}>
          <span>Saved pieces</span>
          <strong>{wishlist.length}</strong>
        </article>
        <article className={styles.summaryCard}>
          <span>Total value</span>
          <strong>₹{totalValue.toLocaleString()}</strong>
        </article>
        <article className={styles.summaryCard}>
          <span>Average piece</span>
          <strong>₹{averageValue.toLocaleString()}</strong>
        </article>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Saved for later</h2>
          <span>{wishlist.length} items</span>
        </div>

        {wishlist.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No products saved yet. Tap the heart icon on any product to add it here.</p>
            <Link href="/services/instastyle/catalog" className={styles.primaryAction}>Browse catalog</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {wishlist.map((product) => (
              <article key={product.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  {product.image ? (
                    <Image src={product.image} alt={product.name} fill className={styles.image} sizes="(max-width: 980px) 50vw, 25vw" />
                  ) : (
                    <div className={styles.imageFallback} aria-hidden="true" />
                  )}
                </div>
                <div className={styles.cardBody}>
                  <h3>{product.name}</h3>
                  <p>{product.brand}</p>
                  <strong>₹{(product.discountedPrice || product.price).toLocaleString()}</strong>
                  <div className={styles.cardActions}>
                    <Link href={`/services/instastyle/products/${product.id}`} className={styles.cardLink}>View</Link>
                    <button type="button" onClick={() => removeFromWishlist(product.id)} className={styles.removeBtn}>Remove</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {wishlist.length > 1 && (
        <section className={styles.discoveryPanel}>
          <div className={styles.discoveryHeader}>
            <h3>Your style mix</h3>
            <span>Top labels in your wishlist</span>
          </div>
          <div className={styles.discoveryList}>
            {topBrands.map(([brand, count]) => (
              <div key={brand} className={styles.discoveryItem}>
                <strong>{brand}</strong>
                <span>{count} picks</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}