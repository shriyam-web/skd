import "./PrimeWorkLocations.css";
import { MapPin } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

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
    <>
      <Helmet>
        {/* <title>
          Prime Property Locations in YEIDA, Noida, Greater Noida, Delhi NCR |
          SKD Propworld
        </title> */}
        <meta
          name="description"
          content="Explore SKD Propworld's prime real estate locations including YEIDA, Noida, Greater Noida, Delhi, Gurugram, Ghaziabad and more. Click to view projects by location."
        />
        <meta
          name="keywords"
          content="YEIDA property, Noida projects, Greater Noida real estate, Delhi properties, Gurugram real estate, Ghaziabad property deals, SKD Propworld locations"
        />
        <meta name="author" content="SKD Propworld" />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://www.skdpropworld.com/prime-locations"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.skdpropworld.com/prime-locations"
        />
        <meta
          property="og:title"
          content="Prime Property Locations in YEIDA, Noida, Greater Noida, Delhi NCR | SKD Propworld"
        />
        <meta
          property="og:description"
          content="Browse top real estate hotspots like YEIDA, Greater Noida, and Delhi with SKD Propworld. View available projects by area."
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content="https://www.skdpropworld.com/prime-locations"
        />
        <meta
          name="twitter:title"
          content="Prime Property Locations | YEIDA, Noida, Delhi NCR – SKD Propworld"
        />
        <meta
          name="twitter:description"
          content="Discover the best property investment locations across NCR including YEIDA, Noida, and more with SKD Propworld."
        />
      </Helmet>

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
    </>
  );
};

export default PrimeWorkLocations;
