/**
 * chat.controller.js
 * ─────────────────────────────────────────────────
 * Handles the AI chatbot endpoints.
 * The AI knows the user's real data and gives
 * personalized responses — not generic answers.
 * ─────────────────────────────────────────────────
 */

const ChatMessage = require("../models/ChatMessage.model");
const Session = require("../models/Session.model");
const MLResult = require("../models/MLResult.model");
const Streak = require("../models/Streak.model");
const Challenge = require("../models/Challenge.model");
const User = require("../models/User.model");
const { generateChatResponse } = require("../services/ai.service");

// ──────────────────────────────────────────────────
// SHARED CLUSTER MAP
// ──────────────────────────────────────────────────
const CLUSTER_MAP = {
  0: { coding: 75, debugging: 15, planning: 10, meaning: "Systematic Thinker" },
  1: { coding: 55, debugging: 20, planning: 25, meaning: "Creative Coder" },
  2: { coding: 45, debugging: 40, planning: 15, meaning: "Analytical Processor" },
  3: { coding: 65, debugging: 10, planning: 25, meaning: "Intuitive Developer" },
  4: { coding: 50, debugging: 20, planning: 30, meaning: "Methodical Planner" },
};

// ──────────────────────────────────────────────────
// POST /api/chat/message
// Receives user message, fetches their real data,
// calls Gemini, saves both messages, returns reply.
// ──────────────────────────────────────────────────
exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // ── 1. Fetch user's latest session data ──────
    const sessions = await Session.find({ userId }).sort({ createdAt: -1 }).limit(10);
    
    // Use the exact same ghost-filtering logic as the dashboard
    const validSessions = sessions.filter(s => 
      (s.typedChars > 5) || (s.backspaceCount > 2) || (s.fileSwitchCount > 2)
    );
    const latest = validSessions.length > 0 ? validSessions[0] : sessions[0];

    let wpm = 0, accuracy = 0, focusScore = 0, consistencyScore = 0;
    let dominantTrait = "Logic", improvementArea = "Accuracy";

    if (latest) {
      wpm = Math.min(300, Math.max(0, Math.round((latest.typingSpeed || 0) * 12)));
      accuracy = latest.typedChars > 0
        ? Math.round((latest.typedChars / (latest.typedChars + latest.backspaceCount)) * 100)
        : 0;
      accuracy = Math.min(100, Math.max(0, accuracy));

      const idleScore = Math.max(0, latest.sessionTime - (latest.typedChars / 5));
      const total = (latest.typedChars || 0) + (latest.backspaceCount * 1.5) +
                    (latest.cursorMoveCount * 0.5) + idleScore || 1;

      focusScore = Math.min(100, Math.max(0,
        Math.round(100 - (latest.fileSwitchCount * 1.5) - ((idleScore / total) * 100))
      ));
      consistencyScore = latest.typedChars > 0
        ? Math.min(100, Math.max(0, Math.round(100 - (latest.avgPauseTime * 0.8))))
        : 0;

      const logicScore = latest.cursorMoveCount > 0
        ? Math.min(100, Math.max(0, 40 + (latest.cursorMoveCount / 20) + (accuracy / 2.5)))
        : 0;
      const memoryScore = latest.saveCount > 0
        ? Math.min(100, Math.max(0, 50 + (latest.saveCount * 5) - (latest.backspaceCount / 10)))
        : 0;
      const speedScore = Math.min(100, Math.max(0, wpm));

      const scores = [
        { name: "Focus", value: focusScore },
        { name: "Accuracy", value: accuracy },
        { name: "Consistency", value: consistencyScore },
        { name: "Logic", value: logicScore },
        { name: "Memory", value: memoryScore },
        { name: "Speed", value: speedScore },
      ];
      const sorted = [...scores].sort((a, b) => b.value - a.value);
      dominantTrait = sorted[0].name;
      improvementArea = sorted[sorted.length - 1].name;
    }

    // ── 2. Fetch latest ML result ────────────────
    const mlResult = await MLResult.findOne({ userId }).sort({ createdAt: -1 });
    const clusterMeaning = mlResult
      ? (CLUSTER_MAP[mlResult.cluster]?.meaning || mlResult.clusterMeaning || "Analyzed Coder")
      : "Pattern Pending";

    // ── 3. Fetch streak ──────────────────────────
    const streak = await Streak.findOne({ userId });
    const currentStreak = streak?.currentStreak || 0;

    // ── 4. Fetch today's challenge ───────────────
    const today = new Date().toISOString().split("T")[0];
    const challenge = await Challenge.findOne({ userId, date: today });

    // ── 5. Fetch recent chat history ─────────────
    const chatHistory = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    chatHistory.reverse();

    // Fetch real user name from database (JWT only has userId)
    const userDoc = await User.findById(userId).select("name").lean();
    const userName = userDoc?.name || "Developer";

    // ── 6. Build context object ──────────────────
    const userContext = {
      name: userName,
      wpm,
      accuracy,
      totalSessions: sessions.length,
      clusterMeaning,
      focusScore,
      consistencyScore,
      dominantTrait,
      improvementArea,
      mood: mlResult?.mood || null,
      aiNarrative: mlResult?.aiNarrative || null,
      currentStreak,
      todayChallenge: challenge ? `${challenge.title}: ${challenge.description}` : null,
    };

    // ── 7. Save user message ─────────────────────
    await ChatMessage.create({ userId, role: "user", content: message.trim() });

    // ── 8. Get AI reply ──────────────────────────
    const aiReply = await generateChatResponse(message, userContext, chatHistory);

    // ── 9. Save AI reply ─────────────────────────
    await ChatMessage.create({ userId, role: "assistant", content: aiReply });

    return res.json({ reply: aiReply });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({
      error: "Chat service unavailable",
      reply: "I'm having trouble connecting right now. Please try again shortly!",
    });
  }
};

// ──────────────────────────────────────────────────
// GET /api/chat/history
// Returns last 20 messages for the chat UI
// ──────────────────────────────────────────────────
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const messages = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    messages.reverse();
    return res.json(messages);
  } catch (error) {
    console.error("Chat history error:", error);
    return res.status(500).json({ error: "Failed to load chat history" });
  }
};

// ──────────────────────────────────────────────────
// DELETE /api/chat/history
// Clears chat history for the user
// ──────────────────────────────────────────────────
exports.clearHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    await ChatMessage.deleteMany({ userId });
    return res.json({ message: "Chat history cleared" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to clear history" });
  }
};
