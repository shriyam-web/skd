import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Modal, Button, Form } from "react-bootstrap";
import "./ImageGalleryManager.css";
import { useNavigate } from "react-router-dom";
import { FaYoutube } from "react-icons/fa"; // YouTube icon

/**
 * ImageGalleryManager – category‑aware version
 * --------------------------------------------------
 * • Shows images grouped under category headings.
 * • “Add image” card opens a modal where the user can:
 *     – choose an existing category OR create a new one
 *     – optionally add a caption
 *     – pick the file to upload
 * • Uses Cloudinary for the raw upload (unchanged) and
 *   then saves {url, public_id, category, caption} to backend.
 * • Expects backend routes:
 *     GET  /api/admin/gallery            → [{ _id, url, category, caption }]
 *     POST /api/admin/gallery/upload     → { url, public_id, category, caption }
 *     DELETE /api/admin/gallery/:id      → remove one
 * --------------------------------------------------
 */
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const ImageGalleryManager = () => {
  const [images, setImages] = useState([]); // flat image list from backend
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  /* upload‑modal state */
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [caption, setCaption] = useState("");

  const API = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  /* ───────────────── fetch ───────────────── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API}/api/admin/gallery`);
        setImages(data);
      } catch (err) {
        toast.error("Failed to fetch images");
      }
    })();
  }, [API]);

  /* ───────────────── derived categories ───────────────── */
  const categories = useMemo(() => {
    const names = new Set(images.map((img) => img.category || "Uncategorised"));
    return Array.from(names).sort();
  }, [images]);

  const imagesByCategory = useMemo(() => {
    return images.reduce((acc, img) => {
      const key = img.category || "Uncategorised";
      acc[key] = acc[key] ? [...acc[key], img] : [img];
      return acc;
    }, {});
  }, [images]);

  /* ───────────────── upload flow ───────────────── */
  const resetUploadForm = () => {
    setSelectedFile(null);
    setSelectedCategory("");
    setNewCategory("");
    setCaption("");
    setIsAddingNewCategory(false); // ← add this line
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // const navigate = useNavigate();

    const isVideo = file.type.startsWith("video/");
    const limit = isVideo ? 50 * 1024 * 1024 : MAX_SIZE; // 50 MB for video

    if (file.size > limit) {
      toast.error(`File must be ≤ ${isVideo ? "50" : "10"} MB`);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please choose an image file");
      return;
    }

    const category = newCategory.trim() || selectedCategory;
    if (!category) {
      toast.error("Please select or create a category");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Uploading media…");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("folder", "skd_gallery");

    try {
      /* 1️⃣ Upload raw file to Cloudinary */
      const isVideo = selectedFile.type.startsWith("video/");
      const uploadUrl = `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME
      }/${isVideo ? "video" : "image"}/upload`;

      const cloudRes = await axios.post(uploadUrl, formData);

      const { secure_url, public_id } = cloudRes.data;

      /* 2️⃣ Save metadata in backend */
      const { data: saved } = await axios.post(
        `${API}/api/admin/gallery/upload`,
        {
          url: secure_url,
          public_id,
          category,
          caption: caption.trim(),
          mediaType: isVideo ? "video" : "image",
        }
      );

      toast.success("Image uploaded successfully", { id: toastId });
      setImages((prev) => [...prev, saved]);
      setShowUploadModal(false);
      resetUploadForm();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  /* ───────────────── delete ───────────────── */
  const confirmDelete = (id) => {
    setSelectedImageId(id);
    setShowDeleteModal(true);
  };

  const deleteImage = async () => {
    try {
      await axios.delete(`${API}/api/admin/gallery/${selectedImageId}`);
      toast.success("Media file deleted");
      setImages((prev) => prev.filter((img) => img._id !== selectedImageId));
    } catch (err) {
      toast.error("Deletion failed");
    } finally {
      setShowDeleteModal(false);
      setSelectedImageId(null);
    }
  };

  /* ───────────────── JSX ───────────────── */
  return (
    <div className="container mycontainer">
      <div className="row">
        <div className="col-sm-7">
          <h2 className="text-white golden-heading p-4">Gallery Manager</h2>
        </div>
        <div className="col-sm-5 mt-2 p-3 gap-3 d-flex justify-content-end ">
          <Button
            variant="success"
            onClick={() => {
              resetUploadForm();
              setShowUploadModal(true);
            }}
          >
            + Add Gallery Media
          </Button>
          <Button
            variant="danger"
            onClick={() => navigate("/admin/youtube-manager")}
          >
            <FaYoutube className="youtube-icon" /> <br /> &nbsp; Manage YouTube
            Videos <br />
            (Unlocking Real Estate)
          </Button>
        </div>
      </div>

      <div className=" mb-3"></div>

      {/* CATEGORY SECTIONS */}
      {categories.map((cat) => (
        <section key={cat} className="category-section">
          <h3 className="category-heading text-white mb-2">{cat}</h3>

          {/* ⬇️  ONLY the extra wrapper changed */}
          <div className="scroll-box">
            <div className="image-grid mt-3 ">
              {imagesByCategory[cat].map((img) => (
                <div className="image-card" key={img._id} title={img.caption}>
                  {img.mediaType === "video" ? (
                    <video src={img.url} className="media-thumb" muted />
                  ) : (
                    <img
                      src={img.url}
                      alt={img.caption || "media"}
                      loading="lazy"
                    />
                  )}
                  {img.caption && (
                    <span className="img-caption">{img.caption}</span>
                  )}
                  <button
                    className="delete-btn"
                    onClick={() => confirmDelete(img._id)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Global add‑card for brand‑new category */}
      <div className="image-grid justify-content-center mb-4">
        <div
          className="image-card add-card"
          onClick={() => {
            setShowUploadModal(true);
            resetUploadForm();
          }}
        >
          <div className="plus-sign">+</div>
        </div>
      </div>

      {/* ───────────── Upload Modal ───────────── */}
      <Modal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Media</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategoryToggle" className="mb-3">
              <Form.Label>Category</Form.Label>

              {/* pill‑style toggle */}
              <div className="category-toggle">
                <label
                  className={`toggle-option ${
                    !isAddingNewCategory ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="categoryMode"
                    value="existing"
                    checked={!isAddingNewCategory}
                    onChange={() => setIsAddingNewCategory(false)}
                  />
                  Select from existing
                </label>

                <label
                  className={`toggle-option ${
                    isAddingNewCategory ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="categoryMode"
                    value="new"
                    checked={isAddingNewCategory}
                    onChange={() => {
                      setIsAddingNewCategory(true);
                      setSelectedCategory("");
                    }}
                  />
                  Add new category
                </label>
              </div>

              {/* input based on toggle */}
              {!isAddingNewCategory ? (
                <Form.Select
                  className="mt-3"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">— Select category —</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control
                  className="mt-3"
                  type="text"
                  placeholder="e.g. Bedroom"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              )}
            </Form.Group>

            <Form.Group controlId="formCaption" className="mb-3">
              <Form.Label>Caption (optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Add a short caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Image / Video File</Form.Label>
              <Form.Control
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading…" : "Upload"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this media file?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteImage}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default ImageGalleryManager;
