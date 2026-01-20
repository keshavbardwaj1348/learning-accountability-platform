import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Daily from "../pages/Daily";
import DSA from "../pages/DSA";
import Analytics from "../pages/Analytics";
import ProtectedRoute from "./ProtectedRoute";
import Settings from "../pages/Settings";
import WeeklyRoadmap from "../pages/WeeklyRoadmap";
import Roadmap from "../pages/Roadmap";
import HomeRedirect from "./HomeRedirect";

export default function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
      <Route path="/" element={<HomeRedirect />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/daily/:weekNumber/:dayNumber"
        element={
          <ProtectedRoute>
            <Daily />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dsa"
        element={
          <ProtectedRoute>
            <DSA />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Weekly Roadmap (Week view) */}
      <Route
        path="/roadmap"
        element={
          <ProtectedRoute>
            <WeeklyRoadmap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roadmap/week/:weekNumber"
        element={
          <ProtectedRoute>
            <WeeklyRoadmap />
          </ProtectedRoute>
        }
      />

      {/* Full 8-week roadmap */}
      <Route
        path="/roadmap-full"
        element={
          <ProtectedRoute>
            <Roadmap />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<div className="min-h-screen bg-black text-white p-6">404</div>}
      />
    </Routes>
  );
}
    