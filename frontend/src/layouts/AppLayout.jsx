import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CommandPalette from "../components/CommandPalette";

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Ctrl+K / Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <CommandPalette open={open} onClose={() => setOpen(false)} />

      <div className="mx-auto max-w-5xl px-4 py-6">{children}</div>
    </div>
  );
}
