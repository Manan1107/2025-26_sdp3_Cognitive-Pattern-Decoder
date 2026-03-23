const Notification = require("../models/Notification.model");

async function checkAndCreateNotification(session, cluster) {
  const User = require("../models/User.model");
  const user = await User.findById(session.userId);
  if (!user || !user.settings || !user.settings.notificationsEnabled) return;

  const { settings } = user;

  // 🔴 DISTRACTION
  if (settings.distractionAlerts && cluster === 2 && session.fileSwitchCount > 15) {
    await Notification.create({
      userId: session.userId,
      type: "distraction",
      message: "You seem distracted with frequent file switching."
    });
  }

  // 🟡 FATIGUE
  if (settings.fatigueAlerts && session.sessionTime > 3600 && session.typingSpeed < 25) {
    await Notification.create({
      userId: session.userId,
      type: "fatigue",
      message: "Long session detected. Consider taking a break."
    });
  }

  // 🔵 FOCUS
  if (settings.focusCelebrations && cluster === 0 && session.backspaceCount < 10) {
    await Notification.create({
      userId: session.userId,
      type: "focus",
      message: "Great focus! You're coding efficiently."
    });
  }
}

module.exports = { checkAndCreateNotification };
