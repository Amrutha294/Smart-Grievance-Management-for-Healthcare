import React, { useState } from "react";
import Home from "./components/Home";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [view, setView] = useState("home"); // 'home' | 'auth' | 'dashboard'

  return (
    <>
      {view === "home" && (
        <Home onClickSignIn={() => setView("auth")} onGetStarted={() => setView("auth")} />
      )}

      {view === "auth" && (
        <Auth
          onBackHome={() => setView("home")}
          onLoginSuccess={() => setView("dashboard")}
        />
      )}

      {view === "dashboard" && (
        <Dashboard
          onLogout={() => setView("home")}
        />
      )}
    </>
  );
}
