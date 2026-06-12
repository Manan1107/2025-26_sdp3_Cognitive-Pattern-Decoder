const MOOD_CONFIG = {
  Flow: {
    emoji: "🌊",
    gradient: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.08))",
    border: "rgba(6,182,212,0.3)",
    color: "#06b6d4",
    label: "Deep Flow",
    tip: "You were in the zone. Schedule more sessions like this.",
  },
  Energetic: {
    emoji: "⚡",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.06))",
    border: "rgba(245,158,11,0.3)",
    color: "#f59e0b",
    label: "Peak Performance",
    tip: "High energy session. Take on complex problems next time.",
  },
  Frustrated: {
    emoji: "😤",
    gradient: "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(220,38,38,0.06))",
    border: "rgba(239,68,68,0.25)",
    color: "#ef4444",
    label: "Struggling Session",
    tip: "Tough session detected. Take a break and revisit the problem.",
  },
  Exploring: {
    emoji: "🧐",
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(99,102,241,0.06))",
    border: "rgba(139,92,246,0.25)",
    color: "#8b5cf6",
    label: "Research Mode",
    tip: "You were exploring. Good for learning unfamiliar concepts.",
  },
  Tired: {
    emoji: "😴",
    gradient: "linear-gradient(135deg, rgba(100,116,139,0.12), rgba(71,85,105,0.06))",
    border: "rgba(100,116,139,0.25)",
    color: "#94a3b8",
    label: "Fatigue Detected",
    tip: "Low energy detected. Rest before your next session.",
  },
};

/**
 * MoodCard — shows the AI-detected mood for the latest session
 * Props: mood (string), description (string)
 */
export default function MoodCard({ mood, description }) {
  if (!mood) return null;

  const config = MOOD_CONFIG[mood] || {
    emoji: "🧠",
    gradient: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))",
    border: "rgba(99,102,241,0.2)",
    color: "#6366f1",
    label: mood,
    tip: "Session analyzed.",
  };

  return (
    <div
      id="mood-card"
      style={{
        background: config.gradient,
        border: `1px solid ${config.border}`,
        borderRadius: "14px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pulse */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: config.gradient,
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />

      {/* Emoji */}
      <div
        style={{
          fontSize: "40px",
          lineHeight: 1,
          flexShrink: 0,
          filter: `drop-shadow(0 0 10px ${config.color}88)`,
          animation: "moodPulse 3s ease infinite",
        }}
      >
        {config.emoji}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: config.color,
            }}
          >
            Session Mood
          </p>
          <div
            style={{
              height: "4px",
              width: "4px",
              borderRadius: "50%",
              background: config.color,
              animation: "blink 1.5s ease infinite",
            }}
          />
        </div>

        <p
          style={{
            margin: "0 0 4px",
            fontSize: "16px",
            fontWeight: 800,
            color: "#f8fafc",
          }}
        >
          {config.label}
        </p>

        <p
          style={{
            margin: "0 0 6px",
            fontSize: "11px",
            color: "#94a3b8",
            lineHeight: 1.5,
          }}
        >
          {description || config.tip}
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "10px",
            color: config.color,
            fontStyle: "italic",
            opacity: 0.85,
          }}
        >
          💡 {config.tip}
        </p>
      </div>

      <style>{`
        @keyframes moodPulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.05) rotate(3deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
