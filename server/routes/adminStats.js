// // routes/adminStats.js
// const express = require("express");
// const router = express.Router();
// const moment = require("moment");

// const ProjectEnquiry = require("../models/ProjectEnquiry");

// const Project = require("../models/Project");
// const Blog = require("../models/Blog");
// const CareerApplication = require("../models/CareerApplication");

// // GET /api/admin/dashboard-stats
// router.get("/", async (req, res) => {
//   try {
//     // 👇 यदि visible=true चाहिए तो { visible: true } लगाएँ
//     const [leads, projects, blogs, careers] = await Promise.all([
//       ProjectEnquiry.countDocuments(), // ✅ FIXED
//       Project.countDocuments(),
//       Blog.countDocuments(),
//       CareerApplication.countDocuments(),
//     ]);

//     res.json({ leads, projects, blogs, careers });
//   } catch (err) {
//     console.error("Dashboard stats error:", err);
//     res.status(500).json({ error: "Failed to fetch dashboard stats" });
//   }
// });

// module.exports = router;

// routes/adminStats.js
const express = require("express");
const router = express.Router();
const moment = require("moment");

const ProjectEnquiry = require("../models/ProjectEnquiry");
const Project = require("../models/Project");
const Blog = require("../models/Blog");
const CareerApplication = require("../models/CareerApplication");

// GET /api/admin/dashboard-stats?days=30
router.get("/", async (req, res) => {
  try {
    const range = parseInt(req.query.days) || 7; // Default = 7
    const today = moment().startOf("day");

    const lastNDays = Array.from({ length: range }, (_, i) => {
      const day = moment(today).subtract(i, "days");
      return {
        label: range === 7 ? day.format("ddd") : day.format("DD MMM"), // Mon or 08 Jul
        start: day.toDate(),
        end: moment(day).endOf("day").toDate(),
      };
    }).reverse();

    const [leads, projects, blogs, careers] = await Promise.all([
      ProjectEnquiry.countDocuments(),
      Project.countDocuments(),
      Blog.countDocuments(),
      CareerApplication.countDocuments(),
    ]);

    const weeklyLeads = await Promise.all(
      lastNDays.map(async ({ label, start, end }) => {
        const count = await ProjectEnquiry.countDocuments({
          createdAt: { $gte: start, $lte: end },
        });
        return { date: label, leads: count };
      })
    );

    res.json({ leads, projects, blogs, careers, weeklyLeads });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

module.exports = router;
