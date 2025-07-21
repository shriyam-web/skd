import React, { useState } from "react";
import AdminSidebar from "../AdminSidebar";
import useAutoLogout from "../../hooks/useAutoLogout";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import "./AdminProfile.css";
import { Helmet } from "react-helmet-async";

const AdminProfile = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const [pendingMode, setPendingMode] = useState(null); // true / false
  // --- brute‑force guard ---
  const [tries, setTries] = useState(0); // consecutive failures
  const [lockUntil, setLock] = useState(null); // timestamp   (ms)

  const remainingTime = useAutoLogout();
  const { admin } = useAuth();

  const fallbackAdmin = localStorage.getItem("admin")
    ? JSON.parse(localStorage.getItem("admin"))
    : null;

  const displayAdmin = admin || fallbackAdmin;

  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: displayAdmin.email,
          oldPassword, // ✅ use state value

          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Password changed successfully");
        setShowModal(false);
        setNewPassword("");
        setConfirmPassword("");
        setOldPassword(""); // ✅ clear it
      } else {
        toast.error(data.message || "Failed to update password");
      }
    } catch (err) {
      toast.error("Error occurred while updating password");
    }
  };
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const askForCode = (desiredMode) => {
    // ‑ if locked, tell user and bail out
    if (lockUntil && Date.now() < lockUntil) {
      const secs = Math.ceil((lockUntil - Date.now()) / 1000);
      toast.warn(`Too many attempts – try again in ${secs}s`);
      return;
    }
    setPendingMode(desiredMode);
    setSecretCode("");
    setCodeModalOpen(true);
  };

  useEffect(() => {
    const fetchMode = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/site-config`);
        const data = await res.json();
        setMaintenanceMode(data.maintenanceMode);
      } catch (err) {
        toast.error("Could not fetch maintenance mode status");
      }
    };
    fetchMode();
  }, []);

  const submitSecretCode = async (e) => {
    e.preventDefault();

    // if we somehow got here while locked: double‑check
    if (lockUntil && Date.now() < lockUntil) {
      const secs = Math.ceil((lockUntil - Date.now()) / 1000);
      toast.warn(`Please wait ${secs}s before trying again`);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/site-config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maintenanceMode: pendingMode,
          code: secretCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Bad code");

      // ✅ success – reset counters
      setTries(0);
      setLock(null);
      setMaintenanceMode(data.maintenanceMode);
      toast.success(
        `Site switched to ${
          data.maintenanceMode ? "Maintenance" : "Normal"
        } mode`
      );
      setCodeModalOpen(false);
    } catch (err) {
      // ❌ failed attempt
      const next = tries + 1;
      setTries(next);

      // lock after 3rd miss
      if (next >= 3) {
        const until = Date.now() + 30_000; // 30 s cooldown
        setLock(until);
        setCodeModalOpen(false);
        toast.error(`Too many wrong codes. Locked for 30 seconds 🕒`);
      } else {
        toast.error(err.message || "Invalid secret code – try again");
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin | Profile & Site Mode </title>
      </Helmet>
      <div className="container-fluid px-0 mx-0">
        <div className="row g-0">
          <div
            className="col-sm-12 p-4"
            style={{
              // backgroundColor: "#1e1e1e",
              color: "#fff",
              // minHeight: "100vh",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold">Admin Profile</h3>
            </div>

            <div
              className="card text-white bg-dark border-light"
              style={{ maxWidth: "600px" }}
            >
              <div className="card-body">
                <h5 className="card-title fw-bold">
                  {displayAdmin?.name || "Admin"}
                </h5>
                <p className="card-text mb-2">
                  <strong>Email:</strong> {displayAdmin?.email || "—"}
                </p>
                <p className="card-text mb-2">
                  <strong>Role:</strong> {displayAdmin?.role || "Admin"}
                </p>
                <p className="card-text">
                  <strong>Joined:</strong>{" "}
                  {displayAdmin?.createdAt
                    ? new Date(displayAdmin.createdAt).toLocaleDateString(
                        "en-GB"
                      )
                    : "—"}
                </p>

                <hr />
                <div className="d-flex gap-3">
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => setShowModal(true)}
                  >
                    🔐 Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* 🔐 Modal */}
            {showModal && (
              <div
                className="modal d-block"
                tabIndex="-1"
                style={{
                  background: "rgba(0,0,0,0.6)",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  position: "fixed",
                  zIndex: 9999,
                }}
              >
                <div
                  className="modal-dialog modal-dialog-centered"
                  style={{ maxWidth: "400px" }}
                >
                  <div className="modal-content bg-dark text-white">
                    <div className="modal-header border-secondary">
                      <h5 className="modal-title">Change Password</h5>
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={() => setShowModal(false)}
                      ></button>
                    </div>
                    <form onSubmit={handlePasswordChange}>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label className="form-label">Old Password</label>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">New Password</label>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Confirm Password</label>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-check mb-3">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="showPasswordCheck"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                          />
                          <label
                            className="form-check-label ps-2"
                            htmlFor="showPasswordCheck"
                          >
                            Show Passwords
                          </label>
                        </div>
                      </div>
                      <div className="modal-footer border-secondary">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-warning">
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />
      </div>
      <div className="maintenance-card glassy-card p-4 mt-5">
        <h4 className="text-center fw-bold mb-3">
          <span className="glow-icon">🛠️</span> SITE MODE
        </h4>
        <p className="text-center mb-4">
          {maintenanceMode
            ? "🚧 Your site is under maintenance. Users cannot access it."
            : "✅ Your site is live and accessible to users."}
        </p>

        <div className="d-flex justify-content-center align-items-center gap-3">
          <span className="fw-semibold">Site Mode:</span>
          <div
            className={`
    maintenance-toggle
    ${maintenanceMode ? "on" : "off"}
    ${codeModalOpen ? "disabled" : ""}
  `}
            onClick={() => !codeModalOpen && askForCode(!maintenanceMode)}
            title={`Switch to ${
              maintenanceMode ? "Normal" : "Maintenance"
            } Mode`}
          >
            <div className="toggle-knob bounce-knob">
              {maintenanceMode ? "🛠️" : "🌐"}
            </div>
            {lockUntil && Date.now() < lockUntil && (
              <span className="lock-badge">⏳</span>
            )}
          </div>

          <span className="mode-label fw-semibold">
            {maintenanceMode ? "Maintenance Mode" : "Normal Mode"}
          </span>
        </div>
        {/* ───────── Secret‑Code Modal  ───────── */}
        {codeModalOpen && (
          <div
            className="modal d-block"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.6)",
              zIndex: 9999,
            }}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ maxWidth: 380 }}
            >
              <div className="modal-content bg-dark text-white border-secondary">
                <form onSubmit={submitSecretCode}>
                  <div className="modal-header border-secondary">
                    <h5 className="modal-title">Enter Secret Code</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setCodeModalOpen(false)}
                    />
                  </div>
                  <div className="modal-body">
                    <p className="small text-white mb-3">
                      This action requires one of the server‑side&nbsp;
                      <code>SECRET_CODES</code>.
                    </p>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Secret code"
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="modal-footer border-secondary">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => setCodeModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-sm btn-warning"
                      disabled={!secretCode.trim()}
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProfile;
