// // // const axios = require("axios");
// // // const Session = require("../models/Session.model");
// // // const MLResult = require("../models/MLResult.model");
// // // const { getClusterPrediction } = require("../services/ml.service");
// // // const { getClusterMeaning } = require("../utils/clusterMeaning");
// // // const { checkAndCreateNotification } = require("../services/notification.service");


// // // // ===============================
// // // // CREATE SESSION
// // // // ===============================
// // // exports.createSession = async (req, res) => {
// // //   try {
// // //     const {
// // //       projectId,
// // //       typingSpeed,
// // //       typedChars,
// // //       backspaceCount,
// // //       pasteCount,
// // //       pasteCharacters,
// // //       saveCount,
// // //       fileSwitchCount,
// // //       cursorMoveCount,
// // //       avgPauseTime,
// // //       sessionTime
// // //     } = req.body;

// // //     if (typingSpeed < 0 || typedChars < 0 || backspaceCount < 0 || pasteCount < 0 || avgPauseTime < 0 || sessionTime <= 0) {
// // //       return res.status(400).json({ error: "Invalid session data" });
// // //     }

// // //     const session = new Session({
// // //       userId: req.user.userId,
// // //       projectId,
// // //       typingSpeed,
// // //       typedChars,
// // //       backspaceCount,
// // //       pasteCount,
// // //       pasteCharacters,
// // //       saveCount,
// // //       fileSwitchCount,
// // //       cursorMoveCount,
// // //       avgPauseTime,
// // //       sessionTime
// // //     });

// // //     await session.save();

// // //     res.status(201).json({ message: "Session saved successfully", sessionId: session._id });

// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(500).json({ error: "Failed to save session" });
// // //   }
// // // };


// // // // ===============================
// // // // END SESSION → RUN ML + SAVE RESULT
// // // // ===============================
// // // exports.endSession = async (req, res) => {
// // //   try {
// // //     const session = await Session.findById(req.params.sessionId);

// // //     if (!session) return res.status(404).json({ msg: "Session not found" });

// // //     // 🔹 Call ML service
// // //     const mlResponse = await axios.post("http://127.0.0.1:8000/predict", {
// // //       typingSpeed: session.typingSpeed,
// // //       typedChars: session.typedChars,
// // //       backspaceCount: session.backspaceCount,
// // //       pasteCount: session.pasteCount,
// // //       avgPauseTime: session.avgPauseTime,
// // //       sessionTime: session.sessionTime
// // //     });

// // //     const cluster = mlResponse.data.cluster;

// // //     // 🔹 Save ML Result
// // //     await MLResult.create({
// // //       userId: session.userId,
// // //       projectId: session.projectId,
// // //       sessionId: session._id,
// // //       cluster
// // //     });

// // //     // 🔔 Trigger notifications
// // //     await checkAndCreateNotification(session, cluster);

// // //     res.json({ msg: "Session ended", cluster });

// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(500).json({ msg: "Error ending session" });
// // //   }
// // // };


// // // // ===============================
// // // // GET SESSIONS BY USER
// // // // ===============================
// // // exports.getSessionsByUser = async (req, res) => {
// // //   const sessions = await Session.find({ userId: req.params.userId });
// // //   res.json(sessions);
// // // };


// // // // ===============================
// // // // GET SESSIONS BY PROJECT
// // // // ===============================
// // // exports.getSessionsByProject = async (req, res) => {
// // //   const sessions = await Session.find({ projectId: req.params.projectId });
// // //   res.json(sessions);
// // // };
// // // const Session = require("../models/Session.model");
// // // const MLResult = require("../models/MLResult.model");
// // // const axios = require("axios");
// // // const { checkAndCreateNotification } = require("../services/notification.service");

// // // // ================= CREATE SESSION =================
// // // exports.createSession = async (req, res) => {
// // //   try {
// // //     const {
// // //       projectId,
// // //       typingSpeed,
// // //       typedChars,
// // //       backspaceCount,
// // //       pasteCount,
// // //       pasteCharacters,
// // //       saveCount,
// // //       fileSwitchCount,
// // //       cursorMoveCount,
// // //       avgPauseTime,
// // //       sessionTime
// // //     } = req.body;

// // //     if (typingSpeed < 0 || typedChars < 0 || backspaceCount < 0 || pasteCount < 0 || avgPauseTime < 0 || sessionTime <= 0) {
// // //       return res.status(400).json({ error: "Invalid session data" });
// // //     }

// // //     const session = new Session({
// // //       userId: req.user.userId,
// // //       projectId,
// // //       typingSpeed,
// // //       typedChars,
// // //       backspaceCount,
// // //       pasteCount,
// // //       pasteCharacters,
// // //       saveCount,
// // //       fileSwitchCount,
// // //       cursorMoveCount,
// // //       avgPauseTime,
// // //       sessionTime
// // //     });

// // //     await session.save();

// // //     res.status(201).json({ message: "Session saved", sessionId: session._id });
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(500).json({ error: "Failed to save session" });
// // //   }
// // // };

// // // // ================= END SESSION → ML =================
// // // exports.endSession = async (req, res) => {
// // //   try {
// // //     const axios = require("axios");
// // //     const MLResult = require("../models/MLResult.model");

// // //     const session = await Session.findById(req.params.sessionId);
// // //     if (!session) return res.status(404).json({ msg: "Session not found" });

// // //     const mlResponse = await axios.post("http://127.0.0.1:8000/predict", {
// // //       typingSpeed: session.typingSpeed,
// // //       typedChars: session.typedChars,
// // //       backspaceCount: session.backspaceCount,
// // //       pasteCount: session.pasteCount,
// // //       avgPauseTime: session.avgPauseTime,
// // //       sessionTime: session.sessionTime
// // //     });

// // //     const cluster = mlResponse.data.cluster;

// // //     await MLResult.create({
// // //       userId: session.userId,
// // //       projectId: session.projectId,
// // //       sessionId: session._id,
// // //       cluster
// // //     });

// // //     res.json({ msg: "Session ended", mlCluster: cluster });
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(500).json({ msg: "Error ending session" });
// // //   }
// // // };

// // // exports.getCognitiveHistory = async (req, res) => {
// // //   try {
// // //     const MLResult = require("../models/MLResult.model");

// // //     const history = await MLResult.find({ userId: req.user.userId })
// // //       .populate("projectId", "name type")
// // //       .populate("sessionId")
// // //       .sort({ createdAt: -1 });

