import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AccountProvider } from "./context/AccountContext";
import Navbar from "./components/Navbar";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CandidatesPage from "./pages/CandidatesPage";
import ElectionPage from "./pages/ElectionPage";
import VoterPage from "./pages/VoterPage";

const AppContent = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/admin-login","/"];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<VoterPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/candidates" element={<CandidatesPage />} />
        <Route path="/admin/election" element={<ElectionPage />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AccountProvider>
      <Router>
        <AppContent />
      </Router>
    </AccountProvider>
  );
};

export default App;
