import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MapBrowser.css";
import Navbar from "./Navbar";
import Footer from "../Footer";
import SupportWidget from "./SupportWidget";

const MapBrowser = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const [maps, setMaps] = useState([]);
  const [showZoom, setShowZoom] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedPocket, setSelectedPocket] = useState(null);
  const [activeMap, setActiveMap] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/api/map-manager`)
      .then((res) => setMaps(res.data.maps || []))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const getProjects = () => {
    const grouped = {};
    maps.forEach((map) => {
      if (!grouped[map.projectName]) {
        grouped[map.projectName] = map.projectLogo;
      }
    });
    return Object.entries(grouped); // returns [ [projectName, logo], ... ]
  };

  const getSectors = () => [
    ...new Set(
      maps.filter((m) => m.projectName === selectedProject).map((m) => m.sector)
    ),
  ];
  const getPockets = () => [
    ...new Set(
      maps
        .filter(
          (m) =>
            m.projectName === selectedProject && m.sector === selectedSector
        )
        .map((m) => m.pocket)
    ),
  ];

  const handlePocketClick = (pocket) => {
    setSelectedPocket(pocket);
    const found = maps.find(
      (m) =>
        m.projectName === selectedProject &&
        m.sector === selectedSector &&
        m.pocket === pocket
    );
    setActiveMap(found);
  };

  const resetToProjects = () => {
    setSelectedProject(null);
    setSelectedSector(null);
    setSelectedPocket(null);
    setActiveMap(null);
  };

  const resetToSectors = () => {
    setSelectedSector(null);
    setSelectedPocket(null);
    setActiveMap(null);
  };

  const resetToPockets = () => {
    setSelectedPocket(null);
    setActiveMap(null);
  };

  return (
    <>
      <Navbar />
      <div className="mapbrowser-container">
        <h2 className="mapbrowser-heading">Explore Our Maps</h2>

        {/* Breadcrumb */}
        <div className="breadcrumb-exciting">
          <span className="crumb-chip home" onClick={resetToProjects}>
            Home
          </span>

          {selectedProject && (
            <>
              <span className="crumb-separator">›</span>
              <span className="crumb-chip project" onClick={resetToProjects}>
                {selectedProject}
              </span>
            </>
          )}
          {selectedSector && (
            <>
              <span className="crumb-separator">›</span>
              <span className="crumb-chip sector" onClick={resetToSectors}>
                {selectedSector}
              </span>
            </>
          )}
          {selectedPocket && (
            <>
              <span className="crumb-separator">›</span>
              <span className="crumb-chip pocket" onClick={resetToPockets}>
                {selectedPocket}
              </span>
            </>
          )}
        </div>

        {/* Stage 1: Projects */}
        {!selectedProject && (
          <div className="card-grid">
            {getProjects().map(([projectName, logo]) => (
              <div
                className="map-card"
                key={projectName}
                onClick={() => setSelectedProject(projectName)}
              >
                {logo && (
                  <img src={logo} alt="logo" className="map-logo-preview" />
                )}
                <h5>{projectName}</h5>
              </div>
            ))}
          </div>
        )}

        {/* Stage 2: Sectors */}
        {selectedProject && !selectedSector && (
          <div className="card-grid">
            {getSectors().map((sector) => (
              <div
                className="map-card"
                key={sector}
                onClick={() => setSelectedSector(sector)}
              >
                <h5>{sector}</h5>
              </div>
            ))}
          </div>
        )}

        {/* Stage 3: Pockets */}
        {selectedProject && selectedSector && !selectedPocket && (
          <div className="card-grid">
            {getPockets().map((pocket) => (
              <div
                className="map-card"
                key={pocket}
                onClick={() => handlePocketClick(pocket)}
              >
                <h5>{pocket}</h5>
              </div>
            ))}
          </div>
        )}

        {/* Stage 4: Final Map Display */}
        {activeMap && (
          <div className="map-display">
            <img
              src={activeMap.imageUrl}
              alt="Map"
              className="map-img"
              onClick={() => setShowZoom(true)} // 👈 enable zoom on click
              style={{ cursor: "zoom-in" }}
            />
            <small className="text-muted d-block mt-2">
              📍 Tap the map to zoom
            </small>

            {activeMap.title && (
              <h4 className="map-title">{activeMap.title}</h4>
            )}
            {activeMap.description && (
              <p className="map-desc">{activeMap.description}</p>
            )}
          </div>
        )}
      </div>
      {showZoom && (
        <div className="zoom-overlay" onClick={() => setShowZoom(false)}>
          <button
            className="zoom-close-btn"
            onClick={(e) => {
              e.stopPropagation(); // prevent overlay click from closing
              setShowZoom(false);
            }}
          >
            ✕
          </button>
          <img
            src={activeMap?.imageUrl}
            alt="Zoomed Map"
            className="zoomed-map"
          />
        </div>
      )}

      <SupportWidget />
      <Footer />
    </>
  );
};

export default MapBrowser;
