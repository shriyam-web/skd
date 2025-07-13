const express = require("express");
const router = express.Router();
const YouTubeVideo = require("../models/YouTubeVideo");

// Get all videos
router.get("/", async (req, res) => {
  const videos = await YouTubeVideo.find().sort({ createdAt: -1 });
  res.json(videos);
});

// Add new video
router.post("/", async (req, res) => {
  const { title, url, description, thumbnail } = req.body;
  if (!title || !url)
    return res.status(400).json({ message: "Missing fields" });

  const newVideo = new YouTubeVideo({ title, url, description, thumbnail });
  await newVideo.save();
  res.json(newVideo);
});

// Delete video
router.delete("/:id", async (req, res) => {
  await YouTubeVideo.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
