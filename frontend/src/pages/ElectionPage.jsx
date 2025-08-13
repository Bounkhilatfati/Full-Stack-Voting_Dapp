import React, { useEffect, useState } from "react";
import { initWeb3, getElection, account } from "../utils/web3";

const ElectionPage = () => {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        await initWeb3();
        const electionInstance = getElection();
        const status = await electionInstance.methods.electionStarted().call();
        setStarted(status);
      } catch (error) {
        console.error("Error fetching election status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    
    // Poll for status changes every 2 seconds
    const interval = setInterval(fetchStatus, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    try {
      const electionInstance = getElection();
      await electionInstance.methods.startVoting().send({ from: account });
      setStarted(true);
    } catch (error) {
      console.error("Error starting voting:", error);
    }
  };

  const handleEnd = async () => {
    try {
      const electionInstance = getElection();
      await electionInstance.methods.endVoting().send({ from: account });
      setStarted(false);
    } catch (error) {
      console.error("Error ending voting:", error);
    }
  };

  return (
    <div style={{ marginLeft: "250px", padding: "20px", backgroundColor: "#1e293b", minHeight: "100vh", color: "#cbd5e1" }}>
      <h3 className="mb-4">Election Control</h3>
      
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <p>Status: {started ? "✅ Election is active" : "❌ Election is not active"}</p>
          <div className="d-flex gap-3 mt-3">
            {!started && (
              <button onClick={handleStart} className="btn btn-primary" style={{ boxShadow: "0 0 10px #7c3aed" }}>
                Start Voting
              </button>
            )}
            {started && (
              <button onClick={handleEnd} className="btn btn-danger" style={{ boxShadow: "0 0 10px #ef4444" }}>
                End Voting
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ElectionPage;
