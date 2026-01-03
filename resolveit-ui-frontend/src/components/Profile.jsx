import React, { useState } from "react";
import "../index.css";

export default function Profile({ user, onBack, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role || ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Later connect backend API
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* HEADER */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <h2>{user.fullName}</h2>
          <p className="profile-role">{user.role}</p>
        </div>

        {/* PROFILE DETAILS */}
        <div className="profile-details">
          <label>Name</label>
          <input
            name="fullName"
            value={formData.fullName}
            disabled={!isEditing}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            name="email"
            value={formData.email}
            disabled
          />

          <label>Phone</label>
          <input
            name="phone"
            value={formData.phone}
            disabled={!isEditing}
            onChange={handleChange}
          />

          <label>Role</label>
          <input value={formData.role} disabled />
        </div>

        {/* ACTION BUTTONS */}
        <div className="profile-actions">
          {!isEditing ? (
            <>
              <button className="profile-btn primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>

              <button className="profile-btn" onClick={onBack}>
                Back
              </button>
            </>
          ) : (
            <>
              <button className="profile-btn primary" onClick={handleSave}>
                Save
              </button>

              <button className="profile-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </>
          )}

          <button className="profile-btn danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
