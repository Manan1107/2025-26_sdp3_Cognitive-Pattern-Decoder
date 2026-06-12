const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { sendMessage, getHistory, clearHistory } = require("../controllers/chat.controller");

router.post("/message", auth, sendMessage);
router.get("/history", auth, getHistory);
router.delete("/history", auth, clearHistory);

module.exports = router;
