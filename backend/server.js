const cors = require("cors");
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");
const notificationRoutes = require("./routes/notification.routes");
const authRoutes = require("./routes/auth.routes");
const sessionRoutes = require("./routes/session.routes");
const projectRoutes = require("./routes/project.routes");
const mlResultRoutes = require("./routes/mlresult.routes");
const historyRoutes = require("./routes/history.routes");
const analysisRoutes = require("./routes/analysis.routes");
const chatRoutes = require("./routes/chat.routes");
const streakRoutes = require("./routes/streak.routes");
const challengeRoutes = require("./routes/challenge.routes");
const app = express();
app.use(cors({
  origin: true,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.set("trust proxy", 1);

// Create HTTP Server & Initialize Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Attach io to the Express app so other controllers/services can use it
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`🔌 New WebSocket connection: ${socket.id}`);
  
  // Client tells us their userId so we can send them private notifications
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 Socket ${socket.id} joined private room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// DB
connectDB();

// Middleware
app.use(helmet());
app.use(express.json());
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  if (req.params) mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  if (req.query) mongoSanitize.sanitize(req.query, { replaceWith: '_' });
  next();
});
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/mlresults", mlResultRoutes);
app.use("/api/history", historyRoutes);
app.use("/api", notificationRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/streaks", streakRoutes);
app.use("/api/challenges", challengeRoutes);

// Test Notification Endpoint (No Auth required for demo)
app.post("/api/test-notification", async (req, res) => {
  const Notification = require("./models/Notification.model");
  // Hardcoded to test user ID from logs
  const userId = "6973a0680b205d4512cc78ee";
  const notif = await Notification.create({
    userId: userId,
    type: "focus",
    message: "🚀 Real-time sockets are working perfectly! Keep it up!"
  });
  const io = req.app.get("io");
  if (io) {
    io.to(userId).emit("new_notification", notif);
  }
  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.send("Cognitive Pattern Decoder Backend Running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

//testing extension connection with backend
//test connection with NGROK