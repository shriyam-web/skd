const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();
app.use(cors());
// app.use(express.json());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ⬇️ Serve frontend build in production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
  });
}

// Routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const leadRoutes = require("./routes/leadRoutes");
app.use("/api/lead", leadRoutes); // Correct base path

const visitorRoutes = require("./routes/visitorRoutes"); // ✅ Correct path
app.use("/api", visitorRoutes); // ✅ Mounts /api prefix

const projectRoutes = require("./routes/projectRoutes");
app.use("/api/admin/projects", projectRoutes);

const projectEnquiryRoutes = require("./routes/projectEnquiryRoutes");
app.use("/api/project-enquiry", projectEnquiryRoutes);

const careerRoutes = require("./routes/careerRoutes");
app.use("/api/career", careerRoutes);

app.use("/uploads/resumes", express.static("uploads/resumes"));
// app.use("/uploads/resumes", express.static("uploads/resumes"));

const mapEntryRoutes = require("./routes/mapEntryRoutes");
app.use("/api/map-manager", mapEntryRoutes); //✅

const galleryRoute = require("./routes/adminGallery");
app.use("/api/admin/gallery", galleryRoute); // ✅ CORRECT

const blogRoutes = require("./routes/blogRoutes");
app.use("/api/blogs", blogRoutes);

const siteConfigRoutes = require("./routes/siteConfigRoutes");
app.use("/api/site-config", siteConfigRoutes);

// prefix: /api/admin/dashboard-stats
const adminStatsRoute = require("./routes/adminStats");
app.use("/api/admin/dashboard-stats", adminStatsRoute);

app.use("/api/admin/youtube", require("./routes/youtubeVideos"));
// server.js  (only the relevant part shown)
// app.use("/api/admin/projects", require("./routes/projectRoutes"));

// DB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "SkdData",
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
