const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/AppError");

const User = require("../auth/auth.model");
const UserTask = require("../userTask/userTask.model");
const PomodoroSession = require("../pomodoro/pomodoro.model");

const getOverview = asyncHandler(async (req, res) => {
  const weekNumber = Number(req.query.weekNumber);
  const dayNumber = Number(req.query.dayNumber);

  if (!weekNumber || !dayNumber) {
    throw new AppError("weekNumber and dayNumber are required", 400);
  }

  // 1) streak
  const user = await User.findById(req.userId).select("streak");

  // 2) daily tasks summary
  const tasks = await UserTask.find({
    userId: req.userId,
    version: "v1",
    weekNumber,
    dayNumber,
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;

  const completionPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // 3) daily focus summary
  const sessions = await PomodoroSession.find({
    userId: req.userId,
    weekNumber,
    dayNumber,
    endedAt: { $ne: null },
  });

  const totalMinutes = sessions.reduce(
    (sum, s) => sum + (s.durationMinutes || 0),
    0
  );

  res.json({
    status: "success",
    data: {
      weekNumber,
      dayNumber,
      streak: user?.streak || { current: 0, longest: 0, lastActiveDate: null },
      tasks: {
        totalTasks,
        completedTasks,
        completionPercentage,
      },
      focus: {
        totalSessions: sessions.length,
        totalMinutes,
        totalHours: Number((totalMinutes / 60).toFixed(2)),
      },
    },
  });
});

module.exports = { getOverview };
