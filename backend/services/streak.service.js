/**
 * streak.service.js
 * ─────────────────────────────────────────────
 * Updates a user's coding streak whenever a
 * session ends. Called from session.controller.
 * ─────────────────────────────────────────────
 */

const Streak = require("../models/Streak.model");

const MILESTONES = [3, 7, 14, 30, 60, 100];

/**
 * Updates the user's streak record.
 * @param {string} userId
 * @returns {{ currentStreak, longestStreak, isNewRecord, milestone }}
 */
async function updateStreak(userId) {
  let streak = await Streak.findOne({ userId });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  if (!streak) {
    streak = await Streak.create({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastSessionDate: new Date(),
      totalDaysActive: 1,
    });
    return { currentStreak: 1, longestStreak: 1, isNewRecord: true, milestone: null };
  }

  const last = streak.lastSessionDate ? new Date(streak.lastSessionDate) : null;

  // Already logged today — don't double-count
  if (last && last >= todayStart) {
    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      isNewRecord: false,
      milestone: null,
    };
  }

  let newStreak;
  if (last && last >= yesterdayStart) {
    // Consecutive day
    newStreak = streak.currentStreak + 1;
  } else {
    // Streak broken — reset to 1
    newStreak = 1;
  }

  const newLongest = Math.max(streak.longestStreak, newStreak);
  const isNewRecord = newStreak > streak.longestStreak;

  // Check if hit a milestone
  const milestone = MILESTONES.includes(newStreak) ? newStreak : null;

  await Streak.updateOne(
    { userId },
    {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastSessionDate: new Date(),
      $inc: { totalDaysActive: 1 },
    }
  );

  return { currentStreak: newStreak, longestStreak: newLongest, isNewRecord, milestone };
}

/**
 * Gets a user's streak record (read-only)
 */
async function getStreak(userId) {
  const streak = await Streak.findOne({ userId });
  if (!streak) {
    return { currentStreak: 0, longestStreak: 0, totalDaysActive: 0, lastSessionDate: null };
  }
  return streak;
}

module.exports = { updateStreak, getStreak };
