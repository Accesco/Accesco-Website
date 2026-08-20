/**
 * LocationModal Component - Delivery-grade geolocation with <=50m target.
 * Optimized for fast response times with smart geolocation strategy.
 */

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/app/components/AuthProvider";
import { updateUserFieldsInFirebase } from "@/lib/userService";
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

// Dynamically import Map to prevent Next.js SSR errors with Leaflet
const Map = dynamic(() => import('./Map'), { 
  ssr: false, 
  loading: () => <div className={styles.mapLoading}>Loading Map...</div> 
});

const TARGET_ACCURACY_METERS = 50;
const ACCEPTABLE_ACCURACY_METERS = 100;
const CLIENT_CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// Replace the existing locationCache Map and its helper functions with this:

const locationCache = {};

function getCachedLocation(latitude, longitude) {
  const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  const cached = locationCache[key];
  
  if (cached && Date.now() - cached.timestamp < CLIENT_CACHE_DURATION_MS) {
    const cachedAccuracy = Number(cached?.data?.coords?.accuracy);
    if (Number.isFinite(cachedAccuracy) && cachedAccuracy <= ACCEPTABLE_ACCURACY_METERS) {
      return cached.data;
    }
    delete locationCache[key];
    return null;
  }
  
  if (cached) {
    delete locationCache[key];
  }
  
  return null;
}

function setCachedLocation(latitude, longitude, data) {
  const accuracy = Number(data?.coords?.accuracy);
  if (!Number.isFinite(accuracy) || accuracy > ACCEPTABLE_ACCURACY_METERS) {
    return;
  }
  const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  locationCache[key] = {
    data,
    timestamp: Date.now(),
  };
}


