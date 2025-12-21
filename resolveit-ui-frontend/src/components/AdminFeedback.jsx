import React, { useEffect, useState } from "react";
import "../index.css";

export default function AdminFeedback({ onBack }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const API = "http://localhost:9090/api/feedback";

  const loadFeedbacks = async () => {
    try {
      const res = await fetch(`${API}/all`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Feedback load error:", err);
      setFeedbacks([]);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="dash-header">
        <h3>Admin – Feedback</h3>
        <button className="nav-signin-btn" onClick={onBack}>
          ← Back
        </button>
      </header>

      <main className="dash-main">
        <div className="dash-panel">
          {feedbacks.length === 0 ? (
            <p className="empty-text">No feedback available</p>
          ) : (
            <table className="grievance-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Comments</th>
                  <th>Date/Time</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map(f => (
                  <tr key={f.id}>
                    <td>{f.user?.fullName}</td>
                    <td>{f.user?.email}</td>
                    <td>{f.category}</td>
                    <td>{f.rating}</td>
                    <td>{f.comments}</td>
                    <td>
                        <div style={{ whiteSpace: "nowrap"}}>
                            {f.createdAt.split("T")[0]}
                        </div>
                        <div style={{ whiteSpace: "nowrap", fontSize: "15px", color: "#6b7280" }}>
                            {f.createdAt.split("T")[1]}
                        </div>
                        </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
