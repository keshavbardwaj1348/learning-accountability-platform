// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useState } from "react";
// import { getCurrentDayPlanApi } from "../api/plan";
// import { updateTaskStatusApi } from "../api/tasks";
// import { getDayTaskProgressApi } from "../api/tasksProgress";
// import { updateTaskNotesApi } from "../api/notes";
// import PageTransition from "../components/PageTransition";
// import {
//     startPomodoroApi,
//     stopPomodoroApi,
//     getPomodoroDailySummaryApi,
// } from "../api/pomodoro";
// import AppLayout from "../layouts/AppLayout";
// import AccordionSection from "../components/AccordionSection";


// export default function Daily() {
//     const queryClient = useQueryClient();
//     const [openNotes, setOpenNotes] = useState({});
//     const [draftNotes, setDraftNotes] = useState({});
//     const [selectedTaskKey, setSelectedTaskKey] = useState(null);

//     const { data, isLoading, isError } = useQuery({
//         queryKey: ["current-day-plan"],
//         queryFn: getCurrentDayPlanApi,
//     });

//     const dayData = data?.data?.day;
//     const weekNumber = data?.data?.weekNumber || 1;
//     const dayNumber = dayData?.dayNumber || 1;

//     const { data: progressData } = useQuery({
//         queryKey: ["day-progress", weekNumber, dayNumber],
//         queryFn: () => getDayTaskProgressApi({ weekNumber, dayNumber }),
//         enabled: !!dayData,
//     });

//     const { data: pomodoroSummary } = useQuery({
//         queryKey: ["pomodoro-summary", weekNumber, dayNumber],
//         queryFn: () => getPomodoroDailySummaryApi({ weekNumber, dayNumber }),
//         enabled: !!dayData,
//     });

//     const progressMap = {};
//     const notesMap = {};
//     (progressData?.data || []).forEach((t) => {
//         progressMap[t.taskKey] = t.status;
//         notesMap[t.taskKey] = t.notesMarkdown || "";
//     });

//     const statusMutation = useMutation({
//         mutationFn: updateTaskStatusApi,
//         onSettled: () => {
//             queryClient.invalidateQueries({
//                 queryKey: ["day-progress", weekNumber, dayNumber],
//             });
//             queryClient.invalidateQueries({
//                 queryKey: ["overview", weekNumber, dayNumber],
//             });
//         },
//     });

//     const notesMutation = useMutation({
//         mutationFn: updateTaskNotesApi,
//         onSuccess: () => {
//             queryClient.invalidateQueries({
//                 queryKey: ["day-progress", weekNumber, dayNumber],
//             });
//         },
//     });

//     const startPomodoroMutation = useMutation({
//         mutationFn: startPomodoroApi,
//         onSuccess: () => {
//             queryClient.invalidateQueries({
//                 queryKey: ["pomodoro-summary", weekNumber, dayNumber],
//             });
//         },
//     });

//     const stopPomodoroMutation = useMutation({
//         mutationFn: stopPomodoroApi,
//         onSuccess: () => {
//             queryClient.invalidateQueries({
//                 queryKey: ["pomodoro-summary", weekNumber, dayNumber],
//             });
//             queryClient.invalidateQueries({
//                 queryKey: ["overview", weekNumber, dayNumber],
//             });
//         },
//     });

//     const toggleTask = (taskKey, checked) => {
//         statusMutation.mutate({
//             taskKey,
//             status: checked ? "COMPLETED" : "NOT_STARTED",
//             weekNumber,
//             dayNumber,
//         });
//     };

//     const toggleNotes = (taskKey) => {
//         setOpenNotes((prev) => ({ ...prev, [taskKey]: !prev[taskKey] }));

//         if (!openNotes[taskKey]) {
//             setDraftNotes((prev) => ({
//                 ...prev,
//                 [taskKey]: prev[taskKey] ?? notesMap[taskKey] ?? "",
//             }));
//         }
//     };

//     const saveNotes = (taskKey) => {
//         notesMutation.mutate({
//             taskKey,
//             notesMarkdown: draftNotes[taskKey] ?? "",
//         });
//     };

//     const startFocus = () => {
//         if (!selectedTaskKey) return;

//         startPomodoroMutation.mutate({
//             taskKey: selectedTaskKey,
//             weekNumber,
//             dayNumber,
//         });
//     };

//     const stopFocus = () => {
//         stopPomodoroMutation.mutate();
//     };

//     const totalHours = pomodoroSummary?.data?.totalHours ?? 0;
//     const totalSessions = pomodoroSummary?.data?.totalSessions ?? 0;

//     return (
//         <AppLayout>
//             <PageTransition>
//                 <h1 className="text-2xl font-semibold">Daily Plan</h1>

//                 {isLoading && <p className="mt-4 text-white/60">Loading...</p>}
//                 {isError && <p className="mt-4 text-red-400">Failed to load plan</p>}