function getDeliveryGradePosition({
  targetAccuracy = TARGET_ACCURACY_METERS,
  acceptableAccuracy = ACCEPTABLE_ACCURACY_METERS,
   timeoutMs = 20000,
   maxAgeMs = 0,
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
    let acceptableTimeoutId = null;

    const finishSuccess = (position) => {
      if (finished) return;
      finished = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (timeoutId !== null) clearTimeout(timeoutId);
      if (acceptableTimeoutId !== null) clearTimeout(acceptableTimeoutId);
      resolve(position);
    };

    const finishError = (error) => {
      if (finished) return;
      finished = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (timeoutId !== null) clearTimeout(timeoutId);
      if (acceptableTimeoutId !== null) clearTimeout(acceptableTimeoutId);
      reject(error);
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const accuracy = Number(position?.coords?.accuracy);
        bestPosition = position;

        if (Number.isFinite(accuracy) && accuracy <= targetAccuracy) {
          finishSuccess(position);
          return;
        }

        if (Number.isFinite(accuracy) && accuracy <= acceptableAccuracy) {
          acceptableTimeoutId = setTimeout(() => {
            finishSuccess(bestPosition);
          }, 3000);
        }
      },
      () => {}, 
      { enableHighAccuracy: true, timeout: 5000, maximumAge: maxAgeMs }
    );

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentAccuracy = Number(position?.coords?.accuracy);
        const bestAccuracy = Number(bestPosition?.coords?.accuracy);

        if (!bestPosition || (Number.isFinite(currentAccuracy) && (!Number.isFinite(bestAccuracy) || currentAccuracy < bestAccuracy))) {
          bestPosition = position;
        }

        if (Number.isFinite(currentAccuracy) && currentAccuracy <= targetAccuracy) {
          finishSuccess(position);
        }
      },
      (error) => {
        if (!bestPosition) finishError(error);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: maxAgeMs }
    );

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
  const { location, updateLocation, isLocationModalOpen, closeLocationModal } = useGrokly();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 }); // Default Bangalore
  
  const abortControllerRef = useRef(null);
  const autoDetectAttemptedRef = useRef(false);

  useEffect(() => {
    return () => {
      try { abortControllerRef.current?.abort?.(); } catch (e) {}
    };
  }, []);

  const POPULAR_LOCATIONS = [
    { name: "Koramangala", area: "Bangalore", time: "11 mins", lat: 12.9352, lng: 77.6244 },
    { name: "Indiranagar", area: "Bangalore", time: "12 mins", lat: 12.9719, lng: 77.6412 },
    { name: "HSR Layout", area: "Bangalore", time: "13 mins", lat: 12.9128, lng: 77.6387 },
    { name: "Whitefield", area: "Bangalore", time: "15 mins", lat: 12.9698, lng: 77.7500 },
    { name: "Electronic City", area: "Bangalore", time: "18 mins", lat: 12.8452, lng: 77.6602 },
    { name: "Marathahalli", area: "Bangalore", time: "14 mins", lat: 12.9562, lng: 77.6970 },
    { name: "BTM Layout", area: "Bangalore", time: "12 mins", lat: 12.9166, lng: 77.6101 },
    { name: "Jayanagar", area: "Bangalore", time: "13 mins", lat: 12.9308, lng: 77.5838 },
    { name: "Bellandur", area: "Bangalore", time: "14 mins", lat: 12.9260, lng: 77.6762 },
    { name: "Sarjapur Road", area: "Bangalore", time: "16 mins", lat: 12.9174, lng: 77.6744 },
  ];

  const filteredLocations = POPULAR_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchLocationDetails = useCallback(async (latitude, longitude, accuracy) => {
    try {
      const response = await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude, accuracy }),
        signal: abortControllerRef.current?.signal,
      });

      let payload = null;
      try { payload = await response.json(); } catch (e) {}

      if (!response.ok) {
        setLocationError(payload?.message || payload?.error || "Location service returned an error.");
        return null;
      }

      const resolvedName = payload?.displayAddress || payload?.city || payload?.state || payload?.fullAddress || "Detected Location";
      const resolvedAddress = payload?.formattedAddress || payload?.fullAddress || payload?.displayAddress || "Address unavailable";

      return {
        name: resolvedName,
        fullAddress: resolvedAddress,
        coords: {
          latitude: payload?.latitude ?? latitude,
          longitude: payload?.longitude ?? longitude,
          accuracy: Math.round(accuracy),
        },
        raw: payload,
      };
    } catch (error) {
      if (error?.name !== "AbortError") {
        setLocationError("Failed to contact location service.");
      }
      return null;
    }
  }, []);

  const handleMapDrag = useCallback(async (lat, lng) => {
    setMapCenter({ lat, lng });
    setIsDetecting(true);
    setLocationError(null);
    const locationData = await fetchLocationDetails(lat, lng, 10); // Pass high accuracy for manual pin drop
    if (locationData) {
      setDetectedLocation(locationData);
    }
    setIsDetecting(false);
  }, [fetchLocationDetails]);

  const detectLocation = useCallback(async ({ autoSelect = false } = {}) => {
    if (typeof window !== "undefined" && !window.isSecureContext) {
      setLocationError("Geolocation requires a secure context (HTTPS or localhost).");
      return;
    }

    setIsDetecting(true);
    setLocationError(null);
    setDetectedLocation(null);
    abortControllerRef.current = new AbortController();

    try {
      const position = await getDeliveryGradePosition();
      const { latitude, longitude, accuracy } = position.coords;
      const roundedAccuracy = Math.round(accuracy);
      const hasFiniteAccuracy = Number.isFinite(roundedAccuracy);
      const isAccuracyAcceptable = !hasFiniteAccuracy || roundedAccuracy <= ACCEPTABLE_ACCURACY_METERS;

      setMapCenter({ lat: latitude, lng: longitude });

      if (hasFiniteAccuracy && roundedAccuracy > ACCEPTABLE_ACCURACY_METERS) {
        setLocationError(`GPS accuracy is ${roundedAccuracy}m. We'll still try to detect your area, but for best results move to open sky and retry.`);
      }

      const cached = getCachedLocation(latitude, longitude);
      if (cached) {
        setDetectedLocation(cached);
        if (autoSelect && isAccuracyAcceptable) {
          updateLocation(cached.name);
          closeLocationModal();
        }
        return;
      }

      const locationData = await fetchLocationDetails(latitude, longitude, accuracy);

      if (!locationData) return;

      setCachedLocation(latitude, longitude, locationData);
      setDetectedLocation(locationData);
      
      if (autoSelect && isAccuracyAcceptable) {
        updateLocation(locationData.name);
        closeLocationModal();
      }

      if (isAccuracyAcceptable) {
        const rawPayload = locationData?.raw || {};
        const locObj = {
          ...rawPayload,
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
          fullAddress: locationData.fullAddress,
          displayAddress: locationData.name,
          gpsAccuracyMeters: locationData.coords.accuracy,
          timestamp: new Date().toISOString(),
        };
        if (user?.uid) {
          updateUserFieldsInFirebase(user.uid, { selectedLocation: locObj }).catch((e) =>
            console.error("Failed to save location in Firestore:", e)
          );
        }
      }
    } catch (error) {
      if (error.code === 1 || error.message?.toLowerCase().includes("denied") || error.message?.toLowerCase().includes("permission")) {
        setLocationError("Location permission is denied. Please enable location for this site in your browser settings.");
      } else {
        setLocationError(error?.message || "Failed to detect location.");
      }
    } finally {
      setIsDetecting(false);
      abortControllerRef.current = null;
    }
  }, [closeLocationModal, fetchLocationDetails, updateLocation, user]);

  useEffect(() => {
    if (!isLocationModalOpen) {
      autoDetectAttemptedRef.current = false;
      return;
    }

    const parsed = userData?.selectedLocation;
    if (parsed) {
      const storedLatitude = parsed?.latitude ?? parsed?.lat;
      const storedLongitude = parsed?.longitude ?? parsed?.lon;
      
      if (storedLatitude && storedLongitude) {
        setMapCenter({ lat: Number(storedLatitude), lng: Number(storedLongitude) });
      }
    }

    if (autoDetectAttemptedRef.current) return;
    autoDetectAttemptedRef.current = true;
    detectLocation({ autoSelect: false });
  }, [detectLocation, isLocationModalOpen, userData]);

  const handleUseDetectedLocation = () => {
    if (!detectedLocation) return;
    const locObj = {
      displayAddress: detectedLocation.name,
      fullAddress: detectedLocation.fullAddress || detectedLocation.name,
      latitude: detectedLocation?.coords?.latitude,
      longitude: detectedLocation?.coords?.longitude,
      timestamp: new Date().toISOString(),
    };
    if (user?.uid) {
      updateUserFieldsInFirebase(user.uid, { selectedLocation: locObj }).catch((e) =>
        console.error("Failed to save location in Firestore:", e)
      );
    }
    updateLocation(detectedLocation.name);
    closeLocationModal();
  };

  const handleSelectLocation = (loc) => {
    setMapCenter({ lat: loc.lat, lng: loc.lng });
    const resolvedAddress = `${loc.name}, ${loc.area}, Karnataka, India`;
    setDetectedLocation({
      name: loc.name,
      fullAddress: resolvedAddress,
      coords: {
        latitude: loc.lat,
        longitude: loc.lng,
        accuracy: 50
      }
    });
  };

  if (!isLocationModalOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={closeLocationModal} aria-label="Close modal" />

      <div className={styles.modal} role="dialog" aria-label="Select delivery location" aria-modal="true">
        <div className={styles.header}>
          <h2 className={styles.title}>Select Location</h2>
          <button className={styles.closeBtn} onClick={closeLocationModal} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          {/* Left Pane: Detect and Popular Locations */}
          <div className={styles.leftPane}>
            <button
              className={styles.detectBtn}
              onClick={() => detectLocation({ autoSelect: false })}
              disabled={isDetecting}
            >
              {isDetecting ? (
                <Clock className={styles.detectIcon} size={20} />
              ) : (
                <Target className={styles.detectIcon} size={20} />
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
                <AlertTriangle size={18} />
                <span>{locationError}</span>
              </div>
            )}

            <div className={styles.searchBox}>
              <Search className={styles.searchIcon} size={18} />
              <input
                type="search"
                placeholder="Search popular areas..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <h3 className={styles.sectionTitle}>Popular Locations</h3>
            <div className={styles.locationsList}>
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc, index) => (
                  <button
                    key={index}
                    className={styles.locationItem}
                    onClick={() => handleSelectLocation(loc)}
                  >
                    <div className={styles.locationLeft}>
                      <MapPin className={styles.locationIcon} size={18} />
                      <div className={styles.locationInfo}>
                        <div className={styles.locationName}>{loc.name}</div>
                        <div className={styles.locationArea}>{loc.area}</div>
                      </div>
                    </div>
                    <div className={styles.locationTime}>
                      <Clock className={styles.timeIcon} size={13} />
                      <span>{loc.time}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className={styles.noResults}>
                  <Search size={32} />
                  <p>No locations found</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Pane: Map and Address Confirmation */}
          <div className={styles.rightPane}>
            <div className={styles.mapContainer}>
              <Map center={mapCenter} onLocationChange={handleMapDrag} />
            </div>

            {detectedLocation ? (
              <div className={styles.detectedLocation} onClick={handleUseDetectedLocation}>
                <Navigation className={styles.detectedIcon} size={20} />
                <div className={styles.detectedText}>
                  <div className={styles.detectedLabel}>
                    Confirm Location
                  </div>
                  <div className={styles.detectedName}>{detectedLocation.name}</div>
                  <div className={styles.detectedAddress}>{detectedLocation.fullAddress}</div>
                </div>
                <div className={styles.confirmBtnWrap}>
                  <span className={styles.confirmBtnText}>Confirm & Deliver</span>
                </div>
              </div>
            ) : (
              <div className={styles.mapInstructions}>
                <MapPin size={24} className={styles.instrIcon} />
                <div>
                  <div className={styles.instrTitle}>Pin Your Location</div>
                  <div className={styles.instrDesc}>Drag the map marker or select an area to pinpoint your exact doorstep.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}