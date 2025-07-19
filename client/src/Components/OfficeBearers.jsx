import React from "react";
import "./OfficeBearers.css";
import SupportWidget from "./SupportWidget";
import { Link } from "react-router-dom"; // ← add this at the top
import { Helmet } from "react-helmet-async";

const bearers = [
  {
    name: "Er. Pawan Kumar Mishra",
    title: "Managing Director",
    image: "/md.jpeg.jpg",
    description:
      "Strategic vision and market expansion, with a strong focus on client-centric investment solutions and transparent real estate practices.",
    socials: {
      linkedin: "https://www.linkedin.com/in/erpawankumarmishra",
      // instagram: "#",
      // facebook: "#",
    },
    detailPage: "/team/pawan-mishra",
  },
  {
    name: "Mrs. Aarti Mishra",
    title: "Director",
    image: "/DirMamShort.jpg",
    description:
      "Strategic leadership and vision planning, with a strong focus on client relationships and ethical governance.",
    socials: {
      // linkedin: "#",
      // twitter: "#",
      // facebook: "#",
    },
    detailPage: "/team/aarti-mam",
  },
];

const OfficeBearers = () => {
  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>
          YEIDA Property Experts | Leadership Team in Noida, Greater Noida &
          Delhi
        </title>
        <meta
          name="description"
          content="Meet our trusted real estate leaders driving success across YEIDA, Noida, Greater Noida, and Delhi NCR – including Er. Pawan Kumar Mishra (MD) and Mrs. Aarti Mishra (Director)."
        />
        <meta
          name="keywords"
          content="YEIDA real estate leadership, property dealers Noida, Pawan Kumar Mishra, Aarti Mishra, real estate experts Delhi NCR, Greater Noida realtors"
        />
        <meta
          name="author"
          content="SKD Propworld - YEIDA Real Estate Experts"
        />
        <link rel="canonical" href="https://skdpropworld.com/team" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Meet the Leaders Behind YEIDA’s Real Estate Success | Noida, Gr. Noida & Delhi"
        />
        <meta
          property="og:description"
          content="Explore the profiles of Er. Pawan Kumar Mishra and Mrs. Aarti Mishra – leading figures in Noida and Delhi NCR’s real estate transformation."
        />
        <meta property="og:url" content="https://skdpropworld.com/team" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="Top Real Estate Leaders in YEIDA, Noida & Delhi NCR | SKD Propworld"
        />
        <meta
          name="twitter:description"
          content="Get to know our core team of real estate experts making an impact across YEIDA, Noida, Greater Noida, and Delhi."
        />
      </Helmet>

      <section className="office-bearers text-center">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold pt-5 pb-2">MEET THE OFFICE BEARERS</h2>
          </div>

          <div className="row justify-content-center mb-2">
            {bearers.map((bearer, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="ob-card border-0 shadow-sm h-100">
                  <img
                    src={bearer.image}
                    alt={bearer.name}
                    loading="lazy"
                    className="ob-card-img rounded-circle mx-auto mt-4"
                  />
                  <div className="ob-card-body">
                    <h5 className="ob-name">{bearer.name}</h5>
                    <p className="ob-title">{bearer.title}</p>
                    <p className="ob-desc">{bearer.description} </p>
                    <div className="ob-socials d-flex justify-content-center gap-3 fs-5 mb-3">
                      {bearer.socials.linkedin && (
                        <a href={bearer.socials.linkedin} aria-label="LinkedIn">
                          <i className="bi bi-linkedin"></i>
                        </a>
                      )}
                      {bearer.socials.instagram && (
                        <a
                          href={bearer.socials.instagram}
                          aria-label="Instagram"
                        >
                          <i className="bi bi-instagram"></i>
                        </a>
                      )}
                      {bearer.socials.facebook && (
                        <a href={bearer.socials.facebook} aria-label="Facebook">
                          <i className="bi bi-facebook"></i>
                        </a>
                      )}
                      {bearer.socials.twitter && (
                        <a href={bearer.socials.twitter} aria-label="Twitter">
                          <i className="bi bi-twitter"></i>
                        </a>
                      )}
                    </div>

                    <Link
                      to={`/team#${
                        bearer.name.toLowerCase().includes("pawan")
                          ? "pawan-sir"
                          : "aarti-mam"
                      }`}
                      className="ob-btn"
                    >
                      View in Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SupportWidget />
    </>
  );
};

export default OfficeBearers;
