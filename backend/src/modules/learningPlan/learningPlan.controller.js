// const LearningPlan = require("./learningPlan.model");
// const AppError = require("../../utils/AppError");
// const asyncHandler = require("../../utils/asyncHandler");

// // Get full week plan
// const getWeekPlan = asyncHandler(async (req, res) => {
//   const weekNumber = Number(req.params.weekNumber);

//   const plan = await LearningPlan.findOne({
//     version: "v1",
//     weekNumber,
//   });

//   if (!plan) {
//     throw new AppError("Learning plan not found for this week", 404);
//   }

//   res.status(200).json({
//     status: "success",
//     data: plan,
//   });
// });

// // Get current day plan (TEMP: Day 1 only)
// const getCurrentDayPlan = asyncHandler(async (req, res) => {
//   const plan = await LearningPlan.findOne({
//     version: "v1",
//     weekNumber: 1,
//   });

//   if (!plan) {
//     throw new AppError("Learning plan not found", 404);
//   }

//   const day = plan.days.find((d) => d.dayNumber === 1);

//   res.status(200).json({
//     status: "success",
//     data: {
//       weekNumber: plan.weekNumber,
//       day,
//     },
//   });
// });

// module.exports = {
//   getWeekPlan,
//   getCurrentDayPlan,
// };


const LearningPlan = require("./learningPlan.model");
const AppError = require("../../utils/AppError");
const asyncHandler = require("../../utils/asyncHandler");

// Get full week plan
const getWeekPlan = asyncHandler(async (req, res) => {
  const weekNumber = Number(req.params.weekNumber);

  if (!Number.isInteger(weekNumber) || weekNumber < 1) {
    throw new AppError("Invalid week number", 400);
  }

  const plan = await LearningPlan.findOne({
    version: "v1",
    weekNumber,
  });

  if (!plan) {
    throw new AppError("Learning plan not found for this week", 404);
  }

  res.status(200).json({
    status: "success",
    data: plan,
  });
});

// Get current day plan (safe version)
const getCurrentDayPlan = asyncHandler(async (req, res) => {
  const dayNumber = Number(req.query.day) || 1;

  const plan = await LearningPlan.findOne({
    version: "v1",
    weekNumber: 1,
  });

  if (!plan) {
    throw new AppError("Learning plan not found", 404);
  }

  const day = plan.days.find((d) => d.dayNumber === dayNumber);

  if (!day) {
    throw new AppError("Day plan not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      weekNumber: plan.weekNumber,
      day,
    },
  });
});

module.exports = {
  getWeekPlan,
  getCurrentDayPlan,
};