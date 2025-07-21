import "./App.css";

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

import React, { useState, useEffect, lazy, Suspense } from "react";
import LoadingSpinner from "./Components/LoadingSpinner.jsx"; // your custom spinner

// import AdminLoginForm from "./AdminLoginForm";
// import AdminDashboard from "./AdminDashboard";
// import ProtectedRoute from "./Components/ProtectedRoute";
// import CreateBlog from "./Components/Admin Pages/AdminBlogCreate";
// import TiptapEditor from "../TipTapEditor";
// import Homepage from "./Components/Homepage";
// import ProtectedAdminRoute from "./Components/Admin Pages/ProtectedAdminRoute";
// import AdminLeads from "./Components/Admin Pages/AdminContactUsForm";
// import AdminProfile from "./Components/Admin Pages/AdminProfile";
// import CareerSKD from "./Components/CareerSKD";
// import AddProject from "./Components/Admin Pages/AddProject";
// import ReviewProjects from "./Components/Admin Pages/ControlProjects";
// import AdminLayout from "./Components/Admin Pages/AdminLayout"; // 🆕
// import AllProjects from "./Components/AllProjects";
// import ProjectDetail from "./Components/ProjectDetail";
// import AdminContactUsForm from "./Components/Admin Pages/AdminContactUsForm";
// import ControlProjects from "./Components/Admin Pages/ControlProjects";
// import ProjectSpecificLeads from "./Components/Admin Pages/ProjectSpecificLeads";
// import AdminViewCareer from "./Components/Admin Pages/AdminViewCareer";
// import MapManager from "./Components/Admin Pages/MapManager";
// import MapBrowser from "./Components/MapBrowser";
// import ImageGalleryManager from "./Components/Admin Pages/ImageGalleryManager";
// import ViewGallery from "./Components/ViewGallery";
// import AboutUs from "./AboutUs";
// import ContactUs from "./Components/ContactUs";
// import AdminBlogCreate from "./Components/Admin Pages/AdminBlogCreate";
// import UserViewBlog from "./Components/ViewBlogGrid";
// import ViewBlogGrid from "./Components/ViewBlogGrid";
// import ReadFullBlog from "./Components/ReadFullBlog";
// import MaintenancePage from "./Components/Admin Pages/MaintenancePage";
// import AdminCommentModeration from "./Components/Admin Pages/AdminCommentModeration";
// import ToTop from "./Components/ToTop";
// import AllProjectsPage from "./Components/AllProjectsPage";
// import Services from "./Components/Services";
// import YouTubeManager from "./Components/Admin Pages/YouTubeManager";
// import OfficeBearers from "./Components/OfficeBearers";
// import BearerDetail from "./Components/BearerDetail";
// import NotFound from "./Components/NotFound";

// 🟢 Critical for App Shell and Routing – Eagerly Loaded
import Homepage from "./Components/Homepage";
import ProtectedRoute from "./Components/ProtectedRoute";
import ProtectedAdminRoute from "./Components/Admin Pages/ProtectedAdminRoute";
import NotFound from "./Components/NotFound";
import ToTop from "./Components/ToTop";
import Navbar from "./Components/Navbar";
import OfficeBearers from "./Components/OfficeBearers";
import MaintenancePage from "./Components/Admin Pages/MaintenancePage";
import AdminLoginForm from "./AdminLoginForm.jsx";
import AllProjects from "./Components/AllProjects.jsx";
import AllProjectsPage from "./Components/AllProjectsPage";

