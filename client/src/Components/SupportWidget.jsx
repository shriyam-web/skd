import React, { useState } from "react";
import { FaPhone, FaWhatsapp, FaEnvelope, FaHeadset } from "react-icons/fa";
import "./SupportWidget.css";

const SupportWidget = () => {
  const [open, setOpen] = useState(false);

  return (
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
  );
};

export default SupportWidget;
