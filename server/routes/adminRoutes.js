const express = require("express");
const router = express.Router();

const Admin = require("../models/Admin");
require("dotenv").config(); // ✅ Load environment variables

router.post("/signup", async (req, res) => {
  const { name, email, password, secretCode } = req.body;

  try {
    // ✅ Check for secret code
    const allowedCodes = process.env.ADMIN_SECRET_CODES?.split(",") || [];
    if (!secretCode || !allowedCodes.includes(secretCode)) {
      return res.status(403).json({ message: "Invalid secret code" });
    }

    // 👉 Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // 👉 Password validation
    if (password.length < 8 || password === "12345678") {
      return res.status(400).json({ message: "Weak password" });
    }

    // 👉 Create new admin
    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    return res.status(200).json({
      message: "Login successful",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role || "Admin",
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

router.post("/change-password", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    if (admin.password !== oldPassword) {
      return res.status(401).json({ message: "Incorrect old password." });
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ message: "Server error." });
  }
});


module.exports = router;
