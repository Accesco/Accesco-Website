/**
 * app/api/health-profile/route.js
 * ─────────────────────────────────
 * Bridge between page.jsx and Chayan's FastAPI (main.py)
 *
 * page.jsx  →  POST /api/health-profile  →  this file  →  POST /v1/health/analyze  →  nutrition_engine.py
 */

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

// Maps her dropdown values → what nutrition_engine.py understands
const ACTIVITY_MAP = {
  low:      'sedentary',
  moderate: 'moderate',
  high:     'active',
};

export async function POST(request) {
  const body = await request.json();
  const { profile } = body;

  // Build the payload your FastAPI /v1/health/analyze expects
  const payload = {
    household: [
      {
        age:                Number(profile.age)                          || 25,
        gender:             profile.gender                               || 'other',
        weightRange:        profile.weightRange                          || '60-70',
        activityLevel:      ACTIVITY_MAP[profile.activityLevel]          || 'moderate',
        dietaryPreferences: profile.preferences                          || [],
      },
    ],
  };

  const res  = await fetch(`${FASTAPI_URL}/v1/health/analyze`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });

  const data = await res.json();
  return Response.json(data);
}
