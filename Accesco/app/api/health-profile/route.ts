import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch('https://nlp-engine.com/v1/health/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NLP_API_KEY || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'NLP engine request failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Health profile proxy error:', error);

    return NextResponse.json({ error: 'NLP engine request failed' }, { status: 500 });
  }
}
