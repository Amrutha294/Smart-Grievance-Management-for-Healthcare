import React from "react";
import "../index.css";

export default function Home({ onClickSignIn, onGetStarted }) {
  return (
    <div className="home-page">
      {/* Top Navbar */}
      <header className="home-header">
        <div className="logo-area">
          <img
            src="/src/assets/logo.svg"
            className="app-logo"
            alt="ResolveIT Logo"
          />
          <div>
            <div className="logo-title">ResolveIT</div>
            <div className="logo-subtitle">Grievance Management</div>
          </div>
        </div>

        <button className="nav-signin-btn" onClick={onClickSignIn}>
          Sign In
        </button>
      </header>

      {/* Hero */}
      <main className="home-hero">
        <img
          src="/src/assets/logo.svg"
          className="app-logo"
          alt="ResolveIT Logo"
        />
        <h1 className="hero-title">
          Smart Grievance Management for Healthcare
        </h1>
        <p className="hero-subtitle">
          Streamline feedback collection, track issues efficiently, and improve
          patient satisfaction with our comprehensive hospital management
          system.
        </p>
        <button className="hero-btn" onClick={onGetStarted}>
          Get Started →
        </button>

        {/* Feature Cards */}
        <div className="feature-grid">
          <div className="feature-card">
            <span className="feature-icon">
              <img
                src="/src/assets/secure.png"
                className="app-logo"
                alt="Secure"
              />
            </span>
            <h3>Secure & Private</h3>
            <p>
              All grievances are stored safely and accessed only by authorized
              staff.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">
              <img
                src="/src/assets/time.png"
                className="app-logo"
                alt="Tracking"
              />
            </span>
            <h3>Real-time Tracking</h3>
            <p>Track the status of grievances from submission to resolution.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">
              <img
                src="/src/assets/correct.png"
                className="app-logo"
                alt="Quick"
              />
            </span>
            <h3>Quick Resolution</h3>
            <p>Improve response time with a clear overview and prioritisation.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
