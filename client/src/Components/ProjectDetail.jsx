// ✅ Fully Improved ProjectDetail.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast"; // at the top
import { useParams } from "react-router-dom";
import LeadForm from "./LeadForm";
import axios from "axios";
import { TAG_META } from "./AllProjectsPage";
import { Link } from "react-router-dom";
import formatIndianPrice from "../utils/formatIndianPrice.js";
import { Helmet } from "react-helmet-async";

import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Card,
  Modal,
  Form,
} from "react-bootstrap";
import Navbar from "./Navbar";
import Footer from "../Footer";
import "./ProjectDetail.css";
import SupportWidget from "./SupportWidget";
import NotFound from "./NotFound";

const ProjectDetail = () => {

  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // selectedImg: jis image par click hua hai uska URL
  const [selectedImgIndex, setSelectedImgIndex] = useState(null);



  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/admin/projects/slug/${slug}`
        );

        setProject(res.data);
      } catch (error) {
        console.error("Error loading project:", error);
      }
    };
    fetchData();
  }, [slug]);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z\s]{3,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!formData.name || !formData.email || !formData.phone) {
      return toast.error("All fields are required.");
    }

    if (!nameRegex.test(formData.name)) {
      return toast.error("Please enter a valid name (at least 3 characters).");
    }

    if (!emailRegex.test(formData.email)) {
      return toast.error("Please enter a valid email address.");
    }

    if (!phoneRegex.test(formData.phone)) {
      return toast.error("Enter a valid 10-digit Indian mobile number.");
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE}/api/project-enquiry`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectId: project._id,
        projectName: project.heading,
        remark: formData.remark,
      });

      toast.success("Form submitted successfully!");
      setFormData({ name: "", email: "", phone: "", remark: "" });
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    remark: "",
  });

  if (!project) return <NotFound />;

  const uspList = Array.isArray(project.usp)
    ? project.usp // already an array ➜ use as‑is
    : (project.usp || "") // fall‑back for legacy string
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const handleImgOpen = (index) => setSelectedImgIndex(index);
  const handleImgClose = () => setSelectedImgIndex(null);

  const handleNextImg = () => {
    if (selectedImgIndex < project.gallery.length - 1) {
      setSelectedImgIndex((prev) => prev + 1);
    }
  };

  const handlePrevImg = () => {
    if (selectedImgIndex > 0) {
      setSelectedImgIndex((prev) => prev - 1);
    }
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>
          {" "}
          Projects |{" "}
          {`${project?.heading} | Property in ${project?.location} | SKD PropWorld`}
        </title>
        <meta
          name="description"
          content={`Explore details of ${project?.heading} located in ${project?.location}. Get price, amenities, features, and site photos. Trusted real estate by SKD PropWorld.`}
        />
        <meta
          name="keywords"
          content={`Real Estate, ${project?.location} property, ${project?.heading}, YEIDA, Noida plots, SKD PropWorld projects`}
        />
        <meta name="author" content="SKD PropWorld" />
        <link
          rel="canonical"
          href={`https://skdpropworld.com/projects/${
            project?.slug || project?._id
          }`}
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta
          property="og:title"
          content={`${project?.heading} - Real Estate Project in ${project?.location} | SKD PropWorld`}
        />
        <meta
          property="og:description"
          content={`Check out ${project?.heading} in ${project?.location}. View prices, configurations, and features now.`}
        />
        <meta
          property="og:url"
          content={`https://skdpropworld.com/projects/${
            project?.slug || project?._id
          }`}
        />
        {/* Optional image tag — only if you're ready to use in future */}
        {/* <meta property="og:image" content={project?.coverImageURL} /> */}

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content={`${project?.heading} in ${project?.location} | SKD PropWorld`}
        />
        <meta
          name="twitter:description"
          content={`Learn more about ${project?.heading}, a top project in ${project?.location}.`}
        />
      </Helmet>

      <Navbar />
      {/* HERO SECTION */}
      <section className="hero-section position-relative">
        {/* tag badge on hero */}
        {project.ribbonTag &&
          (() => {
            const { cls, icon } = TAG_META[project.ribbonTag] ?? {
              cls: "tag-default",
              icon: "fa-tag",
            };
            return (
              <span className={`project-tag-badge ${cls} hero-badge`}>
                {" "}
                <i className={`fas ${icon}`}></i> {project.ribbonTag}{" "}
              </span>
            );
          })()}

        <div className="hero-img-wrapper">
          <img
            src={project.bannerImage?.url || project.bannerImage}
            className="hero-img"
            alt="Project Banner"
            loading="lazy"
          />
        </div>

        <div className="hero-gradient-overlay d-flex align-items-center justify-content-start">
          <Container className="text-white">
            {project.logoImage && (
              <img
                src={project.logoImage?.url || project.logoImage}
                alt="Project Logo"
                className="project-logo mb-3"
                style={{ height: "60px", objectFit: "contain" }}
                loading="lazy"
              />
            )}

            <h1 className="display-4 fw-bold text-white mb-3">
              {project.heading}
            </h1>

            {project.isSKDPick === "YES" && (
              <span className="badge bg-primary me-2 mb-2">🌟 SKD Pick</span>
            )}

            {/* 🆕 Property Type badge */}
            {project.propertyType && (
              <span className="badge bg-warning text-dark mb-3">
                {project.propertyType}
              </span>
            )}
            <p className="lead text-light mb-2">
              <i className="fas fa-map-marker-alt me-2"></i>
              {project.location}
            </p>
            <ul className="list-unstyled mb-4">
              {uspList?.map((usp, i) => (
                <li key={i} className="text-warning p-1">
                  <i className="fas fa-check-circle me-2"></i>
                  {usp}
                </li>
              ))}
            </ul>
            <Button
              variant="warning"
              className="enquire-btn pulse blink fs-5 px-4 py-2 mt-2"
              onClick={handleOpen}
            >
              Enquire Now
            </Button>
          </Container>
        </div>
      </section>

      {/* ───────── FAST FACTS ───────── */}
      <section className="bg-white py-4 border-bottom p-5">
        <Container fluid>
          <Row className="g-3 text-center text-md-start">
            {/* Status */}
            {project.projectStatus && (
              <Col xs={6} md={2} className="fast-fact-col">
                <h6 className="fw-bold mb-1">Status</h6>
                <span
                  className={`badge ${
                    project.projectStatus === "READY_TO_MOVE"
                      ? "bg-success"
                      : "bg-warning text-dark"
                  }`}
                >
                  {project.projectStatus.replace(/_/g, " ")}
                </span>
              </Col>
            )}

            {/* RERA */}
            {project.reraNumber && (
              <Col xs={6} md={2} className="fast-fact-col">
                <h6 className="fw-bold mb-1">RERA No.</h6>
                <p className="mb-0">{project.reraNumber}</p>
              </Col>
            )}

            {/* Possession Date */}
            {project.possessionDate && (
              <Col xs={6} md={2} className="fast-fact-col">
                <h6 className="fw-bold mb-1">Possession</h6>
                <p className="mb-0">
                  {new Date(project.possessionDate).toLocaleDateString(
                    "en-IN",
                    {
                      year: "numeric",
                      month: "long",
                    }
                  )}
                </p>
              </Col>
            )}

            {/* Property Type */}
            {project.propertyType && (
              <Col xs={6} md={2} className="fast-fact-col">
                <h6 className="fw-bold mb-1">Property Type</h6>
                <p className="mb-0">{project.propertyType}</p>
              </Col>
            )}

            {/* Developer Name */}
            {project.developerName && (
              <Col xs={6} md={2} className="fast-fact-col">
                <h6 className="fw-bold mb-1">Developer</h6>
                <p className="mb-0">{project.developerName}</p>
              </Col>
            )}

            {/* Property Nature */}
            {project.propertyNature && (
              <Col xs={6} md={2} className="fast-fact-col">
                <h6 className="fw-bold mb-1">Property Nature</h6>
                <p className="mb-0">{project.propertyNature}</p>
              </Col>
            )}

            {/* Connectivity */}
            {project.connectivity?.length > 0 && (
              <Col xs={12} md={12}>
                <h6 className="fw-bold mb-2">Connectivity</h6>
                <div className="connectivity-wrap">
                  {project.connectivity.map((c, i) => (
                    <span
                      key={i}
                      className="badge rounded-pill bg-light text-dark border p-2"
                    >
                      <i className="fas fa-location-arrow me-1 text-secondary"></i>
                      {c}
                    </span>
                  ))}
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      {/* ABOUT SECTION */}
      <section className="bg-light py-5">
        <Container>
          <h2
            className="  mt-2 mb-3 p-2"
            style={{
              lineHeight: "1.7",
            }}
          >
            <i className="fas fa-info-circle me-2"></i> About {project.heading}
          </h2>
          {/* ABOUT SECTION */}
          <section className="bg-light p-0">
            <Container>
              {/* <h2 className="text-warnin mt-3 mb-3">
                <i className="fas fa-info-circle me-2"></i> About{" "}
                {project.heading}
              </h2> */}

              {/* Render rich HTML coming from the CMS / admin panel */}
              <div
                className="lead text-dark mb-3 project-about-text"
                style={{
                  fontFamily: "'Open Sans', 'Segoe UI', sans-serif",
                  fontSize: "16px",
                  fontWeight: "320",
                  color: "#333",
                  lineHeight: "1.7",
                  letterSpacing: "0.2px",
                }}
                dangerouslySetInnerHTML={{ __html: project.aboutContent }}
              />

              <div className="d-flex flex-wrap gap-3 mt-3">
                <Button variant="dark" onClick={handleOpen}>
                  <i className="fas fa-file-pdf me-2"></i> Download Brochure
                </Button>

                {project.mapLocation && (
                  <Button
                    variant="outline-warning"
                    onClick={() => window.open(project.mapLocation, "_blank")}
                  >
                    <i className="fas fa-map-marker-alt me-2"></i> View Location
                    on Map
                  </Button>
                )}
              </div>
            </Container>
          </section>

          {/* <div className="d-flex flex-wrap gap-3 mt-3">
            <Button variant="dark" onClick={handleOpen}>
              <i className="fas fa-file-pdf me-2"></i> Download Brochure
            </Button>

            {project.mapLocation && (
              <Button
                variant="outline-warning"
                onClick={() => window.open(project.mapLocation, "_blank")}
              >
                <i className="fas fa-map-marker-alt me-2"></i> View Location on
                Map
              </Button>
            )} */}
          {/* </div> */}
        </Container>
      </section>
      {/* GALLERY SECTION */}
      {project.gallery?.length > 0 && (
        <section className="py-5 bg-dark">
          <Container>
            <h2 className=" text-white pb-4">
              <i className="fas fa-images text-warning me-2"></i> Project
              Gallery
            </h2>
            <Row>
              {project.gallery.map((img, i) => (
                <Col md={4} sm={6} xs={12} key={i} className="mb-4">
                  <Card className="img-card h-100">
                    <Card.Img
                      src={img?.url || img}
                      className="gallery-img rounded"
                      onClick={() => handleImgOpen(i)}
                      style={{ cursor: "zoom-in" }}
                      alt="gallery-images"
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
      {/* PROJECT HIGHLIGHTS */}
      {project.highlights?.length > 0 && (
        <section className="bg-white py-5">
          <Container>
            <h2 className=" text-dark mb-4">
              <i className="fas fa-star text-warnin me-2"></i> Project
              Highlights
            </h2>
            <Row>
              {project.highlights.map((h, i) => (
                <Col md={4} sm={6} key={i} className="mb-4 mt-2">
                  {/* <Card className="highlight-card"> */}
                  <Card.Body>
                    <h5
                      className="text-warnin fw-bold mb-2"
                      style={{
                        fontFamily: "'Open Sans', 'Segoe UI', sans-serif",
                        fontSize: "16px",
                        fontWeight: "320",
                        color: "#333",
                        lineHeight: "1.7",
                        letterSpacing: "0.2px",
                      }}
                    >
                      <i className="fas fa-check-circle text-success me-2"></i>
                      {h.heading}
                    </h5>
                    <p className="text-secondary small">{h.description}</p>
                  </Card.Body>
                  {/* </Card> */}
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
      {/* PRICING PLANS */}
      {project.pricingPlans?.length > 0 && (
        <section className="bg-white ">
          <Container>
            <h2 className="text-dark">
              <i className="fas fa-tags text-warning me-2 mb-3"></i> Pricing
              Plans
            </h2>
            <Row>
              {project.pricingPlans.map((plan, i) => (
                <Col md={4} sm={6} key={i} className="mb-4">
                  <Card className="premium-card text-center h-100 shadow-hover position-relative">
                    <div className="ribbon">
                      <span>Best Deal</span>
                    </div>
                    <Card.Body>
                      <h5 className="text-dark fw-bold mb-2">{plan.title}</h5>
                      <h4 className="text-success display-6 mb-4">
                        {formatIndianPrice(plan.price)}*
                        {plan.priceType === "PER_UNIT" && plan.unit && (
                          <span className="text-muted small ms-1">
                            / {plan.unit}
                          </span>
                        )}
                      </h4>
                      <ul className="list-unstyled text-start mb-4 px-3">
                        {plan.features.map((f, j) => (
                          <li key={j} className="mb-2">
                            <i className="fas fa-check-circle text-success me-2"></i>
                            {f}
                          </li>
                        ))}
                      </ul>
                      {plan.description && (
                        <div
                          className="px-3 text-secondary small"
                          dangerouslySetInnerHTML={{ __html: plan.description }}
                        />
                      )}{" "}
                      <br />
                      <Button
                        variant="warning"
                        className=" mt-auto px-4 py-2 text-white contactus"
                        onClick={handleOpen}
                      >
                        Contact Us
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
      {/* WHY CHOOSE US */}
      {project.whyChooseUs?.length > 0 && (
        <section className="bg-light pt-4 pb-3">
          <Container>
            <h2 className=" text-dark py-3">
              <i className="fas fa-thumbs-up me-2 text-warnin"></i> Why Choose
              Us
            </h2>
            <Row>
              {project.whyChooseUs.map((item, i) => (
                <Col md={4} sm={6} key={i} className="mb-4">
                  <Card className="why-card p-3 border-0 h-100 shadow-sm">
                    {/* <Card.Body> */}
                    <Card.Title className="h6 text-warnin fw-bold mb-2">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      {item.title}
                    </Card.Title>
                    <Card.Text className="text-secondary small">
                      {item.content}
                    </Card.Text>
                    {/* </Card.Body> */}
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
      {/* ───────── ADVANTAGES ───────── */}
      {project.advantages?.length > 0 && (
        <section className="bg-white pt-5 pb-3">
          <Container>
            <h2 className=" text-dark mb-4">
              <i className="fas fa-medal text-warnin me-2"></i> Advantages
            </h2>
            <Row>
              {project.advantages.map((adv, i) => (
                <Col md={6} key={i} className="mb-4">
                  {/* <Card className="border-0 shadow-sm h-100"> */}
                  <Card.Body>
                    <h5
                      className="fw-bold text-warnin mb-3"
                      style={{
                        fontFamily: "'Open Sans', 'Segoe UI', sans-serif",
                        fontSize: "17px",
                        fontWeight: "300",
                        color: "#333",
                        lineHeight: "1.7",
                        letterSpacing: "0.2px",
                      }}
                    >
                      <i className="fas fa-check-circle text-success me-2"></i>
                      {adv.category}
                    </h5>
                    <ul className="list-unstyled mb-0">
                      {adv.points.map((pt, j) => (
                        <li key={j} className="mb-2">
                          <i className="fas fa-arrow-right text-primary me-2"></i>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                  {/* </Card> */}
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
      {/* ───────── CONFIGURATION TABLE ───────── */}
      {project.configurationTable && (
        <section className="bg-light pt-5 pb-5">
          <Container>
            <h2 className=" text-dark mb-4">
              <i className="fas fa-table text-warning me-2"></i> Unit Details
            </h2>
            <div
              className="table-responsive"
              /* the table is stored as raw HTML / MD → we trust admin input */
              dangerouslySetInnerHTML={{ __html: project.configurationTable }}
            />
          </Container>
        </section>
      )}
      {/* FLOOR PLANS */}
      {project.floorPlans?.length > 0 && (
        <section className="bg-white py-5">
          <Container>
            <h2 className="text-dark mb-4">
              <i className="fas fa-map me-2 text-warning"></i> Floor Plans
            </h2>
            <Row>
              {project.floorPlans.map((img, i) => (
                <Col md={4} sm={6} xs={12} key={i} className="mb-4">
                  <Card className="floor-card">
                    <Card.Img
                      src={img?.url || img}
                      className="img-fluid blurred-img"
                      alt="floor-image"
                    />
                    <Card.Footer className="text-center mt-2">
                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={handleOpen}
                      >
                        View Plan
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
      {/* POPUP FORM */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        className="modalform"
      >
        <Modal.Header closeButton className="bg-warning text-white">
          <Modal.Title className="text-dark bg-warning">
            Fill the form to proceed
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-2">
          <Form onSubmit={handleSubmit}>
            {/* Hidden Project ID */}
            <Form.Control
              type="hidden"
              value={project.projectId}
              className="disabled hidden"
            />

            {/* Project Name (Disabled) */}
            <Form.Group className="mb-3">
              <Form.Label className="labelwa">Project</Form.Label>
              <Form.Control type="text" value={project.heading} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="labelwa">Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="labelwa">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="labelwa">Mobile Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter your phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label className="labelwa">Remark (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Leave a message or remark..."
                value={formData.remark}
                onChange={(e) =>
                  setFormData({ ...formData, remark: e.target.value })
                }
              />
            </Form.Group>

            <div className=" mt-4">
              <Button variant="warning" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Response"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      {/* IMAGE LIGHTBOX */}
      <Modal
        show={selectedImgIndex !== null}
        onHide={handleImgClose}
        fullscreen
        className="gallery-lightbox"
      >
        {/* Close Button */}
        <Button
          variant="light"
          className="position-absolute top-0 end-0 m-3"
          onClick={handleImgClose}
          style={{
            zIndex: 9999,
            borderRadius: "50%",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          }}
        >
          <i className="fas fa-times"></i>
        </Button>

        <Modal.Body className="p-0 position-relative">
          {selectedImgIndex !== null && (
            <>
              <img
                src={
                  project.gallery[selectedImgIndex]?.url ||
                  project.gallery[selectedImgIndex]
                }
                alt="Zoomed"
                className="w-100"
                style={{
                  width: "100%",
                  maxHeight: "90vh",
                  objectFit: "contain",
                }}
                loading="lazy"
              />

              {/* Previous Button */}
              <Button
                variant="light"
                className="position-absolute top-50 start-0 translate-middle-y"
                onClick={handlePrevImg}
                disabled={selectedImgIndex === 0}
                style={{ opacity: 0.8, zIndex: 2 }}
              >
                <i className="fas fa-chevron-left"></i>
              </Button>

              {/* Next Button */}
              <Button
                variant="light"
                className="position-absolute top-50 end-0 translate-middle-y"
                onClick={handleNextImg}
                disabled={selectedImgIndex === project.gallery.length - 1}
                style={{ opacity: 0.8, zIndex: 2 }}
              >
                <i className="fas fa-chevron-right"></i>
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>

      <LeadForm />
      <SupportWidget />
      <Footer />
    </>
  );
};

export default ProjectDetail;