// // //     const formatted = history.map(item => ({
// // //       date: item.createdAt,
// // //       project: item.projectId?.name,
// // //       projectType: item.projectId?.type,
// // //       cluster: item.cluster,
// // //       sessionTime: item.sessionId?.sessionTime,
// // //       typingSpeed: item.sessionId?.typingSpeed,
// // //       backspaceCount: item.sessionId?.backspaceCount,
// // //       avgPauseTime: item.sessionId?.avgPauseTime
// // //     }));

// // //     res.json(formatted);
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ error: "Failed to load cognitive history" });
// // //   }
// // // };
// // // const Session = require("../models/Session.model");
// // // const MLResult = require("../models/MLResult.model");
// // // const axios = require("axios");

// // // // ===============================
// // // // CREATE SESSION
// // // // ===============================
// // // exports.createSession = async (req, res) => {
// // //   try {
// // //     const {
// // //       projectId,
// // //       typingSpeed,
// // //       typedChars,
// // //       backspaceCount,
// // //       pasteCount,
// // //       pasteCharacters,
// // //       saveCount,
// // //       fileSwitchCount,
// // //       cursorMoveCount,
// // //       avgPauseTime,
// // //       sessionTime
// // //     } = req.body;

// // //     // 🔐 Validation
// // //     if (
// // //       typingSpeed < 0 ||
// // //       typedChars < 0 ||
// // //       backspaceCount < 0 ||
// // //       pasteCount < 0 ||
// // //       avgPauseTime < 0 ||
// // //       sessionTime <= 0
// // //     ) {
// // //       return res.status(400).json({ error: "Invalid session data" });
// // //     }

// // //     const session = new Session({
// // //       userId: req.user.userId,
// // //       projectId,
// // //       typingSpeed,
// // //       typedChars,
// // //       backspaceCount,
// // //       pasteCount,
// // //       pasteCharacters,
// // //       saveCount,
// // //       fileSwitchCount,
// // //       cursorMoveCount,
// // //       avgPauseTime,
// // //       sessionTime
// // //     });

// // //     await session.save();

// // //     res.status(201).json({
// // //       message: "Session saved",
// // //       sessionId: session._id
// // //     });

// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ error: "Failed to save session" });
// // //   }
// // // };

// // // // ===============================
// // // // END SESSION (ML)
// // // // ===============================
// // // exports.endSession = async (req, res) => {
// // //   try {
// // //     const session = await Session.findById(req.params.sessionId);
// // //     if (!session) return res.status(404).json({ msg: "Session not found" });

// // //     const mlResponse = await axios.post("http://localhost:8000/predict", {
// // //       typingSpeed: session.typingSpeed,
// // //       typedChars: session.typedChars,
// // //       backspaceCount: session.backspaceCount,
// // //       pasteCount: session.pasteCount,
// // //       avgPauseTime: session.avgPauseTime,
// // //       sessionTime: session.sessionTime
// // //     });

// // //     const cluster = mlResponse.data.cluster;

// // //     const mlResult = await MLResult.create({
// // //       userId: session.userId,
// // //       projectId: session.projectId,
// // //       sessionId: session._id,
// // //       cluster
// // //     });

// // //     await checkAndCreateNotification(session, cluster);

// // //     res.json({ msg: "Session ended", mlCluster: cluster });

// // //   }  catch (error) {
// // //   console.error("ML ERROR:", error.response?.data || error.message);
// // //   res.status(500).json({ msg: "ML processing failed", error: error.message });
// // // }
// // // };


// // // // ===============================
// // // // GET SESSIONS BY USER
// // // // ===============================
// // // exports.getSessionsByUser = async (req, res) => {
// // //   const sessions = await Session.find({ userId: req.params.userId });
// // //   res.json(sessions);
// // // };

// // // // ===============================
// // // // GET SESSIONS BY PROJECT
// // // // ===============================
// // // exports.getSessionsByProject = async (req, res) => {
// // //   const sessions = await Session.find({ projectId: req.params.projectId });
// // //   res.json(sessions);
// // // };

// // // // ===============================
// // // // COGNITIVE HISTORY
// // // // ===============================
// // // exports.getCognitiveHistory = async (req, res) => {
// // //   const history = await MLResult.find({ userId: req.user.userId })
// // //     .populate("projectId", "name type")
// // //     .populate("sessionId")
// // //     .sort({ createdAt: -1 });

// // //   res.json(history);
// // // };const mongoose = require("mongoose");
// // const mongoose = require("mongoose");

// // const Project = require("../models/Project.model");

// // const Session = require("../models/Session.model");
// // const MLResult = require("../models/MLResult.model");
// // const axios = require("axios");
// // const { checkAndCreateNotification } = require("../services/notification.service");

// // // ===============================
// // // CREATE SESSION
// // // ===============================
// // exports.createSession = async (req, res) => {
// //   try {
// //     const {
// //       projectId,
// //       typingSpeed,
// //       typedChars,
// //       backspaceCount,
// //       pasteCount,
// //       pasteCharacters,
// //       saveCount,
// //       fileSwitchCount,
// //       cursorMoveCount,
// //       avgPauseTime,
// //       sessionTime
// //     } = req.body;

// //     // 🔐 Validation
// //     if (
// //       typingSpeed < 0 ||
// //       typedChars < 0 ||
// //       backspaceCount < 0 ||
// //       pasteCount < 0 ||
// //       avgPauseTime < 0 ||
// //       sessionTime <= 0
// //     ) {
// //       return res.status(400).json({ error: "Invalid session data" });
// //     }



// //     if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
// //       // Attempt to find first project owned by user:
// //       const userProject = await Project.findOne({ owner: req.user.userId });
// //       if (userProject) {
// //         projectId = userProject._id;
// //       } else {
// //         const defaultProject = await Project.create({
// //           owner: req.user.userId,
// //           name: "Default Project",
// //           type: "default"
// //         });
// //         projectId = defaultProject._id;
// //       }
// //     } else {
// //       // ensure the provided id exists
// //       const found = await Project.findById(projectId);
// //       if (!found) {
// //         return res.status(400).json({ error: "projectId not found" });
// //       }
// //     }

// //     const session = await Session.create({
// //       userId: req.user.userId,
// //       projectId,
// //       typingSpeed,
// //       typedChars,
// //       backspaceCount,
// //       pasteCount,
// //       pasteCharacters,
// //       saveCount,
// //       fileSwitchCount,
// //       cursorMoveCount,
// //       avgPauseTime,
// //       sessionTime
// //     });

