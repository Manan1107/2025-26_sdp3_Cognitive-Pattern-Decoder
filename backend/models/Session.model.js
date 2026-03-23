const mongoose = require("mongoose");

// // const SessionSchema = new mongoose.Schema({
// //   userId: String,
// //   projectId: String,

// //   typingSpeed: Number,
// //   typedChars: Number,
// //   backspaceCount: Number,
// //   pasteCount: Number,
// //   pasteCharacters: Number,
// //   saveCount: Number,
// //   fileSwitchCount: Number,
// //   cursorMoveCount: Number,
// //   avgPauseTime: Number,
// //   sessionTime: Number,
// //   // 🔥 ML Fields
// //   cluster: Number,
// //   clusterMeaning: String,


// //   createdAt: { type: Date, default: Date.now }
// // });

// // module.exports = mongoose.model("Session", SessionSchema);
// const mongoose = require("mongoose");

// const SessionSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: String,
//       required: true
//     },

//     projectId: {
//       type: String,
//       required: true
//     },

//     typingSpeed: {
//       type: Number,
//       default: 0
//     },

//     typedChars: {
//       type: Number,
//       default: 0
//     },

//     backspaceCount: {
//       type: Number,
//       default: 0
//     },

//     pasteCount: {
//       type: Number,
//       default: 0
//     },

//     pasteCharacters: {
//       type: Number,
//       default: 0
//     },

//     saveCount: {
//       type: Number,
//       default: 0
//     },

//     fileSwitchCount: {
//       type: Number,
//       default: 0
//     },

//     cursorMoveCount: {
//       type: Number,
//       default: 0
//     },

//     avgPauseTime: {
//       type: Number,
//       default: 0
//     },

//     sessionTime: {
//       type: Number,
//       default: 0
//     },

//     // 🔥 ML Fields
//     cluster: {
//       type: Number,
//       default: null
//     },

//     clusterMeaning: {
//       type: String,
//       default: null
//     }
//   },
//   {
//     timestamps: true   // automatically adds createdAt & updatedAt
//   }
// );

// module.exports = mongoose.model("Session", SessionSchema);const mongoose = require("mongoose");

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

    cluster: { type: Number, default: null },
    clusterMeaning: { type: String, default: null }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Session", SessionSchema);
