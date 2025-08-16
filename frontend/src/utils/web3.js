import Web3 from "web3";
import Election from "../contracts/Election.json";

let web3;
let election;
let account;
let accountChangeCallback = null;

const initWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];

    // Listen for account changes and update account variable
    window.ethereum.on("accountsChanged", (accounts) => {
      account = accounts[0];
      if (accountChangeCallback) {
        accountChangeCallback(account);
      }
    });

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Election.networks[networkId];
    election = new web3.eth.Contract(Election.abi, deployedNetwork.address);
  } else {
    alert("🦊 Installez MetaMask pour continuer.");
  }
};

const getElection = () => election;

const setAccountChangeCallback = (callback) => {
  accountChangeCallback = callback;
};

export { initWeb3, web3, getElection, account, setAccountChangeCallback };
