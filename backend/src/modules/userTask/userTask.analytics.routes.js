const express = require("express");
const protect = require("../../middlewares/authMiddleware");
const {
  getDailyProgress,
} = require("./userTask.analytics.controller");

const router = express.Router();

router.get("/daily", protect, getDailyProgress);

module.exports = router;
