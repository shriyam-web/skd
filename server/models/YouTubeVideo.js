const mongoose = require("mongoose");

const youTubeVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true }, // YouTube embed URL
    description: { type: String, default: "" },
    series: { type: String, default: "Unlocking Real Estate" },
    thumbnail: { type: String }, // optional thumbnail URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("YouTubeVideo", youTubeVideoSchema);
