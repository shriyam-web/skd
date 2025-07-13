// routes/projectRoutes.js
const axios = require("axios");

const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { v4: uuidv4 } = require("uuid");
const { deleteFromCloudinary } = require("../utils/cloudinary.js");
// const { deleteFromCloudinary } = require("../utils/cloudinary.js"); // Make sure the function is imported

// Helper function for uploading images to Cloudinary
const uploadImage = async (imageData, imageType) => {
  try {
    if (typeof imageData === "string" && imageData.startsWith("data:")) {
      const imageFile = dataURLtoFile(imageData, `${imageType}.jpg`);
      const formData = new FormData();
      formData.append("file", imageFile);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
      };
    }
    return imageData; // If not base64, return imageData as is
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image.");
  }
};

// Helper function to convert base64 data URL to buffer (for Cloudinary upload)
const dataURLtoFile = (dataURL, filename) => {
  const matches = dataURL.match(/^data:(.+?);base64,(.+)$/);
  if (matches) {
    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");
    return {
      buffer: buffer,
      mimeType: mimeType,
      filename: filename,
    };
  }
  return null;
};

// Helper function for uploading images to Cloudinary

/**
 * Convert an arbitrary string to a URL‑friendly slug
 *  - lowercase
 *  - spaces ‑> hyphens
 *  - strips non‑alphanumerics
 *  - collapses multiple hyphens
 */

// Helper function for uploading images to Cloudinary

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

/**
 * POST /api/admin/projects
 * Add a new project
 */
router.post("/", async (req, res) => {
  try {
    const {
      heading,
      location,
      mapLocation,
      usp,
      aboutContent,
      bannerImage,
      logoImage,
      aboutImage,
      highlights,
      whyChooseUs,
      pricingPlans,
      floorPlans,
      gallery,
      visible,
      propertyType,
      ribbonTag,
      reraNumber,
      projectStatus,
      connectivity,
      configurationTable,
      advantages,
      developerName,
      possessionDate,
      isSKDPick,
      propertyNature,
    } = req.body;

    /* ---------------- GENERATE UNIQUE SLUG ---------------- */
    let inputSlug = req.body.slug?.trim(); // ← take slug if given
    let slugBase = slugify(inputSlug || heading);
    let slug = slugBase;
    let suffix = 1;
    while (await Project.findOne({ slug })) {
      slug = `${slugBase}-${suffix++}`;
    }

    /* ---------------- GENERATE PROJECT ID ---------------- */
    const projectId = uuidv4();

    /* ---------------- CREATE & SAVE ---------------- */
    const newProject = new Project({
      projectId,
      slug,
      heading,
      location,
      mapLocation,
      usp,
      aboutContent,
      bannerImage,
      logoImage,
      aboutImage,
      highlights,
      whyChooseUs,
      pricingPlans,
      floorPlans,
      gallery,
      visible,
      propertyType,
      ribbonTag,
      reraNumber,
      projectStatus,
      connectivity,
      configurationTable,
      advantages,
      // ✅ NEW FIELDS
      developerName,
      possessionDate,
      isSKDPick,
      propertyNature,
    });

    await newProject.save();

    return res.status(201).json({
      message: "Project saved successfully",
      projectId,
      slug,
    });
  } catch (error) {
    console.error("Error saving project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Add a new route for image deletion
router.post("/delete-image", async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ message: "Public ID is required" });
    }

    // 1. Delete from Cloudinary
    await deleteFromCloudinary(publicId);

    // 2. Remove matching image from the appropriate field
    await Project.updateMany(
      {
        $or: [
          { "logoImage.publicId": publicId },
          { "bannerImage.publicId": publicId },
          { "aboutImage.publicId": publicId },
        ],
      },
      {
        $set: {
          logoImage: null,
          bannerImage: null,
          aboutImage: null,
        },
      }
    );

    return res
      .status(200)
      .json({ message: "Image deleted from Cloudinary and unset in DB" });
  } catch (err) {
    console.error("Error deleting image from Cloudinary:", err);
    return res
      .status(500)
      .json({ message: "Failed to delete image from Cloudinary" });
  }
});

/**
 * GET /api/admin/projects/slug/:slug
 * Fetch a project by its slug
 */

router.get("/property-types", async (req, res) => {
  try {
    const category = (req.query.propertyNature || "Residential").trim();

    const types = await Project.distinct("propertyType", {
      propertyNature: category,
    });

    return res.json(types);
  } catch (err) {
    console.error("❌ Error updating project:", err.message);
    if (err.errors) console.error("🔍 Validation errors:", err.errors);
    return res
      .status(500)
      .json({ message: "Failed to update project", error: err.message });
  }
});

/**
 * GET /api/projects/top-picks
 * Get all projects marked as SKD Picks
 */
