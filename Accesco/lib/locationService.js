/**
 * Location Service - High-accuracy delivery location management
 * Uses Nominatim (OpenStreetMap) for street-level address details
 * Perfect for delivery apps requiring precise location information
 */

let cachedLocation = null;

/**
 * Set in-memory user location (synced from Firestore / UI)
 */
export function setUserLocation(location) {
  cachedLocation = location;
}

/**
 * Get the complete user location data
 * @returns {Object|null} Complete location object or null if not set
 */
export function getUserLocation() {
  return cachedLocation;
}

/**
 * Get specific location field
 * @param {string} field - Field name (e.g., 'street', 'city', 'postalCode')
 * @returns {string} Field value or empty string
 */
export function getLocationField(field) {
  const location = getUserLocation();
  return location?.[field] || '';
}

/**
 * Get street-level address (for delivery operations)
 * @returns {string} Complete street address with number
 */
export function getStreetAddress() {
  const location = getUserLocation();
  if (!location) return '';
  
  const parts = [];
  if (location.streetNumber) parts.push(location.streetNumber);
  if (location.street) parts.push(location.street);
  if (location.area) parts.push(location.area);
  
  return parts.join(', ');
}

/**
 * Get full address for display or delivery
 * @returns {string} Complete formatted address
 */
export function getFullAddress() {
  const location = getUserLocation();
  return location?.fullAddress || '';
}

/**
 * Get city and state display
 * @returns {string} City, State format
 */
export function getDisplayAddress() {
  const location = getUserLocation();
  if (!location) return '';
  return `${location.city}, ${location.state}`;
}

/**
 * Get postal code for delivery zones
 * @returns {string} Postal code
 */
export function getPostalCode() {
  return getLocationField('postalCode');
}

/**
 * Get coordinates
 * @returns {Object} {latitude, longitude}
 */
export function getCoordinates() {
  const location = getUserLocation();
  return {
    latitude: location?.latitude || null,
    longitude: location?.longitude || null,
  };
}

/**
 * Check if location is set
 * @returns {boolean} True if user location is stored
 */
export function isLocationSet() {
  return getUserLocation() !== null;
}

/**
 * Clear stored location
 */
export function clearLocation() {
  cachedLocation = null;
}

/**
 * Get location for delivery operations
 * Returns all details needed for delivery system
 * @returns {Object} Delivery-ready location object
 */
export function getDeliveryLocation() {
  const location = getUserLocation();
  if (!location) return null;
  
  return {
    streetAddress: getStreetAddress(),
    fullAddress: location.fullAddress,
    city: location.city,
    state: location.state,
    postalCode: location.postalCode,
    area: location.area,
    neighbourhood: location.neighbourhood,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    coordinates: {
      lat: location.latitude,
      lng: location.longitude,
    },
    timestamp: location.timestamp,
    provider: location.provider,
  };
}

/**
 * Format address for UI display
 * @param {string} format - 'short' | 'medium' | 'full'
 * @returns {string} Formatted address
 */
export function formatAddress(format = 'medium') {
  const location = getUserLocation();
  if (!location) return '';
  
  switch (format) {
    case 'short':
      return `${location.city}, ${location.state}`;
    case 'medium':
      return `${location.street ? location.street + ', ' : ''}${location.city}`;
    case 'full':
      return location.fullAddress;
    default:
      return location.fullAddress;
  }
}

/**
 * Validate if location has all required delivery details
 * @returns {Object} {isValid: boolean, missingFields: array}
 */
export function validateDeliveryLocation() {
  const location = getUserLocation();
  const missingFields = [];
  
  if (!location) {
    return {
      isValid: false,
      missingFields: ['No location set'],
    };
  }
  
  if (!location.street) missingFields.push('street');
  if (!location.city) missingFields.push('city');
  if (!location.postalCode) missingFields.push('postalCode');
  if (!location.latitude || !location.longitude) missingFields.push('coordinates');
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Get distance between user location and a point (in km)
 * Uses Haversine formula for approximation
 * @param {number} lat2 - Target latitude
 * @param {number} lon2 - Target longitude
 * @returns {number} Distance in kilometers
 */
export function getDistanceToPoint(lat2, lon2) {
  const location = getUserLocation();
  if (!location) return null;
  
  const lat1 = location.latitude;
  const lon1 = location.longitude;
  
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimals
}

/**
 * Legacy function for backward compatibility
 * Returns display city name
 */
export async function getPersonCity() {
  return getDisplayAddress() || 'Bengaluru, Karnataka';
}

const locationService = {
  getUserLocation,
  getLocationField,
  getStreetAddress,
  getFullAddress,
  getDisplayAddress,
  getPostalCode,
  getCoordinates,
  isLocationSet,
  clearLocation,
  getDeliveryLocation,
  formatAddress,
  validateDeliveryLocation,
  getDistanceToPoint,
  getPersonCity,
};

export default locationService;