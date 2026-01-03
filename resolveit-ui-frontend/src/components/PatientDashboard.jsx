import React, { useEffect, useState } from "react";
import "../index.css";
import { useContext } from "react";
import { ThemeContext } from "../components/ThemeContext";

export default function PatientDashboard({
  user,
  onLogout,
  onOpenSubmit,
  onOpenFeedback,
  onOpenProfile
}) {

  // ✅ HARD GUARD – prevents white screen
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

  const loadData = async () => {
    try {
      // 🔹 Fetch grievances
      const res = await fetch(`${API}/user/${user.id}`);

      if (!res.ok) {
        console.error("Failed to load grievances");
        setGrievances([]);
        return;
      }

      const data = await res.json();

      // ✅ VERY IMPORTANT CHECK
      if (!Array.isArray(data)) {
        console.error("Expected array, got:", data);
        setGrievances([]);
        return;
      }

      setGrievances(data);

      // 🔹 Fetch counts
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
      setGrievances([]); // 🔴 prevents crash
    }
  };

  // ✅ Correct dependency
  useEffect(() => {
    loadData();
  }, [user.id]);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="dash-header">
  {/* LEFT SIDE */}
  <h2>ResolveIT – Patient Dashboard</h2>

  {/* RIGHT SIDE */}
  <div className="header-actions">
    <button
      className="theme-btn"
      onClick={toggleTheme}
      title="Toggle Theme"
    >
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
        <div className="stat-card">
          <div>Total</div>
          <b>{stats.total}</b>
        </div>
        <div className="stat-card stat-pending">
          <div>Pending</div>
          <b>{stats.pending}</b>
        </div>
        <div className="stat-card stat-progress">
          <div>In Progress</div>
          <b>{stats.progress}</b>
        </div>
        <div className="stat-card stat-resolved">
          <div>Resolved</div>
          <b>{stats.resolved}</b>
        </div>
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
              </tr>
            </thead>
            <tbody>
              {grievances.map(g => (
                <tr key={g.id}>
                  <td>{g.id}</td>
                  <td>{g.title}</td>
                  <td>{g.department}</td>
                  <td>{g.status}</td>
                  <td>
                    {Array.isArray(g.createdAt)
                      ? g.createdAt.join("-")
                      : g.createdAt}
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
