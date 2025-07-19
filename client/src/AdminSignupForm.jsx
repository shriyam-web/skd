import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css"; // or './main.css' depending on your project
import AdminLoginForm from "./AdminLoginForm";
import img from "../public/gif2-img.gif";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Components/Navbar";
import Footer from "./Footer";
import SupportWidget from "./Components/SupportWidget";

const AdminSignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    secretCode: "", // ✅ Add this
  });
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/admin/login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (formData.email.includes(".com.com")) {
      toast.warning("Check your email — looks like it has repeated '.com'");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password === "12345678") {
      toast.warning("Password is too common.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/admin/signup`, formData);
      toast.success(res.data.message);
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Signup failed. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-3" style={{ maxWidth: "940px" }}>
        <div
          className="row justify-content-center align-items-center shadow rounded overflow-hidden"
          style={{ backgroundColor: "#fff" }}
        >
          {/* Left Form Section */}
          <div className="col-md-6 p-5">
            <h2 className="text-center mb-4 fw-bold text-dark">
              Admin Registration
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-semibold">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password with Eye Icon */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">
                  Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Create a password"
                    required
                  />
                  <span
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </span>
                </div>
              </div>

              {/* Secret Code */}
              <div className="mb-4">
                <label htmlFor="secretCode" className="form-label fw-semibold">
                  Secret Code
                </label>
                <input
                  type="text"
                  name="secretCode"
                  value={formData.secretCode}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter the secret code provided by the Company"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary w-50 me-2">
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={handleClick}
                  className="btn btn-outline-primary w-50"
                >
                  Go to Login Page
                </button>
              </div>
            </form>

            <ToastContainer position="bottom-left" autoClose={3000} />
          </div>

          {/* Right Image Section */}
          <div className="col-md-6 d-none d-md-block p-0">
            <img
              src={img}
              alt="Signup visual"
              style={{ width: "60vh", height: "100%", objectFit: "cover" }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <SupportWidget />
      <br /> <br />
      <Footer />
    </>
  );
};

export default AdminSignupForm;
