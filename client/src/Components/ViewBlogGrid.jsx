import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewBlogGrid.css";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "../Footer";
import SupportWidget from "./SupportWidget";
import { Helmet } from "react-helmet-async";

const ViewBlogGrid = () => {
  const [blogs, setBlogs] = useState([]);

  const API = `${import.meta.env.VITE_API_BASE_URL}/api/blogs`;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(API);
        setBlogs(res.data);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Latest Real Estate Blogs | Insights by SKD PropWorld</title>
        <meta
          name="title"
          content="Latest Real Estate Blogs | Insights by SKD PropWorld"
        />
        <meta
          name="description"
          content="Stay updated with the latest trends, tips, and insights in real estate. Read expert blogs curated by SKD PropWorld."
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.skdpropworld.com/blogs" />
        <meta
          property="og:title"
          content="Latest Real Estate Blogs | Insights by SKD PropWorld"
        />
        <meta
          property="og:description"
          content="Stay updated with the latest trends, tips, and insights in real estate. Read expert blogs curated by SKD PropWorld."
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://www.skdpropworld.com/blogs" />
        <meta
          name="twitter:title"
          content="Latest Real Estate Blogs | Insights by SKD PropWorld"
        />
        <meta
          name="twitter:description"
          content="Stay updated with the latest trends, tips, and insights in real estate. Read expert blogs curated by SKD PropWorld."
        />
      </Helmet>
      <Navbar />
      <div className="userblog-container">
        <h2 className="userblog-heading">Latest Blogs</h2>
        <div className="userblog-grid">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              to={`/read-blog/${blog._id}`}
              className="userblog-card-link"
            >
              <div className="userblog-card">
                {blog.imageUrl && (
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="userblog-image"
                    loading="lazy"
                  />
                )}
                <div className="userblog-content">
                  <h3 className="userblog-title">{blog.title}</h3>
                  <p className="userblog-meta">
                    By <span>{blog.author}</span> |{" "}
                    {new Date(blog.timestamp).toLocaleDateString()}
                  </p>
                  <p className="userblog-tags">Tags: {blog.tags}</p>
                  <p className="userblog-preview">
                    {stripHTML(blog.content).slice(0, 200)}...
                  </p>
                  <span className="userblog-readmore">Read more →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <SupportWidget />
      <Footer />
    </>
  );
};

// Utility to remove HTML tags for preview
const stripHTML = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

export default ViewBlogGrid;
