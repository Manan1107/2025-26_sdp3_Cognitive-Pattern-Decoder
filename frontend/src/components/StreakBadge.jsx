import { useEffect, useState } from "react";
import axios from "../api/axios";

const MILESTONE_MESSAGES = {
  3: "3-day streak! Habit forming! 🌱",
  7: "1 week streak! Incredible! 🔥",
  14: "2 week streak! On fire! 💥",
  30: "30-day streak! Legendary! 🏆",
  60: "60-day streak! Unstoppable! 👑",
  100: "100-day streak! Hall of Fame! 🌟",
};

export default function StreakBadge() {
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/streaks/me")
      .then((r) => setStreak(r.data))
      .catch(() => setStreak(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !streak) return null;

  const current = streak.currentStreak || 0;
  const longest = streak.longestStreak || 0;
  const totalDays = streak.totalDaysActive || 0;

  // Next milestone
  const MILESTONES = [3, 7, 14, 30, 60, 100];
  const nextMilestone = MILESTONES.find((m) => m > current) || 100;
  const progress = Math.min(100, Math.round((current / nextMilestone) * 100));

  // Flame color based on streak length
  const flameColor =
    current >= 30 ? "#f59e0b" : current >= 7 ? "#f97316" : "#ef4444";

  const specialMessage = MILESTONE_MESSAGES[current] || null;

  return (
    <div
      id="streak-badge"
      style={{
        background: `linear-gradient(135deg, rgba(239,68,68,0.08), rgba(249,115,22,0.06))`,
        border: `1px solid rgba(239,68,68,0.2)`,
        borderRadius: "14px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${flameColor}22, transparent)`,
          pointerEvents: "none",
        }}
      />

      {/* Flame icon */}
      <div
        style={{
          fontSize: "36px",
          lineHeight: 1,
          filter: current > 0 ? "drop-shadow(0 0 8px rgba(239,68,68,0.6))" : "grayscale(1)",
          animation: current > 0 ? "pulse 2s ease infinite" : "none",
          flexShrink: 0,
        }}
      >
        🔥
      </div>

      {/* Main info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "2px" }}>
          <span
            style={{
              fontSize: "28px",
              fontWeight: 900,
              color: flameColor,
              lineHeight: 1,
            }}
          >
            {current}
          </span>
          <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>
            day{current !== 1 ? "s" : ""} streak
          </span>
        </div>

        {specialMessage && (
          <p style={{ margin: "0 0 6px", fontSize: "11px", color: flameColor, fontWeight: 700 }}>
            {specialMessage}
          </p>
        )}

        {/* Progress to next milestone */}
        <div style={{ marginTop: "6px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "9px",
              color: "#64748b",
              marginBottom: "4px",
            }}
          >
            <span>{current} days</span>
            <span>Next: {nextMilestone} days</span>
          </div>
          <div
            style={{
              height: "4px",
              borderRadius: "2px",
              background: "rgba(239,68,68,0.12)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                borderRadius: "2px",
                background: `linear-gradient(90deg, #ef4444, ${flameColor})`,
                transition: "width 0.6s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats column */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "#f8fafc" }}>
            {longest}
          </p>
          <p style={{ margin: 0, fontSize: "9px", color: "#64748b", fontWeight: 600 }}>
            BEST
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "#f8fafc" }}>
            {totalDays}
          </p>
          <p style={{ margin: 0, fontSize: "9px", color: "#64748b", fontWeight: 600 }}>
            TOTAL
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
