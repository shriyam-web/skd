import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem("admin")); // ✅ match key

  if (!admin || !admin.name || admin.name.trim() === "") {
    return <Navigate to="/admin/login" replace />;
  }
  return admin ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedAdminRoute;
