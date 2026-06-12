const { getStreak } = require("../services/streak.service");

// GET /api/streaks/me
exports.getMyStreak = async (req, res) => {
  try {
    const data = await getStreak(req.user.userId);
    return res.json(data);
  } catch (error) {
    console.error("Streak fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch streak" });
  }
};
