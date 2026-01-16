const asyncHandler = require("../../utils/asyncHandler");
const UserTask = require("../userTask/userTask.model");
const AppError = require("../../utils/AppError");

const getWeeklyProgress = asyncHandler(async (req, res) => {
  const weekNumber = Number(req.query.weekNumber);

  if (!weekNumber) {
    throw new AppError("weekNumber is required", 400);
  }

  const tasks = await UserTask.find({
    userId: req.userId,
    version: "v1",
    weekNumber,
  });

  const totalTrackedTasks = tasks.length;

  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;

  const completionPercentage =
    totalTrackedTasks === 0
      ? 0
      : Math.round((completedTasks / totalTrackedTasks) * 100);

  res.json({
    status: "success",
    data: {
      weekNumber,
      totalTrackedTasks,
      completedTasks,
      inProgressTasks,
      completionPercentage,
    },
  });
});

module.exports = { getWeeklyProgress };
