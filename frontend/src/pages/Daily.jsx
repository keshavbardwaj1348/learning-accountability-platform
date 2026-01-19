// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import toast from "react-hot-toast";

// import AppLayout from "../layouts/AppLayout";
// import PageTransition from "../components/PageTransition";
// import AccordionSection from "../components/AccordionSection";

// import { getWeekPlanApi } from "../api/weeklyPlan";
// import { getDayTaskProgressApi } from "../api/tasksProgress";
// import { updateTaskStatusApi } from "../api/tasks";
// import { updateTaskNotesApi } from "../api/notes";
// import {
//   startPomodoroApi,
//   stopPomodoroApi,
//   getPomodoroDailySummaryApi,
// } from "../api/pomodoro";

// function CardSkeleton() {
//   return (
//     <div className="rounded-xl border theme-border theme-card p-4 animate-pulse">
//       <div className="h-4 w-1/3 bg-white/10 rounded" />
//       <div className="mt-3 h-3 w-2/3 bg-white/10 rounded" />
//       <div className="mt-2 h-3 w-1/2 bg-white/10 rounded" />
//     </div>
//   );
// }

// function formatCompletedAt(dateValue) {
//   if (!dateValue) return "";
//   const d = new Date(dateValue);
//   if (Number.isNaN(d.getTime())) return "";
//   return d.toLocaleString();
// }

// export default function Daily() {
//   const { weekNumber, dayNumber } = useParams();
//   const W = Number(weekNumber);
//   const D = Number(dayNumber);

//   const queryClient = useQueryClient();

//   const [openNotes, setOpenNotes] = useState({});
//   const [draftNotes, setDraftNotes] = useState({});
//   const [selectedTaskKey, setSelectedTaskKey] = useState(null);

//   // small UX feedback map for notes save
//   const [notesSavedMap, setNotesSavedMap] = useState({});

//   // 1) Load full week plan
//   const {
//     data: weekData,
//     isLoading: weekLoading,
//     isError: weekError,
//     refetch: refetchWeek,
//   } = useQuery({
//     queryKey: ["week-plan", W],
//     queryFn: () => getWeekPlanApi({ weekNumber: W }),
//     enabled: !!W,
//   });

//   const week = weekData?.data;
//   const dayData = week?.days?.find((x) => x.dayNumber === D);

//   // 2) Load progress for that day
//   const {
//     data: progressData,
//     isLoading: progressLoading,
//     isError: progressError,
//     refetch: refetchProgress,
//   } = useQuery({
//     queryKey: ["day-progress", W, D],
//     queryFn: () => getDayTaskProgressApi({ weekNumber: W, dayNumber: D }),
//     enabled: !!W && !!D,
//   });

//   // 3) Load pomodoro summary for that day
//   const {
//     data: pomodoroSummary,
//     isLoading: pomodoroLoading,
//     isError: pomodoroError,
//     refetch: refetchPomodoro,
//   } = useQuery({
//     queryKey: ["pomodoro-summary", W, D],
//     queryFn: () => getPomodoroDailySummaryApi({ weekNumber: W, dayNumber: D }),
//     enabled: !!W && !!D,
//   });

//   const progressMap = useMemo(() => {
//     const map = {};
//     (progressData?.data || []).forEach((t) => {
//       map[t.taskKey] = t.status;
//     });
//     return map;
//   }, [progressData]);

//   const completedAtMap = useMemo(() => {
//     const map = {};
//     (progressData?.data || []).forEach((t) => {
//       map[t.taskKey] = t.completedAt || null;
//     });
//     return map;
//   }, [progressData]);

//   const notesMap = useMemo(() => {
//     const map = {};
//     (progressData?.data || []).forEach((t) => {
//       map[t.taskKey] = t.notesMarkdown || "";
//     });
//     return map;
//   }, [progressData]);

//   const statusMutation = useMutation({
//     mutationFn: updateTaskStatusApi,
//     onSuccess: (_, variables) => {
//       if (variables.status === "COMPLETED") toast.success("Task completed ✅");
//       if (variables.status === "IN_PROGRESS") toast.success("In progress 🟡");
//       if (variables.status === "NOT_STARTED") toast.success("Reset to not started ⬜");
//     },
//     onError: () => {
//       toast.error("Failed to update task status");
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["day-progress", W, D] });
//       queryClient.invalidateQueries({ queryKey: ["overview", W, D] });
//     },
//   });

