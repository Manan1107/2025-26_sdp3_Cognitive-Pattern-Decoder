const mongoose = require("mongoose");
const Session = require("../models/Session.model");
const MLResult = require("../models/MLResult.model");
const Project = require("../models/Project.model");
const axios = require("axios");
const { generateMoodAnalysis, generateSessionNarrative } = require("../services/ai.service");
const { updateStreak } = require("../services/streak.service");

// ======================================
// SHARED CLUSTER MAP (Single Source of Truth)
// ======================================
const CLUSTER_MAP = {
  0: { coding: 75, debugging: 15, planning: 10, meaning: "Systematic Thinker" },
  1: { coding: 55, debugging: 20, planning: 25, meaning: "Creative Coder" },
  2: { coding: 45, debugging: 40, planning: 15, meaning: "Analytical Processor" },
  3: { coding: 65, debugging: 10, planning: 25, meaning: "Intuitive Developer" },
  4: { coding: 50, debugging: 20, planning: 30, meaning: "Methodical Planner" },
};

// ======================================
// CREATE SESSION
// ======================================
exports.createSession = async (req, res) => {
  try {
    let {
      projectId,
      typingSpeed,
      typedChars,
      backspaceCount,
      pasteCount,
      pasteCharacters,
      saveCount,
      fileSwitchCount,
      cursorMoveCount,
      scrollCount,
      debugRunCount,
      terminalOpenCount,
      avgPauseTime,
      sessionTime
    } = req.body;

    // Validation
    if (
      typingSpeed < 0 ||
      typedChars < 0 ||
      backspaceCount < 0 ||
      pasteCount < 0 ||
      avgPauseTime < 0 ||
      sessionTime <= 0
    ) {
      return res.status(400).json({ error: "Invalid session data" });
    }

    // Ensure valid project
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      const existingProject = await Project.findOne({
        userId: req.user.userId
      });

      if (existingProject) {
        projectId = existingProject._id;
      } else {
        const newProject = await Project.create({
          userId: req.user.userId,
          name: "Default Project",
          type: req.body.projectType || "dsa"
        });
        projectId = newProject._id;
      }
    }

    const session = await Session.create({
      userId: req.user.userId,
      projectId,
      typingSpeed,
      typedChars,
      backspaceCount,
      pasteCount,
      pasteCharacters,
      saveCount,
      fileSwitchCount,
      cursorMoveCount,
      scrollCount,
      debugRunCount,
      terminalOpenCount,
      avgPauseTime,
      sessionTime,
      // Suggestion tracker fields (sent from VS Code extension)
      suggestionsAccepted: Number(req.body.suggestionsAccepted ?? 0),
      postAcceptEdits: Number(req.body.postAcceptEdits ?? 0),
    });

    res.status(201).json({
      message: "Session saved successfully",
      sessionId: session._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save session" });
  }
};


// ======================================
// END SESSION → CALL ML SERVICE
// ======================================
exports.endSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session)
      return res.status(404).json({ msg: "Session not found" });

    // Call Python ML Service using env variable
    const mlUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";
    const mlResponse = await axios.post(`${mlUrl}/predict`, {
      typingSpeed: session.typingSpeed,
      typedChars: session.typedChars,
      backspaceCount: session.backspaceCount,
      pasteCount: session.pasteCount,
      avgPauseTime: session.avgPauseTime,
      sessionTime: session.sessionTime
    });

    const cluster = mlResponse.data.cluster;

    // ── Accuracy for mood detection ─────────────────────
    const moodAccuracy = session.typedChars > 0
      ? Math.min(100, Math.max(0,
          Math.round((session.typedChars / (session.typedChars + session.backspaceCount)) * 100)
        ))
      : 0;

    // ── AI Mood & Narrative (runs async, won't block response) ──
    let mood = null;
    let moodEmoji = "🧐";
    let aiNarrative = null;

    try {
      const moodResult = await generateMoodAnalysis({
        typingSpeed: session.typingSpeed,
        backspaceCount: session.backspaceCount,
        avgPauseTime: session.avgPauseTime,
        fileSwitchCount: session.fileSwitchCount,
        sessionTime: session.sessionTime,
        saveCount: session.saveCount,
        scrollCount: session.scrollCount,
        accuracy: moodAccuracy,
      });
      mood = moodResult.mood;
      moodEmoji = moodResult.emoji;

      aiNarrative = await generateSessionNarrative({
        wpm: Math.min(300, Math.max(0, Math.round((session.typingSpeed || 0) * 12))),
        accuracy: moodAccuracy,
        focusScore: Math.min(100, Math.max(0,
          Math.round(100 - (session.fileSwitchCount * 5))
        )),
        clusterMeaning: CLUSTER_MAP[cluster]?.meaning ?? "Analyzed Coder",
        mood,
        dominantTrait: "Logic",
        improvementArea: "Consistency",
      });
    } catch (aiErr) {
      console.error("AI mood/narrative error (non-fatal):", aiErr.message);
    }

    await MLResult.create({
      userId: session.userId,
      projectId: session.projectId,
      sessionId: session._id,
      cluster,
      clusterMeaning: CLUSTER_MAP[cluster]?.meaning ?? "Analyzed Coder",
      mood: mood?.mood || "Exploring",
      aiNarrative,
    });

    // ── Update streak ──────────────────────────────────
    try {
      const streakResult = await updateStreak(session.userId);
      if (streakResult.milestone) {
        const io = req.app.get("io");
        if (io) {
          io.to(String(session.userId)).emit("new_notification", {
            type: "focus",
            message: `🔥 ${streakResult.milestone}-Day Streak! You're on fire! Keep coding every day.`,
          });
        }
      }
    } catch (streakErr) {
      console.error("Streak update error (non-fatal):", streakErr.message);
    }

    // Generate notifications based on session activity
    const { checkAndCreateNotification } = require("../services/notification.service");
    await checkAndCreateNotification(session, cluster, req.app.get("io"));

    res.json({
      message: "Session ended successfully",
      mlCluster: cluster
    });

  } catch (error) {
    console.error("ML ERROR:", error.response?.data || error.message);
    res.status(500).json({
      msg: "ML processing failed",
      error: error.message
    });
  }
};



