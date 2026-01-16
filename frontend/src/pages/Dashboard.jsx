// import { useQuery } from "@tanstack/react-query";
// import { getOverviewApi } from "../api/analytics";
// import AppLayout from "../layouts/AppLayout";

// export default function Dashboard() {
//   const weekNumber = 1;
//   const dayNumber = 1;

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["overview", weekNumber, dayNumber],
//     queryFn: () => getOverviewApi({ weekNumber, dayNumber }),
//   });

//   const overview = data?.data;

//   return (
//     <AppLayout>
//       <h1 className="text-2xl font-semibold">Dashboard</h1>
//       <p className="mt-2 text-white/60">Today summary</p>

//       <div className="mt-6 grid gap-4 sm:grid-cols-3">
//         <div className="rounded-xl border theme-border theme-card p-4">
//           <p className="text-sm text-white/60">Streak</p>
//           {isLoading ? (
//             <p className="mt-2 text-white/60">Loading...</p>
//           ) : (
//             <p className="mt-2 text-2xl font-semibold">
//               {overview?.streak?.current ?? 0}🔥
//             </p>
//           )}
//         </div>

//         <div className="rounded-xl border theme-border theme-card p-4">
//           <p className="text-sm text-white/60">Today Completion</p>
//           {isLoading ? (
//             <p className="mt-2 text-white/60">Loading...</p>
//           ) : (
//             <p className="mt-2 text-2xl font-semibold">
//               {overview?.tasks?.completionPercentage ?? 0}%
//             </p>
//           )}
//         </div>

//         <div className="rounded-xl border theme-border theme-card p-4">
//           <p className="text-sm text-white/60">Deep Work</p>
//           {isLoading ? (
//             <p className="mt-2 text-white/60">Loading...</p>
//           ) : (
//             <p className="mt-2 text-2xl font-semibold">
//               {overview?.focus?.totalHours ?? 0}h
//             </p>
//           )}
//         </div>
//       </div>

//       {isError && (
//         <p className="mt-6 text-sm text-red-400">
//           Failed to load overview. Please login again.
//         </p>
//       )}
//     </AppLayout>
//   );
// }

import { useQuery } from "@tanstack/react-query";
import { getOverviewApi } from "../api/analytics";
import AppLayout from "../layouts/AppLayout";
import PageTransition from "../components/PageTransition";


export default function Dashboard() {
    const weekNumber = 1;
    const dayNumber = 1;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["overview", weekNumber, dayNumber],
        queryFn: () => getOverviewApi({ weekNumber, dayNumber }),
    });

    const overview = data?.data;

    return (
        <AppLayout>
            <PageTransition>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="mt-2 opacity-70">Today summary</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                        <p className="text-sm opacity-70">Streak</p>
                        {isLoading ? (
                            <p className="mt-2 opacity-70">Loading...</p>
                        ) : (
                            <p className="mt-2 text-2xl font-semibold">
                                {overview?.streak?.current ?? 0}🔥
                            </p>
                        )}
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                        <p className="text-sm opacity-70">Today Completion</p>
                        {isLoading ? (
                            <p className="mt-2 opacity-70">Loading...</p>
                        ) : (
                            <p className="mt-2 text-2xl font-semibold">
                                {overview?.tasks?.completionPercentage ?? 0}%
                            </p>
                        )}
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                        <p className="text-sm opacity-70">Deep Work</p>
                        {isLoading ? (
                            <p className="mt-2 opacity-70">Loading...</p>
                        ) : (
                            <p className="mt-2 text-2xl font-semibold">
                                {overview?.focus?.totalHours ?? 0}h
                            </p>
                        )}
                    </div>
                </div>

                {isError && (
                    <p className="mt-6 text-sm text-red-500">
                        Failed to load overview. Please login again.
                    </p>
                )}
            </PageTransition>
        </AppLayout>
    );
}