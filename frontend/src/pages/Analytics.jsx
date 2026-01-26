import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "../layouts/AppLayout";
import { getHeatmapApi, getWeeklyProgressApi } from "../api/analyticsPage";
import HeatmapGrid from "../components/HeatmapGrid";
import PageTransition from "../components/PageTransition";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Analytics() {
  const [weekNumber, setWeekNumber] = useState(1);

  const { data: heatmapData, isLoading: heatmapLoading, isError: heatmapError } =
    useQuery({
      queryKey: ["heatmap", 30],
      queryFn: () => getHeatmapApi({ days: 30 }),
    });

  const { data: weeklyData, isLoading: weeklyLoading, isError: weeklyError } =
    useQuery({
      queryKey: ["weekly-progress", weekNumber],
      queryFn: () => getWeeklyProgressApi({ weekNumber }),
    });

  const heatmap = heatmapData?.data?.heatmap || [];
  const weekly = weeklyData?.data;

  const pendingTasks =
    weekly && typeof weekly.totalTrackedTasks === "number"
      ? Math.max(
          0,
          weekly.totalTrackedTasks - (weekly.completedTasks || 0) - (weekly.inProgressTasks || 0)
        )
      : 0;

  const chartData = weekly
    ? [
        { name: "Completed", value: weekly.completedTasks || 0 },
        { name: "In Progress", value: weekly.inProgressTasks || 0 },
        { name: "Pending", value: pendingTasks },
      ]
    : [];

  return (
    <AppLayout>
      <PageTransition>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Analytics</h1>
            <p className="mt-2 text-white/60">Your progress insights</p>
          </div>

          {/* Week Selector */}
          <div className="flex items-center gap-2">
            <p className="text-sm opacity-70">Week</p>
            <select
              value={weekNumber}
              onChange={(e) => setWeekNumber(Number(e.target.value))}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
            >
              {Array.from({ length: 8 }).map((_, i) => {
                const w = i + 1;
                return (
                  <option key={w} value={w}>
                    Week {w}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Consistency Heatmap</h2>

            {/* Legend */}
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-sm bg-white/10" />
                <span className="h-3 w-3 rounded-sm bg-white/20" />
                <span className="h-3 w-3 rounded-sm bg-white/35" />
                <span className="h-3 w-3 rounded-sm bg-white/50" />
                <span className="h-3 w-3 rounded-sm bg-white/70" />
              </div>
              <span>More</span>
            </div>
          </div>

          {heatmapLoading ? (
            <p className="mt-3 text-white/60">Loading heatmap...</p>
          ) : heatmapError ? (
            <p className="mt-3 text-red-400">Failed to load heatmap</p>
          ) : heatmap.length === 0 ? (
            <p className="mt-3 text-white/60">No activity yet. Start tracking ✅</p>
          ) : (
            <div className="mt-4">
              <HeatmapGrid data={heatmap} />
            </div>
          )}

          <p className="mt-3 text-xs text-white/40">
            Each square = a day. Brighter = more activity.
          </p>
        </div>

        {/* Weekly Progress Chart */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Weekly Progress</h2>
            <p className="text-sm text-white/50">Week {weekNumber}</p>
          </div>

          {weeklyLoading ? (
            <p className="mt-3 text-white/60">Loading weekly progress...</p>
          ) : weeklyError ? (
            <p className="mt-3 text-red-400">Failed to load weekly progress</p>
          ) : (
            <>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-xs text-white/50">Completion</p>
                  <p className="mt-1 text-lg font-semibold">
                    {weekly?.completionPercentage ?? 0}%
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-xs text-white/50">Completed</p>
                  <p className="mt-1 text-lg font-semibold">
                    {weekly?.completedTasks ?? 0}
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-xs text-white/50">Tracked</p>
                  <p className="mt-1 text-lg font-semibold">
                    {weekly?.totalTrackedTasks ?? 0}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </PageTransition>
    </AppLayout>
  );
}