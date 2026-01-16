const PomodoroSession = require("./pomodoro.model");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/AppError");

const MAX_SESSION_MINUTES = 240; // 4 hours

// Start session
const startSession = asyncHandler(async (req, res) => {
  const { taskKey, weekNumber, dayNumber } = req.body;

  if (!taskKey || !weekNumber || !dayNumber) {
    throw new AppError("taskKey, weekNumber, dayNumber are required", 400);
  }

  const activeSession = await PomodoroSession.findOne({
    userId: req.userId,
    endedAt: null,
  });

  if (activeSession) {
    throw new AppError("You already have an active session", 400);
  }

  const session = await PomodoroSession.create({
    userId: req.userId,
    taskKey,
    weekNumber,
    dayNumber,
    startedAt: new Date(),
  });

  res.status(201).json({
    status: "success",
    message: "Pomodoro session started",
    data: session,
  });
});

// Stop latest active session
const stopSession = asyncHandler(async (req, res) => {
  const activeSession = await PomodoroSession.findOne({
    userId: req.userId,
    endedAt: null,
  });

  if (!activeSession) {
    throw new AppError("No active session found", 404);
  }

  const endedAt = new Date();
  const durationMs = endedAt - activeSession.startedAt;
  const rawMinutes = Math.max(1, Math.round(durationMs / (1000 * 60)));
  const durationMinutes = Math.min(rawMinutes, MAX_SESSION_MINUTES);

  activeSession.endedAt = endedAt;
  activeSession.durationMinutes = durationMinutes;

  await activeSession.save();

  res.json({
    status: "success",
    message: "Pomodoro session stopped",
    data: activeSession,
  });
});

// Stop by session ID (recommended)
const stopSessionById = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { durationMinutes: manualDuration } = req.body || {};

  const session = await PomodoroSession.findOne({
    _id: sessionId,
    userId: req.userId,
  });

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  if (session.endedAt) {
    throw new AppError("Session already stopped", 400);
  }

  const endedAt = new Date();

  let durationMinutes;

  // manual override (optional)
  if (manualDuration !== undefined) {
    if (
      typeof manualDuration !== "number" ||
      manualDuration < 1 ||
      manualDuration > MAX_SESSION_MINUTES
    ) {
      throw new AppError(
        `durationMinutes must be between 1 and ${MAX_SESSION_MINUTES}`,
        400
      );
    }
    durationMinutes = manualDuration;
  } else {
    const durationMs = endedAt - session.startedAt;
    const rawMinutes = Math.max(1, Math.round(durationMs / (1000 * 60)));
    durationMinutes = Math.min(rawMinutes, MAX_SESSION_MINUTES);
  }

  session.endedAt = endedAt;
  session.durationMinutes = durationMinutes;
  await session.save();

  res.json({
    status: "success",
    message: "Pomodoro session stopped",
    data: session,
  });
});

// Daily summary
const dailySummary = asyncHandler(async (req, res) => {
  const { weekNumber, dayNumber } = req.query;

  if (!weekNumber || !dayNumber) {
    throw new AppError("weekNumber and dayNumber are required", 400);
  }

  const sessions = await PomodoroSession.find({
    userId: req.userId,
    weekNumber: Number(weekNumber),
    dayNumber: Number(dayNumber),
    endedAt: { $ne: null },
  });

  const totalMinutes = sessions.reduce(
    (sum, s) => sum + (s.durationMinutes || 0),
    0
  );

  res.json({
    status: "success",
    data: {
      weekNumber: Number(weekNumber),
      dayNumber: Number(dayNumber),
      totalSessions: sessions.length,
      totalMinutes,
      totalHours: Number((totalMinutes / 60).toFixed(2)),
    },
  });
});

module.exports = {
  startSession,
  stopSession,
  stopSessionById,
  dailySummary,
};