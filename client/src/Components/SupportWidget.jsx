import React, { useState } from "react";
import { FaPhone, FaWhatsapp, FaEnvelope, FaHeadset } from "react-icons/fa";
import "./SupportWidget.css";
import { Helmet } from "react-helmet-async";

const SupportWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Contact Support | SKD Propworld - Real Estate Help Desk</title>
        <meta
          name="title"
          content="Contact Support | SKD Propworld - Real Estate Help Desk"
        />
        <meta
          name="description"
          content="Need help? Contact SKD Propworld for property consultations, buying, selling, or rental assistance. Call, WhatsApp or email our support team today."
        />
        <meta
          name="keywords"
          content="SKD Propworld support, contact real estate agent, WhatsApp property help, Noida property consultant, support desk"
        />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="author" content="SKD Propworld" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contact Support | SKD Propworld" />
        <meta
          property="og:description"
          content="Call, WhatsApp or email SKD Propworld’s expert team for property buying, selling or rental help across Noida, YEIDA, Greater Noida & Delhi NCR."
        />
        <meta
          property="og:url"
          content="https://www.skdpropworld.com/support"
        />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Contact Support | SKD Propworld" />
        <meta
          name="twitter:description"
          content="Get real estate help with SKD Propworld. Talk to our team on call, WhatsApp or email for quick support."
        />
      </Helmet>

      <div className="support-widget ">
        <div className={`support-box ${open ? "open" : ""}`}>
          <button
            className="support-toggle support-toggle glow-ring"
            onClick={() => setOpen(!open)}
          >
            <FaHeadset className="icon" />
            <span className="blink-text">We're here</span>
          </button>

          {open && (
            <div className="support-options">
              <a href="tel:+919091010909" className="support-option">
                <FaPhone /> +91 9091010909
              </a>
              <a
                href="https://wa.me/919091010909"
                target="_blank"
                rel="noopener noreferrer"
                className="support-option"
              >
                <FaWhatsapp /> WhatsApp Chat
              </a>
              <a href="mailto:info@skdpropworld.com" className="support-option">
                <FaEnvelope /> info@skdpropworld.com
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SupportWidget;
