// models/Blog.js
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  tags: { type: String },
  comments: [
    {
      name: String,
      comment: String,
      approved: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
      replies: [
        {
          admin: { type: Boolean, default: true },
          reply: String,
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  content: { type: String, required: true },
  imageUrl: { type: String },
  timestamp: { type: Date, default: Date.now },
  isPinned: { type: Boolean, default: false }, // ✅ NEW FIELD
});

module.exports = mongoose.model("Blog", blogSchema);
