// /app/api/location/route.js

const MAPMYINDIA_API_KEY = process.env.NEXT_PUBLIC_MAPMYINDIA_API_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const { latitude, longitude } = body;

    // Validate coordinates
    if (latitude === undefined || longitude === undefined) {
      return Response.json({ error: 'Missing latitude or longitude' }, { status: 400 });
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return Response.json({ error: 'Invalid coordinate format' }, { status: 400 });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return Response.json({ error: 'Coordinates out of valid range' }, { status: 400 });
    }

    // ==========================================
    // ATTEMPT 1: MAPMYINDIA (High Accuracy)
    // ==========================================
    try {
      const mapMyIndiaUrl = `https://apis.mapmyindia.com/advancedmaps/v1/${MAPMYINDIA_API_KEY}/rev_geocode?lat=${latitude}&lng=${longitude}`;

      const mmiResponse = await fetch(mapMyIndiaUrl);

      if (mmiResponse.ok) {
        const mmiData = await mmiResponse.json();

        if (mmiData && mmiData.results && Array.isArray(mmiData.results) && mmiData.results.length > 0) {
          const result = mmiData.results[0];

          const streetNumber = result.houseNumber || '';
          const street = result.street || '';
          const area = result.locality || result.subLocality || result.subSubLocality || '';
          const city = result.city || result.district || result.village || '';
          const state = result.state || '';
          const postalCode = result.pincode || '';
          const country = result.country || 'India';
          const countryCode = 'IN';
          const landmark = result.poi || result.houseName || '';

          const fullAddress = result.formatted_address || [
            streetNumber && street ? `${streetNumber} ${street}` : street,
            area, city, state, postalCode
          ].filter(Boolean).join(', ');

          return Response.json({
            streetNumber, street, area,
            neighbourhood: result.subLocality || '',
            landmark, city, state, postalCode, country, countryCode,
            latitude, longitude, fullAddress,
            displayAddress: `${city}, ${state}`,
            formattedAddress: result.formatted_address || fullAddress,
            timestamp: new Date().toISOString(),
            provider: 'mapmyindia',
            accuracy: 'high',
          }, { status: 200 });
        }
      } else {
        const mmiError = await mmiResponse.text();
        console.warn(`⚠️ MapMyIndia Failed (${mmiResponse.status}). Falling back to OSM. Error:`, mmiError);
      }
    } catch (mmiError) {
      console.warn('⚠️ MapMyIndia Network Error. Falling back to OSM.', mmiError);
    }

    // ==========================================
    // ATTEMPT 2: OPENSTREETMAP (Fallback)
    // ==========================================
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
    
    // Replace the email below. OSM strictly requires a valid User-Agent.
    const osmResponse = await fetch(osmUrl, {
      headers: {
		'User-Agent': 'Swadishtt-DeliveryApp/1.0 (Contact: edujabez@gmail.com)',
		  'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!osmResponse.ok) {
      const osmErrorText = await osmResponse.text();
      console.error(`❌ OSM Fallback Error (${osmResponse.status}):`, osmErrorText);
      return Response.json({
        error: 'Both Geocoding providers failed',
        details: 'MapMyIndia and OpenStreetMap rejected the request.'
      }, { status: 502 });
    }

    const osmData = await osmResponse.json();

    if (!osmData || osmData.error) {
      return Response.json({ error: osmData.error || 'No location results found in fallback' }, { status: 404 });
    }

    const address = osmData.address || {};
    const streetNumber = address.house_number || '';
    const street = address.road || address.pedestrian || '';
    const area = address.suburb || address.residential || address.neighbourhood || '';
    const city = address.city || address.town || address.village || address.county || '';
    const state = address.state || '';
    const postalCode = address.postcode || '';
    const country = address.country || 'India';
    const countryCode = (address.country_code || 'IN').toUpperCase();
    const landmark = address.amenity || address.building || address.shop || '';

    const fullAddress = osmData.display_name || [streetNumber, street, area, city, state, postalCode].filter(Boolean).join(', ');

    return Response.json({
      streetNumber, street, area,
      neighbourhood: address.neighbourhood || '',
      landmark, city, state, postalCode, country, countryCode,
      latitude, longitude, fullAddress,
      displayAddress: city && state ? `${city}, ${state}` : city || state,
      formattedAddress: fullAddress,
      timestamp: new Date().toISOString(),
      provider: 'openstreetmap',
      accuracy: 'medium',
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Fatal Location API Error:', error);
    return Response.json({ error: error.message || 'Internal server error during geocoding' }, { status: 500 });
  }
}