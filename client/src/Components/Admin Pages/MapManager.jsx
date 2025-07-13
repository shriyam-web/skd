import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./MapManager.css";

const MapManager = () => {
  const API = import.meta.env.VITE_API_BASE_URL;

  const [mapEntries, setMapEntries] = useState([]);
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [projectLogo, setProjectLogo] = useState(null);
  const [projectLogoUrl, setProjectLogoUrl] = useState("");
  const [sector, setSector] = useState("");
  const [pocket, setPocket] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const [existingProjects, setExistingProjects] = useState([]);
  const [existingSectors, setExistingSectors] = useState([]);
  const [existingPockets, setExistingPockets] = useState([]);

  const [showNewProjectInput, setShowNewProjectInput] = useState(false);
  const [showNewSectorInput, setShowNewSectorInput] = useState(false);
  const [showNewPocketInput, setShowNewPocketInput] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchMapEntries();
  }, []);

  const fetchMapEntries = async () => {
    try {
      const res = await axios.get(`${API}/api/map-manager`);
      const maps = res.data.maps || [];
      setMapEntries(maps);
      const projects = [...new Set(maps.map((m) => m.projectName))];
      setExistingProjects(projects);
    } catch (err) {
      console.error("Error fetching map entries:", err);
    }
  };

  useEffect(() => {
    const sectors = mapEntries
      .filter((m) => m.projectName === projectName)
      .map((m) => m.sector);
    setExistingSectors([...new Set(sectors)]);
  }, [projectName, mapEntries]);

  useEffect(() => {
    const pockets = mapEntries
      .filter((m) => m.projectName === projectName && m.sector === sector)
      .map((m) => m.pocket);
    setExistingPockets([...new Set(pockets)]);
  }, [sector, projectName, mapEntries]);

  const handleUploadImage = async () => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("folder", "project-maps");
    const cloudName = import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
      const res = await axios.post(uploadUrl, formData);
      setImageUrl(res.data.secure_url);
    } catch (error) {
      console.error("Image upload error", error);
    }
  };

  const handleAutoUploadProjectLogo = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("folder", "project-logos");
    const cloudName = import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
      const res = await axios.post(uploadUrl, formData);
      setProjectLogoUrl(res.data.secure_url);
    } catch (err) {
      console.error("Project logo upload error:", err);
    }
  };

  const handleSubmit = async () => {
    if (!projectName || !sector || !pocket || !imageUrl) {
      alert("Please fill all required fields");
      return;
    }

    // Check for duplicate
    const duplicate = mapEntries.find(
      (entry) =>
        entry.projectName === projectName &&
        entry.sector === sector &&
        entry.pocket === pocket
    );

    if (duplicate) {
      alert(
        "A map with this Project > Sector > Pocket combination already exists. To make changes, please delete the existing entry and re-add the updated one."
      );
      return;
    }

    const payload = {
      projectName,
      sector,
      pocket,
      imageUrl,
      title,
      description,
      projectLogo: projectLogoUrl,
    };

    try {
      await axios.post(`${API}/api/map-manager/add`, payload);
      alert("Map entry added successfully!");
      fetchMapEntries();
      resetForm();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const resetForm = () => {
    setStep(1);
    setProjectName("");
    setSector("");
    setPocket("");
    setTitle("");
    setDescription("");
    setImageFile(null);
    setImageUrl("");
    setProjectLogo(null);
    setProjectLogoUrl("");
    setShowNewProjectInput(false);
    setShowNewSectorInput(false);
    setShowNewPocketInput(false);
  };

  const handleDeleteEntry = async (id) => {
    try {
      await axios.delete(`${API}/api/map-manager/${id}`);
      fetchMapEntries();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <>
      {/* <div className="p-4 text-white heading"> Create Map </div> */}
      {/* <div className="mapmgr-container py-4"> */}
      <div className="mapmgr-card border-light mb-4 py-4">
        <div className="mapmgr-card-body">
          <h4 className="mapmgr-step-header">
            Step {step} of 4: Creating Project Map{" "}
          </h4>

          {/* STEP 1: Project Name + Logo */}
          {step === 1 && (
            <div className="mapmgr-step">
              <label className="mapmgr-label">Project *</label>
              {!showNewProjectInput ? (
                <select
                  className="mapmgr-select mb-2"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                >
                  <option value="">Select or Add New Project</option>
                  {existingProjects.map((p, idx) => (
                    <option key={idx} value={p}>
                      {p}
                    </option>
                  ))}
                  <option value="__add_new">+ Add New Project</option>
                </select>
              ) : (
                <input
                  className="mapmgr-input mb-2"
                  placeholder="Enter new project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              )}

              {projectName === "__add_new" && !showNewProjectInput && (
                <button
                  className="mapmgr-button mapmgr-btn-warning"
                  onClick={() => setShowNewProjectInput(true)}
                >
                  Add Project Name
                </button>
              )}

              {showNewProjectInput && (
                <>
                  <label className="mapmgr-label mt-2">Project Logo</label>
                  <input
                    type="file"
                    className="mapmgr-input"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setProjectLogo(file);
                      handleAutoUploadProjectLogo(file);
                    }}
                  />
                  {projectLogoUrl && (
                    <img
                      src={projectLogoUrl}
                      alt="Project Logo"
                      className="mapmgr-img-preview"
                      style={{ maxHeight: "80px", marginTop: "10px" }}
                    />
                  )}
                </>
              )}

              <button
                className="mapmgr-button mapmgr-btn-primary mt-3"
                onClick={() => setStep(2)}
              >
                Next
              </button>
            </div>
          )}

          {/* STEP 2: Sector */}
          {step === 2 && (
            <div className="mapmgr-step">
              <label className="mapmgr-label">Sector *</label>
              {!showNewSectorInput ? (
                <select
                  className="mapmgr-select mb-2"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                >
                  <option value="">Select or Add Sector</option>
                  {existingSectors.map((s, idx) => (
                    <option key={idx} value={s}>
                      {s}
                    </option>
                  ))}
                  <option value="__add_new">+ Add New Sector</option>
                </select>
              ) : (
                <input
                  className="mapmgr-input mb-2"
                  placeholder="Enter new sector"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                />
              )}
              {sector === "__add_new" && !showNewSectorInput && (
                <button
                  className="mapmgr-button mapmgr-btn-warning"
                  onClick={() => setShowNewSectorInput(true)}
                >
                  Add Sector Name
                </button>
              )}
              <div className="d-flex gap-2 mt-3">
                <button
                  className="mapmgr-button mapmgr-btn-secondary"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button
                  className="mapmgr-button mapmgr-btn-primary"
                  onClick={() => setStep(3)}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Pocket */}
          {step === 3 && (
            <div className="mapmgr-step">
              <label className="mapmgr-label">Pocket *</label>
              {!showNewPocketInput ? (
                <select
                  className="mapmgr-select mb-2"
                  value={pocket}
                  onChange={(e) => setPocket(e.target.value)}
                >
                  <option value="">Select or Add Pocket</option>
                  {existingPockets.map((p, idx) => (
                    <option key={idx} value={p}>
                      {p}
                    </option>
                  ))}
                  <option value="__add_new">+ Add New Pocket</option>
                </select>
              ) : (
                <input
                  className="mapmgr-input mb-2"
                  placeholder="Enter new pocket"
                  value={pocket}
                  onChange={(e) => setPocket(e.target.value)}
                />
              )}
              {pocket === "__add_new" && !showNewPocketInput && (
                <button
                  className="mapmgr-button mapmgr-btn-warning"
                  onClick={() => setShowNewPocketInput(true)}
                >
                  Add Pocket Name
                </button>
              )}
              <div className="d-flex gap-2 mt-3">
                <button
                  className="mapmgr-button mapmgr-btn-secondary"
                  onClick={() => setStep(2)}
                >
                  Back
                </button>
                <button
                  className="mapmgr-button mapmgr-btn-primary"
                  onClick={() => setStep(4)}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Map Image Upload */}
          {step === 4 && (
            <div className="mapmgr-step">
              <label className="mapmgr-label">Map Image *</label>
              <input
                type="file"
                className="mapmgr-input mb-2"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <button
                className="mapmgr-button mapmgr-btn-warning mb-3"
                onClick={handleUploadImage}
              >
                Upload Image
              </button>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="mapmgr-img-preview"
                />
              )}
              <label className="mapmgr-label">Title (optional)</label>
              <input
                className="mapmgr-input mb-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label className="mapmgr-label">Description (optional)</label>
              <textarea
                className="mapmgr-textarea mb-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
              <div className="d-flex gap-2">
                <button
                  className="mapmgr-button mapmgr-btn-secondary"
                  onClick={() => setStep(3)}
                >
                  Back
                </button>
                <button
                  className="mapmgr-button mapmgr-btn-success"
                  onClick={handleSubmit}
                >
                  Submit Map Entry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Button
        variant="danger"
        className="m-4 mt-0 mb-0 text-white"
        onClick={() => setShowDeleteModal(true)}
      >
        Delete Map Entries
      </Button>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        size="lg"
      >
        <Modal.Header closeButton className="mapmgr-modal-header">
          <Modal.Title className="mapmgr-modal-title text-white">
            Delete Map Entries
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="mapmgr-modal-body">
          <div className="row">
            {mapEntries.map((entry) => (
              <div className="col-md-6 mb-3" key={entry._id}>
                <div className="card bg-dark text-white p-2">
                  <h6>
                    {entry.projectName} - {entry.sector} - {entry.pocket}
                  </h6>
                  <img
                    src={entry.imageUrl}
                    alt="map"
                    className="img-fluid mb-2"
                  />
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteEntry(entry._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
      {/* </div> */}
    </>
  );
};

export default MapManager;
