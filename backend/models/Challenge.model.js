const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Date string "YYYY-MM-DD" — one challenge per day per user
    date: {
      type: String,
      required: true,
    },
    targetMetric: {
      type: String,
      enum: ["Accuracy", "Focus", "Speed", "Consistency", "Logic", "Memory"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one challenge per user per day
ChallengeSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Challenge", ChallengeSchema);
