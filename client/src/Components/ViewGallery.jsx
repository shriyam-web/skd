import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { FaSearchPlus, FaTimes } from "react-icons/fa";
import "./ViewGallery.css"; // Custom styles
import Navbar from "./Navbar";
import Footer from "../Footer";
import SupportWidget from "./SupportWidget";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";

const ViewGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const API = import.meta.env.VITE_API_BASE_URL;
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/gallery`);
      setImages(res.data);
    } catch (err) {
      console.error("Failed to fetch images", err);
    }
  };

  // const openModal = (img) => {
  //   setSelectedImage(img);
  //   setShowModal(true);
  // };

  const openModal = (img) => {
    const index = images.findIndex((i) => i._id === img._id);
    setSelectedIndex(index);
    setSelectedImage(img);
    setShowModal(true);
  };

  const goToPrevious = () => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setSelectedIndex(newIndex);
      setSelectedImage(images[newIndex]);
    }
  };

  const goToNext = () => {
    if (selectedIndex < images.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedIndex(newIndex);
      setSelectedImage(images[newIndex]);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const categories = useMemo(() => {
    const names = new Set(images.map((img) => img.category || "Uncategorised"));
    return Array.from(names).sort();
  }, [images]);

  const imagesByCategory = useMemo(() => {
    return images.reduce((acc, img) => {
      const key = img.category || "Uncategorised";
      acc[key] = acc[key] ? [...acc[key], img] : [img];
      return acc;
    }, {});
  }, [images]);
  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>
          Gallery | Real Estate Projects, Events & Site Visits - SKD PropWorld
        </title>
        <meta
          name="title"
          content="Gallery | Real Estate Projects, Events & Site Visits - SKD PropWorld"
        />
        <meta
          name="description"
          content="Explore our real estate photo & video gallery featuring project developments, property views, client site visits, and events by SKD PropWorld."
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.skdpropworld.com/gallery"
        />
        <meta
          property="og:title"
          content="Gallery | Real Estate Projects, Events & Site Visits - SKD PropWorld"
        />
        <meta
          property="og:description"
          content="Explore our real estate photo & video gallery featuring project developments, property views, client site visits, and events by SKD PropWorld."
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:url"
          content="https://www.skdpropworld.com/gallery"
        />
        <meta
          name="twitter:title"
          content="Gallery | Real Estate Projects, Events & Site Visits - SKD PropWorld"
        />
        <meta
          name="twitter:description"
          content="Explore our real estate photo & video gallery featuring project developments, property views, client site visits, and events by SKD PropWorld."
        />
      </Helmet>
      <Navbar />
      <div className="container-fluid p-5 py-4 containerhunmai">
        <h2 className="text-center golden-heading mb-4 mt-4">Gallery</h2>
        {categories.map((cat) => (
          <section key={cat} className="mb-5">
            <h3 className="text-white mb-3">{cat}</h3>
            <div className="gallery-grid">
              {imagesByCategory[cat].map((img) => (
                <div
                  className="gallery-card clickable-card"
                  key={img._id}
                  onClick={() => openModal(img)}
                  role="button"
                  tabIndex={0}
                >
                  {img.mediaType === "video" ? (
                    <video
                      src={img.url}
                      className="gallery-thumb"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={img.url}
                      alt={img.caption || "Gallery"}
                      className="gallery-thumb"
                      loading="lazy"
                    />
                  )}

                  {img.caption && (
                    <div className="caption-box">{img.caption}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Image Zoom Modal */}
        <Modal show={showModal} onHide={closeModal} centered size="lg">
          <div className="gallery-modal position-relative">
            <button className="close-btn" onClick={closeModal}>
              <FaTimes />
            </button>

            {selectedImage ? (
              selectedImage.mediaType === "video" ? (
                <video
                  src={selectedImage.url}
                  className="img-fluid rounded"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={selectedImage.url}
                  alt="Zoomed"
                  className="img-fluid rounded"
                  loading="lazy"
                />
              )
            ) : (
              <div className="text-white text-center">Loading…</div>
            )}

            {/* Navigation Buttons */}
            <button
              className="nav-btn left-btn"
              onClick={goToPrevious}
              disabled={selectedIndex === 0}
            >
              ⬅
            </button>
            <button
              className="nav-btn right-btn"
              onClick={goToNext}
              disabled={selectedIndex === images.length - 1}
            >
              ➡
            </button>
          </div>
        </Modal>
      </div>
      <SupportWidget />
      <Footer />
    </>
  );
};

export default ViewGallery;
