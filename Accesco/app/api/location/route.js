/*
  MappsLs India API is used to detect the location
  Workflow:
    The coordinates from the frontend 
      {Latitude, longitude}
      is sent using navigator
    and In this api it Reverse Geocodes and sends the accurate result based on the coordinates
      Accuracy : {0 - 150 mts}

    Compared to nomation openstreet map it is faster
*/

import { NextResponse } from "next/server";

const REQUIRED_ACCURACY_METERS = 100;
const FETCH_TIMEOUT_MS = 8000;
const CACHE_DECIMAL_PRECISION = 4; // ~11 meters radius
const CACHE_DURATION_MS = 15 * 60 * 1000;
const MAX_CACHE_SIZE = 1000;

// In-memory caches
const coordinateCache = new Map();

// Mappls Auth Token Caching
let mapplsAccessToken = null;
let mapplsTokenExpiry = 0;

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function getCacheKey(latitude, longitude) {
  return `${latitude.toFixed(CACHE_DECIMAL_PRECISION)},${longitude.toFixed(CACHE_DECIMAL_PRECISION)}`;
}

// ---- Mappls OAuth Token Management ----
async function getMapplsToken() {
  // If token exists and is valid (with a 5-minute buffer), return it
  if (mapplsAccessToken && Date.now() < mapplsTokenExpiry) {
    return mapplsAccessToken;
  }

  const clientId = process.env.MAPPLS_CLIENT_ID;
  const clientSecret = process.env.MAPPLS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Mappls credentials missing in environment variables.");
  }

  const tokenUrl = "https://outpost.mappls.com/api/security/oauth/token";
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) throw new Error("Failed to authenticate with Mappls API.");

  const data = await response.json();
  mapplsAccessToken = data.access_token;
  // Set expiry to token lifespan minus 5 minutes (300 seconds) for safety margin
  mapplsTokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

  return mapplsAccessToken;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const latitude = toNumber(body?.latitude);
  const longitude = toNumber(body?.longitude);
  const accuracy = toNumber(body?.accuracy);

  // ... (Input validation logic remains EXACTLY the same) ...
  if (latitude === null || longitude === null || accuracy === null) {
    return NextResponse.json(
      { success: false, message: "latitude, longitude and accuracy are required numbers." },
      { status: 400 }
    );
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return NextResponse.json(
      { success: false, message: "Invalid latitude/longitude." },
      { status: 400 }
    );
  }

  if (accuracy > REQUIRED_ACCURACY_METERS) {
    return NextResponse.json(
      {
        success: false,
        message: `Current GPS accuracy is ${Math.round(accuracy)}m. Please retry until it is within ${REQUIRED_ACCURACY_METERS}m.`,
        shouldRetry: true,
        accuracyMeters: Math.round(accuracy),
        requiredAccuracyMeters: REQUIRED_ACCURACY_METERS,
      },
      { status: 422 }
    );
  }

  // Check Location Cache first
  const cacheKey = getCacheKey(latitude, longitude);
  const cached = coordinateCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    return NextResponse.json(cached.data, { 
      status: 200, headers: { "X-Cache": "HIT" } 
    });
  }

  try {
    // Prefer Mappls if credentials are available; otherwise fallback to Nominatim (OpenStreetMap)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    // Attempt to get Mappls token but treat missing credentials as a signal to fallback
    let useMappls = true;
    let token = null;
    try {
      token = await getMapplsToken();
    } catch (err) {
      // If credentials are missing, fall back to Nominatim
      if (err?.message && err.message.includes('Mappls credentials missing')) {
        useMappls = false;
      } else {
        clearTimeout(timeoutId);
        throw err;
      }
    }

    // Helper to call Nominatim reverse geocode
    async function reverseGeocodeNominatim(lat, lon) {
      const nomUrl = new URL('https://nominatim.openstreetmap.org/reverse');
      nomUrl.searchParams.set('lat', String(lat));
      nomUrl.searchParams.set('lon', String(lon));
      nomUrl.searchParams.set('format', 'jsonv2');
      nomUrl.searchParams.set('addressdetails', '1');

      const resp = await fetch(nomUrl.toString(), {
        headers: {
          // Nominatim requires a valid User-Agent or Referer identifying the application
          'User-Agent': 'Accesco/1.0 (+https://example.com)'
        },
        signal: controller.signal,
      });

      if (!resp.ok) throw new Error('Nominatim reverse geocode failed');
      return await resp.json();
    }

    let result = {};

    if (useMappls && token) {
      // 2. Fetch from Mappls Reverse Geocode API
      const url = new URL("https://apis.mappls.com/advancedmaps/v1/rev_geocode");
      url.searchParams.set("lat", String(latitude));
      url.searchParams.set("lng", String(longitude));

      let response;
      try {
        response = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        return NextResponse.json(
          { success: false, message: "Failed to reverse-geocode location." },
          { status: 502 }
        );
      }

      const data = await response.json();
      // Mappls returns an array of "results"
      result = data?.results?.[0] || {};

    } else {
      // Use Nominatim fallback
      const nomData = await reverseGeocodeNominatim(latitude, longitude);
      clearTimeout(timeoutId);

      // Normalize Nominatim response into the same shape the frontend expects
      result = {
        formatted_address: nomData.display_name || null,
        houseNumber: nomData.address?.house_number || null,
        houseName: null,
        street: nomData.address?.road || nomData.address?.pedestrian || null,
        poi: nomData.name || null,
        locality: nomData.address?.suburb || nomData.address?.neighbourhood || null,
        subLocality: nomData.address?.suburb || null,
        city: nomData.address?.city || nomData.address?.town || nomData.address?.village || null,
        district: nomData.address?.county || null,
        pincode: nomData.address?.postcode || null,
        state: nomData.address?.state || null,
        subDistrict: null,
        village: nomData.address?.village || null,
        formatted_address_full: nomData.display_name || null,
      };
    }

    // 3. Map output to the frontend structure (works for both Mappls and Nominatim-normalized result)
    const houseNumber = result.houseNumber || result.houseName || null;
    const road = result.street || null;
    const area = result.locality || result.subLocality || null;
    const city = result.city || result.district || null;
    const postalCode = result.pincode || null;

    const addressComponents = [houseNumber, result.poi, road, area, city, postalCode].filter(Boolean);
    const shortAddressComponents = [area, city].filter(Boolean);
    
    const locationName = 
      addressComponents.join(", ") || 
      shortAddressComponents.join(", ") || 
      "Your Location";

    // Reconstruct exact response payload
    const responsePayload = {
      success: true,
      requiredAccuracyMeters: REQUIRED_ACCURACY_METERS,
      isAccurate: true,
      coordinates: { latitude, longitude },
      accuracyMeters: Math.round(accuracy),
      locationName,
      display_name: result.formatted_address || result.formatted_address_full || null,
      address: {
        house_number: houseNumber,
        road,
        pedestrian: null,
        footway: null,
        neighbourhood: result.subLocality || null,
        suburb: result.locality || null,
        city_district: result.subDistrict || null,
        city: result.city || null,
        town: null,
        village: result.village || null,
        postcode: postalCode,
        state: result.state || null,
        country: useMappls ? "India" : (result.country || null) || null,
        country_code: useMappls ? "in" : null,
      },
      formattedAddress: {
        label: addressComponents.join(", "),
        full: result.formatted_address || result.formatted_address_full || null,
        houseNumber,
        road,
        area,
        city,
        postalCode,
        state: result.state || null,
        country: useMappls ? "India" : (result.country || null) || null,
      },
    };

    // Store in Cache safely
    if (coordinateCache.size >= MAX_CACHE_SIZE) {
      coordinateCache.delete(coordinateCache.keys().next().value);
    }
    coordinateCache.set(cacheKey, { data: responsePayload, timestamp: Date.now() });

    return NextResponse.json(responsePayload, { 
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        "X-Cache": "MISS"
      }
    });

  } catch (error) {
    if (error.name === "AbortError") {
      return NextResponse.json(
        { success: false, message: "Location service request timeout. Please retry." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error.", error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
