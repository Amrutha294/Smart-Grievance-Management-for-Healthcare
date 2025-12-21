import React, { useEffect, useState } from "react";
import "../index.css";

export default function AdminDashboard({ user, onLogout, onViewFeedback }) {
  // 🔐 Safety guard
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

  const API = "http://localhost:9090/api/grievances";

  /* ---------- LOAD GRIEVANCES ---------- */
  const load = async () => {
    try {
      const res = await fetch(`${API}/all`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        setGrievances([]);
        return;
      }

      setGrievances(data);

      setStats({
        total: data.length,
        pending: data.filter(g => g.status === "PENDING").length,
        progress: data.filter(g => g.status === "IN_PROGRESS").length,
        resolved: data.filter(g => g.status === "RESOLVED").length
      });
    } catch (err) {
      console.error("Admin dashboard load error:", err);
      setGrievances([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ---------- UPDATE STATUS ---------- */
  const updateStatus = async (g) => {
    let next =
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
          <img src="/src/assets/logo.svg" className="app-logo" />
          <div>
            <div className="logo-title">ResolveIT Admin</div>
            <div className="logo-subtitle">Staff Panel</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {/* ✅ ONLY NAVIGATION BUTTON */}
          <button className="btn-secondary" onClick={onViewFeedback}>
            View Feedback
          </button>

          <button className="nav-signin-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

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

        {/* GRIEVANCE LIST — UNCHANGED */}
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
                🕘{" "}
                {Array.isArray(g.createdAt)
                  ? g.createdAt.join("-")
                  : g.createdAt}

                {/* STATUS TIMELINE */}
                <div className="timeline">
                  <div className={`step ${getStep(g.status) >= 1 ? "active" : ""}`}>
                    Submitted
                  </div>
                  <div className="line" />
                  <div className={`step ${getStep(g.status) >= 2 ? "active" : ""}`}>
                    In Progress
                  </div>
                  <div className="line" />
                  <div className={`step ${getStep(g.status) >= 3 ? "active" : ""}`}>
                    Resolved
                  </div>
                </div>

                {/* ACTION BUTTON */}
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
