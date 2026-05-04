import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return NextResponse.json(
        { success: false, message: "Invalid coordinates" },
        { status: 400 }
      );
    }

    const darkStores = [
      { name: "Chennai Store", lat: 13.0827, lon: 80.2707 },
      { name: "Bangalore Store", lat: 12.9716, lon: 77.5946 },
      { name: "Delhi Store", lat: 28.7041, lon: 77.1025 },
    ];

    function getDistance(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) ** 2;

      return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    let nearestStore = null;
    let minDistance = Infinity;

    for (const store of darkStores) {
      const distance = getDistance(latitude, longitude, store.lat, store.lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearestStore = store;
      }
    }

    const eta_minutes = Math.round((minDistance / 40) * 60);

    return NextResponse.json({
      success: true,
      userLocation: { latitude, longitude },
      selectedDarkStore: nearestStore,
      distance_km: Number(minDistance.toFixed(2)),
      eta_minutes,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}