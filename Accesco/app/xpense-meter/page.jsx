'use client';

import { useEffect, useMemo, useState } from 'react';

const productImages = {
  tomato:
    'https://i.pinimg.com/736x/eb/53/d0/eb53d07a61dcba25bce6508715d0c4c5.jpg',
  banana:
    'https://i.pinimg.com/736x/60/19/43/60194343fcbf6d2f0eb21d88ce7115af.jpg',
  milk:
    'https://i.pinimg.com/736x/c4/39/4a/c4394aa7d235ece619dc2b3cc3e7c726.jpg',
  paneer:
    'https://i.pinimg.com/736x/d9/b7/26/d9b7262bb44c2c77819518ef9017b03c.jpg',
  biryani:
    'https://i.pinimg.com/1200x/d3/49/a6/d349a6c01dba16609279e4725f9b4b57.jpg',
  thali:
    'https://i.pinimg.com/1200x/01/5e/64/015e64b4720d6bafc1071c79b2804146.jpg',
  kurta:
    'https://i.pinimg.com/736x/85/fa/6d/85fa6d4bcf0ea0a56521188812ff9da1.jpg',
  jeans:
    'https://i.pinimg.com/736x/56/5a/12/565a12c6333f611af4e87dbf61387691.jpg',
  bag:
    'https://i.pinimg.com/236x/5a/5f/2e/5a5f2eb6c445187c379aba96b8601ff9.jpg',
};

const categories = [
  {
    id: 'grocery',
    title: 'Grocery',
    amount: '₹5,200',
    spent: 5200,
    percent: '42%',
    color: '#3478ff',
  },
  {
    id: 'food',
    title: 'Food',
    amount: '₹4,150',
    spent: 4150,
    percent: '33%',
    color: '#f28a3d',
  },
  {
    id: 'fashion',
    title: 'Fashion',
    amount: '₹3,100',
    spent: 3100,
    percent: '25%',
    color: '#8f52d8',
  },
];

const DEFAULT_BUDGETS = { grocery: 8000, food: 6000, fashion: 4000 };

// ---- Budget persistence helpers ----
const BUDGET_STORAGE_KEY = 'xpenseMeterBudgets';

function loadSavedBudgets() {
  if (typeof window === 'undefined') return DEFAULT_BUDGETS;
  try {
    const raw = localStorage.getItem(BUDGET_STORAGE_KEY);
    if (!raw) return DEFAULT_BUDGETS;
    const parsed = JSON.parse(raw);
    return {
      grocery: Number(parsed.grocery) || DEFAULT_BUDGETS.grocery,
      food: Number(parsed.food) || DEFAULT_BUDGETS.food,
      fashion: Number(parsed.fashion) || DEFAULT_BUDGETS.fashion,
    };
  } catch {
    return DEFAULT_BUDGETS;
  }
}

const orders = [
  {
    store: 'Grokly',
    time: 'Today, 10:30 AM',
    amount: '₹642',
    items: '5 items',
    images: [productImages.tomato, productImages.banana, productImages.milk],
  },
  {
    store: 'Swadishtt',
    time: 'Yesterday, 7:50 PM',
    amount: '₹438',
    items: '3 items',
    images: [productImages.biryani, productImages.thali, productImages.paneer],
  },
  {
    store: 'InstaStyle',
    time: '10 Jun, 3:20 PM',
    amount: '₹4,039',
    items: '3 items',
    images: [productImages.kurta, productImages.jeans, productImages.bag],
  },
];

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

const rupee = (num) => `₹${Number(num).toLocaleString('en-IN')}`;

function getSavedUserName() {
  if (typeof window === 'undefined') return 'User';

  const keys = [
    'user',
    'currentUser',
    'loggedInUser',
    'accesscoUser',
    'accescoUser',
    'profile',
  ];

  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      const name =
        parsed?.name ||
        parsed?.fullName ||
        parsed?.displayName ||
        parsed?.username ||
        parsed?.firstName;

      if (name) return String(name).split(' ')[0];
    } catch {
      if (raw.length < 40) return raw.split(' ')[0];
    }
  }

  return (
    localStorage.getItem('name') ||
    localStorage.getItem('userName') ||
    localStorage.getItem('displayName') ||
    'User'
  ).split(' ')[0];
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
        <img src="/images/accesco_original.png" alt="Accesco Living" />
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

