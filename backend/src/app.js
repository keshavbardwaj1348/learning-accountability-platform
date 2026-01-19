// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");

// const AppError = require("./utils/AppError");
// const errorHandler = require("./middlewares/errorHandler");

// // Routes
// const authRoutes = require("./modules/auth/auth.routes");

// const learningPlanRoutes = require("./modules/learningPlan/learningPlan.routes");

// const userTaskRoutes = require("./modules/userTask/userTask.routes");

// const userTaskAnalyticsRoutes = require("./modules/userTask/userTask.analytics.routes");

// const streakRoutes = require("./modules/userTask/streak.routes");

// const pomodoroRoutes = require("./modules/pomodoro/pomodoro.routes");

// const dsaRoutes = require("./modules/dsa/dsa.routes");

// const heatmapRoutes = require("./modules/analytics/heatmap.routes");

// const weeklyProgressRoutes = require("./modules/analytics/weeklyProgress.routes");

// const overviewRoutes = require("./modules/analytics/overview.routes");






// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(cookieParser());


// // Health check
// app.get("/health", (req, res) => {
//   res.status(200).json({
//     status: "OK",
//     message: "Server is healthy",
//   });
// });

// // Auth routes
// app.use("/auth", authRoutes);
// app.use("/plan", learningPlanRoutes);
// app.use("/tasks", userTaskRoutes);
// app.use("/analytics/tasks", userTaskAnalyticsRoutes);
// app.use("/analytics/streak", streakRoutes);
// app.use("/pomodoro", pomodoroRoutes);
// app.use("/dsa", dsaRoutes);
// app.use("/analytics", heatmapRoutes);
// app.use("/analytics", weeklyProgressRoutes);
// app.use("/analytics", overviewRoutes);






// // 404 handler
// app.use((req, res, next) => {
//   next(new AppError(`Route ${req.originalUrl} not found`, 404));
// });

// // Global error handler
// app.use(errorHandler);

// module.exports = app;


// const protect = require("./middlewares/authMiddleware");

// app.get("/protected", protect, (req, res) => {
//   res.json({
//     status: "success",
//     message: "You are authenticated",
//     userId: req.userId,
//   });
// });




const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/AppError");
const errorHandler = require("./middlewares/errorHandler");

// Routes
const authRoutes = require("./modules/auth/auth.routes");
const learningPlanRoutes = require("./modules/learningPlan/learningPlan.routes");
const userTaskRoutes = require("./modules/userTask/userTask.routes");
const userTaskAnalyticsRoutes = require("./modules/userTask/userTask.analytics.routes");
const streakRoutes = require("./modules/userTask/streak.routes");
const pomodoroRoutes = require("./modules/pomodoro/pomodoro.routes");
const dsaRoutes = require("./modules/dsa/dsa.routes");

const heatmapRoutes = require("./modules/analytics/heatmap.routes");
const weeklyProgressRoutes = require("./modules/analytics/weeklyProgress.routes");
const overviewRoutes = require("./modules/analytics/overview.routes");

// ✅ NEW: Search Routes
const searchRoutes = require("./modules/search/search.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy",
  });
});

// Auth routes
app.use("/auth", authRoutes);

// Core modules
app.use("/plan", learningPlanRoutes);
app.use("/tasks", userTaskRoutes);
app.use("/pomodoro", pomodoroRoutes);
app.use("/dsa", dsaRoutes);

// Analytics
app.use("/analytics/tasks", userTaskAnalyticsRoutes);
app.use("/analytics/streak", streakRoutes);
app.use("/analytics", heatmapRoutes);
app.use("/analytics", weeklyProgressRoutes);
app.use("/analytics", overviewRoutes);

// ✅ Global Search
app.use("/search", searchRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler
app.use(errorHandler);

module.exports = app;