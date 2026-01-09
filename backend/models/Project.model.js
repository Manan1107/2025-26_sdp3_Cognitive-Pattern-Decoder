const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: String,
  type: String, // DSA, WEB, ML, DEBUG
  userId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", ProjectSchema);
