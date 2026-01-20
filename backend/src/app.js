const express = require("express");
const cors = require("cors");

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

// ✅ Search Routes
const searchRoutes = require("./modules/search/search.routes");

const app = express();

// ✅ CORS (supports localhost + Vercel + cookies)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed =
      allowedOrigins.includes(origin) || origin.endsWith(".vercel.app");
    if (isAllowed) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  }
}));


app.use(express.json());

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
