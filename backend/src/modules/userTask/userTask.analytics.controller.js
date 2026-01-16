const UserTask = require("./userTask.model");
const asyncHandler = require("../../utils/asyncHandler");

// Get daily progress summary
const getDailyProgress = asyncHandler(async (req, res) => {
  const { weekNumber, dayNumber } = req.query;

  if (!weekNumber || !dayNumber) {
    return res.status(400).json({
      status: "fail",
      message: "weekNumber and dayNumber are required",
    });
  }

  const tasks = await UserTask.find({
    userId: req.userId,
    version: "v1",
    weekNumber: Number(weekNumber),
    dayNumber: Number(dayNumber),
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  res.json({
    status: "success",
    data: {
      weekNumber: Number(weekNumber),
      dayNumber: Number(dayNumber),
      totalTasks,
      completedTasks,
      completionPercentage,
    },
  });
});

module.exports = {
  getDailyProgress,
};
