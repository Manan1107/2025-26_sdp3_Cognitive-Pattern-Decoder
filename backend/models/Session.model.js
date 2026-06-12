const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    typingSpeed: { type: Number, default: 0 },
    typedChars: { type: Number, default: 0 },
    backspaceCount: { type: Number, default: 0 },
    pasteCount: { type: Number, default: 0 },
    pasteCharacters: { type: Number, default: 0 },
    saveCount: { type: Number, default: 0 },
    fileSwitchCount: { type: Number, default: 0 },
    cursorMoveCount: { type: Number, default: 0 },
    avgPauseTime: { type: Number, default: 0 },
    sessionTime: { type: Number, default: 0 },
    scrollCount: { type: Number, default: 0 },
    debugRunCount: { type: Number, default: 0 },
    terminalOpenCount: { type: Number, default: 0 },

    cluster: { type: Number, default: null },
    clusterMeaning: { type: String, default: null },

    // VS Code Suggestion Tracker (Step 2)
    // Number of inline completions the user accepted (Tab/Enter)
    suggestionsAccepted: { type: Number, default: 0 },
    // Times the user edited code within 1.5s of accepting a suggestion
    // (indicates the suggestion wasn't quite right)
    postAcceptEdits: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Session", SessionSchema);
