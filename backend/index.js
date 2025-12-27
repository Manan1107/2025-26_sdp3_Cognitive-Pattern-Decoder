const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/codingDB')
  .then(() => console.log("MongoDB connected"));

const SessionSchema = new mongoose.Schema({
  typingCount: Number,
  backspaceCount: Number,
  pasteCount: Number,
  pasteChars: Number,
  avgPause: Number,
  label: String
});

const Session = mongoose.model("Session", SessionSchema);

app.post('/session', async (req, res) => {
  const data = new Session(req.body);
  await data.save();
  res.json({ success: true });
});

app.get('/sessions', async (req, res) => {
  const data = await Session.find();
  res.json(data);
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
