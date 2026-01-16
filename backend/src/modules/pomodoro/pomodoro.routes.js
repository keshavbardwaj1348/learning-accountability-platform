const express = require("express");
const protect = require("../../middlewares/authMiddleware");
const {
  startSession,
  stopSession,
  stopSessionById,
  dailySummary,
} = require("./pomodoro.controller");

const router = express.Router();

router.post("/start", protect, startSession);
router.post("/stop", protect, stopSession);
router.post("/stop/:sessionId", protect, stopSessionById);

router.get("/daily-summary", protect, dailySummary);

module.exports = router;