import { adminDb } from '../../../lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

// Xpense Meter aggregates real spend from each brand's own order collection —
// there is no separate "xpense" order log. Budgets are the only thing this
// feature stores itself, in `xpense_budgets/{uid}`.
export const PLATFORMS = [
  { key: 'grokly', id: 'grocery', name: 'Grokly', collection: 'grokly_orders' },
  { key: 'swadishtt', id: 'food', name: 'Swadishtt', collection: 'swadishtt_orders' },
  { key: 'instastyle', id: 'fashion', name: 'InstaStyle', collection: 'instastyle_orders' },
];

export const DEFAULT_BUDGETS = { grokly: 6000, swadishtt: 4000, instastyle: 8000 };

const pad2 = (n) => String(n).padStart(2, '0');

export function monthKeyOf(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
}

function parseMonthKey(monthKey) {
  const [year, month] = String(monthKey).split('-').map(Number);
  return { year, monthIndex: month - 1 };
}

export function isValidMonthKey(monthKey) {
  if (typeof monthKey !== 'string' || !/^\d{4}-\d{2}$/.test(monthKey)) return false;
  const { monthIndex } = parseMonthKey(monthKey);
  return monthIndex >= 0 && monthIndex <= 11;
}

export function monthRange(monthKey) {
  const { year, monthIndex } = parseMonthKey(monthKey);
  return {
    start: new Date(year, monthIndex, 1),
    end: new Date(year, monthIndex + 1, 1),
  };
}

export function shiftMonthKey(monthKey, delta) {
  const { year, monthIndex } = parseMonthKey(monthKey);
  const d = new Date(year, monthIndex + delta, 1);
  return monthKeyOf(d);
}

