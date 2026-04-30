/**
 * LocationModal Component - Location selector modal with real geolocation
 * @version 2.0.0
 */

'use client';

import { useState, useEffect } from 'react';
import { MapPin, Search, X, Target, Clock, Zap, AlertTriangle, Navigation } from 'lucide-react';
import styles from './LocationModal.module.css';
import { useGrokly } from '../contexts/GroklyContext';

/**
 * Popular locations in Bangalore
 */
const POPULAR_LOCATIONS = [
  { name: 'Koramangala', area: 'Bangalore', time: '11 mins' },
  { name: 'Indiranagar', area: 'Bangalore', time: '12 mins' },
  { name: 'HSR Layout', area: 'Bangalore', time: '13 mins' },
  { name: 'Whitefield', area: 'Bangalore', time: '15 mins' },
  { name: 'Electronic City', area: 'Bangalore', time: '18 mins' },
  { name: 'Marathahalli', area: 'Bangalore', time: '14 mins' },
  { name: 'BTM Layout', area: 'Bangalore', time: '12 mins' },
  { name: 'Jayanagar', area: 'Bangalore', time: '13 mins' },
  { name: 'Bellandur', area: 'Bangalore', time: '14 mins' },
  { name: 'Sarjapur Road', area: 'Bangalore', time: '16 mins' },
];

/**
 * LocationModal Component
 * Modal for selecting delivery location with real geolocation
 */
export default function LocationModal() {
  const { 
    location, 
    updateLocation, 
    isLocationModalOpen, 
    closeLocationModal 
  } = useGrokly();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  /**
   * Filter locations based on search query
   */
  const filteredLocations = POPULAR_LOCATIONS.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * Detect user's current location using Geolocation API
   */
  const detectLocation = async () => {
    setIsDetecting(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get address
          // Using OpenStreetMap Nominatim API (free, no API key required)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'Grokly-App/1.0'
              }
            }
          );
          
          const data = await response.json();
          
          if (data && data.address) {
            // Extract relevant location info
            const suburb = data.address.suburb || data.address.neighbourhood || '';
            const city = data.address.city || data.address.town || data.address.village || '';
            const locationName = suburb || city || 'Your Location';
            
            setDetectedLocation({
              name: locationName,
              fullAddress: data.display_name,
              coords: { latitude, longitude }
            });
          } else {
            setLocationError('Could not determine your location');
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          setLocationError('Failed to fetch location details');
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  /**
   * Handle detected location selection
   */
  const handleUseDetectedLocation = () => {
    if (detectedLocation) {
      updateLocation(detectedLocation.name);
      closeLocationModal();
    }
  };

  /**
   * Handle location selection
   */
  const handleSelectLocation = (locationName) => {
    updateLocation(locationName);
    closeLocationModal();
  };

  /**
   * Handle overlay click
   */
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeLocationModal();
    }
  };

  if (!isLocationModalOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={styles.overlay}
        onClick={handleOverlayClick}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div 
        className={styles.modal}
        role="dialog"
        aria-label="Select delivery location"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Select Location</h2>
          <button 
            className={styles.closeBtn}
            onClick={closeLocationModal}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Detect Location Button */}
          <button 
            className={styles.detectBtn}
            onClick={detectLocation}
            disabled={isDetecting}
            aria-label="Detect my current location"
          >
            {isDetecting ? (
              <Clock className={styles.detectIcon} size={20} aria-hidden="true" />
            ) : (
              <Target className={styles.detectIcon} size={20} aria-hidden="true" />
            )}
            <div className={styles.detectText}>
              <div className={styles.detectLabel}>
                {isDetecting ? 'Detecting...' : 'Detect my location'}
              </div>
              <div className={styles.detectSub}>
                {isDetecting ? 'Please wait' : 'Using GPS'}
              </div>
            </div>
          </button>

          {/* Location Error */}
          {locationError && (
            <div className={styles.errorBox}>
              <AlertTriangle size={18} aria-hidden="true" />
              <span>{locationError}</span>
            </div>
          )}

          {/* Detected Location */}
          {detectedLocation && (
            <button 
              className={styles.detectedLocation}
              onClick={handleUseDetectedLocation}
            >
              <Navigation className={styles.detectedIcon} size={20} aria-hidden="true" />
              <div className={styles.detectedText}>
                <div className={styles.detectedLabel}>Detected Location</div>
                <div className={styles.detectedName}>{detectedLocation.name}</div>
                <div className={styles.detectedAddress}>{detectedLocation.fullAddress}</div>
              </div>
              <span className={styles.detectedArrow}>→</span>
            </button>
          )}

          {/* Search Box */}
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search for your location..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search locations"
            />
          </div>

          {/* Current Location */}
          <div className={styles.currentLocation}>
            <MapPin className={styles.currentIcon} size={18} aria-hidden="true" />
            <div className={styles.currentText}>
              <div className={styles.currentLabel}>Current Location</div>
              <div className={styles.currentName}>{location}</div>
            </div>
          </div>

          {/* Popular Locations */}
          <h3 className={styles.sectionTitle}>Popular Locations</h3>
          <div className={styles.locationsList}>
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc, index) => (
                <button
                  key={index}
                  className={styles.locationItem}
                  onClick={() => handleSelectLocation(loc.name)}
                  aria-label={`Select ${loc.name}, delivery in ${loc.time}`}
                >
                  <MapPin className={styles.locationIcon} size={18} aria-hidden="true" />
                  <div className={styles.locationInfo}>
                    <div className={styles.locationName}>{loc.name}</div>
                    <div className={styles.locationArea}>{loc.area}</div>
                  </div>
                  <div className={styles.locationTime}>
                    <Zap className={styles.timeIcon} size={14} aria-hidden="true" />
                    {loc.time}
                  </div>
                </button>
              ))
            ) : (
              <div className={styles.noResults}>
                <Search size={32} aria-hidden="true" />
                <p>No locations found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
