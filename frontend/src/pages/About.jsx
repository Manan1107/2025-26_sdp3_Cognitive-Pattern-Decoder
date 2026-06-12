import {
  Brain, Zap, Target, BarChart2, Bot, Flame, Download,
  Monitor, Code2, Bug, Lightbulb, Compass, Puzzle,
  ArrowRight, Sparkles, TrendingUp, Shield, Users
} from "lucide-react";

const cognitiveTypes = [
  {
    name: "Systematic Thinker",
    icon: Puzzle,
    color: "#3b82f6",
    description: "Highly structured, precise coder. You plan before you type, resulting in low error rates and steady output. Your code is clean and well-organized.",
    traits: ["High Accuracy", "Low Backspaces", "Steady Pace", "Planned Execution"],
  },
  {
    name: "Creative Coder",
    icon: Lightbulb,
    color: "#f59e0b",
    description: "Fast, fluid, and intuitive. You type rapidly with creative problem-solving instincts. Occasional bursts of edits show your experimental nature.",
    traits: ["High Speed", "Fluid Typing", "Creative Flow", "Rapid Iteration"],
  },
  {
    name: "Analytical Processor",
    icon: Bug,
    color: "#ef4444",
    description: "Debug-heavy and methodical. You spend time deeply analyzing code, with high debugging activity and careful step-by-step troubleshooting.",
    traits: ["Debug Focused", "Methodical", "Deep Analysis", "Problem Solver"],
  },
  {
    name: "Intuitive Developer",
    icon: Compass,
    color: "#10b981",
    description: "You navigate code freely and explore solutions naturally. Quick decisions with minimal debugging — your instincts guide your development flow.",
    traits: ["Quick Decisions", "Low Debug", "Free Navigation", "Natural Flow"],
  },
  {
    name: "Methodical Planner",
    icon: Target,
    color: "#8b5cf6",
    description: "Balanced approach with extensive planning before execution. Moderate speed with high consistency — you think deeply, then implement precisely.",
    traits: ["Balanced", "High Consistency", "Deep Planning", "Precise Output"],
  },
];

const steps = [
  {
    step: "1",
    title: "Install the VS Code Extension",
    description: "Download the .vsix file from the sidebar and install it in VS Code via Extensions → Install from VSIX.",
    icon: Download,
    color: "#3b82f6",
  },
  {
    step: "2",
    title: "Login & Select Project",
    description: "Run 'Cognitive Decoder: Login' from the Command Palette (Cmd+Shift+P), then select or create a project.",
    icon: Shield,
    color: "#10b981",
  },
  {
    step: "3",
    title: "Code Naturally",
    description: "Just code as you normally would. The extension silently tracks your typing patterns, pauses, file switches, and AI suggestion usage.",
    icon: Code2,
    color: "#f59e0b",
  },
  {
    step: "4",
    title: "End Session & Analyze",
    description: "When done, run 'End Session' or wait for auto-submit. Your data is analyzed by our ML model and AI to decode your cognitive pattern.",
    icon: Brain,
    color: "#8b5cf6",
  },
];

const features = [
  { icon: BarChart2, title: "Real-Time Dashboard", desc: "WPM, accuracy, focus score, AI dependency — all updated live.", color: "#3b82f6" },
  { icon: Brain, title: "ML Pattern Detection", desc: "K-Means clustering identifies your cognitive coding type.", color: "#8b5cf6" },
  { icon: Sparkles, title: "AI Mood Detection", desc: "Detects if you're in Flow, Frustrated, Exploring, Energetic, or Tired.", color: "#f59e0b" },
  { icon: Flame, title: "Streak Tracker", desc: "Track consecutive coding days. Hit milestones at 3, 7, 14, 30 days.", color: "#ef4444" },
  { icon: Bot, title: "AI Coding Coach", desc: "Personalized chatbot that knows your real data and gives targeted advice.", color: "#10b981" },
  { icon: TrendingUp, title: "Daily Challenges", desc: "AI generates challenges targeting your weakest skill every day.", color: "#ec4899" },
  { icon: Monitor, title: "Project Analytics", desc: "Filter your dashboard by project to compare performance across codebases.", color: "#06b6d4" },
  { icon: Users, title: "Peer Compare", desc: "See how your patterns compare to other developers on the platform.", color: "#f97316" },
];

