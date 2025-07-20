import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "/public/Skd Propworld Logo4.png";
// import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

/* helper → mobile breakpoint */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
};

const Navbar = () => {
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [projects, setProjects] = useState([]);
  const isMobile = useIsMobile();

  /* fetch visible projects once */
  useEffect(() => {
    (async () => {
      try {
        const { VITE_API_BASE_URL } = import.meta.env;
        const { data } = await axios.get(
          `${VITE_API_BASE_URL}/api/admin/projects`
        );
        setProjects(data.filter((p) => p.visible));
      } catch (err) {
        console.error("Error fetching projects", err);
      }
    })();
  }, []);

  /* sticky shadow */
  useEffect(() => {
    const isHome = location.pathname === "/";

    if (!isHome) {
      setScrolled(true);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);

    // Set initial scroll state
    setScrolled(window.scrollY > 10);

    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  /* group by propertyType */
  const grouped = projects.reduce((acc, p) => {
    (acc[p.propertyType || "Other"] ??= []).push(p);
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        {/* <title>
          SKD Propworld | Real Estate in Noida, Greater Noida, YEIDA
        </title> */}
        <meta
          name="description"
          content="Explore top real estate projects across Noida, Greater Noida, YEIDA, and Delhi-NCR with SKD Propworld. Find residential, commercial, and investment properties with verified data."
        />
        <meta
          name="keywords"
          content="SKD Propworld, Noida properties, Greater Noida real estate, YEIDA projects, Delhi NCR real estate"
        />
        <link rel="canonical" href="https://skdpropworld.com/" />

        {/* Open Graph for branding */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="SKD Propworld – Trusted Real Estate Advisor in NCR"
        />
        <meta
          property="og:description"
          content="Leading real estate advisory for Noida, Greater Noida, and YEIDA. Browse top projects, view maps, and connect with our experts."
        />
        <meta property="og:url" content="https://skdpropworld.com/" />
        {/* No og:image included intentionally */}

        {/* Twitter card */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="SKD Propworld – Real Estate Experts"
        />
        <meta
          name="twitter:description"
          content="Explore property listings and real estate maps in Delhi NCR, powered by SKD Propworld."
        />
      </Helmet>

      <nav
        className={`navbar skd-navbar navbar-expand-lg ${
          isHomepage && !scrolled
            ? "skd-absolute-navbar"
            : "sticky-top skd-scrolled-navbar shadow"
        }`}
      >
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src={logo}
              alt="SKD Logo"
              className="skd-logo-size"
              loading="eager"
            />
          </Link>

          {/* Mobile toggle */}
          <button
            className="navbar-toggler bg-light"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Links */}
          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {/* Home */}
              <li className="nav-item">
                <Link className="nav-link skd-menu-item" to="/">
                  Home
                </Link>
              </li>

              {/* Projects – grouped */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle skd-menu-item"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  Projects
                </a>

                <ul className="dropdown-menu skd-menu">
                  {Object.entries(grouped).map(([type, list]) => {
                    const safeId = `submenu-${type
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`;
                    return (
                      <li key={type} className="skd-dropdown-submenu">
                        {isMobile ? (
                          <>
                            <div
                              className="dropdown-item d-flex justify-content-between align-items-center"
                              data-bs-toggle="collapse"
                              data-bs-target={`#${safeId}`}
                              onClick={(e) => e.stopPropagation()}
                              style={{ cursor: "pointer" }}
                            >
                              <span>{type}</span>
                              {/* <span>▼</span> */}
                            </div>

                            <ul
                              className="collapse list-unstyled ps-3"
                              id={safeId}
                            >
                              {list.map((proj) => (
                                <li key={proj.slug}>
                                  <Link
                                    className="dropdown-item skd-link"
                                    to={`/projects/${proj.slug}`}
                                  >
                                    {proj.heading}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <>
                            <a
                              className="dropdown-item dropdown-toggle"
                              href="#"
                              onClick={(e) => e.preventDefault()}
                            >
                              {type}
                            </a>
                            <ul className="dropdown-menu">
                              {list.map((proj) => (
                                <li key={proj._id}>
                                  <Link
                                    className="dropdown-item skd-link"
                                    to={`/projects/${proj.slug}`} // ✅ NEW
                                  >
                                    {proj.heading}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>

              {/* Other quick links */}
              {[
                ["Maps", "/maps"],
                // ["Services", "/services"],
                ["Blogs", "/all-blogs"],
                ["About Us", "/about-us"],
                ["Gallery", "/view-gallery"],
                ["Career@ SKD", "/career@skd"],
                ["Contact Us", "/contact-us"],
              ].map(([label, path]) => (
                <li key={path} className="nav-item">
                  <Link className="nav-link skd-menu-item" to={path}>
                    {label}
                  </Link>
                </li>
              ))}

              {/* Office Bearers */}
              {/* Office Bearers */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle skd-menu-item"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  Office Bearers
                </a>

                <ul className="dropdown-menu">
                  {/* पूरी लिस्ट – कार्ड पेज */}
                  {/* <li> */}
                  {/* <Link className="dropdown-item" to="/office-bearers">
                    Meet Our Leaders
                  </Link> */}
                  {/* </li> */}
                  {/* <li></li> */}

                  {/* इंडिविजुअल सेक्शन */}
                  <li>
                    <Link className="dropdown-item" to="/team#pawan-sir">
                      Managing Director
                    </Link>
                  </li>
                  <hr className="dropdown-divider" />
                  <li>
                    <Link className="dropdown-item" to="/team#aarti-mam">
                      Director
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Admin */}
              <li className="nav-item">
                <Link
                  className="nav-link skd-menu-item skd-admin-link"
                  to="/admin/login"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
