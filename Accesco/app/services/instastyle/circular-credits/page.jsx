'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './circular-credits.module.css';

const ALL_ACTIVITIES = [
  { id: 'act_1', type: 'earned', title: 'Donation Completed', sub: 'To Udyan Care NGO', amt: '+30', date: '12 Sep 2026' },
  { id: 'act_2', type: 'earned', title: 'Item Sold', sub: 'Striped Cotton Shirt', amt: '+20', date: '10 Sep 2026' },
  { id: 'act_3', type: 'earned', title: 'Item Sold', sub: 'Ribbed Knit Top', amt: '+15', date: '08 Sep 2026' },
  { id: 'act_4', type: 'earned', title: 'Referral Bonus', sub: 'Rahul joined InstaStyle', amt: '+10', date: '05 Sep 2026' },
  { id: 'act_5', type: 'earned', title: 'Try & Return Completed', sub: 'Linen Trousers — Size 32', amt: '+899', date: '01 Sep 2026' },
  { id: 'act_6', type: 'redeemed', title: 'Voucher Redeemed', sub: '₹200 Off Storewide Purchase', amt: '-200', date: '28 Aug 2026' },
  { id: 'act_7', type: 'earned', title: 'AI Condition Grade', sub: 'Grade A Assessment', amt: '+50', date: '25 Aug 2026' },
  { id: 'act_8', type: 'redeemed', title: 'Free Delivery Applied', sub: 'Order #AC-1890', amt: '-100', date: '20 Aug 2026' },
];

const VOUCHERS = [
  {
    id: 'v_200',
    label: '₹200 Off',
    prefix: 'CIRCULAR200',
    discount: 200,
    type: 'flat',
    desc: 'Get ₹200 off on your next purchase',
    cost: 200,
    badge: 'Most Popular',
    color: '#111111',
  },
  {
    id: 'v_500',
    label: '₹500 Off',
    prefix: 'CIRCULAR500',
    discount: 500,
    type: 'flat',
    desc: 'Get ₹500 off on orders above ₹2000',
    cost: 500,
    badge: 'Best Value',
    color: '#111111',
  },
  {
    id: 'v_ship',
    label: 'Free Shipping',
    prefix: 'FREESHIP',
    discount: 40,
    type: 'flat',
    desc: 'Free delivery on your next order',
    cost: 100,
    badge: 'Quick Redeem',
    color: '#111111',
  },
  {
    id: 'v_thrift',
    label: '30% Off Thrift',
    prefix: 'THRIFT30',
    discount: 30,
    type: 'percent',
    desc: 'Discount on pre-loved circular fashion',
    cost: 350,
    badge: 'Circular',
    color: '#111111',
  },
];

const EARN_STEPS = [
  {
    id: 'step_return',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
    title: 'Try & Return',
    desc: 'Return any item with your next delivery for instant refund credits',
    pts: '+Full Item Price',
  },
  {
    id: 'step_ai',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: 'AI Condition Grade',
    desc: 'Upload & grade pre-loved apparel condition (Grade A–C)',
    pts: '+25–100 pts',
  },
  {
    id: 'step_donate',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Donate Apparel',
    desc: 'Donate clothes to partner NGOs via InstaStyle Thrift',
    pts: '+30 pts/item',
  },
  {
    id: 'step_refer',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Refer Friends',
    desc: 'Earn bonus credits for every friend who joins InstaStyle',
    pts: '+10 pts/ref',
  },
  {
    id: 'step_shop',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    title: 'Shop Circular Items',
    desc: 'Earn credits on every circular fashion purchase',
    pts: '+5 pts/₹100',
  },
];

