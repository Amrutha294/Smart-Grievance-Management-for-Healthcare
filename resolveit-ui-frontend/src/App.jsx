import { useEffect, useState } from "react";
import "./index.css";
import Home from "./components/Home";
import Auth from "./components/Auth";
import PatientDashboard from "./components/PatientDashboard";
import AdminDashboard from "./components/AdminDashboard";
import AdminFeedback from "./components/AdminFeedback";
import SubmitGrievance from "./components/SubmitGrievance";
import Feedback from "./components/Feedback";

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setPage(u.role === "PATIENT" ? "patient" : "admin");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUser(null);
    setPage("home");
  };

  return (
    <>
      {page === "home" && <Home onClickSignIn={() => setPage("auth")} onGetStarted={() => setPage("auth")}/>}

      {page === "auth" && (
        <Auth
          onBackHome={() => setPage("home")}
          onLoginSuccess={() => {
            const u = JSON.parse(localStorage.getItem("userData"));
            setUser(u);
            setPage(u.role === "PATIENT" ? "patient" : "admin");
          }}
        />
      )}

      {page === "admin" && (
        <AdminDashboard
          user={user}
          onLogout={handleLogout}
          onViewFeedback={() => setPage("admin-feedback")}
        />
      )}

      {page === "admin-feedback" && (
        <AdminFeedback
          user={user}
          onLogout={handleLogout}
          onBack={() => setPage("admin")}
        />
      )}

      {page === "patient" && (
        <PatientDashboard
          user={user}
          onLogout={handleLogout}
          onOpenSubmit={() => setPage("submit")}
          onOpenFeedback={() => setPage("feedback")}
        />
      )}

      {page === "submit" && (
        <SubmitGrievance
          user={user}
          onBackDashboard={() => setPage("patient")}
          onLogout={handleLogout}
        />
      )}

      {page === "feedback" && (
        <Feedback
          user={user}
          onBackDashboard={() => setPage("patient")}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default App;
