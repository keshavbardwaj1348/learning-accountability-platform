import { useQuery, useQueries } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import PageTransition from "../components/PageTransition";
import { getWeekPlanApi } from "../api/weeklyPlan";
import { getTasksByDayApi } from "../api/tasks";

function calcCompletion(tasks = []) {
  if (!tasks.length) return 0;

  const completed = tasks.filter(
    (t) => t.status === "COMPLETED" || t.status === "completed"
  ).length;

  return Math.round((completed / tasks.length) * 100);
}

export default function WeeklyRoadmap() {
  const navigate = useNavigate();
  const { weekNumber: weekNumberParam } = useParams();

  const weekNumber = Number(weekNumberParam) || 1;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["week-plan", weekNumber],
    queryFn: () => getWeekPlanApi({ weekNumber }),
    enabled: weekNumber >= 1 && weekNumber <= 8,
  });

  const week = data?.data;

  // Fetch completion for each day (1-7)
  const dayResults = useQueries({
    queries: Array.from({ length: 7 }).map((_, idx) => {
      const dayNumber = idx + 1;
      return {
        queryKey: ["day-tasks", weekNumber, dayNumber],
        queryFn: () => getTasksByDayApi({ weekNumber, dayNumber }),
        enabled: Boolean(weekNumber && weekNumber >= 1 && weekNumber <= 8),
        retry: false,
      };
    }),
  });

  const completionByDay = {};
  dayResults.forEach((r, idx) => {
    const dayNumber = idx + 1;

    const payload = r.data; // because api returns res.data
    const tasks = payload?.data?.tasks || payload?.tasks || payload?.data || [];

    completionByDay[dayNumber] = calcCompletion(tasks);
  });

  return (
    <AppLayout>
      <PageTransition>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Weekly Roadmap</h1>
            <p className="mt-2 opacity-70">Week {weekNumber} overview</p>
          </div>

          {/* Week Selector */}
          <div className="flex items-center gap-2">
            <p className="text-sm opacity-70">Week</p>
            <select
              value={weekNumber}
              onChange={(e) => navigate(`/roadmap/week/${e.target.value}`)}
              className="rounded-lg border theme-border theme-card px-3 py-2 text-sm outline-none"
            >
              {Array.from({ length: 8 }).map((_, i) => {
                const w = i + 1;
                return (
                  <option key={w} value={w} className="bg-black text-white">
                    Week {w}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {weekNumber < 1 || weekNumber > 8 ? (
          <p className="mt-6 text-red-500">Invalid week number</p>
        ) : null}

        {isLoading && <p className="mt-4 opacity-70">Loading...</p>}
        {isError && <p className="mt-4 text-red-500">Failed to load week</p>}

        {week && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border theme-border theme-card p-4">
              <p className="text-sm opacity-70">Title</p>
              <p className="text-lg font-semibold">{week.title}</p>

              <p className="mt-3 text-sm opacity-70">Goal</p>
              <p className="text-sm opacity-80">{week.goal}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {week.days.map((d) => {
                const completion = completionByDay[d.dayNumber] ?? 0;

                return (
                  <div
                    key={d.dayNumber}
                    className="rounded-xl border theme-border theme-card p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm opacity-70">Day {d.dayNumber}</p>
                      <p className="text-xs opacity-50">{d.label}</p>
                    </div>

                    <p className="mt-2 text-sm opacity-80">
                      Blocks:{" "}
                      <span className="font-medium">{d.schedule.length}</span>
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs opacity-60">Completion</p>
                      <p className="text-xs font-semibold">{completion}%</p>
                    </div>

                    <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-white"
                        style={{ width: `${completion}%` }}
                      />
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Link
                        to={`/daily/${weekNumber}/${d.dayNumber}`}
                        className="text-xs rounded-md bg-white text-black px-3 py-1 font-medium"
                      >
                        Open Daily
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PageTransition>
    </AppLayout>
  );
}