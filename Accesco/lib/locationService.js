// lib/locationService.js

const DEFAULT_CITY = 'Bengaluru, Karnataka';

const allowedLocations = [
  'Bengaluru, Karnataka',
  'Mumbai, Maharashtra',
  'Delhi NCR',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
  'Pune, Maharashtra',
];

// Map states to your service cities
const stateToLocationMap = {
  'tamil nadu': 'Chennai, Tamil Nadu',
  'karnataka': 'Bengaluru, Karnataka',
  'maharashtra': 'Mumbai, Maharashtra',
  'telangana': 'Hyderabad, Telangana',
  'delhi': 'Delhi NCR',
  'haryana': 'Delhi NCR',
  'uttar pradesh': 'Delhi NCR',
};

const API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || 'b8b6d0d930b44bcdb09ddcb93af66ded';

export async function getPersonCity() {
  return new Promise((resolve) => {

    // ✅ 1. Check cache first
    const cached = localStorage.getItem('userLocation');
    if (cached && allowedLocations.includes(cached)) {
      return resolve(cached);
    }

    if (!navigator.geolocation) {
      return resolve(DEFAULT_CITY);
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
          );

          const data = await res.json();
          console.log("OpenCage Response:", data);

          const components = data.results[0]?.components || {};

          // 🔹 Extract city + state safely
          const city =
            components.city ||
            components.town ||
            components.village ||
            '';

          let state = components.state || '';
          state = state.toLowerCase().trim();

          console.log("Detected City:", city);
          console.log("Detected State:", state);

          let mappedCity = DEFAULT_CITY;

          // ✅ 2. City-level priority (important upgrade)
          const c = city.toLowerCase();

          if (c.includes('pune')) {
            mappedCity = 'Pune, Maharashtra';
          } else if (c.includes('mumbai')) {
            mappedCity = 'Mumbai, Maharashtra';
          } else if (c.includes('bangalore') || c.includes('bengaluru')) {
            mappedCity = 'Bengaluru, Karnataka';
          } else if (c.includes('chennai') || c.includes('madras')) {
            mappedCity = 'Chennai, Tamil Nadu';
          } else if (c.includes('hyderabad')) {
            mappedCity = 'Hyderabad, Telangana';
          } else if (
            c.includes('delhi') ||
            c.includes('gurgaon') ||
            c.includes('noida')
          ) {
            mappedCity = 'Delhi NCR';
          } else {
            // ✅ 3. fallback to state mapping
            mappedCity = stateToLocationMap[state] || DEFAULT_CITY;
          }

          console.log("Mapped Location:", mappedCity);

          // ✅ 4. Save to localStorage
          localStorage.setItem('userLocation', mappedCity);

          resolve(mappedCity);

        } catch (error) {
          console.error("Error fetching location:", error);
          resolve(DEFAULT_CITY);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        resolve(DEFAULT_CITY);
      }
    );
  });
}