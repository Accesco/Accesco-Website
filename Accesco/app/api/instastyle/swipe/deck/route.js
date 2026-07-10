import { NextRequest, NextResponse } from 'next/server';
import { RecommendationService } from '../../../../../lib/services/recommendation/RecommendationService.js';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    // FIX: Removed all firebase-admin.js dependency imports and verifyIdToken routines
    const userId = authHeader.split('Bearer ')[1];
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token structure' }, { status: 401 });
    }

    const origin = request.nextUrl.origin;

    const products = await RecommendationService.generateSwipeDeck(userId, origin);

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Error fetching swipe deck:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}