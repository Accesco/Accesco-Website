import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    credits: 120,
    activities: [
      { id: 'act_1', title: 'Donation Completed', sub: 'To Udyan Care', amt: '+30', date: '12 Sep 2026' },
      { id: 'act_2', title: 'Item Sold', sub: 'Stripped Shirt', amt: '+20', date: '10 Sep 2026' },
      { id: 'act_3', title: 'Item Sold', sub: 'Ribbed Top', amt: '+15', date: '08 Sep 2026' },
      { id: 'act_4', title: 'Referral Bonus', sub: 'Rahul joined InstaStyle', amt: '+10', date: '05 Sep 2026' },
    ],
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, redeemed: body.amount || 0 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
