// models/Lead.js
const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  propertyType: { type: String, required: true },
  message: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Contacted"],
    default: "Pending",
  },
  starred: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lead", leadSchema);
