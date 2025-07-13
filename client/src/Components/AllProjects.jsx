import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./AllProjects.css";
import formatIndianPrice from "../utils/formatIndianPrice.js";
import DOMPurify from "dompurify";

const AllProjects = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const ribbonIcons = {
    "Hot Deal": "fa-fire",
    Trending: "fa-bolt",
    "New Launch": "fa-rocket",
    "Limited Time": "fa-hourglass-half",
    "Best Seller": "fa-crown",
    "Ready to Move": "fa-home",
    "Under Construction": "fa-tools",
    "Sold Out": "fa-ban",
    "Exclusive Offer": "fa-gift",
    "Investor’s Choice": "fa-chart-line",
    "Prime Location": "fa-map-marker-alt",
    "Budget Friendly": "fa-wallet",
    "Premium Property": "fa-gem",
  };

  const ribbonColorClass = {
    "Hot Deal": "tag-red",
    Trending: "tag-blue",
    "New Launch": "tag-blue",
    "Limited Time": "tag-orange",
    "Best Seller": "tag-orange",
    "Ready to Move": "tag-green",
    "Under Construction": "tag-yellow",
    "Sold Out": "tag-gray",
    "Exclusive Offer": "tag-purple",
    "Investor’s Choice": "tag-green",
    "Prime Location": "tag-blue",
    "Budget Friendly": "tag-cyan",
    "Premium Property": "tag-purple",
  };

  useEffect(() => {
    const fetchVisibleProjects = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/projects`);
        const filtered = res.data.filter((p) => p.visible);
        setVisibleProjects(filtered);
        setFilteredProjects(filtered);
      } catch (err) {
        console.error("❌ Error fetching visible projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisibleProjects();
  }, []);

  useEffect(() => {
    const filtered = visibleProjects.filter(
      (proj) =>
        proj.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proj.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const uniqueFiltered = Array.from(
      new Map(filtered.map((p) => [p._id, p])).values()
    );
    setFilteredProjects(uniqueFiltered);
  }, [searchTerm, visibleProjects]);

  const isScrollMode = !searchTerm && visibleProjects.length >= 5;
  const displayProjects = searchTerm
    ? filteredProjects
    : [...visibleProjects, ...visibleProjects];

  const renderCard = (proj, index) => (
    <Card key={`${proj._id}-${index}`} className="project-card">
      {/* ✅ Ribbon */}
      {proj.ribbonTag && (
        <div
          className={`project-tag-badge ${
            ribbonColorClass[proj.ribbonTag] || "tag-default"
          }`}
        >
          <i
            className={`fas ${ribbonIcons[proj.ribbonTag] || "fa-tag"} me-1`}
          />
          {proj.ribbonTag}
        </div>
      )}

      {/* ✅ SKD Top Pick Badge */}
      {proj.isSKDPick === "YES" && (
        <div className="skd-project-card-badge">
          <i className="fas fa-gem me-1" /> SKD Top Pick
        </div>
      )}

      <Card.Img
        variant="top"
        src={proj.bannerImage?.url}
        className="project-card-img"
      />

      <Card.Body>
        {/* Title & Location */}
        <Card.Title className="project-title">{proj.heading}</Card.Title>
        <Card.Text className="project-location">
          <i className="fas fa-map-marker-alt text-danger me-1"></i>
          {proj.location}
        </Card.Text>

        {/* Project Status */}
        {proj.projectStatus && (
          <Card.Text className="project-meta">
            {/* <i className="fas fa-tasks me-1 text-info"></i> */}
            <strong>Status:</strong>{" "}
            <span
              className={`badge bg-${
                proj.projectStatus === "READY_TO_MOVE" ? "success" : "warning"
              } text-dark`}
            >
              {proj.projectStatus.replace(/_/g, " ").toUpperCase()}
            </span>
          </Card.Text>
        )}

        {/* Property Type */}
        {proj.propertyType && (
          <Card.Text className="project-meta">
            <i className="fas fa-layer-group me-1 text-secondary"></i>{" "}
            {/* for Type */}
            <strong>Type:</strong> {proj.propertyType}
          </Card.Text>
        )}

        {/* RERA Number */}
        {proj.reraNumber && (
          <Card.Text className="project-meta">
            <strong>RERA:</strong> {proj.reraNumber}
          </Card.Text>
        )}

        {/* //optionally hidden */}
        {/* USP */}
        {proj.usp && (
          <Card.Text className="project-usp">
            <strong>USP:</strong>{" "}
            {Array.isArray(proj.usp) ? proj.usp.join(", ") : proj.usp}
          </Card.Text>
        )}
        {/* Connectivity */}
        {/* {proj.connectivity && proj.connectivity.length > 0 && (
          <Card.Text className="project-meta">
            <i className="fas fa-road me-1 text-primary"></i>{" "}
            
            <strong>Connectivity:</strong> {proj.connectivity.join(", ")}
          </Card.Text>
        )} */}
        {/* optionally hidden */}

        {proj.aboutContent && (
          <div className="project-about text-muted small mt-2">
            <h6 className="mb-1">
              <strong>About:</strong>
            </h6>
            <div
              style={{ lineHeight: "1.3em" }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  proj.aboutContent.length > 130
                    ? proj.aboutContent.slice(0, 130) + "..."
                    : proj.aboutContent
                ),
              }}
            />
          </div>
        )}

        {/* Price */}
        <Card.Text className="text-success fw-semibold">
          Starting from {formatIndianPrice(proj.pricingPlans?.[0]?.price ?? 0)}*{" "}
          {proj.pricingPlans?.[0]?.priceType === "PER_UNIT" && (
            <span className="text-muted small">
              (per {proj.pricingPlans?.[0]?.unit || "unit"})
            </span>
          )}
        </Card.Text>

        {/* Button */}
        <Link to={`/projects/${proj.slug}`} className="btn-wrapper">
          <Button className="btn-detail">View in Detail</Button>
        </Link>
      </Card.Body>
    </Card>
  );

  return (
    <div className="all-projects-wrapper">
      <h2 className="all-projects-title mt-3">Explore All Active Projects</h2>
      <div className="all-projects-search">
        <Form.Control
          type="text"
          placeholder="Search by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loader */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="warning" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center no-results">
          <p>No matching projects found. Recheck your internet connection</p>
        </div>
      ) : isScrollMode ? (
        <div className="all-projects-scroll-wrapper">
          <div className="all-projects-scroll auto-scroll">
            {displayProjects.map(renderCard)}
          </div>
        </div>
      ) : (
        <div className="all-projects-grid">
          {filteredProjects.map(renderCard)}
        </div>
      )}

      {!loading && filteredProjects.length > 0 && (
        <div className="text-center mt-4 pb-4">
          <Link to="/projects">
            <Button className="btn-viewall">View All Projects</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AllProjects;
