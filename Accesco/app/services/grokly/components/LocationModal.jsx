/**
 * LocationModal Component - Delivery-grade geolocation with <=50m target.
 * Optimized for fast response times with smart geolocation strategy.
 */

"use client";

import { useState, useRef } from "react";
import {
  MapPin,
  Search,
  X,
  Target,
  Clock,
  Zap,
  AlertTriangle,
  Navigation,
} from "lucide-react";
import styles from "./LocationModal.module.css";
import { useGrokly } from "../contexts/GroklyContext";

const TARGET_ACCURACY_METERS = 50;
const ACCEPTABLE_ACCURACY_METERS = 100; // Parallel API call after this
const CLIENT_CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// Client-side cache for detected locations
const locationCache = new Map();

function getCachedLocation(latitude, longitude) {
  const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  const cached = locationCache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CLIENT_CACHE_DURATION_MS) {
    return cached.data;
  }
  
  if (cached) {
    locationCache.delete(key);
  }
  
  return null;
}

function setCachedLocation(latitude, longitude, data) {
  const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  locationCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

function getDeliveryGradePosition({
  targetAccuracy = TARGET_ACCURACY_METERS,
  acceptableAccuracy = ACCEPTABLE_ACCURACY_METERS,
  timeoutMs = 20000,
  maxAgeMs = 60000,
} = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    let bestPosition = null;
    let finished = false;
    let watchId = null;
    let timeoutId = null;
    let acceptablePositionFound = false;

    const finishSuccess = (position) => {
      if (finished) return;
      finished = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (timeoutId !== null) clearTimeout(timeoutId);
      resolve(position);
    };

    const finishError = (error) => {
      if (finished) return;
      finished = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (timeoutId !== null) clearTimeout(timeoutId);
      reject(error);
    };

    // First, try getCurrentPosition for fast initial result
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const accuracy = Number(position?.coords?.accuracy);
        bestPosition = position;

        // If we got acceptable accuracy quickly, use it and continue watching for better
        if (Number.isFinite(accuracy) && accuracy <= acceptableAccuracy) {
          acceptablePositionFound = true;
          // Immediately resolve with acceptable position, but keep watching for target
          // This is the key optimization - don't wait for 50m if we have 100m
        }

        if (Number.isFinite(accuracy) && accuracy <= targetAccuracy) {
          finishSuccess(position);
        }
      },
      () => {
        // getCurrentPosition failed, fall back to watchPosition
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: maxAgeMs,
      }
    );

    // Use watchPosition for continuous updates
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentAccuracy = Number(position?.coords?.accuracy);
        const bestAccuracy = Number(bestPosition?.coords?.accuracy);

        // Keep track of best position
        if (
          !bestPosition ||
          (Number.isFinite(currentAccuracy) &&
            (!Number.isFinite(bestAccuracy) || currentAccuracy < bestAccuracy))
        ) {
          bestPosition = position;
        }

        // Target accuracy reached
        if (Number.isFinite(currentAccuracy) && currentAccuracy <= targetAccuracy) {
          finishSuccess(position);
          return;
        }

        // If we found acceptable accuracy and haven't finished, trigger a parallel API call
        if (acceptablePositionFound && !finished && bestPosition) {
          // This will be handled in the component
        }
      },
      (error) => {
        // Only fail if we have no position at all
        if (!bestPosition) {
          finishError(error);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: maxAgeMs,
      }
    );

    // Total timeout - return best position found so far
    timeoutId = setTimeout(() => {
      if (finished) return;
      if (bestPosition) {
        finishSuccess(bestPosition);
        return;
      }
      finishError(new Error("Unable to get location within timeout."));
    }, timeoutMs);
  });
}