router.get("/top-picks", async (req, res) => {
  try {
    const picks = await Project.find({ isSKDPick: "YES", visible: true })
      .select("heading slug location bannerImage")
      .sort({ createdAt: -1 }) // optional: latest first
      .limit(12); // optional: max 12 top picks

    res.json(picks);
  } catch (err) {
    console.error("❌ Error fetching SKD Picks:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/slug/:slug", async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json(project);
  } catch (error) {
    console.error("Error fetching project by slug:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Fetch a project by its generated projectId (legacy support)
 */

router.get("/project-id/:id", async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.id });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json(project);
  } catch (error) {
    console.error("Error fetching single project:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
/**
 * GET /api/admin/projects
 * Get all projects (sorted newest first)
 */
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    return res.status(500).json({ message: "Failed to fetch projects" });
  }
});

/**
 * PATCH /api/admin/projects/
 * Toggle project visibility
 */
router.patch("/project-id/:id", async (req, res) => {
  try {
    const { visible } = req.body;
    await Project.findByIdAndUpdate(req.params.id, { visible });
    return res.json({ message: "Visibility updated" });
  } catch (err) {
    console.error("Error updating visibility:", err);
    return res.status(500).json({ message: "Failed to update visibility" });
  }
});

/**
 * GET /api/property-types
 * Get distinct property types based on category (Residential, Commercial, etc.)
 */
// routes/projectRoutes.js
router.put("/project-id/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };
    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🛡️ 1. Prevent projectId from being changed
    delete updateData.projectId;

    // 🛡️ 2. Regenerate slug if heading is updated
    if (updateData.heading) {
      let newSlug = slugify(updateData.slug || updateData.heading);
      let suffix = 1;
      while (
        await Project.findOne({ slug: newSlug, _id: { $ne: req.params.id } })
      ) {
        newSlug = `${slugify(updateData.heading)}-${suffix++}`;
      }
      updateData.slug = newSlug;
    }

    // 🛡️ 3. Sanitize image arrays to ensure correct structure
    const sanitizeFileArray = (arr) =>
      Array.isArray(arr)
        ? arr.filter((f) => typeof f === "object" && f.url)
        : [];

    updateData.gallery = sanitizeFileArray(updateData.gallery);
    updateData.floorPlans = sanitizeFileArray(updateData.floorPlans);

    // 🛡️ 4. Ensure bannerImage, logoImage, aboutImage are valid objects
    // 🛡️ 4. Ensure bannerImage, logoImage, aboutImage are valid objects or allow null
    const ensureFileObject = (img) =>
      img && typeof img === "object" && img.url ? img : undefined;

    updateData.bannerImage =
      updateData.bannerImage === null
        ? null
        : ensureFileObject(updateData.bannerImage);

    updateData.logoImage =
      updateData.logoImage === null
        ? null
        : ensureFileObject(updateData.logoImage);

    updateData.aboutImage =
      updateData.aboutImage === null
        ? null
        : ensureFileObject(updateData.aboutImage);
    // ⛔ findByIdAndUpdate does not delete nested fields unless we use $unset

    if (updateData.bannerImage === null) {
      updateData.$unset = { ...(updateData.$unset || {}), bannerImage: "" };
      delete updateData.bannerImage;
    }
    if (updateData.logoImage === null) {
      updateData.$unset = { ...(updateData.$unset || {}), logoImage: "" };
      delete updateData.logoImage;
    }
    if (updateData.aboutImage === null) {
      updateData.$unset = { ...(updateData.$unset || {}), aboutImage: "" };
      delete updateData.aboutImage;
    }

    // 🧹 Cloudinary cleanup for replaced bannerImage
    if (
      existingProject.bannerImage?.publicId &&
      updateData.bannerImage?.publicId
    ) {
      if (
        updateData.bannerImage.publicId !== existingProject.bannerImage.publicId
      ) {
        await deleteFromCloudinary(existingProject.bannerImage.publicId);
      }
    }

    // 🧹 Cloudinary cleanup for replaced logoImage
    if (
      existingProject.logoImage?.publicId &&
      updateData.logoImage?.publicId &&
      updateData.logoImage.publicId !== existingProject.logoImage.publicId
    ) {
      await deleteFromCloudinary(existingProject.logoImage.publicId);
    }

    // 🧹 Cloudinary cleanup for replaced aboutImage
    if (
      existingProject.aboutImage?.publicId &&
      updateData.aboutImage?.publicId &&
      updateData.aboutImage.publicId !== existingProject.aboutImage.publicId
    ) {
      await deleteFromCloudinary(existingProject.aboutImage.publicId);
    }

    // ✅ 5. Update the project in the database
    const updated = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json({
      message: "Project updated successfully",
      project: updated,
    });
  } catch (err) {
    console.error("❌ Error updating project:", err.message);
    if (err.errors) console.error("🔍 Validation errors:", err.errors);

    return res.status(500).json({
      message: "Validation failed",
      error: err.message,
      details: err.errors,
    });
  }
});

/**
 * DELETE /api/admin/projects/
 * Hard delete a project (admin only)
 */

router.delete("/project-id/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🧹 Delete all Cloudinary images
    const imageFields = [
      project.bannerImage,
      project.logoImage,
      project.aboutImage,
      ...(project.gallery || []),
      ...(project.floorPlans || []),
    ];

    for (let image of imageFields) {
      if (image?.public_id) {
        await deleteFromCloudinary(image.public_id);
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    return res.json({ message: "Project and images deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err);
    return res.status(500).json({ message: "Failed to delete project" });
  }
});

module.exports = router;