//                 {/* Focus Widget */}
//                 {dayData && (
//                     <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
//                         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                             <div>
//                                 <p className="text-sm text-white/60">Focus Timer (Pomodoro)</p>
//                                 <p className="mt-1 text-sm text-white/80">
//                                     Sessions: {totalSessions} • Hours: {totalHours}
//                                 </p>
//                             </div>

//                             <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
//                                 <select
//                                     value={selectedTaskKey || ""}
//                                     onChange={(e) => setSelectedTaskKey(e.target.value)}
//                                     className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/30"
//                                 >
//                                     <option value="">Select a task...</option>
//                                     {dayData.schedule.map((block, idx) =>
//                                         block.tasks.map((t, i) => {
//                                             const taskKey = `W${weekNumber}-D${dayData.dayNumber}-${block.category}-${idx}-${i}`;
//                                             return (
//                                                 <option key={taskKey} value={taskKey}>
//                                                     {block.category}: {t}
//                                                 </option>
//                                             );
//                                         })
//                                     )}
//                                 </select>

//                                 <button
//                                     onClick={startFocus}
//                                     disabled={!selectedTaskKey || startPomodoroMutation.isPending}
//                                     className="rounded-lg bg-white text-black px-4 py-2 text-sm font-medium disabled:opacity-60"
//                                 >
//                                     {startPomodoroMutation.isPending ? "Starting..." : "Start"}
//                                 </button>

//                                 <button
//                                     onClick={stopFocus}
//                                     disabled={stopPomodoroMutation.isPending}
//                                     className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-60"
//                                 >
//                                     {stopPomodoroMutation.isPending ? "Stopping..." : "Stop"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {dayData && (
//                     <div className="mt-6 space-y-4">
//                         <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
//                             <p className="text-sm text-white/60">Day</p>
//                             <p className="text-lg font-semibold">
//                                 Week {weekNumber} — Day {dayData.dayNumber} ({dayData.label})
//                             </p>
//                         </div>

//                         {dayData.schedule.map((block, idx) => (
//                             <AccordionSection
//                                 key={idx}
//                                 title={block.topic}
//                                 subtitle={`${block.timeBlock} • ${block.category}`}
//                             >
//                                 <ul className="mt-3 space-y-3">
//                                     {block.tasks.map((t, i) => {
//                                         const taskKey = `W${weekNumber}-D${dayData.dayNumber}-${block.category}-${idx}-${i}`;
//                                         const status = progressMap[taskKey] || "NOT_STARTED";
//                                         const checked = status === "COMPLETED";
//                                         const isNotesOpen = !!openNotes[taskKey];

//                                         return (
//                                             <li
//                                                 key={i}
//                                                 className="rounded-lg border theme-border theme-card p-3"
//                                             >
//                                                 <div className="flex items-start gap-3">
//                                                     <input
//                                                         type="checkbox"
//                                                         checked={checked}
//                                                         onChange={(e) => toggleTask(taskKey, e.target.checked)}
//                                                         className="mt-1 h-4 w-4"
//                                                     />

//                                                     <div className="flex-1">
//                                                         <p
//                                                             className={`text-sm ${checked ? "opacity-40 line-through" : "opacity-80"
//                                                                 }`}
//                                                         >
//                                                             {t}
//                                                         </p>

//                                                         <div className="mt-2 flex items-center gap-2">
//                                                             <button
//                                                                 onClick={() => toggleNotes(taskKey)}
//                                                                 className="text-xs rounded-md border theme-border theme-card px-2 py-1 hover:opacity-80"
//                                                             >
//                                                                 {isNotesOpen ? "Hide Notes" : "Add Notes"}
//                                                             </button>

//                                                             <span className="text-xs opacity-50">{taskKey}</span>
//                                                         </div>

//                                                         {isNotesOpen && (
//                                                             <div className="mt-3 space-y-2">
//                                                                 <textarea
//                                                                     value={draftNotes[taskKey] ?? ""}
//                                                                     onChange={(e) =>
//                                                                         setDraftNotes((prev) => ({
//                                                                             ...prev,
//                                                                             [taskKey]: e.target.value,
//                                                                         }))
//                                                                     }
//                                                                     rows={4}
//                                                                     placeholder="Write notes in Markdown..."
//                                                                     className="w-full rounded-lg border theme-border theme-card px-3 py-2 text-sm outline-none"
//                                                                 />

//                                                                 <div className="flex items-center gap-2">
//                                                                     <button
//                                                                         onClick={() => saveNotes(taskKey)}
//                                                                         disabled={notesMutation.isPending}
//                                                                         className="text-xs rounded-md bg-white text-black px-3 py-1 font-medium disabled:opacity-60"
//                                                                     >
//                                                                         {notesMutation.isPending ? "Saving..." : "Save Notes"}
//                                                                     </button>

//                                                                     <p className="text-xs opacity-50">
//                                                                         Saved notes are stored in DB
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </li>
//                                         );
//                                     })}
//                                 </ul>
//                             </AccordionSection>
//                         ))}