//   const notesMutation = useMutation({
//     mutationFn: updateTaskNotesApi,
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ["day-progress", W, D] });

//       setNotesSavedMap((prev) => ({ ...prev, [variables.taskKey]: true }));
//       setTimeout(() => {
//         setNotesSavedMap((prev) => ({ ...prev, [variables.taskKey]: false }));
//       }, 1200);

//       toast.success("Notes saved ✅");
//     },
//     onError: () => {
//       toast.error("Failed to save notes");
//     },
//   });

//   const startPomodoroMutation = useMutation({
//     mutationFn: startPomodoroApi,
//     onSuccess: () => {
//       toast.success("Focus started 🧠");
//       queryClient.invalidateQueries({ queryKey: ["pomodoro-summary", W, D] });
//     },
//     onError: () => {
//       toast.error("Failed to start focus");
//     },
//   });

//   const stopPomodoroMutation = useMutation({
//     mutationFn: stopPomodoroApi,
//     onSuccess: () => {
//       toast.success("Focus stopped ⏹️");
//       queryClient.invalidateQueries({ queryKey: ["pomodoro-summary", W, D] });
//       queryClient.invalidateQueries({ queryKey: ["overview", W, D] });
//     },
//     onError: () => {
//       toast.error("Failed to stop focus");
//     },
//   });

//   const setTaskStatus = (taskKey, status) => {
//     statusMutation.mutate({
//       taskKey,
//       status,
//       weekNumber: W,
//       dayNumber: D,
//     });
//   };

//   // checkbox = only controls completed/not started
//   const toggleTaskCompleted = (taskKey, checked) => {
//     setTaskStatus(taskKey, checked ? "COMPLETED" : "NOT_STARTED");
//   };

//   const toggleNotes = (taskKey) => {
//     setOpenNotes((prev) => ({ ...prev, [taskKey]: !prev[taskKey] }));

//     if (!openNotes[taskKey]) {
//       setDraftNotes((prev) => ({
//         ...prev,
//         [taskKey]: prev[taskKey] ?? notesMap[taskKey] ?? "",
//       }));
//     }
//   };

//   const saveNotes = (taskKey) => {
//     notesMutation.mutate({
//       taskKey,
//       notesMarkdown: draftNotes[taskKey] ?? "",
//     });
//   };

//   const startFocus = () => {
//     if (!selectedTaskKey) return;
//     startPomodoroMutation.mutate({
//       taskKey: selectedTaskKey,
//       weekNumber: W,
//       dayNumber: D,
//     });
//   };

//   const stopFocus = () => {
//     stopPomodoroMutation.mutate();
//   };

//   const totalHours = pomodoroSummary?.data?.totalHours ?? 0;
//   const totalSessions = pomodoroSummary?.data?.totalSessions ?? 0;

//   const isAnyError = weekError || progressError || pomodoroError;
//   const isPageLoading = weekLoading;

//   useEffect(() => {
//     setSelectedTaskKey(null);
//   }, [W, D]);

//   return (
//     <AppLayout>
//       <PageTransition>
//         <div className="flex items-start justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-semibold">Daily Plan</h1>
//             <p className="mt-2 text-white/60">
//               Week {W} • Day {D}
//             </p>
//           </div>

//           {isAnyError && (
//             <button
//               onClick={() => {
//                 refetchWeek();
//                 refetchProgress();
//                 refetchPomodoro();
//               }}
//               className="rounded-lg border theme-border theme-card px-4 py-2 text-sm hover:opacity-80"
//             >
//               Retry
//             </button>
//           )}
//         </div>

//         {isPageLoading && (
//           <div className="mt-6 space-y-4">
//             <CardSkeleton />
//             <CardSkeleton />
//             <CardSkeleton />
//           </div>
//         )}

//         {!weekLoading && isAnyError && (
//           <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
//             <p className="text-sm text-red-300 font-semibold">
//               Failed to load Daily page
//             </p>
//             <p className="mt-1 text-xs text-red-200/70">
//               Check if backend is running and you are logged in.
//             </p>
//           </div>
//         )}

//         {!weekLoading && dayData && !isAnyError && (
//           <>
//             {/* Focus */}
//             <div className="mt-6 rounded-xl border theme-border theme-card p-4">
//               <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-sm opacity-70">Focus Timer (Pomodoro)</p>

