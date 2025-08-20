# 🗳️ Election DApp
## 📖 Introduction
Election DApp est une application de vote décentralisée Full-Stack qui exploite la puissance de la blockchain Ethereum pour transformer la manière dont nous organisons les élections.
Elle répond aux limites des systèmes de vote traditionnels en offrant une plateforme sécurisée, transparente et inviolable, où chaque vote est enregistré de manière immuable sur la blockchain.
Ce projet combine un smart contract en Solidity, un backend Node.js/Express, un frontend React/Next.js, et MongoDB pour le stockage des résultats.
## ❌ Le Problème
Les systèmes de vote traditionnels rencontrent plusieurs problèmes majeurs :
1. **Manque de sécurité**: Les élections sont vulnérables à la fraude, aux manipulations et aux cyberattaques.
2. **Absence de transparence**: Les électeurs et candidats doutent souvent de la légitimité des résultats à cause de processus opaques.
3. **Lenteur du dépouillement**: Le comptage manuel entraîne des retards et des contestations.
4. **Accessibilité limitée**: Les bureaux de vote physiques sont difficiles d’accès pour les personnes en zones éloignées ou en situation de handicap.
## ✅ La Solution
Notre Election Dapp apporte une alternative innovante basée sur la blockchain :
1. **Sécurité renforcée grâce à la blockchain**: Le cœur de l’application repose sur un smart contract en Solidity qui garantit l’intégrité et l’inviolabilité des résultats.
2. **Transparence totale**: Chaque vote est enregistré sur la blockchain et peut être audité publiquement.
3. **Accessibilité universelle**: Toute personne disposant d’une connexion Internet et d’un portefeuille Ethereum (ex. MetaMask) peut voter.
4. **Comptage automatique et sans erreur**: Les votes sont automatiquement comptabilisés par le smart contract, supprimant tout risque d’erreur humaine.
5. **Résultats instantanés**: Dès la clôture du vote, les résultats sont disponibles immédiatement et en toute fiabilité.
## 📌 Fonctionnalités 
- Déploiement et interaction avec un smart contract Solidity (Election.sol).
- Système de vote sécurisé (un seul vote par compte).
- Envoi automatique d’ETH à l’admin lors de chaque vote.
- L’admin ne peut pas voter.
- Backend (Express.js + Web3.js) pour surveiller les événements blockchain.
- Stockage des résultats dans MongoDB.
## ⚙️ Prérequis
Avant de démarrer, assurez-vous d’avoir installé :
- Node.js (>= 16.x)
- npm ou yarn
- Ganache (blockchain locale Ethereum)
- Truffle (npm install -g truffle)
- MetaMask (extension navigateur)
- MongoDB Community Edition ou MongoDB Atlas
- MongoDB Compass (optionnel, GUI MongoDB)
## 📦 Dépendances par dossier
### 1️⃣ Backend (/backend)
```bash
cd backend
npm install express mongoose dotenv web3
```
### 2️⃣ Frontend (/frontend)
```bash
cd frontend
npm install react react-dom next web3
```
### 3️⃣ Smart Contracts (/smart-contracts)
```bash
cd smart-contracts
npm install truffle @truffle/hdwallet-provider
```
## 🚀 Installation & Exécution
### 1.Cloner le dépôt
```bash
git clone https://github.com/Bounkhilatfati/Full-Stack-Voting_Dapp.git
cd Full-Stack-Voting_Dapp
```
### 2.Installer les dépendances de chaque dossier (voir section précédente).
### 3.Configurer les variables d’environnement
Dans /backend/.env:
```bash
MONGO_URI=' '
GANACHE_URL=' '
ADMIN_ADDRESS=' '
PRIVATE_KEY=' '
```
### 4.Lancer Ganache
- Via Ganache GUI.
- Copier l’URL RPC (ex. http://127.0.0.1:7545 ou ws://127.0.0.1:7545).
### 5.Compiler & déployer le smart contract
```bash
truffle compile
truffle migrate --reset
```
### 6.Démarrer le serveur backend
```bash
cd backend
node index.js
```
Le backend tourne sur : http://localhost:4000
### 7.Connecter MetaMask
- Ajouter un réseau RPC personnalisé avec l’URL Ganache.
- Importer un compte de test Ganache.
## 📊 Exemple de données MongoDB
```json
{
  "date": "2025-08-16T14:25:00.000Z",
  "candidates": [
    { "name": "Alice", "votes": 10 },
    { "name": "Bob", "votes": 7 }
  ],
  "winner": {
    "name": "Alice",
    "votes": 10
  },
  "totalEthReceived": 0.17,
  "totalVoters": 17
}

```
## 🛠️ Stack Technique
- **Frontend** : React.js
- **Backend** : Express.js, Web3.js
- **Base de données** : MongoDB + Mongoose
- **Blockchain** : Ethereum (Ganache, Truffle, MetaMask)
- **Langage smart contracts** : Solidity
