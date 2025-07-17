import React from "react";
import "./OfficeBearers.css";
import SupportWidget from "./SupportWidget";
import { Link } from "react-router-dom"; // ← add this at the top

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
