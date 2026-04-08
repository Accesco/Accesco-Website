'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { products } from '@/lib/mockData';
import styles from './swipestyle.module.css';

const SWIPE_THRESHOLD = 95;

function getSlotForProduct(product) {
  const text = `${product?.name || ''} ${product?.subcategory || ''} ${product?.category || ''}`.toLowerCase();

  if (/(dress|gown|jumpsuit|kurta|co-ord|onesie)/.test(text)) return 'fullLook';
  if (/(jacket|blazer|hoodie|coat|shrug|outer)/.test(text)) return 'outerwear';
  if (/(jean|pant|trouser|short|skirt|lower|jogger|track)/.test(text)) return 'bottomwear';
  if (/(shoe|sneaker|heel|sandal|loafer|boot)/.test(text)) return 'footwear';
  if (/(watch|bag|cap|hat|belt|wallet|glass|jewelry|necklace|earring)/.test(text)) return 'accessory';
  return 'topwear';
}

const SLOT_LABELS = {
  topwear: 'Topwear',
  bottomwear: 'Bottomwear',
  fullLook: 'Full Look',
  outerwear: 'Outerwear',
  footwear: 'Footwear',
  accessory: 'Accessory',
};

export default function SwipeStylePage() {
  const swipePool = useMemo(
    () => products.filter((product) => product.images?.[0]?.url).slice(0, 40),
    []
  );

  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [startX, setStartX] = useState(null);
  const [outfit, setOutfit] = useState({
    topwear: null,
    bottomwear: null,
    fullLook: null,
    outerwear: null,
    footwear: null,
    accessory: null,
  });
  const [likedCount, setLikedCount] = useState(0);

  const current = swipePool[index % swipePool.length];

  const advance = () => {
    setIndex((prev) => (prev + 1) % swipePool.length);
    setDragX(0);
    setStartX(null);
  };

  const swipe = (direction) => {
    if (!current) return;

    if (direction === 'right') {
      const slot = getSlotForProduct(current);
      setOutfit((prev) => ({ ...prev, [slot]: current }));
      setLikedCount((prev) => prev + 1);
    }

    advance();
  };

  const onPointerDown = (e) => {
    setStartX(e.clientX);
  };

  const onPointerMove = (e) => {
    if (startX === null) return;
    setDragX(e.clientX - startX);
  };

  const onPointerUp = () => {
    if (Math.abs(dragX) > SWIPE_THRESHOLD) {
      swipe(dragX > 0 ? 'right' : 'left');
      return;
    }
    setDragX(0);
    setStartX(null);
  };

  const cardRotation = Math.max(-16, Math.min(16, dragX / 14));
  const likeOpacity = dragX > 0 ? Math.min(1, dragX / 110) : 0;
  const nopeOpacity = dragX < 0 ? Math.min(1, Math.abs(dragX) / 110) : 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/services/instastyle" className={styles.backLink}>
          Back
        </Link>
        <div>
          <h1 className={styles.title}>SwipeStyle Discovery</h1>
          <p className={styles.subtitle}>Swipe right to add pieces, left to skip, and build your outfit.</p>
        </div>
      </header>

      <main className={styles.layout}>
        <section className={styles.deckSection}>
          <div className={styles.deckHint}>Left swipe = Skip | Right swipe = Add to outfit</div>

          {current && (
            <article
              className={styles.card}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{ transform: `translateX(${dragX}px) rotate(${cardRotation}deg)` }}
            >
              <span className={styles.badgeLike} style={{ opacity: likeOpacity }}>
                ADD
              </span>
              <span className={styles.badgeNope} style={{ opacity: nopeOpacity }}>
                SKIP
              </span>

              <img src={current.images[0].url} alt={current.name} className={styles.cardImage} />

              <div className={styles.cardBody}>
                <p className={styles.brand}>{current.brand}</p>
                <h2 className={styles.name}>{current.name}</h2>
                <p className={styles.price}>₹{current.price.toLocaleString('en-IN')}</p>
              </div>
            </article>
          )}

          <div className={styles.actions}>
            <button className={styles.skipBtn} onClick={() => swipe('left')}>
              Swipe Left
            </button>
            <button className={styles.addBtn} onClick={() => swipe('right')}>
              Swipe Right
            </button>
          </div>
        </section>

        <aside className={styles.outfitSection}>
          <div className={styles.outfitHeader}>
            <h3>Your Outfit</h3>
            <span>{likedCount} picks</span>
          </div>

          <div className={styles.slotGrid}>
            {Object.entries(SLOT_LABELS).map(([slotKey, label]) => {
              const item = outfit[slotKey];
              return (
                <div key={slotKey} className={styles.slotCard}>
                  <p className={styles.slotLabel}>{label}</p>
                  {item ? (
                    <div className={styles.slotItem}>
                      <img src={item.images?.[0]?.url} alt={item.name} className={styles.slotThumb} />
                      <div>
                        <p className={styles.slotName}>{item.name}</p>
                        <p className={styles.slotMeta}>{item.brand}</p>
                      </div>
                    </div>
                  ) : (
                    <p className={styles.emptySlot}>No selection yet</p>
                  )}
                </div>
              );
            })}
          </div>

          <Link href="/services/instastyle/catalog" className={styles.ctaLink}>
            Continue to Catalog
          </Link>
        </aside>
      </main>
    </div>
  );
}
