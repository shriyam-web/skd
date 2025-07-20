import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddProject.css"; // ⬅️ add just after the Bootstrap import
import confetti from "canvas-confetti";
import { Helmet } from "react-helmet-async";

// ✅ Get the secret once from env
// ✅ ONLY use import.meta.env in Vite
const secretFromEnv = import.meta.env.VITE_REACT_APP_SECRET || "";

const AddProject = () => {
  // State for secret login
  const [secretInput, setSecretInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [submittedSlug, setSubmittedSlug] = useState("");

  const ProjectRibbonTag = {
    HOT_DEAL: "Hot Deal",
    TRENDING: "Trending",
    NEW_LAUNCH: "New Launch",
    LIMITED_TIME: "Limited Time",
    BEST_SELLER: "Best Seller",
    READY_TO_MOVE: "Ready to Move",
    UNDER_CONSTRUCTION: "Under Construction",
    SOLD_OUT: "Sold Out",
    EXCLUSIVE_OFFER: "Exclusive Offer",
    INVESTORS_CHOICE: "Investor’s Choice",
    PRIME_LOCATION: "Prime Location",
    BUDGET_FRIENDLY: "Budget Friendly",
    PREMIUM_PROPERTY: "Premium Property",
    UPCOMING_LAUNCHES: "Upcoming Launches",
  };

  const PROPERTY_TYPES = ["Plot", "Flat", "Villa", "House", "Commercial Space"];
  const RIBBON_TAGS = Object.values(ProjectRibbonTag);

  // Project form state
  const [formData, setFormData] = useState({
    heading: "",
    slug: "", // ➕ ADD THIS
    location: "",
    usp: "",
    propertyType: "",
    ribbonTag: "",
    bannerImage: null,
    aboutImage: null,
    aboutContent: "",
    highlights: [{ heading: "", description: "" }],

    whyChooseUs: [{ title: "", content: "" }],

    pricingPlans: [
      {
        title: "",
        price: "",
        priceType: "TOTAL",
        unit: "",
        description: "",
        features: [""],
      },
    ],

    floorPlans: [],
    gallery: [],
    visible: true,
    logoImage: null,
    mapLocation: "", // ✅ add this

    developerName: "",
    possessionDate: "",
    isSKDPick: "NO",
    propertyNature: "",
    // NEW fields
    reraNumber: "",
    projectStatus: "", // enum
    connectivity: [""],
    configurationTable: "",
    advantages: [{ category: "", points: [""] }],
  });

  // just after your other useState declarations
  const [loading, setLoading] = useState(false);

  const handleHighlightChange = (idx, key, value) => {
    const updated = [...formData.highlights];
    updated[idx] = { ...updated[idx], [key]: value };
    setFormData((prev) => ({ ...prev, highlights: updated }));
  };

  // Handle secret code login
  const handleSecretLogin = (e) => {
    e.preventDefault();
    if (secretInput === secretFromEnv) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid secret code. Please try again.");
    }
  };

  // Handlers for form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, field, multiple = false) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      [field]: multiple ? files : files[0],
    }));
  };

  const addToList = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleWhyChooseUsChange = (index, key, value) => {
    const updated = [...formData.whyChooseUs];
    updated[index][key] = value;
    setFormData((prev) => ({ ...prev, whyChooseUs: updated }));
  };

  const handlePricingChange = (index, key, value) => {
    const updated = [...formData.pricingPlans];
    updated[index][key] = key === "price" ? Number(value) : value; // 👈 Cast price to number
    setFormData((prev) => ({ ...prev, pricingPlans: updated }));
  };

  const addFeatureToPricing = (pIndex) => {
    const updated = [...formData.pricingPlans];
    updated[pIndex].features.push("");
    setFormData((prev) => ({ ...prev, pricingPlans: updated }));
  };

  const handleFeatureChange = (pIndex, fIndex, value) => {
    const updated = [...formData.pricingPlans];
    updated[pIndex].features[fIndex] = value;
    setFormData((prev) => ({ ...prev, pricingPlans: updated }));
  };

  const addPricingPlan = () => {
    setFormData((prev) => ({
      ...prev,
      pricingPlans: [
        ...prev.pricingPlans,
        {
          title: "",
          price: "",
          priceType: "TOTAL", // ✅ default value
          unit: "", // ✅ required if priceType is PER_UNIT
          description: "", // ✅ optional but supported
          features: [""],
        },
      ],
    }));
  };

  const removeAdvantagePoint = (aIdx, pIdx) => {
    const updated = [...formData.advantages];
    updated[aIdx].points = updated[aIdx].points.filter((_, i) => i !== pIdx);
    setFormData((prev) => ({ ...prev, advantages: updated }));
  };

  const removeHighlight = (idx) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx),
    }));
  };

  // -- Connectivity helpers --
  const handleConnectivityChange = (idx, value) => {
    const updated = [...formData.connectivity];
    updated[idx] = value;
    setFormData((prev) => ({ ...prev, connectivity: updated }));
  };
  const addConnectivityPoint = () =>
    setFormData((prev) => ({
      ...prev,
      connectivity: [...prev.connectivity, ""],
    }));

  const removeConnectivityPoint = (idx) => {
    setFormData((prev) => ({
      ...prev,
      connectivity: prev.connectivity.filter((_, i) => i !== idx),
    }));
  };

  // -- Advantages helpers --
  const handleAdvantageChange = (idx, key, value) => {
    const updated = [...formData.advantages];
    updated[idx][key] = value;
    setFormData((prev) => ({ ...prev, advantages: updated }));
  };
  const addAdvantage = () =>
    setFormData((prev) => ({
      ...prev,
      advantages: [...prev.advantages, { category: "", points: [""] }],
    }));
  const addAdvantagePoint = (aIdx) => {
    const updated = [...formData.advantages];
    updated[aIdx].points.push("");
    setFormData((prev) => ({ ...prev, advantages: updated }));
  };
  const handleAdvantagePointChange = (aIdx, pIdx, value) => {
    const updated = [...formData.advantages];
    updated[aIdx].points[pIdx] = value;
    setFormData((prev) => ({ ...prev, advantages: updated }));
  };

  // Function to upload a single file to Cloudinary using unsigned upload
  const uploadFileToCloudinary = async (file) => {
    const isVideo = file.type.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";
    const url = `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME
    }/${resourceType}/upload`; // 🔥 dynamic based on file type
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append(
      "upload_preset",
      import.meta.env.VITE_REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const res = await axios.post(url, uploadData);
      return { url: res.data.secure_url, publicId: res.data.public_id }; // ✅ object
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      // return { url: "", publicId: "" };
      return null; // ⬅️ Means upload failed
    }
  };

  // Function to upload multiple files; returns array of URLs
  const uploadMultipleFiles = async (filesArray) => {
    const uploadPromises = filesArray.map((file) =>
      uploadFileToCloudinary(file)
    );
    return Promise.all(uploadPromises); // ✅
  };

  const removeFeature = (pIdx, fIdx) => {
    const updated = [...formData.pricingPlans];
    updated[pIdx].features = updated[pIdx].features.filter(
      (_, i) => i !== fIdx
    );
    setFormData((prev) => ({ ...prev, pricingPlans: updated }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    /* ───────── Clean & (optionally) validate multi‑value fields ───────── */
    const uspList = formData.usp
      .split(",")
      .map((u) => u.trim())
      .filter((u) => u !== "");

    const connectivityList = formData.connectivity
      .map((c) => c.trim())
      .filter((c) => c !== "");

    const cleanedPricingPlans = formData.pricingPlans.map((plan) => ({
      ...plan,
      features: plan.features.map((f) => f.trim()).filter((f) => f !== ""),
    }));

    const cleanedAdvantages = formData.advantages.map((adv) => ({
      ...adv,
      points: adv.points.map((p) => p.trim()).filter((p) => p !== ""),
    }));

    /* ─────────────────────────────────────────────────────────────────── */

    setLoading(true);
    // Upload images to Cloudinary and replace file objects with URLs
    let bannerImage = null;
    let aboutImage = null;
    let logoImage = null;
    let floorPlans = [];
    let gallery = [];

    if (formData.logoImage) {
      logoImage = await uploadFileToCloudinary(formData.logoImage);
    }

    if (formData.bannerImage) {
      bannerImage = await uploadFileToCloudinary(formData.bannerImage);
    }
    if (formData.aboutImage) {
      aboutImage = await uploadFileToCloudinary(formData.aboutImage);
    }
    if (formData.floorPlans.length > 0) {
      floorPlans = await uploadMultipleFiles(formData.floorPlans);
    }
    if (formData.gallery.length > 0) {
      gallery = await uploadMultipleFiles(formData.gallery);
    }

    // Prepare form data with Cloudinary URLs
    // ✅ Clean floorPlans and gallery to remove any null entries
    floorPlans = floorPlans.filter((fp) => fp && fp.url);
    gallery = gallery.filter((img) => img && img.url);

    // ✅ Prepare final data object
    const data = {
      slug: formData.slug.trim(),
      heading: formData.heading,
      location: formData.location,
      usp: uspList,

      aboutContent: formData.aboutContent || undefined,
      ribbonTag: formData.ribbonTag || undefined,

      bannerImage: bannerImage?.url ? bannerImage : undefined,
      propertyType: formData.propertyType,
      logoImage: logoImage?.url ? logoImage : undefined,
      aboutImage: aboutImage?.url ? aboutImage : undefined,

      highlights:
        formData.highlights?.filter((h) => h.heading.trim() !== "") || [],
      whyChooseUs:
        formData.whyChooseUs?.filter((w) => w.title.trim() !== "") || [],
      pricingPlans:
        cleanedPricingPlans?.filter((p) => p.title.trim() !== "") || [],
      floorPlans: floorPlans.length > 0 ? floorPlans : undefined,
      gallery: gallery.length > 0 ? gallery : undefined,

      visible: formData.visible,
      mapLocation: formData.mapLocation || undefined,
      reraNumber: formData.reraNumber || undefined,
      projectStatus: formData.projectStatus || undefined,
      connectivity: connectivityList.length > 0 ? connectivityList : undefined,
      developerName: formData.developerName,
      possessionDate: formData.possessionDate || undefined,
      isSKDPick: formData.isSKDPick,
      propertyNature: formData.propertyNature,
      configurationTable: formData.configurationTable || undefined,
      advantages:
        cleanedAdvantages?.filter((a) => a.category.trim() !== "") || [],
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/projects`,
        data
      );

      alert("Project Added Successfully!");
      setSubmittedSlug(data.slug); // ✅ capture the slug
    } catch (err) {
      console.error(err);
      alert("Error adding project");
    } finally {
      setLoading(false); // ⬅️ stop (runs for both success & error)
    }
  };
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    // 1️⃣ Text fields
    const textualFields = [
      formData.heading?.trim(),
      formData.slug?.trim(),
      formData.location?.trim(),
      formData.mapLocation?.trim(),
      formData.usp?.trim(),
      formData.ribbonTag?.trim(),
      formData.reraNumber?.trim(),
      formData.projectStatus?.trim(),
      formData.propertyType?.trim(),
      formData.configurationTable?.trim(),
      formData.aboutContent?.trim(),
      formData.developerName?.trim(),
      formData.possessionDate?.trim(),
      formData.isSKDPick?.trim(),
      formData.propertyNature?.trim(),
    ];

    // 2️⃣ File/image fields
    const mediaFields = [
      formData.logoImage,
      formData.bannerImage,
      formData.aboutImage,
    ];

    // 3️⃣ List-based completeness checks
    const filledChecks = [
      formData.gallery.length > 0,
      formData.floorPlans.length > 0,
      formData.connectivity.some((c) => c.trim() !== ""),
      formData.highlights.some((h) => h.heading || h.description),
      formData.whyChooseUs.some((w) => w.title || w.content),
      formData.advantages.some((a) => a.points.some((p) => p)),
      formData.pricingPlans.some((p) => p.title || p.price),
    ];

    const filledCount = [
      ...textualFields.filter(Boolean),
      ...mediaFields.filter(Boolean),
      ...filledChecks.filter(Boolean),
    ].length;

    const totalCount =
      textualFields.length + mediaFields.length + filledChecks.length;

    const percent =
      totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;

    setCompletionPercentage(percent);

    // 🎉 Trigger confetti ONCE when reaching 100%
    if (percent === 100 && !hasCelebrated) {
      confetti({
        particleCount: 200,
        spread: 100,
        angle: 90,
        origin: { y: 0.6 },
        colors: ["#ffd700", "#d4af37", "#00FFAB", "#1890ff"],
      });
      setHasCelebrated(true); // 👈 prevent future triggers
    }

    // ⏪ Reset flag if user removes required field(s)
    if (percent < 100 && hasCelebrated) {
      setHasCelebrated(false);
    }
  }, [formData, hasCelebrated]);

  const getCompletionColorClass = (percent) => {
    if (percent < 30) return "completion-red";
    if (percent < 60) return "completion-blue";
    if (percent < 90) return "completion-green-light";
    return "completion-green-dark";
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Super Admin | Add Project </title>
        </Helmet>
        <Card className="p-4 mt-4 ">
          <h3>Secret Login</h3>
          {loginError && <Alert variant="danger">{loginError}</Alert>}
          <Form onSubmit={handleSecretLogin}>
            <Form.Group>
              <Form.Label>Enter Secret Code:</Form.Label>
              <Form.Control
                type="password"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" className="mt-3" variant="primary">
              Login
            </Button>
          </Form>
        </Card>
        <p className="text-white center">
          {" "}
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          &nbsp; &nbsp; Designed and Developed by : Shriyam Parashar
        </p>
      </>
    );
  }

  // The main project addition form (displayed after authentication)
  return (
    <div className="skd-add-project-wrapper">
      <div className="skd-sticky-progress">
        <div className="completion-bar-container">
          <div
            className={`completion-bar-fill ${getCompletionColorClass(
              completionPercentage
            )}`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <div className="completion-bar-label text-white">
          {completionPercentage === 100
            ? "✅ Completed"
            : `${completionPercentage}% Complete`}
        </div>
      </div>

      <Card className="p-4 mt-4 new-bg">
        <h3>Project Management Console</h3>
        <p className="note">
          The form will begin with 4% completion because of Project_id
          auto-generation
        </p>
        <p>*to be filled with SEO terms for better reach</p>

        <hr />

        <Form onSubmit={handleSubmit}>
          {/* 1. Project Intro Section */}
          <h5 className="mt-4">📌 Project Intro</h5>
          <Form.Group className="mb-3">
            <Form.Label>
              Heading <span className="text-danger">*</span>
            </Form.Label>

            <Form.Control
              name="heading"
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Custom Slug (optional) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;
              project url : www.skdpropworld.com/project/your-slug
            </Form.Label>
            <Form.Control
              name="slug"
              placeholder="Write your-slug here"
              value={formData.slug}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Location <span className="text-danger">*</span>
            </Form.Label>

            <Form.Control
              name="location"
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Map Location (Google Maps URL) (optional)</Form.Label>
            <Form.Control
              type="text"
              name="mapLocation"
              placeholder="https://maps.google.com/..."
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Project Logo <span className="text-danger">*</span>
            </Form.Label>

            <Form.Control
              type="file"
              required
              onChange={(e) => handleImageUpload(e, "logoImage")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>USP (comma separated) (optional)</Form.Label>
            <Form.Control name="usp" onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ribbon Tag (optional)</Form.Label>
            <Form.Select
              name="ribbonTag"
              value={formData.ribbonTag || ""}
              onChange={handleInputChange}
            >
              <option value="">-- Select --</option>
              {RIBBON_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* RERA (optional) */}
          <Form.Group className="mb-3">
            <Form.Label>RERA Number (optional)</Form.Label>
            <Form.Control
              name="reraNumber"
              value={formData.reraNumber}
              onChange={handleInputChange}
            />
          </Form.Group>

          {/* Project Status */}
          <Form.Group className="mb-3">
            <Form.Label>Project Status (optional)</Form.Label>
            <Form.Select
              name="projectStatus"
              value={formData.projectStatus}
              onChange={handleInputChange}
            >
              <option value="">-- Select --</option>
              <option value="LAUNCHED">Launched</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="PRE_LAUNCH">Pre‑launch</option>
              <option value="READY_TO_MOVE">Ready to Move</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Banner Image (optional)</Form.Label>

            <Form.Control
              type="file"
              onChange={(e) => handleImageUpload(e, "bannerImage")}
            />
          </Form.Group>

          {/* Connectivity */}
          <h5 className="mt-4 mb-3">🚉 Connectivity (optional)</h5>
          {formData.connectivity.map((pt, idx) => (
            <Form.Group key={idx} className="d-flex gap-4 mt-2">
              <Form.Control
                className="mb-2"
                placeholder={`Connectivity point #${idx + 1}`}
                value={pt}
                onChange={(e) => handleConnectivityChange(idx, e.target.value)}
              />
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removeConnectivityPoint(idx)}
              >
                ✕
              </Button>
            </Form.Group>
          ))}

          <Button
            variant="secondary"
            onClick={addConnectivityPoint}
            className="mb-3 mt-2"
          >
            + Add Connectivity Point
          </Button>

          {/* Property Type */}
          <Form.Group className="mb-3">
            <Form.Label>
              Property Type <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Select --</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Configuration Table */}
          <Form.Group className="mt-4">
            <Form.Label>
              Configuration – paste HTML / Markdown table (optional)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="configurationTable"
              value={formData.configurationTable}
              onChange={handleInputChange}
              placeholder={`<table>...</table>  OR  | Size | Price |\n|------|-------|`}
            />
          </Form.Group>

          {/* 2. About Section */}
          <h5 className="mt-4">ℹ️ About Project</h5>
          <Form.Group className="mb-3">
            <Form.Label>About Image (optional)</Form.Label>

            <Form.Control
              type="file"
              onChange={(e) => handleImageUpload(e, "aboutImage")}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>About Content (optional)</Form.Label>
            <Form.Control
              as="textarea"
              name="aboutContent"
              placeholder="Enter dangerouslySetInnerHTML for better rendering"
              rows={4}
              onChange={handleInputChange}
            />
          </Form.Group>

          <h5 className="mt-4">⭐ Project Highlights (optional)</h5>
          {formData.highlights.map((h, idx) => (
            <div
              key={idx}
              className="mb-3 p-3 border rounded position-relative"
            >
              <button
                type="button"
                className="btn btn-sm btn-link text-danger position-absolute top-0 end-0"
                onClick={() => removeHighlight(idx)}
              >
                &times;
              </button>
              <Row>
                <Col>
                  <Form.Control
                    placeholder="Heading"
                    value={h.heading}
                    onChange={(e) =>
                      handleHighlightChange(idx, "heading", e.target.value)
                    }
                  />
                </Col>
                <Col>
                  <Form.Control
                    placeholder="Description (optional)"
                    value={h.description}
                    onChange={(e) =>
                      handleHighlightChange(idx, "description", e.target.value)
                    }
                  />
                </Col>
              </Row>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                highlights: [
                  ...prev.highlights,
                  { heading: "", description: "" },
                ],
              }))
            }
          >
            + Add Highlight
          </Button>

          {/* Advantages */}
          <h5 className="mt-4">🏆 Advantages (optional)</h5>
          {formData.advantages.map((adv, aIdx) => (
            <Card key={aIdx} className="p-3 mb-3 position-relative">
              <Button
                variant="link"
                className="text-danger position-absolute top-0 end-0"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    advantages: prev.advantages.filter((_, i) => i !== aIdx),
                  }))
                }
              >
                ✕
              </Button>

              <Form.Group className="mb-3">
                <Form.Label>Category Heading</Form.Label>
                <Form.Control
                  value={adv.category}
                  onChange={(e) =>
                    handleAdvantageChange(aIdx, "category", e.target.value)
                  }
                />
              </Form.Group>

              {adv.points.map((pt, pIdx) => (
                <Form.Group key={pIdx} className="d-flex gap-2 mb-3">
                  <Form.Control
                    placeholder={`Point #${pIdx + 1}`}
                    value={pt}
                    onChange={(e) =>
                      handleAdvantagePointChange(aIdx, pIdx, e.target.value)
                    }
                  />
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeAdvantagePoint(aIdx, pIdx)}
                  >
                    ✕
                  </Button>
                </Form.Group>
              ))}

              <Button
                variant="outline-primary"
                size="sm"
                className="mt-2"
                onClick={() => addAdvantagePoint(aIdx)}
              >
                + Add Point
              </Button>
            </Card>
          ))}
          <Button variant="secondary" onClick={addAdvantage} className="mb-3">
            + Add Advantage Category
          </Button>

          {/* 4. Why Choose Us */}

          <h5 className="mt-4">🏆 Why Choose Us (optional)</h5>
          {formData.whyChooseUs.map((item, idx) => (
            <div
              key={idx}
              className="mb-3 p-3 border rounded position-relative"
            >
              <Button
                variant="link"
                className="text-danger position-absolute top-0 end-0"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    whyChooseUs: prev.whyChooseUs.filter((_, i) => i !== idx),
                  }))
                }
              >
                ✕
              </Button>

              <Form.Group className="mb-2">
                <Form.Label>Why choose us - Title #{idx + 1}</Form.Label>
                <Form.Control
                  type="text"
                  value={item.title}
                  placeholder="e.g. Prime Location"
                  onChange={(e) =>
                    handleWhyChooseUsChange(idx, "title", e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={item.content}
                  placeholder="Short description about this benefit"
                  onChange={(e) =>
                    handleWhyChooseUsChange(idx, "content", e.target.value)
                  }
                />
              </Form.Group>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                whyChooseUs: [...prev.whyChooseUs, { title: "", content: "" }],
              }))
            }
          >
            + Add Why Choose Us
          </Button>

          {/* 5. Pricing Plans */}
          <h5 className="mt-4">💸 Pricing Plans (optional)</h5>

          {formData.pricingPlans.map((plan, pIdx) => (
            <Card key={pIdx} className="p-3 mb-3">
              <Button
                variant="link"
                className="text-danger position-absolute top-0 end-0"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    pricingPlans: prev.pricingPlans.filter(
                      (_, i) => i !== pIdx
                    ),
                  }))
                }
              >
                ✕
              </Button>

              <Row className="mb-2">
                <Col xs={6}>
                  <Form.Label>Price Type</Form.Label>
                  <Form.Select
                    value={plan.priceType}
                    onChange={(e) =>
                      handlePricingChange(pIdx, "priceType", e.target.value)
                    }
                  >
                    <option value="TOTAL">Total</option>
                    <option value="PER_UNIT">Per Unit</option>
                  </Form.Select>
                </Col>
                {plan.priceType === "PER_UNIT" && (
                  <Col xs={6}>
                    <Form.Label>Unit (e.g. per sq ft)</Form.Label>
                    <Form.Control
                      value={plan.unit}
                      onChange={(e) =>
                        handlePricingChange(pIdx, "unit", e.target.value)
                      }
                    />
                  </Col>
                )}
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Plan Title</Form.Label>
                <Form.Control
                  value={plan.title}
                  onChange={(e) =>
                    handlePricingChange(pIdx, "title", e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price (in ₹)</Form.Label>
                <Form.Control
                  type="number" // ✅ Only numeric input allowed
                  min="0" // ✅ Optional: disallow negative prices
                  // step="1000" // ✅ Optional: specify step increment
                  value={plan.price}
                  onChange={(e) =>
                    handlePricingChange(pIdx, "price", e.target.value)
                  }
                  placeholder="Enter price e.g. 50000"
                />
              </Form.Group>

              {plan.features.map((f, fIdx) => (
                <Form.Group key={fIdx} className="d-flex gap-2 mb-3">
                  <Form.Control
                    placeholder={`Feature #${fIdx + 1}`}
                    value={f}
                    onChange={(e) =>
                      handleFeatureChange(pIdx, fIdx, e.target.value)
                    }
                  />
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeFeature(pIdx, fIdx)}
                  >
                    ✕
                  </Button>
                </Form.Group>
              ))}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => addFeatureToPricing(pIdx)}
              >
                + Add Feature
              </Button>

              <Form.Group className="mt-2 mb-3">
                <Form.Label>Description (optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={plan.description}
                  onChange={(e) =>
                    handlePricingChange(pIdx, "description", e.target.value)
                  }
                  placeholder="May accept dangerouslySetInnerHTML too."
                />
              </Form.Group>
            </Card>
          ))}
          <Button variant="secondary" onClick={addPricingPlan}>
            + Add Pricing Plan
          </Button>

          {/* 6. Floor Plans */}
          <h5 className="mt-4 mb-3">🗺️ Floor Plans (optional)</h5>
          <Form.Group>
            <Form.Label>Upload Floor Plan Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(e) => handleImageUpload(e, "floorPlans", true)}
            />
          </Form.Group>

          {/* 7. Gallery */}
          <h5 className="mt-4 mb-3">🖼️ Project Gallery (optional)</h5>
          <Form.Group>
            <Form.Label>Upload Gallery Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(e) => handleImageUpload(e, "gallery", true)}
            />
          </Form.Group>

          {/* Developer Name */}
          <Form.Group className="mb-3 mt-3">
            <Form.Label>
              Developer Name <span className="text-danger">*</span>
            </Form.Label>

            <Form.Control
              type="text"
              name="developerName"
              value={formData.developerName}
              onChange={handleInputChange}
              placeholder="Enter developer name"
              required
            />
          </Form.Group>

          {/* Possession Date */}
          <Form.Group className="mb-3">
            <Form.Label>Possession Date (optional)</Form.Label>

            <Form.Control
              type="date"
              name="possessionDate"
              value={formData.possessionDate}
              onChange={handleInputChange}
            />
          </Form.Group>

          {/* Is SKD Pick? */}
          <Form.Group className="mb-3">
            <Form.Label>
              Is SKD Pick? <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="isSKDPick"
              value={formData.isSKDPick}
              onChange={handleInputChange}
              required
            >
              <option value="NO">No</option>
              <option value="YES">Yes</option>
            </Form.Select>
          </Form.Group>

          {/* Property Nature */}
          <Form.Group className="mb-3">
            <Form.Label>
              Property Nature <span className="text-danger">*</span>
            </Form.Label>

            <Form.Select
              name="propertyNature"
              value={formData.propertyNature}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Select --</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
            </Form.Select>
          </Form.Group>

          {/* 8. Visibility Toggle */}
          <Form.Group className="mt-4 mb-4">
            <Form.Check
              type="switch"
              id="ap-visible-switch"
              checked={formData.visible}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, visible: e.target.checked }))
              }
              label={
                formData.visible
                  ? "✅ Visible to users"
                  : "🚫 Hidden from users"
              }
            />
          </Form.Group>

          <Button
            type="submit"
            className="mt-3 "
            variant="success"
            disabled={loading} // ⬅️ block double‑clicks
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Submitting...
              </>
            ) : (
              "🚀 Submit Project"
            )}
          </Button>
        </Form>
      </Card>
      {submittedSlug && (
        <div className="text-center mt-4">
          <a
            href={`/projects/${submittedSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-success"
          >
            🎉 Project Live at : &nbsp;<code> /projects/{submittedSlug} </code>
          </a>
        </div>
      )}
    </div>
  );
};

export default AddProject;