function XpenseMobileFlow() {
  const [screen, setScreen] = useState('intro');
  const [userName, setUserName] = useState('User');

  const [budgets, setBudgets] = useState({
    grokly: 8000,
    swadishtt: 6000,
    instastyle: 4000,
  });

  useEffect(() => {
    setUserName(getSavedUserName());
  }, []);

  const totalBudget = useMemo(() => {
    return budgets.grokly + budgets.swadishtt + budgets.instastyle;
  }, [budgets]);

  const updateBudget = (key, value) => {
    setBudgets((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
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

              <button className="xpm-month">May 2026⌄</button>

              <section className="xpm-panel">
                <div className="xpm-spend-header">
  <div>
    <span className="xpm-label">This Month Spend</span>
    <strong className="xpm-amount">₹12,450</strong>
    <small>of ₹18,000 budget</small>
  </div>

  <span className="xpm-percent-pill">68%</span>
</div>

<XpmProgress value={68} />

<div className="xpm-trend-row">
  <span className="xpm-trend-arrow">↗</span>
  <span>8% from last month</span>
</div>

<div className="xpm-three-cards">
                  <article>
                    <b>₹5,200</b>
                    <span>Grokly</span>
                  </article>
                  <article>
                    <b>₹4,150</b>
                    <span>Swadishtt</span>
                  </article>
                  <article>
                    <b>₹3,100</b>
                    <span>InstaStyle</span>
                  </article>
                </div>
              </section>

          <section className="xpm-panel xpm-budget-row">
  <div>
    <span>Your Budget</span>
    <small>Total Budget</small>
    <strong>₹18,000</strong>
  </div>

  <button type="button" onClick={() => setScreen('budget')}>
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
      <img
        src="/images/delivery_xpenseMeter.png"
        alt="Xpense Meter delivery rider"
        className="xpm-rider-img"
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
                <strong className="xpm-amount">₹12,450</strong>
                <small>of ₹18,000 budget used</small>

                <XpmProgress value={68} />

                <div className="xpm-three-cards">
                  <button type="button" onClick={() => setScreen('grokly')}>
                    <b>₹5,200</b>
                    <span>Grokly</span>
                  </button>
                  <button type="button">
                    <b>₹4,150</b>
                    <span>Swadishtt</span>
                  </button>
                  <button type="button">
                    <b>₹3,100</b>
                    <span>InstaStyle</span>
                  </button>
                </div>

                <button type="button" className="xpm-insight" onClick={() => setScreen('dashboard')}>
                  Food spend is stable this week.
                  <span>See full picture</span>
                </button>
              </section>

              <div className="xpm-section-title">
                <h3>Recommended for you</h3>
                <button type="button">See all</button>
              </div>

              <section className="xpm-products">
                <article>
                  <img
                    src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=300&q=80"
                    alt="Banana"
                  />
                  <b>Banana</b>
                  <span>₹45</span>
                </article>

                <article>
                  <img
                    src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=300&q=80"
                    alt="Paneer"
                  />
                  <b>Paneer</b>
                  <span>₹120</span>
                </article>

                <article>
                  <img
                    src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=80"
                    alt="Oats"
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
              <button className="xpm-month">May 2026⌄</button>

              <section className="xpm-panel">
                <span className="xpm-label">Total Doorstep spend</span>
                <strong className="xpm-amount">₹12,450</strong>
                <small>of ₹18,000 budget</small>

                <XpmProgress value={68} />

                <div className="xpm-donut-row">
                  <div className="xpm-donut" />
                  <ul>
                    <li>Grokly ₹5,200 (42%)</li>
                    <li>Swadishtt ₹4,150 (33%)</li>
                    <li>InstaStyle ₹3,100 (25%)</li>
                  </ul>
                </div>
              </section>

              <div className="xpm-dashboard-cards">
                <button type="button" onClick={() => setScreen('grokly')}>
                  <b>₹5,200</b>
                  <span>Grokly</span>
                </button>
                <button type="button">
                  <b>₹4,150</b>
                  <span>Swadishtt</span>
                </button>
                <button type="button">
                  <b>₹3,100</b>
                  <span>InstaStyle</span>
                </button>
              </div>

              <button type="button" className="xpm-insight">
                You’re on track!
                <span>Keep it up, you’re doing great.</span>
              </button>

              <section className="xpm-panel xpm-budget-row">
                <div>
                  <span>Your monthly budget</span>
                  <strong>{rupee(totalBudget)}</strong>
                  <small>₹5,550 remaining</small>
                </div>

                <button type="button" onClick={() => setScreen('budget')}>
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
        <strong>₹5,200</strong>
        <small>of ₹8,000 budget</small>
      </section>

      <section className="xpm-chart-section">
        <h3 className="xpm-subtitle">Week by Week Spend</h3>

        <div className="xpm-bar-chart">
          <div className="xpm-chart-y-axis">
            <span>2K</span>
            <span>1K</span>
            <span>0</span>
          </div>

          <div className="xpm-bar-chart-bars">
            {[42, 78, 54, 108, 62].map((height, index) => (
              <div className="xpm-bar-item" key={index}>
                <i style={{ height }} />
                <span>W{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="xpm-top-items-section">
        <h3 className="xpm-subtitle">Top 5 Most Ordered Items</h3>

        <div className="xpm-panel xpm-list xpm-grokly-list">
          {[
            ['🥛', 'Milk', '₹420'],
            ['🥬', 'Vegetables', '₹1,240'],
            ['🧄', 'Panneer', '₹560'],
            ['🍗', 'Chicken', '₹650'],
            ['🍞', 'Bread', '₹460'],
          ].map(([icon, name, price]) => (
            <div key={name} className="xpm-item-row">
              <span className="xpm-item-left">
                <span className="xpm-item-icon">{icon}</span>
                <span>{name}</span>
              </span>

              <b>{price}</b>
            </div>
          ))}
        </div>
      </section>

      <div className="xpm-two-stats xpm-grokly-stats">
        <article>
          <span>Last Month</span>
          <b>↑ ₹450 (9%)</b>
        </article>

        <article>
          <span>Orders per week</span>
          <b>3.2</b>
        </article>
      </div>

      <button
        type="button"
        className="xpm-dark-btn xpm-grokly-budget-btn"
        onClick={() => setScreen('budget')}
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
                  min="4000"
                  max="12000"
                  value={budgets.grokly}
                  onChange={(e) => updateBudget('grokly', e.target.value)}
                />
                <small>
                  <span>4K</span>
                  <span>12K</span>
                </small>
              </section>

              <section className="xpm-budget-card">
                <div>
                  <strong>Swadishtt</strong>
                  <span>{rupee(budgets.swadishtt)}</span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="10000"
                  value={budgets.swadishtt}
                  onChange={(e) => updateBudget('swadishtt', e.target.value)}
                />
                <small>
                  <span>3K</span>
                  <span>10K</span>
                </small>
              </section>

              <section className="xpm-budget-card">
                <div>
                  <strong>InstaStyle</strong>
                  <span>{rupee(budgets.instastyle)}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="8000"
                  value={budgets.instastyle}
                  onChange={(e) => updateBudget('instastyle', e.target.value)}
                />
                <small>
                  <span>2K</span>
                  <span>8K</span>
                </small>
              </section>

              <section className="xpm-panel xpm-total">
                <span>Total Monthly Budget</span>
                <strong>{rupee(totalBudget)}</strong>
                <small>You can change this anytime</small>
              </section>

              <XpmDarkButton className="xpm-wide" onClick={() => setScreen('summary')}>
                Looks Good ✓
              </XpmDarkButton>
            </main>
          </>
        )}

        {screen === 'summary' && (
          <>

            <header className="xpm-page-head">
              <button type="button" onClick={() => setScreen('budget')}>←</button>
              <strong>May 2026 Summary</strong>
            </header>

            <main className="xpm-scroll">
              <section className="xpm-success">
                <div>✓</div>
                <strong>Great job, {userName}!</strong>
                <span>You stayed within your budget this month.</span>
              </section>

              <section className="xpm-panel xpm-summary-grid">
                <div>
                  <span>Total Spend</span>
                  <strong>₹17,850</strong>
                  <small>of {rupee(totalBudget)}</small>
                </div>

                <div>
                  <span>Budget Used</span>
                  <strong>99%</strong>
                </div>

                <XpmProgress value={99} />
              </section>

              <section className="xpm-panel">
                <span className="xpm-label">Biggest Category</span>
                <strong>Swadishtt Food</strong>
                <p>₹6,450 (36%)</p>
              </section>

              <section className="xpm-panel">
                <span className="xpm-label">Suggested budget for June</span>
                <strong>₹18,500</strong>
                <button type="button" className="xpm-link-btn" onClick={() => setScreen('budget')}>
                  Review & Edit →
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


export default function XpenseMeterPage() {
  const [screen, setScreen] = useState('launch');
  const [userName, setUserName] = useState('User');
  const [budgets, setBudgets] = useState(DEFAULT_BUDGETS);
  const [budgetSaved, setBudgetSaved] = useState(false);

  const totalBudget = useMemo(
    () => budgets.grocery + budgets.food + budgets.fashion,
    [budgets],
  );
  const totalSpent = useMemo(
    () => categories.reduce((sum, cat) => sum + cat.spent, 0),
    [],
  );

  const updateBudget = (key, value) => {
    setBudgets((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const saveBudgets = () => {
    try {
      localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgets));
      setBudgetSaved(true);
    } catch {
      // localStorage unavailable — fail silently, budgets still work in-session
    }
  };

  const usedPercent = Math.round((totalSpent / totalBudget) * 100);

  useEffect(() => {
    // Load any previously saved budget so it survives refresh/navigation
    setBudgets(loadSavedBudgets());

    const possibleKeys = [
      'user',
      'currentUser',
      'loggedInUser',
      'accesscoUser',
      'accescoUser',
      'profile',
    ];

    let foundName = '';

    for (const key of possibleKeys) {
      const raw = localStorage.getItem(key);

      if (!raw) continue;

      try {
        const parsed = JSON.parse(raw);

        foundName =
          parsed?.name ||
          parsed?.fullName ||
          parsed?.displayName ||
          parsed?.username ||
          parsed?.firstName ||
          '';

        if (foundName) break;
      } catch {
        if (raw && raw.length < 40) {
          foundName = raw;
          break;
        }
      }
    }

    const directName =
      localStorage.getItem('name') ||
      localStorage.getItem('userName') ||
      localStorage.getItem('displayName') ||
      '';

    if (!foundName && directName) {
      foundName = directName;
    }

    if (foundName) {
      setUserName(foundName.split(' ')[0]);
    }
  }, []);

  // Auto-hide the "Budget saved" confirmation after a couple seconds
  useEffect(() => {
    if (!budgetSaved) return;
    const t = setTimeout(() => setBudgetSaved(false), 2500);
    return () => clearTimeout(t);
  }, [budgetSaved]);

  return (
    <main className="xp-page">
      <XpenseMobileFlow />
{screen === 'launch' && (
  <section className="xp-launch-page">
    <header className="xp-launch-topbar">
      <div className="xp-launch-brand">
        <img src="/logo.png" alt="Accesco Living" />
        <span>
          Accesco
          <br />
          Living
        </span>
      </div>

      <div className="xp-launch-icons" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>

        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.73 21a2 2 0 0 1-3.46 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6h15l-2 8H8L6 6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6 6 5.4 3.8H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="9" cy="19" r="1.5" fill="currentColor" />
          <circle cx="18" cy="19" r="1.5" fill="currentColor" />
        </svg>
      </div>
    </header>

    <section className="xp-launch-card-fixed">
      <div className="xp-launch-left-fixed">
        <span className="xp-new-fixed">NEW</span>

        <h1>XPENSE METER</h1>

        <h2>
          See it. Understand it.
          <br />
          <strong>Spend it better.</strong>
        </h2>

        <p>
          Track all your Grocery, Food &amp; Fashion
          <br />
          spending from one intelligent dashboard.
        </p>

        <div className="xp-launch-buttons-fixed">
          <button type="button" onClick={() => setScreen('home')}>
            View My Spend <span>→</span>
          </button>

          <button type="button" onClick={() => setScreen('budget')}>
            Set Budget
          </button>
        </div>

        <div className="xp-private-line-fixed">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span>100% Private. Only you can see your spending.</span>
        </div>
      </div>

<div className="xp-launch-visual-fixed">
  <div className="xp-visual-stage">
    <article className="xp-floating-card-fixed xp-grocery-card-fixed">
      <CategoryIcon type="grocery" />
      <strong>Grocery</strong>
      <span>₹5,200</span>
      <small>42%</small>
    </article>

    <article className="xp-floating-card-fixed xp-food-card-fixed">
      <CategoryIcon type="food" />
      <strong>Food</strong>
      <span>₹4,150</span>
      <small>33%</small>
    </article>

    <article className="xp-floating-card-fixed xp-fashion-card-fixed">
      <CategoryIcon type="fashion" />
      <strong>Fashion</strong>
      <span>₹3,100</span>
      <small>25%</small>
    </article>

<svg className="xp-svg-arrow xp-svg-arrow-left" viewBox="0 0 90 64" fill="none">
  <path
    d="M84 54 C66 24, 42 12, 16 22"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
  />
  <path
    d="M27 13 L16 22 L29 27"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
    <svg className="xp-svg-arrow xp-svg-arrow-top" viewBox="0 0 90 70" fill="none">
      <path
        d="M18 58 C20 28, 40 14, 69 14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M60 5 L69 14 L60 23"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

    <svg className="xp-svg-arrow xp-svg-arrow-bottom" viewBox="0 0 90 70" fill="none">
      <path
        d="M17 18 C30 45, 49 55, 72 52"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M63 43 L72 52 L63 61"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

    <div className="xp-main-donut-fixed">
      <div className="xp-main-donut-center">
        <span>This Month Spend</span>
        <strong>{rupee(totalSpent)}</strong>
        <small>of {rupee(totalBudget)} budget</small>
        <b>{usedPercent}% Used</b>
      </div>
    </div>

    <div className="xp-on-track-fixed">
      <div className="xp-check-fixed">✓</div>

      <div>
        <strong>On track</strong>
        <span>You’re doing great! Keep it up.</span>
      </div>

      <div className="xp-bars-fixed">
        <i /><i /><i /><i /><i /><i /><i /><i />
        <i /><i /><i /><i /><i /><i /><i /><i />
      </div>
    </div>
  </div>

        <div className="xp-on-track-fixed">
          <div className="xp-check-fixed">✓</div>

          <div>
            <strong>On track</strong>
            <span>You’re doing great! Keep it up.</span>
          </div>

          <div className="xp-bars-fixed">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    </section>
  </section>
)}
      {screen === 'home' && (
        <section className="xp-shell">
          <div className="xp-home-top">
            <div className="xp-brand">
              <img src="/logo.png" alt="Accesco Living" />
              <span>
                Accesco
                <br />
                Living
              </span>
            </div>

            <div className="xp-location">HSR Layout, Bengaluru</div>

            <div className="xp-search">
              <input readOnly placeholder='Search for "milk, atta, vegetables..."' />
            </div>
          </div>

          <nav className="xp-home-nav">
            <button className="active" type="button">
              Home
            </button>
            <button type="button">Orders</button>
            <button type="button">Lifecart</button>
            <button type="button">Offers</button>
            <button type="button">Categories</button>
          </nav>

          <div className="xp-home-body">
            <div className="xp-home-row">
              <div className="xp-greeting">
                <strong>Good Evening, {userName}!</strong>
                <span>Here is what is happening with your orders and spending.</span>
              </div>

              <div className="xp-plus-card">
  <div className="xp-plus-text">
    <strong>Plus</strong>
    <span>Free delivery on all orders</span>
  </div>

  <img
    src="https://i.pinimg.com/736x/19/14/73/191473a355d06fcdde41e234744007cb.jpg"
    alt="Free delivery"
    className="xp-plus-delivery-img"
  />
</div>
            </div>

            <section className="xp-meter-card">
              <div className="xp-meter-head">
                <div>
                  <h3>
                    Xpense Meter <span>NEW</span>
                  </h3>
                  <p>Your spending across Grocery, Food &amp; Fashion.</p>
                </div>

                <button type="button" onClick={() => setScreen('dashboard')}>
                  View details →
                </button>
              </div>

              <div className="xp-meter-grid">
                <div className="xp-spend-box">
                  <small>You have spent</small>
                  <strong>{rupee(totalSpent)}</strong>
                  <span>this month</span>

                  <div className="xp-progress">
                    <i style={{ width: `${Math.min(usedPercent, 100)}%` }} />
                  </div>

                  <div className="xp-budget-row">
  <p>{rupee(totalBudget - totalSpent)} remaining of {rupee(totalBudget)}</p>

  <button type="button" onClick={() => setScreen('budget')}>
    <span className="xp-pencil">✎</span>
    Edit budget
    <span className="xp-arrow">→</span>
  </button>
</div>
                </div>

                <div className="xp-category-row">
                  {categories.map((cat) => (
                    <article key={cat.id}>
                      <CategoryIcon type={cat.id} />
                      <strong>{cat.title}</strong>
                      <span>{cat.amount}</span>
                      <small>{cat.percent}</small>
                      <div>
                        <i style={{ width: cat.percent }} />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="xp-orders">
              <h3>Your recent orders</h3>

              <div className="xp-order-grid">
                {orders.map((order) => (
                  <article key={order.store}>
                    <div className="xp-order-head">
                      <div>
                        <small>{order.time}</small>
                        <strong>{order.store}</strong>
                      </div>
                      <span>Delivered</span>
                    </div>

                    <div className="xp-img-row">
                      {order.images.map((image) => (
                        <img src={image} alt="" key={image} />
                      ))}
                    </div>

                    <div className="xp-order-bottom">
                      <strong>{order.amount}</strong>
                      <span>{order.items}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      )}

      {screen === 'dashboard' && (
        <section className="xp-app">
          <aside className="xp-sidebar">
            <div className="xp-side-logo">
              <img src="/logo.png" alt="Accesco Living" />
              <strong>Accesco Living</strong>
            </div>

            <nav>
              <button type="button" onClick={() => setScreen('home')}>
                Home
              </button>
              <button type="button">Orders</button>
              <button className="active" type="button">
                Xpense Meter
              </button>
              <button type="button">Lifecart</button>
              <button type="button">Offers</button>
              <button type="button">Profile</button>
              <button type="button">Help &amp; Support</button>
            </nav>
          </aside>

          <div className="xp-dashboard">
            <header className="xp-dash-top">
              <h2>Xpense Meter</h2>

              <div>
                <span>May 2026</span>
                <span>{userName}</span>
              </div>
            </header>

            {budgetSaved && <div className="xp-save-toast">Budget saved ✓</div>}

            <div className="xp-dash-grid">
              <div className="xp-stat">
                <span>Total Doorstep Spend</span>
                <strong>{rupee(totalSpent)}</strong>
                <small>of {rupee(totalBudget)} budget</small>
                <div className="xp-small-progress">
                  <i style={{ width: `${Math.min(usedPercent, 100)}%` }} />
                </div>
              </div>

              <div className="xp-stat">
                <span>Budget Used</span>
                <strong>{usedPercent}%</strong>
                <small>{usedPercent <= 100 ? 'On track' : 'Over budget'}</small>
                <div className="xp-small-progress">
                  <i style={{ width: `${Math.min(usedPercent, 100)}%` }} />
                </div>
              </div>

              <div className="xp-stat">
                <span>Amount Left</span>
                <strong>{rupee(totalBudget - totalSpent)}</strong>
                <small>until your monthly budget</small>
              </div>

              <div className="xp-card xp-category-card">
                <h3>Spend by Category</h3>

                <div className="xp-chart-row">
                  <div className="xp-dashboard-donut" />

                  <div>
                    {categories.map((cat) => (
                      <p key={cat.id}>
                        <span style={{ background: cat.color }} />
                        {cat.title} <b>{cat.amount} ({cat.percent})</b>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="xp-card xp-budget-card">
                <h3>Budget on Category</h3>

                {categories.map((cat) => (
                  <div className="xp-budget-line" key={cat.id}>
                    <div>
                      <strong>{cat.title}</strong>
                      <span>{cat.amount}/{rupee(budgets[cat.id])}</span>
                    </div>
                    <div className="xp-small-progress">
                      <i style={{ width: `${Math.min(Math.round((cat.spent / budgets[cat.id]) * 100), 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="xp-card xp-products">
                <h3>Top Ordered Items</h3>

                {[
                  ['Milk', '₹650', productImages.milk],
                  ['Vegetable', '₹1,240', productImages.tomato],
                  ['Paneer', '₹580', productImages.paneer],
                  ['Chicken', '₹780', productImages.biryani],
                  ['Bread', '₹560', productImages.thali],
                ].map(([name, price, image]) => (
                  <div key={name}>
                    <img src={image} alt="" />
                    <span>{name}</span>
                    <strong>{price}</strong>
                  </div>
                ))}
              </div>

              <div className="xp-card xp-week">
                <h3>Week by Week Spend</h3>

                <div className="xp-week-bars">
                  {[42, 42, 78, 68, 52].map((height, index) => (
                    <span key={index} style={{ height: `${height}%` }} />
                  ))}
                </div>

                <div className="xp-week-labels">
                  <span>W1</span>
                  <span>W2</span>
                  <span>W3</span>
                  <span>W4</span>
                  <span>W5</span>
                </div>
              </div>

              <div className="xp-card xp-summary">
                <h3>May 2026 Summary</h3>
                <span>Total Spend</span>
                <strong>₹17,850</strong>
                <small>of ₹18,000</small>

                <div className="xp-small-progress">
                  <i style={{ width: '99%' }} />
                </div>

                <button type="button">View Full Summary</button>
              </div>

              <div className="xp-card xp-bottom">
                <span>Order This Month</span>
                <strong>28</strong>
                <small>Avg 3.5 orders / week</small>
              </div>

              <div className="xp-card xp-bottom">
                <span>Insights</span>
                <p>
                  Your food spend is up 12% compared to last month. Most of it
                  comes from weekend offers.
                </p>
              </div>

              <div className="xp-card xp-bottom">
                <span>Quick Actions</span>
                <button type="button" onClick={() => setScreen('budget')}>
                  Edit budget
                </button>
                <button type="button">View Monthly Summary</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {screen === 'budget' && (
        <section className="xp-app">
          <aside className="xp-sidebar">
            <div className="xp-side-logo">
              <img src="/logo.png" alt="Accesco Living" />
              <strong>Accesco Living</strong>
            </div>

            <nav>
              <button type="button" onClick={() => setScreen('home')}>
                Home
              </button>
              <button type="button" onClick={() => setScreen('dashboard')}>
                Xpense Meter
              </button>
              <button className="active" type="button">
                Set Budget
              </button>
            </nav>
          </aside>

          <div className="xp-dashboard">
            <header className="xp-dash-top">
              <h2>Set Budget</h2>

              <div>
                <button type="button" onClick={() => setScreen('dashboard')}>
                  View My Spend
                </button>
                <span>{userName}</span>
              </div>
            </header>

            <div className="xp-budget-page">
              <section>
                <span className="xp-badge">Budget Setup</span>
                <h3>Plan your monthly doorstep spend</h3>
                <p>
                  Set category-wise limits for Grocery, Food and Fashion. These
                  limits power your Xpense Meter dashboard.
                </p>

                <label>Total monthly budget</label>

                <div className="xp-money">
                  <span>₹</span>
                  <input value={totalBudget.toLocaleString('en-IN')} readOnly />
                </div>

                {categories.map((cat) => (
                  <div className="xp-range" key={cat.id}>
                    <div>
                      <strong>{cat.title}</strong>
                      <span>{rupee(budgets[cat.id])}</span>
                    </div>

                    <input
                      type="range"
                      min="1000"
                      max="10000"
                      step="100"
                      value={budgets[cat.id]}
                      onChange={(e) => updateBudget(cat.id, e.target.value)}
                    />
                  </div>
                ))}

                <div className="xp-actions">
                  <button
                    type="button"
                    onClick={() => {
                      saveBudgets();
                      setScreen('dashboard');
                    }}
                  >
                    Save Budget
                  </button>
                  <button type="button" onClick={() => setScreen('launch')}>
                    Back
                  </button>
                </div>
              </section>

              <aside>
                <h3>Budget Preview</h3>

                {categories.map((cat) => (
                  <article key={cat.id}>
                    <CategoryIcon type={cat.id} />

                    <div>
                      <strong>{cat.title}</strong>
                      <span>{cat.amount} spent</span>
                    </div>

                    <b>{cat.percent}</b>
                  </article>
                ))}
              </aside>
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        .xp-page {
          min-height: 100vh;
          padding: 90px 28px;
          background: #fffaf4;
          color: #111;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,
            'Segoe UI', sans-serif;
        }

        .xp-shell,
        .xp-app {
          max-width: 1180px;
          margin: 0 auto;
          background: #fbf7f1;
          border: 1px solid rgba(0, 0, 0, 0.16);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 26px 70px rgba(50, 20, 30, 0.16);
        }

        .xp-topbar,
        .xp-home-top {
          height: 72px;
          padding: 0 24px;
          background: #fffaf4;
          border-bottom: 1px solid rgba(0, 0, 0, 0.12);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .xp-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .xp-brand img {
          width: 42px;
          height: 42px;
          object-fit: contain;
        }

        .xp-brand span {
          color: #8a0048;
          font-size: 11px;
          line-height: 1.05;
          font-weight: 800;
        }

        .xp-icons {
          display: flex;
          gap: 12px;
        }

        .xp-icons span {
          width: 10px;
          height: 10px;
          border: 1.5px solid #111;
          border-radius: 999px;
        }

        .xp-launch-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 34px;
          padding: 36px 42px 12px;
          align-items: center;
        }

        .xp-badge {
          display: inline-flex;
          height: 20px;
          padding: 0 10px;
          align-items: center;
          border: 1px solid rgba(138, 0, 72, 0.25);
          color: #8a0048;
          background: #fff2f7;
          font-size: 10px;
          font-weight: 900;
        }

        .xp-launch-copy h1 {
          margin: 24px 0 8px;
          color: #8a0048;
          font-size: 46px;
          line-height: 1;
          letter-spacing: -0.06em;
          font-weight: 900;
        }

        .xp-launch-copy h2 {
          margin: 0 0 16px;
          font-size: 32px;
          line-height: 1.12;
          letter-spacing: -0.05em;
          color: #111;
          font-weight: 650;
        }

        .xp-launch-copy h2 strong {
          color: #8a0048;
        }

        .xp-launch-copy p {
          max-width: 460px;
          margin: 0 0 24px;
          color: #111;
          font-size: 16px;
          line-height: 1.45;
        }

        .xp-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .xp-actions button,
        .xp-summary button {
          height: 38px;
          border: 0;
          border-radius: 8px;
          padding: 0 22px;
          background: linear-gradient(180deg, #4b4b4b, #0c0c0c);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35),
            0 8px 20px rgba(0, 0, 0, 0.22);
        }

        .xp-launch-copy small {
          display: block;
          margin-top: 18px;
          color: #555;
          font-size: 12px;
        }

        .xp-orbit {
          position: relative;
          min-height: 350px;
        }

        .xp-donut-main {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 190px;
          height: 190px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          background: conic-gradient(#8a0048 0 68%, #efd9e5 68% 100%);
        }

        .xp-donut-main::after {
          content: '';
          position: absolute;
          inset: 28px;
          border-radius: 999px;
          background: #fbf7f1;
        }

        .xp-donut-main div {
          position: absolute;
          inset: 38px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
        }

        .xp-donut-main span,
        .xp-donut-main strong,
        .xp-donut-main small,
        .xp-donut-main b {
          display: block;
        }

        .xp-donut-main span,
        .xp-donut-main small {
          color: #444;
          font-size: 10px;
        }

        .xp-donut-main strong {
          color: #111;
          font-size: 20px;
        }

        .xp-donut-main b {
          width: fit-content;
          margin: 5px auto 0;
          color: #8a0048;
          background: #fff0f6;
          border-radius: 999px;
          padding: 3px 8px;
          font-size: 10px;
        }

        .xp-float {
          position: absolute;
          width: 82px;
          min-height: 108px;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #111;
          background: #fff;
        }

        .xp-float svg {
          width: 24px;
          height: 24px;
          color: #8a0048;
          margin-bottom: 8px;
        }

        .xp-float strong,
        .xp-float span,
        .xp-float small {
          display: block;
          color: #111;
          font-size: 11px;
        }

        .xp-float span {
          font-weight: 800;
        }

        .xp-float-1 {
          left: 4%;
          top: 20%;
        }

        .xp-float-2 {
          right: 2%;
          top: 5%;
        }

        .xp-float-3 {
          right: 8%;
          bottom: 6%;
        }

        .xp-track-strip {
          margin: 0 42px 24px;
          padding: 14px 18px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background: #fff;
          border-radius: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .xp-track-strip strong,
        .xp-track-strip span {
          display: block;
        }

        .xp-track-strip strong {
          color: #111;
          font-size: 13px;
        }

        .xp-track-strip span {
          color: #666;
          font-size: 11px;
        }

        .xp-mini-chart {
          height: 34px;
          display: flex;
          align-items: end;
          gap: 4px;
        }

        .xp-mini-chart i {
          width: 8px;
          background: #c5ebd7;
          border-radius: 999px;
        }

        .xp-mini-chart i:nth-child(1) {
          height: 14px;
        }

        .xp-mini-chart i:nth-child(2) {
          height: 24px;
        }

        .xp-mini-chart i:nth-child(3) {
          height: 18px;
        }

        .xp-mini-chart i:nth-child(4) {
          height: 30px;
        }

        .xp-mini-chart i:nth-child(5) {
          height: 22px;
        }

        .xp-home-top {
          display: grid;
          grid-template-columns: 170px 210px 1fr;
          gap: 22px;
        }

        .xp-location {
          color: #111;
          font-size: 13px;
          font-weight: 600;
        }

        .xp-search {
          height: 34px;
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.14);
          border-radius: 6px;
          padding: 0 12px;
          display: flex;
          align-items: center;
        }

        .xp-search input {
          width: 100%;
          border: 0;
          outline: 0;
          font-size: 12px;
          background: transparent;
        }

        .xp-home-nav {
          height: 36px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 46px;
          background: #fffaf4;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .xp-home-nav button {
          border: 0;
          background: transparent;
          color: #111;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .xp-home-nav button.active {
          color: #8a0048;
          font-weight: 800;
        }

        .xp-home-body {
          padding: 20px 24px 26px;
        }

        .xp-home-row {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 14px;
        }

        .xp-greeting,
        .xp-plus-card {
          min-height: 60px;
          border-radius: 8px;
          padding: 14px 18px;
        }

        .xp-greeting {
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .xp-greeting strong,
        .xp-greeting span,
        .xp-plus-card strong,
        .xp-plus-card span {
          display: block;
        }

        .xp-greeting strong {
          color: #111;
          font-size: 16px;
        }

        .xp-greeting span {
          margin-top: 2px;
          color: #555;
          font-size: 11px;
        }

        .xp-plus-card {
          background: linear-gradient(135deg, #8a0048, #6d0038);
          color: #fff;
        }

        .xp-plus-card strong {
          font-size: 17px;
        }

        .xp-plus-card span {
          margin-top: 2px;
          opacity: 0.82;
          font-size: 11px;
        }

        .xp-meter-card {
          margin-top: 14px;
          padding: 16px;
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }

        .xp-meter-head {
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .xp-meter-head h3 {
          margin: 0;
          color: #111;
          font-size: 16px;
        }

        .xp-meter-head h3 span {
          margin-left: 8px;
          color: #8a0048;
          background: #fff0f6;
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 9px;
        }

        .xp-meter-head p {
          margin: 4px 0 0;
          color: #555;
          font-size: 11px;
        }

        .xp-meter-head button {
          height: 24px;
          border: 0;
          border-radius: 4px;
          background: linear-gradient(180deg, #3b3b3b, #0f0f0f);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          padding: 0 10px;
        }

        .xp-meter-grid {
          display: grid;
          grid-template-columns: 1fr 1.55fr;
          gap: 18px;
        }

        .xp-spend-box small,
        .xp-spend-box strong,
        .xp-spend-box span,
        .xp-spend-box p {
          display: block;
        }

        .xp-spend-box small,
        .xp-spend-box span,
        .xp-spend-box p {
          color: #555;
          font-size: 11px;
        }

        .xp-spend-box strong {
          color: #111;
          font-size: 22px;
          margin-top: 4px;
        }

        .xp-progress,
        .xp-small-progress {
          height: 7px;
          margin: 12px 0 8px;
          background: #e7d8df;
          border-radius: 999px;
          overflow: hidden;
        }

        .xp-progress i,
        .xp-small-progress i {
          display: block;
          height: 100%;
          background: #8a0048;
        }

        .xp-spend-box button {
          border: 0;
          background: transparent;
          color: #8a0048;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          padding: 0;
        }

        .xp-category-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .xp-category-row article {
          min-height: 126px;
          padding: 14px;
          border-radius: 7px;
          border: 1px solid #111;
          background: #fff;
        }

        .xp-category-row svg {
          width: 25px;
          height: 25px;
          color: #8a0048;
          margin-bottom: 10px;
        }

        .xp-category-row strong,
        .xp-category-row span,
        .xp-category-row small {
          display: block;
          color: #111;
        }

        .xp-category-row strong {
          font-size: 12px;
        }

        .xp-category-row span {
          margin-top: 3px;
          font-size: 13px;
          font-weight: 800;
        }

        .xp-category-row small {
          font-size: 11px;
        }

        .xp-category-row article div {
          height: 5px;
          margin-top: 10px;
          background: #e7d8df;
          border-radius: 999px;
          overflow: hidden;
        }

        .xp-category-row article div i {
          display: block;
          height: 100%;
          background: #8a0048;
        }

        .xp-orders {
          margin-top: 18px;
        }

        .xp-orders h3 {
          margin: 0 0 12px;
          color: #111;
          font-size: 15px;
        }

        .xp-order-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .xp-order-grid article {
          padding: 12px;
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }

        .xp-order-head,
        .xp-order-bottom {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .xp-order-head small,
        .xp-order-head strong {
          display: block;
        }

        .xp-order-head small {
          color: #666;
          font-size: 9px;
        }

        .xp-order-head strong {
          margin-top: 2px;
          color: #111;
          font-size: 12px;
        }

        .xp-order-head > span {
          height: 16px;
          padding: 0 8px;
          border-radius: 999px;
          background: #d36aa6;
          color: #fff;
          font-size: 8px;
          font-weight: 800;
          display: flex;
          align-items: center;
        }

        .xp-img-row {
          display: flex;
          gap: 8px;
          margin: 10px 0;
        }

        .xp-img-row img,
        .xp-products img {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          object-fit: cover;
          background: #f5f5f5;
        }

        .xp-order-bottom strong {
          color: #111;
          font-size: 13px;
        }

        .xp-order-bottom span {
          color: #555;
          font-size: 10px;
        }

        .xp-app {
          display: grid;
          grid-template-columns: 210px 1fr;
          min-height: 650px;
        }

        .xp-sidebar {
          background: #8a0048;
          color: #fff;
          padding: 28px 22px;
        }

        .xp-side-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 34px;
          text-align: center;
        }

        .xp-side-logo img {
          width: 72px;
          height: 72px;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .xp-side-logo strong {
          font-size: 14px;
        }

        .xp-sidebar nav {
          display: grid;
          gap: 6px;
        }

        .xp-sidebar nav button {
          height: 42px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: rgba(255, 255, 255, 0.92);
          font-size: 13px;
          font-weight: 600;
          text-align: left;
          padding: 0 14px;
          cursor: pointer;
        }

        .xp-sidebar nav button.active {
          background: rgba(255, 255, 255, 0.82);
          color: #8a0048;
        }

        .xp-dashboard {
          padding: 14px;
        }

        .xp-dash-top {
          height: 56px;
          padding: 0 18px;
          border-radius: 8px;
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .xp-dash-top h2 {
          margin: 0;
          color: #111;
          font-size: 22px;
        }

        .xp-dash-top div {
          display: flex;
          gap: 18px;
          align-items: center;
          color: #111;
          font-size: 13px;
        }

        .xp-dash-top button {
          height: 28px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: #fff;
          border-radius: 6px;
          cursor: pointer;
        }

        .xp-save-toast {
          margin: 0 0 10px;
          padding: 8px 14px;
          border-radius: 6px;
          background: #eafff2;
          border: 1px solid #10b76b;
          color: #0a7a45;
          font-size: 12px;
          font-weight: 700;
          width: fit-content;
        }

        .xp-dash-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 12px;
        }

        .xp-stat,
        .xp-card,
        .xp-budget-page section,
        .xp-budget-page aside {
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 14px;
        }

        .xp-stat {
          grid-column: span 4;
        }

        .xp-stat span,
        .xp-stat strong,
        .xp-stat small,
        .xp-summary span,
        .xp-summary strong,
        .xp-summary small,
        .xp-bottom span,
        .xp-bottom strong,
        .xp-bottom small {
          display: block;
        }

        .xp-stat span,
        .xp-summary span,
        .xp-bottom span {
          color: #111;
          font-size: 11px;
          font-weight: 700;
        }

        .xp-stat strong,
        .xp-summary strong,
        .xp-bottom strong {
          color: #111;
          font-size: 20px;
          margin-top: 3px;
        }

        .xp-stat small,
        .xp-summary small,
        .xp-bottom small {
          color: #666;
          font-size: 10px;
        }

        .xp-category-card {
          grid-column: span 4;
        }

        .xp-budget-card {
          grid-column: span 5;
        }

        .xp-products {
          grid-column: span 3;
        }

        .xp-week {
          grid-column: span 5;
        }

        .xp-summary {
          grid-column: span 4;
        }

        .xp-bottom {
          grid-column: span 4;
        }

        .xp-card h3 {
          margin: 0 0 12px;
          color: #111;
          font-size: 13px;
        }

        .xp-chart-row {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .xp-dashboard-donut {
          width: 98px;
          height: 98px;
          border-radius: 999px;
          background: conic-gradient(
            #8a0048 0 42%,
            #f28a3d 42% 75%,
            #8f52d8 75% 100%
          );
          position: relative;
        }

        .xp-dashboard-donut::after {
          content: '';
          position: absolute;
          inset: 19px;
          border-radius: 999px;
          background: #fff;
        }

        .xp-chart-row p {
          margin: 0 0 6px;
          color: #111;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .xp-chart-row p span {
          width: 8px;
          height: 8px;
          border-radius: 99px;
        }

        .xp-budget-line {
          margin-bottom: 12px;
        }

        .xp-budget-line div:first-child {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #111;
        }

        .xp-products > div {
          display: grid;
          grid-template-columns: 34px 1fr auto;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: #111;
          font-size: 11px;
        }

        .xp-products img {
          width: 30px;
          height: 30px;
        }

        .xp-week-bars {
          height: 130px;
          display: flex;
          align-items: end;
          gap: 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.18);
          padding: 0 24px;
        }

        .xp-week-bars span {
          width: 22px;
          background: #8a0048;
          border-radius: 5px 5px 0 0;
        }

        .xp-week-labels {
          display: flex;
          justify-content: space-around;
          color: #111;
          font-size: 10px;
          margin-top: 6px;
        }

        .xp-summary button {
          width: 100%;
          margin-top: 18px;
        }

        .xp-bottom p {
          margin: 6px 0 0;
          color: #333;
          font-size: 11px;
          line-height: 1.5;
        }

        .xp-bottom button {
          margin-top: 10px;
          margin-right: 8px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid rgba(138, 0, 72, 0.18);
          background: #ffe8f3;
          color: #8a0048;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          padding: 0 10px;
        }

        .xp-budget-page {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 14px;
        }

        .xp-budget-page h3 {
          margin: 16px 0 8px;
          color: #111;
          font-size: 24px;
          letter-spacing: -0.04em;
        }

        .xp-budget-page p {
          color: #444;
          font-size: 14px;
          line-height: 1.55;
        }

        .xp-budget-page label {
          display: block;
          color: #111;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .xp-money {
          height: 48px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: #fffaf4;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          margin-bottom: 18px;
        }

        .xp-money span {
          color: #8a0048;
          font-weight: 900;
        }

        .xp-money input {
          border: 0;
          outline: 0;
          background: transparent;
          color: #111;
          font-size: 20px;
          font-weight: 900;
        }

        .xp-range {
          margin-bottom: 18px;
        }

        .xp-range div {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          color: #111;
          font-size: 13px;
        }

        .xp-range input {
          width: 100%;
          accent-color: #8a0048;
        }

        .xp-budget-page aside article {
          display: grid;
          grid-template-columns: 38px 1fr auto;
          gap: 10px;
          align-items: center;
          background: #fffaf4;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 10px;
        }

        .xp-budget-page aside svg {
          width: 28px;
          height: 28px;
          color: #8a0048;
        }

        .xp-budget-page aside strong,
        .xp-budget-page aside span {
          display: block;
        }

        .xp-budget-page aside strong {
          color: #111;
          font-size: 13px;
        }

        .xp-budget-page aside span {
          color: #666;
          font-size: 11px;
        }

        .xp-budget-page aside b {
          color: #8a0048;
        }

        @media (max-width: 900px) {
          .xp-launch-grid,
          .xp-home-top,
          .xp-home-row,
          .xp-meter-grid,
          .xp-category-row,
          .xp-order-grid,
          .xp-app,
          .xp-budget-page {
            grid-template-columns: 1fr;
          }

          .xp-sidebar {
            display: none;
          }

          .xp-dash-grid {
            grid-template-columns: 1fr;
          }

          .xp-stat,
          .xp-category-card,
          .xp-budget-card,
          .xp-products,
          .xp-week,
          .xp-summary,
          .xp-bottom {
            grid-column: auto;
          }
        }

        /* =========================================================
   FIXED XPENSE METER LAUNCH SCREEN — MATCH FIGMA SCREENSHOT
   ========================================================= */

.xp-page {
  padding: 0 0 70px !important;
  background: #fffaf4 !important;
}

.xp-launch-page {
  width: 100%;
  min-height: 100vh;
  background: #fffaf4;
  color: #111;
}

.xp-launch-topbar {
  width: 100%;
  height: 116px;
  padding: 0 24px;
  background: #fffaf4;
  border-bottom: 1px solid rgba(20, 15, 12, 0.16);
  box-shadow: 0 4px 12px rgba(20, 15, 12, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.xp-launch-brand {
  display: flex;
  align-items: center;
  gap: 18px;
}

.xp-launch-brand img {
  width: 58px;
  height: 58px;
  object-fit: contain;
}

.xp-launch-brand span {
  color: #8a0048;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.xp-launch-icons {
  display: flex;
  align-items: center;
  gap: 22px;
  color: #111;
}

.xp-launch-icons svg {
  width: 24px;
  height: 24px;
  display: block;
}

.xp-launch-card-fixed {
  margin: 36px 24px 0;
  min-height: 585px;
  border: 1px solid rgba(138, 0, 72, 0.18);
  border-radius: 7px;
  background: #fffdf9;
  display: grid;
  grid-template-columns: 48% 52%;
  overflow: hidden;
}

.xp-launch-left-fixed {
  padding: 23px 0 28px 28px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.xp-new-fixed {
  width: fit-content;
  height: 23px;
  padding: 0 12px;
  border-radius: 4px;
  border: 1px solid rgba(138, 0, 72, 0.24);
  background: #fff6fb;
  color: #8a0048;
  font-size: 14px;
  font-weight: 800;
  line-height: 21px;
  letter-spacing: 0.02em;
  margin-bottom: 48px;
}

.xp-launch-left-fixed h1 {
  margin: 0 0 22px !important;
  color: #8a0048 !important;
  font-size: clamp(38px, 4vw, 54px) !important;
  line-height: 0.98 !important;
  font-weight: 900 !important;
  letter-spacing: -0.05em !important;
  text-shadow: 0 5px 8px rgba(70, 0, 35, 0.18) !important;
  white-space: nowrap !important;
}

.xp-launch-left-fixed h2 {
  margin: 0 0 20px !important;
  color: #050505 !important;
  font-size: clamp(28px, 2.8vw, 42px) !important;
  line-height: 1.08 !important;
  font-weight: 400 !important;
  letter-spacing: -0.045em !important;
}

.xp-launch-left-fixed h2 strong {
  color: #8a0048 !important;
  font-weight: 400 !important;
}

.xp-launch-left-fixed p {
  max-width: 640px !important;
  margin: 0 0 42px !important;
  color: #050505 !important;
  font-size: clamp(18px, 1.7vw, 24px) !important;
  line-height: 1.28 !important;
  font-weight: 400 !important;
  letter-spacing: -0.02em !important;
}

.xp-launch-buttons-fixed button {
  height: 54px !important;
  min-width: 250px !important;
  padding: 0 26px !important;
  border: 0 !important;
  border-radius: 15px !important;
  background: linear-gradient(180deg, #676767 0%, #202020 44%, #050505 100%) !important;
  color: #ffffff !important;
  font-size: 18px !important;
  font-weight: 500 !important;
  letter-spacing: 0 !important;
  cursor: pointer !important;
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.55),
    inset 0 -2px 0 rgba(0, 0, 0, 0.55),
    0 14px 25px rgba(0, 0, 0, 0.16) !important;
}

.xp-launch-buttons-fixed button span {
  font-size: 24px;
  line-height: 1;
}

.xp-private-line-fixed {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  color: #292929 !important;
  font-size: 15px !important;
}

.xp-private-line-fixed svg {
  width: 24px;
  height: 24px;
  color: #111;
  flex-shrink: 0;
}

.xp-launch-visual-fixed {
  position: relative;
  min-height: 420px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.xp-main-donut-fixed {
  position: absolute;
  width: 255px;
  height: 255px;
  left: 50%;
  top: 53%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: conic-gradient(
    from -105deg,
    #980053 0deg 108deg,
    #ffffff 108deg 113deg,
    #980053 113deg 232deg,
    #ffffff 232deg 237deg,
    #980053 237deg 328deg,
    #f0d5e6 328deg 360deg
  );
  box-shadow: 0 7px 16px rgba(0, 0, 0, 0.18);
}

.xp-main-donut-fixed::after {
  content: '';
  position: absolute;
  inset: 30px;
  border-radius: 50%;
  background: #fffdf9;
}

.xp-main-donut-fixed div {
  position: absolute;
  inset: 55px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #111;
}
  .xp-main-donut-center {
  position: absolute;
  inset: 48px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #111;
}

.xp-main-donut-center span {
  font-size: 12px;
  line-height: 1.2;
  margin-bottom: 8px;
  font-weight: 500;
}

.xp-main-donut-center strong {
  font-size: 20px;
  line-height: 1.1;
  font-weight: 800;
  margin-bottom: 8px;
}

.xp-main-donut-center small {
  font-size: 11px;
  line-height: 1.2;
  color: #333;
  margin-bottom: 10px;
}

.xp-main-donut-center b {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 12px;
  border-radius: 999px;
  background: #f3d9e7;
  color: #980053;
  font-size: 11px;
  font-weight: 800;
}

.xp-floating-card-fixed {
  position: absolute;
  width: 74px;
  min-height: 98px;
  padding: 10px 9px 8px;
  border: 2px solid rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  background: #fffdf9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.14);
  color: #111;
  z-index: 4;
}

.xp-floating-card-fixed svg {
  width: 22px !important;
  height: 22px !important;
  display: block;
  margin: 0 0 7px !important;
  color: #111 !important;
}

.xp-floating-card-fixed strong,
.xp-floating-card-fixed span,
.xp-floating-card-fixed small {
  display: block;
}

.xp-floating-card-fixed strong {
  display: block;
  font-size: 11px;
  line-height: 1.1;
  font-weight: 500;
  margin-bottom: 3px;
}

.xp-floating-card-fixed span {
  display: block;
  font-size: 11px;
  line-height: 1.1;
  font-weight: 800;
  margin-bottom: 3px;
}

.xp-floating-card-fixed small {
  display: block;
  font-size: 11px;
  line-height: 1.1;
  font-weight: 500;
}

.xp-grocery-card-fixed {
  left: 11%;
  top: 23%;
}

.xp-food-card-fixed {
  right: 8%;
  top: 6%;
}

.xp-fashion-card-fixed {
  right: 8%;
  bottom: 7%;
}

.xp-svg-arrow {
  position: absolute;
  width: 78px;
  height: 58px;
  color: #111;
  z-index: 3;
}

.xp-svg-arrow-left {
  left: 16%;
  top: 47%;
}

.xp-svg-arrow-top {
  right: 20%;
  top: 11%;
}

.xp-svg-arrow-bottom {
  right: 20%;
  bottom: 17%;
}

/* remove old text arrows */
.xp-arrow-fixed,
.xp-arrow-one,
.xp-arrow-two,
.xp-arrow-three {
  display: none !important;
}

.xp-arrow-fixed {
  position: absolute;
  color: #111;
  font-size: 44px;
  line-height: 1;
  z-index: 4;
  font-family: Georgia, serif;
  font-weight: 400;
}

.xp-arrow-one {
  left: 45%;
  top: 20%;
  transform: rotate(-18deg);
}

.xp-arrow-two {
  left: 14.3%;
  top: 43%;
  transform: rotate(120deg);
}

.xp-arrow-three {
  right: 18%;
  bottom: 26%;
  transform: rotate(30deg);
}

.xp-on-track-fixed {
  position: absolute;
  left: 11%;
  right: 16%;
  bottom: 34px;
  height: 88px;
  border: 1px solid rgba(138, 0, 72, 0.14);
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(35, 15, 25, 0.06);
  display: grid;
  grid-template-columns: 38px 1fr 120px;
  align-items: center;
  column-gap: 14px;
  padding: 0 28px;
  z-index: 3;
}

.xp-check-fixed {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #10b76b;
  color: #fff;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.xp-on-track-fixed strong,
.xp-on-track-fixed span {
  display: block;
}

.xp-on-track-fixed strong {
  font-size: 21px;
  line-height: 1.1;
  font-weight: 800;
  color: #111;
  margin-bottom: 7px;
}

.xp-on-track-fixed span {
  font-size: 15px;
  color: #333;
}

.xp-bars-fixed {
  height: 55px;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  justify-content: flex-end;
}

.xp-bars-fixed i {
  width: 5px;
  border-radius: 99px 99px 0 0;
  background: rgba(29, 198, 136, 0.22);
  display: block;
}

.xp-bars-fixed i:nth-child(1) { height: 34px; }
.xp-bars-fixed i:nth-child(2) { height: 39px; }
.xp-bars-fixed i:nth-child(3) { height: 31px; }
.xp-bars-fixed i:nth-child(4) { height: 27px; }
.xp-bars-fixed i:nth-child(5) { height: 38px; }
.xp-bars-fixed i:nth-child(6) { height: 43px; }
.xp-bars-fixed i:nth-child(7) { height: 40px; }
.xp-bars-fixed i:nth-child(8) { height: 37px; }
.xp-bars-fixed i:nth-child(9) { height: 45px; }
.xp-bars-fixed i:nth-child(10) { height: 63px; background: rgba(29, 198, 136, 0.45); }
.xp-bars-fixed i:nth-child(11) { height: 70px; background: rgba(29, 198, 136, 0.45); }
.xp-bars-fixed i:nth-child(12) { height: 60px; background: rgba(29, 198, 136, 0.45); }
.xp-bars-fixed i:nth-child(13) { height: 54px; background: rgba(29, 198, 136, 0.45); }
.xp-bars-fixed i:nth-child(14) { height: 78px; background: rgba(29, 198, 136, 0.45); }
.xp-bars-fixed i:nth-child(15) { height: 69px; background: rgba(29, 198, 136, 0.45); }
.xp-bars-fixed i:nth-child(16) { height: 58px; background: rgba(29, 198, 136, 0.45); }

@media (max-width: 900px) {
  .xp-launch-topbar {
    height: 86px;
  }

  .xp-launch-brand img {
    width: 44px;
    height: 44px;
  }

  .xp-launch-brand span {
    font-size: 17px;
  }

  .xp-launch-card-fixed {
    grid-template-columns: 1fr;
    margin: 20px 16px 0;
  }

  .xp-launch-left-fixed {
    padding: 24px;
  }

  .xp-launch-left-fixed h1 {
    font-size: 42px;
  }

  .xp-launch-left-fixed h2 {
    font-size: 34px;
  }

  .xp-launch-left-fixed p {
    font-size: 20px;
  }

  .xp-launch-buttons-fixed {
    flex-direction: column;
    align-items: stretch;
  }

  .xp-launch-buttons-fixed button {
    min-width: 100%;
  }

  .xp-launch-visual-fixed {
    min-height: 520px;
  }

  .xp-grocery-card-fixed {
    left: 6%;
  }

  .xp-food-card-fixed,
  .xp-fashion-card-fixed {
    right: 5%;
  }

  .xp-on-track-fixed {
    left: 5%;
    right: 5%;
    grid-template-columns: 32px 1fr;
  }

  .xp-bars-fixed {
    display: none;
  }
}

@media (max-width: 900px) {
  .xp-launch-visual-fixed {
    min-height: 360px;
  }

  .xp-main-donut-fixed {
    width: 210px;
    height: 210px;
  }

  .xp-main-donut-fixed::after {
    inset: 26px;
  }

  .xp-main-donut-center {
    inset: 38px;
  }

  .xp-grocery-card-fixed {
    left: 5%;
    top: 26%;
  }

  .xp-food-card-fixed {
    right: 4%;
    top: 8%;
  }

  .xp-fashion-card-fixed {
    right: 4%;
    bottom: 8%;
  }

  .xp-svg-arrow-left {
    left: 9%;
    top: 50%;
  }

  .xp-svg-arrow-top {
    right: 15%;
    top: 12%;
  }

  .xp-svg-arrow-bottom {
    right: 15%;
    bottom: 18%;
  }
}
/* =========================================================
   FINAL FIX — RIGHT DONUT VISUAL EXACT PLACEMENT
   ========================================================= */

.xp-launch-visual-fixed {
  position: relative !important;
  min-height: 520px !important;
  width: 100% !important;
  display: flex !important;
  align-items: flex-start !important;
  justify-content: center !important;
  overflow: visible !important;
}

.xp-visual-stage {
  position: relative;
  width: 520px;
  height: 500px;
  margin-top: 2px;
  margin-left: auto;
  margin-right: 18px;
}

/* DONUT */
.xp-main-donut-fixed {
  position: absolute !important;
  width: 235px !important;
  height: 235px !important;
  left: 49% !important;
  top: 45% !important;
  transform: translate(-50%, -50%) !important;
  border-radius: 50% !important;
  background: conic-gradient(
    from -96deg,
    #980053 0deg 117deg,
    #ffffff 117deg 123deg,
    #980053 123deg 246deg,
    #ffffff 246deg 252deg,
    #980053 252deg 326deg,
    #efd3e4 326deg 360deg
  ) !important;
  box-shadow: 0 6px 13px rgba(0, 0, 0, 0.2) !important;
}

.xp-main-donut-fixed::after {
  content: '' !important;
  position: absolute !important;
  inset: 30px !important;
  border-radius: 50% !important;
  background: #fffdf9 !important;
}

.xp-main-donut-center {
  position: absolute !important;
  inset: 48px !important;
  z-index: 2 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  color: #111 !important;
}

.xp-main-donut-center span {
  font-size: 11px !important;
  line-height: 1.15 !important;
  font-weight: 500 !important;
  margin-bottom: 6px !important;
}

.xp-main-donut-center strong {
  font-size: 18px !important;
  line-height: 1.05 !important;
  font-weight: 800 !important;
  margin-bottom: 6px !important;
}

.xp-main-donut-center small {
  font-size: 10px !important;
  line-height: 1.15 !important;
  color: #222 !important;
  margin-bottom: 7px !important;
}

.xp-main-donut-center b {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 3px 8px !important;
  border-radius: 999px !important;
  background: #f2d4e5 !important;
  color: #980053 !important;
  font-size: 9px !important;
  font-weight: 800 !important;
}

/* FLOATING CARDS */
.xp-floating-card-fixed {
  position: absolute !important;
  width: 78px !important;
  min-height: 96px !important;
  padding: 10px 9px 8px !important;
  border: 1.8px solid rgba(0, 0, 0, 0.55) !important;
  border-radius: 7px !important;
  background: #fffdf9 !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.16) !important;
  color: #111 !important;
  z-index: 5 !important;
}

.xp-floating-card-fixed svg {
  width: 21px !important;
  height: 21px !important;
  display: block !important;
  color: #111 !important;
  margin: 0 0 8px !important;
}

.xp-floating-card-fixed strong,
.xp-floating-card-fixed span,
.xp-floating-card-fixed small {
  display: block !important;
}

.xp-floating-card-fixed strong {
  font-size: 11px !important;
  line-height: 1.1 !important;
  font-weight: 500 !important;
  margin-bottom: 2px !important;
}

.xp-floating-card-fixed span {
  font-size: 12px !important;
  line-height: 1.05 !important;
  font-weight: 800 !important;
  margin-bottom: 2px !important;
}

.xp-floating-card-fixed small {
  font-size: 11px !important;
  line-height: 1.05 !important;
  font-weight: 500 !important;
}

.xp-grocery-card-fixed {
  left: 3% !important;
  top: 13% !important;
}

.xp-food-card-fixed {
  right: 8% !important;
  top: 1% !important;
}

.xp-fashion-card-fixed {
  right: 8% !important;
  top: 52% !important;
}

/* ARROWS */
.xp-svg-arrow {
  position: absolute !important;
  width: 78px !important;
  height: 58px !important;
  color: #111 !important;
  z-index: 4 !important;
  overflow: visible !important;
}

.xp-svg-arrow-left {
  left: 8% !important;
  top: 38% !important;
}

.xp-svg-arrow-top {
  right: 28% !important;
  top: 11% !important;
}

.xp-svg-arrow-bottom {
  right: 27% !important;
  top: 54% !important;
}

/* ON TRACK CARD */
.xp-on-track-fixed {
  position: absolute !important;
  left: 4% !important;
  right: 18% !important;
  bottom: 18px !important;
  height: 70px !important;
  border: 1px solid rgba(138, 0, 72, 0.13) !important;
  border-radius: 8px !important;
  background: #ffffff !important;
  box-shadow: 0 4px 14px rgba(35, 15, 25, 0.06) !important;
  display: grid !important;
  grid-template-columns: 22px 1fr 88px !important;
  align-items: center !important;
  column-gap: 12px !important;
  padding: 0 18px !important;
  z-index: 3 !important;
  overflow: hidden !important;
}

.xp-check-fixed {
  width: 16px !important;
  height: 16px !important;
  border-radius: 999px !important;
  background: #10b76b !important;
  color: #fff !important;
  font-size: 11px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-weight: 900 !important;
}

.xp-on-track-fixed strong {
  display: block !important;
  font-size: 14px !important;
  line-height: 1.1 !important;
  font-weight: 800 !important;
  color: #111 !important;
  margin-bottom: 5px !important;
}

.xp-on-track-fixed span {
  display: block !important;
  font-size: 11px !important;
  line-height: 1.15 !important;
  color: #333 !important;
}

.xp-bars-fixed {
  height: 46px !important;
  display: flex !important;
  align-items: flex-end !important;
  justify-content: flex-end !important;
  gap: 2px !important;
}

.xp-bars-fixed i {
  width: 4px !important;
  border-radius: 99px 99px 0 0 !important;
  background: rgba(29, 198, 136, 0.22) !important;
  display: block !important;
}

.xp-bars-fixed i:nth-child(1) { height: 20px !important; }
.xp-bars-fixed i:nth-child(2) { height: 23px !important; }
.xp-bars-fixed i:nth-child(3) { height: 18px !important; }
.xp-bars-fixed i:nth-child(4) { height: 24px !important; }
.xp-bars-fixed i:nth-child(5) { height: 27px !important; }
.xp-bars-fixed i:nth-child(6) { height: 25px !important; }
.xp-bars-fixed i:nth-child(7) { height: 31px !important; }
.xp-bars-fixed i:nth-child(8) { height: 29px !important; }
.xp-bars-fixed i:nth-child(9) { height: 35px !important; background: rgba(29, 198, 136, 0.4) !important; }
.xp-bars-fixed i:nth-child(10) { height: 42px !important; background: rgba(29, 198, 136, 0.45) !important; }
.xp-bars-fixed i:nth-child(11) { height: 34px !important; background: rgba(29, 198, 136, 0.45) !important; }
.xp-bars-fixed i:nth-child(12) { height: 38px !important; background: rgba(29, 198, 136, 0.45) !important; }
.xp-bars-fixed i:nth-child(13) { height: 49px !important; background: rgba(29, 198, 136, 0.5) !important; }
.xp-bars-fixed i:nth-child(14) { height: 33px !important; background: rgba(29, 198, 136, 0.45) !important; }
.xp-bars-fixed i:nth-child(15) { height: 45px !important; background: rgba(29, 198, 136, 0.5) !important; }
.xp-bars-fixed i:nth-child(16) { height: 40px !important; background: rgba(29, 198, 136, 0.45) !important; }

/* Remove old arrow text if still present */
.xp-arrow-fixed,
.xp-arrow-one,
.xp-arrow-two,
.xp-arrow-three {
  display: none !important;
}

/* make the whole launch area tighter */
.xp-launch-card-fixed {
  min-height: 585px !important;
}

@media (max-width: 900px) {
  .xp-visual-stage {
    width: 100%;
    max-width: 420px;
    height: 455px;
    margin: 0 auto;
  }

  .xp-main-donut-fixed {
    width: 205px !important;
    height: 205px !important;
  }

  .xp-main-donut-fixed::after {
    inset: 27px !important;
  }

  .xp-main-donut-center {
    inset: 40px !important;
  }

  .xp-grocery-card-fixed {
    left: 0 !important;
    top: 15% !important;
  }

  .xp-food-card-fixed {
    right: 0 !important;
    top: 2% !important;
  }

  .xp-fashion-card-fixed {
    right: 0 !important;
    top: 53% !important;
  }

  .xp-on-track-fixed {
    left: 0 !important;
    right: 12% !important;
    bottom: 8px !important;
    grid-template-columns: 20px 1fr !important;
  }

  .xp-bars-fixed {
    display: none !important;
  }
}

/* =========================================================
   FINAL CLEAN XPENSE VISUAL FIX
   ========================================================= */

/* hide any accidental duplicate on-track block outside the stage */
.xp-launch-visual-fixed > .xp-on-track-fixed {
  display: none !important;
}

.xp-launch-visual-fixed {
  position: relative !important;
  min-height: 500px !important;
  width: 100% !important;
  display: flex !important;
  align-items: flex-start !important;
  justify-content: center !important;
  overflow: visible !important;
}

.xp-visual-stage {
  position: relative !important;
  width: 520px !important;
  height: 455px !important;
  margin: 0 auto !important;
}

/* DONUT */
.xp-main-donut-fixed {
  position: absolute !important;
  width: 245px !important;
  height: 245px !important;
  left: 50% !important;
  top: 44% !important;
  transform: translate(-50%, -50%) !important;
  border-radius: 50% !important;
  background: conic-gradient(
    from -98deg,
    #980053 0deg 116deg,
    #ffffff 116deg 122deg,
    #980053 122deg 248deg,
    #ffffff 248deg 254deg,
    #980053 254deg 326deg,
    #efd3e4 326deg 360deg
  ) !important;
  box-shadow: 0 7px 15px rgba(0, 0, 0, 0.2) !important;
}

.xp-main-donut-fixed::after {
  content: '' !important;
  position: absolute !important;
  inset: 31px !important;
  border-radius: 50% !important;
  background: #fffdf9 !important;
}

.xp-main-donut-center {
  position: absolute !important;
  inset: 48px !important;
  z-index: 2 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  color: #111 !important;
}

.xp-main-donut-center span {
  font-size: 11px !important;
  line-height: 1.15 !important;
  font-weight: 500 !important;
  margin-bottom: 6px !important;
}

.xp-main-donut-center strong {
  font-size: 18px !important;
  line-height: 1.05 !important;
  font-weight: 800 !important;
  margin-bottom: 6px !important;
}

.xp-main-donut-center small {
  font-size: 10px !important;
  line-height: 1.15 !important;
  color: #222 !important;
  margin-bottom: 7px !important;
}

.xp-main-donut-center b {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 3px 8px !important;
  border-radius: 999px !important;
  background: #f2d4e5 !important;
  color: #980053 !important;
  font-size: 9px !important;
  font-weight: 800 !important;
}

/* FLOATING CARDS */
.xp-floating-card-fixed {
  position: absolute !important;
  width: 76px !important;
  min-height: 94px !important;
  padding: 9px 8px 7px !important;
  border: 1.8px solid rgba(0, 0, 0, 0.55) !important;
  border-radius: 7px !important;
  background: #fffdf9 !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.16) !important;
  color: #111 !important;
  z-index: 5 !important;
}

.xp-floating-card-fixed svg {
  width: 21px !important;
  height: 21px !important;
  display: block !important;
  color: #111 !important;
  margin: 0 0 7px !important;
}

.xp-floating-card-fixed strong,
.xp-floating-card-fixed span,
.xp-floating-card-fixed small {
  display: block !important;
}

.xp-floating-card-fixed strong {
  font-size: 11px !important;
  line-height: 1.1 !important;
  font-weight: 500 !important;
  margin-bottom: 2px !important;
}

.xp-floating-card-fixed span {
  font-size: 12px !important;
  line-height: 1.05 !important;
  font-weight: 800 !important;
  margin-bottom: 2px !important;
}

.xp-floating-card-fixed small {
  font-size: 11px !important;
  line-height: 1.05 !important;
  font-weight: 500 !important;
}

.xp-grocery-card-fixed {
  left: 5% !important;
  top: 14% !important;
}

.xp-food-card-fixed {
  right: 7% !important;
  top: 1% !important;
}

.xp-fashion-card-fixed {
  right: 7% !important;
  top: 52% !important;
}

/* ARROWS */
.xp-svg-arrow {
  position: absolute !important;
  width: 72px !important;
  height: 54px !important;
  color: #111 !important;
  z-index: 4 !important;
  overflow: visible !important;
}

.xp-svg-arrow-left {
  left: 13% !important;
  top: 38% !important;
}

.xp-svg-arrow-top {
  right: 29% !important;
  top: 10% !important;
}

.xp-svg-arrow-bottom {
  right: 29% !important;
  top: 54% !important;
}

/* ON TRACK CARD */
.xp-on-track-fixed {
  position: absolute !important;
  left: 5% !important;
  right: 15% !important;
  bottom: 0 !important;
  height: 68px !important;
  border: 1px solid rgba(138, 0, 72, 0.13) !important;
  border-radius: 8px !important;
  background: #ffffff !important;
  box-shadow: 0 4px 14px rgba(35, 15, 25, 0.06) !important;
  display: grid !important;
  grid-template-columns: 22px 1fr 88px !important;
  align-items: center !important;
  column-gap: 12px !important;
  padding: 0 18px !important;
  z-index: 3 !important;
  overflow: hidden !important;
}

.xp-check-fixed {
  width: 16px !important;
  height: 16px !important;
  border-radius: 999px !important;
  background: #10b76b !important;
  color: #fff !important;
  font-size: 11px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-weight: 900 !important;
}

.xp-on-track-fixed strong {
  display: block !important;
  font-size: 14px !important;
  line-height: 1.1 !important;
  font-weight: 800 !important;
  color: #111 !important;
  margin-bottom: 5px !important;
}

.xp-on-track-fixed span {
  display: block !important;
  font-size: 11px !important;
  line-height: 1.15 !important;
  color: #333 !important;
}

.xp-bars-fixed {
  height: 46px !important;
  display: flex !important;
  align-items: flex-end !important;
  justify-content: flex-end !important;
  gap: 2px !important;
}

.xp-bars-fixed i {
  width: 4px !important;
  border-radius: 99px 99px 0 0 !important;
  background: rgba(29, 198, 136, 0.22) !important;
  display: block !important;
}

.xp-bars-fixed i:nth-child(1) { height: 20px !important; }
.xp-bars-fixed i:nth-child(2) { height: 23px !important; }
.xp-bars-fixed i:nth-child(3) { height: 18px !important; }
.xp-bars-fixed i:nth-child(4) { height: 24px !important; }
.xp-bars-fixed i:nth-child(5) { height: 27px !important; }
.xp-bars-fixed i:nth-child(6) { height: 25px !important; }
.xp-bars-fixed i:nth-child(7) { height: 31px !important; }
.xp-bars-fixed i:nth-child(8) { height: 29px !important; }
.xp-bars-fixed i:nth-child(9) { height: 35px !important; background: rgba(29, 198, 136, 0.4) !important; }
.xp-bars-fixed i:nth-child(10) { height: 42px !important; background: rgba(29, 198, 136, 0.45) !important; }
.xp-bars-fixed i:nth-child(11) { height: 34px !important; background: rgba(29, 198, 136, 0.45) !important; }
.xp-bars-fixed i:nth-child(12) { height: 38px !important; background: rgba(29, 198, 136, 0.45) !important; }
.xp-bars-fixed i:nth-child(13) { height: 49px !important; background: rgba(29, 198, 136, 0.5) !important; }
.xp-bars-fixed i:nth-child(14) { height: 33px !important; background: rgba(29, 198, 136, 0.45) !important; }
.xp-bars-fixed i:nth-child(15) { height: 45px !important; background: rgba(29, 198, 136, 0.5) !important; }
.xp-bars-fixed i:nth-child(16) { height: 40px !important; background: rgba(29, 198, 136, 0.45) !important; }

/* old text arrows must stay hidden */
.xp-arrow-fixed,
.xp-arrow-one,
.xp-arrow-two,
.xp-arrow-three {
  display: none !important;
}

/* =========================================================
   FINAL LAUNCH SCREEN FIX — CLEAN FIGMA-LIKE LAYOUT
   Paste this at the VERY BOTTOM of page.jsx style block
   ========================================================= */

.xp-page {
  padding: 0 0 48px !important;
  background: #fffaf4 !important;
  overflow-x: hidden !important;
}

.xp-launch-page {
  width: 100% !important;
  min-height: 100vh !important;
  background: #fffaf4 !important;
  color: #111 !important;
}

.xp-launch-topbar {
  height: 88px !important;
  padding: 0 28px !important;
  background: #fffaf4 !important;
  border-bottom: 1px solid rgba(20, 15, 12, 0.14) !important;
  box-shadow: 0 4px 12px rgba(20, 15, 12, 0.07) !important;
}

.xp-launch-brand {
  gap: 13px !important;
}

.xp-launch-brand img {
  width: 50px !important;
  height: 50px !important;
}

.xp-launch-brand span {
  font-size: 18px !important;
  line-height: 1.05 !important;
  font-weight: 800 !important;
  color: #8a0048 !important;
}

.xp-launch-icons {
  gap: 18px !important;
}

.xp-launch-icons svg {
  width: 20px !important;
  height: 20px !important;
}

.xp-launch-card-fixed {
  width: calc(100% - 48px) !important;
  margin: 28px 24px 0 !important;
  min-height: 590px !important;
  display: grid !important;
  grid-template-columns: 48.5% 51.5% !important;
  border: 1px solid rgba(138, 0, 72, 0.18) !important;
  border-radius: 7px !important;
  background: #fffdf9 !important;
  overflow: hidden !important;
}

/* LEFT SIDE */
.xp-launch-left-fixed {
  padding: 24px 12px 28px 28px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
}

.xp-new-fixed {
  height: 28px !important;
  padding: 0 18px !important;
  margin: 0 0 48px !important;
  border-radius: 5px !important;
  border: 1px solid rgba(138, 0, 72, 0.25) !important;
  background: #fff6fb !important;
  color: #8a0048 !important;
  font-size: 16px !important;
  font-weight: 900 !important;
  line-height: 27px !important;
  letter-spacing: 0 !important;
}

.xp-launch-left-fixed h1 {
  margin: 0 0 28px !important;
  color: #8a0048 !important;
  font-size: clamp(50px, 4.7vw, 66px) !important;
  line-height: 0.96 !important;
  font-weight: 900 !important;
  letter-spacing: -0.055em !important;
  text-shadow: 0 6px 8px rgba(70, 0, 35, 0.22) !important;
  white-space: nowrap !important;
}

.xp-launch-left-fixed h2 {
  margin: 0 0 28px !important;
  color: #050505 !important;
  font-size: clamp(42px, 3.6vw, 56px) !important;
  line-height: 1.08 !important;
  font-weight: 400 !important;
  letter-spacing: -0.055em !important;
}

.xp-launch-left-fixed h2 strong {
  color: #8a0048 !important;
  font-weight: 400 !important;
}

.xp-launch-left-fixed p {
  max-width: 720px !important;
  margin: 0 0 60px !important;
  color: #050505 !important;
  font-size: clamp(25px, 2.2vw, 34px) !important;
  line-height: 1.22 !important;
  font-weight: 400 !important;
  letter-spacing: -0.035em !important;
}

.xp-launch-buttons-fixed {
  display: flex !important;
  align-items: center !important;
  gap: 22px !important;
  margin-bottom: 34px !important;
}

.xp-launch-buttons-fixed button {
  height: 60px !important;
  min-width: 280px !important;
  padding: 0 30px !important;
  border: 0 !important;
  border-radius: 15px !important;
  background: linear-gradient(180deg, #676767 0%, #202020 44%, #050505 100%) !important;
  color: #ffffff !important;
  font-size: 24px !important;
  font-weight: 500 !important;
  letter-spacing: 0 !important;
  cursor: pointer !important;
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.55),
    inset 0 -2px 0 rgba(0, 0, 0, 0.55),
    0 14px 25px rgba(0, 0, 0, 0.16) !important;
}

.xp-private-line-fixed {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  color: #292929 !important;
  font-size: 18px !important;
}

.xp-private-line-fixed svg {
  width: 21px !important;
  height: 21px !important;
  color: #111 !important;
}

/* RIGHT SIDE */
.xp-launch-visual-fixed {
  position: relative !important;
  min-height: 590px !important;
  width: 100% !important;
  display: flex !important;
  align-items: flex-start !important;
  justify-content: center !important;
  overflow: visible !important;
}

.xp-visual-stage {
  position: relative !important;
  width: 560px !important;
  height: 520px !important;
  margin: 12px auto 0 !important;
}

/* DONUT */
.xp-main-donut-fixed {
  position: absolute !important;
  width: 295px !important;
  height: 295px !important;
  left: 50% !important;
  top: 44% !important;
  transform: translate(-50%, -50%) !important;
  border-radius: 50% !important;
  background: conic-gradient(
    from -98deg,
    #980053 0deg 116deg,
    #ffffff 116deg 122deg,
    #980053 122deg 248deg,
    #ffffff 248deg 254deg,
    #980053 254deg 326deg,
    #efd3e4 326deg 360deg
  ) !important;
  box-shadow: 0 7px 16px rgba(0, 0, 0, 0.2) !important;
}

.xp-main-donut-fixed::after {
  content: '' !important;
  position: absolute !important;
  inset: 38px !important;
  border-radius: 50% !important;
  background: #fffdf9 !important;
}

.xp-main-donut-center {
  position: absolute !important;
  inset: 58px !important;
  z-index: 2 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  color: #111 !important;
}

.xp-main-donut-center span {
  font-size: 15px !important;
  line-height: 1.15 !important;
  font-weight: 500 !important;
  margin-bottom: 8px !important;
}

.xp-main-donut-center strong {
  font-size: 25px !important;
  line-height: 1.05 !important;
  font-weight: 800 !important;
  margin-bottom: 8px !important;
}

.xp-main-donut-center small {
  font-size: 13px !important;
  line-height: 1.15 !important;
  color: #222 !important;
  margin-bottom: 9px !important;
}

.xp-main-donut-center b {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 4px 12px !important;
  border-radius: 999px !important;
  background: #f2d4e5 !important;
  color: #980053 !important;
  font-size: 12px !important;
  font-weight: 800 !important;
}

/* FLOATING CARDS */
.xp-floating-card-fixed {
  position: absolute !important;
  width: 96px !important;
  min-height: 122px !important;
  padding: 13px 12px 10px !important;
  border: 1.8px solid rgba(0, 0, 0, 0.55) !important;
  border-radius: 8px !important;
  background: #fffdf9 !important;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.16) !important;
  color: #111 !important;
  z-index: 5 !important;
}

.xp-floating-card-fixed svg {
  width: 34px !important;
  height: 34px !important;
  display: block !important;
  color: #111 !important;
  margin: 0 0 12px !important;
}

.xp-floating-card-fixed strong,
.xp-floating-card-fixed span,
.xp-floating-card-fixed small {
  display: block !important;
}

.xp-floating-card-fixed strong {
  font-size: 15px !important;
  line-height: 1.1 !important;
  font-weight: 500 !important;
  margin-bottom: 3px !important;
}

.xp-floating-card-fixed span {
  font-size: 17px !important;
  line-height: 1.05 !important;
  font-weight: 800 !important;
  margin-bottom: 3px !important;
}

.xp-floating-card-fixed small {
  font-size: 15px !important;
  line-height: 1.05 !important;
  font-weight: 500 !important;
}

.xp-grocery-card-fixed {
  left: 12% !important;
  top: 18% !important;
}

.xp-food-card-fixed {
  right: 1% !important;
  top: 0 !important;
}

.xp-fashion-card-fixed {
  right: 1% !important;
  top: 57% !important;
}

/* ARROWS */
.xp-svg-arrow {
  position: absolute !important;
  width: 76px !important;
  height: 56px !important;
  color: #111 !important;
  z-index: 4 !important;
  overflow: visible !important;
}

.xp-svg-arrow-left {
  left: 18% !important;
  top: 39% !important;
}

.xp-svg-arrow-top {
  right: 27% !important;
  top: 13% !important;
}

.xp-svg-arrow-bottom {
  right: 29% !important;
  top: 53% !important;
}

/* ON TRACK CARD */
.xp-on-track-fixed {
  position: absolute !important;
  left: 12% !important;
  right: 11% !important;
  bottom: 6px !important;
  height: 74px !important;
  border: 1px solid rgba(138, 0, 72, 0.13) !important;
  border-radius: 8px !important;
  background: #ffffff !important;
  box-shadow: 0 4px 14px rgba(35, 15, 25, 0.06) !important;
  display: grid !important;
  grid-template-columns: 22px 1fr 105px !important;
  align-items: center !important;
  column-gap: 12px !important;
  padding: 0 22px !important;
  z-index: 3 !important;
  overflow: hidden !important;
}

.xp-check-fixed {
  width: 18px !important;
  height: 18px !important;
  border-radius: 999px !important;
  background: #10b76b !important;
  color: #fff !important;
  font-size: 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-weight: 900 !important;
}

.xp-on-track-fixed strong {
  display: block !important;
  font-size: 16px !important;
  line-height: 1.1 !important;
  font-weight: 800 !important;
  color: #111 !important;
  margin-bottom: 5px !important;
}

.xp-on-track-fixed span {
  display: block !important;
  font-size: 12px !important;
  line-height: 1.15 !important;
  color: #333 !important;
}

.xp-bars-fixed {
  height: 50px !important;
  display: flex !important;
  align-items: flex-end !important;
  justify-content: flex-end !important;
  gap: 2px !important;
}

.xp-bars-fixed i {
  width: 4px !important;
  border-radius: 99px 99px 0 0 !important;
  background: rgba(29, 198, 136, 0.22) !important;
  display: block !important;
}

.xp-bars-fixed i:nth-child(1) { height: 21px !important; }
.xp-bars-fixed i:nth-child(2) { height: 25px !important; }
.xp-bars-fixed i:nth-child(3) { height: 20px !important; }
.xp-bars-fixed i:nth-child(4) { height: 27px !important; }
.xp-bars-fixed i:nth-child(5) { height: 30px !important; }
.xp-bars-fixed i:nth-child(6) { height: 28px !important; }
.xp-bars-fixed i:nth-child(7) { height: 34px !important; }
.xp-bars-fixed i:nth-child(8) { height: 32px !important; }
.xp-bars-fixed i:nth-child(9) { height: 38px !important; background: rgba(29, 198, 136, 0.4) !important; }
.xp-bars-fixed i:nth-child(10) { height: 45px !important; background: rgba(29, 198, 136, 0.45) !important; }
.xp-bars-fixed i:nth-child(11) { height: 37px !important; background: rgba(29, 198, 136, 0.45) !important; }
.xp-bars-fixed i:nth-child(12) { height: 42px !important; background: rgba(29, 198, 136, 0.45) !important; }
.xp-bars-fixed i:nth-child(13) { height: 50px !important; background: rgba(29, 198, 136, 0.5) !important; }
.xp-bars-fixed i:nth-child(14) { height: 36px !important; background: rgba(29, 198, 136, 0.45) !important; }
.xp-bars-fixed i:nth-child(15) { height: 47px !important; background: rgba(29, 198, 136, 0.5) !important; }
.xp-bars-fixed i:nth-child(16) { height: 42px !important; background: rgba(29, 198, 136, 0.45) !important; }

/* hide any accidental duplicate outside the stage */
.xp-launch-visual-fixed > .xp-on-track-fixed {
  display: none !important;
}

.xp-arrow-fixed,
.xp-arrow-one,
.xp-arrow-two,
.xp-arrow-three {
  display: none !important;
}

@media (max-width: 900px) {
  .xp-launch-card-fixed {
    width: calc(100% - 32px) !important;
    margin: 18px 16px 0 !important;
    grid-template-columns: 1fr !important;
  }

  .xp-launch-left-fixed {
    padding: 24px !important;
  }

  .xp-launch-left-fixed h1 {
    white-space: normal !important;
    font-size: 42px !important;
  }

  .xp-launch-left-fixed h2 {
    font-size: 34px !important;
  }

  .xp-launch-left-fixed p {
    font-size: 20px !important;
  }

  .xp-launch-buttons-fixed {
    flex-direction: column !important;
    align-items: stretch !important;
  }

  .xp-launch-buttons-fixed button {
    min-width: 100% !important;
  }

  .xp-visual-stage {
    width: 100% !important;
    max-width: 430px !important;
    height: 470px !important;
    margin: 0 auto !important;
  }

  .xp-main-donut-fixed {
    width: 215px !important;
    height: 215px !important;
  }

  .xp-main-donut-fixed::after {
    inset: 28px !important;
  }

  .xp-main-donut-center {
    inset: 40px !important;
  }

  .xp-floating-card-fixed {
    width: 78px !important;
    min-height: 96px !important;
  }

  .xp-grocery-card-fixed {
    left: 0 !important;
    top: 18% !important;
  }

  .xp-food-card-fixed {
    right: 0 !important;
    top: 2% !important;
  }

  .xp-fashion-card-fixed {
    right: 0 !important;
    top: 54% !important;
  }

  .xp-on-track-fixed {
    left: 0 !important;
    right: 10% !important;
    bottom: 8px !important;
    grid-template-columns: 20px 1fr !important;
  }

  .xp-bars-fixed {
    display: none !important;
  }
}

/* REDUCE FONT INSIDE LAUNCH BUTTONS */
.xp-launch-buttons-fixed button {
  font-size: 15px !important;
  height: 44px !important;
  min-width: 190px !important;
  padding: 0 20px !important;
  border-radius: 12px !important;
}

.xp-launch-buttons-fixed button span {
  font-size: 16px !important;
}

/* REDUCE PRIVATE LINE FONT */
.xp-private-line-fixed {
  font-size: 15px !important;
  gap: 8px !important;
}

.xp-private-line-fixed svg {
  width: 17px !important;
  height: 17px !important;
}

/* MORE HEIGHT REDUCTION ONLY */
.xp-fashion-card-fixed {
  min-height: 60px !important;
  height: auto !important;
  padding-top: 5px !important;
  padding-bottom: 5px !important;
}

.xp-fashion-card-fixed svg {
  margin-bottom: 1px !important;
}

.xp-fashion-card-fixed strong,
.xp-fashion-card-fixed span,
.xp-fashion-card-fixed small {
  line-height: 1 !important;
}

/* FIX BOX OVERLAP AROUND DONUT */
.xp-launch-visual-fixed {
  overflow: visible !important;
}

.xp-visual-stage {
  width: 620px !important;
  height: 520px !important;
  margin: 0 auto !important;
  position: relative !important;
}

/* Keep donut centered but away from cards */
.xp-main-donut-fixed {
  width: 260px !important;
  height: 260px !important;
  left: 50% !important;
  top: 43% !important;
  transform: translate(-50%, -50%) !important;
}

.xp-main-donut-fixed::after {
  inset: 34px !important;
}

/* Move cards away from donut and on-track box */
.xp-grocery-card-fixed {
  left: 18px !important;
  top: 92px !important;
}

.xp-food-card-fixed {
  right: 34px !important;
  top: 10px !important;
}

.xp-fashion-card-fixed {
  right: 34px !important;
  top: 292px !important;
  min-height: 102px !important;
  height: auto !important;
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

/* Keep card sizes consistent */
.xp-floating-card-fixed {
  width: 92px !important;
  min-height: 108px !important;
  box-sizing: border-box !important;
}

/* Fashion height tighter only */
.xp-fashion-card-fixed svg {
  margin-bottom: 6px !important;
}

.xp-fashion-card-fixed strong,
.xp-fashion-card-fixed span,
.xp-fashion-card-fixed small {
  line-height: 1.05 !important;
}

/* Move arrows with cards */
.xp-svg-arrow-left {
  left: 78px !important;
  top: 230px !important;
}

.xp-svg-arrow-top {
  right: 185px !important;
  top: 70px !important;
}

.xp-svg-arrow-bottom {
  right: 185px !important;
  top: 310px !important;
}

/* Keep on-track card below donut, not under fashion card */
.xp-on-track-fixed {
  left: 42px !important;
  right: 150px !important;
  bottom: 0 !important;
  height: 72px !important;
  z-index: 2 !important;
}

/* Cards should stay above arrows, not overlap text card */
.xp-floating-card-fixed {
  z-index: 5 !important;
}

.xp-main-donut-fixed {
  z-index: 3 !important;
}

.xp-svg-arrow {
  z-index: 4 !important;
}

/* INCREASE FONT SIZE FOR HOME XPENSE METER SECTION */
.xp-greeting strong {
  font-size: 22px !important;
  line-height: 1.2 !important;
}

.xp-greeting span {
  font-size: 16px !important;
  line-height: 1.35 !important;
}

.xp-meter-head h3 {
  font-size: 24px !important;
  line-height: 1.2 !important;
}

.xp-meter-head h3 span {
  font-size: 12px !important;
  padding: 4px 10px !important;
}

.xp-meter-head p {
  font-size: 16px !important;
  line-height: 1.4 !important;
}

.xp-spend-box small,
.xp-spend-box span,
.xp-spend-box p {
  font-size: 16px !important;
  line-height: 1.35 !important;
}

.xp-spend-box strong {
  font-size: 34px !important;
  line-height: 1.1 !important;
}

.xp-spend-box button {
  font-size: 16px !important;
  letter-spacing: 0.04em !important;
}

/* REDUCE HOME SCREEN CATEGORY BOX SIZES */
.xp-meter-grid {
  grid-template-columns: minmax(260px, 1fr) auto !important;
  align-items: start !important;
}

.xp-category-row,
.xp-cat-row {
  display: grid !important;
  grid-template-columns: repeat(3, 145px) !important;
  gap: 16px !important;
  justify-content: end !important;
}

.xp-category-row article,
.xp-cat-row article {
  width: 145px !important;
  min-height: 170px !important;
  padding: 14px 14px 12px !important;
  border-radius: 9px !important;
  box-sizing: border-box !important;
}

.xp-category-row svg,
.xp-cat-row svg {
  width: 48px !important;
  height: 48px !important;
  margin-bottom: 18px !important;
}

.xp-category-row strong,
.xp-cat-row strong {
  font-size: 14px !important;
  line-height: 1.1 !important;
}

.xp-category-row span,
.xp-cat-row span {
  font-size: 16px !important;
  line-height: 1.1 !important;
}

.xp-category-row small,
.xp-cat-row small {
  font-size: 13px !important;
  line-height: 1.1 !important;
}

.xp-category-row article div,
.xp-cat-row article div {
  height: 5px !important;
  margin-top: 14px !important;
}
  /* MAKE HOME XPENSE METER TITLE LESS BOLD */
.xp-meter-head h3 {
  font-weight: 600 !important;
  letter-spacing: -0.02em !important;
}

/* REDUCE BOLDNESS OF ₹12,450 AMOUNT */
.xp-spend-box strong {
  font-weight: 600 !important;
}

/* MAKE XPENSE METER HOME TEXT BLACK */
.xp-meter-head p,
.xp-spend-box small,
.xp-spend-box span,
.xp-spend-box p {
  color: #000 !important;
}
  .xp-spend-box strong {
  font-weight: 500 !important;
}

/* REDUCE HOME CATEGORY ICON BOLDNESS */
.xp-category-row svg,
.xp-cat-row svg {
  width: 42px !important;
  height: 42px !important;
  color: #111 !important;
  stroke-width: 1.35 !important;
}

.xp-category-row svg path,
.xp-category-row svg circle,
.xp-cat-row svg path,
.xp-cat-row svg circle {
  stroke-width: 1.35 !important;
}

/* make icons visually lighter inside the large boxes */
.xp-category-row svg *,
.xp-cat-row svg * {
  vector-effect: non-scaling-stroke;
}

/* REMOVE BIG GAP BETWEEN XPENSE METER BOX AND RECENT ORDERS */
.xp-meter-card {
  margin-bottom: 0 !important;
  padding-bottom: 16px !important;
}

.xp-meter-grid {
  margin-bottom: 0 !important;
}

.xp-category-row,
.xp-cat-row {
  margin-bottom: 0 !important;
}

.xp-orders {
  margin-top: 12px !important;
  padding-top: 0 !important;
}

.xp-home-body {
  padding-bottom: 20px !important;
}

/* RECENT ORDERS HEADING — BIGGER BUT LESS BOLD */
.xp-orders h3 {
  font-size: 22px !important;
  font-weight: 600 !important;
  line-height: 1.2 !important;
  letter-spacing: -0.02em !important;
}

/* MAKE EDIT BUDGET LOOK CLEAN, NOT BOLD/UPPERCASE */
.xp-spend-box button {
  color: #8a0048 !important;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  letter-spacing: 0 !important;
  text-transform: none !important;
  line-height: 1.2 !important;
  cursor: pointer !important;
}
  /* ALIGN REMAINING AMOUNT + EDIT BUDGET IN ONE ROW */
.xp-budget-row {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 16px !important;
  width: 100% !important;
  margin-top: 8px !important;
}

.xp-budget-row p {
  margin: 0 !important;
  color: #000 !important;
  font-size: 13px !important;
  font-weight: 400 !important;
  line-height: 1.2 !important;
}

.xp-budget-row button {
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important;
  border: none !important;
  background: transparent !important;
  color: #000 !important;
  padding: 0 !important;
  margin: 0 !important;
  font-size: 13px !important;
  font-weight: 400 !important;
  letter-spacing: 0 !important;
  text-transform: none !important;
  line-height: 1.2 !important;
  cursor: pointer !important;
  white-space: nowrap !important;
}

.xp-pencil {
  font-size: 13px !important;
  line-height: 1 !important;
}

.xp-arrow {
  font-size: 14px !important;
  line-height: 1 !important;
}

/* REDUCE LENGTH OF XPENSE PROGRESS LINE */
.xp-spend-box .xp-progress {
  width: 62% !important;
  max-width: 430px !important;
}

/* ALIGN EDIT BUDGET WITH PROGRESS LINE WIDTH */
.xp-spend-box .xp-progress {
  width: 62% !important;
  max-width: 430px !important;
}

.xp-budget-row {
  width: 62% !important;
  max-width: 430px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 16px !important;
  margin-top: 10px !important;
}

.xp-budget-row p {
  margin: 0 !important;
  color: #000 !important;
  font-size: 13px !important;
  line-height: 1.2 !important;
  white-space: nowrap !important;
}

.xp-budget-row button {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  background: transparent !important;
  color: #000 !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 5px !important;
  font-size: 13px !important;
  font-weight: 400 !important;
  letter-spacing: 0 !important;
  text-transform: none !important;
  white-space: nowrap !important;
  cursor: pointer !important;
}

/* SLIGHTLY INCREASE HOME CATEGORY BOX WIDTH ONLY */
.xp-category-row,
.xp-cat-row {
  grid-template-columns: repeat(3, 155px) !important;
  gap: 16px !important;
  justify-content: end !important;
}

.xp-category-row article,
.xp-cat-row article {
  width: 155px !important;
  min-height: 170px !important;
  padding-left: 14px !important;
  padding-right: 14px !important;
  box-sizing: border-box !important;
}

/* KEEP THE SMALL PROGRESS LINE SAME LENGTH */
.xp-category-row article div,
.xp-cat-row article div {
  width: 120px !important;
  max-width: 118px !important;
}
  /* SLIGHTLY INCREASE RECENT ORDER CARDS, FONTS, AND IMAGES */
.xp-order-grid {
  gap: 18px !important;
}

.xp-order-grid article {
  min-height: 150px !important;
  padding: 16px 18px !important;
  border-radius: 10px !important;
}

.xp-order-head small {
  font-size: 12px !important;
  line-height: 1.2 !important;
}

.xp-order-head strong {
  font-size: 16px !important;
  line-height: 1.2 !important;
  margin-top: 5px !important;
  font-weight: 600 !important;
}

.xp-order-head > span {
  height: 22px !important;
  padding: 0 12px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
}

.xp-img-row {
  gap: 10px !important;
  margin: 16px 0 14px !important;
}

.xp-img-row img {
  width: 48px !important;
  height: 48px !important;
  border-radius: 9px !important;
}

.xp-order-bottom strong {
  font-size: 18px !important;
  line-height: 1.1 !important;
  font-weight: 700 !important;
}

.xp-order-bottom span {
  font-size: 13px !important;
  line-height: 1.2 !important;
}

/* PLUS CARD WITH DELIVERY IMAGE */
.xp-plus-card {
  position: relative !important;
  min-height: 72px !important;
  padding: 14px 18px 14px 20px !important;
  border-radius: 8px !important;
  background: #8a0048 !important;
  color: #fff !important;
  border: 1px solid rgba(255, 255, 255, 0.45) !important;
  overflow: hidden !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 12px !important;
}

.xp-plus-text {
  position: relative !important;
  z-index: 2 !important;
}

.xp-plus-text strong {
  display: block !important;
  font-size: 24px !important;
  line-height: 1 !important;
  font-weight: 700 !important;
  color: #fff !important;
  margin-bottom: 5px !important;
}

.xp-plus-text span {
  display: block !important;
  font-size: 13px !important;
  line-height: 1.2 !important;
  font-weight: 400 !important;
  color: rgba(255, 255, 255, 0.95) !important;
}

.xp-plus-delivery-img {
  width: 86px !important;
  height: 58px !important;
  object-fit: contain !important;
  object-position: center !important;
  flex-shrink: 0 !important;
  position: relative !important;
  z-index: 2 !important;
}

/* MAKE PLUS BOX BACKGROUND MATCH THE DELIVERY IMAGE BACKGROUND */
.xp-plus-card {
  background: #8a0048 !important;
  border: 1px solid rgba(255, 255, 255, 0.45) !important;
  box-shadow: none !important;
}

/* Make image blend better inside same maroon background */
.xp-plus-delivery-img {
  background: #8a0048 !important;
  mix-blend-mode: normal !important;
}
  /* FIX PLUS CARD IMAGE BACKGROUND MISMATCH */
.xp-plus-card {
  background: #780040 !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.35) !important;
  box-shadow: none !important;
}

.xp-plus-delivery-img {
  background: transparent !important;
  border-radius: 0 !important;
  mix-blend-mode: normal !important;
  display: block !important;
}

/* make image sit cleanly inside the card */
.xp-plus-card img {
  background-color: #780040 !important;
}

/* FINAL ALIGNMENT FIX FOR DONUT + FLOATING BOXES + ARROWS */
.xp-launch-visual-fixed {
  min-height: 500px !important;
  display: flex !important;
  justify-content: center !important;
  align-items: flex-start !important;
  overflow: visible !important;
}

.xp-visual-stage {
  position: relative !important;
  width: 560px !important;
  height: 465px !important;
  margin: 0 auto !important;
}

/* Donut placement */
.xp-main-donut-fixed {
  width: 245px !important;
  height: 245px !important;
  left: 48% !important;
  top: 43% !important;
  transform: translate(-50%, -50%) !important;
}

.xp-main-donut-fixed::after {
  inset: 31px !important;
}

/* Floating boxes */
.xp-floating-card-fixed {
  width: 88px !important;
  min-height: 112px !important;
  padding: 10px 10px 9px !important;
  border-radius: 8px !important;
  box-sizing: border-box !important;
}

.xp-floating-card-fixed svg {
  width: 30px !important;
  height: 30px !important;
  margin-bottom: 10px !important;
}

.xp-floating-card-fixed strong {
  font-size: 14px !important;
  line-height: 1.1 !important;
}

.xp-floating-card-fixed span {
  font-size: 16px !important;
  line-height: 1.05 !important;
}

.xp-floating-card-fixed small {
  font-size: 14px !important;
  line-height: 1.05 !important;
}

/* Exact box positions */
.xp-grocery-card-fixed {
  left: 28px !important;
  top: 104px !important;
}

.xp-food-card-fixed {
  right: 42px !important;
  top: 24px !important;
}

.xp-fashion-card-fixed {
  right: 42px !important;
  top: 270px !important;
  min-height: 112px !important;
  padding-top: 10px !important;
  padding-bottom: 9px !important;
}

/* Arrow alignment */
.xp-svg-arrow {
  width: 68px !important;
  height: 52px !important;
  color: #111 !important;
  z-index: 4 !important;
  overflow: visible !important;
}

.xp-svg-arrow-left {
  left: 86px !important;
  top: 250px !important;
}

.xp-svg-arrow-top {
  right: 168px !important;
  top: 82px !important;
}

.xp-svg-arrow-bottom {
  right: 168px !important;
  top: 282px !important;
}

/* On-track card should stay below, not overlap fashion */
.xp-on-track-fixed {
  left: 44px !important;
  right: 132px !important;
  bottom: 0 !important;
  height: 68px !important;
  z-index: 2 !important;
}

/* Layer order */
.xp-main-donut-fixed {
  z-index: 3 !important;
}

.xp-floating-card-fixed {
  z-index: 5 !important;
}

.xp-svg-arrow {
  z-index: 4 !important;
}
/* FIX LEFT ARROW POINTING TO GROCERY BOX */
.xp-svg-arrow-left {
  left: 125px !important;
  top: 252px !important;
  width: 72px !important;
  height: 56px !important;
  transform: none !important;
}
/* FIX LEFT ARROW: FROM TOP OF DONUT TO GROCERY BOX */
.xp-svg-arrow-left {
  left: 128px !important;
  top: 132px !important;
  width: 105px !important;
  height: 82px !important;
  transform: none !important;
}
/* LEFT ARROW FROM TOP OF DONUT TO GROCERY BOX */
.xp-svg-arrow-left {
  left: 145px !important;
  top: 72px !important;
  width: 118px !important;
  height: 88px !important;
  transform: none !important;
}

/* SMALLER + PROPERLY ALIGNED LEFT ARROW */
.xp-svg-arrow-left {
  left: 162px !important;
  top: 105px !important;
  width: 82px !important;
  height: 58px !important;
  transform: none !important;
}

/* PUSH LEFT ARROW FORWARD TOWARDS GROCERY BOX */
.xp-svg-arrow-left {
  left: 132px !important;
  top: 108px !important;
  width: 82px !important;
  height: 58px !important;
  transform: none !important;
}
  .xp-svg-arrow-left {
  left: 100px !important;
  top: 109px !important;
  width: 82px !important;
  height: 58px !important;
  transform: none !important;
}
  /* MAKE LEFT ARROW A LITTLE SMALLER */
.xp-svg-arrow-left {
  left: 115px !important;
  top: 112px !important;
  width: 66px !important;
  height: 46px !important;
  transform: none !important;
}
  /* MOVE ON TRACK CARD A LITTLE DOWN */
.xp-on-track-fixed {
  bottom: -32px !important;
}

      `}</style>
    </main>
  );
}