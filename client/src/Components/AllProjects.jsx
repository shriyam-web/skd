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
  // const scrollRef = useRef(null);
  const animationRef = useRef();
  const pausedRef = useRef(false);

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
    const scrollSpeed = 0.5;
    let animationId;
    let paused = false;

    const scroll = () => {
      if (!container || paused) return;

      container.scrollLeft += scrollSpeed;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScrollLeft) {
        paused = true;

        // Add fade-out animation
        container.classList.add("fade-out");

        setTimeout(() => {
          container.scrollLeft = 0;
          container.classList.remove("fade-out");
          container.classList.add("fade-in");

          // Remove fade-in after it's done
          setTimeout(() => {
            container.classList.remove("fade-in");
            paused = false;
            animationId = requestAnimationFrame(scroll);
          }, 600); // same as fade-in duration
        }, 600); // same as fade-out duration

        return;
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    const pause = () => {
      paused = true;
      cancelAnimationFrame(animationId);
    };

    const resume = () => {
      if (!paused) return;
      paused = false;
      animationId = requestAnimationFrame(scroll);
    };

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
          {(() => {
            const totalPlans = proj.pricingPlans?.filter(
              (p) => p.priceType === "TOTAL"
            );
            const minPrice =
              totalPlans && totalPlans.length > 0
                ? Math.min(...totalPlans.map((p) => p.price))
                : proj.pricingPlans?.[0]?.price ?? 0;

            return (
              <>
                Starting from {formatIndianPrice(minPrice)}*
                {proj.pricingPlans?.[0]?.priceType === "PER_UNIT" && (
                  <span className="text-muted small">
                    {" "}
                    (per {proj.pricingPlans[0].unit || "unit"})
                  </span>
                )}
              </>
            );
          })()}
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
        {/* <title>All Property Projects | SKD PropWorld</title> */}
        <meta
          name="description"
          content="Browse top residential and commercial projects in NCR."
        />
        <link rel="canonical" href="https://skdpropworld.com/projects" />
      </Helmet>

      <div className="all-projects-wrapper ">
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
          <div className="scroll-container-wrapper">
            {/* Left Arrow */}
            {/* <button
              className="scroll-arrow scroll-arrow-left"
              onClick={() => {
                if (!scrollRef.current) return;
                pausedRef.current = true;
                cancelAnimationFrame(animationRef.current);

                scrollRef.current.scrollBy({
                  left: -400,
                  behavior: "smooth",
                });

                setTimeout(() => {
                  pausedRef.current = false;
                  animationRef.current = requestAnimationFrame(
                    function scroll() {
                      if (!scrollRef.current || pausedRef.current) return;
                      scrollRef.current.scrollLeft += 0.5;

                      const third = scrollRef.current.scrollWidth / 3;
                      if (scrollRef.current.scrollLeft >= third * 2) {
                        scrollRef.current.scrollLeft = third;
                      }

                      animationRef.current = requestAnimationFrame(scroll);
                    }
                  );
                }, 2000);
              }}
            >
              &#8249;
            </button> */}

            {/* Scrollable Projects */}
            <div className="all-projects-scroll-wrapper" ref={scrollRef}>
              <div className="all-projects-scroll">
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

            {/* Right Arrow */}
            {/* <button
              className="scroll-arrow scroll-arrow-right"
              onClick={() => {
                if (!scrollRef.current) return;
                pausedRef.current = true;
                cancelAnimationFrame(animationRef.current);

                scrollRef.current.scrollBy({
                  left: 400,
                  behavior: "smooth",
                });

                setTimeout(() => {
                  pausedRef.current = false;
                  animationRef.current = requestAnimationFrame(
                    function scroll() {
                      if (!scrollRef.current || pausedRef.current) return;
                      scrollRef.current.scrollLeft += 0.5;

                      const third = scrollRef.current.scrollWidth / 3;
                      if (scrollRef.current.scrollLeft >= third * 2) {
                        scrollRef.current.scrollLeft = third;
                      }

                      animationRef.current = requestAnimationFrame(scroll);
                    }
                  );
                }, 2000);
              }}
            >
              &#8250;
            </button> */}
          </div>
        ) : (
          <div className="all-projects-grid">
            {filtered.map(renderProjectCard)}
          </div>
        )}{" "}
        <br />
        <center>
          <Link to="/projects" className="btn-viewall">
            Go to Projects
          </Link>

          {/* <button>View All Projects</button> */}
        </center>
      </div>
    </>
  );
};

export default AllProjects;
