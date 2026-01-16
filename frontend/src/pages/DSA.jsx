import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getTodayRevisionsApi,
    listDsaProblemsApi,
    solveDsaProblemApi,
} from "../api/dsa";
import AppLayout from "../layouts/AppLayout";
import PageTransition from "../components/PageTransition";


export default function DSA() {
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["dsa-problems"],
        queryFn: listDsaProblemsApi,
    });

    const { data: revisionsData } = useQuery({
        queryKey: ["dsa-revisions-today"],
        queryFn: getTodayRevisionsApi,
    });

    const solveMutation = useMutation({
        mutationFn: solveDsaProblemApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dsa-revisions-today"] });
        },
    });

    const problems = data?.data || [];
    const revisions = revisionsData?.data || [];

    return (
        <AppLayout>
            <PageTransition>
                <h1 className="text-2xl font-semibold">DSA Tracker</h1>
                <p className="mt-2 text-white/60">Solve and revise with SRS.</p>

                {/* Revisions */}
                <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                    <h2 className="text-lg font-semibold">Today’s Revisions</h2>

                    {revisions.length === 0 ? (
                        <p className="mt-2 text-sm text-white/60">No revisions today ✅</p>
                    ) : (
                        <ul className="mt-3 space-y-2">
                            {revisions.map((r) => (
                                <li
                                    key={r._id}
                                    className="rounded-lg border border-white/10 bg-black/30 p-3"
                                >
                                    <p className="text-sm font-medium">
                                        {r.problemId?.title}
                                    </p>
                                    <p className="text-xs text-white/50">
                                        {r.problemId?.topic} • {r.problemId?.difficulty}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Master List */}
                <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                    <h2 className="text-lg font-semibold">All Problems</h2>

                    {isLoading && <p className="mt-3 text-white/60">Loading...</p>}
                    {isError && <p className="mt-3 text-red-400">Failed to load</p>}

                    <div className="mt-4 space-y-3">
                        {problems.map((p) => (
                            <div
                                key={p._id}
                                className="rounded-lg border border-white/10 bg-black/30 p-3"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium">{p.title}</p>
                                        <p className="text-xs text-white/50">
                                            {p.topic} • {p.difficulty}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {[1, 3, 7].map((r) => (
                                            <button
                                                key={r}
                                                onClick={() =>
                                                    solveMutation.mutate({ problemId: p._id, selfRating: r })
                                                }
                                                className="rounded-md bg-white text-black px-2 py-1 text-xs font-medium"
                                                disabled={solveMutation.isPending}
                                            >
                                                {r}d
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {solveMutation.isPending && (
                                    <p className="mt-2 text-xs text-white/40">Saving...</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </PageTransition>
        </AppLayout>
    );
}
