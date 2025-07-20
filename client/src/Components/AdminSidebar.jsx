import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Update the path if needed
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import "/AdminSidebar.css";
import "./AdminSidebar.css";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 20) return "Good Evening";
  return "Good Night";
};

const getWeatherEmoji = (condition) => {
  const cond = condition.toLowerCase();
  if (cond.includes("clear")) return "☀️";
  if (cond.includes("cloud")) return "☁️";
  if (cond.includes("rain")) return "🌧️";
  if (cond.includes("snow")) return "❄️";
  if (cond.includes("thunder")) return "⛈️";
  return "🌤️";
};

const AdminSidebar = ({ adminName, remainingTime }) => {
  const { admin } = useAuth();
  const displayName = (adminName || admin?.name || "Admin")
    .trim()
    .split(" ")[0];

  const location = useLocation();
  const [weatherInfo, setWeatherInfo] = useState(null);
  const { logout } = useAuth(); // ✅ ADD THIS LINE
  const navigate = useNavigate(); // ✅ ADD THIS LINE

  useEffect(() => {
    const fetchWeatherAndLocation = async (lat, lon) => {
      const weatherApiKey = "7991ea09af0f2a838799e96eae077ffd";
      const openCageApiKey = "d38c7629d1194ce588a9cdb5c874c34f";

      try {
        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`
        );
        const weather = weatherRes.data.weather[0].main;
        const temp = Math.round(weatherRes.data.main.temp);
        const emoji = getWeatherEmoji(weather);

        const locationRes = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${openCageApiKey}`
        );
        const components = locationRes.data.results[0]?.components;
        const country = components?.country || "Unknown";

        setWeatherInfo({
          condition: weather,
          temperature: temp,
          country,
          emoji,
        });
      } catch (err) {
        console.error("Weather or location fetch failed:", err);
      }
    };

    const fallbackToIP = async () => {
      try {
        const res = await axios.get("https://ipapi.co/json/");
        const { latitude, longitude } = res.data;
        fetchWeatherAndLocation(latitude, longitude);
      } catch (err) {
        console.warn("IP-based location failed, falling back to Delhi.");
        fetchWeatherAndLocation(28.6139, 77.209);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherAndLocation(latitude, longitude);
      },
      () => {
        fallbackToIP();
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
      }
    );
  }, []);

  const navItems = [
    {
      path: "/admin/projects-leads",
      label: "Project Leads",
      icon: "bi-people-fill",
    },
    {
      path: "/admin/contact-us-responeses",
      label: "Conatct-Us Form Responses",
      icon: "bi-people-fill",
    },
    {
      path: "/admin/control-projects",
      label: "Project Manager",
      icon: "bi-folder-plus",
    },
    {
      path: "/admin/blogs-manager",
      label: "Blogs Manager",
      icon: "bi-journal-plus",
    },
    { path: "/admin/maps-manager", label: "Maps Manager", icon: "bi-map" },
    {
      path: "/admin/gallery-manager",
      label: "Gallery Control",
      icon: "bi-images",
    },
    {
      path: "/admin/career-applications",
      label: "Career Applications ",
      icon: "bi-briefcase-fill",
    },
    {
      path: "/admin/profile",
      label: "Profile & Site Control",
      icon: "bi-person-circle",
    },
  ];

  const handleSidebarLogout = () => {
    logout(navigate); // Clear session/token

    toast.info("You're logged out. Redirecting...", {
      position: "top-center",
      autoClose: 2000,
      onClose: () => navigate("/admin/login"),
    });
  };

  return (
    <div
      className="d-flex flex-column bg-light shadow-sm"
      style={{
        width: "260px",
        height: "100%",
        // height: "100vh",
        borderRight: "1px solid #ddd",
      }}
    >
      {/* Header */}
      <div className="p-3 ">
        <Link
          to="/admin/dashboard"
          className="d-flex align-items-center mb-3 text-decoration-none"
        >
          <i className="bi bi-speedometer2 fs-3 me-2 text-primary"></i>
          <span className="fs-4 fw-bold text-dark">Admin Panel</span>
        </Link>

        <div className="ps-1">
          <h6 className="fw-semibold text-dark mb-0">{getGreeting()},</h6>
          <p
            className="text-warning fw-bold mb-1"
            style={{ fontSize: "1.25rem" }}
          >
            {displayName} 👋
          </p>

          <div className="text-muted small" style={{ minHeight: "20px" }}>
            {weatherInfo ? (
              <span style={{ fontSize: "1.05rem" }}>
                {weatherInfo.emoji} {weatherInfo.condition} —{" "}
                {weatherInfo.temperature}°C
                <br />
                <small className="text-muted">📍 {weatherInfo.country}</small>
              </span>
            ) : (
              <span className="text-muted">Fetching weather...</span>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Nav Section */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 1.25rem" }}>
        <ul className="nav nav-pills flex-column mb-auto fontsize">
          {navItems.map((item, index) => (
            <li key={index} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded ${
                  location.pathname === item.path
                    ? "active bg-warning text-dark fw-semibold"
                    : "text-dark sidebar-link"
                }`}
              >
                <i className={`bi ${item.icon} fs-5`}></i>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {remainingTime && (
          <div className="text-center text-muted small mt-3 mb-2">
            ⏳ Session: <strong>{remainingTime}</strong>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="p-3">
        <button
          onClick={handleSidebarLogout}
          className="btn btn-outline-danger w-100 fw-semibold py-2"
        >
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>

      {/* Hover Styles */}
      <style>{`
        .sidebar-link:hover {
          background-color: #f8f9fa;
          color: #000;
          font-weight: 500;
        }
        .sidebar-link i {
          transition: transform 0.2s ease;
        }
        .sidebar-link:hover i {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default AdminSidebar;
