import React from "react";
import "./AboutUs.css";
import Navbar from "./Components/Navbar";
import founderImg from "/md_sir.jpg";
import Footer from "./Footer";
import LeadForm from "./Components/LeadForm";
import Testimonials from "./Testimonials";
import SupportWidget from "./Components/SupportWidget";
import { Helmet } from "react-helmet-async";

const AboutUs = () => {
  return (
    <>
      <Helmet>
        <title>About Us | SKD Propworld - Global Real Estate Experts</title>
        <meta
          name="description"
          content="Learn about SKD Propworld — a trusted global real estate leader offering investment advisory, sales, and relocation services across India (Noida, Greater Noida, YEIDA, Delhi, Ghaziabad, New Delhi, Delhi NCR), USA, UK, UAE, Singapore, and Canada."
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="About SKD Propworld | Real Estate Advisors & Experts"
        />
        <meta
          property="og:description"
          content="Explore SKD Propworld's mission, vision, and leadership in global real estate markets. Building value, trust, and relationships worldwide."
        />
        <meta property="og:url" content="https://skdpropworld.com/about" />

        {/* Twitter Meta */}
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        <meta name="twitter:title" content="About Us | SKD Propworld" />
        <meta
          name="twitter:description"
          content="Discover how SKD Propworld is transforming real estate through innovation, trust, and global expertise."
        />
      </Helmet>

      <Navbar />

      <div className="aboutus-page">
        <section className="aboutus-hero-section text-center d-flex align-items-center justify-content-center">
          <div className="container">
            <h1 className="display-4 fw-bold">About Us</h1>
            <p className="lead">Your trusted partner in global real estate</p>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-5 bg-white">
          <div className="container">
            <h2 className="mb-4 text-center fw-bold">Who We Are</h2>
            <p className="lead text-justify">
              At <strong>SKD Propworld</strong>, we redefine excellence in the
              real estate industry by delivering comprehensive and innovative
              property solutions tailored to meet the evolving needs of our
              clients. With a strong presence in{" "}
              <strong>India, USA, UK, UAE, Singapore, and Canada</strong>, we
              specialize in{" "}
              <em>
                Property Acquisitions and Sales, Real Estate Investment
                Advisory, Luxury Property Marketing,
              </em>{" "}
              and <em>Relocation Services</em>.
              <br />
              <br />
              Our mission is to empower clients with unparalleled expertise,
              state-of-the-art technology, and personalized service. Whether
              it’s acquiring a dream property or maximizing returns on
              investment, SKD Propworld is your trusted partner in navigating
              the global real estate landscape.
              <br />
              <br />
              With over two decades of experience, we take pride in being a
              trusted name for clients seeking transparency, innovation, and
              superior value in their real estate journeys.
            </p>
          </div>
        </section>

        {/* Founder Section */}
        <section
          className="aboutus-founder-section position-relative text-white"
          style={{ backgroundImage: `url(${founderImg})` }}
        >
          <div className="aboutus-overlay"></div>
          <div className="container py-5 position-relative z-2">
            <div className="row align-items-center">
              <div className="col-lg-3 text-start">
                <h3 className="fw-bold mb-3 mt-5">
                  From the Desk of Our Founder
                </h3>
                <p className="lead mb-3">
                  “Welcome to SKD Propworld, where your property aspirations
                  meet our passion for excellence. Real estate is not just about
                  transactions — it's about building long-term relationships and
                  adding real value to your investments.”
                </p>
                <p>
                  “We are committed to transparency, trust, and innovation. I
                  invite you to explore a new dimension of real estate with us —
                  one that focuses on personalized service, strategic advice,
                  and cutting-edge technology.”
                </p>
                <p className="fw-semibold mt-4">- Er. Pawan Kumar Mishra</p>
              </div>
              <div className="col-lg-6 d-none d-lg-block"></div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="pb-5 aboutus-mission-section">
          <div className="container">
            <h2 className="mb-5 text-center fw-bold">Mission & Vision</h2>
            <div className="row gx-4 gy-4">
              <div className="col-md-6">
                <div className="aboutus-mission-box h-100">
                  <h4 className="fw-semibold mb-3">Our Mission</h4>
                  <p>
                    To revolutionize the real estate industry by providing
                    innovative, technology-driven solutions that empower
                    individuals and businesses to achieve their property goals
                    with confidence, trust, and maximum value.
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="aboutus-vision-box h-100">
                  <h4 className="fw-semibold mb-3">Our Vision</h4>
                  <p>
                    To be a globally recognized leader in real estate solutions,
                    setting industry benchmarks for innovation, integrity, and
                    client satisfaction, while transforming the way people buy,
                    sell, and invest in properties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {/* <section className="py-5 bg-white">
          <div className="container">
            <h2 className="mb-5 text-center fw-bold">Client Testimonials</h2>
            <div className="row g-4">
              {[
                {
                  quote:
                    "SKD Propworld exceeded our expectations with their professionalism and attention to detail. Highly recommend!",
                  author: "Client A",
                },
                {
                  quote:
                    "Thanks to SKD Propworld, we found our dream property in record time!",
                  author: "Client B",
                },
                {
                  quote:
                    "Their advisory services were a game-changer for our real estate investments.",
                  author: "Client C",
                },
              ].map((testimonial, index) => (
                <div className="col-md-4" key={index}>
                  <div className="aboutus-testimonial animate-fade-in">
                    <p className="fst-italic">“{testimonial.quote}”</p>
                    <p className="fw-semibold text-end">
                      - {testimonial.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        <Testimonials />
      </div>
      <LeadForm />
      <SupportWidget />
      <Footer />
    </>
  );
};

export default AboutUs;
