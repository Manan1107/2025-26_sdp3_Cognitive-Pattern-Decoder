const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const MLResult = require("../models/MLResult.model");
const Session = require("../models/Session.model");


// REGISTER — auto-login by returning token + user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash: hashedPassword });
    await user.save();

    // Return a token so the frontend can log in immediately
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

// LOGIN — JWT CREATED HERE
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};
// 🔍 Compare a user with overall averages
exports.compareUser = async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ error: "Email query is required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user's sessions
    const userSessions = await Session.find({ userId: user._id });

    if (userSessions.length === 0) {
      return res.status(404).json({ error: "No session data for this user" });
    }

    // Calculate user averages
    const avg = (arr, key) =>
      arr.reduce((sum, item) => sum + (item[key] || 0), 0) / arr.length;

    const userStats = {
      typingSpeed: avg(userSessions, "typingSpeed"),
      backspaceCount: avg(userSessions, "backspaceCount"),
      avgPauseTime: avg(userSessions, "avgPauseTime"),
      sessionTime: avg(userSessions, "sessionTime")
    };

    // Get overall averages
    const allSessions = await Session.find();

    const overallStats = {
      typingSpeed: avg(allSessions, "typingSpeed"),
      backspaceCount: avg(allSessions, "backspaceCount"),
      avgPauseTime: avg(allSessions, "avgPauseTime"),
      sessionTime: avg(allSessions, "sessionTime")
    };

    res.json({
      user: user.email,
      userStats,
      overallStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to compare user" });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ error: "User not found" });
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.settings) {
      const newSettings = typeof req.body.settings === 'string' 
        ? JSON.parse(req.body.settings) 
        : req.body.settings;
      
      user.settings = {
        ...user.settings,
        ...newSettings
      };
    }

    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json({
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      settings: user.settings
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};