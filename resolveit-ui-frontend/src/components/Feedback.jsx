import React, { useState } from "react";
import "../index.css";

export default function Feedback({ user, onBackDashboard, onLogout }) {
  const [message, setMessage] = useState("");

  const API_FEEDBACK = "http://localhost:9090/api/feedback";
  const currentUser = user || JSON.parse(localStorage.getItem("userData"));

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setMessage("");

    const form = e.target;
    const payload = {
      category: form.category.value,
      rating: parseInt(form.rating.value || "5", 10),
      comments: form.comments.value,
      user: { id: currentUser.id },
    };

    try {
      const res = await fetch(API_FEEDBACK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        form.reset();
        setMessage("Feedback submitted successfully.");
      } else {
        setMessage("Failed to submit feedback.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dash-header">
        <div className="logo-area">
          <img
            src="/src/assets/logo.svg"
            className="app-logo"
            alt="ResolveIT Logo"
          />
          <div>
            <div className="logo-title">ResolveIT</div>
            <div className="logo-subtitle">Hospital Grievance System</div>
          </div>
        </div>

        <div className="dash-right">
          <span className="account-text">
            {currentUser ? currentUser.fullName : "Account"}
          </span>
          <button className="nav-signin-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-heading">
          <h1>Submit Feedback</h1>
          <p>Help us improve our services with your feedback.</p>
        </div>

        <button
          className="nav-signin-btn"
          style={{ marginBottom: "16px" }}
          onClick={onBackDashboard}
        >
          ← Back to Dashboard
        </button>

        <div className="dash-panel">
          <form className="auth-form" onSubmit={handleSubmitFeedback}>
            <label>Feedback Category</label>
            <select name="category" required>
              <option>Service Quality</option>
              <option>Staff Behaviour</option>
              <option>Cleanliness</option>
              <option>Billing Experience</option>
            </select>

            <label>Rating (1–5)</label>
            <input
              name="rating"
              type="number"
              min="1"
              max="5"
              defaultValue="5"
            />

            <label>Comments</label>
            <textarea
              name="comments"
              rows={4}
              placeholder="Share your feedback..."
              required
            ></textarea>

            <button className="btn-primary">Submit Feedback</button>
          </form>

          {message && (
            <p
              style={{
                marginTop: "10px",
                color: message.includes("successfully") ? "green" : "red",
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
