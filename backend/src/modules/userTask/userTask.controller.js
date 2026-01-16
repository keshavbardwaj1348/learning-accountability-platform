const UserTask = require("./userTask.model");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/AppError");
const updateStreak = require("./streak.service");


// Update task status
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { taskKey } = req.params;

  if (!["NOT_STARTED", "IN_PROGRESS", "COMPLETED"].includes(status)) {
    throw new AppError("Invalid task status", 400);
  }

  const update = {
    status,
    completedAt: status === "COMPLETED" ? new Date() : null,
  };

  const task = await UserTask.findOneAndUpdate(
    {
      userId: req.userId,
      version: "v1",
      taskKey,
    },
    {
      $set: update,
      $setOnInsert: {
        weekNumber: req.body.weekNumber,
        dayNumber: req.body.dayNumber,
      },
    },
    { new: true, upsert: true }
  );
  if (status === "COMPLETED") {
    await updateStreak(req.userId);
  }

  res.json({ status: "success", data: task });
});

// Update task notes
const updateTaskNotes = asyncHandler(async (req, res) => {
  const { notesMarkdown } = req.body;
  const { taskKey } = req.params;

  const task = await UserTask.findOneAndUpdate(
    { userId: req.userId, version: "v1", taskKey },
    { $set: { notesMarkdown } },
    { new: true }
  );

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  res.json({ status: "success", data: task });
});

const getDayTasks = asyncHandler(async (req, res) => {
  const { weekNumber, dayNumber } = req.query;

  if (!weekNumber || !dayNumber) {
    throw new AppError("weekNumber and dayNumber are required", 400);
  }

  const tasks = await UserTask.find({
    userId: req.userId,
    version: "v1",
    weekNumber: Number(weekNumber),
    dayNumber: Number(dayNumber),
  }).select("taskKey status notesMarkdown completedAt");

  res.json({
    status: "success",
    data: tasks,
  });
});


module.exports = {
  updateTaskStatus,
  updateTaskNotes,
  getDayTasks,
};
