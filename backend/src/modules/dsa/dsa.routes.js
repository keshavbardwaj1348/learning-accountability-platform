const express = require("express");
const protect = require("../../middlewares/authMiddleware");
const {
  addProblem,
  listProblems,
  solveProblem,
  getTodayRevisions,
} = require("./dsa.controller");

const router = express.Router();

router.post("/problems", protect, addProblem);
router.get("/problems", protect, listProblems);

router.post("/:problemId/solve", protect, solveProblem);
router.get("/revisions/today", protect, getTodayRevisions);

module.exports = router;
