/**
 * useLocation Hook
 * Custom hook for location management
 * @version 1.0.0
 */

import { useGrokly } from '../contexts/GroklyContext';

/**
 * useLocation Hook
 * Provides location state and operations
 * 
 * @returns {Object} Location state and methods
 */
export function useLocation() {
  const {
    location,
    updateLocation,
    isLocationModalOpen,
    toggleLocationModal,
    openLocationModal,
    closeLocationModal,
  } = useGrokly();

  /**
   * Detect user's current location (browser geolocation)
   */
  const detectLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In production, reverse geocode to get address
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  /**
   * Check if delivery is available at location
   */
  const checkDeliveryAvailability = async (locationName) => {
    // In production, this would call an API
    // For now, return mock data
    return {
      available: true,
      deliveryTime: '11 mins',
      minOrder: 0,
    };
  };

  return {
    // State
    location,
    isLocationModalOpen,
    
    // Methods
    updateLocation,
    toggleLocationModal,
    openLocationModal,
    closeLocationModal,
    detectLocation,
    checkDeliveryAvailability,
  };
}

export default useLocation;
