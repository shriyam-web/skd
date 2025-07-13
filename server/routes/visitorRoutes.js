const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");

router.get("/visitor-count", async (req, res) => {
  try {
    const doc = await Visitor.findOne();
    res.json({ count: doc?.count || 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch visitor count" });
  }
});

router.post("/visitor-count/increment", async (req, res) => {
  try {
    let doc = await Visitor.findOne();
    if (!doc) doc = new Visitor();
    doc.count += 1;
    await doc.save();
    res.json({ count: doc.count });
  } catch (err) {
    res.status(500).json({ error: "Failed to increment visitor count" });
  }
});

module.exports = router;
