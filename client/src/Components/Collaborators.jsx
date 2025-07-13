import React from "react";
import "./Collaborators.css";

const collaboratorLogos = [
  "/Collaborators/ACE.png",
  "/Collaborators/ATS.png",
  "/Collaborators/Bhutani.png",
  "/Collaborators/Godrej properties.png",
  "/Collaborators/Lodha.png",
  "/Collaborators/m3m.png",
  "/Collaborators/MAHAGUN.png",
  "/Collaborators/PalmOlympia.png",
  "/Collaborators/SKA.png",
  "/Collaborators/Sobha.png",
  "/Collaborators/dlf.png",
  "/Collaborators/Gaurs.png",
];

const Collaborators = () => {
  return (
    <div className="collaborators-section">
      <h2 className="section-title"> OUR COLLABORATORS </h2>
      <div className="collaborator-slider">
        <div className="logo-track">
          {collaboratorLogos.concat(collaboratorLogos).map((logo, idx) => (
            <div className="logo-container" key={idx}>
              <img src={logo} alt={`Partner ${idx + 1}`} className="logo-img" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collaborators;
