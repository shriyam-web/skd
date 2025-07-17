import React from "react";
import Visitor_Count from "./Components/Visitor_Count";
import "./Footer.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Footer = () => {
  const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const toggleVisibility = () => {
        setVisible(window.scrollY > 300);
      };
      window.addEventListener("scroll", toggleVisibility);
      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    return visible ? (
      <button
        className="scroll-to-top"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    ) : null;
  };
  const QUICK_LINKS = [
    ["Home", "/"],
    ["Projects", "/projects"],
    ["Blogs", "/all-blogs"],
    ["Project Maps", "/maps"],
    ["Career @ SKD", "/career@skd"],

    ["Services", "/services"],
  ];
  return (
    <footer className="bg-dark text-light pt-5 pb-4">
      <div className="container">
        <div className="row text-md-start text-center">
          {/* Brand */}
          <div className="col-md-4 mb-4">
            <h4 className="text-warning fw-bold">SKD PROPWORLD</h4>
            <p className="text-light">
              SKD Propworld Pvt. Ltd. is a leading real estate company in India,
              offering residential and commercial properties across key cities.
              We help clients buy, sell, and invest in premium flats, luxury
              villas, office spaces, and plots.
            </p>
            <p className="text-light">
              With years of experience and global reach, we are your trusted
              partner for property solutions in Noida, Delhi, Greater Noida,
              Ghaziabad and international places.
            </p>
          </div>

          <div className="col-md-2 mb-4">
            <h5 className="text-uppercase">Quick Links</h5>
            <ul className="list-unstyled">
              {QUICK_LINKS.map(([label, path]) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-light text-decoration-none d-block py-1 footer-link"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5 className="text-uppercase">Contact</h5>
            <p className="mb-2">
              <i className="bi bi-envelope-fill text-warning me-2" />
              <a
                href="mailto:info@skdpropworld.com"
                className="text-light text-decoration-none footer-link"
              >
                info@skdpropworld.com
              </a>
            </p>
            <p className="mb-2">
              <i className="bi bi-telephone-fill text-warning me-2" />
              <a
                href="tel:+919876543210"
                className="text-light text-decoration-none footer-link"
              >
                +91 90910 10909
              </a>
            </p>
            <p>
              <i className="bi bi-geo-alt-fill text-warning me-2" />
              7th & 8th Floor,Kaisons, Alpha Square, Alpha 1 Commercial Belt,
              Greater Noida, Uttar Pradesh, 201308, India
            </p>
            <a
              href="https://g.co/kgs/3ErcQyb"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-warning btn-sm mt-2 fw-semibold"
            >
              <i className="bi bi-geo-alt me-1" />
              View On Google Map
            </a>
          </div>

          <div className="col-md-3 mb-4">
            <h5 className="text-uppercase">Follow Us</h5>
            <div className="d-flex justify-content-center justify-content-md-start gap-3 fs-5 mb-3">
              <a
                href="https://www.facebook.com/skdprp/"
                className="footer-icon"
                aria-label="Facebook"
              >
                <i className="bi bi-facebook" />
              </a>
              <a
                href="https://www.instagram.com/official.skdpropworld/"
                className="footer-icon"
                aria-label="Instagram"
              >
                <i className="bi bi-instagram" />
              </a>
              <a
                href="https://x.com/skd_propworld"
                className="footer-icon"
                aria-label="Twitter"
              >
                <i className="bi bi-twitter" />
              </a>
              <a
                href="https://in.linkedin.com/company/skd-propworld"
                className="footer-icon"
                aria-label="LinkedIn"
              >
                <i className="bi bi-linkedin" />
              </a>
              <a
                href="https://www.youtube.com/@skdpropworld2011"
                className="footer-icon"
                aria-label="YouTube"
              >
                <i className="bi bi-youtube" />
              </a>
            </div>

            <div className="fs-4 fw-bold text-warning">
              <Visitor_Count />
            </div>
          </div>
        </div>

        <div className="text-center pt-3 mt-4 border-top border-secondary small footer-copy">
          <p title="Designed & Developed by Shriyam Parashar">
            &copy; {new Date().getFullYear()} SKD Propworld Private Limited. All
            rights reserved. <br />
            <span className="">| Powered by v.1.5 |</span>
          </p>
        </div>
      </div>
      <ScrollToTopButton />
    </footer>
  );
};

export default Footer;
