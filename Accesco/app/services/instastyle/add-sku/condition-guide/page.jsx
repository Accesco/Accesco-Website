'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './condition-guide.module.css';

const ASSESSABLE_ITEMS = [
  {
    id: 'ai_item_1',
    brand: 'ZARA',
    name: 'Wool Blend Blazer',
    grade: 'Grade B',
    gradeTitle: 'Good Condition',
    score: 87,
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80',
    fabric: 'Good — Minor surface fuzz',
    wear: 'Minor signs on elbow lining',
    details: 'All original buttons intact',
    estimatedValue: 899,
  },
  {
    id: 'ai_item_2',
    brand: 'H&M',
    name: 'Linen Relaxed Trousers',
    grade: 'Grade A',
    gradeTitle: 'Like New',
    score: 94,
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=80',
    fabric: 'Pristine — Zero discoloration',
    wear: 'Unworn feel, original creases',
    details: 'Hemline and pockets intact',
    estimatedValue: 1349,
  },
  {
    id: 'ai_item_3',
    brand: 'InstaStyle Thrift',
    name: 'Vintage Denim Jacket',
    grade: 'Grade C',
    gradeTitle: 'Fair Condition',
    score: 68,
    img: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=200&q=80',
    fabric: 'Distressed vintage wash',
    wear: 'Visible fraying on cuffs',
    details: 'Patina hardware & vintage tags',
    estimatedValue: 749,
  },
];

export default function InstaStyleConditionGuidePage() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(ASSESSABLE_ITEMS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(true);

  const runAiRescan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1200);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className={styles.headerTitle}>AI Condition Guide & Sell</h1>
        <div style={{ width: 36 }} />
      </header>

      <main className={styles.container}>
        {/* Item Switcher Tabs */}
        <div className={styles.sectionLabel}>SELECT ITEM FOR AI INSPECTION</div>
        <div className={styles.itemTabs}>
          {ASSESSABLE_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`${styles.itemTab} ${selectedItem.id === item.id ? styles.itemTabActive : ''}`}
              onClick={() => { setSelectedItem(item); setScanComplete(true); }}
            >
              {item.brand} {item.name}
            </button>
          ))}
        </div>

        {/* Main Condition Card */}
        <div className={styles.conditionCard}>
          <div className={styles.conditionLeft}>
            <div className={styles.conditionMetaLabel}>AI INSPECTION ASSESSMENT</div>
            <h2 className={styles.gradeTitle}>{selectedItem.grade}</h2>
            <div className={styles.goodPill}>{selectedItem.gradeTitle}</div>
            <div className={styles.estimatedVal}>Estimated Sell Price: <strong>₹{selectedItem.estimatedValue.toLocaleString('en-IN')}</strong></div>
          </div>
          <div className={styles.thumbWrap}>
            <img
              src={selectedItem.img}
              alt={selectedItem.name}
              className={styles.itemThumb}
              onError={(e) => { e.target.src = 'https://placehold.co/200x200/F5F5F5/111111?text=Item'; }}
            />
            {isScanning && <div className={styles.scanLine} />}
          </div>
        </div>

        {/* AI Confidence Progress Box */}
        <div className={styles.confidenceCard}>
          <div className={styles.confidenceHeader}>
            <div className={styles.aiLabelWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span>AI Neural Vision Confidence</span>
            </div>
            <span className={styles.confidenceScore}>{selectedItem.score}%</span>
          </div>

          <div className={styles.progressTrack}>
            <div
              className={styles.progressBar}
              style={{ width: `${selectedItem.score}%` }}
            />
          </div>

          <div className={styles.confidenceFooter}>
            <p className={styles.confidenceNote}>
              Assessed via computer vision analyzing fabric texture, stitching integrity, brand markers, and discoloration.
            </p>
            <button className={styles.rescanBtn} onClick={runAiRescan} disabled={isScanning}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              {isScanning ? 'Scanning...' : 'Re-scan with AI'}
            </button>
          </div>
        </div>

        {/* Condition Breakdown */}
        <div className={styles.sectionLabel} style={{ marginTop: 28 }}>INSPECTION BREAKDOWN</div>

        <div className={styles.overviewCardGroup}>
          <div className={styles.overviewRow}>
            <div className={styles.overviewLeft}>
              <div className={styles.rowIconWrap}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <span className={styles.rowLabel}>Fabric Integrity</span>
                <span className={styles.rowDetail}>{selectedItem.fabric}</span>
              </div>
            </div>
          </div>

          <div className={styles.overviewRow}>
            <div className={styles.overviewLeft}>
              <div className={styles.rowIconWrap}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <span className={styles.rowLabel}>Wear & Tear Analysis</span>
                <span className={styles.rowDetail}>{selectedItem.wear}</span>
              </div>
            </div>
          </div>

          <div className={styles.overviewRow}>
            <div className={styles.overviewLeft}>
              <div className={styles.rowIconWrap}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <span className={styles.rowLabel}>Hardware & Details</span>
                <span className={styles.rowDetail}>{selectedItem.details}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grades Meaning Grid */}
        <div className={styles.sectionLabel} style={{ marginTop: 28 }}>GRADING SYSTEM STANDARDS</div>

        <div className={styles.gradesGrid}>
          {/* Grade A */}
          <div className={`${styles.gradeBox} ${selectedItem.grade === 'Grade A' ? styles.gradeBoxSelected : ''}`}>
            <div className={styles.gradeBoxLetter}>A</div>
            <div className={styles.gradeBoxTitle}>Excellent / Pristine</div>
            <p className={styles.gradeBoxDesc}>Like new with zero visible wear or defects.</p>
            <div className={styles.gradeBoxRangePill}>80–100% Score</div>
          </div>

          {/* Grade B */}
          <div className={`${styles.gradeBox} ${selectedItem.grade === 'Grade B' ? styles.gradeBoxSelected : ''}`}>
            <div className={styles.gradeBoxLetter}>B</div>
            <div className={styles.gradeBoxTitle}>Good / Pre-Loved</div>
            <p className={styles.gradeBoxDesc}>Slight signs of wear, fully maintained.</p>
            <div className={styles.gradeBoxRangePill}>50–79% Score</div>
          </div>

          {/* Grade C */}
          <div className={`${styles.gradeBox} ${selectedItem.grade === 'Grade C' ? styles.gradeBoxSelected : ''}`}>
            <div className={styles.gradeBoxLetter}>C</div>
            <div className={styles.gradeBoxTitle}>Fair / Vintage</div>
            <p className={styles.gradeBoxDesc}>Visible wear, priced dynamically.</p>
            <div className={styles.gradeBoxRangePill}>Below 50%</div>
          </div>
        </div>

        {/* Action Button */}
        <button
          className={styles.uploadBtn}
          onClick={() => router.push('/services/instastyle/thrift')}
        >
          List Item for Sale / Thrift
        </button>
      </main>
    </div>
  );
}
