import React, { useState } from "react";
import "../index.css";

export default function SubmitGrievance({ user, onBackDashboard, onLogout }) {

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API = `${BASE_URL}/api/grievances`;
  const currentUser = user || JSON.parse(localStorage.getItem("userData"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Immediate feedback
    setSubmitting(true);
    setMessage("Submitting grievance...");
    setIsSuccess(false);

    const formData = new FormData();
    formData.append("title", e.target.title.value);
    formData.append("department", e.target.department.value || "");
    formData.append("description", e.target.description.value);
    formData.append("userId", currentUser.id);

    if (e.target.file.files.length > 0) {
      formData.append("file", e.target.file.files[0]);
    }

    try {
      const res = await fetch(API, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setMessage("Submission failed!");
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      sessionStorage.setItem("latestGrievance", data.id);

      setMessage("Grievance submitted successfully!");
      setIsSuccess(true);
      setSubmitting(false);
      e.target.reset();

    } catch (err) {
      setMessage("Server error!");
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dash-header">
        <div className="logo-area">
          <img src="/src/assets/logo.svg" className="app-logo" alt="ResolveIT" />
          <div>
            <div className="logo-title">ResolveIT</div>
            <div className="logo-subtitle">Submit Grievance</div>
          </div>
        </div>
        <button className="nav-signin-btn" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main className="dash-main">
        <h2 className="form-title">Submit New Grievance</h2>
        <p className="form-sub">
          Fill out the form below to submit your grievance
        </p>

        {/* BACK BUTTON */}
        <button
          className="nav-signin-btn"
          style={{ marginBottom: "16px" }}
          onClick={() => {
            setMessage("");
            setIsSuccess(false);
            onBackDashboard();
          }}
        >
          ← Back
        </button>

        <div className="form-card">
          <form className="styled-form" onSubmit={handleSubmit}>
            <label>Title *</label>
            <input name="title" required />

            <label>Department</label>
            <input name="department" placeholder="e.g., Emergency" />

            <label>Description *</label>
            <textarea name="description" rows="4" required />

            <label>Attachment (Optional)</label>
            <input type="file" name="file" />

            <button
              className="btn-primary submit-btn"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Grievance"}
            </button>
          </form>

          {/* MESSAGE */}
          {message && (
            <p
              style={{
                color: isSuccess ? "green" : submitting ? "#555" : "red",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
