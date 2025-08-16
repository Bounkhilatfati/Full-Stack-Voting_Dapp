import React, { useEffect, useState } from "react";
import { initWeb3, getElection } from "../utils/web3";

const AdminDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [winner, setWinner] = useState(null);
  const [electionEnded, setElectionEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await initWeb3();
        const electionInstance = getElection();

        const count = await electionInstance.methods.candidatesCount().call();
        const list = [];
        let maxVotes = 0;
        let winnerCandidate = null;

        let totalVoteCount = 0;
        for (let i = 1; i <= count; i++) {
          const cand = await electionInstance.methods.candidates(i).call();
          list.push(cand);
          totalVoteCount += parseInt(cand.voteCount);
          if (cand.voteCount > maxVotes) {
            maxVotes = cand.voteCount;
            winnerCandidate = cand;
          }
        }
        setCandidates(list);
        setTotalVotes(totalVoteCount);

       
        const started = await electionInstance.methods.electionStarted().call();
        setElectionEnded(!started);

        if (!started && winnerCandidate) {
          setWinner(winnerCandidate);
        } else {
          setWinner(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ marginLeft: "250px", padding: "15px", backgroundColor: "#1e293b", minHeight: "100vh", color: "#cbd5e1" }}>
      <h3 className="mb-3" style={{ marginTop: "40px", fontSize: "1.2rem" }}>Registered Candidates</h3>
      {isLoading ? (
        <div
          style={{
            border: "1px solid #7c3aed",
            borderRadius: "12px",
            padding: "10px",
            marginBottom: "20px",
            color: "#94a3b8",
            minHeight: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontStyle: "italic",
            fontSize: "0.9rem",
          }}
        >
          Loading candidates...
        </div>
      ) : candidates.length === 0 ? (
        <div
          style={{
            border: "1px solid #7c3aed",
            borderRadius: "12px",
            padding: "10px",
            marginBottom: "20px",
            color: "#94a3b8",
            minHeight: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontStyle: "italic",
            fontSize: "0.9rem",
          }}
        >
          Candidates have not registered yet !!
        </div>
      ) : (
        <ul
          style={{
            border: "1px solid #7c3aed",
            borderRadius: "12px",
            padding: "10px",
            marginBottom: "20px",
            color: "#cbd5e1",
            listStyleType: "none",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {candidates.map((c) => (
            <li key={c.id} style={{ padding: "5px 0", borderBottom: "1px solid #7c3aed" }}>
              {c.name} - Votes: {c.voteCount}
            </li>
          ))}
        </ul>
      )}

      <h3 className="mb-3" style={{ fontSize: "1.2rem" }}>Winner</h3>
      <div
        style={{
          border: "1px solid #7c3aed",
          borderRadius: "12px",
          padding: "10px",
          marginBottom: "20px",
          color: "#94a3b8",
          minHeight: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontStyle: "italic",
          fontSize: "0.9rem",
        }}
      >
        {electionEnded ? (winner ? winner.name : "No winner yet") : "Voting is still active"}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 style={{ fontSize: "1.2rem" }}>Voter Statistics</h3>
        <div></div>
      </div>

      <div
        style={{
          border: "1px solid #7c3aed",
          borderRadius: "12px",
          padding: "10px",
          marginTop: "10px",
          color: "#cbd5e1",
          maxWidth: "350px",
          fontSize: "0.85rem",
        }}
      >
        <p style={{ textAlign: "center", marginBottom: "8px" }}>Total Votes Cast: {totalVotes}</p>

    </div>
  </div>
  );
};

export default AdminDashboard;
