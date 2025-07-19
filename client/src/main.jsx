import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async"; // 🆕 Add this
import "./index.css"; // Tailwind

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    {" "}
    {/* 🧠 Helmet context starts here */}
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </HelmetProvider>
);
