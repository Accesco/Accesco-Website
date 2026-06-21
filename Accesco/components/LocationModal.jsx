"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "./LocationModal.module.css";

// Dynamically import map to avoid SSR issues
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "300px", background: "#eee" }}>
      Loading Map...
    </div>
  ),
});

export default function LocationModal({ isOpen, onClose, onLocationSelect }) {
  const [address, setAddress] = useState("Detecting location...");
  const [coordinates, setCoordinates] = useState({
    lat: 20.5937,
    lng: 78.9629,
  }); // Default India center
  const [manualInput, setManualInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) detectLocation();
  }, [isOpen]);

  const fetchAddressFromCoords = async (lat, lng) => {
    setLoading(true);
    setAddress("Fetching address details...");
    try {
      const res = await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });
      const data = await res.json();
      if (res.ok) {
        setAddress(data.formattedAddress || data.displayAddress);
        setError("");
      } else {
        setError("Failed to fetch address details.");
        setAddress("Location not found");
      }
    } catch (err) {
      setError("Network error.");
      setAddress("Location not found");
    }
    setLoading(false);
  };

  const detectLocation = () => {
    setError("");
    setLoading(true);
    setAddress("Detecting location...");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setAddress("Unsupported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        fetchAddressFromCoords(latitude, longitude);
      },
      (err) => {
        let errMsg = "Permission denied. Please enter manually.";
        if (err.code === err.TIMEOUT) errMsg = "Location request timed out. Try manually.";
        if (err.code === err.POSITION_UNAVAILABLE) errMsg = "Location information is unavailable.";

        setError(errMsg);
        setAddress("Detection failed");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualInput) return;

    setLoading(true);
    setError("");
    setAddress("Searching...");

    try {
      const res = await fetch("/api/location/forward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: manualInput }),
      });

      const data = await res.json();
      if (res.ok) {
        setCoordinates({ lat: data.latitude, lng: data.longitude });
        setAddress(data.formattedAddress || manualInput);
      } else {
        setError("Could not parse the location. Please try another term or drag the pin.");
        setAddress("Search failed");
      }
    } catch (err) {
      setError("Network error during search.");
      setAddress("Search failed");
    }
    setLoading(false);
  };

  const handleDragLocation = (lat, lng) => {
    setCoordinates({ lat, lng });
    fetchAddressFromCoords(lat, lng);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Select Location</h3>
          <button onClick={onClose} className={styles.closeBtn}>&times;</button>
        </div>

        <button
          onClick={detectLocation}
          className={styles.detectBtn}
          disabled={loading}
        >
          Detect my location
        </button>

        <form onSubmit={handleManualSubmit} className={styles.manualForm}>
          <input
            type="text"
            placeholder="Or type your address manually..."
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
          />
          <button type="submit" disabled={loading} className="bg-red-500">
            Search
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.mapContainer}>
          <Map center={coordinates} onLocationChange={handleDragLocation} />
        </div>

        <div className={styles.addressDisplay}>
          <strong>Detected Location:</strong>
          <p>{loading ? "Updating..." : address}</p>
        </div>

        <button
          className={styles.confirmBtn}
          onClick={() => {
            onLocationSelect({
              fullAddress: address,
              lat: coordinates.lat,
              lng: coordinates.lng,
            });
            onClose();
          }}
          disabled={loading || !!error}
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
}