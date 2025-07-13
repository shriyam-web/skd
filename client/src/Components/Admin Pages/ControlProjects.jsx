import React, { useEffect, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { useRef } from "react";
import {
  Table,
  Button,
  Modal,
  Image,
  Badge,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./ControlProjects.css";

const ControlProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const pdfRef = useRef();

  function dataURLtoFile(dataurl, filename) {
    try {
      const arr = dataurl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      return new File([u8arr], filename, { type: mime });
    } catch (error) {
      console.error("Error converting data URL to file:", error);
      toast.error("Invalid image data.");
      return null;
    }
  }

  // Consolidated upload image function
  const uploadImage = async (imageData, imageName) => {
    if (typeof imageData === "string" && imageData.startsWith("data:")) {
      const formData = new FormData();
      formData.append("file", dataURLtoFile(imageData, `${imageName}.jpg`));
      formData.append(
        "upload_preset",
        import.meta.env.VITE_REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          formData
        );
        return {
          url: response.data.secure_url,
          publicId: response.data.public_id,
        };
      } catch (error) {
        console.error("Error uploading image: ", error);
        toast.error("Failed to upload image.");
      }
    }
    return imageData; // If not base64, return image URL directly
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredProjects(
      projects.filter(
        (p) =>
          p.heading?.toLowerCase().includes(term) ||
          p.location?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, projects]);
  const PROJECT_STATUS_OPTIONS = [
    { value: "LAUNCHED", label: "Launched" },
    { value: "UPCOMING", label: "Upcoming" },
    { value: "PRE_LAUNCH", label: "Pre‑launch" },
    { value: "READY_TO_MOVE", label: "Ready to Move" },
  ];

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

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/admin/projects`);
      setProjects(data);
      toast.info("Refreshed..");
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Error fetching projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id, current) => {
    try {
      await axios.patch(`${API_BASE}/api/admin/projects/${id}`, {
        visible: !current,
      });
      toast.success("Visibility updated");
      fetchProjects();
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/projects/${id}`);
      toast.success(
        "Project and all associated resources have been deleted successfully."
      );

      fetchProjects();
    } catch {
      toast.error("Error deleting project");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExportPDF = () => {
    if (!pdfRef.current) return;

    const clone = pdfRef.current.cloneNode(true);
    clone.style.margin = 0;
    clone.style.padding = 0;
    clone.style.transform = "none";
    clone.style.maxWidth = "800px";
    clone.style.background = "white";
    clone.style.color = "black";

    const sandbox = document.createElement("div");
    sandbox.style.position = "absolute";
    sandbox.style.left = "-99999px";
    sandbox.style.top = "0";
    sandbox.style.zIndex = "-1";
    sandbox.appendChild(clone);
    document.body.appendChild(sandbox);

    const options = {
      margin: 0.2,
      filename: `${selectedProject?.slug || "project"}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        scrollY: 0,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    window.scrollTo(0, 0);

    setTimeout(() => {
      html2pdf()
        .set(options)
        .from(clone)
        .save()
        .then(() => {
          document.body.removeChild(sandbox);
        });
      toast.success(
        "Exported to PDF successfully, download will begin shortly"
      );
    }, 500); // Adding a slight delay to ensure the modal is fully rendered
  };

  // Helper function for uploading images

  const extractPublicIdFromUrl = (url) => {
    try {
      const parts = url.split("/");
      const publicIdWithExtension = parts[parts.length - 1];
      return publicIdWithExtension.split(".")[0]; // Remove file extension
    } catch (error) {
      console.error("Error extracting public ID from URL:", error);
      return "";
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const uploaded = await uploadImage(reader.result, field);
        if (uploaded) {
          setFormData((prev) => ({
            ...prev,
            [field]: uploaded,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <ToastContainer position="top-left" autoClose={3000} />
      {loading ? (
        <div className="text-center my-4">⏳ Loading Projects...</div>
      ) : (
        <div className="table-wrapper">{/* Existing table here */}</div>
      )}

      <div className="admin-control-projects-page container text-light py-4 ps-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">All Projects 📂</h3>
          <Button variant="outline-primary" onClick={fetchProjects}>
            🔄 Refresh
          </Button>
        </div>

        <Form.Control
          placeholder="🔍  Search by title or location"
          className="mb-3 control-projects-search"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="table-wrapper">
          <Table
            striped
            bordered
            hover
            variant="dark"
            className="control-projects-table"
            responsive
          >
            <thead>
              <tr>
                <th style={{ width: 55 }}>#</th>
                <th style={{ width: 120 }}>Project ID</th>
                <th style={{ width: 320 }}>Title</th>
                <th style={{ width: 110 }}>Banner</th>
                <th style={{ width: 110 }}>Visible</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p, i) => (
                <tr key={p._id}>
                  <td>{i + 1}</td>
                  <td>
                    <Badge bg="secondary">{p.projectId || "N/A"}</Badge>
                  </td>
                  <td className="ellipsis">{p.heading}</td>
                  <td>
                    <Image
                      src={p.bannerImage?.url || p.bannerImage}
                      height={50}
                      width={80}
                      thumbnail
                      style={{ objectFit: "cover" }}
                    />
                  </td>
                  <td>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        checked={!!p.visible}
                        onChange={() => toggleVisibility(p._id, p.visible)}
                      />
                      <span className="custom-slider" />
                    </label>
                  </td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => {
                          setSelectedProject(p);
                          setShowModal(true);
                        }}
                      >
                        👁️ View
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => deleteProject(p._id)}
                      >
                        🗑️ Delete
                      </Button>

                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => {
                          setSelectedProject(p);
                          setFormData(p); // populate form
                          setEditMode(true);
                          setShowModal(true);
                        }}
                      >
                        ✏️ Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setEditMode(false);
            setFormData({});
          }}
          size="xl"
          centered
          backdrop="static"
          className="project-modal"
        >
          <div ref={pdfRef} className="pdf-export-area">
            <Modal.Header closeButton>
              <Modal.Title>
                {editMode
                  ? `✏️ Edit: ${selectedProject?.heading}`
                  : `${selectedProject?.heading} : Project Preview 🔍`}
                <span className="text-danger">*</span>
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {selectedProject && (
                <>
                  {/* ───────── BASIC INFO ───────── */}
                  <Row className="gy-3">
                    <Col md={4}>
                      <p>
                        <strong>Slug:</strong>{" "}
                        {editMode ? (
                          <Form.Control
                            size="sm"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                          />
                        ) : (
                          selectedProject.slug
                        )}
                        <span className="text-danger">*</span>
                      </p>
                      <Button
                        size="sm"
                        variant="outline-success"
                        className="me-2 mb-3"
                        onClick={() =>
                          window.open(
                            `/projects/${selectedProject.slug}`,
                            "_blank"
                          )
                        }
                      >
                        🔗 Open Public Page
                      </Button>
                      <p>
                        <strong>Project ID:</strong> {selectedProject.projectId}{" "}
                        <span className="text-danger">*</span>
                      </p>
                      <p>
                        <strong>Location:</strong>{" "}
                        <span className="text-danger">*</span>
                        {editMode ? (
                          <Form.Control
                            size="sm"
                            name="location"
                            value={formData.location || ""}
                            onChange={handleInputChange}
                          />
                        ) : (
                          selectedProject.location
                        )}
                      </p>
                      <p>
                        <strong>Developer:</strong>{" "}
                        <span className="text-danger">*</span>
                        {editMode ? (
                          <Form.Control
                            size="sm"
                            name="developerName"
                            value={formData.developerName || ""}
                            onChange={handleInputChange}
                          />
                        ) : (
                          selectedProject.developerName || "N/A"
                        )}
                      </p>
                      <p>
                        <strong>Possession Date:</strong>{" "}
                        {editMode ? (
                          <Form.Control
                            size="sm"
                            type="date"
                            name="possessionDate"
                            value={
                              formData.possessionDate
                                ? formData.possessionDate.split("T")[0]
                                : ""
                            }
                            onChange={handleInputChange}
                          />
                        ) : selectedProject.possessionDate ? (
                          new Date(
                            selectedProject.possessionDate
                          ).toLocaleDateString()
                        ) : (
                          "N/A"
                        )}
                      </p>
                      <p>
                        <strong>Property Nature:</strong>{" "}
                        <span className="text-danger">*</span>
                        {editMode ? (
                          <Form.Select
                            name="propertyNature"
                            value={formData.propertyNature || ""}
                            onChange={handleInputChange}
                          >
                            <option value="">
                              -- Select Property Nature --
                            </option>
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Industrial">Industrial</option>
                          </Form.Select>
                        ) : (
                          selectedProject.propertyNature || "N/A"
                        )}
                      </p>
                      <div>
                        <strong>SKD Pick:</strong>{" "}
                        <span className="text-danger">*</span>
                        {editMode ? (
                          <Form.Check
                            type="checkbox"
                            name="isSKDPick"
                            label="Yes"
                            checked={formData.isSKDPick === "YES"}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                isSKDPick: e.target.checked ? "YES" : "NO",
                              }))
                            }
                          />
                        ) : selectedProject.isSKDPick === "YES" ? (
                          "YES"
                        ) : (
                          "NO"
                        )}
                      </div>
                      {/* USP */}
                      <p className="mb-1">
                        <strong>USP:</strong>
                      </p>
                      <ul className="ps-3">
                        {editMode
                          ? (formData.usp || []).map((u, i) => (
                              <li
                                key={i}
                                className="d-flex align-items-center gap-2"
                              >
                                <Form.Control
                                  size="sm"
                                  value={u}
                                  onChange={(e) => {
                                    const updated = [...formData.usp];
                                    updated[i] = e.target.value;
                                    setFormData((prev) => ({
                                      ...prev,
                                      usp: updated,
                                    }));
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => {
                                    const updated = [...formData.usp];
                                    updated.splice(i, 1);
                                    setFormData((prev) => ({
                                      ...prev,
                                      usp: updated,
                                    }));
                                  }}
                                >
                                  ❌
                                </Button>
                              </li>
                            ))
                          : (selectedProject.usp || []).map((u, i) => (
                              <li key={i}>{u}</li>
                            ))}
                      </ul>
                      {editMode && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              usp: [...(prev.usp || []), ""],
                            }))
                          }
                        >
                          ➕ Add USP
                        </Button>
                      )}
                      <br /> <br />
                      {/* Map link */}
                      {editMode ? (
                        <>
                          <Form.Label>
                            {" "}
                            <strong>Map Location URL:</strong>
                          </Form.Label>
                          <Form.Control
                            size="sm"
                            type="url"
                            name="mapLocation"
                            value={formData.mapLocation || ""}
                            placeholder="https://maps.google.com/..."
                            onChange={handleInputChange}
                          />
                          {formData.mapLocation && (
                            <Button
                              size="sm"
                              variant="outline-warning"
                              className="mt-2"
                              onClick={() =>
                                window.open(formData.mapLocation, "_blank")
                              }
                            >
                              📍 View on Map
                            </Button>
                          )}
                        </>
                      ) : selectedProject.mapLocation ? (
                        <Button
                          size="sm"
                          variant="outline-warning"
                          onClick={() =>
                            window.open(selectedProject.mapLocation, "_blank")
                          }
                        >
                          📍 View on Map
                        </Button>
                      ) : (
                        <p>No map link provided</p>
                      )}
                    </Col>

                    {/* ABOUT */}
                    <Col md={4}>
                      <p className="mb-1">
                        <strong>About:</strong>
                      </p>
                      {editMode ? (
                        <Form.Control
                          as="textarea"
                          rows={6}
                          name="aboutContent"
                          value={formData.aboutContent || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: selectedProject.aboutContent,
                          }}
                        />
                      )}
                    </Col>

                    {/* LOGO & BANNER */}
                    <Col md={4} className="modal-img-col">
                      <h5 className="mt-4">
                        🏷️ Logo Image <span className="text-danger">*</span>
                      </h5>
                      {editMode ? (
                        <>
                          {formData.logoImage && (
                            <div className="position-relative d-inline-block">
                              <Image
                                src={
                                  formData.logoImage ||
                                  selectedProject.logoImage?.url
                                }
                                className="modal-logo"
                              />
                              <Button
                                size="sm"
                                variant="danger"
                                className="position-absolute top-0 end-0"
                                onClick={async () => {
                                  // 1. Remove the image from formData (local state)
                                  setFormData((prev) => ({
                                    ...prev,
                                    logoImage: null, // Clear the logo image from local form data
                                  }));

                                  // 2. Send the publicId of the image to the backend to delete from Cloudinary
                                  if (selectedProject?.logoImage?.publicId) {
                                    try {
                                      // Send a request to delete the image from Cloudinary
                                      await axios.post(
                                        `${API_BASE}/api/admin/projects/delete-image`,
                                        {
                                          publicId:
                                            selectedProject.logoImage.publicId, // Send publicId to backend for deletion
                                        }
                                      );
                                      toast.success(
                                        "Image deleted from Cloudinary."
                                      );

                                      // 3. Optionally update the project data with the image deleted (in case you're handling it on the backend)
                                      setSelectedProject((prev) => ({
                                        ...prev,
                                        logoImage: null,
                                      }));
                                    } catch (error) {
                                      toast.error("Failed to delete image.");
                                    }
                                  }
                                }}
                              >
                                ❌
                              </Button>
                            </div>
                          )}
                          <Form.Group controlId="logoUpload" className="mt-2">
                            <Form.Label>➕ Upload Logo</Form.Label>
                            <Form.Control
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, "logoImage")}
                            />
                          </Form.Group>
                        </>
                      ) : (
                        selectedProject.logoImage && (
                          <Image
                            src={
                              selectedProject.logoImage?.url ||
                              selectedProject.logoImage
                            }
                            className="modal-logo"
                          />
                        )
                      )}

                      <hr className="text-white" />
                      <h5 className="mt-4">🏞️ Banner Image</h5>
                      {editMode ? (
                        <>
                          {formData.bannerImage && (
                            <div className="position-relative d-inline-block">
                              <Image
                                src={
                                  typeof formData.bannerImage === "string"
                                    ? formData.bannerImage
                                    : formData.bannerImage?.url ||
                                      selectedProject.bannerImage?.url
                                }
                                className="modal-banner"
                              />
                              <Button
                                size="sm"
                                variant="danger"
                                className="position-absolute top-0 end-0"
                                onClick={async () => {
                                  const publicId =
                                    formData.bannerImage?.publicId ||
                                    selectedProject?.bannerImage?.publicId;

                                  // 1. Clear from state
                                  setFormData((prev) => ({
                                    ...prev,
                                    bannerImage: null,
                                  }));

                                  // 2. Cloudinary deletion
                                  if (publicId) {
                                    try {
                                      await axios.post(
                                        `${API_BASE}/api/admin/projects/delete-image`,
                                        { publicId }
                                      );
                                      toast.success(
                                        "Banner image deleted from Cloudinary."
                                      );

                                      // 3. Optional: Reflect in selected project too
                                      setSelectedProject((prev) => ({
                                        ...prev,
                                        bannerImage: null,
                                      }));
                                    } catch (error) {
                                      toast.error(
                                        "Failed to delete banner image."
                                      );
                                    }
                                  }
                                }}
                              >
                                ❌
                              </Button>
                            </div>
                          )}

                          <Form.Group controlId="bannerUpload" className="mt-2">
                            <Form.Label>➕ Upload Banner</Form.Label>
                            <Form.Control
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileUpload(e, "bannerImage")
                              }
                            />
                          </Form.Group>
                        </>
                      ) : (
                        selectedProject.bannerImage && (
                          <Image
                            src={
                              selectedProject.bannerImage?.url ||
                              selectedProject.bannerImage
                            }
                            className="modal-banner"
                          />
                        )
                      )}
                    </Col>
                  </Row>
                  {/* ───────── GALLERY ───────── */}
                  <h5 className="mt-3">🖼️ Gallery</h5>
                  {editMode ? (
                    <>
                      <div className="thumb-grid">
                        {(formData.gallery || []).map((img, i) => (
                          <div key={i} className="position-relative">
                            <Image src={img?.url || img} className="thumb" />
                            <Button
                              size="sm"
                              variant="danger"
                              className="position-absolute top-0 end-0"
                              onClick={() => {
                                const updated = [...formData.gallery];
                                updated.splice(i, 1);
                                setFormData((prev) => ({
                                  ...prev,
                                  gallery: updated,
                                }));
                              }}
                            >
                              ❌
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Form.Group controlId="galleryUpload" className="mt-2">
                        <Form.Label>➕ Add Gallery Image</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const updated = [
                                  ...(formData.gallery || []),
                                  reader.result,
                                ];
                                setFormData((prev) => ({
                                  ...prev,
                                  gallery: updated,
                                }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </Form.Group>
                    </>
                  ) : (
                    selectedProject.gallery?.length > 0 && (
                      <div className="thumb-grid">
                        {selectedProject.gallery.map((g, i) => (
                          <Image key={i} src={g?.url || g} className="thumb" />
                        ))}
                      </div>
                    )
                  )}

                  <hr />

                  {/* ───────── RERA / PROPERTY / RIBBON ───────── */}
                  <h5>📑 Legal & Property Details</h5>
                  <p>
                    <strong>RERA Number:</strong>{" "}
                    {editMode ? (
                      <Form.Control
                        size="sm"
                        name="reraNumber"
                        value={formData.reraNumber || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      selectedProject.reraNumber || "N/A"
                    )}
                  </p>

                  <p>
                    <strong>Property Type:</strong>{" "}
                    <span className="text-danger">*</span>
                    {editMode ? (
                      <Form.Select
                        size="sm"
                        name="propertyType"
                        value={formData.propertyType || ""}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Select Property Type --</option>
                        {PROPERTY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Form.Select>
                    ) : (
                      selectedProject.propertyType || "N/A"
                    )}
                  </p>

                  <p>
                    <strong>Ribbon Tag:</strong>{" "}
                    {editMode ? (
                      <Form.Select
                        size="sm"
                        name="ribbonTag"
                        value={formData.ribbonTag || ""}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Select Ribbon Tag --</option>
                        {Object.entries(ProjectRibbonTag).map(
                          ([key, label]) => (
                            <option key={key} value={label}>
                              {label}
                            </option>
                          )
                        )}
                      </Form.Select>
                    ) : (
                      selectedProject.ribbonTag || "N/A"
                    )}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {editMode ? (
                      <Form.Select
                        size="sm"
                        name="projectStatus"
                        value={formData.projectStatus || ""}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Select --</option>
                        {PROJECT_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Form.Select>
                    ) : (
                      selectedProject.projectStatus || "N/A"
                    )}
                  </p>

                  {/* ───────── CONNECTIVITY ───────── */}
                  {(editMode
                    ? formData.connectivity
                    : selectedProject.connectivity
                  )?.length > 0 && (
                    <>
                      <h5>🚉 Connectivity</h5>
                      <ul className="ps-3">
                        {(editMode
                          ? formData.connectivity
                          : selectedProject.connectivity
                        ).map((c, i) => (
                          <li
                            key={i}
                            className="d-flex align-items-center gap-2"
                          >
                            {editMode ? (
                              <>
                                <Form.Control
                                  size="sm"
                                  value={c}
                                  onChange={(e) => {
                                    const updated = [...formData.connectivity];
                                    updated[i] = e.target.value;
                                    setFormData((prev) => ({
                                      ...prev,
                                      connectivity: updated,
                                    }));
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => {
                                    const updated = [...formData.connectivity];
                                    updated.splice(i, 1);
                                    setFormData((prev) => ({
                                      ...prev,
                                      connectivity: updated,
                                    }));
                                  }}
                                >
                                  ❌
                                </Button>
                              </>
                            ) : (
                              c
                            )}
                          </li>
                        ))}
                      </ul>

                      {editMode && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              connectivity: [...(prev.connectivity || []), ""],
                            }))
                          }
                        >
                          ➕ Add Connectivity Point
                        </Button>
                      )}
                    </>
                  )}

                  {/* ───────── HIGHLIGHTS ───────── */}
                  {editMode && (
                    <>
                      <h5>🌟 Highlights</h5>
                      <ul className="ps-3">
                        {(formData.highlights || []).map((h, i) => (
                          <li
                            key={i}
                            className="d-flex gap-2 align-items-start mb-2 flex-column"
                          >
                            <Form.Control
                              size="sm"
                              placeholder="Heading"
                              value={h.heading || ""}
                              onChange={(e) => {
                                const updated = [...formData.highlights];
                                updated[i].heading = e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  highlights: updated,
                                }));
                              }}
                            />
                            <Form.Control
                              size="sm"
                              placeholder="Description"
                              value={h.description || ""}
                              onChange={(e) => {
                                const updated = [...formData.highlights];
                                updated[i].description = e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  highlights: updated,
                                }));
                              }}
                            />
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => {
                                const updated = [...formData.highlights];
                                updated.splice(i, 1);
                                setFormData((prev) => ({
                                  ...prev,
                                  highlights: updated,
                                }));
                              }}
                            >
                              ❌ Remove
                            </Button>
                          </li>
                        ))}
                      </ul>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            highlights: [
                              ...(prev.highlights || []),
                              { heading: "", description: "" },
                            ],
                          }))
                        }
                      >
                        ➕ Add Highlight
                      </Button>
                    </>
                  )}

                  {/* ───────── WHY CHOOSE US ───────── */}
                  {editMode && (
                    <>
                      <h5>👍 Why Choose Us</h5>
                      <ul className="ps-3">
                        {(formData.whyChooseUs || []).map((item, i) => (
                          <li key={i} className="mb-2">
                            <Form.Control
                              size="sm"
                              placeholder="Title"
                              value={item.title}
                              onChange={(e) => {
                                const updated = [...formData.whyChooseUs];
                                updated[i].title = e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  whyChooseUs: updated,
                                }));
                              }}
                            />
                            <Form.Control
                              size="sm"
                              placeholder="Content"
                              value={item.content}
                              onChange={(e) => {
                                const updated = [...formData.whyChooseUs];
                                updated[i].content = e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  whyChooseUs: updated,
                                }));
                              }}
                            />
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => {
                                const updated = [...formData.whyChooseUs];
                                updated.splice(i, 1);
                                setFormData((prev) => ({
                                  ...prev,
                                  whyChooseUs: updated,
                                }));
                              }}
                            >
                              ❌ Remove
                            </Button>
                          </li>
                        ))}
                      </ul>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            whyChooseUs: [
                              ...(prev.whyChooseUs || []),
                              { title: "", content: "" },
                            ],
                          }))
                        }
                      >
                        ➕ Add Reason
                      </Button>
                    </>
                  )}

                  {/* ───────── ADVANTAGES ───────── */}
                  {editMode && (
                    <>
                      <h5>✅ Advantages</h5>
                      {(formData.advantages || []).map((adv, i) => (
                        <div key={i} className="mb-3">
                          <Form.Control
                            size="sm"
                            placeholder="Category"
                            value={adv.category}
                            onChange={(e) => {
                              const updated = [...formData.advantages];
                              updated[i].category = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                advantages: updated,
                              }));
                            }}
                          />
                          <ul className="ps-3">
                            {(adv.points || []).map((pt, j) => (
                              <li
                                key={j}
                                className="d-flex align-items-center gap-2"
                              >
                                <Form.Control
                                  size="sm"
                                  value={pt}
                                  onChange={(e) => {
                                    const updated = [...formData.advantages];
                                    updated[i].points[j] = e.target.value;
                                    setFormData((prev) => ({
                                      ...prev,
                                      advantages: updated,
                                    }));
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => {
                                    const updated = [...formData.advantages];
                                    updated[i].points.splice(j, 1);
                                    setFormData((prev) => ({
                                      ...prev,
                                      advantages: updated,
                                    }));
                                  }}
                                >
                                  ❌
                                </Button>
                              </li>
                            ))}
                          </ul>
                          <Button
                            size="sm"
                            variant="success"
                            className="me-2"
                            onClick={() => {
                              const updated = [...formData.advantages];
                              updated[i].points.push("");
                              setFormData((prev) => ({
                                ...prev,
                                advantages: updated,
                              }));
                            }}
                          >
                            ➕ Add Point
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => {
                              const updated = [...formData.advantages];
                              updated.splice(i, 1);
                              setFormData((prev) => ({
                                ...prev,
                                advantages: updated,
                              }));
                            }}
                          >
                            ❌ Remove Category
                          </Button>
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            advantages: [
                              ...(prev.advantages || []),
                              { category: "", points: [""] },
                            ],
                          }))
                        }
                      >
                        ➕ Add Advantage Category
                      </Button>
                    </>
                  )}

                  {/* ───────── PRICING ───────── */}
                  <h5>💸 Pricing Plans</h5>
                  {editMode ? (
                    <>
                      {(formData.pricingPlans || []).map((plan, i) => (
                        <div
                          key={i}
                          className="mb-3 p-2 border rounded bg-dark-subtle"
                        >
                          <Form.Control
                            size="sm"
                            className="mb-1"
                            placeholder="Plan Title"
                            value={plan.title}
                            onChange={(e) => {
                              const updated = [...formData.pricingPlans];
                              updated[i].title = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                pricingPlans: updated,
                              }));
                            }}
                          />
                          <Form.Control
                            size="sm"
                            type="number"
                            className="mb-1"
                            placeholder="Price"
                            value={plan.price}
                            onChange={(e) => {
                              const updated = [...formData.pricingPlans];
                              updated[i].price = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                pricingPlans: updated,
                              }));
                            }}
                          />
                          <Form.Control
                            size="sm"
                            className="mb-1"
                            placeholder="Unit (e.g., sq.ft)"
                            value={plan.unit || ""}
                            onChange={(e) => {
                              const updated = [...formData.pricingPlans];
                              updated[i].unit = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                pricingPlans: updated,
                              }));
                            }}
                          />
                          <Form.Select
                            size="sm"
                            className="mb-1"
                            value={plan.priceType || ""}
                            onChange={(e) => {
                              const updated = [...formData.pricingPlans];
                              updated[i].priceType = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                pricingPlans: updated,
                              }));
                            }}
                          >
                            <option value="">-- Select Price Type --</option>
                            <option value="TOTAL">TOTAL</option>
                            <option value="PER_UNIT">PER_UNIT</option>
                          </Form.Select>

                          <Form.Control
                            size="sm"
                            as="textarea"
                            rows={2}
                            className="mb-1"
                            placeholder="Description"
                            value={plan.description || ""}
                            onChange={(e) => {
                              const updated = [...formData.pricingPlans];
                              updated[i].description = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                pricingPlans: updated,
                              }));
                            }}
                          />
                          <ul className="ps-3">
                            {(plan.features || []).map((f, j) => (
                              <li
                                key={j}
                                className="d-flex gap-2 align-items-center"
                              >
                                <Form.Control
                                  size="sm"
                                  value={f}
                                  onChange={(e) => {
                                    const updated = [...formData.pricingPlans];
                                    updated[i].features[j] = e.target.value;
                                    setFormData((prev) => ({
                                      ...prev,
                                      pricingPlans: updated,
                                    }));
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => {
                                    const updated = [...formData.pricingPlans];
                                    updated[i].features.splice(j, 1);
                                    setFormData((prev) => ({
                                      ...prev,
                                      pricingPlans: updated,
                                    }));
                                  }}
                                >
                                  ❌
                                </Button>
                              </li>
                            ))}
                          </ul>
                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => {
                              const updated = [...formData.pricingPlans];
                              if (!updated[i].features)
                                updated[i].features = [];
                              updated[i].features.push("");
                              setFormData((prev) => ({
                                ...prev,
                                pricingPlans: updated,
                              }));
                            }}
                          >
                            ➕ Add Feature
                          </Button>

                          <div className="mt-2">
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => {
                                const updated = [...formData.pricingPlans];
                                updated.splice(i, 1);
                                setFormData((prev) => ({
                                  ...prev,
                                  pricingPlans: updated,
                                }));
                              }}
                            >
                              🗑️ Delete Plan
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            pricingPlans: [
                              ...(prev.pricingPlans || []),
                              {
                                title: "",
                                price: "",
                                unit: "",
                                priceType: "",
                                description: "",
                                features: [],
                              },
                            ],
                          }))
                        }
                      >
                        ➕ Add New Pricing Plan
                      </Button>
                    </>
                  ) : (
                    selectedProject.pricingPlans?.map((plan, i) => (
                      <div key={i} className="mb-3">
                        <strong className="text-warning">{plan.title}</strong> –
                        ₹{plan.price} {plan.unit && `per ${plan.unit}`}{" "}
                        {plan.priceType && (
                          <Badge bg="info" className="ms-1">
                            {plan.priceType}
                          </Badge>
                        )}
                        {plan.features && (
                          <ul>
                            {plan.features.map((f, j) => (
                              <li key={j}>{f}</li>
                            ))}
                          </ul>
                        )}
                        {plan.description && (
                          <div>
                            <em className="small">{plan.description}</em>
                          </div>
                        )}
                      </div>
                    ))
                  )}

                  {/* ───────── CONFIGURATION TABLE ───────── */}
                  {editMode && (
                    <>
                      <h5>📐 Configuration Table</h5>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="configurationTable"
                        value={formData.configurationTable || ""}
                        onChange={handleInputChange}
                      />
                    </>
                  )}

                  {/* ───────── FLOOR PLANS ───────── */}
                  {selectedProject.floorPlans?.length > 0 && (
                    <>
                      <h5>🗺️ Floor Plans</h5>
                      <div className="thumb-grid">
                        {selectedProject.floorPlans.map((fp, i) => (
                          <Image
                            key={i}
                            src={fp?.url || fp}
                            className="thumb"
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </Modal.Body>
          </div>

          <Modal.Footer>
            <Button variant="primary" onClick={handleExportPDF}>
              📄 Export to PDF
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>

            {editMode && (
              <Button
                variant="success"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const updatedFormData = { ...formData };

                    // Upload logoImage if necessary
                    const normalizeSingleImage = async (img, name) => {
                      if (!img) return undefined;

                      if (typeof img === "string") {
                        if (img.startsWith("data:")) {
                          return await uploadImage(img, name);
                        }
                        return {
                          url: img,
                          publicId: extractPublicIdFromUrl(img),
                        };
                      }

                      if (img?.url?.startsWith("data:")) {
                        return await uploadImage(img.url, name);
                      }

                      if (img?.url && img?.publicId) {
                        return img;
                      }

                      return undefined;
                    };

                    updatedFormData.logoImage = await normalizeSingleImage(
                      formData.logoImage,
                      "logo"
                    );
                    updatedFormData.bannerImage = await normalizeSingleImage(
                      formData.bannerImage,
                      "banner"
                    );
                    updatedFormData.aboutImage = await normalizeSingleImage(
                      formData.aboutImage,
                      "about"
                    );

                    // Upload floorPlans (multiple files)
                    if (Array.isArray(formData.floorPlans)) {
                      const uploadedFloorPlans = [];
                      for (const [i, file] of formData.floorPlans.entries()) {
                        const uploadedFile = file?.url?.startsWith("data:")
                          ? await uploadImage(file.url, `floor_${i}`)
                          : file; // If the file is already uploaded, keep it as is
                        uploadedFloorPlans.push(uploadedFile);
                      }
                      updatedFormData.floorPlans = uploadedFloorPlans;
                    }

                    // Upload gallery (multiple files)
                    if (Array.isArray(formData.gallery)) {
                      const uploadedGallery = [];

                      for (const [i, file] of formData.gallery.entries()) {
                        let uploadedFile;

                        if (typeof file === "string") {
                          if (file.startsWith("data:")) {
                            // Case: raw base64 string
                            uploadedFile = await uploadImage(
                              file,
                              `gallery_${i}`
                            );
                          } else {
                            uploadedFile = {
                              url: file,
                              publicId: extractPublicIdFromUrl(file),
                            };
                          }
                        } else if (file?.url?.startsWith("data:")) {
                          // Case: { url: base64, publicId: "" }
                          uploadedFile = await uploadImage(
                            file.url,
                            `gallery_${i}`
                          );
                        } else if (file?.url && file?.publicId !== undefined) {
                          // Case: already uploaded correctly
                          uploadedFile = file;
                        } else {
                          console.warn("Skipping invalid gallery file:", file);
                          continue;
                        }

                        uploadedGallery.push(uploadedFile);
                      }

                      updatedFormData.gallery = uploadedGallery;
                    }
                    // 🛡 Normalize isSKDPick
                    updatedFormData.isSKDPick =
                      updatedFormData.isSKDPick === "YES" ? "YES" : "NO";

                    // 🛡 Normalize price fields
                    updatedFormData.pricingPlans = (
                      updatedFormData.pricingPlans || []
                    ).map((plan) => ({
                      ...plan,
                      price: Number(plan.price),
                    }));

                    // 🛡 Ensure projectStatus, propertyType, ribbonTag are valid
                    const validStatuses = [
                      "LAUNCHED",
                      "UPCOMING",
                      "PRE_LAUNCH",
                      "READY_TO_MOVE",
                    ];
                    const validTypes = [
                      "Plot",
                      "Flat",
                      "Villa",
                      "House",
                      "Commercial Space",
                    ];
                    const validTags = Object.values(ProjectRibbonTag);

                    if (
                      !validStatuses.includes(updatedFormData.projectStatus)
                    ) {
                      updatedFormData.projectStatus = undefined;
                    }
                    if (!validTypes.includes(updatedFormData.propertyType)) {
                      updatedFormData.propertyType = undefined;
                    }
                    if (!validTags.includes(updatedFormData.ribbonTag)) {
                      updatedFormData.ribbonTag = undefined;
                    }

                    // Final PUT request to update the project
                    await axios.put(
                      `${API_BASE}/api/admin/projects/${selectedProject._id}`,
                      updatedFormData
                    );

                    toast.success("Project updated");
                    fetchProjects();
                    setShowModal(false);
                    setEditMode(false);
                  } catch (err) {
                    const serverMsg =
                      err.response?.data?.message || "Something went wrong";
                    toast.error("❌ Update failed: " + serverMsg);
                    console.error(
                      "❌ Backend said:",
                      err.response?.data || err.message
                    );
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                💾 Save Changes
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ControlProjects;
