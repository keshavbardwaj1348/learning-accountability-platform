const express = require("express");
const protect = require("../../middlewares/authMiddleware");
const { getWeeklyProgress } = require("./weeklyProgress.controller");

const router = express.Router();

router.get("/weekly-progress", protect, getWeeklyProgress);

module.exports = router;
