"use client";



import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

const DEFAULT_BUDGETS = { grokly: 8000, swadishtt: 6000, instastyle: 4000 };

function CategoryIcon({ type }) {
  if (type === 'grocery') {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M6.2 6.4h14l-1.8 7.2H8L6.2 6.4Z"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.2 6.4 5.5 3.8H3.5"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="9"
          cy="18.7"
          r="1.2"
          stroke="currentColor"
          strokeWidth="1.35"
        />
        <circle
          cx="17.2"
          cy="18.7"
          r="1.2"
          stroke="currentColor"
          strokeWidth="1.35"
        />
      </svg>
    );
  }

  if (type === 'food') {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M6.5 3.5v7.2"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
        <path
          d="M4.5 3.5v5.2c0 1.8.9 2.9 2.5 2.9s2.5-1.1 2.5-2.9V3.5"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 11.6v8.8"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
        <path
          d="M16.5 3.5v16.9"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
        <path
          d="M16.5 3.5c2.1 2 3.2 4.4 3.2 7.8"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5.2c1.6 0 2.8-1 2.8-2.3"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M8.2 6.8 5 9.1l2.1 3.2 1.7-1.1v8.1h6.4v-8.1l1.7 1.1L19 9.1l-3.2-2.3c-.7-.5-1.4-.8-2.3-.8h-3c-.9 0-1.6.3-2.3.8Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const rupee = (num) => `₹${Number(num || 0).toLocaleString('en-IN')}`;

function formatK(value) {
  if (!value) return '0';
  if (value >= 1000) {
    const k = value / 1000;
    return `${Number.isInteger(k) ? k : k.toFixed(1)}K`;
  }
  return String(Math.round(value));
}

const DONUT_DOTS = ['#8a0048', '#c94f80', '#ead1df'];

function buildDonutGradient(breakdown) {
  if (!breakdown || !breakdown.length) return '#ead1df';
  let cursor = 0;
  const stops = breakdown.map((b, idx) => {
    const start = cursor;
    cursor += b.pct;
    return `${DONUT_DOTS[idx % DONUT_DOTS.length]} ${start}% ${cursor}%`;
  });
  if (cursor < 100) stops.push(`#ead1df ${cursor}% 100%`);
  return `conic-gradient(${stops.join(', ')})`;
}

function getSavedUserName() {
  return 'User';
}

function XpmStatusBar() {
  return (
    <div className="xpm-status">
      <span>10:30</span>
      <span>⌁ ◉ ▰</span>
    </div>
  );
}

function XpmProgress({ value = 68 }) {
  return (
    <div className="xpm-progress">
      <i style={{ width: `${value}%` }} />
    </div>
  );
}

function XpmDarkButton({ children, onClick, className = '' }) {
  return (
    <button type="button" className={`xpm-dark-btn ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
function XpmBottomNav() {
  const items = [
    {
      label: 'Home',
      active: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4.5 11.5L12 5.5L19.5 11.5V19.5H14.5V14.5H9.5V19.5H4.5V11.5Z" />
        </svg>
      ),
    },
    {
      label: 'Orders',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M6 5.5H18V19H6V5.5Z" />
          <path d="M9 9H15" />
          <path d="M9 12H15" />
          <path d="M9 15H13" />
        </svg>
      ),
    },
    {
      label: 'Xpense Meter',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="4.5" y="5.5" width="15" height="13" rx="2" />
          <path d="M7.5 14H9.5L11 10L13.5 17L15 12H17" />
        </svg>
      ),
    },
    {
      label: 'Cart',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 6H7L8.5 14.5H17L19 8H8" />
          <circle cx="10" cy="18" r="1.2" />
          <circle cx="17" cy="18" r="1.2" />
        </svg>
      ),
    },
    {
      label: 'Profile',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8.5" r="3" />
          <path d="M6.5 19C7.4 15.8 9.3 14.2 12 14.2C14.7 14.2 16.6 15.8 17.5 19" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="xpm-bottom-nav">
      {items.map((item) => (
        <div
          key={item.label}
          className={`xpm-nav-item ${item.active ? 'active' : ''}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}

      <div className="xpm-home-indicator" />
    </nav>
  );
}


function XpmIntroHeader() {
  return (
    <header className="xpm-intro-header">
      <button type="button" className="xpm-intro-menu" aria-label="Menu">
        <span />
        <span />
        <span />
      </button>

      <div className="xpm-intro-brand">
        <Image src="/images/accesco_original.png" alt="Accesco Living" width={42} height={42} />
        <strong>Accesco Living</strong>
      </div>

      <button type="button" className="xpm-intro-bell" aria-label="Notifications">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M18 16.2H6c1.2-1.1 1.7-2.5 1.7-4.5V10c0-2.7 1.7-4.6 4.3-4.6s4.3 1.9 4.3 4.6v1.7c0 2 .5 3.4 1.7 4.5Z" />
          <path d="M10 18.2c.4.7 1.1 1.1 2 1.1s1.6-.4 2-1.1" />
        </svg>
      </button>
    </header>
  );
}


export default function XpenseMobileFlow({
  user,
  summary,
  summaryLoading,
  monthLabel,
  onSaveBudget,
  onRequestLogin,
}) {
  const [screen, setScreen] = useState('intro');
  const userName = user?.name || 'User';

  const [budgets, setBudgets] = useState(DEFAULT_BUDGETS);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (summary?.budgets) setBudgets(summary.budgets);
  }, [summary]);

  const totalBudget = useMemo(() => {
    return budgets.grokly + budgets.swadishtt + budgets.instastyle;
  }, [budgets]);

  const updateBudget = (key, value) => {
    setBudgets((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const platformSpend = useMemo(() => {
    const byKey = { grokly: 0, swadishtt: 0, instastyle: 0 };
    (summary?.platforms || []).forEach((p) => {
      byKey[p.key] = p.spent;
    });
    return byKey;
  }, [summary]);

  const totalSpend = summary?.totalSpend || 0;
  const spendPct = summary?.totalBudget ? Math.min(100, Math.round((totalSpend / summary.totalBudget) * 100)) : 0;
  const grokly = summary?.platformDetails?.grokly;
  const groklyPlatform = summary?.platforms?.find((p) => p.key === 'grokly');
  const groklyWeekly = grokly?.weeklySpend || [];
  const groklyMaxWeekly = Math.max(1, ...groklyWeekly.map((w) => w.amount));
  const groklyTopItems = grokly?.topItems || [];

  const goToBudget = () => {
    if (!user) return onRequestLogin?.();
    setSaveError('');
    setScreen('budget');
  };

  const handleConfirmBudget = async () => {
    if (!user) return onRequestLogin?.();
    setSaving(true);
    setSaveError('');
    const result = await onSaveBudget?.(totalBudget, budgets);
    setSaving(false);
    if (result?.success) {
      setScreen('summary');
    } else if (result?.error) {
      setSaveError(result.error);
    }
  };

  return (
    <section className="xpm-mobile-flow">
      <div className="xpm-device">
       {screen === 'intro' && (
  <>
    <XpmIntroHeader />

    <main className="xpm-scroll xpm-intro-scroll-with-header">
              <section className="xpm-panel">
                <h1>Xpense Meter</h1>
                <p>
                  Transform your financial habits with intelligent expense tracking
                  and predictive analytics.
                </p>

                <XpmDarkButton onClick={() => setScreen('launch')}>
                  Launch Calculator
                </XpmDarkButton>
              </section>

              <button className="xpm-month">{monthLabel}⌄</button>

              <section className="xpm-panel">
                <div className="xpm-spend-header">
  <div>
    <span className="xpm-label">This Month Spend</span>
    <strong className="xpm-amount">{rupee(totalSpend)}</strong>
    <small>of {rupee(summary?.totalBudget || totalBudget)} budget</small>
  </div>

  <span className="xpm-percent-pill">{spendPct}%</span>
</div>

<XpmProgress value={spendPct} />

{summary?.monthOverMonthChangePct != null && (
  <div className="xpm-trend-row">
    <span className="xpm-trend-arrow">{summary.monthOverMonthChangePct >= 0 ? '↗' : '↘'}</span>
    <span>{Math.abs(summary.monthOverMonthChangePct)}% from last month</span>
  </div>
)}

<div className="xpm-three-cards">
                  <article>
                    <b>{rupee(platformSpend.grokly)}</b>
                    <span>Grokly</span>
                  </article>
                  <article>
                    <b>{rupee(platformSpend.swadishtt)}</b>
                    <span>Swadishtt</span>
                  </article>
                  <article>
                    <b>{rupee(platformSpend.instastyle)}</b>
                    <span>InstaStyle</span>
                  </article>
                </div>
              </section>

          <section className="xpm-panel xpm-budget-row">
  <div>
    <span>Your Budget</span>
    <small>Total Budget</small>
    <strong>{rupee(summary?.totalBudget || totalBudget)}</strong>
  </div>

  <button type="button" onClick={goToBudget}>
    Edit Budget →
  </button>
</section>

              <XpmDarkButton className="xpm-wide" onClick={() => setScreen('dashboard')}>
                View Full Dashboard
              </XpmDarkButton>
            </main>
          </>
        )}

 {screen === 'launch' && (
  <div className="xpm-launch-screen">
    <div className="xpm-new-badge">NEW</div>

    <div className="xpm-launch-copy">
      <h1>XPENSE METER</h1>
      <p>
        See it. Understand it
        <br />
        Spend it better.
      </p>
    </div>

    <div className="xpm-rider-wrap">
      <Image
        src="/images/delivery_xpenseMeter.png"
        alt="Xpense Meter delivery rider"
        className="xpm-rider-img"
        width={561}
        height={633}
      />
    </div>

    <div className="xpm-launch-white-base" />

    <div className="xpm-launch-footer">
      <div className="xpm-launch-points">
        <div>
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 4v8h7" />
          </svg>
          <span>All your spending in one place</span>
        </div>

        <div>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 3 19 6v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6l7-3Z" />
          </svg>
          <span>Smart insights, just for you</span>
        </div>

        <div>
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="6" y="10" width="12" height="10" rx="2" />
            <path d="M9 10V7a3 3 0 0 1 6 0v3" />
          </svg>
          <span>Private &amp; Secure. Always.</span>
        </div>
      </div>

      <button
        type="button"
        className="xpm-launch-real-btn"
        onClick={() => setScreen('home')}
      >
        Explore My Spend
      </button>
    </div>
  </div>
)}

        {screen === 'home' && (
          <>
           

            <header className="xpm-home-head">
              <div>
                <strong>Hi, {userName}!</strong>
                <span>What are we getting today?</span>
              </div>

              <div className="xpm-head-icons">
                <span>⌕</span>
                <span>♧</span>
                <span>⌂</span>
              </div>
            </header>

            <main className="xpm-scroll xpm-has-nav">
              <section className="xpm-panel">
                <div className="xpm-title-line">
                  <h2>Xpense Meter</h2>
                  <span>This Month</span>
                </div>

                <span className="xpm-label">You’ve spent</span>
                <strong className="xpm-amount">{rupee(totalSpend)}</strong>
                <small>of {rupee(summary?.totalBudget || totalBudget)} budget used</small>

                <XpmProgress value={spendPct} />

                <div className="xpm-three-cards">
                  <button type="button" onClick={() => setScreen('grokly')}>
                    <b>{rupee(platformSpend.grokly)}</b>
                    <span>Grokly</span>
                  </button>
                  <button type="button">
                    <b>{rupee(platformSpend.swadishtt)}</b>
                    <span>Swadishtt</span>
                  </button>
                  <button type="button">
                    <b>{rupee(platformSpend.instastyle)}</b>
                    <span>InstaStyle</span>
                  </button>
                </div>

                <button type="button" className="xpm-insight" onClick={() => setScreen('dashboard')}>
                  {!user
                    ? 'Log in to track your real spend.'
                    : summaryLoading
                      ? 'Loading your spend…'
                      : summary?.onTrack === false
                        ? "You're spending faster than your budget pace."
                        : "You're on track with your budget."}
                  <span>See full picture</span>
                </button>
              </section>

              <div className="xpm-section-title">
                <h3>Recommended for you</h3>
                <button type="button">See all</button>
              </div>

              <section className="xpm-products">
                <article>
                  <Image
                    src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=300&q=80"
                    alt="Banana"
                    width={300}
                    height={52}
                    style={{ width: '100%', height: '52px', objectFit: 'cover' }}
                  />
                  <b>Banana</b>
                  <span>₹45</span>
                </article>

                <article>
                  <Image
                    src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=300&q=80"
                    alt="Paneer"
                    width={300}
                    height={52}
                    style={{ width: '100%', height: '52px', objectFit: 'cover' }}
                  />
                  <b>Paneer</b>
                  <span>₹120</span>
                </article>

                <article>
                  <Image
                    src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=80"
                    alt="Oats"
                    width={300}
                    height={52}
                    style={{ width: '100%', height: '52px', objectFit: 'cover' }}
                  />
                  <b>Oats</b>
                  <span>₹99</span>
                </article>
              </section>
            </main>

            <XpmBottomNav />
          </>
        )}

        {screen === 'dashboard' && (
          <>
           

            <header className="xpm-page-head">
              <button type="button" onClick={() => setScreen('home')}>←</button>
              <strong>Xpense Meter</strong>
            </header>

            <main className="xpm-scroll">
              <button className="xpm-month">{monthLabel}⌄</button>

              <section className="xpm-panel">
                <span className="xpm-label">Total Doorstep spend</span>
                <strong className="xpm-amount">{rupee(totalSpend)}</strong>
                <small>of {rupee(summary?.totalBudget || totalBudget)} budget</small>

                <XpmProgress value={spendPct} />

                <div className="xpm-donut-row">
                  <div className="xpm-donut" style={{ background: buildDonutGradient(summary?.breakdown) }} />
                  <ul>
                    {(summary?.breakdown || []).length === 0 && <li>No spend yet this month</li>}
                    {(summary?.breakdown || []).map((b) => (
                      <li key={b.key}>{b.name} {rupee(b.amount)} ({b.pct}%)</li>
                    ))}
                  </ul>
                </div>
              </section>

              <div className="xpm-dashboard-cards">
                <button type="button" onClick={() => setScreen('grokly')}>
                  <b>{rupee(platformSpend.grokly)}</b>
                  <span>Grokly</span>
                </button>
                <button type="button">
                  <b>{rupee(platformSpend.swadishtt)}</b>
                  <span>Swadishtt</span>
                </button>
                <button type="button">
                  <b>{rupee(platformSpend.instastyle)}</b>
                  <span>InstaStyle</span>
                </button>
              </div>

              <button type="button" className="xpm-insight">
                {summary?.onTrack === false ? "Watch your spend!" : "You’re on track!"}
                <span>{summary?.onTrack === false ? 'You are spending faster than your budget pace.' : 'Keep it up, you’re doing great.'}</span>
              </button>

              <section className="xpm-panel xpm-budget-row">
                <div>
                  <span>Your monthly budget</span>
                  <strong>{rupee(summary?.totalBudget || totalBudget)}</strong>
                  <small>{rupee(summary?.remaining)} remaining</small>
                </div>

                <button type="button" onClick={goToBudget}>
                  Edit Budget ↗
                </button>
              </section>
            </main>
          </>
        )}

      {screen === 'grokly' && (
  <>
    <header className="xpm-page-head xpm-grokly-head">
      <button type="button" onClick={() => setScreen('dashboard')}>←</button>
      <strong>Grokly</strong>
    </header>

    <main className="xpm-scroll xpm-grokly-scroll">
      <section className="xpm-detail-hero">
        <span>This Month Spend</span>
        <strong>{rupee(platformSpend.grokly)}</strong>
        <small>of {rupee(groklyPlatform?.budget)} budget</small>
      </section>

      <section className="xpm-chart-section">
        <h3 className="xpm-subtitle">Week by Week Spend</h3>

        <div className="xpm-bar-chart">
          <div className="xpm-chart-y-axis">
            <span>{formatK(groklyMaxWeekly)}</span>
            <span>{formatK(groklyMaxWeekly / 2)}</span>
            <span>0</span>
          </div>

          <div className="xpm-bar-chart-bars">
            {groklyWeekly.map((w, index) => (
              <div className="xpm-bar-item" key={w.week}>
                <i style={{ height: Math.max(2, Math.round((w.amount / groklyMaxWeekly) * 108)) }} />
                <span>W{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="xpm-top-items-section">
        <h3 className="xpm-subtitle">Top {groklyTopItems.length || ''} Most Ordered Items</h3>

        <div className="xpm-panel xpm-list xpm-grokly-list">
          {groklyTopItems.length === 0 && <div className="xpm-item-row"><span>No Grokly orders yet this month.</span></div>}
          {groklyTopItems.map((item) => (
            <div key={item.name} className="xpm-item-row">
              <span className="xpm-item-left">
                <span className="xpm-item-icon">🛒</span>
                <span>{item.name}</span>
              </span>

              <b>{rupee(item.amount)}</b>
            </div>
          ))}
        </div>
      </section>

      <div className="xpm-two-stats xpm-grokly-stats">
        <article>
          <span>Last Month</span>
          <b>
            {grokly?.lastMonthChangePct == null
              ? '—'
              : `${grokly.lastMonthChangePct >= 0 ? '↑' : '↓'} ${Math.abs(grokly.lastMonthChangePct)}%`}
          </b>
        </article>

        <article>
          <span>Orders per week</span>
          <b>{grokly?.ordersPerWeek ?? 0}</b>
        </article>
      </div>

      <button
        type="button"
        className="xpm-dark-btn xpm-grokly-budget-btn"
        onClick={goToBudget}
      >
        Set Budget for Grokly
      </button>
    </main>
  </>
)}

        {screen === 'budget' && (
          <>
          

            <header className="xpm-page-head">
              <button type="button" onClick={() => setScreen('dashboard')}>←</button>
              <strong>Set Your Budget</strong>
            </header>

            <main className="xpm-scroll xpm-budget-scroll">
              <p className="xpm-budget-note">
                Based on your past orders and similar households in your city.
                We suggest:
              </p>

              <section className="xpm-budget-card">
                <div>
                  <strong>Grokly</strong>
                  <span>{rupee(budgets.grokly)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max={Math.max(12000, budgets.grokly)}
                  step="500"
                  value={budgets.grokly}
                  onChange={(e) => updateBudget('grokly', e.target.value)}
                />
                <small>
                  <span>1K</span>
                  <span>{formatK(Math.max(12000, budgets.grokly))}</span>
                </small>
              </section>

              <section className="xpm-budget-card">
                <div>
                  <strong>Swadishtt</strong>
                  <span>{rupee(budgets.swadishtt)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max={Math.max(10000, budgets.swadishtt)}
                  step="500"
                  value={budgets.swadishtt}
                  onChange={(e) => updateBudget('swadishtt', e.target.value)}
                />
                <small>
                  <span>1K</span>
                  <span>{formatK(Math.max(10000, budgets.swadishtt))}</span>
                </small>
              </section>

              <section className="xpm-budget-card">
                <div>
                  <strong>InstaStyle</strong>
                  <span>{rupee(budgets.instastyle)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max={Math.max(8000, budgets.instastyle)}
                  step="500"
                  value={budgets.instastyle}
                  onChange={(e) => updateBudget('instastyle', e.target.value)}
                />
                <small>
                  <span>1K</span>
                  <span>{formatK(Math.max(8000, budgets.instastyle))}</span>
                </small>
              </section>

              <section className="xpm-panel xpm-total">
                <span>Total Monthly Budget</span>
                <strong>{rupee(totalBudget)}</strong>
                <small>You can change this anytime</small>
              </section>

              {saveError && <p className="xpm-budget-note" style={{ color: '#c0304a' }}>{saveError}</p>}

              <XpmDarkButton className="xpm-wide" onClick={handleConfirmBudget}>
                {saving ? 'Saving…' : 'Looks Good ✓'}
              </XpmDarkButton>
            </main>
          </>
        )}

        {screen === 'summary' && (
          <>

            <header className="xpm-page-head">
              <button type="button" onClick={() => setScreen('budget')}>←</button>
              <strong>{monthLabel} Summary</strong>
            </header>

            <main className="xpm-scroll">
              <section className="xpm-success">
                <div>✓</div>
                <strong>{summary?.onTrack === false ? `Keep going, ${userName}!` : `Great job, ${userName}!`}</strong>
                <span>
                  {summary?.onTrack === false
                    ? "You're spending a bit faster than planned this month."
                    : 'You are staying within your budget this month.'}
                </span>
              </section>

              <section className="xpm-panel xpm-summary-grid">
                <div>
                  <span>Total Spend</span>
                  <strong>{rupee(totalSpend)}</strong>
                  <small>of {rupee(totalBudget)}</small>
                </div>

                <div>
                  <span>Budget Used</span>
                  <strong>{summary?.percentUsed ?? 0}%</strong>
                </div>

                <XpmProgress value={Math.min(100, summary?.percentUsed ?? 0)} />
              </section>

              <section className="xpm-panel">
                <span className="xpm-label">Biggest Category</span>
                {summary?.breakdown?.length ? (
                  <>
                    <strong>{summary.breakdown[0].name}</strong>
                    <p>{rupee(summary.breakdown[0].amount)} ({summary.breakdown[0].pct}%)</p>
                  </>
                ) : (
                  <strong>No spend yet</strong>
                )}
              </section>

              <section className="xpm-panel">
                <span className="xpm-label">Next month</span>
                <strong>{rupee(totalBudget)}</strong>
                <button type="button" className="xpm-link-btn" onClick={() => setScreen('budget')}>
                  Review &amp; Edit →
                </button>
              </section>
            </main>
          </>
        )}
      </div>

      <style jsx>{`
        .xpm-mobile-flow {
          display: none;
        }

        @media (max-width: 768px) {
          .xpm-mobile-flow {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 999999;
            background: #343b4f;
            overflow-y: auto;
            padding: 8px 0 28px;
          }

          .xpm-device {
            width: min(92vw, 390px);
            height: 820px;
            margin: 0 auto;
            background: #fffaf4;
            border-radius: 22px;
            overflow: hidden;
            position: relative;
            color: #111;
            font-family: 'Sora', sans-serif;
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.36);
          }

          .xpm-status {
            height: 26px;
            padding: 0 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 11px;
            font-weight: 800;
          }

          .xpm-main-head {
            height: 88px;
            display: grid;
            grid-template-columns: 36px 1fr 36px;
            align-items: center;
            padding: 0 14px;
            border-bottom: 1px solid rgba(122, 0, 66, 0.12);
          }

          .xpm-clear-btn {
            border: none;
            background: transparent;
            color: #111;
            font-size: 20px;
          }

          .xpm-logo-block {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }

          .xpm-logo-block img {
            width: 36px;
            height: 36px;
            object-fit: contain;
          }

          .xpm-logo-block strong {
            font-size: 13px;
            font-weight: 800;
          }

          .xpm-scroll {
            height: calc(100% - 114px);
            overflow-y: auto;
            padding: 14px 14px 92px;
          }

          .xpm-scroll::-webkit-scrollbar {
            display: none;
          }

          .xpm-has-nav {
            height: calc(100% - 148px);
          }

          .xpm-panel {
            background: #fff;
            border: 1px solid rgba(122, 0, 66, 0.14);
            border-radius: 12px;
            padding: 14px;
            margin-bottom: 12px;
          }

          .xpm-panel h1 {
            font-size: 16px;
            margin: 0 0 10px;
          }

          .xpm-panel p {
            font-size: 11px;
            line-height: 1.45;
            margin: 0 0 12px;
          }

          .xpm-dark-btn {
            width: 100%;
            height: 42px;
            border: none;
            border-radius: 8px;
            background: linear-gradient(180deg, #686868 0%, #242424 44%, #050505 100%);
            color: #fff;
            font-size: 12px;
            font-weight: 800;
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.45),
              0 10px 20px rgba(0, 0, 0, 0.18);
          }

          .xpm-wide {
            margin-top: 8px;
          }

          .xpm-month {
            border: 1px solid rgba(122, 0, 66, 0.14);
            background: #fff;
            border-radius: 8px;
            padding: 7px 10px;
            font-size: 11px;
            margin: 0 0 12px;
          }

          .xpm-label,
          .xpm-panel small {
            display: block;
            font-size: 10px;
            color: #333;
            margin-bottom: 4px;
          }

          .xpm-amount {
            display: block;
            font-size: 24px;
            line-height: 1.1;
            margin-bottom: 4px;
          }

          .xpm-progress {
            height: 7px;
            border-radius: 999px;
            background: #e8d6df;
            overflow: hidden;
            margin-top: 10px;
          }

          .xpm-progress i {
            display: block;
            height: 100%;
            border-radius: 999px;
            background: #8a0048;
          }

          .xpm-three-cards,
          .xpm-dashboard-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-top: 12px;
          }

          .xpm-three-cards article,
          .xpm-three-cards button,
          .xpm-dashboard-cards button {
            border: 1px solid rgba(138, 0, 72, 0.25);
            background: #f4d8e7;
            color: #111;
            border-radius: 8px;
            padding: 10px 7px;
            text-align: center;
          }

          .xpm-three-cards b,
          .xpm-dashboard-cards b {
            display: block;
            font-size: 12px;
          }

          .xpm-three-cards span,
          .xpm-dashboard-cards span {
            display: block;
            font-size: 9px;
            margin-top: 2px;
          }

          .xpm-budget-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .xpm-budget-row span {
            font-size: 10px;
          }

          .xpm-budget-row strong {
            display: block;
            font-size: 16px;
          }

          .xpm-budget-row button,
          .xpm-link-btn {
            border: none;
            background: transparent;
            color: #111;
            font-size: 10px;
            padding: 0;
          }

          .xpm-launch-screen {
            height: 100%;
            position: relative;
            background: radial-gradient(circle at 50% 20%, #b50063 0%, #8a0048 58%, #76003e 100%);
            color: #fff;
            overflow: hidden;
          }

          .xpm-launch-screen .xpm-status {
            color: #fff;
          }

          .xpm-new-badge {
            width: fit-content;
            margin: 12px auto 18px;
            padding: 4px 12px;
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.28);
            font-size: 11px;
            font-weight: 700;
          }

          .xpm-launch-copy {
            text-align: center;
          }

          .xpm-launch-copy h1 {
            margin: 0;
            font-size: 28px;
            letter-spacing: -0.055em;
          }

          .xpm-launch-copy p {
            margin: 8px 0 18px;
            font-size: 13px;
            line-height: 1.3;
          }

          .xpm-rider-art {
            height: 330px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .xpm-scooter {
            font-size: 165px;
            filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.28));
          }

          .xpm-launch-info {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 74px;
            background: #fffaf4;
            color: #111;
            border-radius: 26px 26px 0 0;
            padding: 18px 28px 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-size: 11px;
          }

          .xpm-launch-action {
            position: absolute;
            left: 18px;
            right: 18px;
            bottom: 20px;
            width: auto;
          }

          .xpm-home-head,
          .xpm-page-head {
            height: 64px;
            padding: 0 14px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid rgba(122, 0, 66, 0.12);
          }

          .xpm-home-head {
            justify-content: space-between;
          }

          .xpm-home-head strong {
            display: block;
            font-size: 13px;
          }

          .xpm-home-head span {
            display: block;
            font-size: 10px;
          }

          .xpm-head-icons {
            display: flex;
            gap: 12px;
            font-size: 14px;
          }

          .xpm-page-head {
            gap: 8px;
          }

          .xpm-page-head button {
            border: none;
            background: transparent;
            font-size: 17px;
          }

          .xpm-page-head strong {
            font-size: 13px;
          }

          .xpm-title-line {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .xpm-title-line h2 {
            margin: 0 0 8px;
            font-size: 14px;
          }

          .xpm-title-line span {
            font-size: 9px;
          }

          .xpm-insight {
            width: 100%;
            margin-top: 12px;
            border: none;
            border-radius: 9px;
            padding: 12px;
            background: linear-gradient(180deg, #bd6a98, #8a0048);
            color: #fff;
            font-size: 11px;
            font-weight: 800;
          }

          .xpm-insight span {
            display: block;
            font-size: 10px;
            font-weight: 500;
          }

          .xpm-section-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 14px 0 8px;
          }

          .xpm-section-title h3 {
            margin: 0;
            font-size: 12px;
          }

          .xpm-section-title button {
            border: none;
            background: transparent;
            color: #8a0048;
            font-size: 10px;
          }

          .xpm-products {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }

          .xpm-products article {
            background: #fff;
            border: 1px solid rgba(122, 0, 66, 0.12);
            border-radius: 9px;
            padding: 10px;
          }

          .xpm-products img {
            width: 100%;
            height: 52px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 8px;
          }

          .xpm-products b {
            display: block;
            font-size: 10px;
          }

          .xpm-products span {
            font-size: 9px;
          }

          .xpm-bottom-nav {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 58px;
            background: #fffaf4;
            border-top: 1px solid rgba(122, 0, 66, 0.12);
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            align-items: center;
            text-align: center;
            font-size: 9px;
          }

          .xpm-bottom-nav b {
            color: #8a0048;
          }

          .xpm-donut-row {
            display: grid;
            grid-template-columns: 118px 1fr;
            gap: 12px;
            align-items: center;
            margin-top: 14px;
          }

          .xpm-donut {
            width: 105px;
            height: 105px;
            border-radius: 50%;
            background: conic-gradient(#8a0048 0 68%, #ead1df 68% 100%);
            position: relative;
          }

          .xpm-donut::after {
            content: '';
            position: absolute;
            inset: 24px;
            border-radius: 50%;
            background: #fff;
          }

          .xpm-donut-row ul {
            margin: 0;
            padding-left: 12px;
            font-size: 10px;
            line-height: 1.7;
          }

          .xpm-detail-hero {
            padding: 18px 0 8px;
          }

          .xpm-detail-hero span,
          .xpm-detail-hero small {
            display: block;
            font-size: 10px;
          }

          .xpm-detail-hero strong {
            display: block;
            font-size: 26px;
            margin: 4px 0;
          }

          .xpm-subtitle {
            font-size: 11px;
            margin: 16px 0 8px;
          }

          .xpm-bar-chart {
            height: 128px;
            border-bottom: 1px solid #999;
            display: flex;
            align-items: flex-end;
            justify-content: space-around;
            padding: 0 14px;
          }

          .xpm-bar-chart div {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
          }

          .xpm-bar-chart i {
            width: 18px;
            background: #8a0048;
            border-radius: 4px 4px 0 0;
          }

          .xpm-bar-chart span {
            font-size: 9px;
          }

          .xpm-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .xpm-list div {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
          }

          .xpm-two-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 12px 0;
          }

          .xpm-two-stats article {
            background: #fff;
            border: 1px solid rgba(122, 0, 66, 0.12);
            border-radius: 10px;
            padding: 12px;
          }

          .xpm-two-stats span {
            display: block;
            font-size: 10px;
            margin-bottom: 5px;
          }

          .xpm-two-stats b {
            font-size: 13px;
            color: #8a0048;
          }

          .xpm-budget-note {
            font-size: 11px;
            line-height: 1.45;
            margin: 12px 0 16px;
          }

          .xpm-budget-card {
            background: #fff;
            border: 1px solid rgba(122, 0, 66, 0.14);
            border-radius: 12px;
            padding: 14px;
            margin-bottom: 12px;
          }

          .xpm-budget-card div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }

          .xpm-budget-card strong {
            font-size: 13px;
            color: #8a0048;
          }

          .xpm-budget-card span {
            font-size: 12px;
            font-weight: 800;
          }

          .xpm-budget-card input {
            width: 100%;
            accent-color: #8a0048;
          }

          .xpm-budget-card small {
            display: flex;
            justify-content: space-between;
            font-size: 9px;
          }

          .xpm-total span,
          .xpm-total small {
            display: block;
            font-size: 10px;
          }

          .xpm-total strong {
            display: block;
            color: #8a0048;
            font-size: 24px;
            margin: 4px 0;
          }

          .xpm-success {
            text-align: center;
            padding: 46px 12px 24px;
          }

          .xpm-success div {
            width: 54px;
            height: 54px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: #13b66b;
            color: #fff;
            margin: 0 auto 22px;
            font-size: 28px;
          }

          .xpm-success strong {
            display: block;
            font-size: 16px;
            margin-bottom: 4px;
          }

          .xpm-success span {
            font-size: 11px;
            color: #555;
          }

          .xpm-summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .xpm-summary-grid .xpm-progress {
            grid-column: 1 / -1;
          }
        }

        /* FIX MOBILE BOTTOM NAV */
.xpm-bottom-nav {
  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  height: 68px !important;
  background: #fffaf4 !important;
  border-top: 1px solid rgba(122, 0, 66, 0.14) !important;
  display: grid !important;
  grid-template-columns: repeat(5, 1fr) !important;
  align-items: center !important;
  padding: 6px 8px 14px !important;
  box-sizing: border-box !important;
  z-index: 20 !important;
}

.xpm-bottom-nav button {
  border: 0 !important;
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  min-width: 0 !important;
  height: 46px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px !important;
  color: #111 !important;
  font-family: 'Sora', sans-serif !important;
  font-size: 8px !important;
  font-weight: 500 !important;
  line-height: 1 !important;
  text-align: center !important;
  white-space: nowrap !important;
}

.xpm-bottom-nav button svg {
  width: 16px !important;
  height: 16px !important;
  stroke: currentColor !important;
  stroke-width: 1.8 !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
  fill: none !important;
  flex-shrink: 0 !important;
}

.xpm-bottom-nav button span {
  display: block !important;
  font-size: 8px !important;
  line-height: 1 !important;
  color: currentColor !important;
}

.xpm-bottom-nav button.active {
  color: #8a0048 !important;
  font-weight: 700 !important;
}

.xpm-bottom-nav button.active span {
  color: #8a0048 !important;
}

.xpm-home-indicator {
  position: absolute !important;
  left: 50% !important;
  bottom: 4px !important;
  transform: translateX(-50%) !important;
  width: 58px !important;
  height: 3px !important;
  border-radius: 999px !important;
  background: #111 !important;
  opacity: 0.9 !important;
}
        /* REMOVE TOP HEADER SPACE ON MOBILE INTRO */
.xpm-intro-scroll {
  height: 100% !important;
  padding-top: 18px !important;
}

/* FIX DEFAULT GREY BUTTON BOXES IN MOBILE BOTTOM NAV */
.xpm-bottom-nav {
  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  height: 68px !important;
  background: #fffaf4 !important;
  border-top: 1px solid rgba(122, 0, 66, 0.14) !important;
  display: grid !important;
  grid-template-columns: repeat(5, 1fr) !important;
  align-items: center !important;
  padding: 6px 8px 14px !important;
  box-sizing: border-box !important;
  z-index: 50 !important;
}

.xpm-bottom-nav button {
  appearance: none !important;
  -webkit-appearance: none !important;
  border: none !important;
  outline: none !important;
  background: transparent !important;
  box-shadow: none !important;

  padding: 0 !important;
  margin: 0 !important;
  min-width: 0 !important;
  width: 100% !important;
  height: 46px !important;

  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px !important;

  color: #111 !important;
  font-family: 'Sora', sans-serif !important;
  font-size: 8px !important;
  font-weight: 500 !important;
  line-height: 1 !important;
  text-align: center !important;
  white-space: nowrap !important;
  cursor: pointer !important;
}

.xpm-bottom-nav button svg {
  width: 16px !important;
  height: 16px !important;
  stroke: currentColor !important;
  stroke-width: 1.8 !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
  fill: none !important;
  display: block !important;
  flex-shrink: 0 !important;
}

.xpm-bottom-nav button span {
  display: block !important;
  color: currentColor !important;
  font-size: 8px !important;
  line-height: 1 !important;
  margin: 0 !important;
  padding: 0 !important;
}

.xpm-bottom-nav button.active {
  color: #8a0048 !important;
  font-weight: 700 !important;
}

.xpm-home-indicator {
  position: absolute !important;
  left: 50% !important;
  bottom: 4px !important;
  transform: translateX(-50%) !important;
  width: 58px !important;
  height: 3px !important;
  border-radius: 999px !important;
  background: #111 !important;
  opacity: 0.9 !important;
}


/* FINAL FIX — MOBILE BOTTOM NAV */
:global(.xpm-bottom-nav) {
  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  height: 68px !important;
  background: #fffaf4 !important;
  border-top: 1px solid rgba(122, 0, 66, 0.14) !important;
  display: grid !important;
  grid-template-columns: repeat(5, 1fr) !important;
  align-items: center !important;
  padding: 6px 8px 14px !important;
  box-sizing: border-box !important;
  z-index: 999 !important;
}

:global(.xpm-nav-item) {
  width: 100% !important;
  height: 46px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px !important;
  color: #111 !important;
  font-family: 'Sora', sans-serif !important;
  font-size: 8px !important;
  font-weight: 500 !important;
  line-height: 1 !important;
  text-align: center !important;
  white-space: nowrap !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

:global(.xpm-nav-item svg) {
  width: 16px !important;
  height: 16px !important;
  display: block !important;
  fill: none !important;
  stroke: currentColor !important;
  stroke-width: 1.8 !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
  flex-shrink: 0 !important;
}

:global(.xpm-nav-item svg path),
:global(.xpm-nav-item svg rect),
:global(.xpm-nav-item svg circle) {
  fill: none !important;
  stroke: currentColor !important;
  stroke-width: 1.8 !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
}

:global(.xpm-nav-item span) {
  display: block !important;
  font-size: 8px !important;
  line-height: 1 !important;
  color: currentColor !important;
  margin: 0 !important;
  padding: 0 !important;
}

:global(.xpm-nav-item.active) {
  color: #8a0048 !important;
  font-weight: 700 !important;
}

:global(.xpm-home-indicator) {
  position: absolute !important;
  left: 50% !important;
  bottom: 4px !important;
  transform: translateX(-50%) !important;
  width: 58px !important;
  height: 3px !important;
  border-radius: 999px !important;
  background: #111 !important;
  opacity: 0.9 !important;
}

/* REDUCE BOTTOM NAV PADDING + INCREASE FONT SIZE */
:global(.xpm-bottom-nav) {
  height: 58px !important;
  padding: 4px 6px 10px !important;
}

:global(.xpm-nav-item) {
  height: 42px !important;
  gap: 3px !important;
  font-size: 9.5px !important;
}

:global(.xpm-nav-item svg) {
  width: 15px !important;
  height: 15px !important;
}

:global(.xpm-nav-item span) {
  font-size: 9.5px !important;
  line-height: 1.05 !important;
  font-weight: 500 !important;
}

:global(.xpm-nav-item.active span) {
  font-weight: 700 !important;
}

:global(.xpm-home-indicator) {
  bottom: 3px !important;
}

/* FINAL MOBILE INTRO CSS — MAKE IT MATCH FIGMA COMPACT VERSION */

:global(.xpm-mobile-flow) {
  display: none;
}

@media (max-width: 768px) {
  :global(.xpm-mobile-flow) {
    display: block !important;
    position: fixed !important;
    inset: 0 !important;
    z-index: 999999 !important;
    background: #343b4f !important;
    overflow-y: auto !important;
    padding: 0 !important;
  }

  :global(.xpm-device) {
    width: min(100vw, 390px) !important;
    height: 100vh !important;
    margin: 0 auto !important;
    background: #fffaf4 !important;
    border-radius: 0 0 20px 20px !important;
    overflow: hidden !important;
    position: relative !important;
    color: #111 !important;
    font-family: 'Sora', sans-serif !important;
    box-shadow: none !important;
  }

  :global(.xpm-scroll) {
    height: 100% !important;
    overflow-y: auto !important;
    padding: 10px 0 16px !important;
    background: #fffaf4 !important;
  }

  :global(.xpm-scroll::-webkit-scrollbar) {
    display: none !important;
  }

  :global(.xpm-panel) {
    width: calc(100% - 2px) !important;
    margin: 0 0 12px !important;
    padding: 10px 8px !important;
    background: #ffffff !important;
    border: 1px solid rgba(138, 0, 72, 0.18) !important;
    border-radius: 7px !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08) !important;
    box-sizing: border-box !important;
  }

  :global(.xpm-panel h1) {
    margin: 0 0 20px !important;
    color: #111 !important;
    font-size: 15px !important;
    font-weight: 800 !important;
    line-height: 1.1 !important;
  }

  :global(.xpm-panel p) {
    margin: 0 0 10px !important;
    color: #111 !important;
    font-size: 10.5px !important;
    font-weight: 400 !important;
    line-height: 1.35 !important;
  }

  :global(.xpm-dark-btn) {
    appearance: none !important;
    -webkit-appearance: none !important;
    width: 100% !important;
    height: 34px !important;
    border: none !important;
    border-radius: 5px !important;
    background: linear-gradient(180deg, #747474 0%, #2a2a2a 45%, #050505 100%) !important;
    color: #ffffff !important;
    font-family: 'Sora', sans-serif !important;
    font-size: 13px !important;
    font-weight: 700 !important;
    letter-spacing: 0 !important;
    line-height: 1 !important;
    text-transform: none !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.55),
      0 7px 14px rgba(0, 0, 0, 0.22) !important;
    cursor: pointer !important;
  }

  :global(.xpm-month) {
    appearance: none !important;
    -webkit-appearance: none !important;
    width: fit-content !important;
    height: 26px !important;
    margin: 10px 0 12px !important;
    padding: 0 10px !important;
    border: 1px solid rgba(138, 0, 72, 0.25) !important;
    border-radius: 999px !important;
    background: #fff !important;
    color: #111 !important;
    font-family: 'Sora', sans-serif !important;
    font-size: 10px !important;
    font-weight: 700 !important;
    text-transform: none !important;
    display: inline-flex !important;
    align-items: center !important;
  }

  :global(.xpm-label),
  :global(.xpm-panel small) {
    display: block !important;
    margin: 0 0 3px !important;
    color: #111 !important;
    font-size: 10px !important;
    font-weight: 400 !important;
    line-height: 1.2 !important;
  }

  :global(.xpm-amount) {
    display: block !important;
    margin: 0 0 2px !important;
    color: #111 !important;
    font-size: 21px !important;
    font-weight: 800 !important;
    line-height: 1.05 !important;
  }

  :global(.xpm-progress) {
    width: 100% !important;
    height: 7px !important;
    margin: 9px 0 5px !important;
    background: #cfc5c8 !important;
    border-radius: 999px !important;
    overflow: hidden !important;
  }

  :global(.xpm-progress i) {
    display: block !important;
    height: 100% !important;
    background: #8a0048 !important;
    border-radius: 999px !important;
  }

  :global(.xpm-three-cards) {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 8px !important;
    margin-top: 14px !important;
  }

  :global(.xpm-three-cards article),
  :global(.xpm-three-cards button) {
    min-height: 64px !important;
    padding: 10px 4px !important;
    border: 1px solid rgba(138, 0, 72, 0.28) !important;
    border-radius: 7px !important;
    background: #f3cfe2 !important;
    color: #111 !important;
    text-align: center !important;
    box-sizing: border-box !important;
  }

  :global(.xpm-three-cards b) {
    display: block !important;
    margin: 0 0 2px !important;
    font-size: 14px !important;
    font-weight: 800 !important;
    line-height: 1.1 !important;
  }

  :global(.xpm-three-cards span) {
    display: block !important;
    font-size: 10px !important;
    font-weight: 400 !important;
    line-height: 1.1 !important;
  }

  :global(.xpm-budget-row) {
    min-height: 58px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 10px 8px !important;
  }

  :global(.xpm-budget-row span) {
    display: block !important;
    color: #111 !important;
    font-size: 10px !important;
    font-weight: 400 !important;
    line-height: 1.1 !important;
  }

  :global(.xpm-budget-row strong) {
    display: block !important;
    color: #111 !important;
    font-size: 17px !important;
    font-weight: 800 !important;
    line-height: 1.1 !important;
  }

  :global(.xpm-budget-row button) {
    border: none !important;
    background: transparent !important;
    color: #111 !important;
    font-size: 10px !important;
    font-weight: 700 !important;
    padding: 0 !important;
    margin: 0 !important;
    white-space: nowrap !important;
  }

  :global(.xpm-wide) {
    margin: 0 !important;
  }
}

/* FINAL INTRO SCREEN SIDE PADDING + DETAILS */
@media (max-width: 768px) {
  :global(.xpm-scroll) {
    height: 100% !important;
    overflow-y: auto !important;
    padding: 10px 8px 18px !important;
    background: #fffaf4 !important;
    box-sizing: border-box !important;
  }

  :global(.xpm-panel) {
    width: 100% !important;
    margin: 0 0 12px !important;
    padding: 10px 8px !important;
    background: #ffffff !important;
    border: 1px solid rgba(138, 0, 72, 0.18) !important;
    border-radius: 7px !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08) !important;
    box-sizing: border-box !important;
  }

  :global(.xpm-panel h1) {
    margin: 0 0 18px !important;
    font-size: 15px !important;
    font-weight: 800 !important;
    line-height: 1.1 !important;
    color: #111 !important;
  }

  :global(.xpm-panel p) {
    margin: 0 0 10px !important;
    font-size: 10.5px !important;
    line-height: 1.35 !important;
    color: #111 !important;
  }

  :global(.xpm-dark-btn) {
    height: 34px !important;
    border-radius: 5px !important;
    font-size: 13px !important;
    font-weight: 700 !important;
    text-transform: none !important;
  }

  :global(.xpm-month) {
    height: 26px !important;
    margin: 8px 0 12px !important;
    padding: 0 10px !important;
    border-radius: 999px !important;
    font-size: 10px !important;
    font-weight: 700 !important;
  }

  :global(.xpm-spend-header) {
    display: flex !important;
    align-items: flex-end !important;
    justify-content: space-between !important;
    gap: 12px !important;
  }

  :global(.xpm-label),
  :global(.xpm-panel small) {
    display: block !important;
    margin: 0 0 3px !important;
    color: #111 !important;
    font-size: 10px !important;
    font-weight: 400 !important;
    line-height: 1.15 !important;
  }

  :global(.xpm-amount) {
    display: block !important;
    margin: 0 0 2px !important;
    color: #111 !important;
    font-size: 21px !important;
    font-weight: 800 !important;
    line-height: 1.05 !important;
  }

  :global(.xpm-percent-pill) {
    min-width: 34px !important;
    height: 18px !important;
    padding: 0 8px !important;
    border-radius: 999px !important;
    background: #ead1df !important;
    color: #8a0048 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 9px !important;
    font-weight: 800 !important;
    line-height: 1 !important;
    margin-bottom: 2px !important;
  }

  :global(.xpm-progress) {
    width: 100% !important;
    height: 7px !important;
    margin: 9px 0 6px !important;
    background: #cfc5c8 !important;
    border-radius: 999px !important;
    overflow: hidden !important;
  }

  :global(.xpm-progress i) {
    display: block !important;
    height: 100% !important;
    background: #8a0048 !important;
    border-radius: 999px !important;
  }

  :global(.xpm-trend-row) {
    display: flex !important;
    align-items: center !important;
    gap: 5px !important;
    margin: 0 0 14px !important;
    color: #111 !important;
    font-size: 10px !important;
    font-weight: 400 !important;
    line-height: 1.1 !important;
  }

  :global(.xpm-trend-arrow) {
    font-size: 14px !important;
    font-weight: 800 !important;
    line-height: 1 !important;
  }

  :global(.xpm-three-cards) {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 12px !important;
    margin-top: 0 !important;
  }

  :global(.xpm-three-cards article),
  :global(.xpm-three-cards button) {
    min-height: 60px !important;
    padding: 10px 4px !important;
    border-radius: 7px !important;
    background: #f3cfe2 !important;
    border: 1px solid rgba(138, 0, 72, 0.35) !important;
    color: #111 !important;
    text-align: center !important;
    box-sizing: border-box !important;
  }

  :global(.xpm-three-cards b) {
    display: block !important;
    margin-bottom: 2px !important;
    font-size: 14px !important;
    font-weight: 800 !important;
    line-height: 1.05 !important;
  }

  :global(.xpm-three-cards span) {
    display: block !important;
    font-size: 10px !important;
    font-weight: 400 !important;
    line-height: 1.1 !important;
  }

  :global(.xpm-budget-row) {
    min-height: 58px !important;
    padding: 9px 8px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
  }

  :global(.xpm-budget-row span) {
    display: block !important;
    font-size: 10px !important;
    font-weight: 400 !important;
    color: #111 !important;
    line-height: 1.1 !important;
  }

  :global(.xpm-budget-row small) {
    display: block !important;
    margin: 2px 0 1px !important;
    font-size: 9px !important;
    color: #111 !important;
    line-height: 1.1 !important;
  }

  :global(.xpm-budget-row strong) {
    display: block !important;
    font-size: 18px !important;
    font-weight: 800 !important;
    color: #111 !important;
    line-height: 1.05 !important;
  }

  :global(.xpm-budget-row button) {
    border: none !important;
    background: transparent !important;
    color: #111 !important;
    font-size: 10px !important;
    font-weight: 700 !important;
    padding: 0 !important;
    margin: 0 !important;
    white-space: nowrap !important;
  }

  :global(.xpm-wide) {
    margin-top: 0 !important;
  }
}

/* INCREASE MOBILE INTRO FONT SIZE + TEXT SPACING */
@media (max-width: 768px) {
  :global(.xpm-scroll) {
    padding: 14px 10px 20px !important;
  }

  :global(.xpm-panel) {
    padding: 14px 11px !important;
    margin-bottom: 14px !important;
  }

  :global(.xpm-panel h1) {
    font-size: 17px !important;
    line-height: 1.2 !important;
    margin-bottom: 18px !important;
  }

  :global(.xpm-panel p) {
    font-size: 12px !important;
    line-height: 1.45 !important;
    margin-bottom: 14px !important;
  }

  :global(.xpm-dark-btn) {
    height: 38px !important;
    font-size: 14px !important;
    font-weight: 700 !important;
  }

  :global(.xpm-month) {
    margin: 14px 0 14px !important;
    height: 28px !important;
    font-size: 11px !important;
    padding: 0 12px !important;
  }

  :global(.xpm-label) {
    font-size: 11px !important;
    line-height: 1.25 !important;
    margin-bottom: 4px !important;
  }

  :global(.xpm-amount) {
    font-size: 24px !important;
    line-height: 1.1 !important;
    margin-bottom: 4px !important;
  }

  :global(.xpm-panel small) {
    font-size: 11px !important;
    line-height: 1.25 !important;
  }

  :global(.xpm-progress) {
    margin: 12px 0 8px !important;
  }

  :global(.xpm-trend-row) {
    font-size: 11px !important;
    gap: 6px !important;
    margin-bottom: 16px !important;
  }

  :global(.xpm-three-cards) {
    gap: 12px !important;
  }

  :global(.xpm-three-cards article),
  :global(.xpm-three-cards button) {
    min-height: 66px !important;
    padding: 12px 5px !important;
  }

  :global(.xpm-three-cards b) {
    font-size: 15px !important;
    margin-bottom: 3px !important;
  }

  :global(.xpm-three-cards span) {
    font-size: 11px !important;
  }

  :global(.xpm-budget-row) {
    padding: 12px 10px !important;
    min-height: 66px !important;
  }

  :global(.xpm-budget-row span) {
    font-size: 11px !important;
    margin-bottom: 3px !important;
  }

  :global(.xpm-budget-row small) {
    font-size: 10px !important;
    margin-bottom: 3px !important;
  }

  :global(.xpm-budget-row strong) {
    font-size: 21px !important;
  }

  :global(.xpm-budget-row button) {
    font-size: 11px !important;
    font-weight: 700 !important;
  }
}
  /* BIGGER MOBILE INTRO TEXT + MORE BREATHING SPACE */
@media (max-width: 768px) {
  :global(.xpm-scroll) {
    padding: 16px 12px 22px !important;
  }

  :global(.xpm-panel) {
    padding: 16px 13px !important;
    margin-bottom: 16px !important;
  }

  :global(.xpm-panel h1) {
    font-size: 20px !important;
    line-height: 1.2 !important;
    margin-bottom: 20px !important;
  }

  :global(.xpm-panel p) {
    font-size: 13px !important;
    line-height: 1.5 !important;
    margin-bottom: 16px !important;
  }

  :global(.xpm-dark-btn) {
    height: 42px !important;
    font-size: 15px !important;
    font-weight: 700 !important;
  }

  :global(.xpm-month) {
    height: 30px !important;
    font-size: 12px !important;
    padding: 0 14px !important;
    margin: 16px 0 16px !important;
  }

  :global(.xpm-label) {
    font-size: 12px !important;
    margin-bottom: 5px !important;
  }

  :global(.xpm-amount) {
    font-size: 27px !important;
    margin-bottom: 5px !important;
  }

  :global(.xpm-panel small) {
    font-size: 12px !important;
    line-height: 1.25 !important;
  }

  :global(.xpm-percent-pill) {
    height: 20px !important;
    min-width: 38px !important;
    font-size: 10px !important;
  }

  :global(.xpm-progress) {
    height: 8px !important;
    margin: 13px 0 9px !important;
  }

  :global(.xpm-trend-row) {
    font-size: 12px !important;
    gap: 7px !important;
    margin-bottom: 18px !important;
  }

  :global(.xpm-three-cards article),
  :global(.xpm-three-cards button) {
    min-height: 72px !important;
    padding: 14px 6px !important;
  }

  :global(.xpm-three-cards b) {
    font-size: 17px !important;
    margin-bottom: 4px !important;
  }

  :global(.xpm-three-cards span) {
    font-size: 12px !important;
  }

  :global(.xpm-budget-row) {
    min-height: 74px !important;
    padding: 14px 12px !important;
  }

  :global(.xpm-budget-row span) {
    font-size: 12px !important;
  }

  :global(.xpm-budget-row small) {
    font-size: 11px !important;
  }

  :global(.xpm-budget-row strong) {
    font-size: 24px !important;
  }

  :global(.xpm-budget-row button) {
    font-size: 12px !important;
  }
}

/* MOBILE INTRO HEADER — ONLY XPENSE METER FIRST PAGE */
@media (max-width: 768px) {
  :global(.xpm-intro-header) {
    height: 104px !important;
    width: 100% !important;
    background: #fffaf4 !important;
    border-bottom: 1px solid rgba(122, 0, 66, 0.12) !important;
    display: grid !important;
    grid-template-columns: 44px 1fr 44px !important;
    align-items: center !important;
    padding: 12px 14px 10px !important;
    box-sizing: border-box !important;
  }

  :global(.xpm-intro-menu),
  :global(.xpm-intro-bell) {
    appearance: none !important;
    -webkit-appearance: none !important;
    border: none !important;
    background: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
    width: 34px !important;
    height: 34px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: #111 !important;
  }

  :global(.xpm-intro-menu) {
    flex-direction: column !important;
    gap: 5px !important;
    align-items: flex-start !important;
  }

  :global(.xpm-intro-menu span) {
    display: block !important;
    width: 24px !important;
    height: 1.5px !important;
    border-radius: 999px !important;
    background: #7b7b7b !important;
  }

  :global(.xpm-intro-brand) {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 2px !important;
    min-width: 0 !important;
  }

  :global(.xpm-intro-brand img) {
    width: 42px !important;
    height: 42px !important;
    object-fit: contain !important;
    display: block !important;
  }

  :global(.xpm-intro-brand strong) {
    color: #111 !important;
    font-family: 'Sora', sans-serif !important;
    font-size: 18px !important;
    font-weight: 800 !important;
    line-height: 1.05 !important;
    letter-spacing: -0.03em !important;
    margin-top: 2px !important;
  }

  :global(.xpm-intro-bell svg) {
    width: 21px !important;
    height: 21px !important;
    stroke: #111 !important;
    stroke-width: 1.8 !important;
    stroke-linecap: round !important;
    stroke-linejoin: round !important;
    fill: none !important;
  }

  :global(.xpm-intro-bell svg path) {
    stroke: #111 !important;
    fill: none !important;
  }

  :global(.xpm-intro-scroll-with-header) {
    height: calc(100% - 104px) !important;
    padding-top: 14px !important;
  }
}
/* LAUNCH PAGE — IMAGE + DETAILS + BUTTON */
@media (max-width: 768px) {
  :global(.xpm-launch-screen) {
    height: 100% !important;
    width: 100% !important;
    position: relative !important;
    overflow: hidden !important;
    background:
      radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.08), transparent 34%),
      linear-gradient(180deg, #a60058 0%, #98004f 44%, #8a0048 100%) !important;
    color: #ffffff !important;
    padding-top: 24px !important;
    box-sizing: border-box !important;
  }

  :global(.xpm-new-badge) {
    position: relative !important;
    z-index: 5 !important;
    width: fit-content !important;
    margin: 0 auto 26px !important;
    padding: 6px 18px !important;
    border-radius: 7px !important;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(0, 0, 0, 0.35)) !important;
    color: #ffffff !important;
    font-size: 13px !important;
    font-weight: 800 !important;
    line-height: 1 !important;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.24) !important;
  }

  :global(.xpm-launch-copy) {
    position: relative !important;
    z-index: 5 !important;
    text-align: center !important;
    padding: 0 20px !important;
  }

  :global(.xpm-launch-copy h1) {
    margin: 0 0 8px !important;
    color: #ffffff !important;
    font-size: 32px !important;
    font-weight: 800 !important;
    line-height: 1 !important;
    letter-spacing: -0.055em !important;
    text-shadow: 0 3px 7px rgba(0, 0, 0, 0.32) !important;
  }

  :global(.xpm-launch-copy p) {
    margin: 0 !important;
    color: #ffffff !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    line-height: 1.35 !important;
  }

  :global(.xpm-rider-wrap) {
    position: absolute !important;
    left: 50% !important;
    bottom: 178px !important;
    transform: translateX(-50%) !important;
    width: 100% !important;
    height: 330px !important;
    z-index: 5 !important;
    display: flex !important;
    align-items: flex-end !important;
    justify-content: center !important;
    pointer-events: none !important;
  }

  :global(.xpm-rider-img) {
    width: 330px !important;
    max-width: 98% !important;
    height: auto !important;
    object-fit: contain !important;
    display: block !important;
    filter: drop-shadow(0 18px 18px rgba(0, 0, 0, 0.35)) !important;
  }

  :global(.xpm-launch-white-base) {
    position: absolute !important;
    left: -55px !important;
    right: -55px !important;
    bottom: 0 !important;
    height: 190px !important;
    background: #fffaf4 !important;
    border-radius: 58% 58% 0 0 !important;
    z-index: 3 !important;
  }

  :global(.xpm-launch-footer) {
    position: absolute !important;
    left: 18px !important;
    right: 18px !important;
    bottom: 18px !important;
    z-index: 8 !important;
  }

  :global(.xpm-launch-points) {
    width: 100% !important;
    margin: 0 0 14px !important;
    padding: 0 42px !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 7px !important;
    color: #111 !important;
  }

  :global(.xpm-launch-points div) {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    color: #111 !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    line-height: 1.2 !important;
  }

  :global(.xpm-launch-points svg) {
    width: 18px !important;
    height: 18px !important;
    stroke: #111 !important;
    stroke-width: 1.8 !important;
    stroke-linecap: round !important;
    stroke-linejoin: round !important;
    fill: none !important;
    flex-shrink: 0 !important;
  }

  :global(.xpm-launch-real-btn) {
    appearance: none !important;
    -webkit-appearance: none !important;
    width: 100% !important;
    height: 50px !important;
    border: none !important;
    border-radius: 10px !important;
    background: linear-gradient(180deg, #747474 0%, #2c2c2c 43%, #050505 100%) !important;
    color: #ffffff !important;
    font-family: 'Sora', sans-serif !important;
    font-size: 17px !important;
    font-weight: 600 !important;
    line-height: 1 !important;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.55),
      0 9px 18px rgba(0, 0, 0, 0.25) !important;
    cursor: pointer !important;
  }
}

/* FIX LAUNCH SCREEN BACKGROUND TO MATCH RIDER IMAGE BACKGROUND */
@media (max-width: 768px) {
  :global(.xpm-launch-screen) {
    background: #7d124a !important;
    background-image: none !important;
  }

  :global(.xpm-launch-screen::before) {
    display: none !important;
  }

  :global(.xpm-rider-wrap) {
    background: transparent !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  :global(.xpm-rider-img) {
    background: transparent !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    mix-blend-mode: normal !important;
  }

  :global(.xpm-launch-white-base) {
    background: #fffaf4 !important;
  }
}

@media (max-width: 768px) {
  :global(.xpm-launch-screen) {
    background: #750942 !important;
    background-image: none !important;
  }

  :global(.xpm-launch-screen::before) {
    display: none !important;
  }

  :global(.xpm-rider-img) {
    background: transparent !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
}

/* LAUNCH SCREEN FINAL SIZE + SPACING FIX */
@media (max-width: 768px) {
  /* more breathing space at top */
  :global(.xpm-launch-screen) {
    padding-top: 34px !important;
    background: #7d124a !important;
  }

  :global(.xpm-new-badge) {
    padding: 7px 20px !important;
    font-size: 14px !important;
    margin-bottom: 34px !important;
  }

  :global(.xpm-launch-copy h1) {
    font-size: 34px !important;
    line-height: 1 !important;
    margin-bottom: 12px !important;
  }

  :global(.xpm-launch-copy p) {
    font-size: 17px !important;
    line-height: 1.4 !important;
  }

  /* increase image size and shift it upwards */
  :global(.xpm-rider-wrap) {
    bottom: 205px !important;
    height: 390px !important;
  }

  :global(.xpm-rider-img) {
    width: 385px !important;
    max-width: 108% !important;
  }

  /* increase bottom white section height and padding */
  :global(.xpm-launch-white-base) {
    height: 220px !important;
    border-radius: 60% 60% 0 0 !important;
  }

  :global(.xpm-launch-footer) {
    left: 20px !important;
    right: 20px !important;
    bottom: 20px !important;
  }

  :global(.xpm-launch-points) {
    padding: 0 44px !important;
    margin-bottom: 18px !important;
    gap: 10px !important;
  }

  :global(.xpm-launch-points div) {
    font-size: 13px !important;
    line-height: 1.25 !important;
    gap: 11px !important;
  }

  :global(.xpm-launch-points svg) {
    width: 19px !important;
    height: 19px !important;
  }

  :global(.xpm-launch-real-btn) {
    height: 54px !important;
    border-radius: 10px !important;
    font-size: 18px !important;
    font-weight: 700 !important;
  }
}

/* INCREASE WHITE CURVE / WHITE BACKGROUND AREA ON LAUNCH SCREEN */
@media (max-width: 768px) {
  :global(.xpm-launch-white-base) {
    height: 300px !important;
    left: -70px !important;
    right: -70px !important;
    bottom: 0 !important;
    border-radius: 62% 62% 0 0 !important;
    background: #fffaf4 !important;
  }

  :global(.xpm-launch-footer) {
    bottom: 24px !important;
  }

  :global(.xpm-launch-points) {
    margin-bottom: 20px !important;
  }

  /* lift image slightly so more white curve is visible below */
  :global(.xpm-rider-wrap) {
    bottom: 235px !important;
  }
}

/* MERGE RIDER IMAGE WITH WHITE BACKGROUND */
@media (max-width: 768px) {
  :global(.xpm-rider-wrap) {
    bottom: 214px !important;
    height: 410px !important;
    z-index: 5 !important;
  }

  :global(.xpm-rider-img) {
    width: 390px !important;
    max-width: 112% !important;
    background: transparent !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    display: block !important;
  }

  /* Bring white curve behind the bottom of the image */
  :global(.xpm-launch-white-base) {
    height: 315px !important;
    left: -90px !important;
    right: -90px !important;
    bottom: -8px !important;
    background: #fffaf4 !important;
    border-radius: 68% 68% 0 0 !important;
    z-index: 4 !important;
  }

  /* White fade overlay to hide the image's hard rectangular bottom edge */
  :global(.xpm-launch-screen::after) {
    content: "" !important;
    position: absolute !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 178px !important;
    height: 42px !important;
    background: linear-gradient(
      to bottom,
      rgba(255, 250, 244, 0) 0%,
      #fffaf4 82%,
      #fffaf4 100%
    ) !important;
    z-index: 6 !important;
    pointer-events: none !important;
  }

  :global(.xpm-launch-footer) {
    z-index: 8 !important;
    bottom: 24px !important;
  }
}

/* HOME TILE SCREEN — INCREASE FONT SIZE + TEXT SPACING */
@media (max-width: 768px) {
  :global(.xpm-home-head) {
    height: 76px !important;
    padding: 14px 16px !important;
  }

  :global(.xpm-home-head strong) {
    font-size: 16px !important;
    line-height: 1.2 !important;
    margin-bottom: 4px !important;
  }

  :global(.xpm-home-head span) {
    font-size: 12px !important;
    line-height: 1.3 !important;
  }

  :global(.xpm-home-head .xpm-head-icons) {
    gap: 14px !important;
    font-size: 15px !important;
  }

  :global(.xpm-has-nav) {
    padding: 16px 14px 82px !important;
  }

  :global(.xpm-title-line) {
    margin-bottom: 10px !important;
  }

  :global(.xpm-title-line h2) {
    font-size: 20px !important;
    line-height: 1.2 !important;
    margin: 0 !important;
  }

  :global(.xpm-title-line span) {
    font-size: 11px !important;
    line-height: 1.2 !important;
  }

  :global(.xpm-panel) {
    padding: 16px 14px !important;
    border-radius: 10px !important;
  }

  :global(.xpm-label) {
    font-size: 12px !important;
    line-height: 1.25 !important;
    margin-bottom: 6px !important;
  }

  :global(.xpm-amount) {
    font-size: 30px !important;
    line-height: 1.05 !important;
    margin-bottom: 6px !important;
  }

  :global(.xpm-panel small) {
    font-size: 12px !important;
    line-height: 1.3 !important;
  }

  :global(.xpm-progress) {
    height: 8px !important;
    margin: 14px 0 14px !important;
  }

  :global(.xpm-three-cards) {
    gap: 12px !important;
    margin-top: 16px !important;
  }

  :global(.xpm-three-cards button),
  :global(.xpm-three-cards article) {
    min-height: 72px !important;
    padding: 13px 6px !important;
    border-radius: 9px !important;
  }

  :global(.xpm-three-cards b) {
    font-size: 17px !important;
    line-height: 1.15 !important;
    margin-bottom: 5px !important;
  }

  :global(.xpm-three-cards span) {
    font-size: 11px !important;
    line-height: 1.2 !important;
  }

  :global(.xpm-insight) {
    margin-top: 16px !important;
    padding: 14px 12px !important;
    border-radius: 9px !important;
    font-size: 12px !important;
    line-height: 1.25 !important;
    letter-spacing: 0.02em !important;
  }

  :global(.xpm-insight span) {
    font-size: 11px !important;
    line-height: 1.25 !important;
    margin-top: 3px !important;
  }

  :global(.xpm-section-title) {
    margin: 18px 0 12px !important;
  }

  :global(.xpm-section-title h3) {
    font-size: 14px !important;
    line-height: 1.2 !important;
  }

  :global(.xpm-section-title button) {
    font-size: 11px !important;
    font-weight: 700 !important;
  }

  :global(.xpm-products) {
    gap: 12px !important;
  }

  :global(.xpm-products article) {
    padding: 12px !important;
    border-radius: 10px !important;
  }

  :global(.xpm-products img) {
    height: 64px !important;
    border-radius: 9px !important;
    margin-bottom: 10px !important;
  }

  :global(.xpm-products b) {
    font-size: 12px !important;
    line-height: 1.2 !important;
    margin-bottom: 4px !important;
  }

  :global(.xpm-products span) {
    font-size: 11px !important;
    line-height: 1.2 !important;
  }
}

/* INCREASE HI USER HEADER FONT */
@media (max-width: 768px) {
  :global(.xpm-home-head) {
    height: 82px !important;
    padding: 16px 18px !important;
  }

  :global(.xpm-home-head strong) {
    font-size: 20px !important;
    font-weight: 800 !important;
    line-height: 1.15 !important;
    margin-bottom: 6px !important;
  }

  :global(.xpm-home-head span) {
    font-size: 14px !important;
    line-height: 1.3 !important;
  }

  :global(.xpm-head-icons) {
    gap: 16px !important;
    font-size: 16px !important;
  }
}

/* RECOMMENDED FOR YOU — BIGGER BUT LESS BOLD */
@media (max-width: 768px) {
  :global(.xpm-section-title h3) {
    font-size: 16px !important;
    font-weight: 500 !important;
    line-height: 1.25 !important;
    letter-spacing: -0.01em !important;
  }

  :global(.xpm-section-title button) {
    font-size: 12px !important;
    font-weight: 700 !important;
    line-height: 1.2 !important;
    color: #8a0048 !important;
  }
}

/* RECOMMENDED FOR YOU — MORE BOLD */
@media (max-width: 768px) {
  :global(.xpm-section-title h3) {
    font-size: 16px !important;
    font-weight: 700 !important;
    line-height: 1.25 !important;
    letter-spacing: -0.01em !important;
  }

  :global(.xpm-section-title button) {
    font-size: 12px !important;
    font-weight: 700 !important;
    line-height: 1.2 !important;
    color: #8a0048 !important;
  }
}

/* REDUCE GAP BETWEEN RECOMMENDED TEXT AND PRODUCT IMAGES */
@media (max-width: 768px) {
  :global(.xpm-section-title) {
    margin: 14px 0 6px !important;
  }

  :global(.xpm-products) {
    margin-top: 0 !important;
    gap: 10px !important;
  }

  :global(.xpm-products article) {
    padding-top: 8px !important;
  }

  :global(.xpm-products img) {
    margin-bottom: 6px !important;
  }
}

@media (max-width: 768px) {
  :global(.xpm-section-title) {
    margin: 10px 0 3px !important;
  }

  :global(.xpm-products) {
    margin-top: 0 !important;
  }

  :global(.xpm-products article) {
    padding-top: 6px !important;
  }

  :global(.xpm-products img) {
    margin-bottom: 5px !important;
  }
}

/* MAKE RECOMMENDED PRODUCTS EVEN CLOSER */
@media (max-width: 768px) {
  :global(.xpm-section-title) {
    margin: 6px 0 2px !important;
  }

  :global(.xpm-products) {
    margin-top: -2px !important;
    gap: 9px !important;
  }

  :global(.xpm-products article) {
    padding-top: 6px !important;
  }

  :global(.xpm-products img) {
    margin-bottom: 4px !important;
  }
}

@media (max-width: 768px) {
  :global(.xpm-section-title) {
    margin: 4px 0 0 !important;
  }

  :global(.xpm-products) {
    margin-top: -7px !important;
  }
}

/* INCREASE DONUT CATEGORY LIST FONT SIZE */
@media (max-width: 768px) {
  :global(.xpm-donut-row ul) {
    font-size: 13px !important;
    line-height: 1.8 !important;
    font-weight: 500 !important;
  }

  :global(.xpm-donut-row li) {
    margin-bottom: 4px !important;
  }
}

/* ADD SPACE BETWEEN ON-TRACK CARD AND MONTHLY BUDGET CARD */
@media (max-width: 768px) {
  :global(.xpm-insight) {
    margin-bottom: 8px !important;
  }

  :global(.xpm-insight + .xpm-panel),
  :global(.xpm-insight + .xpm-budget-row) {
    margin-top: 8px !important;
  }
}

/* GROKLY DETAIL PAGE FIX */
@media (max-width: 768px) {
  :global(.xpm-grokly-head) {
    height: 58px !important;
    padding: 0 14px !important;
    border-bottom: 1px solid rgba(122, 0, 66, 0.15) !important;
  }

  :global(.xpm-grokly-head button) {
    font-size: 22px !important;
    line-height: 1 !important;
  }

  :global(.xpm-grokly-head strong) {
    font-size: 18px !important;
    font-weight: 700 !important;
  }

  :global(.xpm-grokly-scroll) {
    height: calc(100% - 58px) !important;
    padding: 14px 13px 14px !important;
    overflow-y: auto !important;
    box-sizing: border-box !important;
  }

  :global(.xpm-detail-hero) {
    padding: 6px 0 12px !important;
    margin: 0 !important;
  }

  :global(.xpm-detail-hero span) {
    font-size: 14px !important;
    line-height: 1.25 !important;
    color: #111 !important;
  }

  :global(.xpm-detail-hero strong) {
    display: block !important;
    font-size: 30px !important;
    line-height: 1 !important;
    font-weight: 800 !important;
    margin: 8px 0 6px !important;
    color: #111 !important;
  }

  :global(.xpm-detail-hero small) {
    font-size: 12px !important;
    color: #222 !important;
  }

  :global(.xpm-subtitle) {
    font-size: 14px !important;
    font-weight: 700 !important;
    margin: 0 0 12px !important;
    color: #111 !important;
  }

  :global(.xpm-chart-section) {
    margin: 4px 0 16px !important;
  }

  :global(.xpm-bar-chart) {
    position: relative !important;
    height: 150px !important;
    padding-left: 30px !important;
    border-bottom: 1px solid #9c9692 !important;
    box-sizing: border-box !important;
  }

  :global(.xpm-chart-y-axis) {
    position: absolute !important;
    left: 0 !important;
    top: 16px !important;
    bottom: 20px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    font-size: 12px !important;
    color: #111 !important;
  }

  :global(.xpm-bar-chart::before),
  :global(.xpm-bar-chart::after) {
    content: "" !important;
    position: absolute !important;
    left: 30px !important;
    right: 0 !important;
    border-top: 1px solid #9c9692 !important;
  }

  :global(.xpm-bar-chart::before) {
    top: 36px !important;
  }

  :global(.xpm-bar-chart::after) {
    top: 78px !important;
  }

  :global(.xpm-bar-chart-bars) {
    height: 128px !important;
    display: flex !important;
    align-items: flex-end !important;
    justify-content: space-around !important;
    gap: 10px !important;
  }

  :global(.xpm-bar-item) {
    width: 34px !important;
    height: 128px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: flex-end !important;
    gap: 6px !important;
  }

  :global(.xpm-bar-item i) {
    width: 22px !important;
    background: #8a0048 !important;
    border-radius: 4px 4px 0 0 !important;
  }

  :global(.xpm-bar-item span) {
    font-size: 11px !important;
    color: #111 !important;
  }

  :global(.xpm-top-items-section) {
    margin-top: 12px !important;
  }

  :global(.xpm-grokly-list) {
    padding: 10px 13px !important;
    border-radius: 13px !important;
    margin-bottom: 14px !important;
  }

  :global(.xpm-item-row) {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 7px 0 !important;
    font-size: 14px !important;
    color: #111 !important;
  }

  :global(.xpm-item-left) {
    display: inline-flex !important;
    align-items: center !important;
    gap: 11px !important;
  }

  :global(.xpm-item-icon) {
    width: 24px !important;
    font-size: 19px !important;
    text-align: center !important;
  }

  :global(.xpm-item-row b) {
    font-size: 14px !important;
    font-weight: 600 !important;
  }

  :global(.xpm-grokly-stats) {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 10px !important;
    margin: 12px 0 12px !important;
  }

  :global(.xpm-grokly-stats article) {
    background: #fff !important;
    border: 1px solid rgba(122, 0, 66, 0.14) !important;
    border-radius: 13px !important;
    padding: 12px 14px !important;
  }

  :global(.xpm-grokly-stats span) {
    display: block !important;
    font-size: 13px !important;
    margin-bottom: 8px !important;
    color: #111 !important;
  }

  :global(.xpm-grokly-stats b) {
    font-size: 20px !important;
    font-weight: 700 !important;
    color: #8a0048 !important;
  }

  :global(.xpm-grokly-stats article:nth-child(2) b) {
    color: #111 !important;
  }

  :global(.xpm-grokly-budget-btn) {
    width: 100% !important;
    height: 48px !important;
    margin: 4px 0 0 !important;
    border-radius: 9px !important;
    font-size: 18px !important;
    font-weight: 500 !important;
  }
}

/* FINAL FIX — GROKLY WEEKLY BAR CHART ALIGNMENT */
@media (max-width: 768px) {
  :global(.xpm-chart-section) {
    margin: 18px 0 20px !important;
    padding: 0 !important;
  }

  :global(.xpm-chart-section .xpm-subtitle) {
    font-size: 15px !important;
    font-weight: 700 !important;
    margin: 0 0 14px !important;
    color: #111 !important;
  }

  :global(.xpm-bar-chart) {
    position: relative !important;
    width: 100% !important;
    height: 150px !important;
    padding: 0 0 22px 34px !important;
    margin: 0 !important;
    border-bottom: 1px solid #9d9692 !important;
    box-sizing: border-box !important;
    display: block !important;
  }

  :global(.xpm-chart-y-axis) {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    bottom: 22px !important;
    width: 28px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    align-items: flex-start !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    color: #111 !important;
    line-height: 1 !important;
  }

  :global(.xpm-bar-chart::before),
  :global(.xpm-bar-chart::after) {
    content: "" !important;
    position: absolute !important;
    left: 34px !important;
    right: 0 !important;
    height: 1px !important;
    background: #9d9692 !important;
    border: none !important;
  }

  :global(.xpm-bar-chart::before) {
    top: 0 !important;
  }

  :global(.xpm-bar-chart::after) {
    top: 62px !important;
  }

  :global(.xpm-bar-chart-bars) {
    position: absolute !important;
    left: 34px !important;
    right: 0 !important;
    bottom: 0 !important;
    height: 142px !important;

    display: flex !important;
    flex-direction: row !important;
    align-items: flex-end !important;
    justify-content: space-around !important;
    gap: 0 !important;
  }

  :global(.xpm-bar-item) {
    width: 34px !important;
    height: 142px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: flex-end !important;
    gap: 7px !important;
    position: relative !important;
  }

  :global(.xpm-bar-item i) {
    display: block !important;
    width: 22px !important;
    background: #8a0048 !important;
    border-radius: 5px 5px 0 0 !important;
    flex-shrink: 0 !important;
  }

  :global(.xpm-bar-item span) {
    display: block !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    color: #111 !important;
    line-height: 1 !important;
    height: 14px !important;
  }

  /* stop old generic chart CSS from breaking this layout */
  :global(.xpm-bar-chart div) {
    box-sizing: border-box !important;
  }

  :global(.xpm-top-items-section) {
    margin-top: 22px !important;
  }
}

/* FINAL PROPER GROKLY CHART FIX */
@media (max-width: 768px) {
  :global(.xpm-chart-section) {
    margin: 12px 0 10px !important;
    padding: 0 !important;
  }

  :global(.xpm-chart-section .xpm-subtitle) {
    font-size: 16px !important;
    font-weight: 700 !important;
    margin: 0 0 14px !important;
    color: #111 !important;
  }

  :global(.xpm-bar-chart) {
    position: relative !important;
    width: 100% !important;
    height: 150px !important;
    padding: 0 0 24px 36px !important;
    margin: 0 !important;
    border-bottom: 1px solid #aaa19c !important;
    box-sizing: border-box !important;
    display: block !important;
  }

  :global(.xpm-chart-y-axis) {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    bottom: 24px !important;
    width: 30px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    align-items: flex-start !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    color: #111 !important;
    line-height: 1 !important;
  }

  :global(.xpm-bar-chart::before),
  :global(.xpm-bar-chart::after) {
    content: "" !important;
    position: absolute !important;
    left: 36px !important;
    right: 0 !important;
    height: 1px !important;
    background: #aaa19c !important;
    border: 0 !important;
  }

  :global(.xpm-bar-chart::before) {
    top: 0 !important;
  }

  :global(.xpm-bar-chart::after) {
    top: 65px !important;
  }

  :global(.xpm-bar-chart-bars) {
    position: absolute !important;
    left: 36px !important;
    right: 0 !important;
    bottom: 0 !important;
    height: 150px !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: flex-end !important;
    justify-content: space-around !important;
  }

  :global(.xpm-bar-item) {
    width: 38px !important;
    height: 150px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: flex-end !important;
    gap: 7px !important;
  }

  :global(.xpm-bar-item i) {
    display: block !important;
    width: 22px !important;
    background: #8a0048 !important;
    border-radius: 5px 5px 0 0 !important;
    flex-shrink: 0 !important;
  }

  :global(.xpm-bar-item span) {
    display: block !important;
    height: 16px !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    line-height: 1 !important;
    color: #111 !important;
  }

  /* pull Top 5 section closer to chart */
  :global(.xpm-top-items-section) {
    margin-top: 14px !important;
  }

  :global(.xpm-top-items-section .xpm-subtitle) {
    font-size: 16px !important;
    margin: 0 0 14px !important;
  }
}

/* REDUCE GAP AROUND TOP 5 ORDERED ITEMS SECTION */
@media (max-width: 768px) {
  :global(.xpm-chart-section) {
    margin-bottom: 4px !important;
  }

  :global(.xpm-bar-chart) {
    height: 132px !important;
    padding-bottom: 18px !important;
  }

  :global(.xpm-bar-chart-bars) {
    height: 132px !important;
  }

  :global(.xpm-bar-item) {
    height: 132px !important;
  }

  :global(.xpm-top-items-section) {
    margin-top: 2px !important;
    margin-bottom: 10px !important;
  }

  :global(.xpm-top-items-section .xpm-subtitle) {
    margin-bottom: 10px !important;
  }

  :global(.xpm-grokly-list) {
    padding: 8px 14px !important;
    margin-bottom: 10px !important;
  }

  :global(.xpm-item-row) {
    padding: 5px 0 !important;
  }

  :global(.xpm-grokly-stats) {
    margin-top: 8px !important;
  }
}

@media (max-width: 768px) {
  :global(.xpm-top-items-section) {
    margin-top: -8px !important;
  }
}

/* REDUCE GAP BETWEEN TOP ITEMS CARD AND STATS CARDS */
@media (max-width: 768px) {
  :global(.xpm-grokly-list) {
    margin-bottom: 4px !important;
  }

  :global(.xpm-top-items-section) {
    margin-bottom: 4px !important;
  }

  :global(.xpm-grokly-stats) {
    margin-top: 4px !important;
  }

  :global(.xpm-grokly-stats article) {
    padding: 10px 12px !important;
  }
}

@media (max-width: 768px) {
  :global(.xpm-grokly-list) {
    margin-bottom: 0 !important;
  }

  :global(.xpm-top-items-section) {
    margin-bottom: 0 !important;
  }

  :global(.xpm-grokly-stats) {
    margin-top: -26px !important;
  }
}
/* REDUCE GAP BETWEEN CHART AND TOP 5 SECTION */
@media (max-width: 768px) {
  :global(.xpm-chart-section) {
    margin-bottom: 0 !important;
  }

  :global(.xpm-bar-chart) {
    margin-bottom: 0 !important;
  }

  :global(.xpm-top-items-section) {
    margin-top: -18px !important;
  }

  :global(.xpm-top-items-section .xpm-subtitle) {
    margin-top: 0 !important;
    margin-bottom: 10px !important;
  }
}
/* FINAL BUDGET SETUP MOBILE FIX — BIGGER FONT, LESS BOX PADDING, BUTTON NOT CUT */
@media (max-width: 768px) {
  :global(.xpm-budget-scroll) {
    height: calc(100% - 58px) !important;
    padding: 16px 12px 90px !important;
    overflow-y: auto !important;
    box-sizing: border-box !important;
  }

  :global(.xpm-budget-note) {
    font-size: 17px !important;
    line-height: 1.45 !important;
    font-weight: 500 !important;
    margin: 0 0 14px !important;
    color: #111 !important;
  }

  :global(.xpm-budget-card) {
    padding: 16px 20px 14px !important;
    margin-bottom: 12px !important;
    min-height: 128px !important;
    border-radius: 14px !important;
    background: #ffffff !important;
    border: 1px solid rgba(138, 0, 72, 0.16) !important;
    box-shadow: none !important;
  }

  :global(.xpm-budget-card div) {
    margin-bottom: 8px !important;
  }

  :global(.xpm-budget-card strong) {
    font-size: 18px !important;
    font-weight: 800 !important;
    line-height: 1.2 !important;
    color: #97004f !important;
  }

  :global(.xpm-budget-card span) {
    font-size: 16px !important;
    font-weight: 800 !important;
    line-height: 1.2 !important;
    color: #111 !important;
  }

  :global(.xpm-budget-card input) {
    width: 100% !important;
    margin: 6px 0 8px !important;
    accent-color: #97004f !important;
  }

  :global(.xpm-budget-card small) {
    display: flex !important;
    justify-content: space-between !important;
    font-size: 15px !important;
    font-weight: 800 !important;
    line-height: 1.1 !important;
    color: #111 !important;
  }

  :global(.xpm-total) {
    padding: 14px 16px !important;
    margin: 12px 0 14px !important;
    border-radius: 14px !important;
    min-height: auto !important;
  }

  :global(.xpm-total span) {
    font-size: 13px !important;
    font-weight: 500 !important;
    line-height: 1.2 !important;
    color: #111 !important;
  }

  :global(.xpm-total strong) {
    font-size: 30px !important;
    font-weight: 800 !important;
    line-height: 1.05 !important;
    margin: 5px 0 !important;
    color: #97004f !important;
  }

  :global(.xpm-total small) {
    font-size: 15px !important;
    line-height: 1.25 !important;
    color: #111 !important;
  }

  :global(.xpm-budget-scroll .xpm-dark-btn) {
    height: 54px !important;
    min-height: 54px !important;
    margin: 0 0 24px !important;
    border-radius: 10px !important;
    font-size: 18px !important;
    font-weight: 600 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
}

/* INCREASE SET YOUR BUDGET HEADER FONT SIZE */
@media (max-width: 768px) {
  :global(.xpm-page-head) {
    height: 64px !important;
    padding: 0 14px !important;
    gap: 10px !important;
  }

  :global(.xpm-page-head button) {
    font-size: 22px !important;
    font-weight: 500 !important;
  }

  :global(.xpm-page-head strong) {
    font-size: 19px !important;
    font-weight: 800 !important;
    line-height: 1.2 !important;
  }
}

/* REDUCE SET YOUR BUDGET HEADER SIZE + BOLDNESS */
@media (max-width: 768px) {
  :global(.xpm-page-head) {
    height: 58px !important;
    padding: 0 13px !important;
    gap: 8px !important;
  }

  :global(.xpm-page-head button) {
    font-size: 18px !important;
    font-weight: 400 !important;
  }

  :global(.xpm-page-head strong) {
    font-size: 16px !important;
    font-weight: 600 !important;
    line-height: 1.2 !important;
  }
}

/* SUMMARY PAGE — INCREASE FONT SIZE + FIX SPACING */
@media (max-width: 768px) {
  :global(.xpm-success) {
    padding: 58px 16px 30px !important;
  }

  :global(.xpm-success div) {
    width: 62px !important;
    height: 62px !important;
    font-size: 34px !important;
    margin-bottom: 24px !important;
  }

  :global(.xpm-success strong) {
    font-size: 20px !important;
    font-weight: 800 !important;
    line-height: 1.25 !important;
    margin-bottom: 10px !important;
  }

  :global(.xpm-success span) {
    font-size: 14px !important;
    line-height: 1.35 !important;
    color: #333 !important;
  }

  :global(.xpm-summary-grid) {
    padding: 18px 16px !important;
    gap: 18px !important;
    border-radius: 12px !important;
  }

  :global(.xpm-summary-grid span) {
    display: block !important;
    font-size: 15px !important;
    font-weight: 500 !important;
    line-height: 1.25 !important;
    margin-bottom: 6px !important;
    color: #111 !important;
  }

  :global(.xpm-summary-grid strong) {
    display: block !important;
    font-size: 24px !important;
    font-weight: 800 !important;
    line-height: 1.05 !important;
    color: #111 !important;
  }

  :global(.xpm-summary-grid small) {
    display: block !important;
    font-size: 13px !important;
    line-height: 1.25 !important;
    margin-top: 4px !important;
    color: #333 !important;
  }

  :global(.xpm-summary-grid .xpm-progress) {
    height: 8px !important;
    margin-top: 8px !important;
  }

  :global(.xpm-summary-grid + .xpm-panel),
  :global(.xpm-summary-grid + .xpm-panel + .xpm-panel) {
    padding: 18px 16px !important;
    border-radius: 12px !important;
  }

  :global(.xpm-summary-grid + .xpm-panel .xpm-label),
  :global(.xpm-summary-grid + .xpm-panel + .xpm-panel .xpm-label) {
    font-size: 14px !important;
    margin-bottom: 8px !important;
  }

  :global(.xpm-summary-grid + .xpm-panel strong),
  :global(.xpm-summary-grid + .xpm-panel + .xpm-panel strong) {
    display: block !important;
    font-size: 20px !important;
    font-weight: 800 !important;
    line-height: 1.25 !important;
    margin-bottom: 6px !important;
  }

  :global(.xpm-summary-grid + .xpm-panel p),
  :global(.xpm-summary-grid + .xpm-panel + .xpm-panel p) {
    font-size: 14px !important;
    line-height: 1.3 !important;
    margin: 0 !important;
  }

  :global(.xpm-link-btn) {
    font-size: 12px !important;
    font-weight: 700 !important;
    margin-left: 8px !important;
  }
}
      `}</style>
    </section>
  );
}


