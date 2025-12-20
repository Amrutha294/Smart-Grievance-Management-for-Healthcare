import React, { useState } from "react";
import "../index.css";

export default function Auth({ onBackHome, onLoginSuccess }) {
  const [tab, setTab] = useState("signin");
  const [errorMsg, setErrorMsg] = useState("");

  const API_BASE = "http://localhost:9090/api/auth";

  /* ---------- LOGIN ---------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const loginData = {
      email: e.target.login_email.value,
      password: e.target.login_password.value,
    };

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (!res.ok) {
        setErrorMsg("Invalid Email or Password");
        return;
      }

      const data = await res.json();
      localStorage.setItem("userData", JSON.stringify(data));
      onLoginSuccess();
    } catch {
      setErrorMsg("Server error. Please try again later.");
    }
  };

  /* ---------- SIGNUP ---------- */
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const userData = {
      fullName: e.target.signup_name.value,
      email: e.target.signup_email.value,
      phone: e.target.signup_phone.value,
      role: e.target.signup_role.value.toUpperCase(),
      password: e.target.signup_password.value,
    };

    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const msg = await res.text();
        setErrorMsg(msg || "Signup Failed! Try another Email.");
        return;
      }

      const data = await res.json();
      localStorage.setItem("userData", JSON.stringify(data));
      onLoginSuccess();
    } catch {
      setErrorMsg("Server error. Please try again later.");
    }
  };

  /* ---------- TAB SWITCH ---------- */
  const switchTab = (newTab) => {
    setTab(newTab);
    setErrorMsg(""); // 🔥 clear error on switch
  };

  return (
    <div className="auth-page">
      <button className="back-home" onClick={onBackHome}>
        ← Back
      </button>

      <div className="auth-card">
        <div className="auth-logo-container">
          <img src="/src/assets/logo.svg" className="app-logo" alt="ResolveIT" />
        </div>

        <h1 className="auth-title">ResolveIT</h1>
        <p className="auth-subtitle">Hospital Grievance Management System</p>

        <div className="auth-tabs">
          <button
            className={tab === "signin" ? "active" : ""}
            onClick={() => switchTab("signin")}
          >
            Sign In
          </button>
          <button
            className={tab === "signup" ? "active" : ""}
            onClick={() => switchTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <p style={{ color: "red", fontSize: "15px", textAlign: "center" }}>
            {errorMsg}
          </p>
        )}

        {/* ---------- SIGN IN ---------- */}
        {tab === "signin" ? (
          <form
            key="signin"
            className="auth-form"
            onSubmit={handleLogin}
            autoComplete="off"
          >
            <label>Email</label>
            <input
              name="login_email"
              type="email"
              required
              autoComplete="new-email"
            />

            <label>Password</label>
            <input
              name="login_password"
              type="password"
              required
              autoComplete="new-password"
            />

            <button className="btn-primary">Sign In</button>
          </form>
        ) : (
          /* ---------- SIGN UP ---------- */
          <form
            key="signup"
            className="auth-form"
            onSubmit={handleSignup}
            autoComplete="off"
          >
            <label>Full Name</label>
            <input
              name="signup_name"
              type="text"
              required
              autoComplete="off"
            />

            <label>Email</label>
            <input
              name="signup_email"
              type="email"
              required
              autoComplete="off"
            />

            <label>Phone Number</label>
            <input
              name="signup_phone"
              type="text"
              required
              autoComplete="off"
            />

            <label>Select Role</label>
            <select name="signup_role" required>
              <option value="PATIENT">Patient</option>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>

            <label>Password</label>
            <input
              name="signup_password"
              type="password"
              required
              autoComplete="new-password"
            />

            <button className="btn-primary">Create Account</button>
          </form>
        )}
      </div>
    </div>
  );
}
