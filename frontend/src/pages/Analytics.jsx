import { useQuery } from "@tanstack/react-query";
import AppLayout from "../layouts/AppLayout";
import { getHeatmapApi, getWeeklyProgressApi } from "../api/analyticsPage";
import HeatmapGrid from "../components/HeatmapGrid";
import PageTransition from "../components/PageTransition";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function Analytics() {
    const weekNumber = 1;

    const { data: heatmapData, isLoading: heatmapLoading } = useQuery({
        queryKey: ["heatmap", 30],
        queryFn: () => getHeatmapApi({ days: 30 }),
    });

    const { data: weeklyData, isLoading: weeklyLoading } = useQuery({
        queryKey: ["weekly-progress", weekNumber],
        queryFn: () => getWeeklyProgressApi({ weekNumber }),
    });

    const heatmap = heatmapData?.data?.heatmap || [];
    const weekly = weeklyData?.data;

    const chartData = weekly
        ? [
            { name: "Completed", value: weekly.completedTasks },
            { name: "In Progress", value: weekly.inProgressTasks },
            { name: "Total Tracked", value: weekly.totalTrackedTasks },
        ]
        : [];

    return (
        <AppLayout>
            <PageTransition>
                <h1 className="text-2xl font-semibold">Analytics</h1>
                <p className="mt-2 text-white/60">Your progress insights</p>

                {/* Heatmap Grid */}
                <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                    <h2 className="text-lg font-semibold">Consistency Heatmap</h2>

                    {heatmapLoading ? (
                        <p className="mt-3 text-white/60">Loading...</p>
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
                    <h2 className="text-lg font-semibold">
                        Weekly Progress (Week {weekNumber})
                    </h2>

                    {weeklyLoading ? (
                        <p className="mt-3 text-white/60">Loading...</p>
                    ) : (
                        <>
                            <p className="mt-2 text-sm text-white/60">
                                Completion: {weekly?.completionPercentage ?? 0}%
                            </p>

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