//                     </div>
//                 )}
//             </PageTransition>
//         </AppLayout>
//     );
// }


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

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

export default function Daily() {
  const { weekNumber, dayNumber } = useParams();
  const W = Number(weekNumber);
  const D = Number(dayNumber);

  const queryClient = useQueryClient();
  const [openNotes, setOpenNotes] = useState({});
  const [draftNotes, setDraftNotes] = useState({});
  const [selectedTaskKey, setSelectedTaskKey] = useState(null);

  // 1) Load full week plan
  const {
    data: weekData,
    isLoading: weekLoading,
    isError: weekError,
  } = useQuery({
    queryKey: ["week-plan", W],
    queryFn: () => getWeekPlanApi({ weekNumber: W }),
    enabled: !!W,
  });

  const week = weekData?.data;
  const dayData = week?.days?.find((x) => x.dayNumber === D);

  // 2) Load progress for that day
  const { data: progressData } = useQuery({
    queryKey: ["day-progress", W, D],
    queryFn: () => getDayTaskProgressApi({ weekNumber: W, dayNumber: D }),
    enabled: !!W && !!D,
  });

  // 3) Load pomodoro summary for that day
  const { data: pomodoroSummary } = useQuery({
    queryKey: ["pomodoro-summary", W, D],
    queryFn: () => getPomodoroDailySummaryApi({ weekNumber: W, dayNumber: D }),
    enabled: !!W && !!D,
  });

  const progressMap = {};
  const notesMap = {};
  (progressData?.data || []).forEach((t) => {
    progressMap[t.taskKey] = t.status;
    notesMap[t.taskKey] = t.notesMarkdown || "";
  });

  const statusMutation = useMutation({
    mutationFn: updateTaskStatusApi,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["day-progress", W, D] });
      queryClient.invalidateQueries({ queryKey: ["overview", W, D] });
    },
  });

  const notesMutation = useMutation({
    mutationFn: updateTaskNotesApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["day-progress", W, D] });
    },
  });

  const startPomodoroMutation = useMutation({
    mutationFn: startPomodoroApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pomodoro-summary", W, D] });
    },
  });

  const stopPomodoroMutation = useMutation({
    mutationFn: stopPomodoroApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pomodoro-summary", W, D] });
      queryClient.invalidateQueries({ queryKey: ["overview", W, D] });
    },
  });

  const toggleTask = (taskKey, checked) => {
    statusMutation.mutate({
      taskKey,
      status: checked ? "COMPLETED" : "NOT_STARTED",
      weekNumber: W,
      dayNumber: D,
    });
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

  return (
    <AppLayout>
      <PageTransition>
        <h1 className="text-2xl font-semibold">Daily Plan</h1>

        {weekLoading && <p className="mt-4 opacity-70">Loading week...</p>}
        {weekError && <p className="mt-4 text-red-500">Failed to load week</p>}

        {!weekLoading && dayData && (
          <>
            {/* Focus Widget */}
            <div className="mt-6 rounded-xl border theme-border theme-card p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm opacity-70">Focus Timer (Pomodoro)</p>
                  <p className="mt-1 text-sm opacity-80">
                    Sessions: {totalSessions} • Hours: {totalHours}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    value={selectedTaskKey || ""}
                    onChange={(e) => setSelectedTaskKey(e.target.value)}
                    className="rounded-lg border theme-border theme-card px-3 py-2 text-sm outline-none"
                  >
                    <option value="">Select a task...</option>
                    {dayData.schedule.map((block, idx) =>
                      block.tasks.map((t, i) => {
                        const taskKey = `W${W}-D${dayData.dayNumber}-${block.category}-${idx}-${i}`;
                        return (
                          <option key={taskKey} value={taskKey}>
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
                                toggleTask(taskKey, e.target.checked)
                              }
                              className="mt-1 h-4 w-4"
                            />

                            <div className="flex-1">
                              <p
                                className={`text-sm ${
                                  checked
                                    ? "opacity-40 line-through"
                                    : "opacity-80"
                                }`}
                              >
                                {t}
                              </p>

                              <div className="mt-2 flex items-center gap-2">
                                <button
                                  onClick={() => toggleNotes(taskKey)}
                                  className="text-xs rounded-md border theme-border theme-card px-2 py-1 hover:opacity-80"
                                >
                                  {isNotesOpen ? "Hide Notes" : "Add Notes"}
                                </button>

                                <span className="text-xs opacity-50">
                                  {taskKey}
                                </span>
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
                                      disabled={notesMutation.isPending}
                                      className="text-xs rounded-md bg-white text-black px-3 py-1 font-medium disabled:opacity-60"
                                    >
                                      {notesMutation.isPending
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

        {!weekLoading && !dayData && (
          <p className="mt-6 text-red-500">
            Day not found for Week {W}, Day {D}
          </p>
        )}
      </PageTransition>
    </AppLayout>
  );
}