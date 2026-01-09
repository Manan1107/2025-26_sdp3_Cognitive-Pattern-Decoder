const mongoose = require("mongoose");

const MLResultSchema = new mongoose.Schema({
  userId: String,
  projectId: String,
  predictedLabel: String,
  confidenceScore: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MLResult", MLResultSchema);
