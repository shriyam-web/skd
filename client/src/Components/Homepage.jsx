// src/components/Homepage.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Nav,
} from "react-bootstrap";

import { Typewriter } from "react-simple-typewriter";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "./Navbar";
import SupportWidget from "./SupportWidget";
import AllProjects from "./AllProjects";
import ViewYouTubeSeries from "./ViewYouTubeSeries";
import OfficeBearers from "./OfficeBearers";
import Collaborators from "./Collaborators";
import GlobalPresence from "../GlobalPresence";
import PrimeWorkLocations from "../PrimeWorkLocations";
import Testimonials from "../Testimonials";
import LeadForm from "./LeadForm";
import Footer from "../Footer";
import axios from "axios";

import "./Homepage.css";
import Stats from "./Stats";

const Homepage = () => {
  const counterRef = useRef(null);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("residential");
  const [loan, setLoan] = useState("");
  const [rate, setRate] = useState("");
  const [topPicks, setTopPicks] = useState([]);

  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [selectedType, setSelectedType] = useState("");

  const [propertyTypes, setPropertyTypes] = useState([]);

  const searchAreaRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchAreaRef.current &&
        !searchAreaRef.current.contains(event.target)
      ) {
        setActiveTab("residential");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const calculateEMI = () => {
    const P = parseFloat(loan);
    const R = parseFloat(rate) / 12 / 100;
    const N = parseFloat(tenure) * 12;

    if (P && R && N) {
      const emiVal = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      setEmi(emiVal.toFixed(2));
    } else {
      setEmi(null);
    }
  };
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const tabToCategory = {
          residential: "Residential",
          commercial: "Commercial",
          industrial: "Industrial",
        };

        const category = tabToCategory[activeTab] || "Residential";

        const res = await fetch(
          `${API_BASE}/api/admin/projects/property-types?propertyNature=${encodeURIComponent(
            category
          )}`
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        setPropertyTypes(data);
      } catch (err) {
        console.error("❌ Failed to load property types:", err);
        setPropertyTypes([]); // Optional fallback
      }
    };

    if (["residential", "commercial", "industrial"].includes(activeTab)) {
      fetchPropertyTypes();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/projects/top-picks`);

        setTopPicks(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch top picks:", err);
      }
    };

    if (activeTab === "top-picks") {
      fetchTopPicks();
    }
  }, [activeTab]);

  useEffect(() => {
    if (counterRef.current) {
      const script = document.createElement("script");
      script.src =
        "https://counter1.optistats.ovh/private/counter.js?c=zr2u9fxr1583l6ms69zpskqsajgtp168&down=async";
      script.async = true;
      counterRef.current.appendChild(script);
    }
  }, []);

  const keywords = [
    "Flats & Apartments",
    "Houses",
    "Plots",
    "Office Space",
    "Commercial Properties",
    "Industrial Properties",
    "Dream Homes",
    "Luxury Villas",
    "Affordable Apartments",
    "Prime Locations",
    "everything right here with SKD",
  ];

  const goToProjects = (term) => {
    const params = new URLSearchParams();

    const tabToNature = {
      residential: "Residential",
      commercial: "Commercial",
      industrial: "Industrial",
    };

    if (term) params.set("search", term);
    if (selectedType) params.set("type", selectedType);

    // 👇 Add property nature if applicable
    if (tabToNature[activeTab]) {
      params.set("nature", tabToNature[activeTab]);
    }

    navigate(`/projects?${params.toString()}`);
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>
          Top Property Dealer in YEIDA (Yamuna Expressway), Noida, Greater
          Noida, Delhi, NCR | Buy, Sell, Rent Real Estate
        </title>
        <meta
          name="title"
          content="Top Property Dealer in YEIDA, Noida, Delhi, NCR | Buy, Sell, Rent Real Estate"
        />
        <meta
          name="description"
          content="Looking for trusted property dealers in YEIDA, Noida, Ghaziabad, Delhi, or Greater Noida? We offer best deals in flats, plots, commercial & residential properties."
        />
        <meta
          name="keywords"
          content="property dealer in Noida, YEIDA, Yamuna Expressway Industrial Development Area, real estate Delhi NCR, flats for sale Noida, Ghaziabad plots, Greater Noida commercial space, property agent Delhi, real estate broker NCR, land for sale Noida Extension, apartment near metro, 2BHK flat Noida, 3BHK apartment Ghaziabad, investment property Noida, buy rent sell Noida, property consultant Delhi NCR"
        />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="language" content="English" />
        <meta name="author" content="SKD PropWorld Private Limited" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="coverage" content="Worldwide" />
        <meta name="expires" content="never" />
        <meta name="revisit-after" content="7 days" />
        <meta name="googlebot" content="index, follow" />
        <meta name="theme-color" content="#ffffff" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skdpropworld.com/" />
        <meta
          property="og:title"
          content="Top Property Dealer in YEIDA, Greater Noida, Noida, Delhi, New Delhi, Delhi NCR"
        />
        <meta
          property="og:description"
          content="Search residential, commercial and rental properties in YEIDA, Yamuna Expressway, Noida, Delhi, Ghaziabad. Verified listings. Expert consultants."
        />
        "image": "https://via.placeholder.com/1200x630.png?text=SKD+PropWorld"
        <meta
          property="og:image"
          content="https://via.placeholder.com/1200x630.png?text=SKD+PropWorld"
        />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://x.com/skd_propworld" />
        <meta
          property="twitter:title"
          content="Top Property Dealer in YEIDA, Greater Noida, Noida, Delhi, NCR"
        />
        <meta
          property="twitter:description"
          content="Buy, sell, or rent properties in YEIDA, Noida, Greater Noida, Delhi NCR with top real estate consultants. Affordable pricing, verified listings, easy process."
        />
        {/* <meta
          property="twitter:image"
          content="https://skdpropworld.com/twitter-image.jpg"
        /> */}
        {/* Geo Tags */}
        <meta name="geo.region" content="IN-UP" />
        <meta
          name="geo.placename"
          content="YEIDA, Yamuna Expressway, Noida, Delhi, Ghaziabad, Greater Noida"
        />
        <meta name="geo.position" content="28.5355;77.3910" />
        <meta name="ICBM" content="28.5355, 77.3910" />
        {/* Contact Info */}
        <meta
          name="contact"
          content="email:info@skdpropworld.com, phone:+91-9091010909"
        />
        <meta
          name="address"
          content="7th & 8th Floor,Kaisons, Alpha Square, Alpha 1 Commercial Belt, Greater Noida, Uttar Pradesh, 201308, India"
        />
        <link rel="canonical" href="https://skdpropworld.com/" />
        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@id": "https://skdpropworld.com/#realestateagent",

            "@type": "RealEstateAgent",
            name: "SKD PropWorld Private Limited",
            url: "https://skdpropworld.com/",
            logo: "https://skdpropworld.com/Skd%20Propworld%20Logo4.png",
            // image: "https://skdpropworld.com/og-image.jpg",
            description:
              "We help you buy, sell, and rent property in YEIDA (Yamuna Expressway Industrial Development Area), Delhi NCR, Noida, Ghaziabad, and Greater Noida.",
            address: {
              "@type": "PostalAddress",
              streetAddress:
                "7th & 8th Floor,Kaisons, Alpha Square, Alpha 1 Commercial Belt, Greater Noida, Uttar Pradesh, 201308, India",
              addressLocality: "Greater Noida",
              addressRegion: "UP",
              postalCode: "201308",
              addressCountry: "INDIA",
            },
            sameAs: [
              "https://www.facebook.com/skdprp",
              "http://instagram.com/official.skdpropworld/",
              "https://www.linkedin.com/company/skd-propworld",
              "https://x.com/skd_propworld",
              "https://www.youtube.com/channel/UCBqqQkxHtycbgChxmW_JwAA",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+91-9091010909",
              contactType: "Customer Service",
              areaServed: "IN",
              availableLanguage: "en",
            },
          })}
        </script>
        {/* Favicon */}
        <link rel="icon" href="/TitleLogo.ico" />
      </Helmet>
      {/* **************************************** */}
      {/* the text above is for SEO */}
      <Navbar />
      <div className="homepage-hero">
        {/* Social Icons */}
        {/* <div className="social-icons">
          <a
            href="https://www.facebook.com/skdprp/"
            target="_blank"
            rel="noreferrer"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/official.skdpropworld/"
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://x.com/skd_propworld"
            target="_blank"
            rel="noreferrer"
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.youtube.com/@skdpropworld2011"
            target="_blank"
            rel="noreferrer"
          >
            <FaYoutube />
          </a>
          <a
            href="https://www.linkedin.com/company/skd-propworld/"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedinIn />
          </a>
        </div> */}

        <Container className="text-center mt-3 ">
          <h1 className="hero-heading ">
            Find
            <span className="highlights">
              {/* <span className="text-dark"> */}
              <Typewriter
                words={keywords}
                loop
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </span>
          </h1>

          {/* Search Card */}
          <div className="search-card mx-auto " ref={searchAreaRef}>
            <Nav
              variant="tabs"
              activeKey={activeTab}
              onSelect={(selectedKey) => setActiveTab(selectedKey)}
              className="justify-content-center search-tabs"
            >
              <Nav.Item>
                <Nav.Link eventKey="residential" className="post-property">
                  Residential{" "}
                  <span className="free-tag">
                    NEW <br />
                  </span>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="commercial">Commercial</Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="industrial">Industrial</Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="top-picks">
                  <span className="top-tag">TOP</span> SKD Picks ✨
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="emi">EMI Calculator</Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="list-property">
                  📢 Need Help Selling?{" "}
                </Nav.Link>
              </Nav.Item>
            </Nav>
            {["residential", "commercial", "industrial"].includes(
              activeTab
            ) && (
              <InputGroup className="search-bar justify-content-center mt-3 ">
                {activeTab === "residential" && (
                  <Form.Select
                    className="skd-category-select"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">Property Types</option>
                    {Array.isArray(propertyTypes) &&
                      propertyTypes.map((type, idx) => (
                        <option key={idx} value={type}>
                          {type}
                        </option>
                      ))}
                  </Form.Select>
                )}

                <Form.Control
                  type="text"
                  className="skd-search-input"
                  placeholder="Search by city or project or press Search to view all"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && goToProjects(searchText)
                  }
                />
                <Button
                  className="skd-search-btn"
                  onClick={() => goToProjects(searchText)}
                >
                  Search
                </Button>
              </InputGroup>
            )}

            {activeTab === "emi" && (
              <Form className="mt-3 text-center">
                <Row className="justify-content-center g-2">
                  <Col md={3}>
                    <Form.Control
                      type="number"
                      placeholder="Loan Amount (₹)"
                      value={loan}
                      onChange={(e) => setLoan(e.target.value)}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      type="number"
                      placeholder="Interest Rate (%)"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      type="number"
                      placeholder="Tenure (Years)"
                      value={tenure}
                      onChange={(e) => setTenure(e.target.value)}
                    />
                  </Col>
                  <Col md="auto">
                    <Button variant="warning" onClick={calculateEMI}>
                      Calculate
                    </Button>
                  </Col>
                </Row>
                {emi && (
                  <div className="mt-3 fs-5 text-dark">
                    <strong>Monthly EMI:</strong> ₹{emi}
                  </div>
                )}
              </Form>
            )}

            {activeTab === "list-property" && (
              <Form className="contact-selling-info mt-4 p-4 text-dark border rounded text-start bg-light">
                <h4 className="mb-3">📢 List Your Property with Us</h4>
                <div className="container">
                  <div className="row">
                    <div className="col-sm-6">
                      <p className="mb-2">
                        Want to sell your property <strong>faster</strong> and
                        at the <strong>best price</strong>?
                      </p>

                      <ul className="list-unstyled ps-3 mb-4">
                        <li>🔎 Verified Buyers & Investor Network</li>
                        <li>📈 Strategic Marketing & Online Reach</li>
                        <li>📑 Legal & Documentation Support</li>
                        <li>🌐 Property Listing on Our Platform</li>
                        <li>👨‍💼 Personalized Sales Strategy by Experts</li>
                      </ul>
                    </div>
                    <div className="col-sm-6">
                      <div className="contact-info">
                        <p className="mb-2">
                          📞 <strong>Call:</strong>{" "}
                          <a
                            href="tel:+919091010909"
                            className="text-decoration-none text-dark"
                          >
                            +91 9091010909
                          </a>
                        </p>
                        <p className="mb-2">
                          ✉️ <strong>Email:</strong>{" "}
                          <a
                            href="mailto:support@skdpropworld.com"
                            className="text-decoration-none text-dark"
                          >
                            support@skdpropworld.com
                          </a>
                        </p>
                        <p className="mb-0">
                          💬 <strong>WhatsApp:</strong>{" "}
                          <a
                            href="https://wa.me/919091010909"
                            className="text-decoration-none text-success"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Chat with us
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            )}

            {activeTab === "top-picks" && (
              <Row className="mt-4">
                {topPicks.length === 0 ? (
                  <Col className="text-center text-dark">
                    <p>No SKD Picks available right now.</p>
                  </Col>
                ) : (
                  topPicks.map((project) => (
                    <Col key={project.slug} md={4} className="mb-4">
                      <div
                        className="project-card border rounded shadow-sm h-100"
                        onClick={() => navigate(`/projects/${project.slug}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={project?.bannerImage?.url}
                          alt={project.heading}
                          className="w-100"
                          loading="lazy"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="p-3">
                          <h5 className="mb-1 text-dark">{project.heading}</h5>
                          <p className="text-muted mb-0">{project.location}</p>
                        </div>
                      </div>
                    </Col>
                  ))
                )}
              </Row>
            )}
          </div>
        </Container>
      </div>
      {/* Rest of the site */}
      <SupportWidget />
      {/* <Stats /> */}
      {/* <div style={{ marginTop: "10px" }}> */}
      <AllProjects />
      {/* </div> */}
      <ViewYouTubeSeries />
      <OfficeBearers />
      <Collaborators />
      <GlobalPresence />
      <PrimeWorkLocations />
      <Testimonials />
      <LeadForm />
      <Footer />
    </>
  );
};

export default Homepage;
