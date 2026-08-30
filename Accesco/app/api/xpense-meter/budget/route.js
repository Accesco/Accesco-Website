import { NextResponse } from 'next/server';
import { verifyAuthToken } from '../../_lib/auth';
import { PLATFORMS, monthKeyOf, isValidMonthKey, getBudgetForMonth, saveBudget } from '../../_lib/xpenseMeter';

export const dynamic = 'force-dynamic';

// GET /api/xpense-meter/budget?month=YYYY-MM — the saved budget for that
// month, or a suggested one (based on last month's real spend) if the user
// never set one.
export async function GET(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || monthKeyOf(new Date());
    if (!isValidMonthKey(month)) {
      return NextResponse.json({ error: 'Invalid month, expected YYYY-MM' }, { status: 400 });
    }

    const budget = await getBudgetForMonth(uid, month);
    return NextResponse.json({ month, ...budget }, { status: 200 });
  } catch (error) {
    console.error('[xpense-meter/budget] GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/xpense-meter/budget — set the user's budget for a month.
export async function PUT(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const body = await request.json();
    const month = body.month || monthKeyOf(new Date());
    if (!isValidMonthKey(month)) {
      return NextResponse.json({ error: 'Invalid month, expected YYYY-MM' }, { status: 400 });
    }

    const totalBudget = Number(body.totalBudget);
    if (!Number.isFinite(totalBudget) || totalBudget < 0) {
      return NextResponse.json({ error: 'totalBudget must be a non-negative number' }, { status: 400 });
    }

    const budgets = {};
    for (const p of PLATFORMS) {
      const value = Number(body.budgets?.[p.key]);
      if (!Number.isFinite(value) || value < 0) {
        return NextResponse.json({ error: `budgets.${p.key} must be a non-negative number` }, { status: 400 });
      }
      budgets[p.key] = value;
    }

    await saveBudget(uid, month, totalBudget, budgets);

    return NextResponse.json({ success: true, month, totalBudget, budgets, isDefault: false }, { status: 200 });
  } catch (error) {
    console.error('[xpense-meter/budget] PUT error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
