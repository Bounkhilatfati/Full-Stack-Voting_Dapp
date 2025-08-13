import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored user session or state here if applicable
    navigate("/admin-login");
  };

  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        backgroundColor: "#0f172a",
        color: "#4e6ef2",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <div>
        <div className="d-flex align-items-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="none"
            stroke="#4e6ef2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            className="me-2"
          >
            <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
            <path d="M2 7l10 5 10-5" />
            <path d="M12 22V7" />
            <path d="M7 10v6" />
            <path d="M17 10v6" />
          </svg>
          <span style={{ fontWeight: "700", fontSize: "1.5rem" }}>Votechain</span>
        </div>
        <nav className="nav flex-column">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              "nav-link d-flex align-items-center mb-3" + (isActive ? " active text-primary" : " text-white")
            }
            style={{ fontSize: "1.1rem" }}
          >
            <i className="bi bi-sliders me-2"></i> Dashboard
          </NavLink>
          <NavLink
            to="/admin/candidates"
            className={({ isActive }) =>
              "nav-link d-flex align-items-center mb-3" + (isActive ? " active text-primary" : " text-white")
            }
            style={{ fontSize: "1.1rem" }}
          >
            <i className="bi bi-person-plus me-2"></i> Candidate
          </NavLink>
          <NavLink
            to="/admin/election"
            className={({ isActive }) =>
              "nav-link d-flex align-items-center mb-3" + (isActive ? " active text-primary" : " text-white")
            }
            style={{ fontSize: "1.1rem" }}
          >
            <i className="bi bi-bank me-2"></i> Election Commission
          </NavLink>
        </nav>
      </div>
      <div>
        <button className="btn btn-link text-danger mt-3 p-0" onClick={handleLogout}>Log out <i className="bi bi-box-arrow-right"></i></button>
      </div>
    </div>
  );
};

export default Navbar;
