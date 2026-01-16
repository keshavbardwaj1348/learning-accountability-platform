const mongoose = require("mongoose");

const pomodoroSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    taskKey: {
      type: String,
      required: true,
    },
    weekNumber: {
      type: Number,
      required: true,
    },
    dayNumber: {
      type: Number,
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    durationMinutes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

pomodoroSessionSchema.index({ userId: 1, startedAt: -1 });

module.exports = mongoose.model("PomodoroSession", pomodoroSessionSchema);