// //     res.status(201).json({
// //       message: "Session saved",
// //       sessionId: session._id
// //     });

// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Failed to save session" });
// //   }
// // };



// // // ===============================
// // // END SESSION → CALL ML SERVICE
// // // ===============================
// // // exports.endSession = async (req, res) => {
// // //   try {
// // //     const session = await Session.findById(req.params.sessionId);
// // //     if (!session) return res.status(404).json({ msg: "Session not found" });
// // // console.log("Sending to ML:", session);

// // //     // 🔥 CALL PYTHON ML SERVICE
// // //     const mlResponse = await axios.post("http://127.0.0.1:8000/predict", {
// // //       typingSpeed: session.typingSpeed,
// // //       typedChars: session.typedChars,
// // //       backspaceCount: session.backspaceCount,
// // //       pasteCount: session.pasteCount,
// // //       avgPauseTime: session.avgPauseTime,
// // //       sessionTime: session.sessionTime
// // //     });
// // // console.log("ML RESPONSE:", mlResponse.data);

// // //     const cluster = mlResponse.data.cluster;

// // //     // 💾 SAVE ML RESULT
// // //     await MLResult.create({
// // //       userId: session.userId,
// // //       projectId: session.projectId,
// // //       sessionId: session._id,
// // //       cluster
// // //     });
// // //     console.error("ML ERROR:", error.response?.data || error.message);


// // //     // 🔔 CREATE NOTIFICATION
// // //     await checkAndCreateNotification(session, cluster);

// // //     res.json({ msg: "Session ended", mlCluster: cluster });

// // //   } catch (error) {
// // //     console.error("ML ERROR:", error.response?.data || error.message);
// // //     res.status(500).json({ msg: "ML processing failed" });
// // //   }
// // // };

// // exports.endSession = async (req, res) => {
// //   try {
// //     const session = await Session.findById(req.params.sessionId);
// //     if (!session) return res.status(404).json({ msg: "Session not found" });

// //     console.log("📤 Sending data to ML:", {
// //       typingSpeed: session.typingSpeed,
// //       typedChars: session.typedChars,
// //       backspaceCount: session.backspaceCount,
// //       pasteCount: session.pasteCount,
// //       avgPauseTime: session.avgPauseTime,
// //       sessionTime: session.sessionTime
// //     });

// //     const mlResponse = await axios.post("http://localhost:8000/predict", {
// //       typingSpeed: session.typingSpeed,
// //       typedChars: session.typedChars,
// //       backspaceCount: session.backspaceCount,
// //       pasteCount: session.pasteCount,
// //       avgPauseTime: session.avgPauseTime,
// //       sessionTime: session.sessionTime
// //     });

// //     console.log("📥 ML RESPONSE:", mlResponse.data);

// //     const cluster = mlResponse.data.cluster;

// //     // decide projectId to store in MLResult:
// //     let projIdToStore = session.projectId; // session.projectId should already be an ObjectId
// //     if (!projIdToStore || !mongoose.Types.ObjectId.isValid(projIdToStore)) {
// //       // fallback: try to find a project for user (same logic as create)
// //       const userProject = await Project.findOne({ owner: session.userId });
// //       if (userProject) projIdToStore = userProject._id;
// //       else projIdToStore = undefined; // let schema handle optional
// //     }

// //     // Create MLResult; convert to ObjectId if present
// //     const mlResultData = {
// //       userId: session.userId,
// //       sessionId: session._id,
// //       cluster
// //     };
// //     if (projIdToStore && mongoose.Types.ObjectId.isValid(projIdToStore)) {
// //       mlResultData.projectId = new mongoose.Types.ObjectId(projIdToStore);
// //     }

// //     const mlResult = await MLResult.create(mlResultData);
// //     console.log("✅ MLResult saved:", mlResult._id);

// //     // optional: notifications
// //     // await checkAndCreateNotification(session, cluster);

// //     res.json({ msg: "Session ended", mlCluster: cluster });

// //   } catch (error) {
// //     console.error("❌ ML ERROR:", error.response?.data || error.message || error);
// //     res.status(500).json({ msg: "ML processing failed", error: error.message });
// //   }
// // };


// // // ===============================
// // // GET SESSIONS BY USER
// // // ===============================
// // exports.getSessionsByUser = async (req, res) => {
// //   const sessions = await Session.find({ userId: req.params.userId });
// //   res.json(sessions);
// // };



// // // ===============================
// // // GET SESSIONS BY PROJECT
// // // ===============================
// // exports.getSessionsByProject = async (req, res) => {
// //   const sessions = await Session.find({ projectId: req.params.projectId });
// //   res.json(sessions);
// // };



// // // ===============================
// // // COGNITIVE HISTORY (ML RESULTS)
// // // ===============================
// // exports.getCognitiveHistory = async (req, res) => {
// //   try {
// //     const history = await MLResult.find({ userId: req.user.userId })
// //       .populate("projectId", "name type")
// //       .populate("sessionId")
// //       .sort({ createdAt: -1 });

// //     res.json(history);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Failed to load cognitive history" });
// //   }
// // };

// const mongoose = require("mongoose");
// const Session = require("../models/Session.model");
// const MLResult = require("../models/MLResult.model");
// const Project = require("../models/Project.model");
// const axios = require("axios");

// // ======================================
// // CREATE SESSION.  
// // ======================================
// exports.createSession = async (req, res) => {
//   try {
//     const body = req.body;

//     if (!req.user || !req.user.userId) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     if (
//       body.typingSpeed < 0 ||
//       body.typedChars < 0 ||
//       body.backspaceCount < 0 ||
//       body.sessionTime <= 0
//     ) {
//       return res.status(400).json({ error: "Invalid session data" });
//     }

//     let projectId = body.projectId;

//     if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
//       const existingProject = await Project.findOne({
//         owner: req.user.userId
//       });

//       if (existingProject) {
//         projectId = existingProject._id;
//       } else {
//         const newProject = await Project.create({
//           owner: req.user.userId,
//           name: "Default Project",
//           type: "default"
//         });
//         projectId = newProject._id;
//       }
//     }

//     const session = await Session.create({
//       userId: req.user.userId,
//       projectId,
//       typingSpeed: body.typingSpeed,
//       typedChars: body.typedChars,
//       backspaceCount: body.backspaceCount,
//       pasteCount: body.pasteCount || 0,
//       pasteCharacters: body.pasteCharacters || 0,
//       saveCount: body.saveCount || 0,
//       fileSwitchCount: body.fileSwitchCount || 0,
//       cursorMoveCount: body.cursorMoveCount || 0,
//       avgPauseTime: body.avgPauseTime || 0,
//       sessionTime: body.sessionTime
//     });

