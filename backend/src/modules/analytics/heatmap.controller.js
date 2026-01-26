// const asyncHandler = require("../../utils/asyncHandler");
// const UserTask = require("../userTask/userTask.model");
// const PomodoroSession = require("../pomodoro/pomodoro.model");
// const UserDSAProgress = require("../dsa/userDsaProgress.model");

// const getHeatmap = asyncHandler(async (req, res) => {
//   const days = Number(req.query.days || 90);

//   const endDate = new Date();
//   endDate.setHours(23, 59, 59, 999);

//   const startDate = new Date();
//   startDate.setDate(startDate.getDate() - days);
//   startDate.setHours(0, 0, 0, 0);

//   // 1) Completed tasks grouped by day
//   const taskAgg = await UserTask.aggregate([
//     {
//       $match: {
//         userId: req.userId,
//         status: "COMPLETED",
//         completedAt: { $gte: startDate, $lte: endDate },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           $dateToString: { format: "%Y-%m-%d", date: "$completedAt" },
//         },
//         count: { $sum: 1 },
//       },
//     },
//   ]);

//   // 2) Pomodoro sessions grouped by day (endedAt)
//   const pomodoroAgg = await PomodoroSession.aggregate([
//     {
//       $match: {
//         userId: req.userId,
//         endedAt: { $ne: null, $gte: startDate, $lte: endDate },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           $dateToString: { format: "%Y-%m-%d", date: "$endedAt" },
//         },
//         count: { $sum: 1 },
//       },
//     },
//   ]);

//   // 3) DSA solves grouped by day
//   const dsaAgg = await UserDSAProgress.aggregate([
//     {
//       $match: {
//         userId: req.userId,
//         status: "SOLVED",
//         lastSolvedAt: { $ne: null, $gte: startDate, $lte: endDate },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           $dateToString: { format: "%Y-%m-%d", date: "$lastSolvedAt" },
//         },
//         count: { $sum: 1 },
//       },
//     },
//   ]);

//   // Merge counts
//   const map = new Map();

//   const merge = (arr) => {
//     for (const item of arr) {
//       map.set(item._id, (map.get(item._id) || 0) + item.count);
//     }
//   };

//   merge(taskAgg);
//   merge(pomodoroAgg);
//   merge(dsaAgg);

//   const result = [...map.entries()]
//     .map(([date, count]) => ({ date, count }))
//     .sort((a, b) => a.date.localeCompare(b.date));

//   res.json({
//     status: "success",
//     data: {
//       startDate,
//       endDate,
//       days,
//       heatmap: result,
//     },
//   });
// });

// module.exports = { getHeatmap };


const mongoose = require("mongoose");

const asyncHandler = require("../../utils/asyncHandler");
const UserTask = require("../userTask/userTask.model");
const PomodoroSession = require("../pomodoro/pomodoro.model");
const UserDSAProgress = require("../dsa/userDsaProgress.model");

const getHeatmap = asyncHandler(async (req, res) => {
  const days = Number(req.query.days || 90);

  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  // ✅ FIX: Convert userId string -> ObjectId
  const userObjectId = new mongoose.Types.ObjectId(req.userId);

  // 1) Completed tasks grouped by day
  const taskAgg = await UserTask.aggregate([
    {
      $match: {
        userId: userObjectId,
        status: "COMPLETED",
        completedAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$completedAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // 2) Pomodoro sessions grouped by day (endedAt)
  const pomodoroAgg = await PomodoroSession.aggregate([
    {
      $match: {
        userId: userObjectId,
        endedAt: { $ne: null, $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$endedAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // 3) DSA solves grouped by day
  const dsaAgg = await UserDSAProgress.aggregate([
    {
      $match: {
        userId: userObjectId,
        status: "SOLVED",
        lastSolvedAt: { $ne: null, $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$lastSolvedAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // Merge counts
  const map = new Map();

  const merge = (arr) => {
    for (const item of arr) {
      map.set(item._id, (map.get(item._id) || 0) + item.count);
    }
  };

  merge(taskAgg);
  merge(pomodoroAgg);
  merge(dsaAgg);

  const result = [...map.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  res.json({
    status: "success",
    data: {
      startDate,
      endDate,
      days,
      heatmap: result,
    },
  });
});

module.exports = { getHeatmap };