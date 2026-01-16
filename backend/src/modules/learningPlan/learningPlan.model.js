const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    timeBlock: {
      type: String, // Morning / Evening
      required: true,
    },
    category: {
      type: String, // JS / DSA / AI / MERN
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    tasks: [
      {
        type: String,
        required: true,
      },
    ],
    outcomes: [
      {
        type: String,
      },
    ],
  },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
    },
    label: {
      type: String, // Monday, Tuesday
      required: true,
    },
    schedule: [taskSchema],
  },
  { _id: false }
);

const learningPlanSchema = new mongoose.Schema(
  {
    version: {
      type: String,
      required: true,
      default: "v1",
    },
    weekNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
    days: [daySchema],
  },
  {
    timestamps: true,
  }
);

// Ensure one plan per week per version
learningPlanSchema.index({ version: 1, weekNumber: 1 }, { unique: true });

module.exports = mongoose.model("LearningPlan", learningPlanSchema);
