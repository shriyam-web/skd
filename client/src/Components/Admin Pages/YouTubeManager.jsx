import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal, Button, Form } from "react-bootstrap";
import "./YouTubeManager.css";
import { Helmet } from "react-helmet-async";

const YouTubeManager = () => {
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    url: "",
    description: "",
    thumbnail: "",
  });

  const API = import.meta.env.VITE_API_BASE_URL;

  const fetchVideos = async () => {
    const res = await axios.get(`${API}/api/admin/youtube`);
    setVideos(res.data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddVideo = async () => {
    try {
      const { title, url } = newVideo;
      if (!title || !url) return toast.error("Title and URL are required");

      const res = await axios.post(`${API}/api/admin/youtube`, newVideo);
      setVideos((prev) => [res.data, ...prev]);
      setShowModal(false);
      setNewVideo({ title: "", url: "", description: "", thumbnail: "" });
      toast.success("Video added");
    } catch {
      toast.error("Failed to add video");
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/api/admin/youtube/${id}`);
    setVideos((prev) => prev.filter((v) => v._id !== id));
    toast.success("Deleted");
  };

  return (
    <>
      <Helmet>
        <title>Admin | Youtube Manager</title>
      </Helmet>
      <div className="container">
        <h2 className="text-white golden-heading p-4 mb-0">
          Unlocking Real Estate – Videos
        </h2>
        <Button
          variant="primary"
          className="mb-2 mt-0  m-4"
          onClick={() => setShowModal(true)}
        >
          + Add Video
        </Button>

        <div className="video-grid mt-4 ps-4">
          {videos.map((video) => (
            <div key={video._id} className="video-card">
              <iframe
                width="100%"
                height="200"
                src={video.url}
                title={video.title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <h5 className="text-white">{video.title}</h5>
              <p className="text-white">{video.description}</p>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(video._id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>

        {/* Add Video Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add YouTube Video</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  value={newVideo.title}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>YouTube Embed URL</Form.Label>
                <Form.Control
                  value={newVideo.url}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, url: e.target.value })
                  }
                  placeholder="e.g. https://www.youtube.com/embed/abc123"
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={newVideo.description}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, description: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddVideo}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default YouTubeManager;
