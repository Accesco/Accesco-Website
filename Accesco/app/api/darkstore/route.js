// app/api/getdarkstore/route.js
/*
    Darkstore logic code
    Added soem mock dark store
    Will be implemnted in the frontend at /services/grokly/checkout
    after the checkout the eta should be done
*/
export async function POST(req) {
  try {
    const body = await req.json();
    const { userLat, userLng } = body;

    if (!userLat || !userLng) {
      return Response.json(
        { error: "userLat and userLng are required" },
        { status: 400 }
      );
    }

    const darkStores = [
      {
        id: "chennai_1",
        name: "Chennai Dark Store - T Nagar",
        city: "Chennai",
        lat: 13.0418,
        lng: 80.2341,
        isActive: true,
      },
      {
        id: "chennai_2",
        name: "Chennai Dark Store - OMR",
        city: "Chennai",
        lat: 12.9120,
        lng: 80.2279,
        isActive: true,
      },
      {
        id: "blr_1",
        name: "Bangalore Dark Store - Indiranagar",
        city: "Bangalore",
        lat: 12.9716,
        lng: 77.6412,
        isActive: true,
      },
      {
        id: "blr_2",
        name: "Bangalore Dark Store - Whitefield",
        city: "Bangalore",
        lat: 12.9698,
        lng: 77.7500,
        isActive: true,
      },
      {
        id: "delhi_1",
        name: "Delhi Dark Store - Connaught Place",
        city: "Delhi",
        lat: 28.6315,
        lng: 77.2167,
        isActive: true,
      },
      {
        id: "delhi_2",
        name: "Delhi Dark Store - Saket",
        city: "Delhi",
        lat: 28.5245,
        lng: 77.2066,
        isActive: true,
      },
    ];

    const getDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth radius in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // 🔍 Find nearest store
    let nearestStore = null;
    let minDistance = Infinity;

    for (const store of darkStores) {
      if (!store.isActive) continue;

      const distance = getDistance(
        userLat,
        userLng,
        store.lat,
        store.lng
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestStore = store;
      }
    }

    if (!nearestStore) {
      return Response.json(
        { message: "No store available" },
        { status: 404 }
      );
    }

    // ⏱️ Simple ETA calculation (20 km/h avg speed)
    const etaMinutes = Math.round((minDistance / 20) * 60);

    return Response.json({
      success: true,
      userLocation: { userLat, userLng },
      assignedStore: nearestStore,
      distanceKm: minDistance.toFixed(2),
      etaMinutes,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}