exports.getDashboardSummary = async (req, res) => {
  try {
    const query = { userId: req.user.userId };

    // Filter by project type (dsa, ml, web, etc.) — groups ALL projects of that type
    if (req.query.projectType) {
      const Project = require("../models/Project.model");
      const matchingProjects = await Project.find({ 
        userId: req.user.userId, 
        type: { $regex: new RegExp(`^${req.query.projectType}$`, 'i') }
      });
      const projectIds = matchingProjects.map(p => p._id);
      query.projectId = { $in: projectIds };
    }

    const sessions = await Session.find(query).sort({ createdAt: 1 });

    const totalSessions = sessions.length;

    if (!totalSessions) {
      return res.json({
        wpm: 0,
        accuracy: 0,
        pasteRatio: "0%",
        duration: "0 sec",
        backspaces: 0,
        avgPauseTime: 0,
        fileSwitches: 0,
        saves: 0,
        totalSessions: 0,
        trend: [],
        cluster: null,
        clusterMeaning: "No Data",
        confidence: 0,
        activityTyping: 0,
        activityDeletions: 0,
        activityReviewing: 0,
        activityIdle: 0,
        behaviourCoding: 0,
        behaviourDebugging: 0,
        behaviourPlanning: 0,
        focusScore: 0,
        consistencyScore: 0,
        memoryScore: 0,
        keypressLatency: 0,
        errorRate: "0%",
        dominantTrait: "N/A",
        improvementArea: "N/A",
        totalTypedChars: 0
      });
    }

    // Bug Fix: Filter out "ghost" sessions (e.g. editor left open with no typing)
    const validSessions = sessions.filter(s => 
      (s.typedChars > 5) || (s.backspaceCount > 2) || (s.fileSwitchCount > 2)
    );
    
    // When viewing a specific project type, aggregate all sessions into averaged metrics
    // When viewing "All Projects", show the latest session (real-time feel)
    let latest;
    if (req.query.projectType && validSessions.length > 1) {
      // Aggregate all valid sessions for this project
      const count = validSessions.length;
      latest = {
        typingSpeed: validSessions.reduce((sum, s) => sum + (s.typingSpeed || 0), 0) / count,
        typedChars: validSessions.reduce((sum, s) => sum + (s.typedChars || 0), 0),
        backspaceCount: validSessions.reduce((sum, s) => sum + (s.backspaceCount || 0), 0),
        pasteCount: validSessions.reduce((sum, s) => sum + (s.pasteCount || 0), 0),
        pasteCharacters: validSessions.reduce((sum, s) => sum + (s.pasteCharacters || 0), 0),
        saveCount: validSessions.reduce((sum, s) => sum + (s.saveCount || 0), 0),
        fileSwitchCount: Math.round(validSessions.reduce((sum, s) => sum + (s.fileSwitchCount || 0), 0) / count),
        cursorMoveCount: Math.round(validSessions.reduce((sum, s) => sum + (s.cursorMoveCount || 0), 0) / count),
        scrollCount: Math.round(validSessions.reduce((sum, s) => sum + (s.scrollCount || 0), 0) / count),
        debugRunCount: validSessions.reduce((sum, s) => sum + (s.debugRunCount || 0), 0),
        terminalOpenCount: validSessions.reduce((sum, s) => sum + (s.terminalOpenCount || 0), 0),
        avgPauseTime: validSessions.reduce((sum, s) => sum + (s.avgPauseTime || 0), 0) / count,
        sessionTime: Math.round(validSessions.reduce((sum, s) => sum + (s.sessionTime || 0), 0) / count),
        suggestionsAccepted: validSessions.reduce((sum, s) => sum + (s.suggestionsAccepted || 0), 0),
        postAcceptEdits: validSessions.reduce((sum, s) => sum + (s.postAcceptEdits || 0), 0),
        _id: validSessions[validSessions.length - 1]._id, // use latest for ML lookup
      };
    } else {
      // Pick the MOST RECENT valid session
      latest = validSessions.length > 0 
        ? validSessions[validSessions.length - 1] 
        : sessions[totalSessions - 1]; // fallback
    }

    if (!latest) {
      return res.json({
        wpm: 0,
        accuracy: 0,
        pasteRatio: "0%",
        duration: "0 sec",
        backspaces: 0,
        avgPauseTime: 0,
        fileSwitches: 0,
        saves: 0,
        totalSessions: 0,
        trend: [],
        cluster: null,
        clusterMeaning: "No Data",
        confidence: 0,
        activityTyping: 0,
        activityDeletions: 0,
        activityReviewing: 0,
        activityIdle: 0,
        behaviourCoding: 0,
        behaviourDebugging: 0,
        behaviourPlanning: 0,
        focusScore: 0,
        consistencyScore: 0,
        memoryScore: 0,
        keypressLatency: 0,
        errorRate: "0%",
        dominantTrait: "N/A",
        improvementArea: "N/A",
        totalTypedChars: 0
      });
    }

    const accuracy = latest.typedChars > 0
      ? Math.round((latest.typedChars / (latest.typedChars + latest.backspaceCount)) * 100)
      : 0;

    // Bug Fix 2: Clamp pasteRatio to [0, 100]
    const pasteRatioRaw = latest.typedChars + (latest.pasteCharacters || 0);
    const pasteRatio = pasteRatioRaw > 0
      ? Math.min(100, Math.max(0, Math.round(((latest.pasteCharacters || 0) / pasteRatioRaw) * 100))) + "%"
      : "0%";

    // Standard Typing speed (WPM) = CPS * 12 (assuming 5 chars/word)
    const trend = sessions.map(s => Math.round(s.typingSpeed * 12));

    // Session analysis retrieval refactored below fallback logic

    const typingScore = latest.typedChars || 0;
    const deletionScore = (latest.backspaceCount || 0) * 1.5;
    const reviewingScore = (latest.cursorMoveCount || 0) * 0.5;
    const idleScore = Math.max(0, latest.sessionTime - (latest.typedChars / 5));

    const total = typingScore + deletionScore + reviewingScore + idleScore || 1;

    // Focus Score: Less harsh penalty for file switches
    const focusScore = total > 0 
      ? Math.min(100, Math.max(0, 100 - (latest.fileSwitchCount * 1.5) - ((idleScore / total) * 100)))
      : 0;
    
    // Consistency: Less harsh penalty for pauses
    const consistencyScore = latest.typedChars > 0 
      ? Math.min(100, Math.max(0, Math.round(100 - (latest.avgPauseTime * 0.8)))) 
      : 0;
    
    // Memory/Logic: Adjusted scaling
    const memoryScore = latest.saveCount > 0 
      ? Math.min(100, Math.max(0, 50 + (latest.saveCount * 5) - (latest.backspaceCount / 10))) 
      : 0;
    const logicScore = latest.cursorMoveCount > 0 
      ? Math.min(100, Math.max(0, 40 + (latest.cursorMoveCount / 20) + (accuracy / 2.5))) 
      : 0;

    // Bug Fix 7: Cap keypressLatency (prevent absurdly high values for slow sessions)
    const keypressLatency = latest.typingSpeed > 0
      ? Math.min(5000, Math.round(1000 / latest.typingSpeed))
      : 0;
    // Bug Fix 3: Graceful error frequency using keystroke ratio
    const errorRate = (latest.typedChars > 0 || latest.backspaceCount > 0)
      ? ((latest.backspaceCount / (latest.typedChars + latest.backspaceCount)) * 100).toFixed(1) + "%"
      : "0%";

    // Try finding ML result for the latest session first
    let ml = await MLResult.findOne({ sessionId: latest._id });

    // Fallback: find most recent analysis, respecting project type filter if set
    if (!ml) {
      const mlQuery = { userId: req.user.userId };
      if (req.query.projectType) {
        const Project = require("../models/Project.model");
        const typeProjects = await Project.find({ 
          userId: req.user.userId, 
          type: { $regex: new RegExp(`^${req.query.projectType}$`, 'i') }
        });
        mlQuery.projectId = { $in: typeProjects.map(p => p._id) };
      }
      ml = await MLResult.findOne(mlQuery).sort({ createdAt: -1 });
    }

    // ── Data-driven behaviour distribution from REAL session metrics ──
    const codingRaw = (latest.typedChars || 0) + (latest.saveCount || 0) * 10;
    const debuggingRaw = ((latest.debugRunCount || 0) + (latest.terminalOpenCount || 0)) * 20;
    const planningRaw = ((latest.fileSwitchCount || 0) * 3) + ((latest.scrollCount || 0) * 0.5) + ((latest.cursorMoveCount || 0) * 0.3);
    const behaviourTotal = codingRaw + debuggingRaw + planningRaw || 1;

    const behaviour = {
      coding: Math.round((codingRaw / behaviourTotal) * 100),
      debugging: Math.round((debuggingRaw / behaviourTotal) * 100),
      planning: Math.round((planningRaw / behaviourTotal) * 100),
      meaning: ml && CLUSTER_MAP[ml.cluster] ? CLUSTER_MAP[ml.cluster].meaning : (ml ? "Analyzed Coder" : "Pending Analysis")
    };
    // Ensure they sum to 100
    behaviour.planning = 100 - behaviour.coding - behaviour.debugging;

    // Calculate Dominant Trait and Improvement Area
    const scores = [
      { name: "Focus", value: focusScore },
      { name: "Accuracy", value: accuracy },
      { name: "Consistency", value: consistencyScore },
      { name: "Logic", value: logicScore },
      { name: "Memory", value: memoryScore },
      { name: "Speed", value: Math.min(100, Math.round(latest.typingSpeed * 12)) }
    ];

    const sortedScores = [...scores].sort((a, b) => b.value - a.value);

    // descriptive trait mapping
    const traitLabels = {
      "Focus": "Deep Concentration",
      "Accuracy": "Precision Coding",
      "Consistency": "Reliable Flow",
      "Logic": "Logical Architecture",
      "Memory": "Context Retention",
      "Speed": "High-Velocity Execution"
    };

    const traitImprovementLabels = {
      "Focus": "Context Awareness",
      "Accuracy": "Code Sanitization",
      "Consistency": "Rhythmic Stability",
      "Logic": "Algorithmic Depth",
      "Memory": "Structural Mapping",
      "Speed": "Implementation Pace"
    };

    const dominantTrait = traitLabels[sortedScores[0].name] || sortedScores[0].name;
    const improvementArea = traitImprovementLabels[sortedScores[sortedScores.length - 1].name] || sortedScores[sortedScores.length - 1].name;

    // --- Dynamic Narrative Logic ---
    let sessionNarrative = "";
    if (ml) {
      const style = behaviour.meaning;
      if (style.includes("Systematic") || style.includes("Analytical")) {
        sessionNarrative = `Your current session demonstrates a strong ${style} pattern. High precision combined with methodical pauses indicates clear thought formulation before execution.`;
      } else if (style.includes("Creative") || style.includes("Intuitive")) {
        sessionNarrative = `Your current session reveals an ${style} pattern. Fluid typing and high-speed execution suggest a strong mastery of the current problem space.`;
      } else {
        sessionNarrative = `Analysis shows a ${style} profile. Your coding rhythm reflects a balanced approach between implementation and planning.`;
      }
    } else {
      sessionNarrative = "Analyzing your recent activity to decode your cognitive coding patterns...";
    }

    // Bug Fix 6: Clamp each session's contribution to [0,100] to prevent negative avgConsistency
    const avgConsistency = sessions.length > 1
      ? sessions.slice(0, -1).reduce((acc, s) => acc + Math.max(0, 100 - (s.avgPauseTime * 15)), 0) / (sessions.length - 1)
      : 0;
    
    let comparisonNarrative = "";
    if (sessions.length > 1) {
      const diff = consistencyScore - avgConsistency;
      if (diff > 5) {
        comparisonNarrative = `Compared to previous sessions, your Consistency score is ${consistencyScore}%, suggesting highly steady focus today.`;
      } else if (diff < -5) {
        comparisonNarrative = `Your Consistency is ${consistencyScore}% today. You're exploring more diverse patterns than your usual average.`;
      } else {
        comparisonNarrative = `Your Consistency remains stable at ${consistencyScore}%, matching your established professional baseline.`;
      }
    } else {
      comparisonNarrative = "This is your first session analysis. We'll start building your comparison profile from next session.";
    }

    // ── Suggestion Tracker Scores ───────────────────────────────
    // aiDependencyScore: how often user relies on AI suggestions
    // We estimate "opportunities" as typedChars / 15 (avg suggestion length)
    // Clamped to [0, 100] — never negative, never over 100
    const suggOpportunities = Math.max(1, Math.round((latest.typedChars || 0) / 15));
    const accepted = latest.suggestionsAccepted || 0;
    const postEdits = latest.postAcceptEdits || 0;

    const aiDependencyScore = Math.min(100, Math.max(0,
      Math.round((accepted / suggOpportunities) * 100)
    ));

    // suggestionAccuracy: % of accepted suggestions that were kept as-is
    // If no suggestions were accepted, we set it to null (not 0, to avoid misleading 0%)
    const suggestionAccuracy = accepted > 0
      ? Math.min(100, Math.max(0,
          Math.round(((accepted - postEdits) / accepted) * 100)
        ))
      : null;

    res.json({
      // Bug Fix 1: Cap WPM at realistic max of 300
      wpm: Math.min(300, Math.max(0, Math.round(latest.typingSpeed * 12))),
      accuracy,
      pasteRatio,
      duration: req.query.projectType && validSessions.length > 1 
        ? `${latest.sessionTime} sec (avg of ${validSessions.length} sessions)` 
        : `${latest.sessionTime} sec`,
      backspaces: latest.backspaceCount,
      avgPauseTime: Number((latest.avgPauseTime ?? 0).toFixed(1)),
      fileSwitches: latest.fileSwitchCount,
      saves: latest.saveCount,
      totalSessions,
      trend,
      cluster: ml ? ml.cluster : null,
      clusterMeaning: behaviour.meaning,
      confidence: ml ? 95 : 0,
      // Bug Fix 4: Activity breakdown — derive last value to guarantee sum = 100%
      activityTyping: Math.round((typingScore / total) * 100),
      activityDeletions: Math.round((deletionScore / total) * 100),
      activityReviewing: Math.round((reviewingScore / total) * 100),
      activityIdle: 100 - Math.round((typingScore / total) * 100) - Math.round((deletionScore / total) * 100) - Math.round((reviewingScore / total) * 100),
      // Bug Fix 5: Normalize behaviour to always sum to 100%
      behaviourCoding: Math.round((behaviour.coding / (behaviour.coding + behaviour.debugging + behaviour.planning)) * 100),
      behaviourDebugging: Math.round((behaviour.debugging / (behaviour.coding + behaviour.debugging + behaviour.planning)) * 100),
      behaviourPlanning: 100 - Math.round((behaviour.coding / (behaviour.coding + behaviour.debugging + behaviour.planning)) * 100) - Math.round((behaviour.debugging / (behaviour.coding + behaviour.debugging + behaviour.planning)) * 100),
      // Detailed Analysis Metrics
      focusScore: Math.round(focusScore),
      consistencyScore: Math.round(consistencyScore),
      memoryScore: Math.round(memoryScore),
      logicScore: Math.round(logicScore),
      keypressLatency,
      errorRate,
      dominantTrait,
      improvementArea,
      totalTypedChars: latest.typedChars || 0,
      // Use AI-generated narrative if available, else fall back to rule-based
      sessionNarrative: ml?.aiNarrative || sessionNarrative,
      comparisonNarrative,
      scrollCount: latest.scrollCount || 0,
      terminalOpenCount: latest.terminalOpenCount || 0,
      debugRunCount: latest.debugRunCount || 0,
      // Mood (from AI)
      mood: ml?.mood || null,
      // Suggestion Tracker (all clamped to [0,100])
      aiDependencyScore,
      suggestionAccuracy,
      suggestionsAccepted: accepted,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Dashboard load failed"
    });
  }
};

// ======================================
// GET SESSIONS BY USER
// ======================================
exports.getSessionsByUser = async (req, res) => {
  try {
    const sessions = await Session.find({
      userId: req.params.userId
    });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};


// ======================================
// GET SESSIONS BY PROJECT
// ======================================
exports.getSessionsByProject = async (req, res) => {
  try {
    const sessions = await Session.find({
      projectId: req.params.projectId
    });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};


// ======================================
// COGNITIVE HISTORY (Formatted for PDF UI)
// ======================================
exports.getCognitiveHistory = async (req, res) => {
  try {
    const history = await MLResult.find({
      userId: req.user.userId
    })
      .populate("projectId", "name type")
      .populate("sessionId")
      .sort({ createdAt: -1 });

    const formatted = history.map(item => ({
      date: item.createdAt,
      project: item.projectId?.name,
      duration: item.sessionId?.sessionTime,
      wpm: item.sessionId?.typingSpeed,
      backspaces: item.sessionId?.backspaceCount,
      cluster: item.cluster,
      clusterMeaning: item.clusterMeaning || (CLUSTER_MAP[item.cluster]?.meaning ?? "Analyzed Coder")
    }));

    res.json(formatted);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to load cognitive history"
    });
  }
};