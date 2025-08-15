const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: String,
  votes: Number
});

const electionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  candidates: [candidateSchema],
  winner: {
    name: String,
    votes: Number
  },
  totalEthReceived: Number,
  totalVoters: Number
});

module.exports = mongoose.model("Election", electionSchema);
