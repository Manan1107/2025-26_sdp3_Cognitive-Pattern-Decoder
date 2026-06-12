const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
  getTodayChallenge,
  completeChallenge,
  getChallengeHistory,
} = require("../controllers/challenge.controller");

router.get("/today", auth, getTodayChallenge);
router.post("/:id/complete", auth, completeChallenge);
router.get("/history", auth, getChallengeHistory);

module.exports = router;
