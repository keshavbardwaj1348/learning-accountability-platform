import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const commands = useMemo(
    () => [
      { label: "Go to Dashboard", path: "/dashboard" },
      { label: "Go to Daily Plan", path: "/daily" },
      { label: "Go to DSA Tracker", path: "/dsa" },
      { label: "Go to Analytics", path: "/analytics" },
    ],
    []
  );

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-24">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-black/90 backdrop-blur p-4">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command..."
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
        />

        <div className="mt-3 space-y-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-white/50 px-2 py-2">No results</p>
          ) : (
            filtered.map((cmd) => (
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

        <p className="mt-3 text-xs text-white/40">
          ESC to close • Enter not required • Ctrl+K to open
        </p>
      </div>
    </div>
  );
}
