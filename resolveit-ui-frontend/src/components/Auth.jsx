import React, { useState } from "react";
import "../index.css";
import bgImage from "../assets/hospital.jpg";

export default function Auth({ onLoginSuccess }) {
  const [tab, setTab] = useState("signin"); 
  // signin | signup | forgot | reset

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const API_BASE = "http://localhost:9090/api/auth";

  /* ---------- LOGIN ---------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const loginData = {
      email: e.target.login_email.value,
      password: e.target.login_password.value
    };

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });

      if (!res.ok) {
        setErrorMsg("Invalid Email or Password");
        return;
      }

      const data = await res.json();
      localStorage.setItem("userData", JSON.stringify(data));
      onLoginSuccess();
    } catch {
      setErrorMsg("Server error. Try again later.");
    }
  };

  /* ---------- SIGN UP ---------- */
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const userData = {
      fullName: e.target.signup_name.value,
      email: e.target.signup_email.value,
      phone: e.target.signup_phone.value,
      role: e.target.signup_role.value.toUpperCase(),
      password: e.target.signup_password.value
    };

    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      if (!res.ok) {
        setErrorMsg("Signup failed. Email may already exist.");
        return;
      }

      const data = await res.json();
      localStorage.setItem("userData", JSON.stringify(data));
      onLoginSuccess();
    } catch {
      setErrorMsg("Server error. Try again later.");
    }
  };

  /* ---------- SEND OTP ---------- */
  const sendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_BASE}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        setErrorMsg("Email not registered");
        return;
      }

      setSuccessMsg("OTP sent to your email");
      setTab("reset");
    } catch {
      setErrorMsg("Server error. Try again later.");
    }
  };

  /* ---------- RESET PASSWORD ---------- */
  const resetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword })
      });

      if (!res.ok) {
        setErrorMsg("Invalid OTP or expired");
        return;
      }

      setSuccessMsg("Password updated successfully");
      setTab("signin");
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch {
      setErrorMsg("Server error. Try again later.");
    }
  };

  /* ---------- TAB SWITCH ---------- */
  const switchTab = (newTab) => {
    setTab(newTab);
    setErrorMsg("");
    setSuccessMsg("");
  };

  return (
    <div
      className="auth-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh"
      }}
    >
      <div className="auth-card">
        <h1 className="auth-title">ResolveIT</h1>
        <p className="auth-subtitle">Hospital Grievance Management System</p>

        {/* ERROR / SUCCESS */}
        {errorMsg && <p style={{ color: "red", textAlign: "center" }}>{errorMsg}</p>}
        {successMsg && (
          <p style={{ color: "green", textAlign: "center" }}>{successMsg}</p>
        )}

        {/* ---------- SIGN IN ---------- */}
        {tab === "signin" && (
          <>
            <form className="auth-form" onSubmit={handleLogin}>
              <label>Email</label>
              <input name="login_email" type="email" required />

              <label>Password</label>
              <input name="login_password" type="password" required />

              <p className="forgot-link" onClick={() => switchTab("forgot")}>
                Forgot password?
              </p>

              <button className="btn-primary">Sign In</button>
            </form>

            <p className="auth-switch-text">
              Don’t have an account?{" "}
              <span onClick={() => switchTab("signup")}>Sign up</span>
            </p>
          </>
        )}

        {/* ---------- SIGN UP ---------- */}
        {tab === "signup" && (
          <>
            <form className="auth-form" onSubmit={handleSignup}>
              <label>Full Name</label>
              <input name="signup_name" required />

              <label>Email</label>
              <input name="signup_email" type="email" required />

              <label>Phone</label>
              <input name="signup_phone" required />

              <label>Role</label>
              <select name="signup_role" required>
                <option value="PATIENT">Patient</option>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>

              <label>Password</label>
              <input name="signup_password" type="password" required />

              <button className="btn-primary">Create Account</button>
            </form>

            <p className="auth-switch-text">
              Already have an account?{" "}
              <span onClick={() => switchTab("signin")}>Sign in</span>
            </p>
          </>
        )}

        {/* ---------- FORGOT PASSWORD ---------- */}
        {tab === "forgot" && (
          <>
            <form className="auth-form" onSubmit={sendOtp}>
              <label>Registered Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button className="btn-primary">Send OTP</button>
            </form>

            <p className="auth-switch-text">
              Back to <span onClick={() => switchTab("signin")}>Sign in</span>
            </p>
          </>
        )}

        {/* ---------- RESET PASSWORD ---------- */}
        {tab === "reset" && (
          <>
            <form className="auth-form" onSubmit={resetPassword}>
              <label>OTP</label>
              <input
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <label>New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button className="btn-primary">Reset Password</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
