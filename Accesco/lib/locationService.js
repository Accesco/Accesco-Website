/**
 * Location Service - High-accuracy delivery location management
 * Uses Nominatim (OpenStreetMap) for street-level address details
 * Perfect for delivery apps requiring precise location information
 *
 * Delivery helpers (`getNearestVendor`, `getDistance`, `fetchRoute`,
 * `calculateETA`) delegate to vendorEngine / routeEngine / etaEngine —
 * no duplicated Haversine or OSRM logic.
 */

import { calculateDistance as etaCalculateDistance, calculateETA as etaCalculateETA } from './etaEngine';
import { fetchRoute as routeFetchRoute } from './routeEngine';
import { getNearestVendor as vendorGetNearestVendor } from './vendorEngine';

/**
 * Get the complete user location data from localStorage
 * @returns {Object|null} Complete location object or null if not set
 */
export function getUserLocation() {
  if (typeof window === 'undefined') return null;
  
  try {
    const location = localStorage.getItem('userLocation');
    return location ? JSON.parse(location) : null;
  } catch (error) {
    console.error('Error parsing user location:', error);
    return null;
  }
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
  if (typeof window === 'undefined') return;
  localStorage.removeItem('userLocation');
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
 * Uses etaEngine Haversine (no duplicated formula).
 * @param {number} lat2 - Target latitude
 * @param {number} lon2 - Target longitude
 * @returns {number|null} Distance in kilometers
 */
export function getDistanceToPoint(lat2, lon2) {
  const location = getUserLocation();
  if (!location) return null;

  const lat1 = location.latitude;
  const lon1 = location.longitude;
  if (!Number.isFinite(lat1) || !Number.isFinite(lon1)) return null;

  const distance = etaCalculateDistance(lat1, lon1, lat2, lon2);
  return Math.round(distance * 100) / 100;
}

/**
 * Legacy function for backward compatibility
 * Returns display city name
 */
export async function getPersonCity() {
  return getDisplayAddress() || 'Bengaluru, Karnataka';
}

/**
 * Great-circle distance between two coordinates (km).
 * Delegates to `etaEngine.calculateDistance` — no duplicated Haversine.
 *
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 * @returns {number}
 */
export function getDistance(lat1, lng1, lat2, lng2) {
  return etaCalculateDistance(lat1, lng1, lat2, lng2);
}

/**
 * Finds the nearest vendor to the given customer coordinates.
 * Delegates to `vendorEngine` (swappable nearest-neighbor strategy).
 *
 * @param {{lat:number,lng:number}|[number,number]} customerCoordinates
 * @param {object[]} vendors
 * @param {object} [options]
 * @returns {{ vendor: object|null, distance: number, travelTime: number }}
 */
export function getNearestVendor(customerCoordinates, vendors, options) {
  return vendorGetNearestVendor(customerCoordinates, vendors, options);
}

/**
 * Fetches a driving route via OSRM (`routeEngine`).
 *
 * @param {{lat:number,lng:number}|[number,number]} from
 * @param {{lat:number,lng:number}|[number,number]} to
 * @param {object} [options]
 * @returns {Promise<{ coordinates: Array<[number,number]>, polyline: string, distance: number, duration: number }>}
 */
export async function fetchRoute(from, to, options) {
  return routeFetchRoute(from, to, options);
}

/**
 * Estimates travel ETA in minutes (`etaEngine`).
 *
 * @param {number} distanceKm
 * @param {number} [speedKmh]
 * @param {number} [trafficMultiplier]
 * @returns {number}
 */
export function calculateETA(distanceKm, speedKmh, trafficMultiplier) {
  return etaCalculateETA(distanceKm, speedKmh, trafficMultiplier);
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
  getNearestVendor,
  getDistance,
  fetchRoute,
  calculateETA,
};

export default locationService;