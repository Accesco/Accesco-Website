"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const XpenseMobileFlow = dynamic(() => import("./XpenseMobileFlow"), {
  ssr: false,
});

const rupee = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

/* --------------------------------------------------------------- helpers */

function getSavedUserName() {
  if (typeof window === "undefined") return "User";

  const keys = [
    "user",
    "currentUser",
    "loggedInUser",
    "accesscoUser",
    "accescoUser",
    "profile",
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

      if (name) return String(name).split(" ")[0];
    } catch {
      if (raw.length < 40) return raw.split(" ")[0];
    }
  }

  return (
    localStorage.getItem("name") ||
    localStorage.getItem("userName") ||
    localStorage.getItem("displayName") ||
    "User"
  ).split(" ")[0];
}

function CategoryIcon({ type }) {
  if (type === "grocery") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M6.2 6.4h14l-1.8 7.2H8L6.2 6.4Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.2 6.4 5.5 3.8H3.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="9"
          cy="18.7"
          r="1.2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle
          cx="17.2"
          cy="18.7"
          r="1.2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    );
  }

  if (type === "food") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M6.5 3.5v7.2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M4.5 3.5v5.2c0 1.8.9 2.9 2.5 2.9s2.5-1.1 2.5-2.9V3.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 11.6v8.8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M16.5 3.5v16.9"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M16.5 3.5c2.1 2 3.2 4.4 3.2 7.8"
          stroke="currentColor"
          strokeWidth="1.4"
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
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M8.2 6.8 5 9.1l2.1 3.2 1.7-1.1v8.1h6.4v-8.1l1.7 1.1L19 9.1l-3.2-2.3c-.7-.5-1.4-.8-2.3-.8h-3c-.9 0-1.6.3-2.3.8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatIcon({ type }) {
  if (type === "wallet") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <rect
          x="3.5"
          y="6.5"
          width="17"
          height="12"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M3.5 10h17" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16.5" cy="14" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  if (type === "avg") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M4 19V5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M4 19h16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M7 15l3.5-4 3 2.5L20 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="5.5"
        width="16"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4 9.5h16M8 4v3M16 4v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="14" r="1.4" fill="currentColor" />
    </svg>
  );
}

/* ------------------------------------------------------------------ data */

const platforms = [
  { id: "grocery", name: "Grokly", spent: 5000, budget: 8000 },
  { id: "food", name: "Swadishtt", spent: 3000, budget: 4000 },
  { id: "fashion", name: "InstaStyle", spent: 4450, budget: 9000 },
];

const breakdown = [
  { name: "Grokly", amount: 5200, pct: 42, dot: "#ff2e8b" },
  { name: "Swadishtt", amount: 4900, pct: 38, dot: "#7a0c43" },
  { name: "InstaStyle", amount: 3100, pct: 20, dot: "#f4b7d4" },
];

const spendRows = [
  { id: "grocery", name: "Grokly", amount: 5200, pct: 78 },
  { id: "food", name: "Swadishtt", amount: 3600, pct: 55 },
  { id: "fashion", name: "InstaStyle", amount: 1790, pct: 24 },
];

/* ------------------------------------------------------------- component */