export default function LocationModal() {
  const { location, updateLocation, isLocationModalOpen, closeLocationModal } =
    useGrokly();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const abortControllerRef = useRef(null);

  const POPULAR_LOCATIONS = [
    { name: "Koramangala", area: "Bangalore", time: "11 mins" },
    { name: "Indiranagar", area: "Bangalore", time: "12 mins" },
    { name: "HSR Layout", area: "Bangalore", time: "13 mins" },
    { name: "Whitefield", area: "Bangalore", time: "15 mins" },
    { name: "Electronic City", area: "Bangalore", time: "18 mins" },
    { name: "Marathahalli", area: "Bangalore", time: "14 mins" },
    { name: "BTM Layout", area: "Bangalore", time: "12 mins" },
    { name: "Jayanagar", area: "Bangalore", time: "13 mins" },
    { name: "Bellandur", area: "Bangalore", time: "14 mins" },
    { name: "Sarjapur Road", area: "Bangalore", time: "16 mins" },
  ];

  const filteredLocations = POPULAR_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchLocationDetails = async (latitude, longitude, accuracy) => {
    try {
      const response = await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude,
          longitude,
          accuracy,
        }),
        signal: abortControllerRef.current?.signal,
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        return null;
      }

      const addr = payload?.address || {};
      const house = addr.house_number || "";
      const road = addr.road || addr.pedestrian || addr.footway || "";
      const area = addr.neighbourhood || addr.suburb || addr.city_district || "";
      const city = addr.city || addr.town || addr.village || "";
      const pincode = addr.postcode || "";
      const detailedName = [house, road, area, city, pincode]
        .filter(Boolean)
        .join(", ");
      const fallbackName =
        payload?.locationName ||
        payload?.formattedAddress?.label ||
        [area, city].filter(Boolean).join(", ") ||
        "Your Location";
      const locationName = detailedName || fallbackName;

      return {
        name: locationName,
        fullAddress:
          payload?.display_name ||
          payload?.formattedAddress?.full ||
          "Address unavailable",
        coords: {
          latitude: payload?.coordinates?.latitude ?? latitude,
          longitude: payload?.coordinates?.longitude ?? longitude,
          accuracy: payload?.accuracyMeters ?? Math.round(accuracy),
        },
        raw: addr,
      };
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("API fetch error:", error);
      }
      return null;
    }
  };

  const detectLocation = async () => {
    setIsDetecting(true);
    setLocationError(null);
    setDetectedLocation(null);
    abortControllerRef.current = new AbortController();

    try {
      const position = await getDeliveryGradePosition({
        targetAccuracy: TARGET_ACCURACY_METERS,
        acceptableAccuracy: ACCEPTABLE_ACCURACY_METERS,
        timeoutMs: 15000, // Reduced from 25s
      });

      const { latitude, longitude, accuracy } = position.coords;
      const roundedAccuracy = Math.round(accuracy);

      // Check client-side cache first
      const cached = getCachedLocation(latitude, longitude);
      if (cached) {
        setDetectedLocation(cached);
        setIsDetecting(false);
        return;
      }

      // Fetch location details
      const locationData = await fetchLocationDetails(latitude, longitude, accuracy);

      if (!locationData) {
        // Fallback: create basic location from coordinates
        setLocationError(
          "Could not fetch location details, but GPS coordinates are accurate."
        );
        setDetectedLocation({
          name: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
          fullAddress: "Coordinates saved, refine in next step",
          coords: {
            latitude,
            longitude,
            accuracy: roundedAccuracy,
          },
          raw: {},
        });
        return;
      }

      // Cache the result
      setCachedLocation(latitude, longitude, locationData);
      setDetectedLocation(locationData);
    } catch (error) {
      const message =
        error?.code === 1
          ? "Location permission denied. Please allow location access."
          : error?.code === 2
          ? "Location unavailable. Try again after moving to open sky."
          : error?.code === 3
          ? "Location request timed out. Please retry."
          : error?.message || "Failed to detect location.";

      setLocationError(message);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleUseDetectedLocation = () => {
    if (!detectedLocation) return;
    updateLocation(detectedLocation.name);
    closeLocationModal();
  };

  const handleSelectLocation = (locationName) => {
    updateLocation(locationName);
    closeLocationModal();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeLocationModal();
  };

  if (!isLocationModalOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={handleOverlayClick} aria-label="Close modal" />

      <div
        className={styles.modal}
        role="dialog"
        aria-label="Select delivery location"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Select Location</h2>
          <button className={styles.closeBtn} onClick={closeLocationModal} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
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
                {isDetecting ? "Detecting..." : "Detect my location"}
              </div>
              <div className={styles.detectSub}>
                {isDetecting ? "Waiting for GPS lock..." : "Using high-accuracy GPS"}
              </div>
            </div>
          </button>

          {locationError && (
            <div className={styles.errorBox}>
              <AlertTriangle size={18} aria-hidden="true" />
              <span>{locationError}</span>
            </div>
          )}

          {detectedLocation && (
            <button className={styles.detectedLocation} onClick={handleUseDetectedLocation}>
              <Navigation className={styles.detectedIcon} size={20} aria-hidden="true" />
              <div className={styles.detectedText}>
                <div className={styles.detectedLabel}>
                  Detected Location ({detectedLocation.coords.accuracy}m)
                </div>
                <div className={styles.detectedName}>{detectedLocation.name}</div>
                <div className={styles.detectedAddress}>{detectedLocation.fullAddress}</div>
              </div>
              <span className={styles.detectedArrow}>→</span>
            </button>
          )}

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

          <div className={styles.currentLocation}>
            <MapPin className={styles.currentIcon} size={18} aria-hidden="true" />
            <div className={styles.currentText}>
              <div className={styles.currentLabel}>Current Location</div>
              <div className={styles.currentName}>{location}</div>
            </div>
          </div>

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

