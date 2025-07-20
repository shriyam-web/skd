// AdminViewCareer.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AdminSidebar from "../AdminSidebar";
import useAutoLogout from "../../hooks/useAutoLogout";
import "./AdminViewCareer.css";
import { Helmet } from "react-helmet-async";

const AdminViewCareer = () => {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [copiedRowId, setCopiedRowId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [selectedApp, setSelectedApp] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const remainingTime = useAutoLogout();

  const today = new Date();
  const todayCount = applications.filter((app) => {
    const submitted = new Date(app.submittedAt);
    return submitted.toDateString() === today.toDateString();
  }).length;

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/career/all`);
      const sorted = res.data.sort(
        (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
      );
      setApplications(sorted);
      setFiltered(sorted);
    } catch (err) {
      console.error("Failed to load applications", err);
      toast.error("Could not fetch applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    applyFilters(query, selectedPosition);
  };

  const handlePositionFilter = (e) => {
    const pos = e.target.value;
    setSelectedPosition(pos);
    applyFilters(search, pos);
  };

  const applyFilters = (query, position) => {
    const filteredData = applications.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query) ||
        app.position.toLowerCase().includes(query);
      const matchesPosition = position === "All" || app.position === position;
      return matchesSearch && matchesPosition;
    });
    setFiltered(filteredData);
  };

  const uniquePositions = [...new Set(applications.map((a) => a.position))];

  const toggleStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/api/career/${id}`, {
        status: newStatus,
      });
      toast.success("Status updated");
      fetchApplications();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const toggleStar = async (id, newStar) => {
    try {
      await axios.patch(`${API_BASE}/api/career/${id}`, {
        starred: newStar,
      });
      toast.success("Star toggled");
      fetchApplications();
    } catch (err) {
      toast.error("Failed to toggle star");
    }
  };

  const deleteApplication = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await axios.delete(`${API_BASE}/api/career/${id}`);
        toast.success("Deleted successfully");
        fetchApplications();
      } catch (err) {
        toast.error("Failed to delete");
      }
    }
  };

  const handleCopy = (app) => {
    const data = `
  Name: ${app.name}
  Email: ${app.email}
  Phone: ${app.phone}
  DOB: ${app.dob}
  Position: ${app.position} ${app.positionOther || ""}
  Joining: ${app.joining} ${app.joiningOther || ""}
  Qualification: ${app.qualification} (${app.percentage}%)
  Experience: ${app.experience} months
  Address: ${app.address}
  Resume: ${app.resume ? `${API_BASE}${app.resume}` : "N/A"}
  Status: ${app.status || "Pending"}
  Starred: ${app.starred ? "⭐" : "No"}
  Submitted: ${new Date(app.submittedAt).toLocaleString("en-GB")}
  `.trim();

    navigator.clipboard
      .writeText(data)
      .then(() => {
        toast.success("Copied!");
        setCopiedRowId(app._id);
        setTimeout(() => setCopiedRowId(null), 2000);
      })
      .catch(() => toast.error("Failed to copy"));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Career Applications", 14, 10);
    autoTable(doc, {
      head: [
        [
          "Name",
          "Email",
          "Phone",
          "DOB",
          "Position",
          "Joining",
          "Qualification",
          "Experience",
          "Address",
          "Status",
          "Starred",
          "Resume",
          "Date",
        ],
      ],
      body: filtered.map((app) => [
        app.name,
        app.email,
        app.phone,
        app.dob || "-",
        `${app.position} ${app.positionOther || ""}`,
        `${app.joining} ${app.joiningOther || ""}`,
        `${app.qualification} (${app.percentage}%)`,
        `${app.experience} months`,
        app.address,
        app.status,
        app.starred ? "⭐" : "No",
        app.resume ? `${API_BASE}${app.resume}` : "-",
        new Date(app.submittedAt).toLocaleString("en-GB"),
      ]),
      styles: { fontSize: 7 },
      startY: 20,
    });
    doc.save("career_applications.pdf");
  };

  const exportToExcel = () => {
    const data = filtered.map((app) => ({
      Name: app.name,
      Email: app.email,
      Phone: app.phone,
      DOB: app.dob || "-",
      Position:
        app.position + (app.positionOther ? ` (${app.positionOther})` : ""),
      Joining: app.joining + (app.joiningOther ? ` (${app.joiningOther})` : ""),
      Qualification: `${app.qualification} (${app.percentage}%)`,
      Experience: `${app.experience} months`,
      Address: app.address,
      Status: app.status,
      Starred: app.starred ? "⭐" : "No",
      Resume: app.resume ? `${API_BASE}${app.resume}` : "-",
      Submitted: new Date(app.submittedAt).toLocaleString("en-GB"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CareerApplications");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "career_applications.xlsx");
  };

  return (
    <>
      <Helmet>
        <title>Admin | Career Application </title>
      </Helmet>
      <div className="p-4 text-white career-applications-page">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold">Career Applications</h3>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-success" onClick={exportToPDF}>
              📄 Export PDF
            </button>
            <button className="btn btn-outline-primary" onClick={exportToExcel}>
              📊 Export Excel
            </button>
            <button
              className="btn btn-outline-light"
              onClick={fetchApplications}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="mb-3 d-flex flex-wrap gap-3 align-items-center">
          <span className="badge bg-info fs-6">
            📅 Today’s Applications: <strong>{todayCount}</strong>
          </span>
          <span className="badge bg-secondary fs-6">
            📊 Total: <strong>{applications.length}</strong>
          </span>

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="🔍 Search by name, email or position"
            className="form-control"
          />

          <select
            className="form-select"
            style={{ maxWidth: "200px" }}
            value={selectedPosition}
            onChange={handlePositionFilter}
          >
            <option value="All">All Positions</option>
            {uniquePositions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="alert alert-info">Loading applications...</div>
        ) : filtered.length === 0 ? (
          <div className="alert alert-warning">No applications found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover table-bordered">
              <thead className="table-light text-dark sticky-top">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Position</th>
                  <th>Qualification</th>
                  <th>Status</th>
                  <th>⭐</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, idx) => (
                  <tr
                    key={app._id}
                    className={
                      app.starred ? "border-start border-warning border-4" : ""
                    }
                  >
                    <td>{idx + 1}</td>
                    <td>{app.name}</td>
                    <td>{app.email}</td>
                    <td>{app.phone}</td>
                    <td>
                      {app.position}{" "}
                      {app.positionOther && `(${app.positionOther})`}
                    </td>
                    <td>
                      {app.qualification} ({app.percentage}%)
                    </td>
                    <td>
                      <select
                        className={`form-select form-select-sm ${
                          app.status === "Shortlisted"
                            ? "bg-success text-white"
                            : app.status === "Called for Interview"
                            ? "bg-info text-white"
                            : app.status === "Rejected"
                            ? "bg-danger text-white"
                            : app.status === "Candidate Selected"
                            ? "bg-primary text-white"
                            : ""
                        }`}
                        value={app.status || "Pending"}
                        onChange={(e) => toggleStatus(app._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Called for Interview">
                          Called for Interview
                        </option>
                        <option value="Rejected">Rejected</option>
                        <option value="Candidate Selected">
                          Candidate Selected
                        </option>{" "}
                        {/* ✅ New */}
                      </select>
                    </td>
                    <td className="text-center">
                      <button
                        className={`btn btn-sm ${
                          app.starred ? "btn-warning" : "btn-outline-warning"
                        }`}
                        onClick={() => toggleStar(app._id, !app.starred)}
                      >
                        ⭐
                      </button>
                    </td>
                    <td>{new Date(app.submittedAt).toLocaleString("en-GB")}</td>
                    <td>
                      <div className="actions-cell d-flex flex-column gap-1">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => setSelectedApp(app)}
                        >
                          👁️ View
                        </button>
                        <button
                          className={`btn btn-sm ${
                            copiedRowId === app._id
                              ? "btn-success text-white"
                              : "btn-outline-light"
                          }`}
                          onClick={() => handleCopy(app)}
                        >
                          {copiedRowId === app._id ? "✅ Copied!" : "📋 Copy"}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteApplication(app._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedApp && (
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.7)" }}
            tabIndex="-1"
            role="dialog"
          >
            <div
              className="modal-dialog modal-dialog-scrollable modal-lg"
              role="document"
            >
              <div className="modal-content bg-dark text-white">
                <div className="modal-header border-secondary">
                  <h5 className="modal-title">Application Details</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setSelectedApp(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  {selectedApp.resume && (
                    <p>
                      <strong>Resume:</strong>{" "}
                      <a
                        href={`${API_BASE}${selectedApp.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-success ms-2"
                      >
                        📄 View Resume
                      </a>
                    </p>
                  )}
                  <p>
                    <strong>Name:</strong> {selectedApp.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedApp.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedApp.phone}
                  </p>
                  <p>
                    <strong>DOB:</strong> {selectedApp.dob}
                  </p>
                  <p>
                    <strong>Position:</strong> {selectedApp.position}{" "}
                    {selectedApp.positionOther &&
                      `(${selectedApp.positionOther})`}
                  </p>
                  <p>
                    <strong>Joining:</strong> {selectedApp.joining}{" "}
                    {selectedApp.joiningOther &&
                      `(${selectedApp.joiningOther})`}
                  </p>
                  <p>
                    <strong>Qualification:</strong> {selectedApp.qualification}{" "}
                    ({selectedApp.percentage}%)
                  </p>
                  <p>
                    <strong>Experience:</strong> {selectedApp.experience} months
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedApp.address}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedApp.status || "Pending"}
                  </p>
                  <p>
                    <strong>Starred:</strong>{" "}
                    {selectedApp.starred ? "⭐ Yes" : "No"}
                  </p>
                  <p>
                    <strong>Submitted At:</strong>{" "}
                    {new Date(selectedApp.submittedAt).toLocaleString("en-GB")}
                  </p>
                </div>
                <div className="modal-footer border-secondary">
                  <button
                    className="btn btn-outline-light"
                    onClick={() => setSelectedApp(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminViewCareer;
