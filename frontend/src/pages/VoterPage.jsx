import React, { useEffect, useState } from "react";
import { initWeb3, getElection, account, web3 } from "../utils/web3";

const VoterPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [selected, setSelected] = useState("");
  const [active, setActive] = useState(false);
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await initWeb3();
        const electionInstance = getElection();
        setElection(electionInstance);

        const isStarted = await electionInstance.methods.electionStarted().call();
        setActive(isStarted);

        if (isStarted) {
          const voted = await electionInstance.methods.voters(account).call();
          setHasVoted(voted);

          const count = await electionInstance.methods.candidatesCount().call();
          const list = [];
          for (let i = 1; i <= count; i++) {
            const cand = await electionInstance.methods.candidates(i).call();
            list.push(cand);
          }
          setCandidates(list);
        }
      } catch (error) {
        console.error("Error fetching election data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Poll for status changes every 2 seconds
    const interval = setInterval(fetchData, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const vote = async (e) => {
    e.preventDefault();
    console.log("Vote called. Election instance:", election);
    if (!election) {
      console.error("Election contract instance is undefined.");
      return;
    }
    if (!selected) {
      console.error("No candidate selected.");
      return;
    }
    try {
      await election.methods.vote(selected).send({ from: account, value: web3.utils.toWei("0.01", "ether") });
      setHasVoted(true);
    } catch (error) {
      console.error("Error during vote transaction:", error);
    }
  };

  const Sidebar = () => (
    <aside style={{ width: "250px", backgroundColor: "#0f172a", padding: "20px", display: "flex", alignItems: "center", flexDirection: "column" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="60"
        fill="none"
        stroke="#4e6ef2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        style={{ marginBottom: "10px" }}
      >
        <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
        <path d="M2 7l10 5 10-5" />
        <path d="M12 22V7" />
        <path d="M7 10v6" />
        <path d="M17 10v6" />
      </svg>
      <h2 style={{ color: "#4e6ef2" }}>Votechain</h2>
    </aside>
  );

  if (!active)
    return (
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#1e293b", color: "#cbd5e1" }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: "20px" }}>
          <p>Election not started.</p>
        </main>
      </div>
    );
  if (hasVoted)
    return (
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#1e293b", color: "#cbd5e1" }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: "20px" }}>
          <p>You already voted ✅</p>
        </main>
      </div>
    );

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#1e293b", color: "#cbd5e1" }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: "20px" }}>
        <h3 style={{ marginBottom: "1rem" }}>Vote for a candidate</h3>
        <form onSubmit={vote}>
          <select
            className="form-control"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            required
            style={{ backgroundColor: "#0f172a", borderColor: "#7c3aed", color: "#cbd5e1" }}
          >
            <option value="">-- Select --</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button className="btn btn-primary mt-3" style={{ boxShadow: "0 0 10px #7c3aed" }} disabled={!election || !selected}>
            Vote
          </button>
        </form>
      </main>
    </div>
  );
};

export default VoterPage;
