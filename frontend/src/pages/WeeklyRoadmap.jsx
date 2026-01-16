import { useQuery } from "@tanstack/react-query";
import AppLayout from "../layouts/AppLayout";
import PageTransition from "../components/PageTransition";
import { getWeekPlanApi } from "../api/weeklyPlan";
import { Link } from "react-router-dom";

export default function WeeklyRoadmap() {
    const weekNumber = 1;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["week-plan", weekNumber],
        queryFn: () => getWeekPlanApi({ weekNumber }),
    });

    const week = data?.data;

    return (
        <AppLayout>
            <PageTransition>
                <h1 className="text-2xl font-semibold">Weekly Roadmap</h1>
                <p className="mt-2 opacity-70">
                    Week {weekNumber} overview
                </p>

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
                            {week.days.map((d) => (
                                <div
                                    key={d.dayNumber}
                                    className="rounded-xl border theme-border theme-card p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm opacity-70">Day {d.dayNumber}</p>
                                        <p className="text-xs opacity-50">{d.label}</p>
                                    </div>

                                    <p className="mt-2 text-sm opacity-80">
                                        Blocks: <span className="font-medium">{d.schedule.length}</span>
                                    </p>

                                    <div className="mt-3 flex gap-2">
                                        <Link
                                            to={`/daily/${weekNumber}/${d.dayNumber}`}
                                            className="text-xs rounded-md bg-white text-black px-3 py-1 font-medium"
                                        >
                                            Open Daily
                                        </Link>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </PageTransition>
        </AppLayout>
    );
}
