const express = require("express");
const router = express.Router();
const SiteConfig = require("../models/SiteConfig");

// ─────────────── GET: Current Site Mode ───────────────
router.get("/", async (req, res) => {
  try {
    const config = await SiteConfig.findOne();
    res.json(config || { maintenanceMode: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch site config." });
  }
});

// ─────────────── PUT: Toggle Site Mode (with secret code) ───────────────
router.put("/", async (req, res) => {
  const { maintenanceMode, code } = req.body;

  const validCodes = (process.env.ADMIN_SECRET_CODES || "")
    .split(",")
    .map((c) => c.trim());

  if (!validCodes.includes(code)) {
    return res.status(401).json({ message: "Invalid or missing secret code." });
  }

  try {
    const config = await SiteConfig.findOneAndUpdate(
      {},
      { maintenanceMode },
      { new: true, upsert: true }
    );
    res.json({ maintenanceMode: config.maintenanceMode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update site mode." });
  }
});

module.exports = router;