export default function InstaStyleCircularCreditsPage() {
  const router = useRouter();
  const [credits, setCredits] = useState(1918);
  const [activities, setActivities] = useState(ALL_ACTIVITIES);
  const [activeFilter, setActiveFilter] = useState('all');

  // Modals
  const [showEarnModal, setShowEarnModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [redeemedVouchers, setRedeemedVouchers] = useState([]);
  const [redeemSuccess, setRedeemSuccess] = useState(null); // stores { label, secretCode }
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('instastyle_circular_credits');
      if (stored) setCredits(Number(stored));
      const storedVouchers = localStorage.getItem('instastyle_vouchers');
      if (storedVouchers) setRedeemedVouchers(JSON.parse(storedVouchers));
      const storedActs = localStorage.getItem('instastyle_activity_log');
      if (storedActs) setActivities(JSON.parse(storedActs));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const filteredActivities = activities.filter((a) => {
    if (activeFilter === 'all') return true;
    return a.type === activeFilter;
  });

  const recentActivities = filteredActivities.slice(0, 4);

  const handleRedeemVoucher = (voucher) => {
    if (credits < voucher.cost) return;

    // Generate secret promo code
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const secretCode = `${voucher.prefix}-${randomHex}`;

    const newCredits = credits - voucher.cost;
    setCredits(newCredits);

    const newVoucherItem = {
      ...voucher,
      secretCode,
      redeemedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    const newVouchers = [...redeemedVouchers, newVoucherItem];
    setRedeemedVouchers(newVouchers);

    const newActivity = {
      id: `act_r_${Date.now()}`,
      type: 'redeemed',
      title: 'Voucher Redeemed',
      sub: `${voucher.label} (Code: ${secretCode})`,
      amt: `-${voucher.cost}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    const updatedActivities = [newActivity, ...activities];
    setActivities(updatedActivities);

    try {
      localStorage.setItem('instastyle_circular_credits', newCredits.toString());
      localStorage.setItem('instastyle_vouchers', JSON.stringify(newVouchers));
      localStorage.setItem('accesco_user_vouchers', JSON.stringify(newVouchers));
      localStorage.setItem('instastyle_activity_log', JSON.stringify(updatedActivities));
    } catch (e) {
      console.error(e);
    }

    setRedeemSuccess({ label: voucher.label, secretCode });
  };

  const copyToClipboard = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className={styles.headerTitle}>Circular Credits</h1>
        <div className={styles.headerSpacer} />
      </header>

      <main className={styles.container}>
        {/* Credits Dashboard Box */}
        <div className={styles.creditsCard}>
          <div className={styles.creditsCardInner}>
            <div>
              <div className={styles.creditsMetaLabel}>AVAILABLE BALANCE</div>
              <div className={styles.creditsVal}>{credits.toLocaleString('en-IN')}</div>
              <p className={styles.creditsDesc}>Redeem points to generate exclusive promo codes for cart checkout.</p>
            </div>
            <div className={styles.creditsBadge}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.75">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </div>
          </div>

          <div className={styles.creditsActions}>
            <button className={styles.howToEarnBtn} onClick={() => setShowEarnModal(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              How to Earn Credits
            </button>
            <button className={styles.redeemCardBtn} onClick={() => setShowRedeemModal(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
              Redeem Vouchers
            </button>
          </div>
        </div>

        {/* Active Vouchers & Secret Codes Box */}
        {redeemedVouchers.length > 0 && (
          <div className={styles.activeVouchersSection}>
            <h3 className={styles.sectionTitle}>YOUR REDEEMED PROMO CODES (APPLY AT CART)</h3>
            <div className={styles.activeVouchersList}>
              {redeemedVouchers.map((v, i) => (
                <div key={i} className={styles.activeVoucherCard}>
                  <div className={styles.voucherCardTop}>
                    <span className={styles.activeVoucherLabel}>{v.label}</span>
                    <span className={styles.activeVoucherDate}>Redeemed {v.redeemedAt}</span>
                  </div>
                  <div className={styles.secretCodeBox}>
                    <span className={styles.secretCodeText}>{v.secretCode}</span>
                    <button
                      className={styles.copyCodeBtn}
                      onClick={() => copyToClipboard(v.secretCode)}
                    >
                      {copiedCode === v.secretCode ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Section */}
        <div className={styles.activityHeader}>
          <h2 className={styles.activityTitle}>RECENT ACTIVITY</h2>
          <button className={styles.viewAllLink} onClick={() => setShowAllModal(true)}>
            View All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Clean Filter Tabs */}
        <div className={styles.filterTabs}>
          {[
            { key: 'all', label: 'All History' },
            { key: 'earned', label: 'Earned' },
            { key: 'redeemed', label: 'Redeemed' },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`${styles.filterTab} ${activeFilter === tab.key ? styles.filterTabActive : ''}`}
              onClick={() => setActiveFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Activity Card Box */}
        <div className={styles.activityCardGroup}>
          {recentActivities.length === 0 ? (
            <div className={styles.emptyActivity}>No {activeFilter} activity recorded yet.</div>
          ) : (
            recentActivities.map((act) => (
              <div key={act.id} className={styles.activityRow}>
                <div className={styles.actLeft}>
                  <div
                    className={styles.actDot}
                    style={{ background: act.type === 'earned' ? '#2E7D32' : '#111111' }}
                  />
                  <div>
                    <div className={styles.actTitle}>{act.title}</div>
                    <div className={styles.actSub}>{act.sub}</div>
                  </div>
                </div>
                <div className={styles.actRight}>
                  <span
                    className={styles.actAmt}
                    style={{ color: act.amt.startsWith('+') ? '#2E7D32' : '#111111' }}
                  >
                    {act.amt}
                  </span>
                  <span className={styles.actDate}>{act.date}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Redeem Button CTA */}
        <button className={styles.redeemBtn} onClick={() => setShowRedeemModal(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 12 20 22 4 22 4 12" />
            <rect x="2" y="7" width="20" height="5" />
            <line x1="12" y1="22" x2="12" y2="7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
          <span>Redeem Credits for Promo Codes</span>
        </button>
      </main>

      {/* ── HOW TO EARN MODAL ── */}
      {showEarnModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEarnModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>How to Earn Circular Credits</h2>
              <button className={styles.modalClose} onClick={() => setShowEarnModal(false)}>✕</button>
            </div>
            <p className={styles.modalSubtitle}>Contribute to sustainable fashion and earn credits automatically.</p>

            <div className={styles.earnSteps}>
              {EARN_STEPS.map((step) => (
                <div key={step.id} className={styles.earnStep}>
                  <div className={styles.earnStepIconWrap}>{step.icon}</div>
                  <div className={styles.earnStepContent}>
                    <div className={styles.earnStepTitle}>{step.title}</div>
                    <div className={styles.earnStepDesc}>{step.desc}</div>
                  </div>
                  <div className={styles.earnStepPts}>{step.pts}</div>
                </div>
              ))}
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.modalPrimaryBtn}
                onClick={() => { setShowEarnModal(false); router.push('/services/instastyle/try-return'); }}
              >
                Start Try & Return
              </button>
              <button className={styles.modalSecondaryBtn} onClick={() => setShowEarnModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REDEEM CREDITS MODAL ── */}
      {showRedeemModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRedeemModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Redeem Vouchers</h2>
              <button className={styles.modalClose} onClick={() => setShowRedeemModal(false)}>✕</button>
            </div>

            <div className={styles.redeemBalance}>
              <span className={styles.redeemBalanceLabel}>Your Credit Balance</span>
              <span className={styles.redeemBalanceVal}>{credits.toLocaleString('en-IN')} pts</span>
            </div>

            {/* Revealed Secret Code Success Card */}
            {redeemSuccess && (
              <div className={styles.revealedCodeCard}>
                <div className={styles.revealedCodeHeader}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Voucher Redeemed Successfully!</span>
                </div>
                <div className={styles.revealedCodeTitle}>{redeemSuccess.label} Secret Promo Code:</div>
                <div className={styles.secretCodeDisplayRow}>
                  <code className={styles.secretCodeTextBig}>{redeemSuccess.secretCode}</code>
                  <button
                    className={styles.copyCodeBtnBig}
                    onClick={() => copyToClipboard(redeemSuccess.secretCode)}
                  >
                    {copiedCode === redeemSuccess.secretCode ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
                <p className={styles.revealedCodeNote}>Paste this code at Checkout / Cart to apply discount.</p>
              </div>
            )}

            <div className={styles.voucherGrid}>
              {VOUCHERS.map((v) => {
                const canAfford = credits >= v.cost;
                return (
                  <div
                    key={v.id}
                    className={`${styles.voucherCard} ${!canAfford ? styles.voucherCardDisabled : ''}`}
                  >
                    <div className={styles.voucherBadge}>{v.badge}</div>
                    <div className={styles.voucherLabel}>{v.label}</div>
                    <div className={styles.voucherDesc}>{v.desc}</div>
                    <div className={styles.voucherCost}>{v.cost} pts</div>
                    <button
                      className={styles.voucherRedeemBtn}
                      disabled={!canAfford}
                      onClick={() => handleRedeemVoucher(v)}
                    >
                      {canAfford ? 'Redeem Secret Code' : 'Insufficient Points'}
                    </button>
                  </div>
                );
              })}
            </div>

            <button className={styles.modalSecondaryBtn} onClick={() => setShowRedeemModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── VIEW ALL ACTIVITY MODAL ── */}
      {showAllModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAllModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Activity History</h2>
              <button className={styles.modalClose} onClick={() => setShowAllModal(false)}>✕</button>
            </div>

            <div className={styles.filterTabs} style={{ marginBottom: 16 }}>
              {[
                { key: 'all', label: 'All History' },
                { key: 'earned', label: 'Earned' },
                { key: 'redeemed', label: 'Redeemed' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`${styles.filterTab} ${activeFilter === tab.key ? styles.filterTabActive : ''}`}
                  onClick={() => setActiveFilter(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={styles.allActivityList}>
              {filteredActivities.length === 0 ? (
                <div className={styles.emptyActivity}>No {activeFilter} activity recorded yet.</div>
              ) : (
                filteredActivities.map((act) => (
                  <div key={act.id} className={styles.activityRow}>
                    <div className={styles.actLeft}>
                      <div
                        className={styles.actDot}
                        style={{ background: act.type === 'earned' ? '#2E7D32' : '#111111' }}
                      />
                      <div>
                        <div className={styles.actTitle}>{act.title}</div>
                        <div className={styles.actSub}>{act.sub}</div>
                      </div>
                    </div>
                    <div className={styles.actRight}>
                      <span
                        className={styles.actAmt}
                        style={{ color: act.amt.startsWith('+') ? '#2E7D32' : '#111111' }}
                      >
                        {act.amt}
                      </span>
                      <span className={styles.actDate}>{act.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className={styles.modalSecondaryBtn} onClick={() => setShowAllModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
