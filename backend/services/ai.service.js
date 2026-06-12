/**
 * ai.service.js
 * ─────────────────────────────────────────────────────────────
 * Central AI service powered by GROQ (Free, No Credit Card)
 * Uses Llama 3.3 70B — fast and smart
 *
 * Powers:
 *   1. Chatbot responses (with user context from MongoDB)
 *   2. Session mood detection
 *   3. Daily challenge generation
 *   4. AI session narrative generation
 * ─────────────────────────────────────────────────────────────
 */

const axios = require("axios");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Model fallback chain — all free on Groq
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",   // Best quality
  "llama3-8b-8192",            // Fastest fallback
  "mixtral-8x7b-32768",        // Alternative fallback
];

/**
 * Core helper: sends a prompt to Groq and returns the text response.
 * Uses OpenAI-compatible API format — same as ChatGPT API style.
 * @param {string} prompt - The full prompt text
 * @param {number} maxTokens - Max response length (default 512)
 * @returns {Promise<string|null>} - AI generated text or null on total failure
 */
async function callGroq(prompt, maxTokens = 512) {
  if (!GROQ_API_KEY) {
    console.warn("⚠️  GROQ_API_KEY not set — using fallback responses.");
    return null;
  }

  for (const model of GROQ_MODELS) {
    try {
      const response = await axios.post(
        GROQ_URL,
        {
          model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: maxTokens,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      const text = response.data?.choices?.[0]?.message?.content || "";
      if (text.trim()) {
        console.log(`✅ Groq [${model}] responded`);
        return text.trim();
      }
    } catch (err) {
      const status = err?.response?.data?.error?.type;
      const code = err?.response?.status;
      // Try next model on rate limit or model-not-found errors
      if (code === 429 || code === 404 || status === "rate_limit_exceeded") {
        console.warn(`⚠️  Groq model ${model} unavailable (${code}), trying next...`);
        continue;
      }
      console.error(`Groq error on [${model}]:`, err?.response?.data || err.message);
      break;
    }
  }

  console.error("❌ All Groq models exhausted — using built-in fallback responses.");
  return null;
}


// ──────────────────────────────────────────────────────────────
// 1. CHATBOT — Personalized response with user context
// ──────────────────────────────────────────────────────────────
/**
 * @param {string} userMessage - What the user typed in the chat
 * @param {object} userContext - User's real data from MongoDB
 * @param {Array}  chatHistory - Last few messages for context
 * @returns {Promise<string>} AI reply text
 */
async function generateChatResponse(userMessage, userContext, chatHistory = []) {
  const {
    name = "Developer",
    wpm = 0,
    accuracy = 0,
    totalSessions = 0,
    clusterMeaning = "Unknown Pattern",
    focusScore = 0,
    consistencyScore = 0,
    dominantTrait = "N/A",
    improvementArea = "N/A",
    mood = null,
    currentStreak = 0,
    todayChallenge = null,
    aiNarrative = null,
  } = userContext;

  // Build recent chat history string (last 6 messages)
  const historyText =
    chatHistory.length > 0
      ? chatHistory
          .slice(-6)
          .map((m) => `${m.role === "user" ? "User" : "AI Coach"}: ${m.content}`)
          .join("\n")
      : "";

  const prompt = `
You are the AI Cognitive Coding Coach for the "Cognitive Pattern Decoder" (CPD) platform.
You are talking to: ${name}

=== ABOUT THIS PLATFORM ===
CPD is a VS Code extension + web dashboard that tracks developers' coding behaviour in real-time.
It monitors typing speed, backspaces, file switches, pauses, saves, scrolls, debug runs, terminal usage, and AI suggestion acceptance.
Using Machine Learning (K-Means clustering), it classifies developers into one of 5 cognitive coding types:

1. Systematic Thinker — Highly structured, precise coder. Plans before typing. Low errors, steady pace.
2. Creative Coder — Fast, fluid, intuitive. Rapid typing with creative problem-solving. Occasional bursts of edits.
3. Analytical Processor — Debug-heavy, methodical. Spends time analyzing code, high debugging activity.
4. Intuitive Developer — Navigates code freely, explores solutions. Quick decisions with minimal debugging.
5. Methodical Planner — Balanced approach. Plans extensively before coding. Moderate speed, high consistency.

=== PLATFORM FEATURES ===
- Dashboard: Shows WPM, accuracy, focus score, consistency, AI dependency, suggestion accuracy, mood, streak, and daily challenge.
- Session Analysis: Radar chart of 6 cognitive traits (Focus, Speed, Accuracy, Consistency, Memory, Logic).
- Mood Detection: AI analyzes each session to detect mood (Flow, Frustrated, Exploring, Energetic, Tired).
- Daily Challenge: AI generates a personalized coding challenge targeting the user's weakest skill.
- Streak Tracker: Tracks consecutive days of coding activity.
- Project Filtering: Users can view analytics filtered by specific projects (e.g., DSA, Web App, ML).
- AI Chatbot (you): Personalized coding coach that knows the user's real metrics.

=== ${name.toUpperCase()}'S CURRENT DATA ===
- Typing Speed: ${wpm} WPM
- Accuracy: ${accuracy}%
- Total Sessions: ${totalSessions}
- Cognitive Pattern (ML): ${clusterMeaning}
- Focus Score: ${focusScore}/100
- Consistency Score: ${consistencyScore}/100
- Dominant Trait: ${dominantTrait}
- Area to Improve: ${improvementArea}
- Current Streak: ${currentStreak} days${mood ? `\n- Session Mood: ${mood}` : ""}${aiNarrative ? `\n- Last AI Insight: ${aiNarrative}` : ""}${todayChallenge ? `\n- Today's Challenge: ${todayChallenge}` : ""}

${historyText ? `Recent conversation:\n${historyText}\n` : ""}

User just asked: "${userMessage}"

Rules:
- Always address the user by their name "${name}".
- Be friendly, encouraging, and specific using their actual data.
- Keep responses short (2-4 sentences max).
- If asked what this platform does, explain CPD features clearly.
- If asked about cognitive types, describe the relevant type with detail.
- If asked about something unrelated to coding/performance, gently redirect.
- Do not use asterisks or markdown formatting.
`;

  const reply = await callGroq(prompt, 300);
  return (
    reply ||
    "I'm having a brief moment of thinking — please try again! Your data looks interesting though."
  );
}

// ──────────────────────────────────────────────────────────────
// 2. MOOD DETECTOR — Detects coding mood from session metrics
// ──────────────────────────────────────────────────────────────
/**
 * @param {object} metrics - Session metrics
 * @returns {Promise<{mood: string, emoji: string, description: string}>}
 */
async function generateMoodAnalysis(metrics) {
  const {
    typingSpeed = 0,
    backspaceCount = 0,
    avgPauseTime = 0,
    fileSwitchCount = 0,
    sessionTime = 0,
    saveCount = 0,
    scrollCount = 0,
    accuracy = 0,
  } = metrics;

  const prompt = `
You are analyzing a developer's coding session to detect their mood.

Session data:
- Typing Speed: ${typingSpeed} chars/sec
- Backspace Count: ${backspaceCount}
- Average Pause Time: ${avgPauseTime}s
- File Switches: ${fileSwitchCount}
- Session Duration: ${sessionTime}s
- Saves: ${saveCount}
- Scroll Count: ${scrollCount}
- Estimated Accuracy: ${accuracy}%

Based on this, classify the developer's mood into exactly ONE of these options:
Flow, Frustrated, Exploring, Energetic, Tired

Then write one short sentence (under 15 words) describing what you detected.

Reply in this exact JSON format (no extra text):
{"mood": "Flow", "description": "You were in a deep productive state with steady output."}
`;

  const raw = await callGroq(prompt, 100);

  try {
    // Extract JSON from response (handles cases where Gemini adds extra text)
    const jsonMatch = raw.match(/\{.*\}/s);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const moodEmojis = {
        Flow: "🌊",
        Frustrated: "😤",
        Exploring: "🧐",
        Energetic: "⚡",
        Tired: "😴",
      };
      return {
        mood: parsed.mood || "Exploring",
        emoji: moodEmojis[parsed.mood] || "🧐",
        description: parsed.description || "Session analyzed.",
      };
    }
  } catch (_) {}

  // Fallback: rule-based mood detection
  return ruleBasedMood(metrics);
}

/**
 * Fallback rule-based mood detection (no AI needed)
 */
function ruleBasedMood({ backspaceCount, avgPauseTime, typingSpeed, fileSwitchCount }) {
  if (avgPauseTime > 10 || (backspaceCount > 100 && typingSpeed < 2)) {
    return { mood: "Tired", emoji: "😴", description: "Long pauses suggest mental fatigue." };
  }
  if (backspaceCount > 150 && fileSwitchCount > 20) {
    return { mood: "Frustrated", emoji: "😤", description: "High error rate and frequent context switching detected." };
  }
  if (typingSpeed > 5 && backspaceCount < 50) {
    return { mood: "Energetic", emoji: "⚡", description: "Fast, clean output — you were on fire!" };
  }
  if (fileSwitchCount > 15 && typingSpeed < 2) {
    return { mood: "Exploring", emoji: "🧐", description: "Lots of navigation suggests research and planning." };
  }
  return { mood: "Flow", emoji: "🌊", description: "Steady, focused coding session." };
}

// ──────────────────────────────────────────────────────────────
// 3. SESSION NARRATIVE — Short AI-generated insight after session
// ──────────────────────────────────────────────────────────────
/**
 * @param {object} metrics - Session + cluster data
 * @returns {Promise<string>} 2-sentence narrative
 */
async function generateSessionNarrative(metrics) {
  const {
    wpm = 0,
    accuracy = 0,
    focusScore = 0,
    clusterMeaning = "Coder",
    mood = "Flow",
    dominantTrait = "Logic",
    improvementArea = "Accuracy",
  } = metrics;

  const prompt = `
Write a 2-sentence personalized coding session insight for a developer.

Their data:
- Typing Speed: ${wpm} WPM
- Accuracy: ${accuracy}%
- Focus Score: ${focusScore}/100
- Cognitive Pattern: ${clusterMeaning}
- Session Mood: ${mood}
- Strongest Trait: ${dominantTrait}
- Area to Improve: ${improvementArea}

Be encouraging, specific, and professional. No markdown, no asterisks. Max 60 words total.
`;

  const narrative = await callGroq(prompt, 150);
  return (
    narrative ||
    `Your session reflects a ${clusterMeaning} coding pattern with ${accuracy}% accuracy. Keep building on your ${dominantTrait} strength!`
  );
}

// ──────────────────────────────────────────────────────────────
// 4. DAILY CHALLENGE — Personalized challenge for weak areas
// ──────────────────────────────────────────────────────────────
/**
 * @param {string} weakArea - The metric the user needs to improve
 * @param {object} userStats - Recent performance data
 * @returns {Promise<{title, description, difficulty}>}
 */
async function generateDailyChallenge(weakArea, userStats = {}) {
  const { wpm = 0, accuracy = 0, focusScore = 0 } = userStats;

  const prompt = `
Generate a short, actionable daily coding challenge for a developer.

Their weak area: ${weakArea}
Recent performance:
- WPM: ${wpm}
- Accuracy: ${accuracy}%
- Focus Score: ${focusScore}/100

Create a challenge that specifically targets their weak area.
It should be achievable in one coding session (30-60 minutes).

Reply in this exact JSON format:
{
  "title": "Short challenge title (max 8 words)",
  "description": "What the developer should do (2-3 sentences, specific and actionable)",
  "difficulty": "Easy"
}

difficulty must be exactly: Easy, Medium, or Hard
`;

  const raw = await callGroq(prompt, 200);

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: parsed.title || `Improve Your ${weakArea}`,
        description:
          parsed.description ||
          `Focus on improving your ${weakArea} during today's session.`,
        difficulty: ["Easy", "Medium", "Hard"].includes(parsed.difficulty)
          ? parsed.difficulty
          : "Medium",
      };
    }
  } catch (_) {}

  // Fallback challenges
  const fallbacks = {
    Accuracy: {
      title: "Zero Backspace Challenge",
      description:
        "Write 50 lines of code today without pressing backspace more than 10 times. Plan your logic on paper first, then type with intention.",
      difficulty: "Medium",
    },
    Focus: {
      title: "Single File Focus Session",
      description:
        "Work on only ONE file for 45 minutes without switching tabs or files. Close all distractions and track your concentration.",
      difficulty: "Easy",
    },
    Speed: {
      title: "Timed Implementation Sprint",
      description:
        "Implement a linked list or binary search in under 20 minutes. Set a timer and push your comfortable typing pace.",
      difficulty: "Medium",
    },
    Consistency: {
      title: "Rhythm Builder",
      description:
        "Code for 30 minutes with breaks every 10 minutes. Maintain a steady typing rhythm — no long pauses between keystrokes.",
      difficulty: "Easy",
    },
  };

  return (
    fallbacks[weakArea] || {
      title: "Today's Improvement Challenge",
      description: `Focus on improving your ${weakArea} during today's session. Track your progress and push your limits.`,
      difficulty: "Medium",
    }
  );
}

module.exports = {
  generateChatResponse,
  generateMoodAnalysis,
  generateSessionNarrative,
  generateDailyChallenge,
};
