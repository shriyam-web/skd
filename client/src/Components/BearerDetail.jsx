import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./BearerDetail.css"; // optional styling
import Footer from "../Footer";
import Navbar from "./Navbar";
import SupportWidget from "./SupportWidget";

const profiles = [
  {
    name: "Er. Pawan Kumar Mishra",
    title: "Managing Director",
    image: "/md_sir.jpg",
    hashId: "pawan-sir",
    bio: `Er. Pawan Mishra, the visionary Managing Director of SKD Propworld Pvt. Ltd., has been a trusted leader in the real estate industry across Delhi NCR since 2011. With extensive expertise in Yamuna Expressway Authority plots and a passion for empowering clients with the best investment opportunities, he has played a pivotal role in establishing SKD Propworld as a reliable name in the sector.

Under his leadership, SKD Propworld has excelled in offering prime properties in key locations such as Yamuna Expressway, Jewar Airport, Greater Noida, and other prominent areas in Delhi NCR. By partnering with top developers and maintaining a strong focus on transparency and customer satisfaction, he has consistently delivered value to clients.

Er. Pawan Mishra’s strategic vision and market expertise ensure that SKD Propworld continues to redefine real estate investment, unlocking exceptional opportunities for investors across Delhi NCR and beyond.
    `,
  },
  {
    name: "Mrs. Aarti Mishra",
    title: "Director",
    image: "/DirMam.jpg",
    hashId: "aarti-mam",
    bio: `Mrs. Aarti Mishra, the esteemed Director of SKD Propworld Pvt. Ltd., embodies the core values of trust, transparency, and excellence that define the company. As the wife of Managing Director Mr. Pawan Mishra, she brings a balanced perspective and unwavering support to the leadership team, contributing to the company’s continued growth and success.

Her focus on fostering strong relationships, promoting ethical practices, and upholding the company’s vision has been instrumental in shaping SKD Propworld’s reputation as a trusted name in real estate. Through her dedication and strategic guidance, she ensures that the organization remains committed to delivering exceptional solutions to its clients.

With her strong leadership and vision, Mrs. Aarti Mishra continues to play a pivotal role in driving SKD Propworld Pvt. Ltd. to new heights across Delhi NCR and beyond.`,
  },
];

const BearerDetail = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100); // Wait a bit in case the page isn't ready yet
      }
    }
  }, [location.hash]);

  return (
    <>
      <Navbar />
      <div className="container-fluid py-5 bearer-detail">
        <h2 className="text-center text-warnin fw-bold mb-5">
          Meet The Office Bearers
        </h2>

        {profiles.map((profile) => (
          <div
            key={profile.hashId}
            id={profile.hashId}
            className="bearer-profile"
          >
            <div
              className="bearer-image"
              style={{ backgroundImage: `url(${profile.image})` }}
            ></div>
            <div className="bearer-overlay">
              <h3>{profile.name}</h3>
              <p className="fst-italic fw-semibold mb-3">{profile.title}</p>
              <p>{profile.bio}</p>
            </div>
          </div>
        ))}
      </div>
      <SupportWidget />
      <Footer />
    </>
  );
};

export default BearerDetail;
