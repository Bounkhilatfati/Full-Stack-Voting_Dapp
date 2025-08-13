import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initWeb3, getElection, account } from "../utils/web3";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    setLoading(true);
    await initWeb3();
    const electionInstance = getElection();
    const adminAddress = await electionInstance.methods.admin().call();
    if (account.toLowerCase() === adminAddress.toLowerCase()) {
      navigate("/admin");
    } else {
      alert("Access denied: not admin");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
        <p>Checking admin...</p>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100 bg-dark text-white">
      {/* Left side */}
      <div className="d-flex flex-column justify-content-center col-md-6 px-5">
        <h2 className="text-primary mb-4">Voting Dapp</h2>
        <p style={{ maxWidth: "400px", lineHeight: "1.5", fontSize: "1rem" }}>
          A deccentralized Polling system for electing candidates in the election, build completely using{" "}
          <strong>Blockchain Technology.</strong>
        </p>
      </div>

      {/* Right side */}
      <div className="d-flex flex-column justify-content-center align-items-center col-md-6 px-5">
        <div
          className="bg-dark rounded-4 p-5 d-flex flex-column align-items-center"
          style={{
            boxShadow: "0 0 30px rgba(0, 123, 255, 0.7)",
            minWidth: "320px",
            maxWidth: "400px",
            border: "1px solid rgba(0, 123, 255, 0.5)",
          }}
        >
          {/* Logo SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            fill="none"
            stroke="#4e6ef2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-3"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
            <path d="M2 7l10 5 10-5" />
            <path d="M12 22V7" />
            <path d="M7 10v6" />
            <path d="M17 10v6" />
          </svg>

          <h3 className="text-primary mb-4">Votechain</h3>

          <button
            className="btn btn-primary"
            style={{
              boxShadow: "0 0 20px rgba(78, 110, 242, 0.7)",
              padding: "10px 30px",
              fontWeight: "500",
            }}
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
