import React from "react";
import Navbar from "./Navbar";
import Footer from "../Footer";
import LeadForm from "./LeadForm";
import { Link } from "react-router-dom";

const Services = () => {
  return (
    <>
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
