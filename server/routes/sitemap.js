const express = require("express");
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");

const Project = require("../models/Project"); // confirmed from your backend
const Blog = require("../models/Blog"); // confirmed from your backend

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
  try {
    const hostname = "https://skdpropworld.com";

    const staticPages = [
      "/", // Homepage
      "/about-us",
      "/contact-us",
      "/career@skd",
      "/projects",
      "/maps",
      "/view-gallery",
      "/all-blogs",
      "/services",
      "/office-bearers",
      "/team",
    ];

    const staticRoutes = staticPages.map((url) => ({
      url,
      changefreq: "monthly",
      priority: 0.7,
    }));

    // Fetch dynamic project routes (based on slug)
    const projects = await Project.find({}, "slug updatedAt");
    const projectRoutes = projects.map((proj) => ({
      url: `/projects/${proj.slug}`,
      changefreq: "weekly",
      priority: 0.9,
      lastmod: proj.updatedAt,
    }));

    // Fetch dynamic blog routes (based on Mongo _id)
    const blogs = await Blog.find({}, "slug _id updatedAt");
    const blogRoutes = blogs.map((blog) => ({
      url: `/read-blog/${blog._id}`,
      changefreq: "weekly",
      priority: 0.6,
      lastmod: blog.updatedAt,
    }));

    // Combine all links
    const allRoutes = [...staticRoutes, ...projectRoutes, ...blogRoutes];

    const stream = new SitemapStream({ hostname });
    res.header("Content-Type", "application/xml");

    const xml = await streamToPromise(
      Readable.from(allRoutes).pipe(stream)
    ).then((data) => data.toString());

    res.send(xml);
  } catch (err) {
    console.error("❌ Error creating sitemap:", err);
    res.status(500).end();
  }
});

module.exports = router;
