/**
 * GOOGLE MAPS FRONTEND INTEGRATION - ESSENTIAL GUIDE
 *
 * USAGE FROM PARENT COMPONENT:
 * ======
 *
 * const mapRef = useRef<google.maps.Map | null>(null);
 *
 * <MapView
 *   initialCenter={{ lat: 40.7128, lng: -74.0060 }}
 *   initialZoom={15}
 *   onMapReady={(map) => {
 *     mapRef.current = map; // Store to control map from parent anytime, google map itself is in charge of the re-rendering, not react state.
 * </MapView>
 *
 * ======
 * Available Libraries and Core Features:
 * -------------------------------
 * 📍 MARKER (from `marker` library)
 * - Attaches to map using { map, position }
 * new google.maps.marker.AdvancedMarkerElement({
 *   map,
 *   position: { lat: 37.7749, lng: -122.4194 },
 *   title: "San Francisco",
 * });
 *
 * -------------------------------
 * 🏢 PLACES (from `places` library)
 * - Does not attach directly to map; use data with your map manually.
 * const place = new google.maps.places.Place({ id: PLACE_ID });
 * await place.fetchFields({ fields: ["displayName", "location"] });
 * map.setCenter(place.location);
 * new google.maps.marker.AdvancedMarkerElement({ map, position: place.location });
 *
 * -------------------------------
 * 🧭 GEOCODER (from `geocoding` library)
 * - Standalone service; manually apply results to map.
 * const geocoder = new google.maps.Geocoder();
 * geocoder.geocode({ address: "New York" }, (results, status) => {
 *   if (status === "OK" && results[0]) {
 *     map.setCenter(results[0].geometry.location);
 *     new google.maps.marker.AdvancedMarkerElement({
 *       map,
 *       position: results[0].geometry.location,
 *     });
 *   }
 * });
 *
 * -------------------------------
 * 📐 GEOMETRY (from `geometry` library)
 * - Pure utility functions; not attached to map.
 * const dist = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
 *
 * -------------------------------
 * 🛣️ ROUTES (from `routes` library)
 * - Combines DirectionsService (standalone) + DirectionsRenderer (map-attached)
 * const directionsService = new google.maps.DirectionsService();
 * const directionsRenderer = new google.maps.DirectionsRenderer({ map });
 * directionsService.route(
 *   { origin, destination, travelMode: "DRIVING" },
 *   (res, status) => status === "OK" && directionsRenderer.setDirections(res)
 * );
 *
 * -------------------------------
 * 🌦️ MAP LAYERS (attach directly to map)
 * - new google.maps.TrafficLayer().setMap(map);
 * - new google.maps.TransitLayer().setMap(map);
 * - new google.maps.BicyclingLayer().setMap(map);
 *
 * -------------------------------
 * ✅ SUMMARY
 * - "map-attached" → AdvancedMarkerElement, DirectionsRenderer, Layers.
 * - "standalone" → Geocoder, DirectionsService, DistanceMatrixService, ElevationService.
 * - "data-only" → Place, Geometry utilities.
 */

/// <reference types="@types/google.maps" />

import { useEffect, useRef } from "react";
import { usePersistFn } from "@/hooks/usePersistFn";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: typeof google;
  }
}

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
  "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

function loadMapScript() {
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      resolve(null);
      script.remove(); // Clean up immediately
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
    };
    document.head.appendChild(script);
  });
}

interface MapLocationData {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  description: string;
}

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map) => void;
  locations?: MapLocationData[];
  selectedLocation?: MapLocationData | null;
  onLocationSelect?: (location: MapLocationData) => void;
}

export function MapView({
  className,
  initialCenter = { lat: -15.7942, lng: -48.0192 },
  initialZoom = 4,
  onMapReady,
  locations,
  selectedLocation,
  onLocationSelect,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());

  const getMarkerColor = (type: string) => {
    switch(type) {
      case "deam": return "#dc2626"; // Soft Red
      case "cras": return "#059669"; // Green
      case "creas": return "#1e3a8a"; // Deep Blue
      default: return "#6b7280";
    }
  };

  const init = usePersistFn(async () => {
    await loadMapScript();
    if (!mapContainer.current) {
      console.error("Map container not found");
      return;
    }
    map.current = new window.google.maps.Map(mapContainer.current, {
      zoom: initialZoom,
      center: initialCenter,
      mapTypeControl: true,
      fullscreenControl: true,
      zoomControl: true,
      streetViewControl: true,
      mapId: "DEMO_MAP_ID",
    });
    if (onMapReady) {
      onMapReady(map.current);
    }
  });

  useEffect(() => {
    init();
  }, [init]);

  // Add markers when locations change
  useEffect(() => {
    if (!map.current || !window.google) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current.clear();

    // Add new markers
    if (locations && locations.length > 0) {
      locations.forEach(location => {
        const markerElement = document.createElement("div");
        markerElement.style.width = "32px";
        markerElement.style.height = "32px";
        markerElement.style.borderRadius = "50%";
        markerElement.style.backgroundColor = getMarkerColor(location.type);
        markerElement.style.border = "3px solid white";
        markerElement.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
        markerElement.style.cursor = "pointer";
        markerElement.style.display = "flex";
        markerElement.style.alignItems = "center";
        markerElement.style.justifyContent = "center";
        markerElement.style.fontSize = "16px";
        markerElement.innerHTML = "📍";

        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          map: map.current,
          position: { lat: location.lat, lng: location.lng },
          title: location.name,
          content: markerElement,
        });

        marker.addListener("click", () => {
          if (onLocationSelect) {
            onLocationSelect(location);
          }
          // Center map on clicked marker
          map.current?.setCenter({ lat: location.lat, lng: location.lng });
          map.current?.setZoom(15);
        });

        markers.current.set(location.id, marker);
      });
    }
  }, [locations, onLocationSelect]);

  // Highlight selected location
  useEffect(() => {
    if (!selectedLocation || !map.current) return;
    map.current.setCenter({ lat: selectedLocation.lat, lng: selectedLocation.lng });
    map.current.setZoom(15);
  }, [selectedLocation]);

  return (
    <div ref={mapContainer} className={cn("w-full h-full min-h-[400px]", className)} style={{ height: "100%", minHeight: "400px" }} />
  );
}

export default MapView;
