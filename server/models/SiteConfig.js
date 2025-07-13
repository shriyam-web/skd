// models/SiteConfig.js
const mongoose = require("mongoose");

const siteConfigSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
});

module.exports = mongoose.model("SiteConfig", siteConfigSchema);
