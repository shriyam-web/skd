import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./ReadFullBlog.css";
import Navbar from "./Navbar";
import Footer from "../Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SupportWidget from "./SupportWidget";
// import { toast } from "react-toastify";
// import { ToastContainer } from "react-toastify";

const ReadFullBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  const API = `${import.meta.env.VITE_API_BASE_URL}/api/blogs/${id}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(API);
        setBlog(res.data.blog); // Main blog
        setComments(res.data.blog.comments || []);
        setRelatedBlogs(res.data.relatedBlogs || []); // ✅ Set suggested blogs
      } catch (err) {
        console.error("Error fetching blog", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    try {
      const res = await axios.post(`${API}/comment`, { name, comment });
      setComments(res.data.comments);
      setName("");
      setComment("");

      // ✅ Show toast notification
      toast.success("Your comment has been submitted and is pending approval.");
    } catch (err) {
      console.error("Failed to post comment", err);
      toast.error("Failed to post comment. Please try again later.");
    }
  };

  if (loading) return <div className="blogdetail-loading">Loading...</div>;
  if (!blog) return <div className="blogdetail-error">Blog not found.</div>;

  return (
    <>
      <Navbar />
      <div className="readblog-container p-6">
        <div className="readblog-wrapper-flex">
          {/* MAIN BLOG CONTENT */}
          <div className="readblog-main">
            <Link to="/all-blogs" className="readblog-backlink">
              ← Back to Blogs
            </Link>

            {blog.imageUrl && (
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="readblog-image"
              />
            )}

            <h1 className="readblog-title">{blog.title}</h1>
            <p className="readblog-meta">
              By <span>{blog.author}</span> on{" "}
              {new Date(blog.timestamp).toLocaleDateString()}
            </p>

            {/* TAGS + SHARE */}
            <div className="readblog-tags-share">
              <strong>Tags:</strong>{" "}
              {blog.tags?.split(",").map((tag, idx) => (
                <button className="readblog-tag-button" key={idx}>
                  {tag.trim()}
                </button>
              ))}
              <div className="readblog-share-section mt-3 mb-4">
                <strong>Share:</strong>
                <div className="readblog-social-icons mt-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on Facebook"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${blog.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on Twitter"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on LinkedIn"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      blog.title + " - " + window.location.href
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on WhatsApp"
                  >
                    <i className="fab fa-whatsapp"></i>
                  </a>
                  <button
                    className="readblog-copy-link-button"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.info("Link copied to clipboard!");
                    }}
                    title="Copy Link"
                  >
                    <i className="fas fa-link"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* BLOG CONTENT */}
            <div
              className="readblog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>
          </div>

          {/* SUGGESTED BLOGS PANEL */}
          {relatedBlogs.length > 0 && (
            <div className="readblog-sidebar">
              <h4 className="readblog-sidebar-title">Suggested Blogs</h4>
              {relatedBlogs.map((rel) => (
                <Link
                  to={`/read-blog/${rel._id}`}
                  key={rel._id}
                  className={`readblog-suggested-card ${
                    rel._id === blog._id ? "active-suggested" : ""
                  }`}
                >
                  {rel.imageUrl && (
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="readblog-suggested-img"
                    />
                  )}
                  <h5 className="readblog-suggested-blog-title">{rel.title}</h5>
                  <p className="readblog-suggested-author">
                    By {rel.author} •{" "}
                    {new Date(rel.timestamp).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="width-decider">
          {/* COMMENT FORM */}
          <div className="readblog-comment-form">
            <h4>Leave a Comment</h4>
            <form onSubmit={handleCommentSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <textarea
                placeholder="Your Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
              <button type="submit">Submit</button>
            </form>
          </div>

          {/* COMMENTS */}
          {comments.length > 0 && (
            <div className="readblog-comment-section mt-5">
              <h4>Comments</h4>
              {comments.map((c, idx) => (
                <div className="readblog-comment-item" key={idx}>
                  <div className="readblog-comment-header">
                    <span>
                      <strong>{c.name}</strong> on{" "}
                      {new Date(c.createdAt).toLocaleDateString()} wrote
                      {c.approved && (
                        <span className="readblog-safe-tag ms-2">
                          🟢 Verified comment
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="readblog-comment-text mb-2">{c.comment}</p>
                  {c.replies?.length > 0 && (
                    <div className="readblog-admin-reply-box p-2 border bg-light rounded">
                      <strong>Admin Reply:</strong> {c.replies[0].reply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
      <SupportWidget />
      <Footer />
    </>
  );
};

export default ReadFullBlog;