//     res.status(201).json({
//       message: "Session saved",
//       sessionId: session._id
//     });

//   } catch (error) {
//     console.error("CREATE SESSION ERROR:", error);
//     res.status(500).json({
//       error: "Failed to save session",
//       details: error.message
//     });
//   }
// };

// // ======================================
// // END SESSION → CALL ML SERVICE
// // ======================================
// exports.endSession = async (req, res) => {
//   try {
//     const session = await Session.findById(req.params.sessionId);
//     if (!session)
//       return res.status(404).json({ msg: "Session not found" });

//     // Call Python ML Service (FastAPI on port 5001)
//     const mlResponse = await axios.post("http://localhost:5001/predict", {
//       typingSpeed: session.typingSpeed,
//       typedChars: session.typedChars,
//       backspaceCount: session.backspaceCount,
//       pasteCount: session.pasteCount,
//       avgPauseTime: session.avgPauseTime,
//       sessionTime: session.sessionTime
//     });

//     const cluster = mlResponse.data.cluster;

//     await MLResult.create({
//       userId: session.userId,
//       projectId: session.projectId,
//       sessionId: session._id,
//       cluster
//     });
//     console.log("MLResult saved for session", session._id);
//     console.log("ML Cluster:", cluster);

//     res.json({
//       message: "Session ended successfully",
//       mlCluster: cluster
//     });
//  console.log("Session ended and ML result saved:", {
//       sessionId: session._id,
//       mlCluster: cluster
//     });
//   } catch (error) {
//     console.error("ML ERROR:", error.response?.data || error.message);
//     res.status(500).json({
//       msg: "ML processing failed",
//       error: error.message
//     });
//   }
// };


// // ======================================
// // DASHBOARD SUMMARY
// // ======================================
// exports.getDashboardSummary = async (req, res) => {
//   try {
//     const sessions = await Session.find({
//       userId: req.user.userId
//     }).sort({ createdAt: 1 });

//     const totalSessions = sessions.length;

//     if (!totalSessions) {
//       return res.json({
//         wpm: 0, accuracy: 0, errorRate: 0, duration: "0 sec",
//         pasteRatio: "0%", avgPauseTime: 0, backspaces: 0,
//         fileSwitches: 0, saves: 0, totalSessions: 0,
//         trend: [], cluster: null, clusterMeaning: null, confidence: 0,
//         activityTyping: 0, activityDeletions: 0,
//         activityReviewing: 0, activityIdle: 0,
//         behaviourCoding: 33, behaviourDebugging: 33, behaviourPlanning: 34
//       });
//     }

//     const latest = sessions[totalSessions - 1];

//     const accuracy =
//       latest.typedChars > 0
//         ? Math.round(
//           ((latest.typedChars - latest.backspaceCount) / latest.typedChars) * 100
//         )
//         : 0;

//     const pasteRatio =
//       latest.typedChars > 0
//         ? `${Math.round((latest.pasteCount / latest.typedChars) * 100)}%`
//         : "0%";

//     // Per-session trend (WPM over time)
//     const trend = sessions.map(s => s.typingSpeed);

//     // ML result for latest session
//     const ml = await MLResult.findOne({
//       userId: req.user.userId,
//       sessionId: latest._id
//     });

//     // Activity distribution derived from session metrics
//     const typingScore = latest.typedChars || 0;
//     const deletionScore = latest.backspaceCount || 0;
//     const reviewingScore = latest.cursorMoveCount || 0;
//     const idleScore = Math.max(0, (latest.sessionTime || 0) - typingScore - deletionScore - reviewingScore);
//     const activityTotal = typingScore + deletionScore + reviewingScore + idleScore || 1;

//     // Derive rough behaviourDistribution from cluster
//     const behaviourMap = {
//       0: { coding: 70, debugging: 15, planning: 15 },
//       1: { coding: 50, debugging: 20, planning: 30 },
//       2: { coding: 40, debugging: 40, planning: 20 },
//       3: { coding: 60, debugging: 10, planning: 30 },
//       4: { coding: 45, debugging: 25, planning: 30 },
//     };
//     const behaviour = behaviourMap[ml?.cluster] ?? { coding: 55, debugging: 25, planning: 20 };

//     const clusterMeanings = {
//       0: "Systematic Thinker",
//       1: "Creative Coder",
//       2: "Analytical Processor",
//       3: "Intuitive Developer",
//       4: "Methodical Planner",
//     };

//     res.json({
//       wpm: latest.typingSpeed,
//       accuracy,
//       pasteRatio,
//       errorRate: latest.backspaceCount,
//       duration: `${latest.sessionTime ?? 0} sec`,
//       avgPauseTime: Number((latest.avgPauseTime ?? 0).toFixed(1)),
//       backspaces: latest.backspaceCount,
//       fileSwitches: latest.fileSwitchCount,
//       saves: latest.saveCount,
//       totalSessions,
//       trend,
//       cluster: ml ? ml.cluster : null,
//       clusterMeaning: ml ? (clusterMeanings[ml.cluster] ?? "Unknown") : null,
//       confidence: ml ? 92 : 0,
//       activityTyping: Math.round((typingScore / activityTotal) * 100),
//       activityDeletions: Math.round((deletionScore / activityTotal) * 100),
//       activityReviewing: Math.round((reviewingScore / activityTotal) * 100),
//       activityIdle: Math.round((idleScore / activityTotal) * 100),
//       behaviourCoding: behaviour.coding,
//       behaviourDebugging: behaviour.debugging,
//       behaviourPlanning: behaviour.planning,
//     });

//   } catch (error) {
//     console.error("Dashboard error:", error);
//     res.status(500).json({ error: "Dashboard load failed" });
//   }
// };


// // ======================================
// // GET SESSIONS BY USER
// // ======================================
// exports.getSessionsByUser = async (req, res) => {
//   try {
//     const sessions = await Session.find({
//       userId: req.params.userId
//     });

//     res.json(sessions);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch sessions" });
//   }
// };


// // ======================================
// // GET SESSIONS BY PROJECT
// // ======================================
// exports.getSessionsByProject = async (req, res) => {
//   try {
//     const sessions = await Session.find({
//       projectId: req.params.projectId
//     });

//     res.json(sessions);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch sessions" });
//   }
// };


