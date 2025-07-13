const express = require("express");
const router = express.Router();
const GalleryImage = require("../models/GalleryImage");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET all images
router.get("/", async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch images" });
  }
});

// POST upload image or video — expects { url, public_id, caption, category, mediaType }
router.post("/upload", async (req, res) => {
  try {
    const { url, public_id, caption, category, mediaType } = req.body;

    if (!url || !public_id) {
      return res.status(400).json({ message: "Missing data" });
    }

    const newMedia = new GalleryImage({
      url,
      public_id,
      caption: caption?.trim() || "",
      category: category?.trim() || "",
      mediaType: mediaType === "video" ? "video" : "image", // default fallback
    });

    await newMedia.save();
    res.json(newMedia);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save media" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Media not found" });

    // Delete from Cloudinary
    const resourceType = image.mediaType === "video" ? "video" : "image";
    await cloudinary.uploader.destroy(image.public_id, {
      resource_type: resourceType,
    });

    // Delete from MongoDB
    await GalleryImage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete media" });
  }
});

module.exports = router;
