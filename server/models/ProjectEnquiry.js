const mongoose = require("mongoose");

const projectEnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  projectId: { type: String },
  projectName: { type: String },
  remark: { type: String, default: "" }, // 👈 User remark
  status: { type: String, enum: ["Pending", "Contacted"], default: "Pending" },
  starred: { type: Boolean, default: false }, // 👈 Star toggle
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ProjectEnquiry", projectEnquirySchema);