export function daysInMonth(monthKey) {
  const { year, monthIndex } = parseMonthKey(monthKey);
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function formatMonthLabel(monthKey) {
  const { year, monthIndex } = parseMonthKey(monthKey);
  return new Date(year, monthIndex, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function dateKey(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function formatDayLabel(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function extractOrderDate(data) {
  const raw = data.timestamp || data.placedAt || (data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt);
  if (!raw) return null;
  const date = raw instanceof Date ? raw : new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function extractOrderAmount(data) {
  const amount = data.totals?.total ?? data.total ?? data.grandTotal ?? data.subtotal ?? 0;
  const n = Number(amount);
  return Number.isFinite(n) ? n : 0;
}

function extractOrderItems(data) {
  if (!Array.isArray(data.items)) return [];
  return data.items.map((item) => {
    const quantity = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    return { name: item.name || 'Item', amount: price * quantity, quantity };
  });
}

/** Reads every order the user has placed on each brand, once per request. */
async function fetchAllOrdersForUser(uid) {
  const results = {};
  await Promise.all(
    PLATFORMS.map(async (p) => {
      const snapshot = await adminDb.collection(p.collection).where('userId', '==', uid).get();
      const orders = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const date = extractOrderDate(data);
        if (!date) return;
        orders.push({ id: docSnap.id, date, amount: extractOrderAmount(data), items: extractOrderItems(data) });
      });
      results[p.key] = orders;
    }),
  );
  return results;
}

function filterByRange(orders, range) {
  return orders.filter((o) => o.date >= range.start && o.date < range.end);
}

async function fetchBudgetMonths(uid) {
  const snap = await adminDb.collection('xpense_budgets').doc(uid).get();
  return snap.exists ? snap.data().months || {} : {};
}

export async function saveBudget(uid, monthKey, totalBudget, budgets) {
  await adminDb.collection('xpense_budgets').doc(uid).set(
    {
      months: {
        [monthKey]: { totalBudget, budgets, updatedAt: FieldValue.serverTimestamp() },
      },
    },
    { merge: true },
  );
}

function computeSuggestedBudget(prevSpendByPlatform) {
  const budgets = {};
  for (const p of PLATFORMS) {
    const prev = prevSpendByPlatform[p.key] || 0;
    budgets[p.key] = prev > 0 ? Math.max(1000, Math.ceil((prev * 1.1) / 500) * 500) : DEFAULT_BUDGETS[p.key];
  }
  const totalBudget = PLATFORMS.reduce((sum, p) => sum + budgets[p.key], 0);
  return { totalBudget, budgets };
}

async function resolveBudgetForMonth(uid, monthKey, prevSpendByPlatform) {
  const months = await fetchBudgetMonths(uid);
  const saved = months[monthKey];
  if (saved) {
    return { totalBudget: Number(saved.totalBudget) || 0, budgets: saved.budgets || {}, isDefault: false };
  }
  const suggested = computeSuggestedBudget(prevSpendByPlatform);
  return { ...suggested, isDefault: true };
}

/** Resolves the saved-or-suggested budget for a month without building the full summary. */
export async function getBudgetForMonth(uid, monthKey) {
  const allOrders = await fetchAllOrdersForUser(uid);
  const prevRange = monthRange(shiftMonthKey(monthKey, -1));
  const prevSpendByPlatform = {};
  for (const p of PLATFORMS) {
    prevSpendByPlatform[p.key] = filterByRange(allOrders[p.key], prevRange).reduce((s, o) => s + o.amount, 0);
  }
  return resolveBudgetForMonth(uid, monthKey, prevSpendByPlatform);
}

/** Builds the full Xpense Meter summary for a given user + month (real spend + budget). */
export async function buildXpenseSummary(uid, monthKey) {
  const allOrders = await fetchAllOrdersForUser(uid);
  const range = monthRange(monthKey);
  const prevMonthKey = shiftMonthKey(monthKey, -1);
  const prevRange = monthRange(prevMonthKey);

  const currentByPlatform = {};
  const prevByPlatform = {};
  for (const p of PLATFORMS) {
    currentByPlatform[p.key] = filterByRange(allOrders[p.key], range);
    prevByPlatform[p.key] = filterByRange(allOrders[p.key], prevRange);
  }

  const prevSpendByPlatform = {};
  for (const p of PLATFORMS) {
    prevSpendByPlatform[p.key] = prevByPlatform[p.key].reduce((s, o) => s + o.amount, 0);
  }

  const budgetInfo = await resolveBudgetForMonth(uid, monthKey, prevSpendByPlatform);

  const platforms = PLATFORMS.map((p) => {
    const orders = currentByPlatform[p.key];
    const spent = Math.round(orders.reduce((s, o) => s + o.amount, 0));
    const budget = Number(budgetInfo.budgets[p.key]) || 0;
    return { key: p.key, id: p.id, name: p.name, spent, budget, pct: budget > 0 ? Math.min(999, Math.round((spent / budget) * 100)) : 0 };
  });

  const totalSpend = platforms.reduce((s, pl) => s + pl.spent, 0);
  const totalBudget = Math.round(budgetInfo.totalBudget);
  const remaining = totalBudget - totalSpend;
  const percentUsed = totalBudget > 0 ? Math.round((totalSpend / totalBudget) * 100) : 0;

  const dots = ['#ffffff', '#f5296b', '#ffa8c6'];
  const breakdown = platforms
    .filter((p) => p.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .map((p, idx) => ({
      key: p.key,
      name: p.name,
      amount: p.spent,
      pct: totalSpend > 0 ? Math.round((p.spent / totalSpend) * 100) : 0,
      dot: dots[idx % dots.length],
    }));

  const daily = {};
  for (const p of PLATFORMS) {
    for (const o of currentByPlatform[p.key]) {
      const key = dateKey(o.date);
      daily[key] = (daily[key] || 0) + o.amount;
    }
  }

  const now = new Date();
  const isCurrentMonth = monthKey === monthKeyOf(now);
  const totalDays = daysInMonth(monthKey);
  const lastDayDate = isCurrentMonth ? now : new Date(range.end.getTime() - 86400000);
  const daysElapsed = isCurrentMonth ? now.getDate() : totalDays;

  const trend = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(lastDayDate);
    d.setDate(d.getDate() - i);
    if (d < range.start || d >= range.end) continue;
    const key = dateKey(d);
    trend.push({ date: key, label: d.toLocaleDateString('en-US', { weekday: 'short' }), value: Math.round(daily[key] || 0) });
  }

  let highestSpendDay = null;
  let lowestSpendDay = null;
  const dayEntries = Object.entries(daily).filter(([, amt]) => amt > 0);
  if (dayEntries.length) {
    dayEntries.sort((a, b) => b[1] - a[1]);
    const [hKey, hAmt] = dayEntries[0];
    const [lKey, lAmt] = dayEntries[dayEntries.length - 1];
    highestSpendDay = { date: hKey, label: formatDayLabel(hKey), amount: Math.round(hAmt) };
    lowestSpendDay = { date: lKey, label: formatDayLabel(lKey), amount: Math.round(lAmt) };
  }

  const prevTotalSpend = Object.values(prevSpendByPlatform).reduce((s, v) => s + v, 0);
  const monthOverMonthChangePct = prevTotalSpend > 0 ? Math.round(((totalSpend - prevTotalSpend) / prevTotalSpend) * 100) : null;

  const dailyAvgSpend = daysElapsed > 0 ? Math.round(totalSpend / daysElapsed) : 0;
  const onTrack = totalBudget <= 0 ? true : totalSpend <= totalBudget * (daysElapsed / totalDays) * 1.15;

  const weeksInMonth = Math.ceil(totalDays / 7);
  const platformDetails = {};
  for (const p of PLATFORMS) {
    const orders = currentByPlatform[p.key];
    const weeklySpend = Array.from({ length: weeksInMonth }, (_, i) => ({ week: i + 1, amount: 0 }));
    const itemMap = new Map();

    for (const o of orders) {
      const weekIdx = Math.floor((o.date.getDate() - 1) / 7);
      if (weeklySpend[weekIdx]) weeklySpend[weekIdx].amount += o.amount;
      for (const item of o.items) {
        const existing = itemMap.get(item.name) || { name: item.name, amount: 0, quantity: 0 };
        existing.amount += item.amount;
        existing.quantity += item.quantity;
        itemMap.set(item.name, existing);
      }
    }
    weeklySpend.forEach((w) => {
      w.amount = Math.round(w.amount);
    });

    const topItems = Array.from(itemMap.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map((i) => ({ ...i, amount: Math.round(i.amount) }));

    const prevSpend = prevSpendByPlatform[p.key];
    const spent = orders.reduce((s, o) => s + o.amount, 0);
    const lastMonthChangePct = prevSpend > 0 ? Math.round(((spent - prevSpend) / prevSpend) * 100) : null;

    platformDetails[p.key] = {
      weeklySpend,
      topItems,
      ordersPerWeek: Math.round((orders.length / weeksInMonth) * 10) / 10,
      lastMonthChangePct,
    };
  }

  return {
    month: monthKey,
    monthLabel: formatMonthLabel(monthKey),
    totalBudget,
    isBudgetDefault: budgetInfo.isDefault,
    budgets: budgetInfo.budgets,
    totalSpend,
    remaining,
    percentUsed,
    onTrack,
    dailyAvgSpend,
    platforms,
    breakdown,
    trend,
    highestSpendDay,
    lowestSpendDay,
    monthOverMonthChangePct,
    platformDetails,
    orderCount: PLATFORMS.reduce((s, p) => s + currentByPlatform[p.key].length, 0),
  };
}
