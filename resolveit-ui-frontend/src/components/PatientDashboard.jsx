import React, { useEffect, useState, useContext } from "react";
import "../index.css";
import { ThemeContext } from "../components/ThemeContext";

export default function PatientDashboard({
  user,
  onLogout,
  onOpenSubmit,
  onOpenFeedback,
  onOpenProfile
}) {

  if (!user || !user.id) {
    return <h2 style={{ padding: 20 }}>Loading user...</h2>;
  }

  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0
  });

  const API = "http://localhost:9090/api/grievances";
  const { theme, toggleTheme } = useContext(ThemeContext);

  // ================= LOAD DATA =================
  const loadData = async () => {
    try {
      const res = await fetch(`${API}/user/${user.id}`);
      const data = await res.json();
      if (!Array.isArray(data)) {
        setGrievances([]);
        return;
      }

      setGrievances(data);

      const [p, pr, r] = await Promise.all([
        fetch(`${API}/count/pending/${user.id}`),
        fetch(`${API}/count/progress/${user.id}`),
        fetch(`${API}/count/resolved/${user.id}`)
      ]);

      setStats({
        total: data.length,
        pending: p.ok ? await p.json() : 0,
        progress: pr.ok ? await pr.json() : 0,
        resolved: r.ok ? await r.json() : 0
      });

    } catch (err) {
      console.error("Dashboard load error:", err);
      setGrievances([]);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  // ================= DELETE GRIEVANCE =================
  const deleteGrievance = async (g) => {
    if (!window.confirm("Are you sure you want to delete this grievance?")) return;

    try {
      const res = await fetch(`${API}/${g.id}/user/${user.id}`, {
        method: "DELETE"
      });

      const msg = await res.text();

      if (!res.ok) {
        alert(msg); // 👈 show backend message
        return;
      }

      alert("Grievance deleted successfully");

      loadData();
    } catch (err) {
      alert("Server error while deleting grievance");
    }
  };

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <header className="dash-header">
        <h2>ResolveIT – Patient Dashboard</h2>

        <div className="header-actions">
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === "light" ? "☀" : "☾"}
          </button>

          <button className="profile-btn" onClick={onOpenProfile}>
            <span className="profile-circle">
              {user?.fullName?.charAt(0).toUpperCase()}
            </span>
          </button>

          <button className="nav-signin-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* STATS */}
      <div className="stat-grid">
        <div className="stat-card"><div>Total</div><b>{stats.total}</b></div>
        <div className="stat-card stat-pending"><div>Pending</div><b>{stats.pending}</b></div>
        <div className="stat-card stat-progress"><div>In Progress</div><b>{stats.progress}</b></div>
        <div className="stat-card stat-resolved"><div>Resolved</div><b>{stats.resolved}</b></div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-bar">
        <button className="btn-primary" onClick={onOpenSubmit}>
          Submit Grievance
        </button>
        <button className="btn-secondary" onClick={onOpenFeedback}>
          Submit Feedback
        </button>
      </div>

      {/* TABLE */}
      <div className="dash-panel">
        {grievances.length === 0 ? (
          <p>No grievances submitted yet.</p>
        ) : (
          <table className="grievance-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Department</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {grievances.map(g => (
                <tr key={g.id}>
                  <td>{g.id}</td>
                  <td>{g.title}</td>
                  <td>{g.department}</td>
                  <td>{g.status}</td>
                  <td>{g.createdAt}</td>

                  <td>
                    <button
                      className="btn-danger"
                      disabled={g.status !== "PENDING"}  // ✅ FIX
                      onClick={() => deleteGrievance(g)}
                    >
                      🗑 Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
