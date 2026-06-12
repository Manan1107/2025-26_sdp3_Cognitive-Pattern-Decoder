import { useState, useEffect, useRef, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const BOT_AVATAR = "🤖";
const USER_AVATAR = "👤";

const STARTER_QUESTIONS = [
  "How was my session today?",
  "What is my cognitive pattern?",
  "How can I improve my focus?",
  "Give me a coding tip",
  "What's my strongest trait?",
];

export default function ChatBot() {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat history on first open
  useEffect(() => {
    if (isOpen && !hasLoaded) {
      loadHistory();
      setHasLoaded(true);
    }
  }, [isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const loadHistory = async () => {
    try {
      const res = await axios.get("/chat/history");
      if (res.data && res.data.length > 0) {
        setMessages(res.data.map((m) => ({ role: m.role, content: m.content })));
      } else {
        // Welcome message when no history
        setMessages([
          {
            role: "assistant",
            content: `Hey ${user?.name || "there"}! 👋 I'm your AI Coding Coach. I know your coding stats and patterns — ask me anything! Try one of the quick questions below.`,
          },
        ]);
      }
    } catch (_) {
      setMessages([
        {
          role: "assistant",
          content: "Hi! I'm your AI Coding Coach. How can I help you today?",
        },
      ]);
    }
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || isThinking) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setIsThinking(true);

    try {
      const res = await axios.post("/chat/message", { message: msg });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch (_) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having a moment. Please try again shortly!",
        },
      ]);
    } finally {
      setIsThinking(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const clearChat = async () => {
    try {
      await axios.delete("/chat/history");
      setMessages([
        {
          role: "assistant",
          content: "Chat cleared! What would you like to talk about?",
        },
      ]);
    } catch (_) {}
  };

  if (!user) return null;

  return (
    <>
      {/* ── Floating Bubble ────────────────────────────── */}
      <button
        id="chatbot-toggle"
        onClick={() => setIsOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(99,102,241,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          zIndex: 1000,
          transition: "transform 0.2s, box-shadow 0.2s",
          transform: isOpen ? "scale(0.92)" : "scale(1)",
        }}
        title="AI Coding Coach"
      >
        {isOpen ? "✕" : "🤖"}
      </button>

      {/* ── Chat Panel ─────────────────────────────────── */}
      {isOpen && (
        <div
          id="chatbot-panel"
          style={{
            position: "fixed",
            bottom: "92px",
            right: "24px",
            width: "360px",
            maxHeight: "520px",
            borderRadius: "16px",
            background: "rgba(15, 23, 42, 0.97)",
            border: "1px solid rgba(99,102,241,0.3)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
            display: "flex",
            flexDirection: "column",
            zIndex: 999,
            overflow: "hidden",
            backdropFilter: "blur(20px)",
            animation: "slideUp 0.2s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))",
              borderBottom: "1px solid rgba(99,102,241,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>🤖</span>
              <div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#f8fafc" }}>
                  AI Coding Coach
                </p>
                <p style={{ margin: 0, fontSize: "10px", color: "#818cf8" }}>
                  Powered by Gemini · Knows your data
                </p>
              </div>
            </div>
            <button
              onClick={clearChat}
              style={{
                background: "none",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                fontSize: "11px",
                padding: "4px 8px",
                borderRadius: "6px",
                transition: "color 0.2s",
              }}
              title="Clear chat history"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "16px", flexShrink: 0 }}>
                  {msg.role === "user" ? USER_AVATAR : BOT_AVATAR}
                </span>
                <div
                  style={{
                    maxWidth: "78%",
                    padding: "9px 12px",
                    borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                        : "rgba(30, 41, 59, 0.8)",
                    border: msg.role === "user" ? "none" : "1px solid rgba(99,102,241,0.15)",
                    fontSize: "12px",
                    lineHeight: "1.55",
                    color: msg.role === "user" ? "#fff" : "#cbd5e1",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>{BOT_AVATAR}</span>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "14px 14px 14px 4px",
                    background: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid rgba(99,102,241,0.15)",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#818cf8",
                        animation: `bounce 1.2s ${i * 0.2}s infinite`,
                        display: "inline-block",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Starter questions */}
          {messages.length <= 1 && (
            <div
              style={{
                padding: "0 12px 8px",
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  style={{
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    borderRadius: "20px",
                    padding: "4px 10px",
                    fontSize: "10px",
                    color: "#818cf8",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            style={{
              padding: "10px 12px",
              borderTop: "1px solid rgba(99,102,241,0.15)",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <input
              ref={inputRef}
              id="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask your coach anything..."
              disabled={isThinking}
              style={{
                flex: 1,
                background: "rgba(30, 41, 59, 0.6)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "10px",
                padding: "8px 12px",
                fontSize: "12px",
                color: "#f8fafc",
                outline: "none",
                transition: "border-color 0.2s",
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={isThinking || !input.trim()}
              id="chatbot-send"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: input.trim() && !isThinking
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "rgba(30,41,59,0.6)",
                border: "none",
                cursor: input.trim() && !isThinking ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        #chatbot-panel::-webkit-scrollbar { width: 4px; }
        #chatbot-panel::-webkit-scrollbar-track { background: transparent; }
        #chatbot-panel::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 2px; }
      `}</style>
    </>
  );
}
