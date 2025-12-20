import { useEffect, useState } from "react";
import "./index.css";
import Home from "./components/Home";
import Auth from "./components/Auth";
import PatientDashboard from "./components/PatientDashboard";
import AdminDashboard from "./components/AdminDashboard";
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
      navigateAfterLogin(u);
    }
  }, []);

  const navigateAfterLogin = (u) => {
    if (!u) return setPage("home");
    if (u.role === "PATIENT") setPage("patient");
    else setPage("admin");
  };

  const handleLoginSuccess = () => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      navigateAfterLogin(u);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUser(null);
    setPage("home");
  };

  return (
    <>
      {page === "home" && <Home onClickSignIn={() => setPage("auth")} onGetStarted={() => setPage("auth")} />}

      {page === "auth" && <Auth onBackHome={() => setPage("home")} onLoginSuccess={handleLoginSuccess} />}

      {page === "patient" && <PatientDashboard user={user} onLogout={handleLogout} onOpenSubmit={() => setPage("submit")} onOpenFeedback={() => setPage("feedback")} />}

      {page === "admin" && <AdminDashboard user={user} onLogout={handleLogout} />}

      {page === "submit" && <SubmitGrievance user={user} onBackDashboard={() => setPage("patient")} onLogout={handleLogout} />}

      {page === "feedback" && <Feedback user={user} onBackDashboard={() => setPage("patient")} onLogout={handleLogout} />}
    </>
  );
}

export default App;
