// /app/api/location/forward/route.js

export async function POST(request) {
  try {
    const { address } = await request.json();

    if (!address) {
      return Response.json({ error: 'Missing address' }, { status: 400 });
    }

    // Bypass MapmyIndia: Use OpenStreetMap Nominatim API (Free, No Key Required)
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    
    const response = await fetch(nominatimUrl, {
      headers: {
        // Nominatim requires a User-Agent identifying the app to prevent blocking
        'User-Agent': 'Accesco-Delivery-App' 
      }
    });

    if (!response.ok) {
      console.error(`OSM API Error: ${response.status}`);
      return Response.json({ error: 'Failed to fetch coordinates' }, { status: response.status });
    }

    const data = await response.json();

    // If array is empty, no location was found
    if (!data || data.length === 0) {
      return Response.json({ error: 'Could not parse the location' }, { status: 404 });
    }

    const result = data[0];
    
    return Response.json({
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      formattedAddress: result.display_name
    }, { status: 200 });

  } catch (error) {
    console.error('Forward Geocoding Error:', error);
    return Response.json({ error: 'Failed to process request' }, { status: 500 });
  }
}