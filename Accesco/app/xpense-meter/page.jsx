"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { fetchXpenseSummary, saveXpenseBudget } from "@/lib/xpenseMeterService";


const AuthModal = dynamic(() => import("@/app/components/AuthModal"), {
  ssr: false,
});

const rupee = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabelFallback(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function buildMonthOptions(count = 12) {
  const now = new Date();
  const options = [];
  for (let i = 0; i < count; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    options.push({ key, label: d.toLocaleDateString("en-IN", { month: "long", year: "numeric" }) });
  }
  return options;
}

function MonthDropdown({ value, label, options, onChange, size }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className={`xd-month-wrap${size === "sm" ? " sm" : ""}`} ref={wrapRef}>
      <button type="button" className="xd-month-trigger" onClick={() => setOpen((v) => !v)}>
        {label} <span>⌄</span>
      </button>
      {open && (
        <div className="xd-month-menu">
          {options.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={opt.key === value ? "active" : ""}
              onClick={() => {
                onChange(opt.key);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .xd-month-wrap {
          position: relative;
          display: inline-flex;
        }

        .xd-month-trigger {
          height: 34px;
          padding: 0 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.03);
          color: #f4f4f6;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .xd-month-trigger span {
          opacity: 0.7;
        }

        .xd-month-wrap.sm .xd-month-trigger {
          height: 32px;
          font-size: 12px;
        }

        .xd-month-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          z-index: 30;
          min-width: 170px;
          max-height: 260px;
          overflow-y: auto;
          padding: 6px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: #17171a;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .xd-month-menu button {
          text-align: left;
          border: 0;
          background: transparent;
          color: #f4f4f6;
          font-size: 12px;
          font-weight: 500;
          padding: 8px 10px;
          border-radius: 8px;
          cursor: pointer;
        }

        .xd-month-menu button:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .xd-month-menu button.active {
          background: rgba(245, 41, 107, 0.18);
          color: #ff8ab4;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

function formatK(value) {
  if (!value) return "0";
  if (value >= 1000) {
    const k = value / 1000;
    return `${Number.isInteger(k) ? k : k.toFixed(1)}K`;
  }
  return String(value);
}

function buildDonutGradient(breakdown) {
  if (!breakdown || !breakdown.length) {
    return "conic-gradient(rgba(255,255,255,0.12) 0 100%)";
  }
  let cursor = 0;
  const stops = breakdown.map((b) => {
    const start = cursor;
    cursor += b.pct;
    return `${b.dot} ${start}% ${cursor}%`;
  });
  if (cursor < 100) stops.push(`rgba(255,255,255,0.12) ${cursor}% 100%`);
  return `conic-gradient(from -90deg, ${stops.join(", ")})`;
}

/* --------------------------------------------------------------- helpers */



/* Builds a smooth curve through the trend points using Catmull-Rom → cubic
   bezier. Coordinates are in a 0-100 space so the SVG can stretch freely. */
function smoothPath(points) {
  if (points.length < 2) return "";

  let d = `M${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }

  return d;
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
        <circle cx="9" cy="18.7" r="1.2" stroke="currentColor" strokeWidth="1.4" />
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
        <path d="M6.5 3.5v7.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path
          d="M4.5 3.5v5.2c0 1.8.9 2.9 2.5 2.9s2.5-1.1 2.5-2.9V3.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M7 11.6v8.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M16.5 3.5v16.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
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
          x="3"
          y="6"
          width="18"
          height="13"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M3 10.5h18" stroke="currentColor" strokeWidth="1.6" />
        <rect
          x="14.5"
          y="12.5"
          width="6.5"
          height="4.5"
          rx="1.6"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="17.4" cy="14.8" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (type === "avg") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M3.5 18.5 9 12l3.4 3.2L20.5 6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.6 6h4.9v4.9"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3.5 9.5h17M8 3.2v3.4M16 3.2v3.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      {!open && (
        <path
          d="M4 20 20 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M5 19h3.2l8.6-8.6-3.2-3.2L5 15.8V19Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.7 6.1 16.4 4.4a1.4 1.4 0 0 1 2 0l1.2 1.2a1.4 1.4 0 0 1 0 2l-1.7 1.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <path d="M12 3.5v11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M7.6 10.4 12 14.8l4.4-4.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 17.5v1.6c0 .8.6 1.4 1.4 1.4h12.2c.8 0 1.4-.6 1.4-1.4v-1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ data */

const ACCOUNT_NUMBER = "3948 5521 0783 45";

const allocations = [
  { key: "grokly", id: "grocery", name: "Grokly" },
  { key: "swadishtt", id: "food", name: "Swadishtt" },
  { key: "instastyle", id: "fashion", name: "InstaStyle" },
];

const ALLOC_MIN = 1000;

const ID_BY_KEY = { grokly: "grocery", swadishtt: "food", instastyle: "fashion" };

/* ------------------------------------------------------------- component */

export default function XpenseMeterPage() {
  const { user, loading: authLoading, getIdToken, signIn } = useAuth();
  const [modal, setModal] = useState(null); // null | 'budget' | 'viewspend'
  const [showAccount, setShowAccount] = useState(false);
  const [cardOut, setCardOut] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [monthKey, setMonthKey] = useState(() => currentMonthKey());
  const monthOptions = useMemo(() => buildMonthOptions(12), []);

  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [totalBudget, setTotalBudget] = useState(18000);
  const [budgets, setBudgets] = useState({
    grokly: 6000,
    swadishtt: 4000,
    instastyle: 8000,
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const loadSummary = useCallback(async () => {
    if (!user?.uid) {
      setSummary(null);
      setSummaryLoading(false);
      return;
    }
    setSummaryLoading(true);
    const { summary: data } = await fetchXpenseSummary(getIdToken, user.uid, monthKey);
    if (data) {
      setSummary(data);
      setTotalBudget(data.totalBudget);
      setBudgets(data.budgets);
    }
    setSummaryLoading(false);
  }, [user, monthKey, getIdToken]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const requireLogin = () => {
    setIsAuthOpen(true);
  };

  const openBudgetModal = () => {
    if (!user) return requireLogin();
    if (summary) {
      setTotalBudget(summary.totalBudget);
      setBudgets(summary.budgets);
    }
    setSaveError("");
    setModal("budget");
  };

  const openViewSpend = () => {
    if (!user) return requireLogin();
    setModal("viewspend");
  };

  const persistBudget = useCallback(
    async (nextTotalBudget, nextBudgets) => {
      if (!user?.uid) {
        requireLogin();
        return { success: false, error: "Not authenticated" };
      }
      try {
        await saveXpenseBudget(getIdToken, user.uid, { month: monthKey, totalBudget: nextTotalBudget, budgets: nextBudgets });
        await loadSummary();
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message || "Failed to save budget" };
      }
    },
    [user, getIdToken, monthKey, loadSummary],
  );

  const handleSaveBudget = async () => {
    setSaving(true);
    setSaveError("");
    const result = await persistBudget(totalBudget, budgets);
    if (result.success) {
      setModal(null);
    } else if (result.error) {
      setSaveError(result.error);
    }
    setSaving(false);
  };

  const platforms = summary?.platforms || [];
  const breakdown = summary?.breakdown || [];
  const trend = summary?.trend || [];
  const totalSpend = summary?.totalSpend || 0;
  const remainingBudget = summary?.remaining ?? totalBudget;
  const remainingPct = summary?.totalBudget ? Math.max(0, Math.round((remainingBudget / summary.totalBudget) * 100)) : 0;
  const spendRows = breakdown.map((b) => ({ id: ID_BY_KEY[b.key] || "grocery", name: b.name, amount: b.amount, pct: b.pct }));

  const chartMax = useMemo(() => {
    const maxVal = Math.max(1000, ...trend.map((t) => t.value));
    return Math.ceil(maxVal / 1000) * 1000;
  }, [trend]);

  const gridLines = useMemo(() => {
    const step = chartMax / 4;
    return [4, 3, 2, 1, 0].map((i) => Math.round(step * i));
  }, [chartMax]);

  const allocMax = useMemo(
    () => Math.max(18000, totalBudget, budgets.grokly, budgets.swadishtt, budgets.instastyle),
    [totalBudget, budgets],
  );

  const allocated = useMemo(
    () => budgets.grokly + budgets.swadishtt + budgets.instastyle,
    [budgets],
  );
  const remaining = totalBudget - allocated;
  const updateBudget = (key, value) =>
    setBudgets((prev) => ({ ...prev, [key]: Number(value) }));

  const closeModal = () => setModal(null);

  const chartPoints = useMemo(
    () =>
      trend.map((point, index) => ({
        ...point,
        x: trend.length > 1 ? (index / (trend.length - 1)) * 100 : 0,
        y: 100 - (point.value / chartMax) * 100,
      })),
    [trend, chartMax],
  );

  const linePath = useMemo(() => smoothPath(chartPoints), [chartPoints]);
  const areaPath = chartPoints.length ? `${linePath} L100,100 L0,100 Z` : "";

  return (
    <main className="xd-root">
      

      {!authLoading && !user && (
        <div className="xd-login-banner">
          <span>Log in to see your real spend across Grokly, Swadishtt &amp; InstaStyle.</span>
          <button type="button" onClick={requireLogin}>Log in</button>
        </div>
      )}

      <div className="xd-dashboard">
        {/* ---- header ---- */}
        <header className="xd-head">
          <div className="xd-head-title">
            <span>Xpense Meter</span>
            <i className="xd-spark">✦</i>
          </div>

          <div className="xd-head-right">
            <MonthDropdown
              value={monthKey}
              label={summary?.monthLabel || formatMonthLabelFallback(monthKey)}
              options={monthOptions}
              onChange={setMonthKey}
            />
            <button
              type="button"
              className="xd-ghost"
              onClick={openBudgetModal}
            >
              Set Budget
            </button>
            <div className="xd-user">
              <span className="xd-user-dot">
                {(user?.name || "User").charAt(0).toUpperCase()}
              </span>
              <span className="xd-user-name">{user?.name || "User"}</span>
            </div>
          </div>
        </header>

        {/* ---- grid ---- */}
        <div className="xd-grid">
          {/* LEFT COLUMN */}
          <div className="xd-col">
            {/* hero wallet */}
            <div className={`xd-hero-wrap ${cardOut ? "is-out" : ""}`} role="button" tabIndex={0} aria-expanded={cardOut} onClick={() => setCardOut((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setCardOut((v) => !v);
                }
            }}>
              <img
                className="xd-wallet-back"
                src="/images/xpense-meter/wallet-back.png"
                alt=""
                aria-hidden="true"
              />

              <article className="xd-hero">
                <div className="xd-hero-top">
                  <div className="xd-acct">
                    <span className="xd-acct-label">UID / Account No.</span>
                    <div className="xd-acct-row">
                      <strong>
                        {showAccount ? ACCOUNT_NUMBER : "********45"}
                      </strong>
                      <button
                        type="button"
                        className="xd-eye"
                        onClick = {(e) => {
                          e.stopPropagation();
                          setShowAccount((v) => !v);
                        }} 
                        aria-label={
                          showAccount
                            ? "Hide account number"
                            : "Show account number"
                        }
                      >
                        <EyeIcon open={!showAccount} />
                      </button>
                    </div>
                  </div>

                  <div className="xd-hero-brand">
                    <span className="xd-hero-logo">
                        <Image
                          src="/logo.png"
                          alt="Accesco Living"
                          width={27}
                          height={26}
                        />
                    </span>
                    <small>A1 Wallet</small>
                  </div>
                </div>

                
              </article>
              <img
                className="xd-wallet-front"
                src="/images/xpense-meter/wallet-front.png"
                alt=""
                aria-hidden="true"
              />

              <div className="xd-wallet-content">
                <div className="xd-wallet-spend">
                  <span>This Month Spend</span>
                  <strong className="xd-amount">{rupee(totalSpend)}</strong>
                  <small>of {rupee(summary?.totalBudget || totalBudget)} Budget</small>
                  {summary?.monthOverMonthChangePct != null && (
                    <div className={`xd-trend ${summary.monthOverMonthChangePct >= 0 ? "up" : "down"}`}>
                      {summary.monthOverMonthChangePct >= 0 ? "↑" : "↓"} {Math.abs(summary.monthOverMonthChangePct)}% From Last Month
                    </div>
                  )}
                </div>

                <Link
                href="/profile?section=payment-methods"
                className="xd-accounts"
                onClick={(e) => e.stopPropagation()}
                >
                  My Accounts
                </Link>
              </div>



            </div>

            {/* budget by platform */}
            <article className="xd-card">
              <div className="xd-card-head">
                <h3>Budget By Platform</h3>
                <button
                  type="button"
                  className="xd-link"
                  onClick={openViewSpend}
                >
                  View my Spend
                </button>
              </div>

              <div className="xd-plat-list">
                {!user && !authLoading && (
                  <p className="xd-muted" style={{ fontSize: 13 }}>Log in to see budget usage per platform.</p>
                )}
                {user && !summaryLoading && platforms.length === 0 && (
                  <div className="xd-empty-state">
                    <strong>No spend yet this month.</strong>
                    <span>Your platform budget usage will appear here after orders are recorded.</span>
                  </div>
                )}
                {platforms.map((p) => (
                  <div className="xd-plat" key={p.key}>
                    <span className="xd-plat-icon">
                      <CategoryIcon type={p.id} />
                    </span>
                    <div className="xd-plat-body">
                      <div className="xd-plat-top">
                        <strong>{p.name}</strong>
                        <span>
                          {Number(p.spent).toLocaleString("en-IN")}/{p.budget}
                        </span>
                      </div>
                      <div className="xd-bar">
                        <i style={{ width: `${p.budget ? Math.min(100, (p.spent / p.budget) * 100) : 0}%` }} />
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
                  {breakdown.length === 0 && (
                    <li className="xd-empty-legend">
                      {user ? "No spend yet this month." : "Log in to see your spend breakdown."}
                    </li>
                  )}
                  {breakdown.map((b) => (
                    <li key={b.key}>
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

                <div className="xd-break-donut" style={{ background: buildDonutGradient(breakdown) }}>
                  <b>{rupee(totalSpend)}</b>
                </div>
              </div>
            </article>
          </div>

          {/* RIGHT COLUMN */}
          <div className="xd-col">
            {/* stat cards */}
            <div className="xd-stats">
              <article className="xd-stat">
                <span className="xd-stat-icon">
                  <StatIcon type="wallet" />
                </span>
                <span>Budget Left</span>
                <strong className="xd-amount">{rupee(remainingBudget)}</strong>
                <small className="xd-muted">{remainingPct}% Remaining</small>
              </article>
              <article className="xd-stat">
                <span className="xd-stat-icon">
                  <StatIcon type="avg" />
                </span>
                <span>Daily Avg.Spend</span>
                <strong className="xd-amount">{rupee(summary?.dailyAvgSpend)}</strong>
                <small className="xd-muted">{summary?.onTrack === false ? "Watch your spend" : "Keep It Up !"}</small>
              </article>
              <article className="xd-stat">
                <span className="xd-stat-icon">
                  <StatIcon type="calendar" />
                </span>
                <span>Top Spent Day</span>
                <strong className="xd-amount">{rupee(summary?.highestSpendDay?.amount)}</strong>
                <small className="xd-muted">{summary?.highestSpendDay ? `On ${summary.highestSpendDay.label}` : "No spend yet"}</small>
              </article>
            </div>

            {/* trend chart */}
            <article className="xd-card xd-trend-card">
              <div className="xd-card-head">
                <MonthDropdown
                  value={monthKey}
                  label={summary?.monthLabel || formatMonthLabelFallback(monthKey)}
                  options={monthOptions}
                  onChange={setMonthKey}
                  size="sm"
                />
              </div>

              <span className="xd-muted xd-trend-label">
                This Month Spend Trend
              </span>
              <div className="xd-trend-amount">
                <strong className="xd-amount">{rupee(totalSpend)}</strong>
                {summary?.monthOverMonthChangePct != null && (
                  <span className={`xd-trend ${summary.monthOverMonthChangePct >= 0 ? "up" : "down"}`}>
                    {summary.monthOverMonthChangePct >= 0 ? "↑" : "↓"}{Math.abs(summary.monthOverMonthChangePct)}% From Last Month
                  </span>
                )}
              </div>

              <div className="xd-chart">
                <div className="xd-chart-y">
                  {gridLines.map((value) => (
                    <span key={value}>{formatK(value)}</span>
                  ))}
                </div>

                <div className="xd-plot">
                  <div className="xd-gridlines" aria-hidden="true">
                    {gridLines.map((value) => (
                      <i key={value} />
                    ))}
                  </div>

                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="xdArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(245,41,107,0.85)" />
                        <stop offset="100%" stopColor="rgba(245,41,107,0.28)" />
                      </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#xdArea)" />
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#f5296b"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>

                  {chartPoints.map((point) => (
                    <span
                      key={point.date}
                      className="xd-dot"
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    />
                  ))}
                </div>

                <div className="xd-chart-x">
                  {trend.map((point) => (
                    <span key={point.date}>{point.label}</span>
                  ))}
                </div>
              </div>

              <div className="xd-chart-foot">
                <div>
                  <span className="xd-up">↑</span>
                  <div>
                    <strong>Highest Spend Day</strong>
                    <p>
                      {summary?.highestSpendDay ? summary.highestSpendDay.label : "—"}{" "}
                      <b className="up">{rupee(summary?.highestSpendDay?.amount)}</b>
                    </p>
                  </div>
                </div>
                <div>
                  <span className="xd-down">↓</span>
                  <div>
                    <strong>Least Spend Day</strong>
                    <p>
                      {summary?.lowestSpendDay ? summary.lowestSpendDay.label : "—"}{" "}
                      <b className="down">{rupee(summary?.lowestSpendDay?.amount)}</b>
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* on track */}
          <div className="xd-ontrack">
            <span className="xd-ontrack-badge">{summary?.onTrack === false ? "!" : "↗"}</span>
            <strong>{!user ? "TRACK YOUR SPEND" : summary?.onTrack === false ? "OVER PACE" : "YOU'RE ON TRACK"}</strong>
            <span className="xd-ontrack-note">
              {!user
                ? "Log in to track your budget across all platforms."
                : summary?.onTrack === false
                  ? "You're spending faster than your budget pace."
                  : "Keep it up You're Doing Great"}
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
                  Plan your Monthly Budget and
                  <br />
                  Allocate Across Platforms.
                </p>

                <div className="xd-month-row">
                  <span className="xd-field-label">Month</span>
                  <button type="button" className="xd-month pill">
                    {summary?.monthLabel || formatMonthLabelFallback(monthKey)} <span>⌄</span>
                  </button>
                </div>

                {summary?.isBudgetDefault && (
                  <p className="xd-hint">Suggested based on your past orders. Adjust and save to make it official.</p>
                )}

                <label className="xd-field-label indent" htmlFor="xd-total">
                  Total Monthly Budget
                </label>
                <div className="xd-total-input">
                  <span className="xd-rupee">₹</span>
                  <input
                    id="xd-total"
                    inputMode="numeric"
                    value={Number(totalBudget).toLocaleString("en-IN")}
                    onChange={(e) =>
                      setTotalBudget(
                        Number(e.target.value.replace(/\D/g, "")) || 0,
                      )
                    }
                  />
                  <span className="xd-edit">
                    <PencilIcon />
                  </span>
                </div>
                <p className="xd-hint">
                  You can Distribute Your Budget Across Platforms.
                </p>

                <span className="xd-field-label indent">Allocate Budget</span>

                {allocations.map((row) => (
                  <div className="xd-alloc" key={row.key}>
                    <div className="xd-alloc-top">
                      <span className="xd-plat-icon">
                        <CategoryIcon type={row.id} />
                      </span>
                      <strong>{row.name}</strong>
                      <span className="xd-alloc-val">
                        {rupee(budgets[row.key])}
                      </span>
                    </div>

                    <div className="xd-alloc-slider">
                      <small>{rupee(ALLOC_MIN)}</small>
                      <input
                        type="range"
                        min={ALLOC_MIN}
                        max={allocMax}
                        step="500"
                        value={budgets[row.key]}
                        onChange={(e) => updateBudget(row.key, e.target.value)}
                        aria-label={`${row.name} budget`}
                      />
                      <small>{rupee(allocMax)}</small>
                    </div>
                  </div>
                ))}

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
                      ? "⊙ Total Allocated  =  Total Budget"
                      : remaining < 0
                        ? `Over budget by ${rupee(Math.abs(remaining))}`
                        : `${rupee(remaining)} left to allocate`}
                  </p>
                </div>

                {saveError && <p className="xd-hint" style={{ color: "#ff5a7a" }}>{saveError}</p>}

                <button type="button" className="xd-primary" onClick={handleSaveBudget} disabled={saving}>
                  {saving ? "Saving…" : "Save Budget"} <span>→</span>
                </button>
              </>
            )}

            {modal === "viewspend" && (
              <>
                <h2 className="xd-modal-title">
                  View My Spend <i className="xd-spark">✦</i>
                </h2>
                <p className="xd-modal-sub">
                  Detailed Overview of your Spendings
                  <br />
                  Across All Platforms.
                </p>

                <div className="xd-month-row">
                  <span className="xd-field-label">Month</span>
                  <button type="button" className="xd-month pill">
                    {summary?.monthLabel || formatMonthLabelFallback(monthKey)} <span>⌄</span>
                  </button>
                </div>

                <span className="xd-field-label indent">Total Monthly Spend</span>
                <div className="xd-spend-total">
                  <strong className="xd-amount">{rupee(totalSpend)}</strong>
                  {summary?.monthOverMonthChangePct != null && (
                    <span className={`xd-trend ${summary.monthOverMonthChangePct >= 0 ? "up" : "down"}`}>
                      {summary.monthOverMonthChangePct >= 0 ? "↑" : "↓"}{Math.abs(summary.monthOverMonthChangePct)}% From Last Month
                    </span>
                  )}
                </div>

                <div className="xd-spend-list">
                  {spendRows.length === 0 && (
                    <p className="xd-muted" style={{ fontSize: 13 }}>No spend recorded yet this month.</p>
                  )}
                  {spendRows.map((r) => (
                    <div className="xd-spend-row" key={r.id}>
                      <span className="xd-plat-icon">
                        <CategoryIcon type={r.id} />
                      </span>
                      <div className="xd-plat-body">
                        <strong>{r.name}</strong>
                        <div className="xd-spend-meter">
                          <small>{r.pct}%</small>
                          <div className="xd-bar">
                            <i style={{ width: `${r.pct}%` }} />
                          </div>
                        </div>
                      </div>
                      <span className="xd-spend-amount">{rupee(r.amount)}</span>
                    </div>
                  ))}
                </div>

                <button type="button" className="xd-primary" onClick={closeModal}>
                  Download Report <DownloadIcon />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(userData) => {
          signIn(userData);
          setIsAuthOpen(false);
        }}
      />

      <style jsx>{`
        .xd-root {
          --xd-accent: #f5296b;
          --xd-accent-soft: #ff8ab4;
          --xd-page: #0a0a0b;
          --xd-panel: #0e0e10;
          --xd-card: #131316;
          --xd-line: rgba(255, 255, 255, 0.08);
          --xd-mute: rgba(255, 255, 255, 0.6);

          min-height: 100vh;
          padding: 40px 24px 64px;
          background: var(--xd-page);
          color: #f4f4f6;
          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .xd-root button {
          font-family: inherit;
          text-transform: none;
          letter-spacing: normal;
        }

        .xd-muted {
          color: var(--xd-mute);
        }

        .xd-amount {
          letter-spacing: -0.02em;
        }

        .xd-dashboard {
          max-width: 1000px;
          margin: 0 auto;
          background: var(--xd-panel);
          border: 1px solid var(--xd-line);
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 50px 130px rgba(0, 0, 0, 0.6);
        }

        .xd-login-banner {
          max-width: 1200px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 12px 18px;
          border-radius: 14px;
          border: 1px solid rgba(245, 41, 107, 0.35);
          background: rgba(245, 41, 107, 0.12);
          color: #f4f4f6;
          font-size: 13px;
        }

        .xd-login-banner button {
          flex-shrink: 0;
          height: 32px;
          padding: 0 16px;
          border: 0;
          border-radius: 999px;
          background: var(--xd-accent);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
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
          color: var(--xd-accent);
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
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.03);
          color: #f4f4f6;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .xd-month span {
          opacity: 0.7;
        }

        .xd-month.sm {
          height: 32px;
          font-size: 12px;
        }

        .xd-month.pill {
          height: 38px;
          padding: 0 18px;
          font-size: 13px;
        }

        .xd-ghost {
          height: 34px;
          padding: 0 16px;
          border-radius: 999px;
          border: 1px solid rgba(245, 41, 107, 0.4);
          background: rgba(245, 41, 107, 0.12);
          color: var(--xd-accent-soft);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .xd-ghost:hover {
          background: rgba(245, 41, 107, 0.2);
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
          background: linear-gradient(140deg, var(--xd-accent), #8a0048);
        }

        .xd-user-name {
          font-size: 13px;
          font-weight: 600;
        }

        /* grid */
        .xd-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 18px;
        }

        .xd-col {
          display: flex;
          flex-direction: column;
          gap: 18px;
          min-width: 0;
        }

        .xd-card {
          background: var(--xd-card);
          border: 1px solid var(--xd-line);
          border-radius: 18px;
          padding: 20px;
        }

        .xd-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 18px;
        }

        .xd-card-head h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .xd-link {
          height: 30px;
          padding: 0 12px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .xd-link:hover {
          color: var(--xd-accent-soft);
        }

        /* hero wallet */
        .xd-hero-wrap {
          cursor: pointer;
          --card-in: -2px;
          --card-out: -28px;
          position: relative;
          padding-top: 0px;
          padding-bottom: 0px;
        }

        /* the two card edges peeking above the wallet */
        .xd-wallet-back,
        .xd-wallet-front {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: auto;
          pointer-events: none;
          user-select: none;
        }

        .xd-wallet-back {
          z-index: 1;
          top: 20px;
        }

        .xd-wallet-front {
          z-index: 3;
          top: 60px;
        }

        .xd-hero {
          position: relative; 
          z-index: 2;
          aspect-ratio: 1.83;
          transform: translateY(var(--card-in));
          transition: transform 620ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background:
            url("/images/xpense-meter/card.png") center / cover no-repeat,
            #10101300;
          border: 0px;
          border-radius: 18px;
          padding: 25px 50px 30px;
          overflow: hidden;
        }



        .xd-wallet-content {
          position: absolute;
          left: 62px;
          right: 48px;
          bottom: 34px;
          z-index: 4;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          pointer-events: none;
        }

        .xd-wallet-spend {
          color: #fff;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.75);
          margin: 0px 0px 5px -15px;
        }

        .xd-wallet-spend span,
        .xd-wallet-spend small {
          display: block;
          font-size: 16px;
          line-height: 1.15;
        }

        .xd-wallet-spend strong {
          display: block;
          font-size: 36px;
          line-height: 1.2;
          margin: 6px 0 4px;
          font-weight: 600;
        }

        .xd-wallet-content .xd-accounts {
          pointer-events: auto;
          margin-bottom: 5px;
        }

        .xd-hero-wrap.is-out .xd-hero {
          transform: translateY(var(--card-out));
        }

        @media (prefers-reduced-motion: reduce) {
          .xd-hero {
            transition: none;
          }
        }

        .xd-hero-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .xd-acct-label {
          display: block;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 2px;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
        }

        .xd-acct-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .xd-acct-row strong {
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
        }

        .xd-eye {
          width: 22px;
          height: 22px;
          padding: 0;
          border: 0;
          background: transparent;
          color: rgba(255, 255, 255, 0.75);
          cursor: pointer;
          display: grid;
          place-items: center;
        }

        .xd-eye :global(svg) {
          width: 18px;
          height: 18px;
        }

        .xd-eye:hover {
          color: #fff;
        }

        .xd-hero-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          flex-shrink: 0;
        }

        /* logo.png is magenta; this renders it pure white per the design */
        .xd-hero-logo {
          display: inline-flex;
          filter: brightness(0) invert(1);
        }

        .xd-hero-brand small {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.02em;
          white-space: nowrap;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
        }

        .xd-hero-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          transform: translateY(-12px);

        }

        .xd-hero-left span,
        .xd-hero-left small {
          display: block;
          font-size: 16px;
          color: #fff;
        }

        .xd-hero-left small {
          max-width: 180px;
          line-height: 1.2;
        }

        .xd-hero-left strong {
          display: block;
          font-size: 36px;
          line-height: 1.05;
          margin: 2px 0 2px;
          font-weight: 800;
        }

        .xd-trend {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          margin-top: 8px;
          font-size: 11px;
          font-weight: 600;
        }

        .xd-trend.up {
          color: #16c784;
        }

        .xd-trend.down {
          color: #ff8ab4;
        }

        /* platform rows */
        .xd-plat-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .xd-plat {
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 14px;
          align-items: center;
        }

        .xd-plat-icon {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          color: #fff;
        }

        .xd-plat-icon :global(svg) {
          width: 22px;
          height: 22px;
        }

        .xd-plat-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 8px;
          font-size: 15px;
        }

        .xd-plat-top strong {
          font-weight: 500;
        }

        .xd-plat-top span {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          font-family: var(--font-jetbrains-mono), monospace;
        }

        .xd-bar {
          height: 5px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
          overflow: hidden;
        }

        .xd-bar i {
          display: block;
          height: 100%;
          border-radius: 999px;
          background: var(--xd-accent);
        }

        /* spend breakdown */
        .xd-break-row {
          display: grid;
          grid-template-columns: minmax(0 , 1fr) 140px;
          align-items: center;
          gap: 28px;
          min-height: 150px;
        }

        .xd-legend {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1;
        }

        .xd-legend li {
          display: grid;
          grid-template-columns: 12px 1fr;
          align-items: center;
          column-gap: 10px;
          row-gap: 2px;
          font-size: 14px;
        }

        .xd-empty-legend {
          display: block  !important;
          max-width: 260px;
          color: rgba(255, 255, 255, 0.68);
          font-size: 14px;
          line-height: 1.45;
        }

        



        .xd-empty-state {
          padding: 10px 0 4px;
          color: rgba(255, 255, 255, 0.68);
        }

        .xd-empty-state strong {
          display: block;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .xd-empty-state span {
          display: block;
          max-width: 360px;
          font-size: 12px;
          line-height: 1.45;
        }

        .xd-legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .xd-legend-val {
          grid-column: 2;
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.75);
        }

        .xd-legend-val em {
          font-style: normal;
          color: rgba(255, 255, 255, 0.55);
        }

        .xd-break-donut {
          flex-shrink: 0;
          width: 104px;
          height: 104px;
          border-radius: 50%;
          background: conic-gradient(
            from -90deg,
            #ffffff 0 42%,
            var(--xd-accent) 42% 80%,
            #ffa8c6 80% 100%
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
          background: var(--xd-card);
        }

        .xd-break-donut b {
          position: relative;
          z-index: 1;
          font-size: 15px;
          font-weight: 700;
        }

        /* stat cards */
        .xd-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .xd-stat {
          background: var(--xd-card);
          border: 1px solid var(--xd-line);
          border-radius: 16px;
          padding: 22px 12px;
          text-align: center;
        }

        /* StatIcon is a child component, so styled-jsx can't reach its <svg>.
           The wrapper box constrains it instead. */
        .xd-stat .xd-stat-icon {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          margin: 0 auto 26px;
          color: #fff;
        }

        .xd-stat-icon :global(svg){
          width: 32px;
          height: 32px;
        }

        .xd-stat span {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #fff;
        }

        .xd-stat strong {
          display: block;
          font-size: 17px;
          font-weight: 600;
          margin: 12px 0 10px;
        }

        .xd-stat small {
          display: block;
          font-size: 12px;
        }

        /* trend card */
        .xd-trend-card {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .xd-trend-card .xd-card-head {
          margin-bottom: 12px;
        }

        .xd-trend-label {
          font-size: 15px;
          color: #fff;
        }

        .xd-trend-amount {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          margin: 4px 0 10px;
        }

        .xd-trend-amount strong {
          font-size: 28px;
          font-weight: 700;
        }

        .xd-trend-amount .xd-trend {
          margin-top: 0;
        }

        /* chart */
        .xd-chart {
          flex: 0 0 auto;
          display: grid;
          grid-template-columns: 26px minmax(0, 1fr);
          grid-template-rows: auto auto;
          column-gap: 8px;
          margin-top: 6px;
          min-height: 150px;
        }

        .xd-chart-y {
          height: 168px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.55);
          text-align: right;
          padding-bottom: 5px;
        }

        .xd-plot {
          position: relative;
          height: 168px;
        }

        .xd-gridlines {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .xd-gridlines i {
          display: block;
          height: 1px;
          background: rgba(255, 255, 255, 0.16);
        }

        .xd-plot svg {
          position: relative;
          width: 100%;
          height: 100%;
          display: block;
        }

        .xd-dot {
          position: absolute;
          width: 7px;
          height: 7px;
          margin: -3.5px 0 0 -3.5px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 2px rgba(245, 41, 107, 0.35);
        }

        .xd-chart-x {
          grid-column: 2;
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.55);
        }

        .xd-chart-foot {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 18px;
        }

        .xd-chart-foot > div {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .xd-chart-foot > div + div {
          padding-left: 16px;
          border-left: 1px solid var(--xd-line);
        }

        .xd-chart-foot strong {
          display: block;
          font-size: 13px;
          font-weight: 500;
        }

        .xd-chart-foot p {
          margin: 3px 0 0;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.75);
        }

        .xd-chart-foot p b {
          color: var(--xd-accent);
          font-weight: 600;
          margin-left: 4px;
        }

        .xd-chart-foot p b.up {
          color: #16c784;
        }

        .xd-chart-foot p b.down {
          color: var(--xd-accent);
        }

        .xd-up,
        .xd-down {
          font-size: 20px;
          font-weight: 800;
          line-height: 1;
        }

        .xd-up {
          color: #16c784;
        }

        .xd-down {
          color: var(--xd-accent);
        }

        /* on track */

        .xd-ontrack {
          grid-column: 1 / -1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          background: var(--xd-card);
          border: 1px solid var(--xd-line);
          border-radius: 999px;
          padding: 14px 22px;
        }

        .xd-ontrack-badge {
          position: absolute;
          left: 22px;
          top: 50%;
          transform: translateY(-50%);
          width: 28px;
          height : 28px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 14px;
          color: var(--xd-accent);
          background: rgba(245 , 41 , 107 , 0.14);    
        }

        .xd-ontrack strong {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .xd-ontrack-note {
          padding-left: 18px;
          border-left: 1px solid rgba(255, 255, 255, 0.18);
          font-size: 12px;
          color: rgba(255, 255, 255, 0.65);
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
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
        }

        .xd-modal {
          position: relative;
          width: 100%;
          max-width: 420px;
          max-height: 90vh;
          overflow-y: auto;
          background: #131316;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 18px;
          padding: 18px 24px 26px;
          box-shadow: 0 50px 130px rgba(0, 0, 0, 0.7);
        }

        .xd-modal::-webkit-scrollbar {
          width: 0;
        }

        .xd-handle {
          display: block;
          width: 40px;
          height: 4px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.5);
          margin: 0 auto 22px;
        }

        .xd-close {
          position: absolute;
          top: 18px;
          right: 20px;
          width: 26px;
          height: 26px;
          border: 0;
          background: transparent;
          color: #fff;
          font-size: 17px;
          cursor: pointer;
          line-height: 1;
        }

        .xd-close:hover {
          color: var(--xd-accent-soft);
        }

        .xd-modal-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 10px;
          font-size: 25px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .xd-modal-sub {
          margin: 0 0 18px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.45;
        }

        .xd-month-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .xd-field-label {
          display: block;
          font-size: 15px;
          font-weight: 500;
          color: #fff;
        }

        .xd-field-label.indent {
          margin: 0 0 10px 14px;
        }

        .xd-total-input {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 58px;
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 12px;
          background: transparent;
          padding: 0 18px;
        }

        .xd-rupee {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
        }

        .xd-total-input input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          font-family: inherit;
        }

        .xd-edit {
          display: grid;
          place-items: center;
          width: 24px;
          height: 24px;
          color: #fff;
          flex-shrink: 0;
        }

        .xd-edit :global(svg) {
          width: 20px;
          height: 20px;
        }

        .xd-hint {
          margin: 12px 0 22px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
        }

        .xd-alloc {
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 12px;
          padding: 12px 14px 14px;
          margin-bottom: 12px;
          background: rgba(255, 255, 255, 0.02);
        }

        .xd-alloc-top {
          display: grid;
          grid-template-columns: 26px 1fr auto;
          align-items: center;
          gap: 10px;
          font-size: 15px;
        }

        .xd-alloc-top .xd-plat-icon {
          width: 26px;
          height: 26px;
        }

        .xd-alloc-top .xd-plat-icon :global(svg) {
          width: 21px;
          height: 21px;
        }

        .xd-alloc-top strong {
          font-weight: 600;
        }

        .xd-alloc-val {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .xd-alloc-slider {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 8px;
          margin: 4px 0 0 36px;
        }

        .xd-alloc-slider small {
          font-size: 8px;
          color: rgba(255, 255, 255, 0.6);
        }

        .xd-alloc-slider input[type="range"] {
          width: 100%;
          accent-color: var(--xd-accent);
        }

        .xd-alloc-summary {
          display: flex;
          gap: 20px;
          margin: 18px 0 20px;
          padding: 16px 18px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 12px;
          flex-wrap: wrap;
        }

        .xd-alloc-summary > div {
          flex: 1;
        }

        .xd-alloc-right {
          text-align: right;
        }

        .xd-alloc-summary span {
          display: block;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
        }

        .xd-alloc-summary strong {
          display: block;
          font-size: 22px;
          font-weight: 700;
          margin-top: 6px;
        }

        .xd-alloc-summary strong.ok {
          color: #fff;
        }

        .xd-alloc-summary strong.over {
          color: #ff5a7a;
        }

        .xd-alloc-check {
          flex-basis: 100%;
          margin: 10px 0 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
        }

        .xd-primary {
          width: 100%;
          height: 54px;
          border: 0;
          border-radius: 12px;
          background: linear-gradient(
            180deg,
            #3a3a3a 0%,
            #1a1a1a 45%,
            #050505 100%
          );
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.25),
            0 12px 26px rgba(0, 0, 0, 0.4);
        }

        .xd-primary:hover {
          filter: brightness(1.12);
        }

        .xd-spend-total {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 22px;
          padding: 0 14px;
        }

        .xd-spend-total strong {
          font-size: 28px;
          font-weight: 700;
        }

        .xd-spend-total .xd-trend {
          margin-top: 0;
          color: var(--xd-accent);
        }

        .xd-spend-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 26px;
        }

        .xd-spend-row {
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          padding: 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 12px;
        }

        .xd-spend-row .xd-plat-body strong {
          display: block;
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 6px;
        }

        .xd-spend-meter {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          align-items: center;
          gap: 8px;
        }

        .xd-spend-meter small {
          font-size: 9px;
          color: rgba(255, 255, 255, 0.6);
        }

        .xd-spend-amount {
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
        }

        /* focus visibility */
        .xd-root button:focus-visible,
        .xd-root input:focus-visible {
          outline: 2px solid var(--xd-accent-soft);
          outline-offset: 2px;
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
            font-size: 26px;
          }
          .xd-break-row {
            grid-template-columns: 1fr;
            justify-items: start;
          }
          .xd-ontrack {
            flex-wrap: wrap;
          }
          .xd-ontrack-note {
            border-left: 0;
            padding-left: 0;
            flex-basis: 100%;
          }
        }
}
        @media (max-width: 420px) {
  .xd-wallet-content {
    left: 20px;
    right: 20px;
    bottom: 10px;
    gap: 8px;
  }

  .xd-wallet-spend {
    margin-left: 0;
    margin-bottom: 0;
  }

  .xd-wallet-spend span,
  .xd-wallet-spend small {
    font-size: 12px;
  }

  .xd-wallet-spend strong {
    font-size: 28px;
    margin: 3px 0;
  }

  .xd-accounts {
    font-size: 11px;
    height: 28px;
    padding: 0 10px;
  }
}
      `}</style>

      {/* Scoped styled-jsx never applies to custom components like next/link's
          <Link>, since the compiler only auto-scopes plain host elements —
          so this one rule has to live in an (ancestor-qualified) global block. */}
      <style jsx global>{`
        .xd-wallet-content .xd-accounts {
          height: 30px;
          padding: 0 14px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.35);
          background: rgba(20, 20, 22, 0.85);
          color: #fff;
          font-size: 12px;
          font-weight: 400;
          cursor: pointer;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .xd-hero-bottom .xd-accounts:hover {
          background: rgb(242, 234, 234);
        }
      `}</style>
    </main>
  );
}