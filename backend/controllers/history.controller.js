// const Session = require("../models/Session.model");
// const MLResult = require("../models/MLResult.model");

// exports.getCognitiveHistory = async (req, res) => {
//   try {
//     const userId = req.user.userId;

//     const history = await MLResult.find({ userId })
//       .populate("projectId", "name type")
//       .populate("sessionId")
//       .sort({ createdAt: -1 });

//     const formatted = history.map(item => ({
//       date: item.createdAt,
//       project: item.projectId?.name,
//       projectType: item.projectId?.type,
//       cluster: item.cluster,
//       sessionTime: item.sessionId?.sessionTime,
//       typingSpeed: item.sessionId?.typingSpeed,
//       backspaceCount: item.sessionId?.backspaceCount,
//       avgPauseTime: item.sessionId?.avgPauseTime
//     }));

//     res.json(formatted);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to load cognitive history" });
//   }
// };
// const Session = require("../models/Session.model");
// const MLResult = require("../models/MLResult.model");

// exports.getCognitiveHistory = async (req, res) => {
//   try {
//     const userId = req.user.userId;

//     // Get all sessions sorted by date
//     const sessions = await Session.find({ userId }).sort({ createdAt: 1 });

//     // Get ML results for those sessions
//     const mlResults = await MLResult.find({ userId });

//     const mlMap = {};
//     mlResults.forEach(r => {
//       mlMap[r.sessionId.toString()] = r.cluster;
//     });

//     const history = sessions.map(s => ({
//       date: s.createdAt,
//       typingSpeed: s.typingSpeed,
//       pauseTime: s.avgPauseTime,
//       backspaces: s.backspaceCount,
//       cluster: mlMap[s._id.toString()] ?? null
//     }));

//     res.json(history);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch cognitive history" });
//   }
// };

const Session = require("../models/Session.model");
const MLResult = require("../models/MLResult.model");

const clusterMeanings = {
  0: "Systematic Thinker",
  1: "Creative Coder",
  2: "Analytical Processor",
  3: "Intuitive Developer",
  4: "Methodical Planner",
};

exports.getCognitiveHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch ALL sessions for the user, sorted by newest first
    const sessions = await Session.find({ userId })
      .populate("projectId", "name type")
      .sort({ createdAt: -1 });

    console.log(`History: Found ${sessions.length} sessions for user ${userId}`);

    // Fetch corresponding ML results for these sessions
    const sessionIds = sessions.map(s => s._id);
    const mlResults = await MLResult.find({ sessionId: { $in: sessionIds } });

    // Create a map for quick ML lookup
    const mlMap = {};
    mlResults.forEach(ml => {
      mlMap[ml.sessionId.toString()] = ml.cluster;
    });

    // Format the response including sessions WITHOUT ML results
    const formatted = sessions.map(s => {
      const cluster = mlMap[s._id.toString()] ?? null;
      return {
        _id: s._id,
        date: s.createdAt,
        project: s.projectId?.name || "Global Session",
        projectType: s.projectId?.type || "General",
        cluster: cluster,
        clusterMeaning: cluster !== null ? clusterMeanings[cluster] : "Analyzing...",
        // Standardized Metrics
        wpm: Math.round((s.typingSpeed ?? 0) * 12),
        duration: (s.sessionTime ?? 0) * 1000, // Frontend expects ms
        backspaces: s.backspaceCount ?? 0,
        fileSwitches: s.fileSwitchCount ?? 0,
        pasteCount: s.pasteCount ?? 0,
        avgPauseTime: s.avgPauseTime ?? 0,
        saves: s.saveCount ?? 0,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Cognitive History Error:", err);
    res.status(500).json({ error: "Failed to load cognitive history from Atlas" });
  }
};
