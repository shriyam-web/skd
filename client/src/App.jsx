import "./App.css";
import Navbar from "./Components/Navbar";
import AdminSignupForm from "./AdminSignupForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";

import AdminLoginForm from "./AdminLoginForm";
import AdminDashboard from "./AdminDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import CreateBlog from "./Components/Admin Pages/AdminBlogCreate";
import TiptapEditor from "../TipTapEditor";
import Homepage from "./Components/Homepage";
import ProtectedAdminRoute from "./Components/Admin Pages/ProtectedAdminRoute";
import AdminLeads from "./Components/Admin Pages/AdminContactUsForm";
import AdminProfile from "./Components/Admin Pages/AdminProfile";
import CareerSKD from "./Components/CareerSKD";
import AddProject from "./Components/Admin Pages/AddProject";
import ReviewProjects from "./Components/Admin Pages/ControlProjects";
import AdminLayout from "./Components/Admin Pages/AdminLayout"; // 🆕
import AllProjects from "./Components/AllProjects";
import ProjectDetail from "./Components/ProjectDetail";
import AdminContactUsForm from "./Components/Admin Pages/AdminContactUsForm";
import ControlProjects from "./Components/Admin Pages/ControlProjects";
import ProjectSpecificLeads from "./Components/Admin Pages/ProjectSpecificLeads";
import AdminViewCareer from "./Components/Admin Pages/AdminViewCareer";
import MapManager from "./Components/Admin Pages/MapManager";
import MapBrowser from "./Components/MapBrowser";
import ImageGalleryManager from "./Components/Admin Pages/ImageGalleryManager";
import ViewGallery from "./Components/ViewGallery";
import AboutUs from "./AboutUs";
import ContactUs from "./Components/ContactUs";
import AdminBlogCreate from "./Components/Admin Pages/AdminBlogCreate";
import UserViewBlog from "./Components/ViewBlogGrid";
import ViewBlogGrid from "./Components/ViewBlogGrid";
import ReadFullBlog from "./Components/ReadFullBlog";
import MaintenancePage from "./Components/Admin Pages/MaintenancePage";
import AdminCommentModeration from "./Components/Admin Pages/AdminCommentModeration";
import ToTop from "./Components/ToTop";
import AllProjectsPage from "./Components/AllProjectsPage";
import Services from "./Components/Services";
import YouTubeManager from "./Components/Admin Pages/YouTubeManager";
import OfficeBearers from "./Components/OfficeBearers";
import BearerDetail from "./Components/BearerDetail";
import NotFound from "./Components/NotFound";

function App() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const location = useLocation(); // ← NEW
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/site-config`
        );
        setMaintenanceMode(res.data.maintenanceMode);
      } catch {
        console.error("Error checking maintenance mode");
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchConfig();
  }, []);

  if (loadingConfig) return <div>Loading...</div>;

  // 👇 Only block public pages
  if (maintenanceMode && !isAdminRoute) {
    return <MaintenancePage />;
  }

  return (
    <>
      <ToTop>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/admin/signup" element={<AdminSignupForm />} />
          <Route path="/admin/login" element={<AdminLoginForm />} />
          <Route path="/career@skd" element={<CareerSKD />} />
          {/* <Route path="/running-project" element={<AllProjects />} /> */}
          <Route path="/projects" element={<AllProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/maps" element={<MapBrowser />} />
          <Route path="/view-gallery" element={<ViewGallery />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/all-blogs" element={<ViewBlogGrid />} />
          <Route path="/read-blog/:id" element={<ReadFullBlog />} />
          <Route path="/services" element={<Services />} />
          <Route path="/office-bearers" element={<OfficeBearers />} />
          <Route path="/team" element={<BearerDetail />} />

          {/* Redirect from /admin to /admin/login */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/login" replace />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/gallery-manager"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ImageGalleryManager />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/comments-moderation"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminCommentModeration />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/blogs-manager"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminBlogCreate />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/contact-us-responeses"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminContactUsForm />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/super-admin/itdept/addnew"
            element={<AddProject />}
          />
          <Route
            path="/admin/projects-leads"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <ProjectSpecificLeads />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/control-projects"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <ControlProjects />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/career-applications"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminViewCareer />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/maps-manager"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <MapManager />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <AdminProfile />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/youtube-manager"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <YouTubeManager />
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />

          {/* 🔻 catch-all fallback - ensure its placed at last*/}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToTop>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
