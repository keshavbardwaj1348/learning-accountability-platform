// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { getOverviewApi } from "../api/analytics";
// import { getCurrentDayPlanApi } from "../api/plan";
// import AppLayout from "../layouts/AppLayout";
// import PageTransition from "../components/PageTransition";

// function StatCardSkeleton() {
//   return (
//     <div className="rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse">
//       <div className="h-3 w-24 rounded bg-white/10" />
//       <div className="mt-3 h-7 w-20 rounded bg-white/10" />
//     </div>
//   );
// }

// function StatCard({ label, value }) {
//   return (
//     <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
//       <p className="text-sm opacity-70">{label}</p>
//       <p className="mt-2 text-2xl font-semibold">{value}</p>
//     </div>
//   );
// }

// export default function Dashboard() {
//   const navigate = useNavigate();

//   // 1) Fetch current day from backend
//   const {
//     data: currentDayRes,
//     isLoading: isLoadingCurrentDay,
//     isError: isErrorCurrentDay,
//     refetch: refetchCurrentDay,
//   } = useQuery({
//     queryKey: ["current-day"],
//     queryFn: () => getCurrentDayPlanApi(),
//   });

//   // tolerant parsing
//   const currentDay =
//     currentDayRes?.data?.data || currentDayRes?.data || currentDayRes;

//   const weekNumber = currentDay?.weekNumber;
//   const dayNumber = currentDay?.day?.dayNumber;

//   // 2) Fetch overview for today's week/day
//   const {
//     data: overviewRes,
//     isLoading: isLoadingOverview,
//     isError: isErrorOverview,
//     refetch: refetchOverview,
//   } = useQuery({
//     queryKey: ["overview", weekNumber, dayNumber],
//     queryFn: () => getOverviewApi({ weekNumber, dayNumber }),
//     enabled: Boolean(weekNumber && dayNumber),
//   });

//   const overview = overviewRes?.data;

//   const isLoading = isLoadingCurrentDay || isLoadingOverview;
//   const isError = isErrorCurrentDay || isErrorOverview;

//   const handleGoToToday = () => {
//     if (!weekNumber || !dayNumber) return;
//     navigate(`/daily/${weekNumber}/${dayNumber}`);
//   };

//   const handleRetry = () => {
//     refetchCurrentDay();
//     refetchOverview();
//   };

//   return (
//     <AppLayout>
//       <PageTransition>
//         <div className="flex items-start justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-semibold">Dashboard</h1>
//             <p className="mt-2 opacity-70">Today summary</p>

//             {weekNumber && dayNumber && (
//               <p className="mt-1 text-sm opacity-60">
//                 Current Day: Week {weekNumber}, Day {dayNumber}
//               </p>
//             )}
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => navigate("/roadmap")}
//               className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
//             >
//               Roadmap
//             </button>

//             <button
//               onClick={() => navigate("/analytics")}
//               className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
//             >
//               Analytics
//             </button>

//             <button
//               onClick={handleGoToToday}
//               disabled={!weekNumber || !dayNumber}
//               className="rounded-lg bg-white text-black px-4 py-2 text-sm font-medium disabled:opacity-40"
//             >
//               Go to Today →
//             </button>
//           </div>
//         </div>

//         {/* Error State */}
//         {isError && (
//           <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
//             <p className="text-sm font-semibold text-red-300">
//               Failed to load dashboard data
//             </p>
//             <p className="mt-1 text-xs text-red-200/70">
//               Backend might be down or your session expired.
//             </p>

//             <div className="mt-3 flex gap-2">
//               <button
//                 onClick={handleRetry}
//                 className="rounded-lg bg-white text-black px-4 py-2 text-sm font-medium"
//               >
//                 Retry
//               </button>

