import { useQueries } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import PageTransition from "../components/PageTransition";
import { getWeekPlanApi } from "../api/weeklyPlan";

export default function Roadmap() {
  const navigate = useNavigate();
  const weeks = [1, 2, 3, 4, 5, 6, 7, 8];

  const results = useQueries({
    queries: weeks.map((weekNumber) => ({
      queryKey: ["week-plan", weekNumber],
      queryFn: () => getWeekPlanApi({ weekNumber }),
      retry: false,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);

  const available = results
    .filter((r) => r.isSuccess && r.data?.data)
    .map((r) => r.data.data);

  const failedWeeks = results
    .map((r, idx) => ({ r, weekNumber: weeks[idx] }))
    .filter((x) => x.r.isError)
    .map((x) => x.weekNumber);

  return (
    <AppLayout>
      <PageTransition>
        <h1 className="text-2xl font-semibold">8-Week Roadmap</h1>
        <p className="mt-2 opacity-70">Your full learning journey</p>

        {isLoading && <p className="mt-4 opacity-70">Loading...</p>}

        {!isLoading && (
          <>
            {failedWeeks.length > 0 && (
              <div className="mt-4 rounded-xl border theme-border theme-card p-4">
                <p className="text-sm opacity-70">
                  Some weeks are not available in backend seed:
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Week(s): {failedWeeks.join(", ")}
                </p>
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {available.map((w) => (
                <button
                  key={w.weekNumber}
                  type="button"
                  onClick={() => navigate(`/roadmap/week/${w.weekNumber}`)}
                  className="text-left rounded-xl border theme-border theme-card p-4 hover:opacity-90 transition"
                >
                  <p className="text-sm opacity-70">Week {w.weekNumber}</p>
                  <p className="text-lg font-semibold">{w.title}</p>

                  <p className="mt-3 text-sm opacity-70">Goal</p>
                  <p className="text-sm opacity-80">{w.goal}</p>

                  <p className="mt-3 text-xs opacity-50">
                    Days: {w.days?.length || 0}
                  </p>

                  <p className="mt-3 text-xs opacity-60">
                    Click to open week →
                  </p>
                </button>
              ))}
            </div>

            {available.length === 0 && (
              <p className="mt-6 text-sm text-red-500">
                No weeks available. Please seed curriculum properly.
              </p>
            )}
          </>
        )}
      </PageTransition>
    </AppLayout>
  );
}
