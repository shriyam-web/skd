import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewBlogGrid.css";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "../Footer";
import SupportWidget from "./SupportWidget";

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
