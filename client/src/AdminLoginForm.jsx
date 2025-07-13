import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Components/Navbar";
import loginImg from "../public/login.gif"; // adjust if needed
import Footer from "./Footer";
import SupportWidget from "./Components/SupportWidget";

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleClick = () => {
    navigate("/admin/signup");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login successful");
        setTimeout(() => {
          login(data.admin);
          navigate("/admin/dashboard");
        }, 1500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5" style={{ maxWidth: "850px" }}>
        <div
          className="row shadow rounded overflow-hidden align-items-center"
          style={{ backgroundColor: "#fff" }}
        >
          {/* Left Side - Login Form */}
          <div className="col-md-7 p-4">
            <h3 className="fw-bold mb-4">Admin Login</h3>
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: "40px" }}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#888",
                    }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <button type="submit" className="btn btn-primary w-100 mb-2">
                Login
              </button>
              <button
                type="button"
                onClick={handleClick}
                className="btn btn-outline-primary w-100"
              >
                Back to Sign Up
              </button>
            </form>
          </div>

          {/* Right Side - Image */}
          <div className="col-md-5 text-center py-4">
            <img
              src={loginImg}
              alt="Login visual"
              style={{
                width: "160px",
                height: "160px",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
      <SupportWidget />
      <br />
      <br /> <br /> <br />
      <br /> <br /> <br />
      <br />
      <Footer />
    </>
  );
}

export default AdminLoginForm;
