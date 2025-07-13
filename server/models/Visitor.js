const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    count: { type: Number, default: 0 },
  },
  { timestamps: true } // ← ✅ Add this
);

const Visitor = mongoose.model("Visitor", visitorSchema);
module.exports = Visitor;
