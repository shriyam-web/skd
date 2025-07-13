// src/components/WorldMap.jsx
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./WorldMap.css";

// Fix marker icon
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = DefaultIcon;

// Accurate city coordinates
const locations = [
  { name: "India", position: [28.6139, 77.209] }, // New Delhi
  { name: "Dubai (UAE)", position: [25.2048, 55.2708] }, // Dubai
  { name: "Singapore", position: [1.3521, 103.8198] }, // Singapore
  { name: "USA", position: [40.7128, -74.006] }, // New York
  { name: "UK", position: [51.5074, -0.1278] }, // London
  { name: "Canada", position: [43.65107, -79.347015] }, // Toronto
];

const FitBounds = ({ locations }) => {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(locations.map((loc) => loc.position));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, locations]);
  return null;
};

const WorldMap = () => {
  const isMobile = window.innerWidth <= 768;

  return (
    <MapContainer
      center={[-200, 0]}
      zoom={2}
      scrollWheelZoom={false}
      dragging={!isMobile}
      touchZoom={!isMobile}
      zoomControl={false} // ← this disables the + / - buttons
      style={{ height: "100%", width: "100%" }}
      className="world-map"
    >
      <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />
      <FitBounds locations={locations} />
      {locations.map((loc, i) => (
        <Marker key={i} position={loc.position}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default WorldMap;
