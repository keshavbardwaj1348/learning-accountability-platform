// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function CommandPalette({ open, onClose }) {
//   const navigate = useNavigate();
//   const [query, setQuery] = useState("");

//   const commands = useMemo(
//     () => [
//       { label: "Go to Dashboard", path: "/dashboard" },
//       { label: "Go to Daily Plan", path: "/daily" },
//       { label: "Go to DSA Tracker", path: "/dsa" },
//       { label: "Go to Analytics", path: "/analytics" },
//     ],
//     []
//   );

//   const filtered = commands.filter((c) =>
//     c.label.toLowerCase().includes(query.toLowerCase())
//   );

//   useEffect(() => {
//     if (!open) return;
//     const handler = (e) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [open, onClose]);

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-24">
//       <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-black/90 backdrop-blur p-4">
//         <input
//           autoFocus
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Type a command..."
//           className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
//         />

//         <div className="mt-3 space-y-2">
//           {filtered.length === 0 ? (
//             <p className="text-sm text-white/50 px-2 py-2">No results</p>
//           ) : (
//             filtered.map((cmd) => (
//               <button
//                 key={cmd.path}
//                 onClick={() => {
//                   navigate(cmd.path);
//                   onClose();
//                 }}
//                 className="w-full text-left rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/80 hover:bg-white/10"
//               >
//                 {cmd.label}
//               </button>
//             ))
//           )}
//         </div>

//         <p className="mt-3 text-xs text-white/40">
//           ESC to close • Enter not required • Ctrl+K to open
//         </p>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function CommandPalette({ open, onClose }) {
//   const navigate = useNavigate();
//   const [query, setQuery] = useState("");

//   const commands = useMemo(
//     () => [
//       { label: "Go to Dashboard", path: "/dashboard" },
//       { label: "Go to Weekly Roadmap", path: "/roadmap" },
//       { label: "Go to Full Roadmap", path: "/roadmap-full" },
//       { label: "Go to DSA Tracker", path: "/dsa" },
//       { label: "Go to Analytics", path: "/analytics" },
//       { label: "Go to Settings", path: "/settings" },
//     ],
//     []
//   );

//   const filteredCommands = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return commands;
//     return commands.filter((c) => c.label.toLowerCase().includes(q));
//   }, [query, commands]);

//   useEffect(() => {
//     if (!open) return;

//     const handler = (e) => {
//       if (e.key === "Escape") {
//         onClose();
//         return;
//       }

//       // Enter → open first matched command
//       if (e.key === "Enter") {
//         const first = filteredCommands[0];
//         if (first) {
//           navigate(first.path);
//           onClose();
//         }
//       }
//     };

//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [open, onClose, filteredCommands, navigate]);

//   useEffect(() => {
//     if (!open) return;
//     setQuery("");
//   }, [open]);

//   if (!open) return null;

//   return (
//     <div
//       className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-24"
//       onMouseDown={(e) => {
//         // click outside closes
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-black/90 backdrop-blur p-4">
//         <input
//           autoFocus
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search or type a command..."
//           className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
//         />

//         <div className="mt-3">
//           <p className="px-2 text-xs text-white/40">Commands</p>

//           <div className="mt-2 space-y-2">
//             {filteredCommands.length === 0 ? (
//               <p className="text-sm text-white/50 px-2 py-2">No results</p>
//             ) : (
//               filteredCommands.map((cmd) => (
//                 <button
//                   key={cmd.path}
//                   onClick={() => {
//                     navigate(cmd.path);
//                     onClose();
//                   }}
//                   className="w-full text-left rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/80 hover:bg-white/10"
//                 >
//                   {cmd.label}
//                 </button>
//               ))
//             )}
//           </div>
//         </div>

//         <div className="mt-3 border-t border-white/10 pt-3">
//           <p className="text-xs text-white/40">
//             ESC to close • Enter opens first result • Ctrl+K to open
//           </p>
//           <p className="mt-1 text-[11px] text-white/30">
//             Next: search tasks + notes results inside this palette.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { globalSearchApi } from "../api/search";

export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const commands = useMemo(
    () => [
      { label: "Go to Dashboard", path: "/dashboard" },
      { label: "Go to Weekly Roadmap", path: "/roadmap" },
      { label: "Go to Full Roadmap", path: "/roadmap-full" },
      { label: "Go to DSA Tracker", path: "/dsa" },
      { label: "Go to Analytics", path: "/analytics" },
      { label: "Go to Settings", path: "/settings" },
    ],
    []
  );

  const filteredCommands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [query, commands]);

  // ✅ Global Search (backend)
  const trimmed = query.trim();
  const shouldSearch = trimmed.length >= 2;

  const { data: searchData, isFetching: isSearching } = useQuery({
    queryKey: ["global-search", trimmed],
    queryFn: () => globalSearchApi({ q: trimmed, limit: 10 }),
    enabled: open && shouldSearch,
  });

  const searchResults = searchData?.data?.results || [];

  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Enter opens first command if exists, else first search result
      if (e.key === "Enter") {
        if (filteredCommands[0]) {
          navigate(filteredCommands[0].path);
          onClose();
          return;
        }

        if (searchResults[0]) {
          const r = searchResults[0];
          navigate(`/daily/${r.weekNumber}/${r.dayNumber}`);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, filteredCommands, navigate, searchResults]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-24"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-black/90 backdrop-blur p-4">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks/notes or type a command..."
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
        />

        {/* Commands */}
        <div className="mt-3">
          <p className="px-2 text-xs text-white/40">Commands</p>

          <div className="mt-2 space-y-2">
            {filteredCommands.length === 0 ? (
              <p className="text-sm text-white/50 px-2 py-2">No commands</p>
            ) : (
              filteredCommands.map((cmd) => (
                <button
                  key={cmd.path}
                  onClick={() => {
                    navigate(cmd.path);
                    onClose();
                  }}
                  className="w-full text-left rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/80 hover:bg-white/10"
                >
                  {cmd.label}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="mt-4">
          <div className="flex items-center justify-between px-2">
            <p className="text-xs text-white/40">Search Results</p>
            {shouldSearch && (
              <p className="text-xs text-white/40">
                {isSearching ? "Searching..." : `${searchResults.length}`}
              </p>
            )}
          </div>

          <div className="mt-2 space-y-2">
            {!shouldSearch ? (
              <p className="text-sm text-white/40 px-2 py-2">
                Type at least 2 characters to search
              </p>
            ) : searchResults.length === 0 && !isSearching ? (
              <p className="text-sm text-white/50 px-2 py-2">No matches</p>
            ) : (
              searchResults.map((r) => (
                <button
                  key={`${r.taskKey}-${r.weekNumber}-${r.dayNumber}`}
                  onClick={() => {
                    navigate(`/daily/${r.weekNumber}/${r.dayNumber}`);
                    onClose();
                  }}
                  className="w-full text-left rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm hover:bg-white/10"
                >
                  <p className="text-white/90 font-medium">
                    {r.taskKey}
                    <span className="ml-2 text-xs text-white/40">
                      (W{r.weekNumber} D{r.dayNumber})
                    </span>
                  </p>

                  {r.notesPreview ? (
                    <p className="mt-1 text-xs text-white/50 line-clamp-2">
                      {r.notesPreview}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-white/30">
                      No notes preview
                    </p>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="mt-4 border-t border-white/10 pt-3">
          <p className="text-xs text-white/40">
            ESC to close • Enter opens first result • Ctrl+K to open
          </p>
        </div>
      </div>
    </div>
  );
}
