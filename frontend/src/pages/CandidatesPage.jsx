import React, { useEffect, useState } from "react";
import { initWeb3, getElection, account } from "../utils/web3";

const CandidatesPage = () => {
  const [candidateName, setCandidateName] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCandidates = async () => {
    try {
      setIsLoading(true);
      const electionInstance = getElection();
      const count = await electionInstance.methods.candidatesCount().call();
      const list = [];
      for (let i = 1; i <= count; i++) {
        const cand = await electionInstance.methods.candidates(i).call();
        list.push(cand);
      }
      setCandidates(list);
    } catch (error) {
      console.error("Error loading candidates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initWeb3().then(loadCandidates);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const electionInstance = getElection();
    await electionInstance.methods.addCandidate(candidateName).send({ from: account });
    setCandidateName("");
    loadCandidates();
  };

  return (
    <div style={{ marginLeft: "250px", padding: "20px", backgroundColor: "#1e293b", minHeight: "100vh", color: "#cbd5e1" }}>
      <h3 className="mb-4" style={{ fontSize: "1.5rem" }}>Candidates Registration</h3>
      <form onSubmit={handleAdd} className="mb-4">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Candidate name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            required
            style={{ backgroundColor: "#0f172a", borderColor: "#7c3aed", color: "#cbd5e1" }}
          />
        </div>
        <button className="btn btn-primary mt-2" style={{ boxShadow: "0 0 10px #7c3aed" }}>
          Add Candidate
        </button>
      </form>
      <ul className="list-group" style={{ backgroundColor: "#1e293b", border: "1px solid #7c3aed", borderRadius: "10px" }}>
        {candidates.map((c) => (
          <li key={c.id} className="list-group-item" style={{ backgroundColor: "#0f172a", border: "none", color: "#cbd5e1" }}>
            #{c.id} - {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CandidatesPage;
