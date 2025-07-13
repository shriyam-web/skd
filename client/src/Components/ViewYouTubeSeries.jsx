import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewYouTubeSeries.css";
import { FaYoutube } from "react-icons/fa"; // YouTube icon

const ViewYouTubeSeries = () => {
  const [videos, setVideos] = useState([]);
  const API = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios.get(`${API}/api/admin/youtube`).then((res) => {
      setVideos(res.data);
    });
  }, []);

  return (
    <div className="container-fluid">
      <div className="row youtube-hero-new align-items-center">
        {/* Left Column */}
        <div className="col-md-4 d-flex align-items-center gap-4 mb-4 mb-md-0">
          <div className="right-text">
            <FaYoutube className="youtube-icon-large" />
            <h1 className="hero-title mb-3 mt-2">
              Exclusive 💰 <br /> Real Estate Podcast{" "}
            </h1>
            <h2 className="hero-subtitle">
              A show which helps you invest wisely
            </h2>
            <p className="hero-tagline ">
              Dive into real stories, trends, and secrets shaping the world of
              real estate. Your property journey starts here with{" "}
              <i>unlocking real estate! </i>
            </p>
            <a
              href="https://www.youtube.com/@skdpropworld2011"
              target="_blank"
              className="btn btnn  mt-3"
            >
              Visit Channel →
            </a>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-md-8 d-flex align-items-center">
          <button
            className="scroll-btn left"
            onClick={() =>
              document
                .querySelector(".scroll-container")
                .scrollBy({ left: -300, behavior: "smooth" })
            }
          >
            <span style={{ fontSize: "20px" }}>«</span>
            {/* &#8592; */}
            {/* {"<"} */}
          </button>
          <div className="scroll-container">
            <div className="video-strip">
              {videos.map((v) => (
                <div key={v._id} className="video-card">
                  <iframe src={v.url} title={v.title} allowFullScreen></iframe>
                  <h4>{v.title}</h4>
                  <p>{v.description}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            className="scroll-btn right"
            onClick={() =>
              document
                .querySelector(".scroll-container")
                .scrollBy({ left: 300, behavior: "smooth" })
            }
          >
            {/* &#8594; */}
            <span style={{ fontSize: "20px" }}>»</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewYouTubeSeries;
