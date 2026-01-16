const express = require("express");
const {
  getWeekPlan,
  getCurrentDayPlan,
} = require("./learningPlan.controller");

const router = express.Router();

router.get("/week/:weekNumber", getWeekPlan);
router.get("/current-day", getCurrentDayPlan);

module.exports = router;
