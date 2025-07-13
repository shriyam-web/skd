import "./PrimeWorkLocations.css";
import { MapPin } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const locations = [
  { title: "YEIDA" },
  { title: "Greater Noida" },
  { title: "NOIDA" },
  { title: "NOIDA Extension" },
  { title: "DELHI" },
  { title: "GURUGRAM" },
  { title: "GHAZIABAD" },
];

const PrimeWorkLocations = () => {
  const navigate = useNavigate();

  return (
    <section className="prime-section">
      <h2 className="prime-heading">PRIME LOCATIONS</h2>
      <div className="prime-grid">
        {locations.map((loc, idx) => (
          <div
            key={idx}
            className="prime-card"
            onClick={() =>
              navigate(`/projects?search=${encodeURIComponent(loc.title)}`)
            }
            style={{ cursor: "pointer" }}
          >
            <div className="prime-icon-title">
              {/* <MapPin size={10} className="map-icon" /> */}
              <h3 className="prime-title">{loc.title}</h3>
            </div>
            {loc.subtitle && <p className="prime-subtitle">{loc.subtitle}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PrimeWorkLocations;