export default function About() {
  return (
    <div className="page-shell slide-up">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
          <Brain size={14} className="text-accent" />
          <span className="text-xs font-bold text-accent uppercase tracking-widest">Cognitive Pattern Decoder</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-textPrimary mb-4 leading-tight">
          Decode Your <span style={{ color: "#818cf8" }}>Coding Mind</span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto text-base leading-relaxed">
          A VS Code extension + AI-powered dashboard that tracks your real-time coding behaviour,
          identifies your cognitive pattern using Machine Learning, and coaches you to become a better developer.
        </p>
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-textPrimary mb-6 flex items-center gap-2">
          <Zap size={18} className="text-accent" /> How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => (
            <div key={s.step} className="glass-card p-5 relative overflow-hidden group hover:border-accent/40 transition-all duration-300">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 font-black text-lg"
                style={{ background: `${s.color}22`, color: s.color }}
              >
                {s.step}
              </div>
              <h3 className="text-sm font-bold text-textPrimary mb-2">{s.title}</h3>
              <p className="text-xs text-textSecondary leading-relaxed">{s.description}</p>
              <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <s.icon size={48} style={{ color: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-textPrimary mb-6 flex items-center gap-2">
          <Sparkles size={18} className="text-accent" /> Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="metric-card group hover:border-accent/30 transition-all duration-300">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${f.color}22` }}
              >
                <f.icon size={18} style={{ color: f.color }} />
              </div>
              <p className="text-sm font-bold text-textPrimary mb-1">{f.title}</p>
              <p className="text-[11px] text-textSecondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cognitive Types */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-textPrimary mb-2 flex items-center gap-2">
          <Brain size={18} className="text-accent" /> The 5 Cognitive Coding Types
        </h2>
        <p className="text-xs text-textSecondary mb-6">Our ML model classifies you into one of these patterns based on your real coding behaviour.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cognitiveTypes.map((t) => (
            <div
              key={t.name}
              className="glass-card p-5 hover:border-accent/40 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${t.color}22` }}
                >
                  <t.icon size={20} style={{ color: t.color }} />
                </div>
                <h3 className="text-sm font-bold" style={{ color: t.color }}>{t.name}</h3>
              </div>
              <p className="text-xs text-textSecondary leading-relaxed mb-3">{t.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {t.traits.map((trait) => (
                  <span
                    key={trait}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${t.color}15`, color: t.color }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Explained */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-textPrimary mb-6 flex items-center gap-2">
          <BarChart2 size={18} className="text-accent" /> What Each Metric Means
        </h2>
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {[
              ["WPM (Words Per Minute)", "How fast you type code, calculated from characters per second."],
              ["Accuracy Rate", "Percentage of typed characters that weren't deleted — fewer backspaces = higher accuracy."],
              ["Focus Score", "Measures how deeply focused you are — penalized by file switching and idle time."],
              ["Consistency Score", "How steady your coding rhythm is — long pauses reduce this score."],
              ["AI Dependency", "How often you accept AI-generated code suggestions (Copilot, Tabnine, etc.)."],
              ["Suggestion Accuracy", "Of the AI suggestions you accepted, how many did you keep without editing?"],
              ["Paste Ratio", "Percentage of your code that was pasted vs. manually typed."],
              ["Session Mood", "AI-detected emotional state during your coding session (Flow, Frustrated, etc.)."],
            ].map(([title, desc]) => (
              <div key={title} className="flex items-start gap-3">
                <ArrowRight size={14} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-textPrimary">{title}</p>
                  <p className="text-[11px] text-textSecondary">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-cardBorder">
        <p className="text-xs text-textMuted">
          Built with ❤️ using React, Node.js, MongoDB, Python ML, and Groq AI
        </p>
      </div>
    </div>
  );
}
