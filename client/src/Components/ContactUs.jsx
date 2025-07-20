import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import "./ContactUs.css";
import Navbar from "./Navbar";
import LeadForm from "./LeadForm";
import SupportWidget from "./SupportWidget";
import Footer from "../Footer";

const ContactUs = () => {
  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>
          Contact SKD Propworld | Property Dealer in Noida, YEIDA, Greater Noida
        </title>
        <meta
          name="title"
          content="Contact SKD Propworld | Property Dealer in Noida, YEIDA, Greater Noida"
        />
        <meta
          name="description"
          content="Get in touch with SKD Propworld – your trusted real estate partner in Noida, Greater Noida, and YEIDA. Call, WhatsApp, or visit us today!"
        />
        <meta
          name="keywords"
          content="Contact SKD Propworld, Real Estate Agent Noida, Property Dealer YEIDA, Real Estate Greater Noida, WhatsApp SKD Propworld, Call SKD Propworld, Office Location SKD"
        />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Contact SKD Propworld | Property Dealer in Noida, YEIDA, Greater Noida"
        />
        <meta
          property="og:description"
          content="Looking for property advice or want to visit our office? Reach out to SKD Propworld via phone, email, or WhatsApp. We’re here to help!"
        />
        <meta property="og:url" content="https://skdpropworld.com/contact" />
        {/* og:image intentionally skipped */}

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="Contact SKD Propworld | Property Dealer in Noida, YEIDA, Greater Noida"
        />
        <meta
          name="twitter:description"
          content="Call, WhatsApp, or email SKD Propworld for all your property needs in Noida, YEIDA, and Greater Noida. Visit us today!"
        />
        {/* twitter:image intentionally skipped */}
      </Helmet>

      <Navbar />
      <div className="contact-container">
        <div className="contact-left">
          <h2 className="text-white">We’d Love to Hear From You</h2>
          <p>Follow us on our social platforms or get in touch directly!</p>

          <div className="social-buttons">
            <a href="https://www.facebook.com/skdprp" className="btn facebook">
              <FaFacebookF className="icon" /> Facebook
            </a>
            <a
              href="https://www.instagram.com/official.skdpropworld/"
              className="btn instagram"
            >
              <FaInstagram className="icon" /> Instagram
            </a>
            <a href="https://x.com/skd_propworld" className="btn twitter">
              <FaTwitter className="icon" /> X (Twitter)
            </a>
            <a
              href="https://www.linkedin.com/company/skd-propworld"
              className="btn linkedin"
            >
              <FaLinkedinIn className="icon" /> LinkedIn
            </a>
            <a
              href="https://www.youtube.com/channel/UCBqqQkxHtycbgChxmW_JwAA"
              className="btn youtube"
            >
              <FaYoutube className="icon" /> YouTube
            </a>
          </div>

          <div className="contact-infos">
            <div>
              <FaPhone className="icon" /> +91 90910 10909
            </div>
            <div>
              <FaEnvelope className="icon" /> info@skdpropworld.com
            </div>
            <div>
              <FaMapMarkerAlt className="icon" /> 7th & 8th Floor,Kaisons, Alpha
              Square, Alpha 1 Commercial Belt, Greater Noida, Uttar Pradesh,
              201308, India
            </div>
            <a href="https://wa.me/919091010909" className="whatsapp-line ">
              <FaWhatsapp className="icon" /> Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="contact-right">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.3054121375135!2d77.5098572!3d28.4703476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ceb013449a75f%3A0xd91a4510cbf6f67d!2sSKD%20PROPWORLD%20PRIVATE%20LIMITED!5e0!3m2!1sen!2sin!4v1752752418076!5m2!1sen!2sin"
          ></iframe>
        </div>
      </div>
      <LeadForm />
      <SupportWidget />
      <Footer />
    </>
  );
};

export default ContactUs;