// 🟡 Heavy & Admin Pages – Lazy Loaded
const AdminDashboard = lazy(() => import("./AdminDashboard"));
const CreateBlog = lazy(() =>
  import("./Components/Admin Pages/AdminBlogCreate")
);
const ProjectDetail = lazy(() => import("./Components/ProjectDetail.jsx"));
const TiptapEditor = lazy(() => import("../TipTapEditor"));
const AdminLeads = lazy(() =>
  import("./Components/Admin Pages/AdminContactUsForm")
);
const AdminSignupForm = lazy(() => import("./AdminSignupForm"));
const AdminProfile = lazy(() =>
  import("./Components/Admin Pages/AdminProfile")
);
const CareerSKD = lazy(() => import("./Components/CareerSKD"));
const AddProject = lazy(() => import("./Components/Admin Pages/AddProject"));
const ReviewProjects = lazy(() =>
  import("./Components/Admin Pages/ControlProjects")
);
const AdminLayout = lazy(() => import("./Components/Admin Pages/AdminLayout"));
const AdminContactUsForm = lazy(() =>
  import("./Components/Admin Pages/AdminContactUsForm")
);
const ControlProjects = lazy(() =>
  import("./Components/Admin Pages/ControlProjects")
);
const ProjectSpecificLeads = lazy(() =>
  import("./Components/Admin Pages/ProjectSpecificLeads")
);
const AdminViewCareer = lazy(() =>
  import("./Components/Admin Pages/AdminViewCareer")
);
const MapManager = lazy(() => import("./Components/Admin Pages/MapManager"));
const MapBrowser = lazy(() => import("./Components/MapBrowser"));
const ImageGalleryManager = lazy(() =>
  import("./Components/Admin Pages/ImageGalleryManager")
);
const ViewGallery = lazy(() => import("./Components/ViewGallery"));
const AboutUs = lazy(() => import("./AboutUs"));
const ContactUs = lazy(() => import("./Components/ContactUs"));
const AdminBlogCreate = lazy(() =>
  import("./Components/Admin Pages/AdminBlogCreate")
);
const UserViewBlog = lazy(() => import("./Components/ViewBlogGrid"));
const ViewBlogGrid = lazy(() => import("./Components/ViewBlogGrid"));
const ReadFullBlog = lazy(() => import("./Components/ReadFullBlog"));
const AdminCommentModeration = lazy(() =>
  import("./Components/Admin Pages/AdminCommentModeration")
);
// const AllProjectsPage = lazy(() => import("./Components/AllProjectsPage"));
const Services = lazy(() => import("./Components/Services"));
const YouTubeManager = lazy(() =>
  import("./Components/Admin Pages/YouTubeManager")
);
const BearerDetail = lazy(() => import("./Components/BearerDetail"));

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
  function SplashScreen() {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <img
          src="/logo.png"
          alt="Loading..."
          className="w-32 h-32 animate-pulse"
        />
      </div>
    );
  }
  // if (loadingConfig) return <div>Loading...</div>;
  // if (loadingConfig) return <SplashScreen />;
  if (!loadingConfig && maintenanceMode && !isAdminRoute) {
    return <MaintenancePage />;
  }

  // 👇 Only block public pages
  if (maintenanceMode && !isAdminRoute) {
    return <MaintenancePage />;
  }

  return (
    <>
      <ToTop>
        <Routes>
          <Route path="/" element={<Homepage />} />
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
          {/* <Route path="/admin/signup" element={<AdminSignupForm />} />
          <Route path="/admin/login" element={<AdminLoginForm />} />
          <Route path="/career@skd" element={<CareerSKD />} /> */}
          {/* <Route path="/running-project" element={<AllProjects />} /> */}
          <Route
            path="/admin/signup"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminSignupForm />
              </Suspense>
            }
          />

          <Route path="/loading" element={<LoadingSpinner />}></Route>

          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminLoginForm />
              </Suspense>
            }
          />

          <Route
            path="/career@skd"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CareerSKD />
              </Suspense>
            }
          />

          <Route
            path="/projects"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AllProjectsPage />
              </Suspense>
            }
          />

          <Route
            path="/projects/:slug"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProjectDetail />
              </Suspense>
            }
          />

          <Route
            path="/maps"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <MapBrowser />
              </Suspense>
            }
          />

          <Route
            path="/view-gallery"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ViewGallery />
              </Suspense>
            }
          />

          <Route
            path="/about-us"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AboutUs />
              </Suspense>
            }
          />

          <Route
            path="/contact-us"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ContactUs />
              </Suspense>
            }
          />

          <Route
            path="/all-blogs"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ViewBlogGrid />
              </Suspense>
            }
          />

          <Route
            path="/read-blog/:id"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ReadFullBlog />
              </Suspense>
            }
          />

          <Route
            path="/services"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Services />
              </Suspense>
            }
          />

          {/* OfficeBearers is eagerly imported so no Suspense needed */}
          <Route path="/office-bearers" element={<OfficeBearers />} />

          <Route
            path="/team"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <BearerDetail />
              </Suspense>
            }
          />

          {/* Redirect from /admin to /admin/login */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/login" replace />}
          />

          <Route
            path="/admin/gallery-manager"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <ImageGalleryManager />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/comments-moderation"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdminCommentModeration />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/blogs-manager"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdminBlogCreate />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/contact-us-responeses"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdminContactUsForm />
                  </Suspense>
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/super-admin/itdept/addnew"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AddProject />
              </Suspense>
            }
          />

          <Route
            path="/admin/projects-leads"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProjectSpecificLeads />
                  </Suspense>
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/control-projects"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <ControlProjects />
                  </Suspense>
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/career-applications"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdminViewCareer />
                  </Suspense>
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/maps-manager"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <MapManager />
                  </Suspense>
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/profile"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdminProfile />
                  </Suspense>
                </AdminLayout>
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/youtube-manager"
            element={
              <ProtectedAdminRoute>
                <AdminLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <YouTubeManager />
                  </Suspense>
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