//               <button
//                 onClick={() => navigate("/login")}
//                 className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
//               >
//                 Login
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Stats */}
//         <div className="mt-6 grid gap-4 sm:grid-cols-3">
//           {isLoading ? (
//             <>
//               <StatCardSkeleton />
//               <StatCardSkeleton />
//               <StatCardSkeleton />
//             </>
//           ) : (
//             <>
//               <StatCard
//                 label="Streak"
//                 value={`${overview?.streak?.current ?? 0}🔥`}
//               />
//               <StatCard
//                 label="Today Completion"
//                 value={`${overview?.tasks?.completionPercentage ?? 0}%`}
//               />
//               <StatCard
//                 label="Deep Work"
//                 value={`${overview?.focus?.totalHours ?? 0}h`}
//               />
//             </>
//           )}
//         </div>
//       </PageTransition>
//     </AppLayout>
//   );
// }




import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getOverviewApi } from "../api/analytics";
import { getCurrentDayPlanApi } from "../api/plan";
import AppLayout from "../layouts/AppLayout";
import PageTransition from "../components/PageTransition";

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse">
      <div className="h-3 w-1/3 rounded bg-white/10" />
      <div className="mt-3 h-7 w-1/2 rounded bg-white/10" />
    </div>
  );
}

function StatCard({ label, value, isLoading }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
      <p className="text-sm opacity-70">{label}</p>
      {isLoading ? (
        <p className="mt-2 opacity-70">Loading...</p>
      ) : (
        <p className="mt-2 text-2xl font-semibold">{value}</p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  // 1) Fetch current day from backend
  const {
    data: currentDayRes,
    isLoading: isLoadingCurrentDay,
    isError: isErrorCurrentDay,
    refetch: refetchCurrentDay,
  } = useQuery({
    queryKey: ["current-day"],
    queryFn: () => getCurrentDayPlanApi(),
  });

  // api returns res.data already
  const currentDay =
    currentDayRes?.data?.data || currentDayRes?.data || currentDayRes;

  const weekNumber = currentDay?.weekNumber;
  const dayNumber = currentDay?.day?.dayNumber;

  // 2) Fetch overview for today's week/day
  const {
    data: overviewRes,
    isLoading: isLoadingOverview,
    isError: isErrorOverview,
    refetch: refetchOverview,
  } = useQuery({
    queryKey: ["overview", weekNumber, dayNumber],
    queryFn: () => getOverviewApi({ weekNumber, dayNumber }),
    enabled: Boolean(weekNumber && dayNumber),
  });

  const overview = overviewRes?.data;

  const isLoading = isLoadingCurrentDay || isLoadingOverview;
  const isError = isErrorCurrentDay || isErrorOverview;

  const handleGoToToday = () => {
    if (!weekNumber || !dayNumber) return;
    navigate(`/daily/${weekNumber}/${dayNumber}`);
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="mt-2 opacity-70">Today summary</p>

            {!isLoadingCurrentDay && weekNumber && dayNumber && (
              <p className="mt-1 text-sm opacity-60">
                Current Day: Week {weekNumber}, Day {dayNumber}
              </p>
            )}
          </div>

          <button
            onClick={handleGoToToday}
            disabled={!weekNumber || !dayNumber}
            className="rounded-lg bg-white text-black px-4 py-2 text-sm font-medium disabled:opacity-40"
          >
            Go to Today →
          </button>
        </div>

        {/* ✅ Error state */}
        {!isLoading && isError && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm font-semibold text-red-300">
              Failed to load dashboard
            </p>
            <p className="mt-1 text-xs text-red-200/70">
              Check backend + login session, then retry.
            </p>

            <button
              onClick={() => {
                refetchCurrentDay();
                refetchOverview();
              }}
              className="mt-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* ✅ Empty state (current day missing) */}
        {!isLoadingCurrentDay && !isErrorCurrentDay && (!weekNumber || !dayNumber) && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold">No current day found</p>
            <p className="mt-1 text-xs text-white/50">
              Backend did not return a valid Week/Day.
            </p>
          </div>
        )}

        {/* ✅ Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                label="Streak"
                value={`${overview?.streak?.current ?? 0}🔥`}
                isLoading={false}
              />
              <StatCard
                label="Today Completion"
                value={`${overview?.tasks?.completionPercentage ?? 0}%`}
                isLoading={false}
              />
              <StatCard
                label="Deep Work"
                value={`${overview?.focus?.totalHours ?? 0}h`}
                isLoading={false}
              />
            </>
          )}
        </div>
      </PageTransition>
    </AppLayout>
  );
}
