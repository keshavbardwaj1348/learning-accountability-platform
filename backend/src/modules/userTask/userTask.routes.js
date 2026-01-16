const express = require("express");
const protect = require("../../middlewares/authMiddleware");
const {
  updateTaskStatus,
  updateTaskNotes,
  getDayTasks,
} = require("./userTask.controller");

const router = express.Router();

router.get("/day", protect, getDayTasks);
router.patch("/:taskKey/status", protect, updateTaskStatus);
router.patch("/:taskKey/notes", protect, updateTaskNotes);

module.exports = router;
