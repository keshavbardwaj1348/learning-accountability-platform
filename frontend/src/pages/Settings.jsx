import AppLayout from "../layouts/AppLayout";
import PageTransition from "../components/PageTransition";
import { http } from "../api/http";

export default function Settings() {
  const exportData = async () => {
    const weekNumber = 1;
    const dayNumber = 1;

    const [
      streak,
      overview,
      heatmap,
      weeklyProgress,
      dsaRevisions,
    ] = await Promise.all([
      http.get("/analytics/streak"),
      http.get(`/analytics/overview?weekNumber=${weekNumber}&dayNumber=${dayNumber}`),
      http.get("/analytics/heatmap?days=30"),
      http.get(`/analytics/weekly-progress?weekNumber=${weekNumber}`),
      http.get("/dsa/revisions/today"),
    ]);

    const payload = {
      exportedAt: new Date().toISOString(),
      streak: streak.data,
      overview: overview.data,
      heatmap: heatmap.data,
      weeklyProgress: weeklyProgress.data,
      dsaRevisions: dsaRevisions.data,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "learning-accountability-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <PageTransition>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-2 opacity-70">Export your data and manage your account.</p>

        <div className="mt-6 rounded-xl border theme-border theme-card p-4">
          <h2 className="text-lg font-semibold">Export Data</h2>
          <p className="mt-2 text-sm opacity-70">
            Download your progress, streak, analytics, and revisions as JSON.
          </p>

          <button
            onClick={exportData}
            className="mt-4 rounded-lg bg-white text-black px-4 py-2 text-sm font-medium"
          >
            Download Export JSON
          </button>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
