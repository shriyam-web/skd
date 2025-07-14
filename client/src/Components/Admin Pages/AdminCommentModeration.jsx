import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaCheck, FaTrash, FaReply } from "react-icons/fa";
import "./AdminCommentModeration.css"; // Create this file for custom CSS
// import { toast } from "react-toastify";

const AdminCommentModeration = () => {
  const [pendingComments, setPendingComments] = useState([]);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showApproved, setShowApproved] = useState(false);
  const [approvedComments, setApprovedComments] = useState([]);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchPendingComments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/blogs/comments/pending`
      );
      setPendingComments(res.data);
    } catch (err) {
      toast.error("Failed to fetch comments");
    }
  };

  const fetchApprovedComments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/blogs/comments/approved`
      );
      setApprovedComments(res.data || []);
      setShowApproved(true);
    } catch (err) {
      toast.error("Failed to fetch approved comments");
    }
  };

  useEffect(() => {
    fetchPendingComments();
  }, []);

  const handleApprove = async (blogId, commentId) => {
    try {
      await axios.put(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/blogs/${blogId}/comments/${commentId}/approve`
      );
      toast.success("Comment approved");
      fetchPendingComments();
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const handleDelete = async (blogId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/blogs/${blogId}/comments/${commentId}`
      );
      toast.success("Comment deleted");
      showApproved ? fetchApprovedComments() : fetchPendingComments();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleReplyOpen = (comment) => {
    setCurrentComment(comment);
    setReplyText(comment.replies?.[0]?.reply || "");
    setShowReplyModal(true);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      toast.warning("Reply cannot be empty");
      return;
    }

    const method = currentComment.replies?.length > 0 ? "put" : "post";
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/blogs/${
      currentComment.blogId
    }/comments/${currentComment.commentId}/reply`;

    try {
      await axios[method](url, { reply: replyText });
      toast.success("Reply saved successfully");
      setShowReplyModal(false);
      showApproved ? fetchApprovedComments() : fetchPendingComments();
    } catch (err) {
      console.error("Reply error", err);
      toast.error("Failed to send reply");
    }
  };

  return (
    <div className="container p-4">
      <h3 className="mb-3 text-white">
        {" "}
        <strong>Pending Comments</strong>
      </h3>
      {showApproved ? (
        <>
          <h4 className="text-white mt-4">Approved Comments</h4>
          <Button
            variant="warning"
            size="sm"
            className="mb-2"
            onClick={() => setShowApproved(false)}
          >
            Hide Approved Comments
          </Button>
          <div className="scrollable-table-container2">
            <Table striped bordered hover>
              <thead className="custom-thead">
                <tr>
                  <th>#</th>
                  <th>Blog Title</th>
                  <th>Commenter</th>
                  <th>Comment</th>
                  <th>Replies</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvedComments.map((comment, idx) => (
                  <tr key={comment.commentId} className="comment-row">
                    <td>{idx + 1}</td>
                    <td>{comment.blogTitle}</td>
                    <td>{comment.name}</td>
                    <td>{comment.comment}</td>
                    <td>
                      {comment.replies?.length > 0 ? (
                        <div className="p-2 border bg-light rounded">
                          <strong>Admin Reply:</strong>{" "}
                          {comment.replies[0].reply}
                        </div>
                      ) : (
                        "No reply"
                      )}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          handleDelete(comment.blogId, comment.commentId)
                        }
                      >
                        <FaTrash /> Delete
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="ms-2"
                        onClick={() => handleReplyOpen(comment)}
                      >
                        <FaReply />{" "}
                        {comment.replies?.length > 0 ? "Edit" : "Reply"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      ) : pendingComments.length === 0 ? (
        <div className="text-white">
          <p>No pending comments.</p>
          <Button variant="info" size="sm" onClick={fetchApprovedComments}>
            View all approved comments
          </Button>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="custom-thead">
            <tr>
              <th>#</th>
              <th>Blog Title</th>
              <th>Commenter</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingComments.map((comment, idx) => (
              <tr key={comment.commentId} className="comment-row">
                <td>{idx + 1}</td>
                <td>{comment.blogTitle}</td>
                <td>{comment.name}</td>
                <td>
                  {comment.comment}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2 p-2 border bg-light rounded">
                      <strong>Admin Reply:</strong> {comment.replies[0].reply}
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => handleReplyOpen(comment)}
                        className="ms-2"
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </td>
                <td className="d-flex gap-2 flex-wrap align-items-stretch">
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() =>
                      handleApprove(comment.blogId, comment.commentId)
                    }
                  >
                    <FaCheck /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      handleDelete(comment.blogId, comment.commentId)
                    }
                  >
                    <FaTrash /> Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleReplyOpen(comment)}
                  >
                    <FaReply /> {comment.replies?.length > 0 ? "Edit" : "Reply"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Reply Modal */}
      <Modal
        show={showReplyModal}
        onHide={() => setShowReplyModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Reply to {currentComment?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="replyText">
            <Form.Label>Your Reply</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReplyModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleReplySubmit}>
            Save Reply
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminCommentModeration;