// // ======================================
// // COGNITIVE HISTORY (Formatted for PDF UI)
// // ======================================
// exports.getCognitiveHistory = async (req, res) => {
//   try {
//     const history = await MLResult.find({
//       userId: req.user.userId
//     })
//       .populate("projectId", "name type")
//       .populate("sessionId")
//       .sort({ createdAt: -1 });

//     const formatted = history.map(item => ({
//       date: item.createdAt,
//       project: item.projectId?.name,
//       duration: item.sessionId?.sessionTime,
//       wpm: item.sessionId?.typingSpeed,
//       backspaces: item.sessionId?.backspaceCount,
//       cluster: item.cluster
//     }));

//     res.json(formatted);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "Failed to load cognitive history"
//     });
//   }
// };
// // const axios = require("axios");
// // const Session = require("../models/Session.model");
// // const MLResult = require("../models/MLResult.model");
// // const { getClusterPrediction } = require("../services/ml.service");
// // const { getClusterMeaning } = require("../utils/clusterMeaning");
// // const { checkAndCreateNotification } = require("../services/notification.service");


// // // ===============================
// // // CREATE SESSION
// // // ===============================
// // exports.createSession = async (req, res) => {
// //   try {
// //     const {
// //       projectId,
// //       typingSpeed,
// //       typedChars,
// //       backspaceCount,
// //       pasteCount,
// //       pasteCharacters,
// //       saveCount,
// //       fileSwitchCount,
// //       cursorMoveCount,
// //       avgPauseTime,
// //       sessionTime
// //     } = req.body;

// //     if (typingSpeed < 0 || typedChars < 0 || backspaceCount < 0 || pasteCount < 0 || avgPauseTime < 0 || sessionTime <= 0) {
// //       return res.status(400).json({ error: "Invalid session data" });
// //     }

// //     const session = new Session({
// //       userId: req.user.userId,
// //       projectId,
// //       typingSpeed,
// //       typedChars,
// //       backspaceCount,
// //       pasteCount,
// //       pasteCharacters,
// //       saveCount,
// //       fileSwitchCount,
// //       cursorMoveCount,
// //       avgPauseTime,
// //       sessionTime
// //     });

// //     await session.save();

// //     res.status(201).json({ message: "Session saved successfully", sessionId: session._id });

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: "Failed to save session" });
// //   }
// // };


// // // ===============================
// // // END SESSION → RUN ML + SAVE RESULT
// // // ===============================
// // exports.endSession = async (req, res) => {
// //   try {
// //     const session = await Session.findById(req.params.sessionId);

// //     if (!session) return res.status(404).json({ msg: "Session not found" });

// //     // 🔹 Call ML service
// //     const mlResponse = await axios.post("http://127.0.0.1:8000/predict", {
// //       typingSpeed: session.typingSpeed,
// //       typedChars: session.typedChars,
// //       backspaceCount: session.backspaceCount,
// //       pasteCount: session.pasteCount,
// //       avgPauseTime: session.avgPauseTime,
// //       sessionTime: session.sessionTime
// //     });

// //     const cluster = mlResponse.data.cluster;

// //     // 🔹 Save ML Result
// //     await MLResult.create({
// //       userId: session.userId,
// //       projectId: session.projectId,
// //       sessionId: session._id,
// //       cluster
// //     });

// //     // 🔔 Trigger notifications
// //     await checkAndCreateNotification(session, cluster);

// //     res.json({ msg: "Session ended", cluster });

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ msg: "Error ending session" });
// //   }
// // };


// // // ===============================
// // // GET SESSIONS BY USER
// // // ===============================
// // exports.getSessionsByUser = async (req, res) => {
// //   const sessions = await Session.find({ userId: req.params.userId });
// //   res.json(sessions);
// // };


// // // ===============================
// // // GET SESSIONS BY PROJECT
// // // ===============================
// // exports.getSessionsByProject = async (req, res) => {
// //   const sessions = await Session.find({ projectId: req.params.projectId });
// //   res.json(sessions);
// // };
// // const Session = require("../models/Session.model");
// // const MLResult = require("../models/MLResult.model");
// // const axios = require("axios");
// // const { checkAndCreateNotification } = require("../services/notification.service");

// // // ================= CREATE SESSION =================
// // exports.createSession = async (req, res) => {
// //   try {
// //     const {
// //       projectId,
// //       typingSpeed,
// //       typedChars,
// //       backspaceCount,
// //       pasteCount,
// //       pasteCharacters,
// //       saveCount,
// //       fileSwitchCount,
// //       cursorMoveCount,
// //       avgPauseTime,
// //       sessionTime
// //     } = req.body;

// //     if (typingSpeed < 0 || typedChars < 0 || backspaceCount < 0 || pasteCount < 0 || avgPauseTime < 0 || sessionTime <= 0) {
// //       return res.status(400).json({ error: "Invalid session data" });
// //     }

// //     const session = new Session({
// //       userId: req.user.userId,
// //       projectId,
// //       typingSpeed,
// //       typedChars,
// //       backspaceCount,
// //       pasteCount,
// //       pasteCharacters,
// //       saveCount,
// //       fileSwitchCount,
// //       cursorMoveCount,
// //       avgPauseTime,
// //       sessionTime
// //     });

// //     await session.save();

// //     res.status(201).json({ message: "Session saved", sessionId: session._id });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: "Failed to save session" });
// //   }
// // };

// // // ================= END SESSION → ML =================
// // exports.endSession = async (req, res) => {
// //   try {
// //     const axios = require("axios");
// //     const MLResult = require("../models/MLResult.model");

// //     const session = await Session.findById(req.params.sessionId);
// //     if (!session) return res.status(404).json({ msg: "Session not found" });

// //     const mlResponse = await axios.post("http://127.0.0.1:8000/predict", {
// //       typingSpeed: session.typingSpeed,
// //       typedChars: session.typedChars,
// //       backspaceCount: session.backspaceCount,
// //       pasteCount: session.pasteCount,
// //       avgPauseTime: session.avgPauseTime,
// //       sessionTime: session.sessionTime
// //     });

// //     const cluster = mlResponse.data.cluster;

// //     await MLResult.create({
// //       userId: session.userId,
// //       projectId: session.projectId,
// //       sessionId: session._id,
// //       cluster
// //     });

// //     res.json({ msg: "Session ended", mlCluster: cluster });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ msg: "Error ending session" });
// //   }
// // };

