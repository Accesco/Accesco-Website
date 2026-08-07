"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./LocationModal.module.css";
import { useAuth } from "@/app/components/AuthProvider";
import { fetchSavedAddresses, createAddress, updateAddress, deleteAddress, selectAddress } from "@/lib/addressService";

/* -------------------------------------------------------------------------- */
/*                                   MAP                                      */
/* -------------------------------------------------------------------------- */

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "200px",
        background: "#eeeeee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Loading Map...
    </div>
  ),
});

/* -------------------------------------------------------------------------- */
/*                                 CONSTANTS                                  */
/* -------------------------------------------------------------------------- */

const SAVED_ADDRESSES_KEY = "savedAddresses";

const DEFAULT_COORDINATES = {
  lat: 12.9716,
  lng: 77.5946,
};

const EMPTY_MANUAL_ADDRESS = {
  houseNo: "",
  building: "",
  area: "",
  city: "Bengaluru",
  pincode: "",
};

const DEFAULT_SAVED_ADDRESSES = [
  {
    id: "home",
    type: "Home",
    tag: "Selected",
    displayAddress:
      "S4 (second floor), kutira building (lakshmi mansion), 127, 4th Main Rd, K...",
    fullAddress:
      "S4 (second floor), kutira building (lakshmi mansion), 127, 4th Main Rd, Kalyan Nagar, Bengaluru, Karnataka 560043",
    lat: 13.0234,
    lng: 77.6394,
    icon: "home",
  },
  {
    id: "adrisha",
    type: "Adrisha Saha",
    tag: "",
    displayAddress:
      "staytats housing room no 205, 3a, Ray St, Sreepally, Bhowanipore, Kolkata, W...",
    fullAddress:
      "staytats housing room no 205, 3a, Ray St, Sreepally, Bhowanipore, Kolkata, West Bengal 700020",
    lat: 22.5385,
    lng: 88.3496,
    icon: "pin",
  },
  {
    id: "other",
    type: "Other",
    tag: "",
    displayAddress:
      "141-B, Second Floor (S4), 5th main road, 141/B, 5th Main Rd, Jaladarsini Layout,...",
    fullAddress:
      "141-B, Second Floor (S4), 5th main road, 141/B, 5th Main Rd, Jaladarsini Layout, Bengaluru, Karnataka 560094",
    lat: 13.0365,
    lng: 77.5812,
    icon: "pin",
  },
];

/* -------------------------------------------------------------------------- */
/*                                 HELPERS                                    */
/* -------------------------------------------------------------------------- */

const shortenAddress = (value, limit = 100) => {
  if (!value) return "";

  return value.length > limit
    ? `${value.slice(0, limit).trim()}...`
    : value;
};

const normalizeStoredAddress = (item, index) => {
  const fullAddress =
    item.fullAddress ||
    item.address ||
    item.displayAddress ||
    "";

  return {
    id: item.id || `saved-${index}-${Date.now()}`,
    type: item.type || item.label || "Other",
    tag: item.tag || "",
    displayAddress:
      item.displayAddress || shortenAddress(fullAddress),
    fullAddress,
    lat: Number(
      item.lat ??
        item.latitude ??
        DEFAULT_COORDINATES.lat
    ),
    lng: Number(
      item.lng ??
        item.lon ??
        item.longitude ??
        DEFAULT_COORDINATES.lng
    ),
    icon:
      item.icon ||
      (item.type === "Home" || item.label === "Home"
        ? "home"
        : "pin"),
  };
};

/* -------------------------------------------------------------------------- */
/*                                  ICONS                                     */
/* -------------------------------------------------------------------------- */

function BackIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line
        x1="21"
        y1="21"
        x2="16.65"
        y2="16.65"
      />
    </svg>
  );
}

function CurrentLocationIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#c2185b"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#c2185b"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#c2185b"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.148-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.009-.372-.011-.57-.011-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.004 21.785h-.004a9.72 9.72 0 0 1-4.956-1.359l-.355-.211-3.686.966.984-3.595-.231-.369a9.72 9.72 0 0 1-1.492-5.194c.002-5.374 4.374-9.746 9.75-9.746a9.68 9.68 0 0 1 6.9 2.859 9.68 9.68 0 0 1 2.853 6.903c-.002 5.374-4.374 9.746-9.763 9.746M20.52 3.449A11.9 11.9 0 0 0 12.014 0C5.392 0 .005 5.387.003 12.01a11.94 11.94 0 0 0 1.604 5.987L0 24l6.335-1.661A11.98 11.98 0 0 0 12.009 23.8h.005c6.622 0 12.009-5.387 12.011-12.011a11.9 11.9 0 0 0-3.505-8.34"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function LocationModal({
  isOpen,
  onClose,
  onLocationSelect,
}) {
  const { user, getIdToken } = useAuth?.() || {};
  const [view, setView] = useState("list");
  const [mapPurpose, setMapPurpose] = useState("current");

  const [address, setAddress] = useState(
    "Detecting location..."
  );

  const [coordinates, setCoordinates] = useState(
    DEFAULT_COORDINATES
  );

  const [manualInput, setManualInput] = useState("");

  const [manualAddressData, setManualAddressData] =
    useState(EMPTY_MANUAL_ADDRESS);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState(
    DEFAULT_SAVED_ADDRESSES
  );

  const [selectedAddressId, setSelectedAddressId] =
    useState("home");

  const [openMenuId, setOpenMenuId] = useState(null);

  const [editingAddressId, setEditingAddressId] =
    useState(null);

  /* ------------------------------------------------------------------------ */
  /*                              LOCAL STORAGE                               */
  /* ------------------------------------------------------------------------ */

  const persistSavedAddresses = (addressesToSave) => {
    setSavedAddresses(addressesToSave);

    try {
      localStorage.setItem(
        SAVED_ADDRESSES_KEY,
        JSON.stringify(addressesToSave)
      );
    } catch (storageError) {
      console.error(
        "Could not save addresses:",
        storageError
      );
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setView("list");
      setOpenMenuId(null);
      setEditingAddressId(null);
      setError("");
      return;
    }

    const loadAddresses = async () => {
      setLoading(true);
      if (user) {
        const { addresses, error } = await fetchSavedAddresses(getIdToken, user.uid);
        if (!error && addresses) {
          const normalizedAddresses = addresses.map(normalizeStoredAddress);
          setSavedAddresses(normalizedAddresses);
          const selected = normalizedAddresses.find((item) => item.isDefault || item.tag === "Selected");
          setSelectedAddressId(selected?.id || (normalizedAddresses.length > 0 ? normalizedAddresses[0].id : ""));
          setLoading(false);
          return;
        }
      }
      
      try {
        const storedValue = localStorage.getItem(SAVED_ADDRESSES_KEY);
        if (!storedValue) {
          setSavedAddresses(user ? [] : DEFAULT_SAVED_ADDRESSES);
          if (!user) {
            localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(DEFAULT_SAVED_ADDRESSES));
            setSelectedAddressId("home");
          } else {
            setSelectedAddressId("");
          }
          setLoading(false);
          return;
        }
        
        const parsedValue = JSON.parse(storedValue);
        if (!Array.isArray(parsedValue)) {
          setSavedAddresses(user ? [] : DEFAULT_SAVED_ADDRESSES);
          setSelectedAddressId("home");
          setLoading(false);
          return;
        }
        
        const normalizedAddresses = parsedValue.map(normalizeStoredAddress);
        setSavedAddresses(normalizedAddresses);
        const selected = normalizedAddresses.find((item) => item.tag === "Selected");
        setSelectedAddressId(selected?.id || normalizedAddresses[0]?.id || "");
      } catch (storageError) {
        console.error("Could not load saved addresses:", storageError);
        setSavedAddresses(user ? [] : DEFAULT_SAVED_ADDRESSES);
        setSelectedAddressId("home");
      }
      setLoading(false);
    };

    loadAddresses();
  }, [isOpen, user]);

  useEffect(() => {
    if (!openMenuId) return undefined;

    const closeMenu = () => {
      setOpenMenuId(null);
    };

    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, [openMenuId]);

  /* ------------------------------------------------------------------------ */
  /*                             LOCATION METHODS                             */
  /* ------------------------------------------------------------------------ */

  const fetchAddressFromCoords = async (lat, lng) => {
    setLoading(true);
    setAddress("Fetching address details...");

    try {
      const response = await fetch("/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to fetch address details."
        );
      }

      setAddress(
        data.formattedAddress ||
          data.displayAddress ||
          "Location selected"
      );

      setError("");
    } catch (requestError) {
      console.error(requestError);
      setError("Failed to fetch address details.");
      setAddress("Location not found");
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    setError("");
    setLoading(true);
    setAddress("Detecting location...");
    setMapPurpose("current");

    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser."
      );
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } =
          position.coords;

        setCoordinates({
          lat: latitude,
          lng: longitude,
        });

        setView("map");

        fetchAddressFromCoords(
          latitude,
          longitude
        );
      },
      (geolocationError) => {
        let errorMessage =
          "Permission denied. Please search manually.";

        if (
          geolocationError.code ===
          geolocationError.TIMEOUT
        ) {
          errorMessage =
            "Location request timed out.";
        }

        if (
          geolocationError.code ===
          geolocationError.POSITION_UNAVAILABLE
        ) {
          errorMessage =
            "Location information is unavailable.";
        }

        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setOpenMenuId(null);
    setError("");
    setMapPurpose("add");
    setView("map");

    fetchAddressFromCoords(
      coordinates.lat,
      coordinates.lng
    );
  };

  const handleManualSubmit = async (event) => {
    event.preventDefault();

    const searchValue = manualInput.trim();

    if (!searchValue) return;

    setLoading(true);
    setError("");
    setMapPurpose("add");

    try {
      const response = await fetch(
        "/api/location/forward",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: searchValue,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Could not find the location."
        );
      }

      const latitude = Number(data.latitude);
      const longitude = Number(data.longitude);

      setCoordinates({
        lat: latitude,
        lng: longitude,
      });

      setAddress(
        data.formattedAddress || searchValue
      );

      setView("map");
    } catch (requestError) {
      console.error(requestError);

      setError(
        "Could not find location. Please try another search."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDragLocation = (lat, lng) => {
    setCoordinates({ lat, lng });
    fetchAddressFromCoords(lat, lng);
  };

  /* ------------------------------------------------------------------------ */
  /*                           SAVED ADDRESS METHODS                          */
  /* ------------------------------------------------------------------------ */

  const handleSelectSavedAddress = (
    selectedAddress
  ) => {
    const updatedAddresses = savedAddresses.map(
      (item) => ({
        ...item,
        tag:
          item.id === selectedAddress.id
            ? "Selected"
            : "",
      })
    );

    setSelectedAddressId(selectedAddress.id);
    persistSavedAddresses(updatedAddresses);
    setOpenMenuId(null);

    onLocationSelect?.({
      fullAddress: selectedAddress.fullAddress,
      lat: selectedAddress.lat,
      lng: selectedAddress.lng,
    });

    onClose();
  };

  const handleShareAddress = async (
    addressToShare
  ) => {
    const shareText = `${addressToShare.type}: ${addressToShare.fullAddress}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${addressToShare.type} address`,
          text: shareText,
        });

        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(
          shareText
        );

        window.alert(
          "Address copied to clipboard."
        );

        return;
      }

      window.prompt(
        "Copy this address:",
        shareText
      );
    } catch (shareError) {
      if (shareError?.name !== "AbortError") {
        console.error(
          "Could not share address:",
          shareError
        );
      }
    }
  };

  const handleRenameAddress = (
    addressToRename
  ) => {
    const newName = window.prompt(
      "Rename address",
      addressToRename.type
    );

    if (newName === null) {
      return;
    }

    const trimmedName = newName.trim();

    if (!trimmedName) {
      window.alert(
        "Address name cannot be empty."
      );
      return;
    }

    if (trimmedName.length > 30) {
      window.alert(
        "Address name must be 30 characters or less."
      );
      return;
    }

    const alreadyExists = savedAddresses.some(
      (item) =>
        item.id !== addressToRename.id &&
        item.type.toLowerCase() ===
          trimmedName.toLowerCase()
    );

    if (alreadyExists) {
      window.alert(
        "An address with this name already exists."
      );
      return;
    }

    const updatedAddresses = savedAddresses.map(
      (item) =>
        item.id === addressToRename.id
          ? {
              ...item,
              type: trimmedName,
            }
          : item
    );

    persistSavedAddresses(updatedAddresses);
    setOpenMenuId(null);
  };

  const handleEditAddress = (
    addressToEdit
  ) => {
    const pincodeMatch =
      addressToEdit.fullAddress.match(/\b\d{6}\b/);

    const addressWithoutPincode =
      addressToEdit.fullAddress
        .replace(pincodeMatch?.[0] || "", "")
        .replace(/,\s*$/, "");

    const parts = addressWithoutPincode
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    const city =
      parts.length >= 2
        ? parts[parts.length - 2]
        : parts[parts.length - 1] || "";

    const area =
      parts.slice(2, -2).join(", ") ||
      parts.slice(2, -1).join(", ");

    setManualAddressData({
      houseNo: parts[0] || "",
      building: parts[1] || "",
      area,
      city,
      pincode: pincodeMatch?.[0] || "",
    });

    setCoordinates({
      lat: addressToEdit.lat,
      lng: addressToEdit.lng,
    });

    setEditingAddressId(addressToEdit.id);
    setOpenMenuId(null);
    setView("manual");
  };

  const handleDeleteAddress = (addressId) => {
    const addressToDelete = savedAddresses.find(
      (item) => item.id === addressId
    );

    const confirmed = window.confirm(
      `Delete ${
        addressToDelete?.type || "this"
      } address?`
    );

    if (!confirmed) return;

    let updatedAddresses = savedAddresses.filter(
      (item) => item.id !== addressId
    );

    if (selectedAddressId === addressId) {
      updatedAddresses = updatedAddresses.map(
        (item, index) => ({
          ...item,
          tag: index === 0 ? "Selected" : "",
        })
      );

      const nextSelectedAddress =
        updatedAddresses[0];

      setSelectedAddressId(
        nextSelectedAddress?.id || ""
      );

      if (nextSelectedAddress) {
        onLocationSelect?.({
          fullAddress:
            nextSelectedAddress.fullAddress,
          lat: nextSelectedAddress.lat,
          lng: nextSelectedAddress.lng,
        });
      }
    }

    persistSavedAddresses(updatedAddresses);
    setOpenMenuId(null);
  };

  /* ------------------------------------------------------------------------ */
  /*                              MANUAL ADDRESS                              */
  /* ------------------------------------------------------------------------ */

  const resetManualAddressForm = () => {
    setManualAddressData({
      ...EMPTY_MANUAL_ADDRESS,
    });

    setEditingAddressId(null);
  };

  const handleManualFormSubmit = (event) => {
    event.preventDefault();

    const {
      houseNo,
      building,
      area,
      city,
      pincode,
    } = manualAddressData;

    const constructedParts = [
      houseNo.trim(),
      building.trim(),
      area.trim(),
      city.trim(),
      pincode.trim(),
    ].filter(Boolean);

    const fullManualAddress =
      constructedParts.join(", ");

    if (!fullManualAddress) return;

    if (editingAddressId) {
      const updatedAddresses =
        savedAddresses.map((item) =>
          item.id === editingAddressId
            ? {
                ...item,
                displayAddress:
                  shortenAddress(
                    fullManualAddress
                  ),
                fullAddress:
                  fullManualAddress,
                lat: coordinates.lat,
                lng: coordinates.lng,
              }
            : item
        );

      persistSavedAddresses(updatedAddresses);

      if (
        selectedAddressId === editingAddressId
      ) {
        onLocationSelect?.({
          fullAddress: fullManualAddress,
          lat: coordinates.lat,
          lng: coordinates.lng,
        });
      }

      resetManualAddressForm();
      setView("list");
      return;
    }

    const newAddress = {
      id: `address-${Date.now()}`,
      type: "Other",
      tag: "Selected",
      displayAddress:
        shortenAddress(fullManualAddress),
      fullAddress: fullManualAddress,
      lat: coordinates.lat,
      lng: coordinates.lng,
      icon: "pin",
    };

    const updatedAddresses = [
      ...savedAddresses.map((item) => ({
        ...item,
        tag: "",
      })),
      newAddress,
    ];

    setSelectedAddressId(newAddress.id);
    persistSavedAddresses(updatedAddresses);

    onLocationSelect?.({
      fullAddress: newAddress.fullAddress,
      lat: newAddress.lat,
      lng: newAddress.lng,
    });

    resetManualAddressForm();
    onClose();
  };

  /* ------------------------------------------------------------------------ */
  /*                             MAP CONFIRMATION                             */
  /* ------------------------------------------------------------------------ */

  const handleConfirmMapLocation = () => {
    if (
      !address ||
      address === "Location not found"
    ) {
      return;
    }

    if (mapPurpose === "add") {
      const newAddress = {
        id: `address-${Date.now()}`,
        type: "Other",
        tag: "Selected",
        displayAddress: shortenAddress(address),
        fullAddress: address,
        lat: coordinates.lat,
        lng: coordinates.lng,
        icon: "pin",
      };

      const updatedAddresses = [
        ...savedAddresses.map((item) => ({
          ...item,
          tag: "",
        })),
        newAddress,
      ];

      setSelectedAddressId(newAddress.id);
      persistSavedAddresses(updatedAddresses);
    }

    onLocationSelect?.({
      fullAddress: address,
      lat: coordinates.lat,
      lng: coordinates.lng,
    });

    onClose();
  };

  /* ------------------------------------------------------------------------ */
  /*                               OTHER METHODS                              */
  /* ------------------------------------------------------------------------ */

  const handleRequestAddressFromFriend = () => {
    const shareText =
      "Hey! Please share your address with me so I can set it on Accesco.";

    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(
        shareText
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleBackAction = () => {
    setOpenMenuId(null);

    if (view === "manual") {
      resetManualAddressForm();
      setView("list");
      return;
    }

    if (view === "map") {
      setView("list");
      setError("");
      return;
    }

    onClose();
  };

  if (!isOpen) return null;

  const headerTitle =
    view === "manual" && editingAddressId
      ? "Edit Address"
      : view === "map"
      ? "Confirm Location"
      : "Select Location";

  /* ------------------------------------------------------------------------ */
  /*                                   JSX                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={`${styles.modal} ${
          view === "map" ? styles.mapModal : ""
        }`}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className={styles.header}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={handleBackAction}
            aria-label="Go back or close"
          >
            <BackIcon />
          </button>

          <h3>{headerTitle}</h3>
        </div>

        {view === "list" ? (
          <div className={styles.listViewContent}>
            <form
              onSubmit={handleManualSubmit}
              className={styles.searchContainer}
            >
              <span className={styles.searchIcon}>
                <SearchIcon />
              </span>

              <input
                type="text"
                placeholder="Search Address"
                value={manualInput}
                onChange={(event) =>
                  setManualInput(event.target.value)
                }
                className={styles.searchInput}
              />
            </form>

            <div className={styles.optionsList}>
              <button
                type="button"
                onClick={detectLocation}
                className={styles.optionItem}
                disabled={loading}
              >
                <span className={styles.optionIcon}>
                  <CurrentLocationIcon />
                </span>

                <span
                  className={`${styles.optionText} ${styles.optionTextPink}`}
                >
                  Use my Current Location
                </span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddAddress}
                className={styles.optionItem}
              >
                <span className={styles.optionIcon}>
                  <PlusIcon />
                </span>

                <span
                  className={`${styles.optionText} ${styles.optionTextPink}`}
                >
                  Add New Address
                </span>

                <span className={styles.optionChevron}>
                  <ChevronIcon />
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  resetManualAddressForm();
                  setView("manual");
                }}
                className={styles.optionItem}
              >
                <span className={styles.optionIcon}>
                  <EditIcon />
                </span>

                <span
                  className={`${styles.optionText} ${styles.optionTextPink}`}
                >
                  Enter Location Manually
                </span>

                <span className={styles.optionChevron}>
                  <ChevronIcon />
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleRequestAddressFromFriend}
              className={styles.friendAddressCard}
            >
              <span
                className={styles.friendAddressIcon}
              >
                <WhatsAppIcon />
              </span>

              <span
                className={styles.friendAddressText}
              >
                Request address from friend
              </span>

              <span
                className={
                  styles.friendAddressChevron
                }
              >
                <ChevronIcon />
              </span>
            </button>

            <h4 className={styles.sectionTitle}>
              Saved Addresses
            </h4>

            <div
              className={styles.savedAddressesCard}
            >
              {savedAddresses.length === 0 ? (
                <p
                  style={{
                    padding: "18px",
                    margin: 0,
                    color: "#64748b",
                    fontSize: "0.85rem",
                  }}
                >
                  No saved addresses yet.
                </p>
              ) : (
                savedAddresses.map(
                  (savedAddress, index) => (
                    <div
                      key={savedAddress.id}
                      className={
                        styles.addressRowContainer
                      }
                    >
                      <div
                        className={`${styles.addressItem} ${
                          selectedAddressId ===
                          savedAddress.id
                            ? styles.addressItemActive
                            : ""
                        }`}
                        onClick={() =>
                          handleSelectSavedAddress(
                            savedAddress
                          )
                        }
                      >
                        <span
                          className={styles.addressIcon}
                        >
                          {savedAddress.icon ===
                          "home" ? (
                            <HomeIcon />
                          ) : (
                            <PinIcon />
                          )}
                        </span>

                        <div
                          className={
                            styles.addressDetails
                          }
                        >
                          <div
                            className={
                              styles.addressTypeHeader
                            }
                          >
                            <span
                              className={
                                styles.addressType
                              }
                            >
                              {savedAddress.type}
                            </span>

                            {selectedAddressId ===
                              savedAddress.id && (
                              <span
                                className={
                                  styles.badgeSelected
                                }
                              >
                                Selected
                              </span>
                            )}
                          </div>

                          <p
                            className={
                              styles.addressText
                            }
                          >
                            {
                              savedAddress.displayAddress
                            }
                          </p>
                        </div>

                        <div
                          className={
                            styles.addressActions
                          }
                        >
                          <button
                            type="button"
                            className={styles.actionBtn}
                            onClick={(event) => {
                              event.stopPropagation();

                              handleShareAddress(
                                savedAddress
                              );
                            }}
                            aria-label={`Share ${savedAddress.type} address`}
                            title="Share address"
                          >
                            <ShareIcon />
                          </button>

                          <button
                            type="button"
                            className={styles.actionBtn}
                            onClick={(event) => {
                              event.stopPropagation();

                              setOpenMenuId(
                                (currentId) =>
                                  currentId ===
                                  savedAddress.id
                                    ? null
                                    : savedAddress.id
                              );
                            }}
                            aria-label={`More options for ${savedAddress.type}`}
                            aria-expanded={
                              openMenuId ===
                              savedAddress.id
                            }
                            title="More options"
                          >
                            <MoreIcon />
                          </button>

                          {openMenuId ===
                            savedAddress.id && (
                            <div
                              className={`${styles.addressMenu} ${
                                index ===
                                savedAddresses.length -
                                  1
                                  ? styles.addressMenuUp
                                  : ""
                              }`}
                              onClick={(event) =>
                                event.stopPropagation()
                              }
                            >
                              <button
                                type="button"
                                className={
                                  styles.addressMenuItem
                                }
                                onClick={() =>
                                  handleSelectSavedAddress(
                                    savedAddress
                                  )
                                }
                              >
                                Use this address
                              </button>

                              <button
                                type="button"
                                className={
                                  styles.addressMenuItem
                                }
                                onClick={() =>
                                  handleEditAddress(
                                    savedAddress
                                  )
                                }
                              >
                                Edit address
                              </button>

                              <button
                                type="button"
                                className={
                                  styles.addressMenuItem
                                }
                                onClick={() =>
                                  handleRenameAddress(
                                    savedAddress
                                  )
                                }
                              >
                                Rename address
                              </button>

                              <button
                                type="button"
                                className={`${styles.addressMenuItem} ${styles.deleteMenuItem}`}
                                onClick={() =>
                                  handleDeleteAddress(
                                    savedAddress.id
                                  )
                                }
                              >
                                Delete address
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {index <
                        savedAddresses.length - 1 && (
                        <div
                          className={
                            styles.dashedDivider
                          }
                        />
                      )}
                    </div>
                  )
                )
              )}
            </div>
          </div>
        ) : view === "manual" ? (
          <div
            className={styles.manualFormViewContent}
          >
            <form
              onSubmit={handleManualFormSubmit}
              className={styles.manualAddressForm}
            >
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Flat / House No. / Floor
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. S4, Second Floor"
                  value={manualAddressData.houseNo}
                  onChange={(event) =>
                    setManualAddressData({
                      ...manualAddressData,
                      houseNo: event.target.value,
                    })
                  }
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Building / Apartment name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Kutira Building"
                  value={manualAddressData.building}
                  onChange={(event) =>
                    setManualAddressData({
                      ...manualAddressData,
                      building: event.target.value,
                    })
                  }
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Area / Locality / Street
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. 4th Main Road"
                  value={manualAddressData.area}
                  onChange={(event) =>
                    setManualAddressData({
                      ...manualAddressData,
                      area: event.target.value,
                    })
                  }
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formRow}>
                <div
                  className={styles.formGroup}
                  style={{ flex: 1.3 }}
                >
                  <label className={styles.formLabel}>
                    City
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="e.g. Bengaluru"
                    value={manualAddressData.city}
                    onChange={(event) =>
                      setManualAddressData({
                        ...manualAddressData,
                        city: event.target.value,
                      })
                    }
                    className={styles.formInput}
                  />
                </div>

                <div
                  className={styles.formGroup}
                  style={{ flex: 1 }}
                >
                  <label className={styles.formLabel}>
                    Pincode
                  </label>

                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="e.g. 560043"
                    value={manualAddressData.pincode}
                    onChange={(event) =>
                      setManualAddressData({
                        ...manualAddressData,
                        pincode:
                          event.target.value.replace(
                            /\D/g,
                            ""
                          ),
                      })
                    }
                    className={styles.formInput}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={styles.confirmBtn}
                style={{
                  margin: "16px 0 0",
                  width: "100%",
                }}
              >
                {editingAddressId
                  ? "Save Changes"
                  : "Confirm Manual Address"}
              </button>
            </form>
          </div>
        ) : (
          <div className={styles.mapViewContent}>
            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <div className={styles.mapContainer}>
              <Map
                center={coordinates}
                onLocationChange={
                  handleDragLocation
                }
              />
            </div>

            <div className={styles.addressDisplay}>
              <strong>Detected Location:</strong>

              <p>
                {loading
                  ? "Updating..."
                  : address}
              </p>
            </div>

            <button
              type="button"
              className={styles.confirmBtn}
              onClick={handleConfirmMapLocation}
              disabled={
                loading || Boolean(error)
              }
            >
              Confirm Location
            </button>
          </div>
        )}
      </div>
    </div>
  );
}