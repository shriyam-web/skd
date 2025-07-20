import React from "react";
import "./Collaborators.css";
import { Helmet } from "react-helmet-async";

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
  "/Collaborators/Arihant.png",
];

const Collaborators = () => {
  return (
    <>
      <Helmet>
        <title>
          Top Real Estate Collaborators – Trusted Builders & Developers in
          Noida, YEIDA, Greater Noida, Delhi NCR
        </title>
        <meta
          name="description"
          content="Explore top collaborators and property developers like Godrej, Bhutani, ATS, ACE, M3M, DLF, and more across Noida, YEIDA, Greater Noida & Delhi NCR."
        />
        <meta
          name="keywords"
          content="real estate collaborators, top builders in Noida, trusted developers, YEIDA partners, Greater Noida builders, Delhi NCR real estate"
        />
        <link rel="canonical" href="https://www.yoursite.com/collaborators" />

        {/* Open Graph Tags */}
        <meta
          property="og:title"
          content="Top Real Estate Collaborators – Noida, YEIDA, Delhi NCR"
        />
        <meta
          property="og:description"
          content="Meet our top real estate collaborators including DLF, Lodha, Godrej, M3M, and more in Noida, Greater Noida, YEIDA and NCR."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.yoursite.com/collaborators"
        />
        <meta
          property="og:image"
          content="https://www.yoursite.com/placeholder.png"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Top Real Estate Collaborators – Noida, Delhi NCR"
        />
        <meta
          name="twitter:description"
          content="View our collaborators – ATS, Godrej, Bhutani, DLF, etc. in Delhi NCR real estate projects."
        />
        <meta
          name="twitter:image"
          content="https://www.yoursite.com/placeholder.png"
        />
      </Helmet>
      <div className="collaborators-section">
        <h2 className="section-title"> OUR COLLABORATORS </h2>
        <div className="collaborator-slider">
          <div className="logo-track">
            {collaboratorLogos.concat(collaboratorLogos).map((logo, idx) => (
              <div className="logo-container" key={idx}>
                <img
                  src={logo}
                  alt={`Partner ${idx + 1}`}
                  className="logo-img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Collaborators;
