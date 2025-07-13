import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "/public/Skd Propworld Logo4.png";
// import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

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
    // <nav
    //   className={`navbar skd-navbar navbar-expand-lg shadow sticky-top ${
    //     scrolled ? "skd-scrolled-navbar" : "skd-transparent-navbar"
    //   }`}
    // >

    // <nav
    //   className={`navbar skd-navbar navbar-expand-lg sticky-top ${
    //     scrolled ? "skd-scrolled-navbar shadow" : "skd-transparent-navbar"
    //   }`}
    // >
    <nav
      className={`navbar skd-navbar navbar-expand-lg ${
        isHomepage && !scrolled
          ? "skd-absolute-navbar"
          : "sticky-top skd-scrolled-navbar shadow"
      }`}
    >
      {/* <nav
      className={`navbar skd-navbar navbar-expand-lg sticky-top ${
        scrolled ? "skd-scrolled-navbar shadow" : "skd-transparent-navbar"
      }`}
    > */}
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="SKD Logo" className="skd-logo-size" />
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
                              <li key={proj._id}>
                                <Link
                                  className="dropdown-item skd-link"
                                  to={`/projects/${proj.projectId}`}
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
                                  to={`/projects/${proj.projectId}`}
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
  );
};

export default Navbar;
