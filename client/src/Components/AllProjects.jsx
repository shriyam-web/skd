import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card, Button, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./AllProjects.css";
import formatIndianPrice from "../utils/formatIndianPrice.js";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet-async";

const AllProjects = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

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

  const ribbonColors = {
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
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/admin/projects`);
        const visible = data.filter((p) => p.visible);
        setProjects(visible);
        setFiltered(visible);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [API_BASE]);

  useEffect(() => {
    const result = projects.filter(
      ({ heading, location }) =>
        heading.toLowerCase().includes(search.toLowerCase()) ||
        location.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, projects]);

  const isScrollMode = !search && projects.length >= 3;

  const displayList = search ? filtered : projects; // Recap removed

  useEffect(() => {
    if (!isScrollMode || !scrollRef.current) return;

    const container = scrollRef.current;
    let animationId;
    const scrollSpeed = 0.5;

    // Start from middle set
    container.scrollLeft = container.scrollWidth / 3;

    const scroll = () => {
      if (!container) return;

      container.scrollLeft += scrollSpeed;

      const third = container.scrollWidth / 3;
      if (container.scrollLeft >= third * 2) {
        container.scrollLeft = third;
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    const pause = () => cancelAnimationFrame(animationId);
    const resume = () => (animationId = requestAnimationFrame(scroll));

    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
    };
  }, [isScrollMode]);

  const renderProjectCard = (proj, idx) => (
    <Card key={`${proj._id}-${idx}`} className="project-card">
      {proj.ribbonTag && (
        <div
          className={`project-tag-badge ${
            ribbonColors[proj.ribbonTag] || "tag-default"
          }`}
        >
          <i
            className={`fas ${ribbonIcons[proj.ribbonTag] || "fa-tag"} me-1`}
          />
          {proj.ribbonTag}
        </div>
      )}

      {proj.isSKDPick === "YES" && (
        <div className="skd-project-card-badge">
          <i className="fas fa-gem me-1" /> SKD Top Pick
        </div>
      )}

      <Card.Img
        variant="top"
        src={proj.bannerImage?.url}
        className="project-card-img"
        loading="lazy"
        alt={proj.heading}
      />

      <Card.Body>
        <Card.Title className="project-title">{proj.heading}</Card.Title>
        <Card.Text className="project-location">
          <i className="fas fa-map-marker-alt text-danger me-1" />
          {proj.location}
        </Card.Text>

        {proj.projectStatus && (
          <Card.Text className="project-meta">
            <strong>Status:</strong>{" "}
            <span
              className={`badge bg-${
                proj.projectStatus === "READY_TO_MOVE" ? "success" : "warning"
              } text-dark`}
            >
              {proj.projectStatus.replace(/_/g, " ")}
            </span>
          </Card.Text>
        )}

        {proj.propertyType && (
          <Card.Text className="project-meta">
            <i className="fas fa-layer-group me-1 text-secondary" />
            <strong>Type:</strong> {proj.propertyType}
          </Card.Text>
        )}

        {proj.reraNumber && (
          <Card.Text className="project-meta">
            <strong>RERA:</strong> {proj.reraNumber}
          </Card.Text>
        )}

        {proj.usp && (
          <Card.Text className="project-usp">
            <strong>USP:</strong>{" "}
            {Array.isArray(proj.usp) ? proj.usp.join(", ") : proj.usp}
          </Card.Text>
        )}

        {proj.aboutContent && (
          <div className="project-about small text-muted">
            <h6 className="mb-1">
              <strong>About:</strong>
            </h6>
            <div
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

        <Card.Text className="text-success fw-semibold mt-2">
          Starting from {formatIndianPrice(proj.pricingPlans?.[0]?.price ?? 0)}*
          {proj.pricingPlans?.[0]?.priceType === "PER_UNIT" && (
            <span className="text-muted small">
              {" "}
              (per {proj.pricingPlans[0].unit || "unit"})
            </span>
          )}
        </Card.Text>

        <Link
          to={`/projects/${proj.slug}`}
          className="btn-wrapper d-block mt-3"
        >
          <Button className="btn-details">View in Detail</Button>
        </Link>
      </Card.Body>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>All Property Projects | SKD PropWorld</title>
        <meta
          name="description"
          content="Browse top residential and commercial projects in NCR."
        />
        <link rel="canonical" href="https://skdpropworld.com/projects" />
      </Helmet>

      <div className="all-projects-wrapper mar">
        <h2 className="all-projects-title ">Explore All Active Projects</h2>

        <div className="all-projects-search mb-3">
          <Form.Control
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center no-results">
            <p>No matching projects found.</p>
          </div>
        ) : isScrollMode ? (
          <div className="all-projects-scroll-wrapper">
            <div className="all-projects-scroll" ref={scrollRef}>
              {displayList.map((proj, idx) =>
                proj.recap ? (
                  <div
                    key={`recap-${idx}`}
                    className="recap-strip d-flex justify-content-center align-items-center"
                  >
                    🔁 ReCap
                  </div>
                ) : (
                  renderProjectCard(proj, idx)
                )
              )}
            </div>
          </div>
        ) : (
          <div className="all-projects-grid">
            {filtered.map(renderProjectCard)}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="text-center mt-3 pt-1">
            <Link to="/projects">
              <Button className="btn-viewall">View All Projects</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default AllProjects;
