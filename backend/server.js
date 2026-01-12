require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const sessionRoutes = require("./routes/session.routes");
const projectRoutes = require("./routes/project.routes");
const mlResultRoutes = require("./routes/mlresult.routes");

const app = express();

// DB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/mlresults", mlResultRoutes);

app.get("/", (req, res) => {
  res.send("Cognitive Pattern Decoder Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
