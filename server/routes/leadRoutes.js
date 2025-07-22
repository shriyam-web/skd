// routes/leadRoutes.js
const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead"); // Make sure path is correct

// POST /api/lead/submit
router.post("/submit", async (req, res) => {
  try {
    const { name, email, phone, propertyType, message } = req.body;

    // Basic validation
    if (!name || !email || !phone || !propertyType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newLead = new Lead({ name, email, phone, propertyType, message });
    await newLead.save();
    // ✅ Call the email function here
    await sendEmail(req.body);

    res.status(201).json({ message: "Lead saved successfully" });
  } catch (error) {
    console.error("Error saving lead:", error);
    res.status(500).json({ message: "Failed to save lead" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Lead.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/status/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    lead.status = req.body.status || lead.status;
    await lead.save();
    res.json({ message: "Status updated", lead });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating status", error: err.message });
  }
});

router.put("/star/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).send("Lead not found");

    lead.starred = !lead.starred;
    await lead.save();

    res
      .status(200)
      .json({ message: "Star status updated", starred: lead.starred });
  } catch (error) {
    res.status(500).json({ error: "Error toggling star" });
  }
});
const { sendEmail } = require("../utils/sendEmail"); // ✅ Correct destructuring

module.exports = router;
