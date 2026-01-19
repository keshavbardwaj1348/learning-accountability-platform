import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getTodayRevisionsApi,
  listDsaProblemsApi,
  solveDsaProblemApi,
  saveDsaNotesApi,
  resetDsaProblemApi,
} from "../api/dsa";
import AppLayout from "../layouts/AppLayout";
import PageTransition from "../components/PageTransition";

function formatShortDate(dateValue) {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
  });
}

export default function DSA() {
  const queryClient = useQueryClient();

  // Filters
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState("All"); // "All" | "Unsolved" | "Solved"
  const [revisionOnly, setRevisionOnly] = useState(false);

  // Notes UI state per problem
  const [openNotes, setOpenNotes] = useState({});
  const [draftNotes, setDraftNotes] = useState({});
  const [draftCode, setDraftCode] = useState({});

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
    onSuccess: (_, variables) => {
      toast.success(
        `Marked solved ✅ Next revision in ${variables.selfRating} day(s)`
      );
      queryClient.invalidateQueries({ queryKey: ["dsa-revisions-today"] });
      queryClient.invalidateQueries({ queryKey: ["dsa-problems"] });
    },
    onError: () => {
      toast.error("Failed to mark solved. Please try again.");
    },
  });

  const resetMutation = useMutation({
    mutationFn: resetDsaProblemApi,
    onSuccess: () => {
      toast.success("Marked as NOT_STARTED ⬜");
      queryClient.invalidateQueries({ queryKey: ["dsa-revisions-today"] });
      queryClient.invalidateQueries({ queryKey: ["dsa-problems"] });
    },
    onError: () => {
      toast.error("Failed to reset problem");
    },
  });

  const saveNotesMutation = useMutation({
    mutationFn: saveDsaNotesApi,
    onSuccess: () => {
      toast.success("Notes/Code saved ✅");
      queryClient.invalidateQueries({ queryKey: ["dsa-problems"] });
    },
    onError: () => {
      toast.error("Failed to save notes/code");
    },
  });

  const problems = data?.data || [];
  const revisions = revisionsData?.data || [];

  // Build revision problemId set
  const revisionProblemIds = useMemo(() => {
    return new Set(revisions.map((r) => r.problemId?._id).filter(Boolean));
  }, [revisions]);

  // Build dropdown values
  const topics = useMemo(() => {
    const set = new Set();
    problems.forEach((p) => p.topic && set.add(p.topic));
    return ["All", ...Array.from(set).sort()];
  }, [problems]); 

  const difficulties = useMemo(() => {
    const set = new Set();
    problems.forEach((p) => p.difficulty && set.add(p.difficulty));
    return ["All", ...Array.from(set).sort()];
  }, [problems]);

  const getSolvedFromProgress = (p) => {
    return p?.progress?.status === "SOLVED";
  };

  const getLastCodeFromProgress = (p) => {
    const snippets = p?.progress?.codeSnippets || [];
    if (!Array.isArray(snippets) || snippets.length === 0) return "";
    return snippets[snippets.length - 1]?.code || "";
  };

  const getNextRevisionLabel = (p) => {
    const next = p?.progress?.nextRevisionDate;
    if (!next) return null;
    return formatShortDate(next);
  };

  const getLastSolvedLabel = (p) => {
    const last = p?.progress?.lastSolvedAt;
    if (!last) return null;
    return formatShortDate(last);
  };

  // Filtered list
  const filteredProblems = useMemo(() => {
    const query = q.trim().toLowerCase();

    return problems.filter((p) => {
      if (query) {
        const hay = `${p.title || ""} ${p.topic || ""} ${
          p.difficulty || ""
        }`.toLowerCase();
        if (!hay.includes(query)) return false;
      }

      if (topic !== "All" && p.topic !== topic) return false;
      if (difficulty !== "All" && p.difficulty !== difficulty) return false;

      const solved = getSolvedFromProgress(p);

      if (status === "Solved" && !solved) return false;
      if (status === "Unsolved" && solved) return false;

      if (revisionOnly && !revisionProblemIds.has(p._id)) return false;

      return true;
    });
  }, [problems, q, topic, difficulty, status, revisionOnly, revisionProblemIds]);

  const clearFilters = () => {
    setQ("");
    setTopic("All");
    setDifficulty("All");
    setStatus("All");
    setRevisionOnly(false);
  };

  const toggleNotesPanel = (problem) => {
    const problemId = problem._id;

    setOpenNotes((prev) => {
      const next = !prev[problemId];

      if (next) {
        // auto-fill from DB progress when opening
        const existingNotes = problem?.progress?.notesMarkdown ?? "";
        const existingCode = getLastCodeFromProgress(problem);

        setDraftNotes((d) => ({
          ...d,
          [problemId]: d[problemId] ?? existingNotes,
        }));

        setDraftCode((d) => ({
          ...d,
          [problemId]: d[problemId] ?? existingCode,
        }));
      }

      return { ...prev, [problemId]: next };
    });
  };

  const saveNotesAndCode = (problemId) => {
    saveNotesMutation.mutate({
      problemId,
      notesMarkdown: draftNotes[problemId] ?? "",
      codeSnippet: {
        language: "js",
        label: "Solution",
        code: draftCode[problemId] ?? "",
      },
    });
  };

  const toggleSolved = (problemId, checked) => {
    if (checked) {
      // default rating = 3 days
      solveMutation.mutate({ problemId, selfRating: 3 });
    } else {
      resetMutation.mutate({ problemId });
    }
  };

  const copyCode = async (problemId) => {
    const code = draftCode[problemId] ?? "";
    if (!code.trim()) {
      toast.error("No code to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied ✅");
    } catch (e) {
      toast.error("Copy failed (browser blocked)");
    }
  };

  const clearCode = (problemId) => {
    setDraftCode((prev) => ({ ...prev, [problemId]: "" }));
    toast.success("Code cleared 🧹");
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">DSA Tracker</h1>
            <p className="mt-2 text-white/60">Solve and revise with SRS.</p>
          </div>

          <button
            onClick={clearFilters}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            Clear Filters
          </button>
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-semibold">Filters</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title/topic..."
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
            />

            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
            >
              {topics.map((t) => (
                <option key={t} value={t} className="bg-black text-white">
                  Topic: {t}
                </option>
              ))}
            </select>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
            >
              {difficulties.map((d) => (
                <option key={d} value={d} className="bg-black text-white">
                  Difficulty: {d}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
            >
              <option value="All" className="bg-black text-white">
                Status: All
              </option>
              <option value="Unsolved" className="bg-black text-white">
                Status: Unsolved
              </option>
              <option value="Solved" className="bg-black text-white">
                Status: Solved
              </option>
            </select>

            <button
              onClick={() => setRevisionOnly((v) => !v)}
              className={`w-full rounded-lg px-3 py-2 text-sm border transition ${
                revisionOnly
                  ? "bg-white text-black border-white"
                  : "bg-black/30 text-white border-white/10 hover:bg-white/10"
              }`}
            >
              Revision Due: {revisionOnly ? "ON" : "OFF"}
            </button>
          </div>

          <p className="mt-3 text-xs text-white/40">
            Showing <span className="font-semibold">{filteredProblems.length}</span> /{" "}
            <span className="font-semibold">{problems.length}</span> problems
          </p>
        </div>

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
                  <p className="text-sm font-medium">{r.problemId?.title}</p>
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
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">All Problems</h2>
            {revisionOnly && (
              <p className="text-xs text-white/40">
                Showing only revision-due problems
              </p>
            )}
          </div>

          {isLoading && <p className="mt-3 text-white/60">Loading...</p>}
          {isError && <p className="mt-3 text-red-400">Failed to load</p>}

          {!isLoading && filteredProblems.length === 0 && (
            <p className="mt-3 text-sm text-white/60">
              No problems match your filters.
            </p>
          )}

          <div className="mt-4 space-y-3">
            {filteredProblems.map((p) => {
              const isOpen = !!openNotes[p._id];
              const isSaving =
                saveNotesMutation.isPending &&
                saveNotesMutation.variables?.problemId === p._id;

              const solved = getSolvedFromProgress(p);
              const nextRev = getNextRevisionLabel(p);
              const lastSolved = getLastSolvedLabel(p);

              return (
                <div
                  key={p._id}
                  className="rounded-lg border border-white/10 bg-black/30 p-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={solved}
                        onChange={(e) => toggleSolved(p._id, e.target.checked)}
                        className="mt-1 h-4 w-4"
                        disabled={solveMutation.isPending || resetMutation.isPending}
                      />

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">{p.title}</p>

                          {solved && (
                            <span className="rounded bg-white text-black px-2 py-0.5 text-[10px] font-semibold">
                              SOLVED
                            </span>
                          )}

                          {revisionProblemIds.has(p._id) && (
                            <span className="rounded bg-white text-black px-2 py-0.5 text-[10px] font-semibold">
                              REVISION DUE
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-white/50">
                          {p.topic} • {p.difficulty}
                          {nextRev && (
                            <span className="ml-2 text-white/40">
                              • Next Rev:{" "}
                              <span className="text-white/60">{nextRev}</span>
                            </span>
                          )}
                          {lastSolved && (
                            <span className="ml-2 text-white/40">
                              • Last:{" "}
                              <span className="text-white/60">{lastSolved}</span>
                            </span>
                          )}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => toggleNotesPanel(p)}
                            className="text-xs rounded-md border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10 transition"
                          >
                            {isOpen ? "Hide Notes" : "Add Notes + Code"}
                          </button>
                        </div>
                      </div>
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

                  {(solveMutation.isPending || resetMutation.isPending) && (
                    <p className="mt-2 text-xs text-white/40">Saving...</p>
                  )}

                  {isOpen && (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={draftNotes[p._id] ?? ""}
                        onChange={(e) =>
                          setDraftNotes((prev) => ({
                            ...prev,
                            [p._id]: e.target.value,
                          }))
                        }
                        rows={4}
                        placeholder="Write notes (approach, edge cases, complexity)..."
                        className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
                      />

                      {/* ✅ Small toolbar */}
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs text-white/40">Code</p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyCode(p._id)}
                            className="text-xs rounded-md border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10 transition"
                          >
                            Copy
                          </button>

                          <button
                            onClick={() => clearCode(p._id)}
                            className="text-xs rounded-md border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10 transition"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <textarea
                        value={draftCode[p._id] ?? ""}
                        onChange={(e) =>
                          setDraftCode((prev) => ({
                            ...prev,
                            [p._id]: e.target.value,
                          }))
                        }
                        rows={8}
                        placeholder="Paste your code here..."
                        className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm font-mono outline-none"
                      />

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => saveNotesAndCode(p._id)}
                          disabled={isSaving}
                          className="text-xs rounded-md bg-white text-black px-3 py-1 font-medium disabled:opacity-60"
                        >
                          {isSaving ? "Saving..." : "Save"}
                        </button>

                        <p className="text-xs text-white/40">
                          Stored per-user in DB ✅
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}