const mongoose = require("mongoose");

const mapEntrySchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    projectLogo: { type: String, default: "" },
    sector: { type: String, required: true },
    pocket: { type: String, required: true },
    imageUrl: { type: String, required: true },
    title: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MapEntry", mapEntrySchema);