//                   {pomodoroLoading ? (
//                     <p className="mt-1 text-sm opacity-50">
//                       Loading focus summary...
//                     </p>
//                   ) : (
//                     <p className="mt-1 text-sm opacity-80">
//                       Sessions: {totalSessions} • Hours: {totalHours}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
//                   <select
//                     value={selectedTaskKey || ""}
//                     onChange={(e) => setSelectedTaskKey(e.target.value)}
//                     className="rounded-lg border theme-border theme-card px-3 py-2 text-sm outline-none"
//                   >
//                     <option value="">Select a task...</option>
//                     {dayData.schedule.map((block, idx) =>
//                       block.tasks.map((t, i) => {
//                         const taskKey = `W${W}-D${dayData.dayNumber}-${block.category}-${idx}-${i}`;
//                         return (
//                           <option key={taskKey} value={taskKey}>
//                             {block.category}: {t}
//                           </option>
//                         );
//                       })
//                     )}
//                   </select>

//                   <button
//                     onClick={startFocus}
//                     disabled={!selectedTaskKey || startPomodoroMutation.isPending}
//                     className="rounded-lg bg-white text-black px-4 py-2 text-sm font-medium disabled:opacity-60"
//                   >
//                     {startPomodoroMutation.isPending ? "Starting..." : "Start"}
//                   </button>

//                   <button
//                     onClick={stopFocus}
//                     disabled={stopPomodoroMutation.isPending}
//                     className="rounded-lg border theme-border theme-card px-4 py-2 text-sm hover:opacity-80 disabled:opacity-60"
//                   >
//                     {stopPomodoroMutation.isPending ? "Stopping..." : "Stop"}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Day Header */}
//             <div className="mt-6 rounded-xl border theme-border theme-card p-4">
//               <p className="text-sm opacity-70">Day</p>
//               <p className="text-lg font-semibold">
//                 Week {W} — Day {dayData.dayNumber} ({dayData.label})
//               </p>

//               {progressLoading && (
//                 <p className="mt-1 text-xs opacity-50">
//                   Loading task progress...
//                 </p>
//               )}
//             </div>

//             {/* Blocks */}
//             <div className="mt-6 space-y-4">
//               {dayData.schedule.map((block, idx) => (
//                 <AccordionSection
//                   key={idx}
//                   title={block.topic}
//                   subtitle={`${block.timeBlock} • ${block.category}`}
//                 >
//                   <ul className="mt-3 space-y-3">
//                     {block.tasks.map((t, i) => {
//                       const taskKey = `W${W}-D${dayData.dayNumber}-${block.category}-${idx}-${i}`;
//                       const status = progressMap[taskKey] || "NOT_STARTED";
//                       const checked = status === "COMPLETED";
//                       const isNotesOpen = !!openNotes[taskKey];
//                       const completedAt = completedAtMap[taskKey];

//                       const isSavingNotes =
//                         notesMutation.isPending &&
//                         notesMutation.variables?.taskKey === taskKey;

//                       // right-side status button label
//                       let actionLabel = "Start";
//                       if (status === "IN_PROGRESS") actionLabel = "Complete";
//                       if (status === "COMPLETED") actionLabel = "Reset";

//                       const onActionClick = () => {
//                         if (status === "NOT_STARTED") {
//                           setTaskStatus(taskKey, "IN_PROGRESS");
//                         } else if (status === "IN_PROGRESS") {
//                           setTaskStatus(taskKey, "COMPLETED");
//                         } else {
//                           setTaskStatus(taskKey, "NOT_STARTED");
//                         }
//                       };

//                       return (
//                         <li
//                           key={i}
//                           className="rounded-lg border theme-border theme-card p-3"
//                         >
//                           <div className="flex items-start gap-3">
//                             <input
//                               type="checkbox"
//                               checked={checked}
//                               onChange={(e) =>
//                                 toggleTaskCompleted(taskKey, e.target.checked)
//                               }
//                               className="mt-1 h-4 w-4"
//                               disabled={statusMutation.isPending}
//                             />

