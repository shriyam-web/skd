const express = require("express");
const router = express.Router();
const ProjectEnquiry = require("../models/ProjectEnquiry");

// POST /api/project-enquiry
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, projectId, projectName, remark } = req.body;

    if (!name || !email || !phone || !projectId || !projectName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const enquiry = new ProjectEnquiry({
      name,
      email,
      phone,
      projectId,
      projectName,
      remark, // ✅ added
    });

    await enquiry.save();
    res.status(201).json({ message: "Project enquiry submitted" });
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/project-enquiry/all
router.get("/all", async (req, res) => {
  try {
    const enquiries = await ProjectEnquiry.find().sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    console.error("Error fetching project enquiries:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/project-enquiry/:id
router.patch("/:id", async (req, res) => {
  try {
    const { status, starred } = req.body;

    const updated = await ProjectEnquiry.findByIdAndUpdate(
      req.params.id,
      {
        ...(status && { status }),
        ...(starred !== undefined && { starred }),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating enquiry:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/project-enquiry/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ProjectEnquiry.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json({ message: "Enquiry deleted" });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
