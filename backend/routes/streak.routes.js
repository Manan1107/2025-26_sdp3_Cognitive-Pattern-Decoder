const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { getMyStreak } = require("../controllers/streak.controller");

router.get("/me", auth, getMyStreak);

module.exports = router;
