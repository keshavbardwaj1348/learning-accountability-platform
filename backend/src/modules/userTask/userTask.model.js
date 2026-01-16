const mongoose = require("mongoose");

const userTaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    version: {
      type: String,
      default: "v1",
    },
    weekNumber: {
      type: Number,
      required: true,
    },
    dayNumber: {
      type: Number,
      required: true,
    },
    taskKey: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
      default: "NOT_STARTED",
    },
    notesMarkdown: {
      type: String,
      default: "",
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// One task per user per plan
userTaskSchema.index(
  { userId: 1, version: 1, weekNumber: 1, dayNumber: 1, taskKey: 1 },
  { unique: true }
);

module.exports = mongoose.model("UserTask", userTaskSchema);
