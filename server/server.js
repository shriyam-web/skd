const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const sitemap = require("./routes/sitemap");

const app = express();
app.use(cors());

// app.use(express.json());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ⬇️ Serve frontend build in production
// if (process.env.NODE_ENV === "production") {
//   const __dirname = path.resolve();
//   app.use(express.static(path.join(__dirname, "../client/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
//   });
// }
app.use("/", sitemap); // <-- mount it

console.log("→ Mounting /api/admin");
app.use("/api/admin", require("./routes/adminRoutes"));

console.log("→ Mounting /api/lead");
app.use("/api/lead", require("./routes/leadRoutes"));

console.log("→ Mounting /api");
app.use("/api", require("./routes/visitorRoutes"));

console.log("→ Mounting /api/admin/projects");
app.use("/api/admin/projects", require("./routes/projectRoutes"));

console.log("→ Mounting /api/project-enquiry");
app.use("/api/project-enquiry", require("./routes/projectEnquiryRoutes"));

console.log("→ Mounting /api/career");
app.use("/api/career", require("./routes/careerRoutes"));

console.log("→ Mounting /uploads/resumes");
app.use("/uploads/resumes", express.static("uploads/resumes"));

console.log("→ Mounting /api/map-manager");
app.use("/api/map-manager", require("./routes/mapEntryRoutes"));

console.log("→ Mounting /api/admin/gallery");
app.use("/api/admin/gallery", require("./routes/adminGallery"));

console.log("→ Mounting /api/blogs");
app.use("/api/blogs", require("./routes/blogRoutes"));

console.log("→ Mounting /api/site-config");
app.use("/api/site-config", require("./routes/siteConfigRoutes"));

console.log("→ Mounting /api/admin/dashboard-stats");
app.use("/api/admin/dashboard-stats", require("./routes/adminStats"));

console.log("→ Mounting /api/admin/youtube");
app.use("/api/admin/youtube", require("./routes/youtubeVideos"));

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
