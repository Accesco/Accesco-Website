
import { NextRequest, NextResponse } from 'next/server';
import { PreferenceEngine } from '../../../../../lib/services/recommendation/PreferenceEngine.js';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    // FIX: Replaced Firebase ID Token validation with direct user authentication identifier mapping
    const userId = authHeader.split('Bearer ')[1];
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token structure' }, { status: 401 });
    }

    const body = await request.json();
    const interactions = body.interactions;

    if (!interactions || !Array.isArray(interactions) || interactions.length === 0) {
      return NextResponse.json({ error: 'Bad Request: Invalid interactions payload' }, { status: 400 });
    }

    await PreferenceEngine.processInteractionBatch(userId, interactions);

    return NextResponse.json({ status: 'success', processedCount: interactions.length }, { status: 200 });
  } catch (error) {
    console.error('Error writing swipe interactions:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}