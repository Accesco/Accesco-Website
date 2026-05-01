import { NextResponse } from "next/server";

const REQUIRED_ACCURACY_METERS = 500;
const FETCH_TIMEOUT_MS = 8000; // 8 second timeout for external API
const COORDINATE_CACHE_RADIUS = 50; // meters - cache hits within 50m
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// In-memory cache for coordinates
const coordinateCache = new Map();

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function pick(address, keys) {
  for (const key of keys) {
    if (address[key]) return address[key];
  }
  return null;
}

function getCacheKey(latitude, longitude) {
  // Round to ~5 decimal places (~1m precision) to increase cache hit likelihood
  return `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
}

function getCachedResult(latitude, longitude) {
  const key = getCacheKey(latitude, longitude);
  const cached = coordinateCache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    return cached.data;
  }
  
  // Clean up expired entries
  if (cached) {
    coordinateCache.delete(key);
  }
  
  return null;
}

function setCachedResult(latitude, longitude, data) {
  const key = getCacheKey(latitude, longitude);
  coordinateCache.set(key, {
    data,
    timestamp: Date.now(),
  });
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

  if (latitude === null || longitude === null || accuracy === null) {
    return NextResponse.json(
      {
        success: false,
        message: "latitude, longitude and accuracy are required numbers.",
      },
      { status: 400 }
    );
  }

  if (
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid latitude/longitude.",
      },
      { status: 400 }
    );
  }

  if (accuracy > REQUIRED_ACCURACY_METERS) {
    return NextResponse.json(
      {
        success: false,
        message: `Current GPS accuracy is ${Math.round(
          accuracy
        )}m. Please retry until it is within ${REQUIRED_ACCURACY_METERS}m.`,
        shouldRetry: true,
        accuracyMeters: Math.round(accuracy),
        requiredAccuracyMeters: REQUIRED_ACCURACY_METERS,
      },
      { status: 422 }
    );
  }

  // Check cache first
  const cachedResult = getCachedResult(latitude, longitude);
  if (cachedResult) {
    return NextResponse.json(cachedResult, { status: 200 });
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", String(latitude));
    url.searchParams.set("lon", String(longitude));
    url.searchParams.set("zoom", "18");
    url.searchParams.set("addressdetails", "1");

    // Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response;
    try {
      response = await fetch(url.toString(), {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "Accesco-Location-API",
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to reverse-geocode location.",
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    const address = data?.address || {};

    const houseNumber = address.house_number || null;
    const road = pick(address, ["road", "pedestrian", "footway", "path"]);
    const area = pick(address, [
      "neighbourhood",
      "suburb",
      "city_district",
      "quarter",
    ]);
    const city = pick(address, ["city", "town", "village", "municipality"]);
    const postalCode = address.postcode || null;
    const locationName =
      [houseNumber, road, area, city, postalCode].filter(Boolean).join(", ") ||
      [area, city].filter(Boolean).join(", ") ||
      "Your Location";

    const responsePayload = {
      success: true,
      requiredAccuracyMeters: REQUIRED_ACCURACY_METERS,
      isAccurate: true,
      coordinates: {
        latitude,
        longitude,
      },
      accuracyMeters: Math.round(accuracy),
      locationName,
      display_name: data?.display_name || null,
      address: {
        house_number: houseNumber,
        road,
        pedestrian: address.pedestrian || null,
        footway: address.footway || null,
        neighbourhood: address.neighbourhood || null,
        suburb: address.suburb || null,
        city_district: address.city_district || null,
        city: address.city || null,
        town: address.town || null,
        village: address.village || null,
        postcode: address.postcode || null,
        state: address.state || null,
        country: address.country || null,
        country_code: address.country_code || null,
      },
      formattedAddress: {
        label: [houseNumber, road, area, city, postalCode]
          .filter(Boolean)
          .join(", "),
        full: data?.display_name || null,
        houseNumber,
        road,
        area,
        city,
        postalCode,
        state: address.state || null,
        country: address.country || null,
      },
    };

    // Cache the result
    setCachedResult(latitude, longitude, responsePayload);

    return NextResponse.json(responsePayload, { 
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800"
      }
    });
  } catch (error) {
    // Handle timeout errors
    if (error.name === "AbortError") {
      return NextResponse.json(
        {
          success: false,
          message: "Location service request timeout. Please retry.",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

