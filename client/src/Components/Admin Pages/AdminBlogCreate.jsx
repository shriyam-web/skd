import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import FontSize from "../../extensions/FontSize";
import LineHeight from "../../extensions/LineHeight";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaPalette,
  FaLink,
  FaUnlink,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaImage,
} from "react-icons/fa";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminBlogCreate.css";

const AdminBlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({ title: "", author: "", tags: "" });
  const [image, setImage] = useState(null);
  const [editBlogId, setEditBlogId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const colorRef = useRef();
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      FontSize,
      LineHeight,
    ],
    content: "",
  });

  const API = `${import.meta.env.VITE_API_BASE_URL}/api/blogs`;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(API);
      setBlogs(res.data);
    } catch (err) {
      toast.error("Failed to fetch blogs.");
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setFormData({
        title: blog.title,
        author: blog.author,
        tags: blog.tags,
      });
      editor?.commands.setContent(blog.content);
      setEditBlogId(blog._id);
    } else {
      setFormData({ title: "", author: "", tags: "" });
      editor?.commands.setContent("");
      setEditBlogId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = editor?.getHTML();

    if (!content || content.trim() === "<p></p>") {
      toast.error("Content cannot be empty.");
      return;
    }

    setLoading(true); // ⬅️ Start loading

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("tags", formData.tags);
      data.append("content", content);
      if (image) data.append("image", image);
      data.append("timestamp", new Date().toISOString());

      if (editBlogId) {
        await axios.put(`${API}/${editBlogId}`, data);
        toast.success("Blog updated.");
      } else {
        await axios.post(API, data);
        toast.success("Blog created.");
      }

      setShowModal(false);
      fetchBlogs();
      setFormData({ title: "", author: "", tags: "" });
      setImage(null);
      editor?.commands.setContent("");
    } catch (err) {
      toast.error("Submission failed.");
    } finally {
      setLoading(false); // ⬅️ End loading
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/${deleteId}`);
      toast.success("Blog deleted.");
      fetchBlogs();
    } catch (err) {
      toast.error("Delete failed.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="container adminblog-create py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">
          {" "}
          <strong>Blogs Manager 📝 </strong>
        </h3>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={fetchBlogs}>
            🔄 Refresh
          </Button>
          <Button variant="warning" onClick={() => handleOpenModal()}>
            <FaPlus /> Create New Blog
          </Button>
        </div>
      </div>

      {/* Blog List */}
      <div className="table-responsive blog-table-container  pe-4">
        <table className="table  table-hover align-middle adminblog-table">
          <thead className="adminblog-table-head  ps-2">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Author</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody className="tbodykahissa  ps-2">
            {blogs.map((blog, idx) => (
              <tr key={blog._id} className="tbodykahissa  ps-2">
                <td>{idx + 1}</td>
                <td>{blog.title}</td>
                <td>{blog.author}</td>
                <td>{blog.tags}</td>
                <td>
                  <div className="action-buttons">
                    <Button
                      variant="info"
                      size="sm"
                      className=""
                      onClick={() => handleOpenModal(blog)}
                    >
                      {" "}
                      Edit &nbsp;
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setDeleteId(blog._id);
                        setShowDeleteModal(true);
                      }}
                    >
                      {" "}
                      Delete &nbsp;
                      <FaTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl" // ⬅️ Wider modal
        backdrop="static" // ⬅️ Prevents close on outside click
        keyboard={false} // ⬅️ Prevents close on ESC
        dialogClassName="custom-blog-modal" // ⬅️ Optional custom width via CSS
      >
        <Modal.Header closeButton>
          <Modal.Title>{editBlogId ? "Edit Blog" : "Create Blog"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Author</label>
              <input
                type="text"
                className="form-control"
                name="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                className="form-control"
                name="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Upload Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Content</label>
              <div className="adminblog-toolbar-scroll d-flex flex-wrap gap-2 mb-2">
                {/* Toolbar Buttons */}
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <FaBold />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  <FaItalic />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                  <FaUnderline />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                  <FaStrikethrough />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                >
                  <FaListUl />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                >
                  <FaListOl />
                </button>
                <button type="button" onClick={() => colorRef.current.click()}>
                  <FaPalette />
                </button>
                <input
                  type="color"
                  ref={colorRef}
                  style={{ display: "none" }}
                  onChange={(e) =>
                    editor.chain().focus().setColor(e.target.value).run()
                  }
                />
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Enter URL");
                    if (url)
                      editor.chain().focus().setLink({ href: url }).run();
                  }}
                >
                  <FaLink />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().unsetLink().run()}
                >
                  <FaUnlink />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                >
                  <FaAlignLeft />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                >
                  <FaAlignCenter />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                >
                  <FaAlignRight />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Paste image URL");
                    if (url)
                      editor.chain().focus().setImage({ src: url }).run();
                  }}
                >
                  <FaImage />
                </button>
                {/* ...existing toolbar buttons... */}
                <select
                  onChange={(e) => {
                    editor
                      .chain()
                      .focus()
                      .setMark("textStyle", {}) // required to activate textStyle
                      .setFontSize(e.target.value)
                      .run();
                  }}
                  defaultValue=""
                >
                  <option value="">Font Size</option>
                  <option value="0.75rem">Small</option>
                  <option value="1rem">Normal</option>
                  <option value="1.25rem">Large</option>
                  <option value="1.5rem">XL</option>
                </select>

                <select
                  onChange={(e) => {
                    editor
                      .chain()
                      .focus()
                      .updateAttributes("paragraph", {
                        lineHeight: e.target.value,
                      })
                      .run();
                  }}
                  defaultValue=""
                >
                  <option value="">Line Height</option>
                  <option value="1">1</option>
                  <option value="1.5">1.5</option>
                  <option value="2">2</option>
                  <option value="2.5">2.5</option>
                </select>
              </div>

              <EditorContent editor={editor} className="tiptap" />
            </div>

            <Button type="submit" variant="success" disabled={loading}>
              {loading
                ? editBlogId
                  ? "Updating..."
                  : "Creating..."
                : editBlogId
                ? "Update Blog"
                : "Create Blog"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this blog?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default AdminBlogManager;
