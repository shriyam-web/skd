const express = require("express");
const router = express.Router();
const MapEntry = require("../models/MapEntry");

// Add a new map entry
router.post("/add", async (req, res) => {
  try {
    const {
      projectName,
      projectLogo,
      sector,
      pocket,
      imageUrl,
      title,
      description,
    } = req.body;

    if (!projectName || !sector || !pocket || !imageUrl) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    // ✅ Duplicate check
    const existing = await MapEntry.findOne({
      projectName,
      sector,
      pocket,
    });

    if (existing) {
      return res
        .status(409) // Conflict
        .json({
          message: "A map for this Project > Sector > Pocket already exists.",
        });
    }

    const newEntry = new MapEntry({
      projectName,
      projectLogo,
      sector,
      pocket,
      imageUrl,
      title,
      description,
    });

    await newEntry.save();

    res
      .status(201)
      .json({ message: "Map entry created successfully", map: newEntry });
  } catch (err) {
    console.error("Error saving map entry:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Get all map entries
router.get("/", async (req, res) => {
  try {
    const maps = await MapEntry.find().sort({ createdAt: -1 });
    res.status(200).json({ maps });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch maps", error: err });
  }
});

// ✅ DELETE a map entry by ID
// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await MapEntry.findByIdAndDelete(id);

//     if (!deleted) {
//       return res.status(404).json({ message: "Map entry not found" });
//     }

//     res.status(200).json({ message: "Map entry deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting map entry:", err);
//     res.status(500).json({ message: "Server error", error: err });
//   }
// });

module.exports = router;
