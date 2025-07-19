import React from "react";
import Navbar from "./Navbar";
import Footer from "../Footer";
import LeadForm from "./LeadForm";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Services = () => {
  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>
          Our Services | Buy, Sell, Consult Real Estate - SKD Propworld
        </title>
        <meta
          name="title"
          content="Our Services | Buy, Sell, Consult Real Estate - SKD Propworld"
        />
        <meta
          name="description"
          content="Explore SKD Propworld’s real estate services including property buying, selling, and professional consulting. Trusted solutions across YEIDA, Noida, Greater Noida & Delhi NCR."
        />
        <meta
          name="keywords"
          content="SKD Propworld, real estate services, buy property, sell property, property consultants, Noida, Greater Noida, YEIDA, Delhi NCR"
        />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="author" content="SKD Propworld" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Our Services | SKD Propworld" />
        <meta
          property="og:description"
          content="Buy, sell, or consult with SKD Propworld for expert real estate guidance in Noida, YEIDA, Greater Noida, and Delhi NCR."
        />
        <meta
          property="og:url"
          content="https://www.skdpropworld.com/services"
        />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Our Services | SKD Propworld" />
        <meta
          name="twitter:description"
          content="Explore real estate services by SKD Propworld - trusted for property buying, selling, and consulting in Noida, YEIDA & Delhi NCR."
        />
      </Helmet>

      <Navbar />
      <div className="container-fluid  text-white py-5">
        <div className="container text-center">
          <h2 className="mb-5">Our Services</h2>

          <div className="row justify-content-center">
            {/* Sell Property */}
            <div className="col-md-4 mb-4">
              <div className="p-4 border border-light rounded shadow-sm h-100 text-white bg-white">
                <div className="mb-3">
                  <i className="bi bi-cash-coin fs-1 text-primary"></i>
                </div>
                <h4 className="text-dark">Sell Your Property</h4>
                <p className="text-dark">
                  Sell your properties by listing on multiple platforms,
                  marketing to potential buyers, and handling negotiations to
                  get the best deal.
                </p>
                <Link to="/" className="btn btn-outline-dark">
                  Sell Property
                </Link>
              </div>
            </div>

            {/* Buy Property */}
            <div className="col-md-4 mb-4 ">
              <div className="p-4 border border-light rounded shadow-sm h-100 text-white bg-white">
                <div className="mb-3">
                  <i className="bi bi-house-door fs-1 text-success"></i>
                </div>
                <h4 className="text-dark">Buy Real Estate</h4>
                <p className="text-dark">
                  Assistance in purchasing properties for investment,
                  residential living, or rental purposes with trusted guidance
                  throughout.
                </p>
                <Link to="/" className="btn btn-outline-dark">
                  Buy Property
                </Link>
              </div>
            </div>

            {/* Real Estate Consulting */}
            <div className="col-md-4 mb-4">
              <div className="p-4 border border-light rounded shadow-sm h-100 bg-white">
                <div className="mb-3">
                  <i className="bi bi-bar-chart-line fs-1 text-warning "></i>
                </div>
                <h4 className="text-dark">Real Estate Consulting</h4>
                <p className="text-dark">
                  We provide expert consulting on market analysis, property
                  valuation, and strategic investment opportunities.
                </p>
                <Link to="/" className="btn btn-outline-dark">
                  Get Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LeadForm />
      <Footer />
    </>
  );
};

export default Services;
