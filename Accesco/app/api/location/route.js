// /app/api/location/route.js

const MAPMYINDIA_API_KEY = process.env.MAPMYINDIA_API_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const { latitude, longitude } = body;

    // Validate coordinates
    if (latitude === undefined || longitude === undefined) {
      return Response.json(
        { error: 'Missing latitude or longitude' },
        { status: 400 }
      );
    }

    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number'
    ) {
      return Response.json(
        { error: 'Invalid coordinate format' },
        { status: 400 }
      );
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return Response.json(
        { error: 'Coordinates out of valid range' },
        { status: 400 }
      );
    }

    // Correct MapMyIndia Reverse Geocode URL
    const mapMyIndiaUrl =
      `https://apis.mapmyindia.com/advancedmaps/v1/${MAPMYINDIA_API_KEY}/rev_geocode?lat=${latitude}&lng=${longitude}`;

    // console.log('📍 Reverse Geocoding:', latitude, longitude);

    const response = await fetch(mapMyIndiaUrl);

    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        `❌ MapMyIndia API Error (${response.status}):`,
        errorText
      );

      return Response.json(
        {
          error: 'Failed to fetch location from MapMyIndia',
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // console.log(
    //   '✅ MapMyIndia Response:',
    //   JSON.stringify(data, null, 2)
    // );

    // Validate response
    if (
      !data ||
      !data.results ||
      !Array.isArray(data.results) ||
      data.results.length === 0
    ) {
      return Response.json(
        { error: 'No location results found' },
        { status: 404 }
      );
    }

    // Get first result
    const result = data.results[0];

    // MapMyIndia returns fields directly
    const streetNumber = result.houseNumber || '';
    const street = result.street || '';
    const area =
      result.locality ||
      result.subLocality ||
      result.subSubLocality ||
      '';

    const city =
      result.city ||
      result.district ||
      result.village ||
      '';

    const state = result.state || '';
    const postalCode = result.pincode || '';
    const country = result.country || 'India';
    const countryCode = 'IN';

    const landmark =
      result.poi ||
      result.houseName ||
      '';

    // Build formatted address
    const fullAddress =
      result.formatted_address ||
      [
        streetNumber && street
          ? `${streetNumber} ${street}`
          : street,
        area,
        city,
        state,
        postalCode,
      ]
        .filter(Boolean)
        .join(', ');

    return Response.json(
      {
        // Street details
        streetNumber,
        street,
        area,
        neighbourhood: result.subLocality || '',
        landmark,

        // City/State/Country
        city,
        state,
        postalCode,
        country,
        countryCode,

        // Coordinates
        latitude,
        longitude,

        // Formatted addresses
        fullAddress,
        displayAddress: `${city}, ${state}`,
        formattedAddress:
          result.formatted_address || fullAddress,

        // Metadata
        timestamp: new Date().toISOString(),
        provider: 'mapmyindia',
        accuracy: 'high',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(
      '❌ Location API Error:',
      error
    );

    return Response.json(
      {
        error:
          error.message ||
          'Failed to fetch location',
      },
      { status: 500 }
    );
  }
}