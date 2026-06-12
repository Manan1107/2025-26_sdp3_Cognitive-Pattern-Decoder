import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { io } from "socket.io-client";
import { Toaster, toast } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Layout from "./components/layout/Layout";
import SessionAnalysis from "./pages/SessionAnalysis";
import CompareUser from "./pages/CompareUser";
import Notifications from "./pages/Notifications";
import About from "./pages/About";
import ChatBot from "./components/ChatBot";

function App() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    // Connect to Backend WebSocket
    const socket = io("https://cognitive-backend-2cs1.onrender.com");

    // Join user's private room
    socket.emit("join", user._id || user.userId || user.id);

    // Listen for incoming notifications
    socket.on("new_notification", (notif) => {
      // Show beautiful popup notification
      toast(notif.message, {
        icon: notif.type === "focus" ? "🎯" : notif.type === "distraction" ? "🚨" : "🥱",
        style: {
          borderRadius: '10px',
          background: '#1e293b',
          color: '#fff',
          border: '1px solid #334155',
        },
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      {/* AI Chatbot — visible on all pages when logged in */}
      {user && <ChatBot />}
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />

        {user && (
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analysis" element={<SessionAnalysis />} />
            <Route path="compare" element={<CompareUser />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="about" element={<About />} />
          </Route>
        )}

        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;