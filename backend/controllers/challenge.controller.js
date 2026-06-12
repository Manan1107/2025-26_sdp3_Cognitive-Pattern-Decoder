/**
 * challenge.controller.js
 * ─────────────────────────────────────────────────
 * Daily Challenge Agent — generates one personalized
 * coding challenge per day per user based on their
 * weakest metric from recent sessions.
 * ─────────────────────────────────────────────────
 */

const Challenge = require("../models/Challenge.model");
const Session = require("../models/Session.model");
const { generateDailyChallenge } = require("../services/ai.service");

// ──────────────────────────────────────────────────
// GET /api/challenges/today
// Returns today's challenge. If none exists yet,
// auto-generates one based on user's weak areas.
// ──────────────────────────────────────────────────
exports.getTodayChallenge = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    // ── 1. Check if challenge already exists today ──
    let challenge = await Challenge.findOne({ userId, date: today });
    if (challenge) {
      return res.json(challenge);
    }

    // ── 2. Find weakest metric from last 5 sessions ──
    const sessions = await Session.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    let weakArea = "Accuracy"; // default
    let wpm = 0, accuracy = 0, focusScore = 0;

    if (sessions.length > 0) {
      const latest = sessions[0];

      wpm = Math.min(300, Math.max(0, Math.round((latest.typingSpeed || 0) * 12)));

      accuracy = latest.typedChars > 0
        ? Math.min(100, Math.max(0,
            Math.round((latest.typedChars / (latest.typedChars + latest.backspaceCount)) * 100)
          ))
        : 0;

      const idleScore = Math.max(0, latest.sessionTime - (latest.typedChars / 5));
      const total = (latest.typedChars || 0) + (latest.backspaceCount * 1.5) +
                    (latest.cursorMoveCount * 0.5) + idleScore || 1;

      focusScore = Math.min(100, Math.max(0,
        Math.round(100 - (latest.fileSwitchCount * 5) - ((idleScore / total) * 100))
      ));

      const consistencyScore = latest.typedChars > 0
        ? Math.min(100, Math.max(0, Math.round(100 - (latest.avgPauseTime * 5))))
        : 0;

      const speedScore = Math.min(100, Math.max(0, wpm)); // capped to 100

      // Find the worst metric
      const metrics = [
        { name: "Accuracy", value: accuracy },
        { name: "Focus", value: focusScore },
        { name: "Speed", value: speedScore },
        { name: "Consistency", value: consistencyScore },
      ];

      metrics.sort((a, b) => a.value - b.value);
      weakArea = metrics[0].name;
    }

    // ── 3. Generate AI challenge ──────────────────
    const generated = await generateDailyChallenge(weakArea, { wpm, accuracy, focusScore });

    // ── 4. Save and return ────────────────────────
    challenge = await Challenge.create({
      userId,
      date: today,
      targetMetric: weakArea,
      title: generated.title,
      description: generated.description,
      difficulty: generated.difficulty,
    });

    return res.json(challenge);
  } catch (error) {
    console.error("Challenge error:", error);
    return res.status(500).json({ error: "Failed to generate challenge" });
  }
};

// ──────────────────────────────────────────────────
// POST /api/challenges/:id/complete
// Marks a challenge as completed
// ──────────────────────────────────────────────────
exports.completeChallenge = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const challenge = await Challenge.findOneAndUpdate(
      { _id: id, userId },
      { isCompleted: true, completedAt: new Date() },
      { new: true }
    );

    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    return res.json({ message: "Challenge completed! Great work!", challenge });
  } catch (error) {
    console.error("Complete challenge error:", error);
    return res.status(500).json({ error: "Failed to update challenge" });
  }
};

// ──────────────────────────────────────────────────
// GET /api/challenges/history
// Last 30 challenges for the user
// ──────────────────────────────────────────────────
exports.getChallengeHistory = async (req, res) => {
  try {
    const challenges = await Challenge.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(30);

    return res.json(challenges);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load challenge history" });
  }
};
