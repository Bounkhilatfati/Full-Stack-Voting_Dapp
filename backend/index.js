const express = require("express");//Serveur HTTP pour exposer une API ou interface
const Web3 = require("web3").default;//Permet d’interagir avec la blockchain Ethereum
const fs = require("fs");//	Pour lire les fichiers (Election.json)
const path = require("path");//Pour construire des chemins de fichiers
require("dotenv").config();//Charge les variables d’environnement depuis .env

const app = express();//Crée une instance d’Express
const port = 4000;

//WebSocket est utilisé ici pour pouvoir écouter les blocs en direct (plus fiable que HTTP pour ça).

const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.GANACHE_URL));//connection à la blockchain Ganache locale.
//Chargement du contrat Ethereum
const contractPath = path.resolve(__dirname, "../frontend/src/contracts/Election.json");
const contractJSON = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const contractABI = contractJSON.abi;//l’ABI du contrat : nécessaire pour interagir avec ses fonctions/événements
// Récupération de l'adresse du contrat déployé
const networkId = Object.keys(contractJSON.networks)[0];
const contractAddress = contractJSON.networks[networkId].address;

console.log("✅ Contrat déployé sur l'adresse :", contractAddress);

const contract = new web3.eth.Contract(contractABI, contractAddress);

let lastCheckedBlock = 0;
let totalEthReceived = 0;

async function pollEvents() {
  try {
    const latestBlock = Number(await web3.eth.getBlockNumber());
    if (lastCheckedBlock === 0) {
      lastCheckedBlock = latestBlock;
    }
    const events = await contract.getPastEvents('votedEvent', {
      fromBlock: lastCheckedBlock + 1,
      toBlock: 'latest'
    });
    for (const event of events) {
      const txHash = event.transactionHash;
      const tx = await web3.eth.getTransaction(txHash);
      const valueEth = Number(web3.utils.fromWei(tx.value, 'ether'));
      totalEthReceived += valueEth;
      console.log("🎉 Nouveau vote détecté !");
      console.log(`🗳️ Candidat ID : ${event.returnValues._candidateId}`);
      console.log(`💰 Montant envoyé : ${valueEth} ETH`);
      console.log(`📊 Total ETH reçu jusqu’ici : ${totalEthReceived.toFixed(4)} ETH`);
      console.log(`📅 Bloc : ${event.blockNumber}`);
      if (Number(event.blockNumber) > lastCheckedBlock) {
        lastCheckedBlock = Number(event.blockNumber);
      }
    }
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