export default function XpenseMeterPage() {
  const [userName, setUserName] = useState("User");
  const [modal, setModal] = useState(null); // null | 'budget' | 'viewspend'
  const [totalBudget, setTotalBudget] = useState(18000);
  const [budgets, setBudgets] = useState({
    grokly: 6000,
    swadishtt: 4000,
    instastyle: 8000,
  });

  useEffect(() => {
    setUserName(getSavedUserName());
  }, []);

  const allocated = useMemo(
    () => budgets.grokly + budgets.swadishtt + budgets.instastyle,
    [budgets],
  );
  const remaining = totalBudget - allocated;
  const updateBudget = (key, value) =>
    setBudgets((prev) => ({ ...prev, [key]: Number(value) }));

  const closeModal = () => setModal(null);

  return (
    <main className="xd-root">
      <XpenseMobileFlow />

      <div className="xd-dashboard">
        {/* ---- header ---- */}
        <header className="xd-head">
          <div className="xd-head-title">
            <span>Xpense Meter</span>
            <i className="xd-spark">✦</i>
          </div>

          <div className="xd-head-right">
            <button type="button" className="xd-month">
              May 2026 <span>⌄</span>
            </button>
            <button
              type="button"
              className="xd-ghost"
              onClick={() => setModal("budget")}
            >
              Set Budget
            </button>
            <div className="xd-user">
              <span className="xd-user-dot">
                {userName.charAt(0).toUpperCase()}
              </span>
              <span className="xd-user-name">{userName}</span>
            </div>
          </div>
        </header>

        {/* ---- grid ---- */}
        <div className="xd-grid">
          {/* LEFT COLUMN */}
          <div className="xd-col">
            {/* hero */}
            <article className="xd-hero">
              <div className="xd-hero-brand">
                <Image
                  src="/logo.png"
                  alt="Accesco Living"
                  width={30}
                  height={30}
                />
                <strong>Accesco Living</strong>
              </div>

              <div className="xd-hero-body">
                <div className="xd-hero-left">
                  <span className="xd-muted">This Month Spend</span>
                  <strong className="xd-amount">₹12,450</strong>
                  <small className="xd-muted">of ₹18,000 Budget</small>

                  <div className="xd-hero-progress">
                    <i style={{ width: "68%" }} />
                  </div>

                  <div className="xd-trend up">↑ 8% From Last Month</div>
                </div>

                <div className="xd-donut68">
                  <div className="xd-donut68-face">
                    <strong>68%</strong>
                    <small>Used</small>
                  </div>
                </div>
              </div>
            </article>

            {/* budget by platform */}
            <article className="xd-card">
              <div className="xd-card-head">
                <h3>Budget By Platform</h3>
                <button
                  type="button"
                  className="xd-link"
                  onClick={() => setModal("viewspend")}
                >
                  View my Spend
                </button>
              </div>

              <div className="xd-plat-list">
                {platforms.map((p) => (
                  <div className="xd-plat" key={p.name}>
                    <span className="xd-plat-icon">
                      <CategoryIcon type={p.id} />
                    </span>
                    <div className="xd-plat-body">
                      <div className="xd-plat-top">
                        <strong>{p.name}</strong>
                        <span>
                          {Number(p.spent).toLocaleString("en-IN")}/
                          {Number(p.budget).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="xd-bar">
                        <i
                          style={{ width: `${(p.spent / p.budget) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* spend breakdown */}
            <article className="xd-card">
              <div className="xd-card-head">
                <h3>Spend Breakdown</h3>
              </div>

              <div className="xd-break-row">
                <ul className="xd-legend">
                  {breakdown.map((b) => (
                    <li key={b.name}>
                      <span
                        className="xd-legend-dot"
                        style={{ background: b.dot }}
                      />
                      <span className="xd-legend-name">{b.name}</span>
                      <span className="xd-legend-val">
                        {rupee(b.amount)} <em>({b.pct}%)</em>
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="xd-break-donut">
                  <b>₹12,450</b>
                </div>
              </div>
            </article>
          </div>

          {/* RIGHT COLUMN */}
          <div className="xd-col">
            {/* stat cards */}
            <div className="xd-stats">
              <article className="xd-stat">
                <StatIcon type="wallet" />
                <span className="xd-muted">Budget Left</span>
                <strong>₹5,200</strong>
                <small className="xd-muted">31% Remaining</small>
              </article>
              <article className="xd-stat">
                <StatIcon type="avg" />
                <span className="xd-muted">Daily Avg Spend</span>
                <strong>₹450</strong>
                <small className="xd-muted">Keep it up!</small>
              </article>
              <article className="xd-stat">
                <StatIcon type="calendar" />
                <span className="xd-muted">Top Spend Day</span>
                <strong>₹4,000</strong>
                <small className="xd-muted">On 28 May</small>
              </article>
            </div>

            {/* trend chart */}
            <article className="xd-card xd-trend-card">
              <div className="xd-card-head">
                <button type="button" className="xd-month sm">
                  May 2026 <span>⌄</span>
                </button>
              </div>

              <span className="xd-muted">This Month Spend Trend</span>
              <div className="xd-trend-amount">
                <strong className="xd-amount">₹12,450</strong>
                <span className="xd-trend up">↑ 8% From Last Month</span>
              </div>

              <div className="xd-chart">
                <svg viewBox="0 0 320 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="xdArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,46,139,0.45)" />
                      <stop offset="100%" stopColor="rgba(255,46,139,0)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M10,60 C35,42 45,36 60,38 C80,41 92,62 110,64 C130,66 145,86 160,84 C178,82 195,62 210,62 C232,62 245,28 262,30 C280,32 296,46 310,48 L310,108 L10,108 Z"
                    fill="url(#xdArea)"
                  />
                  <path
                    d="M10,60 C35,42 45,36 60,38 C80,41 92,62 110,64 C130,66 145,86 160,84 C178,82 195,62 210,62 C232,62 245,28 262,30 C280,32 296,46 310,48"
                    fill="none"
                    stroke="#ff2e8b"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="xd-chart-x">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              <div className="xd-chart-foot">
                <div>
                  <span className="xd-up">▲ Highest Spend Day</span>
                  <strong>28 May · ₹4,000</strong>
                </div>
                <div>
                  <span className="xd-down">▼ Least Spend Day</span>
                  <strong>10 May · ₹2,000</strong>
                </div>
              </div>
            </article>
          </div>

          {/* on track */}
          <div className="xd-ontrack">
            <span className="xd-ontrack-badge">↗</span>
            <strong>YOU&apos;RE ON TRACK</strong>
            <span className="xd-ontrack-note">
              Keep it up, {userName} — you&apos;re doing great.
            </span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------- modals */}
      {modal && (
        <div className="xd-modal-wrap">
          <div className="xd-scrim" onClick={closeModal} />

          <div className="xd-modal">
            <span className="xd-handle" />
            <button
              type="button"
              className="xd-close"
              onClick={closeModal}
              aria-label="Close"
            >
              ✕
            </button>

            {modal === "budget" && (
              <>
                <h2 className="xd-modal-title">
                  Set Your Budget <i className="xd-spark">✦</i>
                </h2>
                <p className="xd-modal-sub">
                  Plan your monthly budget and allocate across platforms.
                </p>

                <label className="xd-field-label">Month</label>
                <button type="button" className="xd-month wide">
                  May 2026 <span>⌄</span>
                </button>

                <label className="xd-field-label">Total Monthly Budget</label>
                <div className="xd-total-input">
                  <span className="xd-rupee">₹</span>
                  <input
                    inputMode="numeric"
                    value={totalBudget}
                    onChange={(e) =>
                      setTotalBudget(
                        Number(e.target.value.replace(/\D/g, "")) || 0,
                      )
                    }
                  />
                  <span className="xd-edit">✎</span>
                </div>
                <p className="xd-hint">
                  You can distribute your budget across platforms.
                </p>

                <label className="xd-field-label">Allocate Budget</label>

                <div className="xd-alloc">
                  <div className="xd-alloc-top">
                    <strong>Grokly</strong>
                    <span>{rupee(budgets.grokly)}</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="12000"
                    step="500"
                    value={budgets.grokly}
                    onChange={(e) => updateBudget("grokly", e.target.value)}
                  />
                </div>

                <div className="xd-alloc">
                  <div className="xd-alloc-top">
                    <strong>Swadishtt</strong>
                    <span>{rupee(budgets.swadishtt)}</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="10000"
                    step="500"
                    value={budgets.swadishtt}
                    onChange={(e) => updateBudget("swadishtt", e.target.value)}
                  />
                </div>

                <div className="xd-alloc active">
                  <div className="xd-alloc-top">
                    <strong>InstaStyle</strong>
                    <span>{rupee(budgets.instastyle)}</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="12000"
                    step="500"
                    value={budgets.instastyle}
                    onChange={(e) => updateBudget("instastyle", e.target.value)}
                  />
                </div>

                <div className="xd-alloc-summary">
                  <div>
                    <span>Allocated</span>
                    <strong>{rupee(allocated)}</strong>
                  </div>
                  <div className="xd-alloc-right">
                    <span>Remaining</span>
                    <strong
                      className={
                        remaining === 0 ? "ok" : remaining < 0 ? "over" : ""
                      }
                    >
                      {rupee(remaining)}
                    </strong>
                  </div>
                  <p
                    className={
                      remaining === 0 ? "xd-alloc-check ok" : "xd-alloc-check"
                    }
                  >
                    {remaining === 0
                      ? "✓ Total allocated = total budget"
                      : remaining < 0
                        ? "Over budget by " + rupee(Math.abs(remaining))
                        : rupee(remaining) + " left to allocate"}
                  </p>
                </div>

                <button
                  type="button"
                  className="xd-primary"
                  onClick={closeModal}
                >
                  Save Budget <span>→</span>
                </button>
              </>
            )}

            {modal === "viewspend" && (
              <>
                <h2 className="xd-modal-title">
                  View My Spend <i className="xd-spark">✦</i>
                </h2>
                <p className="xd-modal-sub">
                  Detailed overview of your spending across all platforms.
                </p>

                <label className="xd-field-label">Month</label>
                <button type="button" className="xd-month wide">
                  May 2026 <span>⌄</span>
                </button>

                <label className="xd-field-label">Total Monthly Spend</label>
                <div className="xd-spend-total">
                  <strong className="xd-amount">₹12,450</strong>
                  <span className="xd-trend up">↑ 8% From Last Month</span>
                </div>

                <div className="xd-spend-list">
                  {spendRows.map((r) => (
                    <div className="xd-spend-row" key={r.name}>
                      <span className="xd-plat-icon">
                        <CategoryIcon type={r.id} />
                      </span>
                      <div className="xd-plat-body">
                        <div className="xd-plat-top">
                          <strong>{r.name}</strong>
                          <span>{rupee(r.amount)}</span>
                        </div>
                        <div className="xd-bar">
                          <i style={{ width: `${r.pct}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="xd-primary"
                  onClick={closeModal}
                >
                  Download Report <span>↓</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .xd-root {
          min-height: 100vh;
          padding: 40px 24px 64px;
          background:
            radial-gradient(120% 90% at 100% 0%, #1a0a12 0%, transparent 45%),
            #060608;
          color: #f4f4f6;
          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .xd-muted {
          color: rgba(255, 255, 255, 0.55);
        }

        .xd-amount {
          font-family: var(--font-jetbrains-mono), ui-monospace, monospace;
          letter-spacing: -0.02em;
        }

        .xd-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          background: linear-gradient(180deg, #101015, #0a0a0d);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 50px 130px rgba(0, 0, 0, 0.6);
        }

        /* header */
        .xd-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .xd-head-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .xd-spark {
          color: #ff2e8b;
          font-style: normal;
          font-size: 15px;
        }

        .xd-head-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .xd-month {
          height: 34px;
          padding: 0 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.03);
          color: #f4f4f6;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .xd-month span {
          opacity: 0.6;
        }

        .xd-month.sm {
          height: 30px;
          font-size: 11px;
        }

        .xd-month.wide {
          width: 100%;
          justify-content: space-between;
          height: 44px;
          border-radius: 12px;
          margin-bottom: 6px;
        }

        .xd-ghost {
          height: 34px;
          padding: 0 16px;
          border-radius: 999px;
          border: 1px solid rgba(255, 46, 139, 0.4);
          background: rgba(255, 46, 139, 0.12);
          color: #ff86bd;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .xd-ghost:hover {
          background: rgba(255, 46, 139, 0.2);
        }

        .xd-user {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-left: 4px;
        }

        .xd-user-dot {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 13px;
          font-weight: 800;
          color: #fff;
          background: linear-gradient(140deg, #ff2e8b, #8a0048);
        }

        .xd-user-name {
          font-size: 13px;
          font-weight: 600;
        }

        /* grid */
        .xd-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 16px;
        }

        .xd-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }

        .xd-card {
          background: #15151a;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          padding: 18px;
        }

        .xd-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .xd-card-head h3 {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
        }

        .xd-link {
          border: 0;
          background: transparent;
          color: #ff86bd;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .xd-link:hover {
          text-decoration: underline;
        }

        /* hero — wallet background image, logo/brand pinned to top,
           spend details + progress bar + donut pinned to bottom */
        .xd-hero {
          position: relative;
          min-height: 210px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background:
            linear-gradient(
              180deg,
              rgba(10, 10, 13, 0.15) 0%,
              rgba(10, 10, 13, 0.75) 100%
            ),
            url("/images/xpense-meter/wallet.png") 40% 40%/ 140% 140% no-repeat;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 18px 20px 20px;
          overflow: hidden;
        }

        .xd-hero-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .xd-hero-brand img {
          width: 30px;
          height: 30px;
          object-fit: contain;
        }

        .xd-hero-brand strong {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .xd-hero-body {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
        }

        .xd-hero-left span,
        .xd-hero-left small {
          display: block;
          font-size: 12px;
        }

        .xd-hero-left strong {
          display: block;
          font-size: 34px;
          line-height: 1.05;
          margin: 4px 0 3px;
          font-weight: 800;
        }

        .xd-hero-progress {
          width: 180px;
          max-width: 60vw;
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.2);
          overflow: hidden;
          margin: 10px 0;
        }

        .xd-hero-progress i {
          display: block;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #ff2e8b, #ff5aa5);
        }

        .xd-trend {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
          font-size: 12px;
          font-weight: 700;
        }

        .xd-trend.up {
          color: #16c784;
        }

        .xd-donut68 {
          flex-shrink: 0;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: conic-gradient(
            from -90deg,
            #ff2e8b 0 68%,
            rgba(255, 255, 255, 0.15) 68% 100%
          );
          display: grid;
          place-items: center;
          position: relative;
          box-shadow: 0 8px 26px rgba(255, 46, 139, 0.25);
        }

        .xd-donut68::after {
          content: "";
          position: absolute;
          inset: 11px;
          border-radius: 50%;
          background: rgba(10, 10, 13, 0.85);
        }

        .xd-donut68-face {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .xd-donut68-face strong {
          display: block;
          font-size: 20px;
          font-weight: 800;
        }

        .xd-donut68-face small {
          display: block;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.6);
        }

        /* platform rows */
        .xd-plat-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .xd-plat {
          display: grid;
          grid-template-columns: 34px 1fr;
          gap: 12px;
          align-items: center;
        }

        .xd-plat-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: rgba(255, 46, 139, 0.12);
          color: #ff86bd;
        }

        .xd-plat-icon svg {
          width: 19px;
          height: 19px;
        }

        .xd-plat-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 7px;
          font-size: 13px;
        }

        .xd-plat-top strong {
          font-weight: 600;
        }

        .xd-plat-top span {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          font-family: var(--font-jetbrains-mono), monospace;
        }

        .xd-bar {
          height: 7px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        .xd-bar i {
          display: block;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #ff2e8b, #ff5aa5);
        }

        /* spend breakdown */
        .xd-break-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .xd-legend {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .xd-legend li {
          display: grid;
          grid-template-columns: 10px 1fr auto;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }

        .xd-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .xd-legend-val {
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 12px;
          font-weight: 600;
        }

        .xd-legend-val em {
          font-style: normal;
          color: rgba(255, 255, 255, 0.5);
        }

        .xd-break-donut {
          flex-shrink: 0;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: conic-gradient(
            #ff2e8b 0 42%,
            #7a0c43 42% 80%,
            #f4b7d4 80% 100%
          );
          display: grid;
          place-items: center;
          position: relative;
        }

        .xd-break-donut::after {
          content: "";
          position: absolute;
          inset: 22px;
          border-radius: 50%;
          background: #15151a;
        }

        .xd-break-donut b {
          position: relative;
          z-index: 1;
          font-size: 15px;
          font-weight: 800;
          font-family: var(--font-jetbrains-mono), monospace;
        }

        /* stat cards */
        .xd-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .xd-stat {
          background: #15151a;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 16px;
        }

        .xd-stat svg {
          width: 22px;
          height: 22px;
          color: #ff86bd;
          margin-bottom: 14px;
        }

        .xd-stat span {
          display: block;
          font-size: 11px;
        }

        .xd-stat strong {
          display: block;
          font-size: 22px;
          font-weight: 800;
          margin: 4px 0 2px;
        }

        .xd-stat small {
          display: block;
          font-size: 11px;
        }

        /* trend card */
        .xd-trend-card {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .xd-trend-card .xd-card-head {
          justify-content: flex-start;
          margin-bottom: 10px;
        }

        .xd-trend-amount {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0 6px;
        }

        .xd-trend-amount strong {
          font-size: 30px;
          font-weight: 800;
        }

        .xd-trend-amount .xd-trend {
          margin-top: 0;
        }

        .xd-chart {
          flex: 1;
          min-height: 150px;
          margin-top: 6px;
        }

        .xd-chart svg {
          width: 100%;
          height: 150px;
          display: block;
        }

        .xd-chart-x {
          display: flex;
          justify-content: space-between;
          margin-top: 4px;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
        }

        .xd-chart-foot {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .xd-chart-foot span {
          display: block;
          font-size: 11px;
          margin-bottom: 3px;
        }

        .xd-chart-foot strong {
          font-size: 13px;
          font-weight: 700;
        }

        .xd-up {
          color: #16c784;
        }

        .xd-down {
          color: #ff6b8b;
        }

        /* on track */
        .xd-ontrack {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(90deg, #0f1410, #0b0c0e);
          border: 1px solid rgba(22, 199, 132, 0.28);
          border-radius: 16px;
          padding: 16px 22px;
        }

        .xd-ontrack-badge {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 15px;
          color: #fff;
          background: linear-gradient(140deg, #16c784, #0c8f5d);
          flex-shrink: 0;
        }

        .xd-ontrack strong {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .xd-ontrack-note {
          margin-left: auto;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.55);
        }

        /* modals */
        .xd-modal-wrap {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: grid;
          place-items: center;
          padding: 24px;
        }

        .xd-scrim {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(6px);
        }

        .xd-modal {
          position: relative;
          width: 100%;
          max-width: 440px;
          max-height: 88vh;
          overflow-y: auto;
          background: #131318;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 22px;
          padding: 22px 22px 24px;
          box-shadow: 0 50px 130px rgba(0, 0, 0, 0.7);
        }

        .xd-modal::-webkit-scrollbar {
          width: 0;
        }

        .xd-handle {
          display: block;
          width: 44px;
          height: 4px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.22);
          margin: 0 auto 16px;
        }

        .xd-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          color: #f4f4f6;
          font-size: 12px;
          cursor: pointer;
        }

        .xd-close:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .xd-modal-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 6px;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .xd-modal-sub {
          margin: 0 0 20px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.45;
        }

        .xd-field-label {
          display: block;
          margin: 16px 0 8px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.75);
        }

        .xd-total-input {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 56px;
          border: 1px solid rgba(255, 46, 139, 0.35);
          border-radius: 12px;
          background: rgba(255, 46, 139, 0.06);
          padding: 0 14px;
        }

        .xd-rupee {
          font-size: 20px;
          font-weight: 800;
          color: #ff86bd;
        }

        .xd-total-input input {
          flex: 1;
          border: 0;
          outline: 0;
          background: transparent;
          color: #fff;
          font-size: 22px;
          font-weight: 800;
          font-family: var(--font-jetbrains-mono), monospace;
        }

        .xd-edit {
          color: rgba(255, 255, 255, 0.6);
          font-size: 15px;
        }

        .xd-hint {
          margin: 8px 0 0;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.45);
        }

        .xd-alloc {
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 10px;
          background: rgba(255, 255, 255, 0.02);
        }

        .xd-alloc.active {
          border-color: rgba(255, 46, 139, 0.5);
          background: rgba(255, 46, 139, 0.06);
        }

        .xd-alloc-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 13px;
        }

        .xd-alloc-top strong {
          font-weight: 700;
        }

        .xd-alloc-top span {
          font-family: var(--font-jetbrains-mono), monospace;
          font-weight: 700;
          color: #ff86bd;
        }

        .xd-alloc input[type="range"] {
          width: 100%;
          accent-color: #ff2e8b;
        }

        .xd-alloc-summary {
          position: relative;
          display: flex;
          gap: 20px;
          margin: 16px 0 20px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          flex-wrap: wrap;
        }

        .xd-alloc-summary span {
          display: block;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }

        .xd-alloc-summary strong {
          display: block;
          font-size: 22px;
          font-weight: 800;
          font-family: var(--font-jetbrains-mono), monospace;
          margin-top: 2px;
        }

        .xd-alloc-summary strong.ok {
          color: #16c784;
        }

        .xd-alloc-summary strong.over {
          color: #ff5a7a;
        }

        .xd-alloc-check {
          flex-basis: 100%;
          margin: 4px 0 0;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.55);
        }

        .xd-alloc-check.ok {
          color: #16c784;
        }

        .xd-primary {
          width: 100%;
          height: 52px;
          border: 0;
          border-radius: 13px;
          background: linear-gradient(
            180deg,
            #3a3a3a 0%,
            #1a1a1a 45%,
            #050505 100%
          );
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.25),
            0 12px 26px rgba(0, 0, 0, 0.4);
        }

        .xd-primary:hover {
          filter: brightness(1.08);
        }

        .xd-spend-total {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }

        .xd-spend-total strong {
          font-size: 30px;
          font-weight: 800;
        }

        .xd-spend-total .xd-trend {
          margin-top: 0;
        }

        .xd-spend-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin: 18px 0 22px;
        }

        .xd-spend-row {
          display: grid;
          grid-template-columns: 34px 1fr;
          gap: 12px;
          align-items: center;
          padding: 12px 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
        }

        .xd-spend-row .xd-plat-top span {
          color: #ff86bd;
        }

        /* responsive */
        @media (max-width: 940px) {
          .xd-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .xd-root {
            padding: 20px 12px 40px;
          }
          .xd-head {
            flex-wrap: wrap;
            gap: 10px;
          }
          .xd-stats {
            grid-template-columns: 1fr;
          }
          .xd-hero-left strong {
            font-size: 30px;
          }
          .xd-ontrack {
            flex-wrap: wrap;
          }
          .xd-ontrack-note {
            margin-left: 0;
            flex-basis: 100%;
          }
        }
      `}</style>
    </main>
  );
}
