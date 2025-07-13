// src/Components/Admin Pages/AdminLayout.jsx
import React from "react";
import AdminSidebar from "../AdminSidebar";
import { AuthProvider } from "../../context/AuthContext";
import { useAuth } from "../../context/AuthContext";
import useAutoLogout from "../../hooks/useAutoLogout";

const AdminLayout = ({ children }) => {
  const { admin } = useAuth(); // ✅ Now defined
  const remainingTime = useAutoLogout(); // ✅ Now defined
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div style={{ width: "250px", flexShrink: 0 }}>
        <AdminSidebar adminName={admin?.name} remainingTime={remainingTime} />
      </div>
      <div className="flex-grow-1 p-3">{children}</div>
    </div>
  );
};

export default AdminLayout;
