const express = require("express");
const router = express.Router();
const HtmlSnippet = require("../models/HtmlSnippet");

// Get the latest seasonal snippet
router.get("/snippet/seasonal-html", async (req, res) => {
  try {
    const latestSnippet = await HtmlSnippet.findOne().sort({ createdAt: -1 });
    if (!latestSnippet) {
      return res.status(404).json({ error: "No snippet found" });
    }
    res.json({ seasonalHtml: latestSnippet.htmlCode });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch snippet" });
  }
});

// Save new HTML snippet

router.post("/save-snippet", async (req, res) => {
  try {
    const { htmlCode } = req.body;

    // Check if a snippet already exists
    const existing = await HtmlSnippet.findOne();

    if (existing) {
      existing.htmlCode = htmlCode;
      await existing.save();
      return res
        .status(200)
        .json({ message: "Snippet updated", id: existing._id });
    }

    // Else, create a new one
    const newSnippet = new HtmlSnippet({ htmlCode });
    await newSnippet.save();
    res.status(201).json({ message: "Snippet saved", id: newSnippet._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to save snippet" });
  }
});

// Update existing snippet
router.patch("/update-snippet/:id", async (req, res) => {
  try {
    const { htmlCode } = req.body;
    const updated = await HtmlSnippet.findByIdAndUpdate(
      req.params.id,
      { htmlCode },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Snippet not found" });
    res.json({ message: "Snippet updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update snippet" });
  }
});

// Delete snippet
router.delete("/delete-snippet/:id", async (req, res) => {
  try {
    await HtmlSnippet.findByIdAndDelete(req.params.id);
    res.json({ message: "Snippet deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete snippet" });
  }
});

// Get all snippets (optional)
router.get("/all-snippets", async (req, res) => {
  try {
    const snippets = await HtmlSnippet.find().sort({ createdAt: -1 });
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch snippets" });
  }
});

module.exports = router;
