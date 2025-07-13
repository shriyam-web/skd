// routes/blogRoutes.js
const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "skd/blogs",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 1200, crop: "limit" }],
  },
});

const upload = multer({ storage });

// CREATE BLOG
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, author, tags, content, timestamp } = req.body;

    const blog = new Blog({
      title,
      author,
      tags,
      content,
      timestamp,
      imageUrl: req.file?.path || "",
    });

    const saved = await blog.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to create blog" });
  }
});

// GET ALL BLOGS
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ timestamp: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// GET SINGLE BLOG BY ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const relatedBlogs = await Blog.find({ _id: { $ne: blog._id } })
      .sort({ timestamp: -1 })
      .limit(4);

    // Only approved comments shown
    const approvedComments = blog.comments.filter((c) => c.approved);

    res.json({
      blog: { ...blog.toObject(), comments: approvedComments },
      relatedBlogs,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

// Admin replies to a comment
router.post("/:blogId/comments/:commentId/reply", async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const { reply } = req.body;

    if (!reply?.trim()) {
      return res.status(400).json({ error: "Reply cannot be empty" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    comment.replies.push({
      reply,
      admin: true,
      createdAt: new Date(),
    });

    await blog.save();
    res.json({ message: "Reply added successfully" });
  } catch (err) {
    console.error("Error replying to comment:", err);
    res.status(500).json({ error: "Failed to reply to comment" });
  }
});

// UPDATE a reply
router.put("/:blogId/comments/:commentId/reply", async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const { reply } = req.body;

    if (!reply?.trim()) {
      return res.status(400).json({ error: "Reply cannot be empty" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    // If already has replies, update first one (or logic can be expanded)
    if (comment.replies && comment.replies.length > 0) {
      comment.replies[0].reply = reply;
      comment.replies[0].createdAt = new Date();
    } else {
      comment.replies.push({
        reply,
        admin: true,
        createdAt: new Date(),
      });
    }

    await blog.save();
    res.json({ message: "Reply updated successfully" });
  } catch (err) {
    console.error("Error updating reply:", err);
    res.status(500).json({ error: "Failed to update reply" });
  }
});

router.get("/comments/approved", async (req, res) => {
  try {
    const blogs = await Blog.find({ "comments.approved": true });

    const approvedComments = blogs.flatMap((blog) =>
      blog.comments
        .filter((c) => c.approved)
        .map((c) => ({
          blogId: blog._id,
          blogTitle: blog.title,
          commentId: c._id,
          name: c.name,
          comment: c.comment,
          createdAt: c.createdAt,
          replies: c.replies || [],
        }))
    );

    res.json(approvedComments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch approved comments" });
  }
});

// UPDATE BLOG
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, author, tags, content, timestamp } = req.body;

    const updateData = {
      title,
      author,
      tags,
      content,
      timestamp,
    };

    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update blog" });
  }
});

// Add Comment to a blog
router.post("/:id/comment", async (req, res) => {
  try {
    const { name, comment } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    blog.comments.push({
      name,
      comment,
      approved: false,
      createdAt: new Date(),
    });

    await blog.save();

    // Filter only approved ones to send back
    const approvedComments = blog.comments.filter((c) => c.approved);

    res.json({
      message: "Comment submitted for approval.",
      comments: approvedComments,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Get all unapproved comments with blog titles
router.get("/comments/pending", async (req, res) => {
  try {
    const blogs = await Blog.find({ "comments.approved": false });

    const pendingComments = blogs.flatMap((blog) =>
      blog.comments
        .filter((c) => !c.approved)
        .map((c) => ({
          blogId: blog._id,
          blogTitle: blog.title,
          commentId: c._id,
          name: c.name,
          comment: c.comment,
          createdAt: c.createdAt,
          replies: c.replies || [], // ✅ now you send replies back to frontend
        }))
    );

    res.json(pendingComments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending comments" });
  }
});

router.put("/:blogId/comments/:commentId/approve", async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    const blog = await Blog.findOneAndUpdate(
      { _id: blogId, "comments._id": commentId },
      { $set: { "comments.$.approved": true } },
      { new: true }
    );

    if (!blog) return res.status(404).json({ error: "Comment not found" });
    res.json({ message: "Comment approved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve comment" });
  }
});

router.delete("/:blogId/comments/:commentId", async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    if (!blog) return res.status(404).json({ error: "Comment not found" });
    res.json({ message: "Comment removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

// DELETE BLOG
router.delete("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

module.exports = router;