//                             <div className="flex-1">
//                               {/* Task row */}
//                               <div className="flex items-start justify-between gap-3">
//                                 <div className="flex-1">
//                                   <p
//                                     className={`text-sm ${
//                                       checked
//                                         ? "opacity-40 line-through"
//                                         : status === "IN_PROGRESS"
//                                         ? "opacity-90"
//                                         : "opacity-80"
//                                     }`}
//                                   >
//                                     {t}
//                                   </p>

//                                   {/* Small status indicator */}
//                                   <div className="mt-1 flex items-center gap-2">
//                                     {status === "IN_PROGRESS" && (
//                                       <span className="text-[10px] rounded bg-white/10 px-2 py-0.5 text-white/70">
//                                         IN PROGRESS
//                                       </span>
//                                     )}

//                                     {checked && completedAt && (
//                                       <span className="text-xs text-white/40">
//                                         Completed: {formatCompletedAt(completedAt)}
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>

//                                 {/* Action button */}
//                                 <button
//                                   onClick={onActionClick}
//                                   disabled={statusMutation.isPending}
//                                   className="text-xs rounded-md border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10 transition disabled:opacity-60 whitespace-nowrap"
//                                 >
//                                   {actionLabel}
//                                 </button>
//                               </div>

//                               <div className="mt-2 flex flex-wrap items-center gap-2">
//                                 <button
//                                   onClick={() => toggleNotes(taskKey)}
//                                   className="text-xs rounded-md border theme-border theme-card px-2 py-1 hover:opacity-80"
//                                 >
//                                   {isNotesOpen ? "Hide Notes" : "Add Notes"}
//                                 </button>

//                                 <span className="text-xs opacity-50">{taskKey}</span>

//                                 {notesSavedMap[taskKey] && (
//                                   <span className="text-xs text-white/60">
//                                     Saved ✅
//                                   </span>
//                                 )}
//                               </div>

//                               {isNotesOpen && (
//                                 <div className="mt-3 space-y-2">
//                                   <textarea
//                                     value={draftNotes[taskKey] ?? ""}
//                                     onChange={(e) =>
//                                       setDraftNotes((prev) => ({
//                                         ...prev,
//                                         [taskKey]: e.target.value,
//                                       }))
//                                     }
//                                     rows={4}
//                                     placeholder="Write notes in Markdown..."
//                                     className="w-full rounded-lg border theme-border theme-card px-3 py-2 text-sm outline-none"
//                                   />

//                                   <div className="flex items-center gap-2">
//                                     <button
//                                       onClick={() => saveNotes(taskKey)}
//                                       disabled={isSavingNotes}
//                                       className="text-xs rounded-md bg-white text-black px-3 py-1 font-medium disabled:opacity-60"
//                                     >
//                                       {isSavingNotes ? "Saving..." : "Save Notes"}
//                                     </button>

//                                     <p className="text-xs opacity-50">
//                                       Saved notes are stored in DB
//                                     </p>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </AccordionSection>
//               ))}
//             </div>
//           </>
//         )}

//         {!weekLoading && !dayData && !isAnyError && (
//           <p className="mt-6 text-red-500">
//             Day not found for Week {W}, Day {D}
//           </p>
//         )}
//       </PageTransition>
//     </AppLayout>
//   );
// }



import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import AppLayout from "../layouts/AppLayout";
import PageTransition from "../components/PageTransition";
import AccordionSection from "../components/AccordionSection";

import { getWeekPlanApi } from "../api/weeklyPlan";
import { getDayTaskProgressApi } from "../api/tasksProgress";
import { updateTaskStatusApi } from "../api/tasks";
import { updateTaskNotesApi } from "../api/notes";
import {
  startPomodoroApi,
  stopPomodoroApi,
  getPomodoroDailySummaryApi,
} from "../api/pomodoro";

function CardSkeleton() {
  return (
    <div className="rounded-xl border theme-border theme-card p-4 animate-pulse">
      <div className="h-4 w-1/3 bg-white/10 rounded" />
      <div className="mt-3 h-3 w-2/3 bg-white/10 rounded" />
      <div className="mt-2 h-3 w-1/2 bg-white/10 rounded" />
    </div>
  );
}

