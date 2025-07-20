import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./CareerSKD.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import SupportWidget from "./SupportWidget";
import Footer from "../Footer";
import { Helmet } from "react-helmet-async";

const CareerSKD = () => {
  const [position, setPosition] = useState("");
  const [joinTime, setJoinTime] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    position: "",
    positionOther: "",
    joining: "",
    joiningOther: "",
    address: "",
    experience: "",
    qualification: "",
    percentage: "",
    resume: null, // ✅ New field
  });

  // ✅ Correct handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // ✅ Single correct handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name.trim().length < 3) {
      toast.error("Name should be at least 3 characters long.");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Enter a valid 10-digit phone number.");
      return;
    }

    if (Number(formData.percentage) < 35) {
      toast.warning("Percentage seems low. Are you sure?");
    }

    try {
      const submissionData = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          submissionData.append(key, formData[key]);
        }
      }

      await axios.post(`${API_BASE}/api/career`, submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Application submitted successfully!");
      setFormSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to submit. Please try again later.");
    }
  };

  if (formSubmitted) {
    return (
      <>
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          aria-modal="true"
          role="dialog"
          style={{ backgroundColor: "rgba(248,249,250,255)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center p-4">
              <i
                className="bi bi-check-circle-fill text-success"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5 className="mt-3 text-success">
                Your form has been submitted!
              </h5>
              <p className="text-white">
                We'll review your application and update you via email from
                <br />
                <strong>hr@skdpropworld.com</strong>.
              </p>
              <p className="text-white">We hope to work with you soon!</p>
              <button
                type="button"
                className="btn btn-outline-secondary mt-2"
                onClick={() => setFormSubmitted(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        {/* Page Title */}
        <title>Career Opportunities at SKD Propworld Pvt. Ltd.</title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Apply for exciting career opportunities at SKD Propworld Pvt. Ltd. Join our team and grow your career in real estate across Delhi NCR."
        />

        {/* Keywords */}
        <meta
          name="keywords"
          content="career, SKD Propworld, job openings, sales executive, real estate jobs, join SKD, career in Delhi NCR, hiring now"
        />

        {/* Canonical */}
        <link rel="canonical" href="https://www.skdpropworld.com/careers" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Careers at SKD Propworld Pvt. Ltd."
        />
        <meta
          property="og:description"
          content="Looking for a career in real estate? SKD Propworld Pvt. Ltd. is hiring! Explore current job openings and apply online today."
        />
        <meta
          property="og:image"
          content="https://www.skdpropworld.com/assets/career-banner.jpg"
        />
        <meta
          property="og:url"
          content="https://www.skdpropworld.com/careers"
        />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Careers at SKD Propworld Pvt. Ltd."
        />
        <meta
          name="twitter:description"
          content="Join the team at SKD Propworld. Check out current job opportunities and apply today!"
        />
        <meta
          name="twitter:image"
          content="https://www.skdpropworld.com/assets/career-banner.jpg"
        />
      </Helmet>
      <Navbar />
      <div className="career-split container-fluid px-md-5 py-5 ml-3">
        <div className="row">
          {/* Left Section */}
          <div className="col-md-6 career-left-image-wrapper">
            <div className="career-heading-wrapper mb-4 px-3 ml-3">
              <h1
                className="career-title"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                }}
              >
                Career @ SKD
              </h1>
              <p
                className="career-subtitle"
                style={{
                  fontFamily: "Open Sans, sans-serif",
                  fontSize: "1.1rem",
                  color: "#555",
                  marginTop: "0.5rem",
                }}
              >
                Your talent deserves a stage.
                <br />
                Join <strong>SKD Propworld Pvt. Ltd.</strong> — where ambition
                meets endless opportunity.
              </p>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="col-md-5 d-flex flex-column justify-content-center">
            <div className="career-form-box p-4 bg-white rounded shadow-sm">
              <h5 className="fw-bold mb-3 text-dark">Application Form</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      className="form-control"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="form-control"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      className="form-control"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  {/* <div className="col-md-6">
                    <input
                      type="date"
                      name="dob"
                      className="form-control"
                      placeholder="Date of Birth"
                      required
                      onChange={handleChange}
                    />
                  </div> */}
                  <div className="col-md-6">
                    <label htmlFor="dob" className="form-label">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      className="form-control"
                      required
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <select
                      name="position"
                      className="form-select"
                      required
                      onChange={(e) => {
                        handleChange(e);
                        setPosition(e.target.value);
                      }}
                    >
                      <option value="">Position Applied For</option>
                      <option value="Sales Executive">Sales Executive</option>
                      <option value="Sales Manager">Sales Manager</option>
                      <option value="Team Leader">Team Leader</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {position === "Other" && (
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="positionOther"
                        placeholder="Specify Other Position"
                        className="form-control"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}
                  <div className="col-md-6">
                    <select
                      name="joining"
                      className="form-select"
                      required
                      onChange={(e) => {
                        handleChange(e);
                        setJoinTime(e.target.value);
                      }}
                    >
                      <option value="">Joining Availability</option>
                      <option value="Immediate">Immediate</option>
                      <option value="15 Days">15 Days</option>
                      <option value="1 Month">1 Month</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {joinTime === "Other" && (
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="joiningOther"
                        placeholder="Specify Joining Time"
                        className="form-control"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}
                  <div className="col-12">
                    <textarea
                      name="address"
                      rows="2"
                      className="form-control"
                      placeholder="Current Address"
                      required
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="experience"
                      placeholder="Experience (in months)"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="qualification"
                      placeholder="Highest Qualification Degree"
                      className="form-control"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="number"
                      name="percentage"
                      placeholder="Qualification %"
                      className="form-control"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="resume" className="form-label">
                      Upload Resume
                    </label>
                    <input
                      type="file"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      className="form-control"
                      placeholder="Upload your resume"
                      required
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          resume: e.target.files[0],
                        }))
                      }
                    />
                    <small className="text-muted">
                      Please upload your Resume/CV (PDF preferred). Supported
                      formats: PDF, DOC, DOCX. Max size: 5 MB.
                    </small>
                  </div>

                  <div className="col-12 d-grid mt-2">
                    <button
                      type="submit"
                      className="btn btn-warning fw-semibold shadow-sm mt-3"
                    >
                      Submit Application
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
      <SupportWidget />
      <Footer />
    </>
  );
};

export default CareerSKD;
