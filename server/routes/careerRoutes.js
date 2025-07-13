const express = require("express");
const router = express.Router();
const CareerApplication = require("../models/CareerApplication");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Setup storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = "uploads/resumes/";
    // Ensure directory exists
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname.replace(/\s+/g, "_"); // remove spaces
    const filename = `${Date.now()}-${safeName}`;
    cb(null, filename);
  },
});

// ✅ File filter to allow only PDFs and DOC/DOCX
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // optional: 5MB limit
});

// ✅ POST: Submit application
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      dob,
      position,
      positionOther,
      joining,
      joiningOther,
      address,
      experience,
      qualification,
      percentage,
    } = req.body;

    const resumePath = req.file ? `/uploads/resumes/${req.file.filename}` : "";

    const application = new CareerApplication({
      name,
      email,
      phone,
      dob,
      position,
      positionOther,
      joining,
      joiningOther,
      address,
      experience,
      qualification,
      percentage,
      resume: resumePath,
    });

    await application.save();
    res.status(201).json({ message: "Application saved successfully." });
  } catch (error) {
    console.error("Career form save error:", error);
    res.status(500).json({ error: "Server error while saving application." });
  }
});

// ✅ GET: Fetch all applications
router.get("/all", async (req, res) => {
  try {
    const applications = await CareerApplication.find().sort({
      submittedAt: -1,
    });
    res.json(applications);
  } catch (error) {
    console.error("Fetch applications error:", error);
    res.status(500).json({ error: "Server error fetching applications." });
  }
});

// ✅ PATCH: Update application status or starred
router.patch("/:id", async (req, res) => {
  try {
    const updateFields = {};
    if ("status" in req.body) updateFields.status = req.body.status;
    if ("starred" in req.body) updateFields.starred = req.body.starred;

    const updated = await CareerApplication.findByIdAndUpdate(
      req.params.id,
      updateFields,
      {
        new: true,
      }
    );

    if (!updated)
      return res.status(404).json({ error: "Application not found." });

    res.json({ message: "Application updated successfully." });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server error while updating application." });
  }
});

// ✅ DELETE: Remove application
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await CareerApplication.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Application not found." });

    res.json({ message: "Application deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Server error while deleting application." });
  }
});

module.exports = router;
