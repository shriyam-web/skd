const mongoose = require("mongoose");

const CareerApplicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  dob: String,
  position: String,
  positionOther: String,
  joining: String,
  joiningOther: String,
  address: String,
  experience: String,
  qualification: String,
  percentage: Number,
  resume: { type: String }, // resume file URL
  status: {
    type: String,
    enum: [
      "Pending",
      "Contacted",
      "Called for Interview",
      "Rejected",
      "Candidate Selected", // ✅ Add this
    ],
    default: "Pending",
  },
  starred: {
    type: Boolean,
    default: false,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CareerApplication", CareerApplicationSchema);
