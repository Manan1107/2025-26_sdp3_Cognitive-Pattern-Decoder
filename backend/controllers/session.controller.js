const Session = require("../models/Session.model");

exports.createSession = async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();

    res.status(201).json({
      message: "Session stored successfully"
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to store session"
    });
  }
};

exports.getSessionsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const sessions = await Session.find({ projectId });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

exports.getSessionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const sessions = await Session.find({ userId });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};
