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

  // profile is now an array of members
  const household = profile.map((member) => ({
    age:                Number(member.age)                 || 25,
    gender:             member.gender                      || 'other',
    weightRange:        member.weightRange                 || '60-70',
    activityLevel:      ACTIVITY_MAP[member.activityLevel] || 'moderate',
    dietaryPreferences: member.preferences                 || [],
  }));

  const res = await fetch(`${FASTAPI_URL}/v1/health/analyze`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ household }),
  });

  const data = await res.json();
  return Response.json(data);
}

