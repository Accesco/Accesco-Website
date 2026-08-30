import { NextResponse } from 'next/server';
import { verifyAuthToken } from '../../_lib/auth';
import { monthKeyOf, isValidMonthKey, buildXpenseSummary } from '../../_lib/xpenseMeter';

export const dynamic = 'force-dynamic';

// GET /api/xpense-meter/summary?month=YYYY-MM — real spend across Grokly,
// Swadishtt and InstaStyle for the authenticated user, plus their budget
// for that month.
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

    const summary = await buildXpenseSummary(uid, month);
    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error('[xpense-meter/summary] GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
