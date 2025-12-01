import React, { useState } from "react";
import "../index.css";

export default function Auth({ onBackHome, onLoginSuccess }) {
  const [tab, setTab] = useState("signin"); // 'signin' or 'signup'

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just navigate to dashboard; add real auth later
    onLoginSuccess();
  };

  return (
    <div className="auth-page">
      <button className="back-home" onClick={onBackHome}>
        ← Back
      </button>

      <div className="auth-card">
        <div className="auth-logo-container">
          <img src="/src/assets/logo.svg" className="app-logo" alt="ResolveIT Logo" />
        </div>
        <h1 className="auth-title">ResolveIT</h1>
        <p className="auth-subtitle">Hospital Grievance Management System</p>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={tab === "signin" ? "active" : ""}
            onClick={() => setTab("signin")}
          >
            Sign In
          </button>
          <button
            className={tab === "signup" ? "active" : ""}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {tab === "signin" ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="your.email@hospital.com"
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
            />

            <button className="btn-primary">Sign In</button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Dr. John Smith"
              required
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="your.email@hospital.com"
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              required
            />

            <button className="btn-primary">Create Account</button>
          </form>
        )}
      </div>
    </div>
  );
}
