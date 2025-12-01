import React, { useState } from "react";
import "../index.css";

export default function Dashboard({ onLogout }) {
  const [tab, setTab] = useState("grievances"); // 'grievances' | 'submit' | 'feedback'

  return (
    <div className="dashboard-page">
      {/* Top bar */}
      <header className="dash-header">
        <div className="logo-area">
          <img src="/src/assets/logo.svg" className="app-logo" alt="ResolveIT Logo" />
          <div>
            <div className="logo-title">ResolveIT</div>
            <div className="logo-subtitle">Hospital Grievance System</div>
          </div>
        </div>

        <div className="dash-right">
          <span className="account-text">Account</span>
          <button className="nav-signin-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-heading">
          <h1>Dashboard</h1>
          <p>Manage grievances and feedback efficiently</p>
        </div>

        {/* Stat Cards */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-label">Total Grievances</div>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-label">Pending</div>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-card stat-progress">
            <div className="stat-label">In Progress</div>
            <div className="stat-value">0</div>
          </div>
          <div className="stat-card stat-resolved">
            <div className="stat-label">Resolved</div>
            <div className="stat-value">0</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dash-tabs">
          <button
            className={tab === "grievances" ? "active" : ""}
            onClick={() => setTab("grievances")}
          >
             Grievances
          </button>
          <button
            className={tab === "submit" ? "active" : ""}
            onClick={() => setTab("submit")}
          >
             Submit
          </button>
          <button
            className={tab === "feedback" ? "active" : ""}
            onClick={() => setTab("feedback")}
          >
             Feedback
          </button>
        </div>

        {/* Content box */}
        <div className="dash-panel">
          {tab === "grievances" && (
            <p className="empty-text">
              No grievances found. Submit your first grievance to get started.
            </p>
          )}

          {tab === "submit" && (
            <form className="auth-form">
              <label>Grievance Title</label>
              <input placeholder="Short title for the grievance" />

              <label>Department</label>
              <input placeholder="e.g., Cardiology / Reception" />

              <label>Description</label>
              <textarea
                rows={4}
                placeholder="Describe the grievance in detail..."
              ></textarea>

              <button className="btn-primary">Submit Grievance</button>
            </form>
          )}

          {tab === "feedback" && (
            <form className="auth-form">
              <label>Feedback Type</label>
              <select>
                <option>Service Quality</option>
                <option>Staff Behaviour</option>
                <option>Cleanliness</option>
                <option>Billing Experience</option>
              </select>

              <label>Comments</label>
              <textarea
                rows={4}
                placeholder="Share your feedback..."
              ></textarea>

              <button className="btn-primary">Submit Feedback</button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
