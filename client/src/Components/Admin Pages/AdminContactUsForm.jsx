import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../AdminSidebar";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./AdminContactUsForm.css"; // If you have any custom styles
import useAutoLogout from "../../hooks/useAutoLogout";

const AdminContactUsForm = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const today = new Date();
  const todayCount = leads.filter((lead) => {
    const createdDate = new Date(lead.createdAt);
    return createdDate.toDateString() === today.toDateString();
  }).length;

  const [copiedRowId, setCopiedRowId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/lead/${id}`);
      alert("Lead deleted");
      fetchLeads();

      if (res.status === 200) {
        toast.success("Lead deleted");
        setLeads((prev) => prev.filter((lead) => lead._id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      alert("Error deleting lead");
      console.error(err);
    }
  };
  const remainingTime = useAutoLogout(); // MM:SS format

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/lead/all");
      const sorted = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLeads(sorted);
      setFilteredLeads(sorted);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError("Failed to load leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.propertyType.toLowerCase().includes(query)
    );
    setFilteredLeads(filtered);
  };

  const getLeadRowClass = (createdAt) => {
    const leadDate = new Date(createdAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = leadDate.toDateString() === today.toDateString();
    const isYesterday = leadDate.toDateString() === yesterday.toDateString();

    if (isToday) return "table-success"; // Green
    if (isYesterday) return "table-warning"; // Yellow
    return "table-secondary"; // Gray
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Customer Leads", 14, 10);
    const tableColumn = [
      "Name",
      "Email",
      "Phone",
      "Property Type",
      "Message",
      "Date",
    ];
    const tableRows = [];

    filteredLeads.forEach((lead) => {
      const leadData = [
        lead.name,
        lead.email,
        lead.phone,
        lead.propertyType,
        lead.message || "—",
        new Date(lead.createdAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      ];
      tableRows.push(leadData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("customer_leads.pdf");
  };

  const exportToExcel = () => {
    const worksheetData = filteredLeads.map((lead) => ({
      Name: lead.name,
      Email: lead.email,
      Phone: lead.phone,
      "Property Type": lead.propertyType,
      Message: lead.message || "—",
      Date: new Date(lead.createdAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "customer_leads.xlsx");
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Contacted" ? "Pending" : "Contacted";

    try {
      await axios.put(`http://localhost:5000/api/lead/status/${id}`, {
        status: newStatus,
      });

      toast.success(`Marked as ${newStatus}`);
      fetchLeads(); // Refresh the leads list
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    }
  };

  const handleCopyRow = (lead) => {
    const textToCopy = `
Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone}
Property Type: ${lead.propertyType}
Message: ${lead.message || "—"}
Date: ${new Date(lead.createdAt).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}
Status: ${lead.status || "Pending"}
Starred: ${lead.starred ? "Yes ⭐" : "No"}
`.trim();

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success("Row copied to clipboard!");
        setCopiedRowId(lead._id); // ✅ Set copied row
        setTimeout(() => setCopiedRowId(null), 2000); // ✅ Clear after 2 sec
      })
      .catch((err) => {
        console.error("Copy failed", err);
        toast.error("Failed to copy");
      });
  };

  const toggleStar = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/lead/star/${id}`);
      fetchLeads(); // refresh list
      toast.success("Star toggled");
    } catch (err) {
      console.error("Failed to toggle star", err);
      toast.error("Error toggling star");
    }
  };

  return (
    <div
      className="p-4  text-white"
      // style={{ backgroundColor: "#1e1e1e", minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Contact Us Form Responses 📝</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success" onClick={exportToPDF}>
            📄 Export PDF
          </button>
          <button className="btn btn-outline-primary" onClick={exportToExcel}>
            📊 Export Excel
          </button>
          <button className="btn btn-outline-light" onClick={fetchLeads}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="mb-3 d-flex gap-3">
        <span className="badge bg-info fs-6">
          📅 Today's Leads: <strong>{todayCount}</strong>
        </span>
        <span className="badge bg-secondary fs-6">
          📊 Total Leads: <strong>{leads.length}</strong>
        </span>
      </div>

      <div className="mb-3">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="🔍 Search by name, email or property type"
          className="form-control"
        />
      </div>

      {loading && <div className="alert alert-info">Loading leads...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && filteredLeads.length > 0 && (
        <>
          <div className="mb-2">
            <span className="badge bg-success me-2">Today</span>
            <span className="badge bg-warning text-dark me-2">Yesterday</span>
            <span className="badge bg-secondary">Older</span>
          </div>

          <div
            className="table-responsive"
            style={{
              maxHeight: "60vh",
              overflowY: "auto",
              borderRadius: "10px",
            }}
          >
            <table
              className="table table-dark table-hover table-bordered rounded overflow-hidden"
              style={{ tableLayout: "auto", wordWrap: "break-word" }}
            >
              <thead className="table-light text-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Property Type</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, index) => (
                  <tr
                    key={lead._id}
                    className={getLeadRowClass(lead.createdAt)}
                  >
                    <td>{index + 1}</td>
                    <td className="name-col">{lead.name}</td>
                    <td className="email-col">{lead.email}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.propertyType}</td>
                    <td className="message-col">{lead.message || "—"}</td>
                    <td>
                      {new Date(lead.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          lead.status === "Contacted"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="actions-col d-flex flex-wrap gap-2">
                      <button
                        className={`btn btn-sm ${
                          lead.starred
                            ? "btn-primary text-white"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => toggleStar(lead._id)}
                      >
                        {lead.starred ? "⭐ Starred" : "☆ Star"}
                      </button>

                      <button
                        className={`btn btn-sm small ${
                          lead.status === "Contacted"
                            ? "btn-warning text-dark"
                            : "btn-success"
                        }`}
                        onClick={() => toggleStatus(lead._id, lead.status)}
                      >
                        {lead.status === "Contacted"
                          ? "Mark Pending"
                          : "Mark Contacted"}
                      </button>

                      <button
                        className={`btn btn-sm small ${
                          copiedRowId === lead._id
                            ? "btn-success text-white"
                            : "btn-outline-dark"
                        }`}
                        onClick={() => handleCopyRow(lead)}
                      >
                        {copiedRowId === lead._id ? "✅ Copied!" : "📋 Copy"}
                      </button>

                      <button
                        className="btn btn-sm btn-danger small"
                        onClick={() => handleDelete(lead._id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminContactUsForm;
