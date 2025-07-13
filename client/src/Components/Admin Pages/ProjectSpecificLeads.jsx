import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../AdminSidebar";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./ProjectSpecificLeads.css";
import useAutoLogout from "../../hooks/useAutoLogout";

const ProjectSpecificLeads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [copiedRowId, setCopiedRowId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const remainingTime = useAutoLogout();

  const today = new Date();
  const todayCount = leads.filter((lead) => {
    const createdDate = new Date(lead.createdAt);
    return createdDate.toDateString() === today.toDateString();
  }).length;

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/project-enquiry/all"
      );
      const sorted = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLeads(sorted);
      setFilteredLeads(sorted);
    } catch (err) {
      console.error("Error fetching project leads:", err);
      setError("Failed to load project enquiries.");
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
        lead.projectName.toLowerCase().includes(query)
    );
    setFilteredLeads(filtered);
  };

  const getLeadRowClass = (createdAt) => {
    const leadDate = new Date(createdAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (leadDate.toDateString() === today.toDateString())
      return "table-success";
    if (leadDate.toDateString() === yesterday.toDateString())
      return "table-warning";
    return "table-secondary";
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Project Enquiries", 14, 10);
    const tableColumn = ["Name", "Email", "Phone", "Project Name", "Date"];
    const tableRows = [];

    filteredLeads.forEach((lead) => {
      const leadData = [
        lead.name,
        lead.email,
        lead.phone,
        lead.projectName,
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

    doc.save("project_enquiries.pdf");
  };

  const exportToExcel = () => {
    const worksheetData = filteredLeads.map((lead) => ({
      Name: lead.name,
      Email: lead.email,
      Phone: lead.phone,
      "Project Name": lead.projectName,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Project Enquiries");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "project_enquiries.xlsx");
  };

  const handleCopyRow = (lead) => {
    const textToCopy = `
Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone}
Project: ${lead.projectName}
Remark: ${lead.remark || "-"}
Status: ${lead.status}
Starred: ${lead.starred ? "Yes ⭐" : "No"}
Date: ${new Date(lead.createdAt).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}
`.trim();

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success("Row copied to clipboard!");
        setCopiedRowId(lead._id);
        setTimeout(() => setCopiedRowId(null), 2000);
      })
      .catch((err) => {
        console.error("Copy failed", err);
        toast.error("Failed to copy");
      });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/project-enquiry/${id}`
      );
      if (res.status === 200) {
        toast.success("Entry deleted");
        fetchLeads();
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting entry");
    }
  };

  const toggleStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/project-enquiry/${id}`, {
        status: newStatus,
      });
      toast.success("Status updated");
      fetchLeads(); // refresh list
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  const toggleStarred = async (id, newStarred) => {
    try {
      await axios.patch(`http://localhost:5000/api/project-enquiry/${id}`, {
        starred: newStarred,
      });
      toast.success("Star updated");
      fetchLeads();
    } catch (err) {
      toast.error("Failed to update star");
      console.error(err);
    }
  };

  return (
    <div className="p-4 text-white project-leads-page">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Project Specific Leads 📈</h3>
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

      <select
        className="form-select w-auto mb-3"
        onChange={(e) => {
          const selected = e.target.value;
          if (selected === "all") {
            setFilteredLeads(leads);
          } else {
            setFilteredLeads(
              leads.filter((lead) => lead.projectName === selected)
            );
          }
        }}
      >
        <option value="all" className="allprojectheading">
          All Projects
        </option>
        {[...new Set(leads.map((lead) => lead.projectName))].map((project) => (
          <option key={project} value={project}>
            {project}
          </option>
        ))}
      </select>

      <div className="mb-3">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="🔍 Search by name, email or project"
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
              maxHeight: "52vh",
              overflowY: "auto",
              borderRadius: "10px",
            }}
          >
            <table className="table table-dark table-hover table-bordered fixed-table">
              <thead className="table-light text-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Project Name</th>
                  <th>Remark</th>
                  <th>Status</th>
                  <th>⭐</th>

                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, index) => (
                  <tr
                    key={lead._id}
                    className={`${getLeadRowClass(lead.createdAt)} ${
                      lead.starred ? "border-start border-warning border-4" : ""
                    }`}
                  >
                    <td>{index + 1}</td>
                    <td className="name-col">{lead.name}</td>
                    <td className="email-col">{lead.email}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.projectName}</td>
                    <td className="remark-col" title={lead.remark || "-"}>
                      {lead.remark || "-"}
                    </td>

                    <td>
                      <button
                        className={`btn btn-sm ${
                          lead.status === "Contacted"
                            ? "btn-success"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() =>
                          toggleStatus(
                            lead._id,
                            lead.status === "Pending" ? "Contacted" : "Pending"
                          )
                        }
                      >
                        {lead.status}
                      </button>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          lead.starred ? "btn-warning" : "btn-outline-warning"
                        }`}
                        onClick={() => toggleStarred(lead._id, !lead.starred)}
                      >
                        ⭐
                      </button>
                    </td>
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
                    <td className="actions-col align-middle">
                      <div className="d-flex flex-wrap gap-2 mb-2 h-100 align-items-stretch">
                        <button
                          className={`btn btn-sm ${
                            copiedRowId === lead._id
                              ? "btn-success text-white"
                              : "btn-outline-dark"
                          }`}
                          onClick={() => handleCopyRow(lead)}
                        >
                          {copiedRowId === lead._id ? "✅ Copied!" : "📋 Copy"}
                        </button>
                      </div>

                      <button
                        className="btn btn-sm btn-danger"
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

export default ProjectSpecificLeads;
