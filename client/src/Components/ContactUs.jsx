import React from "react";

import "./ContactUs.css";
import Navbar from "./Navbar";
import Footer from "../Footer";
import LeadForm from "./LeadForm";
import SupportWidget from "./SupportWidget";

const ContactUs = () => {
  return (
    <>
      <Navbar />
      <div className="contact-page bg-light">
        {/* Hero Section */}
        <section className="contact-hero text-center text-white d-flex align-items-center justify-content-center">
          <div className="container">
            <h1 className="display-4 fw-bold">Contact Us</h1>
            <p className="lead">
              Reach out for any real estate inquiries or support
            </p>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="contact-main py-5">
          <div className="container">
            <div className="row g-5">
              {/* Lead Form */}
              <div className="col-md-6">
                {/* <h2 className="mb-4 fw-bold">Send Us a Message</h2> */}
                <br />
                <LeadForm />
              </div>

              {/* Contact Details */}
              <div className="col-md-6">
                <h2 className="mb-4 fw-bold">Contact Information</h2>
                <div className="contact-info">
                  <p>
                    <strong>Office Address:</strong>
                    <br />
                    7th & 8th Floor, Kaisons, Alpha Square,
                    <br />
                    Alpha 1 Commercial Belt, Greater Noida,
                    <br />
                    Uttar Pradesh 201308, India
                  </p>
                  <p>
                    <strong>Email:</strong>
                    <br />
                    <a href="mailto:info@skdpropworld.com">
                      info@skdpropworld.com
                    </a>
                  </p>
                  <p>
                    <strong>Phone:</strong>
                    <br />
                    <a href="tel:+919091010909">+91 90910 10909</a>
                  </p>
                </div>

                {/* Google Map */}
                <div className="map-responsive">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7014.441696976033!2d77.5103178782959!3d28.472894938973408!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ceb013449a75f%3A0xd91a4510cbf6f67d!2sSKD%20PROPWORLD%20PRIVATE%20LIMITED!5e0!3m2!1sen!2sin!4v1750833283344!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="SKD Propworld Office Location"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <SupportWidget />
      <Footer />
    </>
  );
};

export default ContactUs;
