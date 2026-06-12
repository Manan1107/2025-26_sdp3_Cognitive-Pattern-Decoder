import { useEffect, useState } from "react";
import axios from "../api/axios";

const DIFFICULTY_COLORS = {
  Easy: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", text: "#10b981" },
  Medium: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", text: "#f59e0b" },
  Hard: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", text: "#ef4444" },
};

const METRIC_ICONS = {
  Accuracy: "🎯",
  Focus: "🧘",
  Speed: "⚡",
  Consistency: "📈",
  Logic: "🔮",
  Memory: "🧠",
};

export default function DailyChallenge() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchChallenge();
  }, []);

  const fetchChallenge = async () => {
    try {
      const res = await axios.get("/challenges/today");
      setChallenge(res.data);
    } catch (_) {
      setChallenge(null);
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async () => {
    if (!challenge || challenge.isCompleted || completing) return;
    setCompleting(true);
    try {
      const res = await axios.post(`/challenges/${challenge._id}/complete`);
      setChallenge(res.data.challenge);
    } catch (_) {
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          background: "rgba(99,102,241,0.05)",
          border: "1px solid rgba(99,102,241,0.15)",
          borderRadius: "14px",
          padding: "20px",
          animation: "pulse 1.5s ease infinite",
        }}
      >
        <div style={{ height: "10px", width: "40%", borderRadius: "5px", background: "rgba(99,102,241,0.15)", marginBottom: "10px" }} />
        <div style={{ height: "14px", width: "70%", borderRadius: "5px", background: "rgba(99,102,241,0.1)" }} />
      </div>
    );
  }

  if (!challenge) return null;

  const diff = DIFFICULTY_COLORS[challenge.difficulty] || DIFFICULTY_COLORS.Medium;
  const metricIcon = METRIC_ICONS[challenge.targetMetric] || "🎯";

  return (
    <div
      id="daily-challenge-card"
      style={{
        background: challenge.isCompleted
          ? "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.04))"
          : "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))",
        border: `1px solid ${challenge.isCompleted ? "rgba(16,185,129,0.25)" : "rgba(99,102,241,0.2)"}`,
        borderRadius: "14px",
        padding: "18px 20px",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      {/* Completed overlay shimmer */}
      {challenge.isCompleted && (
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "linear-gradient(135deg, rgba(16,185,129,0.04), transparent)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>🎯</span>
          <p style={{ margin: 0, fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#818cf8" }}>
            Today's Challenge
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {/* Target metric badge */}
          <span style={{ fontSize: "12px" }}>{metricIcon}</span>
          <span
            style={{
              fontSize: "9px",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#6366f1",
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "20px",
              padding: "2px 8px",
            }}
          >
            {challenge.targetMetric}
          </span>

          {/* Difficulty badge */}
          <span
            style={{
              fontSize: "9px",
              fontWeight: 700,
              textTransform: "uppercase",
              color: diff.text,
              background: diff.bg,
              border: `1px solid ${diff.border}`,
              borderRadius: "20px",
              padding: "2px 8px",
            }}
          >
            {challenge.difficulty}
          </span>
        </div>
      </div>

      {/* Challenge title */}
      <p
        style={{
          margin: "0 0 8px",
          fontSize: "15px",
          fontWeight: 800,
          color: challenge.isCompleted ? "#10b981" : "#f8fafc",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {challenge.isCompleted && "✅ "}
        {challenge.title}
      </p>

      {/* Challenge description */}
      <p
        style={{
          margin: "0 0 14px",
          fontSize: "12px",
          color: "#94a3b8",
          lineHeight: 1.6,
        }}
      >
        {challenge.description}
      </p>

      {/* Complete button */}
      {!challenge.isCompleted ? (
        <button
          id="challenge-complete-btn"
          onClick={markComplete}
          disabled={completing}
          style={{
            width: "100%",
            padding: "9px",
            borderRadius: "10px",
            background: completing
              ? "rgba(99,102,241,0.3)"
              : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            border: "none",
            cursor: completing ? "not-allowed" : "pointer",
            fontSize: "12px",
            fontWeight: 700,
            color: "#fff",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          {completing ? (
            <>⏳ Saving...</>
          ) : (
            <>✅ Mark as Complete</>
          )}
        </button>
      ) : (
        <div
          style={{
            padding: "8px",
            borderRadius: "10px",
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.2)",
            textAlign: "center",
            fontSize: "12px",
            color: "#10b981",
            fontWeight: 700,
          }}
        >
          🎉 Challenge completed today!
        </div>
      )}
    </div>
  );
}
