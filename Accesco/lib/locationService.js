// lib/locationService.js
// It will detect the user's state and return the corresponding city...


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
  'Tamil Nadu': 'Chennai, Tamil Nadu',
  'Karnataka': 'Bengaluru, Karnataka',
  'Maharashtra': 'Mumbai, Maharashtra',
  'Telangana': 'Hyderabad, Telangana',
  'Delhi': 'Delhi NCR',
  'Haryana': 'Delhi NCR',
  'Uttar Pradesh': 'Delhi NCR',
};

export async function getUserCity() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      return resolve('Bengaluru, Karnataka');
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          const data = await res.json();
          console.log("Geolocation API Response:", data);

          // Extract state from the API response
          const state = data.address.state;
          console.log("Detected State:", state);

          // Map state to your business location
          const mappedCity = stateToLocationMap[state] || 'Bengaluru, Karnataka';
          console.log("Mapped Location:", mappedCity);

          resolve(mappedCity);
        } catch (error) {
          console.error("Error fetching location:", error);
          resolve('Bengaluru, Karnataka');
        }
      },
      () => {
        resolve('Bengaluru, Karnataka');
      }
    );
  });
}