// src/components/GlobalPresence.jsx
import React from "react";
import "./GlobalPresence.css";
import WorldMap from "./WorldMap";

const countries = [
  { name: "India", code: "in" },
  { name: "Dubai (UAE)", code: "ae" },
  { name: "Singapore", code: "sg" },
  { name: "USA", code: "us" },
  { name: "UK", code: "gb" },
  { name: "Canada", code: "ca" },
];

const GlobalPresence = () => {
  return (
    <div className="map-wrapper">
      {/* gradient overlay with cards */}
      <header className="global-presence map-overlay">
        <h2>OUR GLOBAL PRESENCE</h2>

        <div className="countries-grid">
          {countries.map(({ name, code }) => (
            <div
              key={code}
              className="country-card"
              style={{
                "--flag-url": `url(https://flagcdn.com/w320/${code}.png)`,
              }}
            >
              <div className="country-content">
                <img
                  src={`https://flagcdn.com/32x24/${code}.png`}
                  alt={name}
                  className="flag-icon"
                />
                <span className="country-name">{name}</span>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* interactive Leaflet map */}
      <WorldMap />
    </div>
  );
};

export default GlobalPresence;