function formatCompletedAt(dateValue) {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

export default function Daily() {
  const { weekNumber, dayNumber } = useParams();
  const W = Number(weekNumber);
  const D = Number(dayNumber);

  const queryClient = useQueryClient();

  const [openNotes, setOpenNotes] = useState({});
  const [draftNotes, setDraftNotes] = useState({});
  const [selectedTaskKey, setSelectedTaskKey] = useState(null);

  // small UX feedback map for notes save
  const [notesSavedMap, setNotesSavedMap] = useState({});

  // 1) Load full week plan
  const {
    data: weekData,
    isLoading: weekLoading,
    isError: weekError,
    refetch: refetchWeek,
  } = useQuery({
    queryKey: ["week-plan", W],
    queryFn: () => getWeekPlanApi({ weekNumber: W }),
    enabled: !!W,
  });

  const week = weekData?.data;
  const dayData = week?.days?.find((x) => x.dayNumber === D);

  // 2) Load progress for that day
  const {
    data: progressData,
    isLoading: progressLoading,
    isError: progressError,
    refetch: refetchProgress,
  } = useQuery({
    queryKey: ["day-progress", W, D],
    queryFn: () => getDayTaskProgressApi({ weekNumber: W, dayNumber: D }),
    enabled: !!W && !!D,
  });

  // 3) Load pomodoro summary for that day
  const {
    data: pomodoroSummary,
    isLoading: pomodoroLoading,
    isError: pomodoroError,
    refetch: refetchPomodoro,
  } = useQuery({
    queryKey: ["pomodoro-summary", W, D],
    queryFn: () => getPomodoroDailySummaryApi({ weekNumber: W, dayNumber: D }),
    enabled: !!W && !!D,
  });

  const progressMap = useMemo(() => {
    const map = {};
    (progressData?.data || []).forEach((t) => {
      map[t.taskKey] = t.status;
    });
    return map;
  }, [progressData]);

  const completedAtMap = useMemo(() => {
    const map = {};
    (progressData?.data || []).forEach((t) => {
      map[t.taskKey] = t.completedAt || null;
    });
    return map;
  }, [progressData]);

  const notesMap = useMemo(() => {
    const map = {};
    (progressData?.data || []).forEach((t) => {
      map[t.taskKey] = t.notesMarkdown || "";
    });
    return map;
  }, [progressData]);

  const statusMutation = useMutation({
    mutationFn: updateTaskStatusApi,
    onSuccess: (_, variables) => {
      if (variables.status === "COMPLETED") toast.success("Task completed ✅");
      if (variables.status === "IN_PROGRESS") toast.success("In progress 🟡");
      if (variables.status === "NOT_STARTED")
        toast.success("Reset to not started ⬜");
    },
    onError: () => {
      toast.error("Failed to update task status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["day-progress", W, D] });
      queryClient.invalidateQueries({ queryKey: ["overview", W, D] });
    },
  });

  const notesMutation = useMutation({
    mutationFn: updateTaskNotesApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["day-progress", W, D] });

      setNotesSavedMap((prev) => ({ ...prev, [variables.taskKey]: true }));
      setTimeout(() => {
        setNotesSavedMap((prev) => ({ ...prev, [variables.taskKey]: false }));
      }, 1200);

      toast.success("Notes saved ✅");
    },
    onError: () => {
      toast.error("Failed to save notes");
    },
  });

  const startPomodoroMutation = useMutation({
    mutationFn: startPomodoroApi,
    onSuccess: () => {
      toast.success("Focus started 🧠");
      queryClient.invalidateQueries({ queryKey: ["pomodoro-summary", W, D] });
    },
    onError: () => {
      toast.error("Failed to start focus");
    },
  });

  const stopPomodoroMutation = useMutation({
    mutationFn: stopPomodoroApi,
    onSuccess: () => {
      toast.success("Focus stopped ⏹️");
      queryClient.invalidateQueries({ queryKey: ["pomodoro-summary", W, D] });
      queryClient.invalidateQueries({ queryKey: ["overview", W, D] });
    },
    onError: () => {
      toast.error("Failed to stop focus");
    },
  });

  const setTaskStatus = (taskKey, status) => {
    statusMutation.mutate({
      taskKey,
      status,
      weekNumber: W,
      dayNumber: D,
    });
  };

  // checkbox = only controls completed/not started
  const toggleTaskCompleted = (taskKey, checked) => {
    setTaskStatus(taskKey, checked ? "COMPLETED" : "NOT_STARTED");
  };

  const toggleNotes = (taskKey) => {
    setOpenNotes((prev) => ({ ...prev, [taskKey]: !prev[taskKey] }));

    if (!openNotes[taskKey]) {
      setDraftNotes((prev) => ({
        ...prev,
        [taskKey]: prev[taskKey] ?? notesMap[taskKey] ?? "",
      }));
    }
  };

  const saveNotes = (taskKey) => {
    notesMutation.mutate({
      taskKey,
      notesMarkdown: draftNotes[taskKey] ?? "",
    });
  };

  const startFocus = () => {
    if (!selectedTaskKey) return;
    startPomodoroMutation.mutate({
      taskKey: selectedTaskKey,
      weekNumber: W,
      dayNumber: D,
    });
  };

  const stopFocus = () => {
    stopPomodoroMutation.mutate();
  };

  const totalHours = pomodoroSummary?.data?.totalHours ?? 0;
  const totalSessions = pomodoroSummary?.data?.totalSessions ?? 0;

  const isAnyError = weekError || progressError || pomodoroError;
  const isPageLoading = weekLoading;

  useEffect(() => {
    setSelectedTaskKey(null);
  }, [W, D]);

  return (
    <AppLayout>
      <PageTransition>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Daily Plan</h1>
            <p className="mt-2 text-white/60">
              Week {W} • Day {D}
            </p>
          </div>

          {isAnyError && (
            <button
              onClick={() => {
                refetchWeek();
                refetchProgress();
                refetchPomodoro();
              }}
              className="rounded-lg border theme-border theme-card px-4 py-2 text-sm hover:opacity-80"
            >
              Retry
            </button>
          )}
        </div>

        {isPageLoading && (
          <div className="mt-6 space-y-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        )}

        {!weekLoading && isAnyError && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-300 font-semibold">
              Failed to load Daily page
            </p>
            <p className="mt-1 text-xs text-red-200/70">
              Check if backend is running and you are logged in.
            </p>
          </div>
        )}

        {!weekLoading && dayData && !isAnyError && (
          <>
            {/* Focus */}
            <div className="mt-6 rounded-xl border theme-border theme-card p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm opacity-70">Focus Timer (Pomodoro)</p>

                  {pomodoroLoading ? (
                    <p className="mt-1 text-sm opacity-50">
                      Loading focus summary...
                    </p>
                  ) : (
                    <p className="mt-1 text-sm opacity-80">
                      Sessions: {totalSessions} • Hours: {totalHours}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    value={selectedTaskKey || ""}
                    onChange={(e) => setSelectedTaskKey(e.target.value)}
                    className="rounded-lg border theme-border theme-card px-3 py-2 text-sm outline-none"
                  >
                    <option value="" className="bg-black text-white">
                      Select a task...
                    </option>

                    {dayData.schedule.map((block, idx) =>
                      block.tasks.map((t, i) => {
                        const taskKey = `W${W}-D${dayData.dayNumber}-${block.category}-${idx}-${i}`;
                        return (
                          <option
                            key={taskKey}
                            value={taskKey}
                            className="bg-black text-white"
                          >
                            {block.category}: {t}
                          </option>
                        );
                      })
                    )}
                  </select>

                  <button
                    onClick={startFocus}
                    disabled={!selectedTaskKey || startPomodoroMutation.isPending}
                    className="rounded-lg bg-white text-black px-4 py-2 text-sm font-medium disabled:opacity-60"
                  >
                    {startPomodoroMutation.isPending ? "Starting..." : "Start"}
                  </button>

                  <button
                    onClick={stopFocus}
                    disabled={stopPomodoroMutation.isPending}
                    className="rounded-lg border theme-border theme-card px-4 py-2 text-sm hover:opacity-80 disabled:opacity-60"
                  >
                    {stopPomodoroMutation.isPending ? "Stopping..." : "Stop"}
                  </button>
                </div>
              </div>
            </div>

            {/* Day Header */}
            <div className="mt-6 rounded-xl border theme-border theme-card p-4">
              <p className="text-sm opacity-70">Day</p>
              <p className="text-lg font-semibold">
                Week {W} — Day {dayData.dayNumber} ({dayData.label})
              </p>

              {progressLoading && (
                <p className="mt-1 text-xs opacity-50">
                  Loading task progress...
                </p>
              )}
            </div>

            {/* Blocks */}
            <div className="mt-6 space-y-4">
              {dayData.schedule.map((block, idx) => (
                <AccordionSection
                  key={idx}
                  title={block.topic}
                  subtitle={`${block.timeBlock} • ${block.category}`}
                >
                  <ul className="mt-3 space-y-3">
                    {block.tasks.map((t, i) => {
                      const taskKey = `W${W}-D${dayData.dayNumber}-${block.category}-${idx}-${i}`;
                      const status = progressMap[taskKey] || "NOT_STARTED";
                      const checked = status === "COMPLETED";
                      const isNotesOpen = !!openNotes[taskKey];
                      const completedAt = completedAtMap[taskKey];

                      const isSavingNotes =
                        notesMutation.isPending &&
                        notesMutation.variables?.taskKey === taskKey;

                      // right-side status button label
                      let actionLabel = "Start";
                      if (status === "IN_PROGRESS") actionLabel = "Complete";
                      if (status === "COMPLETED") actionLabel = "Reset";

                      const onActionClick = () => {
                        if (status === "NOT_STARTED") {
                          setTaskStatus(taskKey, "IN_PROGRESS");
                        } else if (status === "IN_PROGRESS") {
                          setTaskStatus(taskKey, "COMPLETED");
                        } else {
                          setTaskStatus(taskKey, "NOT_STARTED");
                        }
                      };

                      return (
                        <li
                          key={i}
                          className="rounded-lg border theme-border theme-card p-3"
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) =>
                                toggleTaskCompleted(taskKey, e.target.checked)
                              }
                              className="mt-1 h-4 w-4"
                              disabled={statusMutation.isPending}
                            />

                            <div className="flex-1">
                              {/* Task row */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <p
                                    className={`text-sm ${
                                      checked
                                        ? "opacity-40 line-through"
                                        : status === "IN_PROGRESS"
                                        ? "opacity-90"
                                        : "opacity-80"
                                    }`}
                                  >
                                    {t}
                                  </p>

                                  {/* Small status indicator */}
                                  <div className="mt-1 flex items-center gap-2">
                                    {status === "IN_PROGRESS" && (
                                      <span className="text-[10px] rounded bg-white/10 px-2 py-0.5 text-white/70">
                                        IN PROGRESS
                                      </span>
                                    )}

                                    {checked && completedAt && (
                                      <span className="text-xs text-white/40">
                                        Completed:{" "}
                                        {formatCompletedAt(completedAt)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Action button */}
                                <button
                                  onClick={onActionClick}
                                  disabled={statusMutation.isPending}
                                  className="text-xs rounded-md border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10 transition disabled:opacity-60 whitespace-nowrap"
                                >
                                  {actionLabel}
                                </button>
                              </div>

                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <button
                                  onClick={() => toggleNotes(taskKey)}
                                  className="text-xs rounded-md border theme-border theme-card px-2 py-1 hover:opacity-80"
                                >
                                  {isNotesOpen ? "Hide Notes" : "Add Notes"}
                                </button>

                                <span className="text-xs opacity-50">
                                  {taskKey}
                                </span>

                                {notesSavedMap[taskKey] && (
                                  <span className="text-xs text-white/60">
                                    Saved ✅
                                  </span>
                                )}
                              </div>

                              {isNotesOpen && (
                                <div className="mt-3 space-y-2">
                                  <textarea
                                    value={draftNotes[taskKey] ?? ""}
                                    onChange={(e) =>
                                      setDraftNotes((prev) => ({
                                        ...prev,
                                        [taskKey]: e.target.value,
                                      }))
                                    }
                                    rows={4}
                                    placeholder="Write notes in Markdown..."
                                    className="w-full rounded-lg border theme-border theme-card px-3 py-2 text-sm outline-none"
                                  />

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => saveNotes(taskKey)}
                                      disabled={isSavingNotes}
                                      className="text-xs rounded-md bg-white text-black px-3 py-1 font-medium disabled:opacity-60"
                                    >
                                      {isSavingNotes
                                        ? "Saving..."
                                        : "Save Notes"}
                                    </button>

                                    <p className="text-xs opacity-50">
                                      Saved notes are stored in DB
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionSection>
              ))}
            </div>
          </>
        )}

        {!weekLoading && !dayData && !isAnyError && (
          <p className="mt-6 text-red-500">
            Day not found for Week {W}, Day {D}
          </p>
        )}
      </PageTransition>
    </AppLayout>
  );
}