// // exports.getCognitiveHistory = async (req, res) => {
// //   try {
// //     const MLResult = require("../models/MLResult.model");

// //     const history = await MLResult.find({ userId: req.user.userId })
// //       .populate("projectId", "name type")
// //       .populate("sessionId")
// //       .sort({ createdAt: -1 });

// //     const formatted = history.map(item => ({
// //       date: item.createdAt,
// //       project: item.projectId?.name,
// //       projectType: item.projectId?.type,
// //       cluster: item.cluster,
// //       sessionTime: item.sessionId?.sessionTime,
// //       typingSpeed: item.sessionId?.typingSpeed,
// //       backspaceCount: item.sessionId?.backspaceCount,
// //       avgPauseTime: item.sessionId?.avgPauseTime
// //     }));

// //     res.json(formatted);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Failed to load cognitive history" });
// //   }
// // };
// // const Session = require("../models/Session.model");
// // const MLResult = require("../models/MLResult.model");
// // const axios = require("axios");

// // // ===============================
// // // CREATE SESSION
// // // ===============================
// // exports.createSession = async (req, res) => {
// //   try {
// //     const {
// //       projectId,
// //       typingSpeed,
// //       typedChars,
// //       backspaceCount,
// //       pasteCount,
// //       pasteCharacters,
// //       saveCount,
// //       fileSwitchCount,
// //       cursorMoveCount,
// //       avgPauseTime,
// //       sessionTime
// //     } = req.body;

// //     // 🔐 Validation
// //     if (
// //       typingSpeed < 0 ||
// //       typedChars < 0 ||
// //       backspaceCount < 0 ||
// //       pasteCount < 0 ||
// //       avgPauseTime < 0 ||
// //       sessionTime <= 0
// //     ) {
// //       return res.status(400).json({ error: "Invalid session data" });
// //     }

// //     const session = new Session({
// //       userId: req.user.userId,
// //       projectId,
// //       typingSpeed,
// //       typedChars,
// //       backspaceCount,
// //       pasteCount,
// //       pasteCharacters,
// //       saveCount,
// //       fileSwitchCount,
// //       cursorMoveCount,
// //       avgPauseTime,
// //       sessionTime
// //     });

// //     await session.save();

// //     res.status(201).json({
// //       message: "Session saved",
// //       sessionId: session._id
// //     });

// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Failed to save session" });
// //   }
// // };

// // // ===============================
// // // END SESSION (ML)
// // // ===============================
// // exports.endSession = async (req, res) => {
// //   try {
// //     const session = await Session.findById(req.params.sessionId);
// //     if (!session) return res.status(404).json({ msg: "Session not found" });

// //     const mlResponse = await axios.post("http://localhost:8000/predict", {
// //       typingSpeed: session.typingSpeed,
// //       typedChars: session.typedChars,
// //       backspaceCount: session.backspaceCount,
// //       pasteCount: session.pasteCount,
// //       avgPauseTime: session.avgPauseTime,
// //       sessionTime: session.sessionTime
// //     });

// //     const cluster = mlResponse.data.cluster;

// //     const mlResult = await MLResult.create({
// //       userId: session.userId,
// //       projectId: session.projectId,
// //       sessionId: session._id,
// //       cluster
// //     });

// //     await checkAndCreateNotification(session, cluster);

// //     res.json({ msg: "Session ended", mlCluster: cluster });

// //   }  catch (error) {
// //   console.error("ML ERROR:", error.response?.data || error.message);
// //   res.status(500).json({ msg: "ML processing failed", error: error.message });
// // }
// // };


// // // ===============================
// // // GET SESSIONS BY USER
// // // ===============================
// // exports.getSessionsByUser = async (req, res) => {
// //   const sessions = await Session.find({ userId: req.params.userId });
// //   res.json(sessions);
// // };

// // // ===============================
// // // GET SESSIONS BY PROJECT
// // // ===============================
// // exports.getSessionsByProject = async (req, res) => {
// //   const sessions = await Session.find({ projectId: req.params.projectId });
// //   res.json(sessions);
// // };

// // // ===============================
// // // COGNITIVE HISTORY
// // // ===============================
// // exports.getCognitiveHistory = async (req, res) => {
// //   const history = await MLResult.find({ userId: req.user.userId })
// //     .populate("projectId", "name type")
// //     .populate("sessionId")
// //     .sort({ createdAt: -1 });

// //   res.json(history);
// // };const mongoose = require("mongoose");
// const mongoose = require("mongoose");

// const Project = require("../models/Project.model");

// const Session = require("../models/Session.model");
// const MLResult = require("../models/MLResult.model");
// const axios = require("axios");
// const { checkAndCreateNotification } = require("../services/notification.service");

// // ===============================
// // CREATE SESSION
// // ===============================
// exports.createSession = async (req, res) => {
//   try {
//     const {
//       projectId,
//       typingSpeed,
//       typedChars,
//       backspaceCount,
//       pasteCount,
//       pasteCharacters,
//       saveCount,
//       fileSwitchCount,
//       cursorMoveCount,
//       avgPauseTime,
//       sessionTime
//     } = req.body;

//     // 🔐 Validation
//     if (
//       typingSpeed < 0 ||
//       typedChars < 0 ||
//       backspaceCount < 0 ||
//       pasteCount < 0 ||
//       avgPauseTime < 0 ||
//       sessionTime <= 0
//     ) {
//       return res.status(400).json({ error: "Invalid session data" });
//     }



//     if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
//       // Attempt to find first project owned by user:
//       const userProject = await Project.findOne({ owner: req.user.userId });
//       if (userProject) {
//         projectId = userProject._id;
//       } else {
//         const defaultProject = await Project.create({
//           owner: req.user.userId,
//           name: "Default Project",
//           type: "default"
//         });
//         projectId = defaultProject._id;
//       }
//     } else {
//       // ensure the provided id exists
//       const found = await Project.findById(projectId);
//       if (!found) {
//         return res.status(400).json({ error: "projectId not found" });
//       }
//     }

//     const session = await Session.create({
//       userId: req.user.userId,
//       projectId,
//       typingSpeed,
//       typedChars,
//       backspaceCount,
//       pasteCount,
//       pasteCharacters,
//       saveCount,
//       fileSwitchCount,
//       cursorMoveCount,
//       avgPauseTime,
//       sessionTime
//     });

//     res.status(201).json({
//       message: "Session saved",
//       sessionId: session._id
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to save session" });
//   }
// };



