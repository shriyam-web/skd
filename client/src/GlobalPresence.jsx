// src/components/GlobalPresence.jsx
import React from "react";
import "./GlobalPresence.css";
import WorldMap from "./WorldMap";
import { Helmet } from "react-helmet-async";

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
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        {/* <title>
          Our Global Presence | Top Real Estate Network in India, UAE, USA, UK &
          More
        </title> */}
        <meta
          name="title"
          content="Our Global Presence | Top Real Estate Network in India, UAE, USA, UK & More"
        />
        <meta
          name="description"
          content="Discover our strong global presence in real estate across India, Dubai, USA, UK, Canada, and Singapore. We connect buyers and sellers worldwide with trusted expertise."
        />
        <meta
          name="keywords"
          content="Global Real Estate, International Property Dealers, India Real Estate, UAE Property, USA Realtor, UK Homes, Property Network"
        />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://skdpropworld.com/global-presence"
        />
        <meta
          property="og:title"
          content="Our Global Presence | Trusted Real Estate Experts Worldwide"
        />
        <meta
          property="og:description"
          content="Explore our real estate footprint in India, Dubai, Singapore, USA, UK, and Canada. We offer trusted property services globally."
        />

        {/* Twitter */}
        {/* <meta property="twitter:card" content="summary_large_image" /> */}
        <meta
          property="twitter:url"
          content="https://skdpropworld.com/global-presence"
        />
        <meta
          property="twitter:title"
          content="Our Global Presence | Trusted Real Estate Experts Worldwide"
        />
        <meta
          property="twitter:description"
          content="Explore our real estate network across 6+ countries. Buy, sell, or invest with confidence."
        />
        {/* <meta
          property="twitter:image"
          content="https://yourwebsite.com/assets/global-presence-og.jpg"
        /> */}
      </Helmet>
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
                    loading="lazy"
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
    </>
  );
};

export default GlobalPresence;
