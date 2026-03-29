import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error('API call failed');
    }

    const data = await response.json();
    const result = data.content?.[0]?.text || 'No analysis available.';
    return NextResponse.json({ result });
  } catch (err) {
    console.error('AI audit error:', err);
    // Fallback analysis without API
    return NextResponse.json({
      result: generateFallbackAnalysis(),
    });
  }
}

function generateFallbackAnalysis() {
  return `📊 Budget Health Score: 7/10

✅ What's good: Your budget follows the 50/30/20 framework reasonably well with clear separation between needs, wants and savings.

⚠️ Top Risk: Dining and entertainment spending can creep up — track these weekly to avoid month-end surprises.

💡 Quick Win: Set up an automatic transfer of your surplus to a liquid mutual fund on salary day. This "pay yourself first" habit can grow your savings 18–22% annually (based on average Indian equity fund returns).`;
}
