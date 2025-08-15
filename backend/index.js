// Connexion à MongoDB
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => console.error("❌ Erreur MongoDB :", err));

// Import du modèle Election
const Election = require("./models/election");

const express = require("express");
const Web3 = require("web3").default;
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const port = 4000;

// Connexion à Ganache via WebSocket
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.GANACHE_URL));

// Chargement du contrat Ethereum
const contractPath = path.resolve(__dirname, "../frontend/src/contracts/Election.json");
const contractJSON = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const contractABI = contractJSON.abi;
const networkId = Object.keys(contractJSON.networks)[0];
const contractAddress = contractJSON.networks[networkId].address;

console.log("✅ Contrat déployé sur l'adresse :", contractAddress);

const contract = new web3.eth.Contract(contractABI, contractAddress);

let lastCheckedBlock = 0;
let totalEthReceived = 0;
let electionEnded = false;

// Fonction pour récupérer tous les candidats avec leur nombre de votes
async function getAllCandidates() {
  const candidates = [];
  const count = await contract.methods.candidatesCount().call();
  for (let i = 1; i <= count; i++) {
    const c = await contract.methods.candidates(i).call();
    candidates.push({
      name: c.name,
      votes: Number(c.voteCount)
    });
  }
  return candidates;
}

async function pollEvents() {
  try {
    const latestBlock = Number(await web3.eth.getBlockNumber());
    if (lastCheckedBlock === 0) {
      lastCheckedBlock = latestBlock;
    }

    // Écoute des votes
    const voteEvents = await contract.getPastEvents("votedEvent", {
      fromBlock: lastCheckedBlock + 1,
      toBlock: "latest"
    });

    for (const event of voteEvents) {
      const tx = await web3.eth.getTransaction(event.transactionHash);
      const valueEth = Number(web3.utils.fromWei(tx.value, "ether"));
      totalEthReceived += valueEth;
      console.log("🎉 Nouveau vote détecté !");
      console.log(`🗳️ Candidat ID : ${event.returnValues._candidateId}`);
      console.log(`💰 Montant envoyé : ${valueEth} ETH`);
      console.log(`📊 Total ETH reçu jusqu’ici : ${totalEthReceived.toFixed(4)} ETH`);
    }

    // Écoute de la fin d'élection
    const endEvents = await contract.getPastEvents("electionEndedEvent", {
      fromBlock: lastCheckedBlock + 1,
      toBlock: "latest"
    });

    for (const event of endEvents) {
      // Vérifier si l'élection a déjà été sauvegardée
      const existingElection = await Election.findOne({
        winner: {
          name: event.returnValues.winnerName,
          votes: Number(event.returnValues.winnerVotes)
        },
        totalVoters: Number(event.returnValues.totalVotes)
      });

      if (!existingElection && !electionEnded) {
        console.log("🏁 Élection terminée !");
        console.log("📅 Date :", new Date().toLocaleString());
        console.log("👑 Gagnant :", event.returnValues.winnerName);

        const candidates = await getAllCandidates();

        // Sauvegarde dans MongoDB
        const electionData = new Election({
          date: new Date(),
          candidates: candidates,
          winner: {
            name: event.returnValues.winnerName,
            votes: Number(event.returnValues.winnerVotes)
          },
          totalEthReceived: totalEthReceived,
          totalVoters: Number(event.returnValues.totalVotes)
        });

        await electionData.save();
        console.log("💾 Élection enregistrée dans MongoDB !");
        electionEnded = true;
      }
    }

    // Mettre à jour le dernier bloc vérifié
    lastCheckedBlock = latestBlock;

  } catch (err) {
    console.error("Erreur lors de la récupération des événements :", err);
  }
}

setInterval(pollEvents, 5000);

app.get("/", (req, res) => {
  res.send("🟢 Serveur Election DApp en cours d’exécution !");
});

app.listen(port, () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${port}`);
});