// // ===============================
// // END SESSION → CALL ML SERVICE
// // ===============================
// // exports.endSession = async (req, res) => {
// //   try {
// //     const session = await Session.findById(req.params.sessionId);
// //     if (!session) return res.status(404).json({ msg: "Session not found" });
// // console.log("Sending to ML:", session);

// //     // 🔥 CALL PYTHON ML SERVICE
// //     const mlResponse = await axios.post("http://127.0.0.1:8000/predict", {
// //       typingSpeed: session.typingSpeed,
// //       typedChars: session.typedChars,
// //       backspaceCount: session.backspaceCount,
// //       pasteCount: session.pasteCount,
// //       avgPauseTime: session.avgPauseTime,
// //       sessionTime: session.sessionTime
// //     });
// // console.log("ML RESPONSE:", mlResponse.data);

// //     const cluster = mlResponse.data.cluster;

// //     // 💾 SAVE ML RESULT
// //     await MLResult.create({
// //       userId: session.userId,
// //       projectId: session.projectId,
// //       sessionId: session._id,
// //       cluster
// //     });
// //     console.error("ML ERROR:", error.response?.data || error.message);


// //     // 🔔 CREATE NOTIFICATION
// //     await checkAndCreateNotification(session, cluster);

// //     res.json({ msg: "Session ended", mlCluster: cluster });

// //   } catch (error) {
// //     console.error("ML ERROR:", error.response?.data || error.message);
// //     res.status(500).json({ msg: "ML processing failed" });
// //   }
// // };

// exports.endSession = async (req, res) => {
//   try {
//     const session = await Session.findById(req.params.sessionId);
//     if (!session) return res.status(404).json({ msg: "Session not found" });

//     console.log("📤 Sending data to ML:", {
//       typingSpeed: session.typingSpeed,
//       typedChars: session.typedChars,
//       backspaceCount: session.backspaceCount,
//       pasteCount: session.pasteCount,
//       avgPauseTime: session.avgPauseTime,
//       sessionTime: session.sessionTime
//     });

//     const mlResponse = await axios.post("http://localhost:8000/predict", {
//       typingSpeed: session.typingSpeed,
//       typedChars: session.typedChars,
//       backspaceCount: session.backspaceCount,
//       pasteCount: session.pasteCount,
//       avgPauseTime: session.avgPauseTime,
//       sessionTime: session.sessionTime
//     });

//     console.log("📥 ML RESPONSE:", mlResponse.data);

//     const cluster = mlResponse.data.cluster;

//     // decide projectId to store in MLResult:
//     let projIdToStore = session.projectId; // session.projectId should already be an ObjectId
//     if (!projIdToStore || !mongoose.Types.ObjectId.isValid(projIdToStore)) {
//       // fallback: try to find a project for user (same logic as create)
//       const userProject = await Project.findOne({ owner: session.userId });
//       if (userProject) projIdToStore = userProject._id;
//       else projIdToStore = undefined; // let schema handle optional
//     }

//     // Create MLResult; convert to ObjectId if present
//     const mlResultData = {
//       userId: session.userId,
//       sessionId: session._id,
//       cluster
//     };
//     if (projIdToStore && mongoose.Types.ObjectId.isValid(projIdToStore)) {
//       mlResultData.projectId = new mongoose.Types.ObjectId(projIdToStore);
//     }

//     const mlResult = await MLResult.create(mlResultData);
//     console.log("✅ MLResult saved:", mlResult._id);

//     // optional: notifications
//     // await checkAndCreateNotification(session, cluster);

//     res.json({ msg: "Session ended", mlCluster: cluster });

//   } catch (error) {
//     console.error("❌ ML ERROR:", error.response?.data || error.message || error);
//     res.status(500).json({ msg: "ML processing failed", error: error.message });
//   }
// };


// // ===============================
// // GET SESSIONS BY USER
// // ===============================
// exports.getSessionsByUser = async (req, res) => {
//   const sessions = await Session.find({ userId: req.params.userId });
//   res.json(sessions);
// };



// // ===============================
// // GET SESSIONS BY PROJECT
// // ===============================
// exports.getSessionsByProject = async (req, res) => {
//   const sessions = await Session.find({ projectId: req.params.projectId });
//   res.json(sessions);
// };



// // ===============================
// // COGNITIVE HISTORY (ML RESULTS)
// // ===============================
// exports.getCognitiveHistory = async (req, res) => {
//   try {
//     const history = await MLResult.find({ userId: req.user.userId })
//       .populate("projectId", "name type")
//       .populate("sessionId")
//       .sort({ createdAt: -1 });

//     res.json(history);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to load cognitive history" });
//   }
// };

const mongoose = require("mongoose");
const Session = require("../models/Session.model");
const MLResult = require("../models/MLResult.model");
const Project = require("../models/Project.model");
const axios = require("axios");

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
      avgPauseTime,
      sessionTime
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

    // Call Python ML Service
    const mlResponse = await axios.post("http://localhost:8000/predict", {
      typingSpeed: session.typingSpeed,
      typedChars: session.typedChars,
      backspaceCount: session.backspaceCount,
      pasteCount: session.pasteCount,
      avgPauseTime: session.avgPauseTime,
      sessionTime: session.sessionTime
    });

    const cluster = mlResponse.data.cluster;

    const clusterMap = {
      0: "Systematic Thinker",
      1: "Creative Coder",
      2: "Analytical Processor",
      3: "Intuitive Developer",
      4: "Methodical Planner",
    };

    await MLResult.create({
      userId: session.userId,
      projectId: session.projectId,
      sessionId: session._id,
      cluster,
      clusterMeaning: clusterMap[cluster] ?? "Analyzed Coder"
    });

    // Generate notifications based on session activity
    const { checkAndCreateNotification } = require("../services/notification.service");
    await checkAndCreateNotification(session, cluster);

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


// ======================================
// DASHBOARD SUMMARY (IMPORTANT)
// ======================================
// exports.getDashboardSummary = async (req, res) => {
//   try {
//     const sessions = await Session.find({
//       userId: req.user.userId
//     }).sort({ createdAt: 1 });

//     if (!sessions.length) {
//       return res.json({
//         wpm: 0,
//         accuracy: 0,
//         errorRate: 0,
//         duration: "0",
//         trend: [],
//         cluster: "No Data"
//       });
//     }

//     const latest = sessions[sessions.length - 1];

//     const accuracy =
//       latest.typedChars > 0
//         ? Math.round(
//             ((latest.typedChars - latest.backspaceCount) /
//               latest.typedChars) *
//               100
//           )
//         : 0;

