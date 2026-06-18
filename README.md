# Cognitive Pattern Decoder

**SDP Project — Analyze how you code, not just what you code.**

Cognitive Pattern Decoder is a full-stack developer analytics platform that tracks coding behavior through a **VS Code extension**, analyzes sessions using **Machine Learning (K-Means clustering)**, and displays insights on a **React dashboard** with AI-powered mood detection and recommendations.

---

## Team

| Name | GitHub |
|------|--------|
| **Manan Javiya** | [@Manan1107](https://github.com/Manan1107) |
| **Maitrey Patel** | [@patelmaitrey68](https://github.com/patelmaitrey68) |

> This repository contains the latest collaborative version of the project.

---

## Problem Statement

Traditional coding metrics (lines of code, commits) don't reveal **how** a developer thinks while coding — their focus, accuracy, pauses, debugging habits, or AI tool dependency. Cognitive Pattern Decoder captures behavioral signals during live coding sessions and converts them into cognitive insights to help developers understand and improve their coding patterns.

---

## What It Does

1. **VS Code Extension** silently tracks typing speed, backspaces, pauses, file switches, paste events, debug runs, and AI suggestion usage while you code.
2. **Backend API** stores sessions, projects, and user data in MongoDB.
3. **ML Service** (Python FastAPI) runs K-Means clustering on session metrics to classify coding behavior into cognitive patterns.
4. **AI Service** (Groq / Llama) detects mood (Flow, Frustrated, Exploring, etc.), generates daily challenges, and powers the chatbot.
5. **React Dashboard** shows WPM, focus score, cognitive type, streaks, history, notifications, and user comparison.

---

## Architecture

```
┌─────────────────────┐
│  VS Code Extension  │  Tracks keystrokes, pauses, file switches
└──────────┬──────────┘
           │ HTTP + WebSocket
           ▼
┌─────────────────────┐
│   Node.js Backend   │  Express, JWT Auth, Socket.io, MongoDB
│   (REST API)        │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐  ┌──────────────┐
│ MongoDB │  │ ML Service   │  FastAPI + K-Means (Python)
│         │  │ /predict     │
└─────────┘  └──────────────┘
           │
           ▼
┌─────────────────────┐
│   React Dashboard   │  Charts, streaks, mood, history, chatbot
└─────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, Vite, Tailwind CSS, Chart.js, Socket.io Client |
| **Backend** | Node.js, Express, MongoDB (Mongoose), JWT, Socket.io |
| **ML Service** | Python, FastAPI, scikit-learn (K-Means), joblib |
| **VS Code Extension** | TypeScript, VS Code API, Socket.io Client |
| **AI** | Groq API (Llama 3.3 70B) — mood detection, chatbot, challenges |
| **Security** | Helmet, express-rate-limit, mongo-sanitize |

---

## Project Structure

```
cognitive-pattern-decoder/
├── frontend/           # React dashboard (Vite + Tailwind)
├── backend/            # Node.js Express API + Socket.io
├── ml-services/        # Python FastAPI ML prediction service
├── vs-code-extension/  # VS Code extension (TypeScript)
└── README.md
```

---

## Features

### VS Code Extension
- Login and project selection from Command Palette
- Tracks: typing speed, backspaces, paste count, pause time, file switches, scrolls, debug runs, terminal opens
- Tracks AI suggestion acceptance and post-accept edits
- Auto-submits session data to backend
- Real-time notifications via WebSocket

### Dashboard
- **Real-time metrics** — WPM, accuracy, focus score
- **Cognitive type detection** — Systematic Thinker, Creative Coder, Analytical Processor, etc.
- **AI mood detection** — Flow, Frustrated, Exploring, Energetic, Tired
- **Streak tracker** — consecutive coding days with milestones
- **Daily challenges** — AI-generated coding challenges
- **Session history** — past sessions with cluster labels
- **User comparison** — compare performance with other users
- **Chatbot** — AI assistant with user session context
- **Notifications** — real-time focus/distraction/fatigue alerts

### Machine Learning
- **Algorithm:** K-Means Clustering (3 clusters)
- **Input features:** typing speed, typed chars, backspace count, paste count, avg pause time, session time
- **Output:** Cognitive cluster label assigned to each session
- **Training:** `ml-services/train.py` fetches session data from MongoDB, preprocesses, trains, and saves model

---

## Cognitive Pattern Types

| Type | Traits |
|------|--------|
| **Systematic Thinker** | High accuracy, low backspaces, steady pace, planned execution |
| **Creative Coder** | High speed, fluid typing, creative flow, rapid iteration |
| **Analytical Processor** | Debug-focused, methodical, deep analysis |
| **Intuitive Developer** | Quick decisions, low debug activity, natural flow |
| **Methodical Planner** | Balanced, high consistency, deep planning |

---

## How to Run Locally

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB (local or Atlas)
- VS Code

### 1. Backend

```bash
cd backend
npm install
# Create .env with:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret
# GROQ_API_KEY=your_groq_api_key
npm run dev
```

Runs on: `http://localhost:5000`

### 2. ML Service

```bash
cd ml-services
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Runs on: `http://localhost:8000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on: `http://localhost:5173`

### 4. VS Code Extension

```bash
cd vs-code-extension
npm install
npm run compile
# Press F5 in VS Code to launch Extension Development Host
# Or package: vsce package → install .vsix file
```

Configure backend URL in VS Code settings: `cognitiveDecoder.backendUrl`

---

## API Endpoints (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, get JWT token |
| POST | `/api/sessions` | Submit coding session data |
| GET | `/api/sessions` | Get user sessions |
| POST | `/api/projects` | Create coding project |
| GET | `/api/mlresults` | Get ML cluster results |
| GET | `/api/history` | Session history |
| GET | `/api/analysis/:email` | User performance analysis |
| POST | `/api/chat` | AI chatbot |
| GET | `/api/streaks` | Coding streak data |
| GET | `/api/challenges` | Daily AI challenges |
| GET | `/api/notifications` | User notifications |

---

## ML Service Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/predict` | Predict cognitive cluster from session metrics |

**Input:**
```json
{
  "typingSpeed": 45.2,
  "typedChars": 1200,
  "backspaceCount": 30,
  "pasteCount": 2,
  "avgPauseTime": 1.5,
  "sessionTime": 3600
}
```

**Output:**
```json
{ "cluster": 1 }
```

---

## Environment Variables

### Backend (`backend/.env`)
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
PORT=5000
ML_SERVICE_URL=http://localhost:8000
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

## How a Session Works

1. Developer installs VS Code extension and logs in
2. Selects or creates a project
3. Codes normally — extension tracks behavioral metrics silently
4. On session end, extension sends metrics to backend
5. Backend forwards data to ML service → receives cluster label
6. AI service analyzes mood and generates insights
7. Dashboard updates with new session, cluster type, mood, and suggestions
8. Real-time notifications sent via Socket.io if focus drops

---

## Future Scope

- Fine-grained cognitive profiling over time
- Team analytics for software companies
- Integration with GitHub commit patterns
- Personalized learning recommendations
- Mobile companion app
- Advanced ML models (HDBSCAN, behavioral LSTM)

---

## Resume Points

**Cognitive Pattern Decoder | React, Node.js, Python, ML, VS Code Extension**

- Built a developer analytics platform with a VS Code extension that tracks coding behavior metrics and sends them to a Node.js backend with MongoDB storage.
- Implemented K-Means clustering (scikit-learn) via FastAPI to classify developers into cognitive coding patterns based on typing speed, pauses, and accuracy.
- Designed a React dashboard with real-time WebSocket notifications, AI mood detection (Groq/Llama), streak tracking, and session history visualization.

---

## License

Academic / SDP Project — Manan Javiya & Maitrey Patel
