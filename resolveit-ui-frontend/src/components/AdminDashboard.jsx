import React, { useEffect, useState, useContext } from "react";
import "../index.css";
import { ThemeContext } from "../components/ThemeContext";
import logo from "../logo.svg";
export default function AdminDashboard({
  user,
  onLogout,
  onViewFeedback,
  onOpenProfile,
  onViewAnalytics   // ✅ ADD THIS
}) {

  if (!user || !user.id) {
    return <h2 style={{ padding: 20 }}>Loading...</h2>;
  }

  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0
  });

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API = `${BASE_URL}/api/grievances`;
const FILE_BASE = `${BASE_URL}/uploads`;

  const { theme, toggleTheme } = useContext(ThemeContext);

  /* ---------- LOAD DATA ---------- */
  const load = async () => {
    try {
      const res = await fetch(`${API}/all`);
      const data = await res.json();

      if (!Array.isArray(data)) return;

      setGrievances(data);
      setStats({
        total: data.length,
        pending: data.filter(g => g.status === "PENDING").length,
        progress: data.filter(g => g.status === "IN_PROGRESS").length,
        resolved: data.filter(g => g.status === "RESOLVED").length
      });
    } catch (err) {
      console.error("Admin dashboard load error:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (g) => {
    const next =
      g.status === "PENDING"
        ? "IN_PROGRESS"
        : g.status === "IN_PROGRESS"
        ? "RESOLVED"
        : null;

    if (!next) return;

    await fetch(`${API}/${g.id}/status?status=${next}`, {
      method: "PUT"
    });

    load();
  };

  const getStep = (s) =>
    s === "PENDING" ? 1 : s === "IN_PROGRESS" ? 2 : 3;

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <header className="dash-header">
        <div className="logo-area">
          <img src={logoIcon} alt="Logo" />
          <div>
            <div className="logo-title">ResolveIT Admin</div>
            <div className="logo-subtitle">Staff Panel</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

          {/* ✅ ANALYTICS BUTTON */}
          <button className="btn-secondary" onClick={onViewAnalytics}>
            📊 Overview
          </button>

          <button className="btn-secondary" onClick={onViewFeedback}>
            View Feedback
          </button>

          <button onClick={toggleTheme} className="theme-btn">
            {theme === "light" ? "☀" : "☾"}
          </button>

          <button className="profile-btn" onClick={onOpenProfile}>
            <span className="profile-circle">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </span>
          </button>

          <button className="nav-signin-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="dash-main">
        <h2>Hospital Grievances</h2>

        {/* STATS */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-label">Total</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{stats.pending}</div>
          </div>
          <div className="stat-card stat-progress">
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{stats.progress}</div>
          </div>
          <div className="stat-card stat-resolved">
            <div className="stat-label">Resolved</div>
            <div className="stat-value">{stats.resolved}</div>
          </div>
        </div>

        {/* GRIEVANCE LIST */}
        <div className="dash-panel">
          {grievances.length === 0 ? (
            <p className="empty-text">No grievances found.</p>
          ) : (
            grievances.map(g => (
              <div key={g.id} className="list-item grievance-card">

                <strong>{g.title}</strong> – {g.department}
                <br />
                👤 {g.user?.fullName || "User"}
                <br />
                🕘 {g.createdAt}

                {g.fileName && (
                  <div style={{ marginTop: "6px" }}>
                    📎{" "}
                    <a
                      href={`${FILE_BASE}/${g.fileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#4ea1ff", textDecoration: "underline" }}
                    >
                      View Attachment
                    </a>
                  </div>
                )}

                <div className="timeline">
                  <div className={`step ${getStep(g.status) >= 1 ? "active" : ""}`}>Submitted</div>
                  <div className="line" />
                  <div className={`step ${getStep(g.status) >= 2 ? "active" : ""}`}>In Progress</div>
                  <div className="line" />
                  <div className={`step ${getStep(g.status) >= 3 ? "active" : ""}`}>Resolved</div>
                </div>

                <button
                  className={`status-btn ${
                    g.status === "PENDING"
                      ? "btn-progress"
                      : g.status === "IN_PROGRESS"
                      ? "btn-resolve"
                      : "btn-done"
                  }`}
                  disabled={g.status === "RESOLVED"}
                  onClick={() => updateStatus(g)}
                >
                  {g.status === "PENDING" && "Mark In Progress"}
                  {g.status === "IN_PROGRESS" && "Mark Resolved"}
                  {g.status === "RESOLVED" && "Done ✔"}
                </button>

                <hr />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
