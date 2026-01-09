// 



//------------------------------------------->>>>>>>>>>>>>>>>>
// const express = require("express");
// const connectDB = require("./config/db");

// const app = express();
// connectDB();

// app.use(express.json());

// app.use("/api/sessions", require("./routes/session.routes"));

// const PORT = 5000;
// app.listen(PORT, () =>
//   console.log(`🚀 Server running on port ${PORT}`)
// );
////_------------------------------------------>>>>>>>>>>>>>>>>>>>>
const express = require("express");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const sessionRoutes = require("./routes/session.routes");
const mlResultRoutes = require("./routes/mlresult.routes");

const app = express();

// 1️⃣ Connect to MongoDB
connectDB();

// 2️⃣ Built-in middleware to parse JSON
app.use(express.json());

// 3️⃣ Register routes
app.use("/api/auth", authRoutes);         // Register / Login
app.use("/api/projects", projectRoutes);  // Project (task) APIs
app.use("/api/sessions", sessionRoutes);  // Session data (DATASET)
app.use("/api/mlresults", mlResultRoutes);// ML output

// 4️⃣ Health check route (optional but useful)
app.get("/", (req, res) => {
  res.send("Cognitive Coding Decoder Backend is running");
});


// 5️⃣ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