//     const errorRate = latest.backspaceCount;

//     const trend = sessions.map(s => s.typingSpeed);

//     const ml = await MLResult.findOne({
//       userId: req.user.userId,
//       sessionId: latest._id
//     });

//     res.json({
//       wpm: latest.typingSpeed,
//       accuracy,
//       errorRate,
//       duration: latest.sessionTime + " sec",
//       trend,
//       cluster: ml ? ml.cluster : "Pending"
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "Dashboard load failed"
//     });
//   }
// };
exports.getDashboardSummary = async (req, res) => {
  try {

    const sessions = await Session.find({
      userId: req.user.userId
    }).sort({ createdAt: 1 });

    console.log(`Found ${sessions.length} sessions for user ${req.user.userId}`);
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

    const latest = sessions[totalSessions - 1];

    const accuracy =
      latest.typedChars > 0
        ? Math.round(
          ((latest.typedChars - latest.backspaceCount) / latest.typedChars) * 100
        )
        : 0;

    const pasteRatio =
      (latest.typedChars + (latest.pasteCharacters || 0)) > 0
        ? Math.round(((latest.pasteCharacters || 0) / (latest.typedChars + (latest.pasteCharacters || 0))) * 100) + "%"
        : "0%";

    // Standard Typing speed (WPM) = CPS * 12 (assuming 5 chars/word)
    const trend = sessions.map(s => Math.round(s.typingSpeed * 12));

    // Session analysis retrieval refactored below fallback logic

    const typingScore = latest.typedChars || 0;
    const deletionScore = (latest.backspaceCount || 0) * 1.5;
    const reviewingScore = (latest.cursorMoveCount || 0) * 0.5;
    const idleScore = Math.max(0, latest.sessionTime - (latest.typedChars / 5));

    const total = typingScore + deletionScore + reviewingScore + idleScore || 1;

    // Focus Score: Calculated based on session length and distractions (file switches/idle time)
    // If no session time or typed chars, focus is 0. Otherwise it starts at 100 and decreases.
    const focusScore = total > 0 
      ? Math.min(100, Math.max(0, 100 - (latest.fileSwitchCount * 5) - ((idleScore / total) * 100)))
      : 0;
    
    // Consistency: Proportional to typed characters vs pause time. 0 if no typing.
    const consistencyScore = latest.typedChars > 0 
      ? Math.min(100, Math.max(0, 100 - (latest.avgPauseTime * 15))) 
      : 0;
    
    // Memory/Logic: Proportional to activity. No activity = 0.
    const memoryScore = latest.saveCount > 0 
      ? Math.min(100, Math.max(0, 50 + (latest.saveCount * 10) - (latest.backspaceCount / 5))) 
      : 0;
    const logicScore = latest.cursorMoveCount > 0 
      ? Math.min(100, Math.max(0, 40 + (latest.cursorMoveCount / 10) + (accuracy / 2))) 
      : 0;

    // Detailed Metrics
    const keypressLatency = latest.typingSpeed > 0 ? Math.round(1000 / latest.typingSpeed) : 0; // ms per char (1000 / CPS)
    const errorRate = latest.typedChars > 0 ? ((latest.backspaceCount / latest.typedChars) * 100).toFixed(1) + "%" : "0%";

    // Cluster Meaning Mapping (Synchronized with ML service clusters)
    const clusterMap = {
      0: { coding: 75, debugging: 15, planning: 10, meaning: "Systematic Thinker" },
      1: { coding: 55, debugging: 20, planning: 25, meaning: "Creative Coder" },
      2: { coding: 45, debugging: 40, planning: 15, meaning: "Analytical Processor" },
      3: { coding: 65, debugging: 10, planning: 25, meaning: "Intuitive Developer" },
      4: { coding: 50, debugging: 20, planning: 30, meaning: "Methodical Planner" },
    };

    // Try finding ML result for the latest session first
    let ml = await MLResult.findOne({ sessionId: latest._id });

    // Fallback: If latest session has no analysis, find the most recent analysis for this user
    if (!ml) {
      console.log(`Latest session ${latest._id} has no ML result. Falling back to latest available for user ${req.user.userId}`);
      ml = await MLResult.findOne({ userId: req.user.userId }).sort({ createdAt: -1 });
    }

    const behaviour = ml && clusterMap[ml.cluster] 
      ? clusterMap[ml.cluster] 
      : { 
          coding: 60, 
          debugging: 25, 
          planning: 15, 
          meaning: ml ? "Analyzed Coder" : "Pending Analysis" 
        };

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

    // --- Comparison Logic ---
    const avgConsistency = sessions.length > 1 
      ? sessions.slice(0, -1).reduce((acc, s) => acc + (100 - (s.avgPauseTime * 15)), 0) / (sessions.length - 1)
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

    res.json({
      wpm: Math.round(latest.typingSpeed * 12),
      accuracy,
      pasteRatio,
      duration: latest.sessionTime + " sec",
      backspaces: latest.backspaceCount,
      avgPauseTime: Number((latest.avgPauseTime ?? 0).toFixed(1)),
      fileSwitches: latest.fileSwitchCount,
      saves: latest.saveCount,
      totalSessions,
      trend,
      cluster: ml ? ml.cluster : null,
      clusterMeaning: behaviour.meaning,
      confidence: ml ? 95 : 0, 
      activityTyping: Math.round((typingScore / total) * 100),
      activityDeletions: Math.round((deletionScore / total) * 100),
      activityReviewing: Math.round((reviewingScore / total) * 100),
      activityIdle: Math.round((idleScore / total) * 100),
      behaviourCoding: behaviour.coding,
      behaviourDebugging: behaviour.debugging,
      behaviourPlanning: behaviour.planning,
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
      sessionNarrative,
      comparisonNarrative
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

    const clusterMap = {
      0: "Systematic Thinker",
      1: "Creative Coder",
      2: "Analytical Processor",
      3: "Intuitive Developer",
      4: "Methodical Planner",
    };

    const formatted = history.map(item => ({
      date: item.createdAt,
      project: item.projectId?.name,
      duration: item.sessionId?.sessionTime,
      wpm: item.sessionId?.typingSpeed,
      backspaces: item.sessionId?.backspaceCount,
      cluster: item.cluster,
      clusterMeaning: item.clusterMeaning || (clusterMap[item.cluster] ?? "Analyzed Coder")
    }));

    res.json(formatted);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to load cognitive history"
    });
  }
};